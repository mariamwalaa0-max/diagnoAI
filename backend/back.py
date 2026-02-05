from __future__ import annotations

import json
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# =========================================================
# Paths (عدّليهم لو مساراتك مختلفة)
# =========================================================
STAGE1_MODEL_PATH = "./cbc_stage1_model.joblib"
STAGE2_MODEL_PATH = "./cbc_stage2_model.joblib"
STAGE2_LABEL_ENCODER_PATH = "./cbc_stage2_label_encoder.joblib"

FEATURE_COLUMNS_PATH = "./cbc_feature_columns.joblib"
FEATURE_MEDIANS_PATH = "./cbc_feature_medians.joblib"

INDICATORS_ONTOLOGY_PATH = "./cbc_indicators_ontology.json"
CONFIRMATORY_TESTS_PATH = "./confirmatory_tests.json"

# =========================================================
# API Schemas
# =========================================================
Flag = str  # LOW | NORMAL | HIGH | UNKNOWN


class PredictRequest(BaseModel):
    cbc_values: Dict[str, float] = Field(
        ...,
        description="Structured CBC numeric values. Can be canonical keys or common aliases (HGB/HCT/PLT/Neut%...).",
    )
    cbc_flags: Optional[Dict[str, Flag]] = Field(
        default=None,
        description="Optional lab flags per feature: LOW/NORMAL/HIGH/UNKNOWN. If omitted, UNKNOWN will be used.",
    )
    context: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional context (symptoms flags etc.) e.g. {'active_bleeding_symptoms_reported': true}",
    )
    top_k: int = Field(default=3, ge=1, le=5)


class PredictResponse(BaseModel):
    stage1: Dict[str, Any]
    top_predictions: List[Dict[str, Any]]
    ontology_support: List[Dict[str, Any]]
    urgent_attention: Dict[str, Any]
    recommended_tests: List[Dict[str, Any]]
    disclaimer: str


# =========================================================
# Feature mapping (matches your model columns exactly)
# =========================================================
MODEL_COLS = [
    "wbc",
    "rbc",
    "hemoglobin",
    "hematocrit",
    "mcv",
    "mch",
    "mchc",
    "platelets",
    "lymp_pct",
    "neut_pct",
    "lymp_abs",
    "neut_abs",
]

ALIASES = {
    # core
    "wbc": ["wbc", "white_blood_cells", "whitebloodcells", "wbc_count"],
    "rbc": ["rbc", "red_blood_cells", "redbloodcells", "rbc_count"],
    "hemoglobin": ["hemoglobin", "hgb", "hb"],
    "hematocrit": ["hematocrit", "hct"],
    "mcv": ["mcv"],
    "mch": ["mch"],
    "mchc": ["mchc"],
    "platelets": ["platelets", "plt", "platelet_count"],
    # differential %
    "lymp_pct": [
        "lymp_pct",
        "lymph_pct",
        "lymphocytes_percent",
        "lymphocytes%",
        "lymph_%",
        "lymph%",
        "lymphs_pct",
    ],
    "neut_pct": ["neut_pct", "neutrophils_percent", "neutrophils%", "neut_%", "neut%", "neutro_pct"],
    # absolute counts
    "lymp_abs": ["lymp_abs", "lymph_abs", "lymphocytes_abs", "absolute_lymphocytes", "lymphocytes_absolute", "alc"],
    "neut_abs": ["neut_abs", "neutrophils_abs", "absolute_neutrophils", "neutrophils_absolute", "anc"],
}


def _norm(s: str) -> str:
    return (
        s.strip()
        .lower()
        .replace(" ", "_")
        .replace("-", "_")
        .replace("/", "_")
        .replace("%", "pct")
    )


ALIAS_TO_CANON: Dict[str, str] = {}
for canon, names in ALIASES.items():
    for n in names:
        ALIAS_TO_CANON[_norm(n)] = canon


def map_input_to_model_features(raw_values: Dict[str, Any]) -> Dict[str, float]:
    """
    Converts user keys -> canonical model keys.
    Ignores unknown keys.
    """
    out: Dict[str, float] = {}
    for k, v in (raw_values or {}).items():
        nk = _norm(str(k))
        canon = ALIAS_TO_CANON.get(nk)

        # small heuristics
        if canon is None:
            canon = ALIAS_TO_CANON.get(nk.replace("percent", "pct"))

        if canon is None:
            continue

        try:
            out[canon] = float(v)
        except Exception:
            continue
    return out


