import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Download,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import type { PredictResponse } from "@/types/api";

// Transform API data to match the UI component expectations
interface UIPrediction {
  condition: string;
  probability: number;
  keyFeatures: string[];
  reasoning: string;
  confirmatoryTests: { name: string; reason: string }[];
}

function transformApiResponse(apiData: PredictResponse): {
  predictions: UIPrediction[];
  urgent: boolean;
  urgentReasons: string[];
  disclaimer: string;
} {
  const predictions: UIPrediction[] = apiData.top_predictions.map((pred) => {
    // Find ontology support for this condition
    const support = apiData.ontology_support.find(
      (s) => s.condition.toLowerCase() === pred.condition.toLowerCase(),
    );

    // Get key features from supporting indicators
    const keyFeatures = support?.supporting_indicators || [];

    // Build reasoning from support level and indicators
    let reasoning = `This condition shows a ${pred.probability_percent.toFixed(1)}% probability based on the CBC pattern analysis.`;

    if (support) {
      reasoning += ` Ontology support level: ${support.support_level} (score: ${support.support_score}).`;

      if (support.supporting_indicators.length > 0) {
        reasoning += ` Key indicators: ${support.supporting_indicators.join(", ")}.`;
      }

      if (support.contradictions.length > 0) {
        reasoning += ` Note: Some contradictory indicators were found: ${support.contradictions.join(", ")}.`;
      }
    }

    // Get confirmatory tests for this condition
    const confirmatoryTests = apiData.recommended_tests
      .filter((test) => test.priority && test.priority <= 3)
      .map((test) => ({
        name: test.test,
        reason: test.reason,
      }));

    return {
      condition: pred.condition,
      probability: pred.probability_percent,
      keyFeatures:
        keyFeatures.length > 0 ? keyFeatures : ["CBC pattern analysis"],
      reasoning,
      confirmatoryTests:
        confirmatoryTests.length > 0
          ? confirmatoryTests
          : [
              {
                name: "No specific tests recommended",
                reason: "Standard follow-up with healthcare provider",
              },
            ],
    };
  });

  return {
    predictions,
    urgent: apiData.urgent_attention.urgent_flag,
    urgentReasons: apiData.urgent_attention.reasons,
    disclaimer: apiData.disclaimer,
  };
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState<UIPrediction[]>([]);
  const [urgent, setUrgent] = useState(false);
  const [urgentReasons, setUrgentReasons] = useState<string[]>([]);
  const [disclaimer, setDisclaimer] = useState("");

  useEffect(() => {
    // Check if we have analysis results from the API
    const apiResult = location.state?.analysisResult as
      | PredictResponse
      | undefined;

    if (!apiResult) {
      navigate("/analyze");
      return;
    }

    // Transform the API data for the UI
    try {
      const transformed = transformApiResponse(apiResult);
      setPredictions(transformed.predictions);
      setUrgent(transformed.urgent);
      setUrgentReasons(transformed.urgentReasons);
      setDisclaimer(transformed.disclaimer);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to process results:", error);
      navigate("/analyze");
    }
  }, [location.state, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <section className="section-padding min-h-[calc(100vh-5rem)] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
              </div>
              <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-secondary/20 animate-ping" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Analyzing CBC Results
            </h2>
            <p className="text-muted-foreground">
              AI is processing patterns and generating predictions...
            </p>
          </motion.div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-medical max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/analyze">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Analysis
                </Link>
              </Button>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Analysis Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Based on the provided CBC values, our AI has identified the
              following most probable conditions with supporting reasoning.
            </p>
          </motion.div>

          {/* Urgent Attention Banner */}
          {urgent && urgentReasons.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-destructive/10 border-2 border-destructive/50 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-destructive mb-2 text-lg">
                    Urgent Attention Required
                  </h3>
                  <ul className="space-y-1">
                    {urgentReasons.map((reason, idx) => (
                      <li key={idx} className="text-sm text-foreground">
                        • {reason}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3 font-medium">
                    Please consult with a healthcare professional immediately.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          <div className="space-y-4 mb-8">
            {predictions.map((prediction, index) => (
              <ResultCard
                key={prediction.condition}
                prediction={prediction}
                rank={index + 1}
                index={index}
              />
            ))}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <Button variant="hero" asChild className="flex-1">
              <Link to="/analyze">
                <RotateCcw className="w-4 h-4" />
                New Analysis
              </Link>
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-6 bg-warning/10 border border-warning/20 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-warning shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Important Medical Disclaimer
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {disclaimer ||
                    "These results are generated by an AI system designed for clinical decision support only. " +
                      "The predictions and recommendations should be evaluated by qualified healthcare professionals " +
                      "in the context of the patient's complete clinical picture. This system does not replace " +
                      "professional medical judgment and should never be used as a standalone diagnostic tool."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
