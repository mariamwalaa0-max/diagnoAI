import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { analyzeCBC, ApiError } from "@/services/api";
import type { PredictResponse } from "@/types/api";

interface CBCField {
  name: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  placeholder: string;
  required?: boolean;
}

const cbcFields: CBCField[] = [
  {
    name: "wbc",
    label: "WBC",
    unit: "×10³/µL",
    min: 0.1,
    max: 100,
    normalMin: 4.5,
    normalMax: 11.0,
    placeholder: "4.5-11.0",
    required: true,
  },
  {
    name: "rbc",
    label: "RBC",
    unit: "×10⁶/µL",
    min: 1,
    max: 10,
    normalMin: 4.5,
    normalMax: 5.5,
    placeholder: "4.5-5.5",
  },
  {
    name: "hemoglobin",
    label: "Hemoglobin",
    unit: "g/dL",
    min: 1,
    max: 25,
    normalMin: 12,
    normalMax: 17,
    placeholder: "12-17",
    required: true,
  },
  {
    name: "hematocrit",
    label: "Hematocrit",
    unit: "%",
    min: 10,
    max: 70,
    normalMin: 36,
    normalMax: 50,
    placeholder: "36-50",
  },
  {
    name: "platelets",
    label: "Platelets",
    unit: "×10³/µL",
    min: 10,
    max: 1000,
    normalMin: 150,
    normalMax: 400,
    placeholder: "150-400",
    required: true,
  },
  {
    name: "mcv",
    label: "MCV",
    unit: "fL",
    min: 50,
    max: 150,
    normalMin: 80,
    normalMax: 100,
    placeholder: "80-100",
    required: true,
  },
  {
    name: "mch",
    label: "MCH",
    unit: "pg",
    min: 15,
    max: 45,
    normalMin: 27,
    normalMax: 33,
    placeholder: "27-33",
  },
  {
    name: "mchc",
    label: "MCHC",
    unit: "g/dL",
    min: 25,
    max: 40,
    normalMin: 32,
    normalMax: 36,
    placeholder: "32-36",
  },
  {
    name: "rdw",
    label: "RDW",
    unit: "%",
    min: 10,
    max: 25,
    normalMin: 11.5,
    normalMax: 14.5,
    placeholder: "11.5-14.5",
  },
  {
    name: "neutrophils",
    label: "Neutrophils",
    unit: "%",
    min: 0,
    max: 100,
    normalMin: 40,
    normalMax: 70,
    placeholder: "40-70",
  },
  {
    name: "lymphocytes",
    label: "Lymphocytes",
    unit: "%",
    min: 0,
    max: 100,
    normalMin: 20,
    normalMax: 40,
    placeholder: "20-40",
  },
  {
    name: "monocytes",
    label: "Monocytes",
    unit: "%",
    min: 0,
    max: 30,
    normalMin: 2,
    normalMax: 8,
    placeholder: "2-8",
  },
  {
    name: "eosinophils",
    label: "Eosinophils",
    unit: "%",
    min: 0,
    max: 30,
    normalMin: 1,
    normalMax: 4,
    placeholder: "1-4",
  },
  {
    name: "basophils",
    label: "Basophils",
    unit: "%",
    min: 0,
    max: 10,
    normalMin: 0,
    normalMax: 1,
    placeholder: "0-1",
  },
];

export function CBCInputForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateField = (field: CBCField, value: string): string | null => {
    if (!value.trim()) {
      return field.required ? "This field is required" : null;
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "Invalid number";
    if (numValue < field.min || numValue > field.max) {
      return `Value must be between ${field.min} and ${field.max}`;
    }
    return null;
  };

  const isOutOfRange = (field: CBCField, value: string): boolean => {
    if (!value.trim()) return false;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    return numValue < field.normalMin || numValue > field.normalMax;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasValues = false;

    cbcFields.forEach((field) => {
      const error = validateField(field, values[field.name] || "");
      if (error) newErrors[field.name] = error;
      if (values[field.name]?.trim()) hasValues = true;
    });

    if (!hasValues) {
      // Logic checked required fields individually, but if everything is empty and no required fields were triggered (unlikely given the new logic),
      // we might want a general error. However, with individual required fields, we might not need this "at least one" check if required fields exist.
      // But if the user didn't touch anything, errors won't show up until submit validation runs, which we are doing here.
    }
    
    // If no specific field errors but literally nothing was entered (e.g. all optional?), ensure we have something?
    // Actually, if required fields are present, validation will fail.
    // If we only have optional fields provided, that's fine? Logic implies at least required ones must be there.
    // So we can remove the "at least one" check if we trust the required fields check.
    // But let's keep a sanity check if we want to ensure meaningful analysis.
    // For now, let's rely on the field validation.

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      // Call the actual backend API
      const result: PredictResponse = await analyzeCBC(values);

      // Navigate to results with the API response
      navigate("/results", {
        state: { analysisResult: result, cbcValues: values },
      });
    } catch (error) {
      console.error("Analysis failed:", error);

      if (error instanceof ApiError) {
        setErrors({ general: error.message });
      } else {
        setErrors({
          general:
            "Failed to analyze CBC values. Please ensure the backend server is running on port 8000.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{errors.general}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cbcFields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="space-y-2"
          >
            <label className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </span>
              <span className="text-muted-foreground text-xs">
                {field.unit}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={values[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={cn(
                  "input-medical w-full font-mono text-sm",
                  errors[field.name] &&
                    "border-destructive focus:border-destructive focus:ring-destructive/20",
                  isOutOfRange(field, values[field.name] || "") &&
                    !errors[field.name] &&
                    "border-warning focus:border-warning focus:ring-warning/20",
                )}
              />
              {isOutOfRange(field, values[field.name] || "") &&
                !errors[field.name] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <div
                      className="w-2 h-2 bg-warning rounded-full"
                      title="Outside normal range"
                    />
                  </motion.div>
                )}
            </div>
            {errors[field.name] && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-destructive"
              >
                {errors[field.name]}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="w-2 h-2 bg-warning rounded-full" />
          Values outside normal range are highlighted
        </p>
        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze CBC
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