def build_feature_vector(raw_values: Dict[str, Any], feature_columns: List[str], medians: Dict[str, float]) -> pd.DataFrame:
    """
    - Map raw inputs -> canonical columns
    - Create a 1-row dataframe with exactly the required feature_columns
    - Fill missing with medians
    """
    mapped = map_input_to_model_features(raw_values)
    row: Dict[str, float] = {}

    for col in feature_columns:
        if col in mapped:
            row[col] = mapped[col]
        else:
            row[col] = float(medians.get(col, 0.0))

    df = pd.DataFrame([row], columns=feature_columns)
    df = df.apply(pd.to_numeric, errors="coerce").fillna(0.0)
    return df


# =========================================================
# Flags helpers (for ontology)
# =========================================================
def normalize_flag(val: Any) -> str:
    v = str(val).strip().upper()
    return v if v in {"LOW", "NORMAL", "HIGH", "UNKNOWN"} else "UNKNOWN"


def get_flag(flags: Optional[Dict[str, Flag]], feature: str) -> str:
    if not flags:
        return "UNKNOWN"

    # try raw
    if feature in flags:
        return normalize_flag(flags[feature])

    # normalized key
    nf = _norm(feature)
    if nf in flags:
        return normalize_flag(flags[nf])

    # alias -> canon
    canon = ALIAS_TO_CANON.get(nf)
    if canon and canon in flags:
        return normalize_flag(flags[canon])

    return "UNKNOWN"


# =========================================================
# Ontology engine
# =========================================================
def compute_derived_indicators(ontology: Dict[str, Any], flags: Optional[Dict[str, Flag]]) -> Dict[str, bool]:
    """
    Minimal interpreter for the derived_indicators logic in your ontology.
    Expected logic format:
      [{"if_flag": {"hemoglobin":"LOW"}, "then": true}, {"else": false}]
    """
    derived: Dict[str, bool] = {}
    for ind_name, ind_def in ontology.get("derived_indicators", {}).items():
        logic = ind_def.get("logic", [])
        result = False
        for step in logic:
            if "if_flag" in step:
                conds = step["if_flag"]
                ok = True
                for feat, needed in conds.items():
                    if get_flag(flags, feat) != normalize_flag(needed):
                        ok = False
                        break
                if ok:
                    result = bool(step.get("then", True))
                    break
            if "else" in step:
                result = bool(step["else"])
        derived[ind_name] = result
    return derived


def score_condition_support(
    rule: Dict[str, Any],
    derived: Dict[str, bool],
    flags: Optional[Dict[str, Flag]],
) -> Tuple[int, List[str], List[str], str]:
    scoring = rule.get("support_scoring", {})
    score = 0
    supports: List[str] = []
    contradictions: List[str] = []

    for item in scoring.get("support_indicators", []):
        if "indicator" in item:
            name = item["indicator"]
            if derived.get(name, False):
                score += int(item.get("weight", 0))
                supports.append(name)
        elif "feature_flag" in item:
            ff = item["feature_flag"]
            ok = True
            for feat, needed in ff.items():
                if get_flag(flags, feat) != normalize_flag(needed):
                    ok = False
                    break
            if ok:
                score += int(item.get("weight", 0))
                supports.append(f"flag:{ff}")

    for item in scoring.get("contradictions", []):
        if "indicator" in item:
            name = item["indicator"]
            if derived.get(name, False):
                score += int(item.get("weight", 0))  # negative expected
                contradictions.append(name)
        elif "feature_flag" in item:
            ff = item["feature_flag"]
            ok = True
            for feat, needed in ff.items():
                if get_flag(flags, feat) != normalize_flag(needed):
                    ok = False
                    break
            if ok:
                score += int(item.get("weight", 0))  # negative expected
                contradictions.append(f"flag:{ff}")

    level = "NO_SUPPORT"
    levels = scoring.get("support_levels", [])
    levels_sorted = sorted(levels, key=lambda x: int(x.get("min_score", -999)), reverse=True)
    for lv in levels_sorted:
        if score >= int(lv.get("min_score", -999)):
            level = lv.get("level", "NO_SUPPORT")
            break

    return score, supports, contradictions, level


