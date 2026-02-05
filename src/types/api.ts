// TypeScript types matching the backend API models

export type Flag = "LOW" | "NORMAL" | "HIGH" | "UNKNOWN";

export interface PredictRequest {
  cbc_values: Record<string, number>;
  cbc_flags?: Record<string, Flag>;
  context?: Record<string, any>;
  top_k?: number;
}

export interface Stage1Result {
  clinically_significant_cbc: boolean;
  confidence: number | null;
  note: string;
}

export interface TopPrediction {
  rank: number;
  condition: string;
  probability: number;
  probability_percent: number;
}

export interface OntologySupport {
  condition: string;
  support_score: number;
  support_level: string;
  supporting_indicators: string[];
  contradictions: string[];
}

export interface UrgentAttention {
  urgent_flag: boolean;
  reasons: string[];
  suggested_action: string;
}

export interface RecommendedTest {
  test: string;
  reason: string;
  priority?: number;
  turnaround_time?: string;
  cost?: string;
}

export interface PredictResponse {
  stage1: Stage1Result;
  top_predictions: TopPrediction[];
  ontology_support: OntologySupport[];
  urgent_attention: UrgentAttention;
  recommended_tests: RecommendedTest[];
  disclaimer: string;
}

export interface HealthResponse {
  status: string;
  loaded: string[];
}
