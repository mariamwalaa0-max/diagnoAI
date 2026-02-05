import type {
  PredictRequest,
  PredictResponse,
  HealthResponse,
  Flag,
} from "@/types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Check API health status
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new ApiError("Health check failed", response.status);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to connect to API server");
  }
}

/**
 * Determine flag based on value and normal range
 */
function determineFlag(
  value: number,
  normalMin: number,
  normalMax: number
): Flag {
  if (value < normalMin) return "LOW";
  if (value > normalMax) return "HIGH";
  return "NORMAL";
}

/**
 * Map frontend field names to backend canonical names
 */
const fieldMapping: Record<string, string> = {
  wbc: "wbc",
  rbc: "rbc",
  hemoglobin: "hemoglobin",
  hematocrit: "hematocrit",
  platelets: "platelets",
  mcv: "mcv",
  mch: "mch",
  mchc: "mchc",
  rdw: "rdw", // Note: RDW not in backend MODEL_COLS, will be ignored
  neutrophils: "neut_pct",
  lymphocytes: "lymp_pct",
  monocytes: "monocytes", // Not in backend MODEL_COLS
  eosinophils: "eosinophils", // Not in backend MODEL_COLS
  basophils: "basophils", // Not in backend MODEL_COLS
};

/**
 * Normal ranges for determining flags
 */
const normalRanges: Record<
  string,
  { normalMin: number; normalMax: number }
> = {
  wbc: { normalMin: 4.5, normalMax: 11.0 },
  rbc: { normalMin: 4.5, normalMax: 5.5 },
  hemoglobin: { normalMin: 12, normalMax: 17 },
  hematocrit: { normalMin: 36, normalMax: 50 },
  platelets: { normalMin: 150, normalMax: 400 },
  mcv: { normalMin: 80, normalMax: 100 },
  mch: { normalMin: 27, normalMax: 33 },
  mchc: { normalMin: 32, normalMax: 36 },
  rdw: { normalMin: 11.5, normalMax: 14.5 },
  neutrophils: { normalMin: 40, normalMax: 70 },
  lymphocytes: { normalMin: 20, normalMax: 40 },
  monocytes: { normalMin: 2, normalMax: 8 },
  eosinophils: { normalMin: 1, normalMax: 4 },
  basophils: { normalMin: 0, normalMax: 1 },
};

/**
 * Submit CBC values for analysis
 */
export async function analyzeCBC(
  values: Record<string, string>,
  context?: Record<string, any>
): Promise<PredictResponse> {
  try {
    // Convert string values to numbers and map to backend field names
    const cbc_values: Record<string, number> = {};
    const cbc_flags: Record<string, Flag> = {};

    for (const [key, value] of Object.entries(values)) {
      if (!value || value.trim() === "") continue;

      const numValue = parseFloat(value);
      if (isNaN(numValue)) continue;

      const backendKey = fieldMapping[key] || key;
      cbc_values[backendKey] = numValue;

      // Determine flag based on normal range
      const range = normalRanges[key];
      if (range) {
        cbc_flags[backendKey] = determineFlag(
          numValue,
          range.normalMin,
          range.normalMax
        );
      }
    }

    if (Object.keys(cbc_values).length === 0) {
      throw new ApiError("No valid CBC values provided");
    }

    const requestBody: PredictRequest = {
      cbc_values,
      cbc_flags,
      context,
      top_k: 3,
    };

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || "Failed to analyze CBC values",
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}

export { ApiError };