def urgent_attention(
    ontology: Dict[str, Any],
    values_mapped: Dict[str, float],
    flags: Optional[Dict[str, Flag]],
    context: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Uses:
      - ontology default urgent output
      - ontology flag-based rules
      - conservative numeric fallback thresholds for demo safety (optional)
    """
    rules = ontology.get("urgent_attention_rules", {})
    out = (rules.get("default_urgent_output") or {}).copy()
    out.setdefault("urgent_flag", False)
    out.setdefault("reasons", [])
    out.setdefault("suggested_action", "Seek urgent medical care if severe symptoms exist.")

    symptoms = context or {}

    # flag-based rules
    for r in rules.get("flag_based_urgent_rules", []):
        cond = r.get("if", {})
        ok = True
        for feat, needed in cond.items():
            if get_flag(flags, feat) != normalize_flag(needed):
                ok = False
                break
        if not ok:
            continue

        and_any = r.get("and_any", [])
        if and_any and not any(bool(symptoms.get(x, False)) for x in and_any):
            continue

        then = r.get("then", {})
        if then.get("urgent_flag") is True:
            out["urgent_flag"] = True
            out["reasons"].append(then.get("reason", r.get("name", "urgent_rule")))

    # numeric fallback (optional - remove if you want strict flag-only)
    hb = values_mapped.get("hemoglobin")
    plt = values_mapped.get("platelets")
    wbc = values_mapped.get("wbc")

    if hb is not None and hb < 7.0:
        out["urgent_flag"] = True
        out["reasons"].append("Very low hemoglobin (Hb < 7 g/dL) may be urgent depending on symptoms.")
    if plt is not None and plt < 20.0:
        out["urgent_flag"] = True
        out["reasons"].append("Very low platelets (PLT < 20) may increase bleeding risk.")
    if wbc is not None and (wbc < 2.0 or wbc > 30.0):
        out["urgent_flag"] = True
        out["reasons"].append("Extreme WBC values may require urgent evaluation.")

    return out


def recommended_tests_from_indicators(ontology: Dict[str, Any], derived: Dict[str, bool]) -> List[Dict[str, Any]]:
    recs: List[Dict[str, Any]] = []
    for block in ontology.get("recommended_tests_by_indicator", []):
        when_any = block.get("when_any_indicators_true", [])
        if any(derived.get(ind, False) for ind in when_any):
            for t in block.get("tests", []):
                recs.append(t)

    recs.sort(key=lambda x: int(x.get("priority", 99)))
    seen = set()
    out = []
    for t in recs:
        name = t.get("test")
        if not name or name in seen:
            continue
        seen.add(name)
        out.append(t)
    return out


# =========================================================
# App + Lifespan loading (no deprecated on_event)
# =========================================================
ARTIFACTS: Dict[str, Any] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        ARTIFACTS["stage1_model"] = joblib.load(STAGE1_MODEL_PATH)
        ARTIFACTS["stage2_model"] = joblib.load(STAGE2_MODEL_PATH)
        ARTIFACTS["label_encoder"] = joblib.load(STAGE2_LABEL_ENCODER_PATH)

        ARTIFACTS["feature_columns"] = joblib.load(FEATURE_COLUMNS_PATH)
        ARTIFACTS["feature_medians"] = joblib.load(FEATURE_MEDIANS_PATH)

        with open(INDICATORS_ONTOLOGY_PATH, "r", encoding="utf-8") as f:
            ARTIFACTS["indicators_ontology"] = json.load(f)
        with open(CONFIRMATORY_TESTS_PATH, "r", encoding="utf-8") as f:
            ARTIFACTS["confirmatory_tests"] = json.load(f)

        # Optional sanity check
        cols = list(ARTIFACTS["feature_columns"])
        if cols != MODEL_COLS:
            print("WARNING: Loaded feature_columns != expected MODEL_COLS")
            print("Loaded :", cols)
            print("Expect :", MODEL_COLS)

        print("✅ Artifacts loaded successfully")
    except Exception as e:
        raise RuntimeError(f"Failed to load artifacts: {e}")

    yield

    ARTIFACTS.clear()
    print("🧹 Artifacts cleared")


app = FastAPI(
    title="CBC Decision Support API",
    version="1.0",
    lifespan=lifespan,
)


@app.get("/health")
def health():
    return {"status": "ok", "loaded": list(ARTIFACTS.keys())}


# =========================================================
# Predict Endpoint
# =========================================================
@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if not ARTIFACTS:
        raise HTTPException(status_code=500, detail="Artifacts not loaded.")

    feature_columns: List[str] = list(ARTIFACTS["feature_columns"])
    medians: Dict[str, float] = ARTIFACTS["feature_medians"]

    # mapped values (canonical)
    values_mapped = map_input_to_model_features(req.cbc_values)

    X = build_feature_vector(req.cbc_values, feature_columns, medians)

    stage1_model = ARTIFACTS["stage1_model"]
    stage2_model = ARTIFACTS["stage2_model"]
    le = ARTIFACTS["label_encoder"]

    # ---- Stage 1
    try:
        stage1_pred = int(stage1_model.predict(X)[0])
        stage1_conf = None
        if hasattr(stage1_model, "predict_proba"):
            stage1_conf = float(np.max(stage1_model.predict_proba(X)[0]))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stage1 failed: {e}")

    # NOTE: Assumption: stage1_pred == 1 means clinically significant CBC.
    # If your model uses opposite mapping, flip this line:
    clinically_significant = (stage1_pred == 1)

    stage1_out = {
        "clinically_significant_cbc": bool(clinically_significant),
        "confidence": stage1_conf,
        "note": "Screening only (CBC findings significance). Not a diagnosis.",
    }

    # ---- Stage 2 (Top-K)
    top_preds: List[Dict[str, Any]] = []
    if clinically_significant:
        try:
            probs = stage2_model.predict_proba(X)[0]
            idxs = np.argsort(probs)[::-1][: req.top_k]

            if hasattr(stage2_model, "classes_"):
                raw = stage2_model.classes_
                picked = [raw[i] for i in idxs]
                if len(picked) and isinstance(picked[0], (int, np.integer)) and hasattr(le, "inverse_transform"):
                    labels = le.inverse_transform(np.array(picked))
                else:
                    labels = picked
            else:
                labels = le.inverse_transform(idxs)

            for rank, (i, label) in enumerate(zip(idxs, labels), start=1):
                top_preds.append(
                    {
                        "rank": rank,
                        "condition": str(label),
                        "probability": float(probs[i]),
                        "probability_percent": round(float(probs[i]) * 100, 2),
                    }
                )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Stage2 failed: {e}")
    else:
        top_preds = [
            {"rank": 1, "condition": "healthy", "probability": 1.0, "probability_percent": 100.0}
        ]

    # ---- Ontology: indicators + support scoring
    ontology = ARTIFACTS["indicators_ontology"]
    derived = compute_derived_indicators(ontology, req.cbc_flags)

    support_results: List[Dict[str, Any]] = []
    for rule in ontology.get("pattern_support_rules", []):
        cond = rule.get("condition", "UNKNOWN_CONDITION")
        score, supports, contradictions, level = score_condition_support(rule, derived, req.cbc_flags)
        support_results.append(
            {
                "condition": cond,
                "support_score": score,
                "support_level": level,
                "supporting_indicators": supports,
                "contradictions": contradictions,
            }
        )

    # ---- Urgency
    urgent = urgent_attention(ontology, values_mapped, req.cbc_flags, req.context)

    # ---- Recommended tests:
    confirm_map: Dict[str, List[Dict[str, Any]]] = ARTIFACTS["confirmatory_tests"]
    tests: List[Dict[str, Any]] = []

    # A) condition-based tests (from confirmatory_tests.json)
    for p in top_preds:
        key = _norm(p["condition"])
        candidates = [key, key.replace(" ", "_"), key.replace("/", "_")]
        for cand in candidates:
            if cand in confirm_map:
                tests.extend(confirm_map[cand])
                break

    # B) indicator-based tests (complement)
    tests.extend(recommended_tests_from_indicators(ontology, derived))

    # sort & deduplicate by test name
    tests.sort(key=lambda x: int(x.get("priority", 99)))
    seen = set()
    uniq_tests = []
    for t in tests:
        nm = t.get("test")
        if not nm or nm in seen:
            continue
        seen.add(nm)
        uniq_tests.append(t)

    return PredictResponse(
        stage1=stage1_out,
        top_predictions=top_preds,
        ontology_support=support_results,
        urgent_attention=urgent,
        recommended_tests=uniq_tests,
        disclaimer=ontology.get(
            "global_disclaimer",
            "This analysis is for clinical decision support only and must be reviewed by a qualified healthcare professional.",
        ),
    )