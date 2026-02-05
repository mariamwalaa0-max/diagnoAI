import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FlaskConical, Brain, AlertTriangle } from 'lucide-react';
import { ProbabilityRing } from './ProbabilityRing';
import { cn } from '@/lib/utils';

interface ConfirmatoryTest {
  name: string;
  reason: string;
}

interface Prediction {
  condition: string;
  probability: number;
  keyFeatures: string[];
  reasoning: string;
  confirmatoryTests: ConfirmatoryTest[];
}

interface ResultCardProps {
  prediction: Prediction;
  rank: number;
  index: number;
}

export function ResultCard({ prediction, rank, index }: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(rank === 1);

  const variants = {
    1: 'primary' as const,
    2: 'secondary' as const,
    3: 'warning' as const,
  };

  const variant = variants[rank as keyof typeof variants] || 'primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={cn(
        "medical-card overflow-hidden",
        rank === 1 && "ring-2 ring-primary/30"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center gap-6 text-left hover:bg-muted/30 transition-colors"
      >
        <ProbabilityRing
          percentage={prediction.probability}
          label=""
          size="sm"
          variant={variant}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              rank === 1 && "bg-primary/10 text-primary",
              rank === 2 && "bg-secondary/10 text-secondary",
              rank === 3 && "bg-warning/10 text-warning"
            )}>
              #{rank} Most Probable
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground truncate">
            {prediction.condition}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6 border-t border-border">
              {/* Key Features */}
              <div className="pt-6">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Brain className="w-4 h-4 text-primary" />
                  Key CBC Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.keyFeatures.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Reasoning */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <AlertTriangle className="w-4 h-4 text-secondary" />
                  Clinical Reasoning
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
                  {prediction.reasoning}
                </p>
              </div>

              {/* Confirmatory Tests */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <FlaskConical className="w-4 h-4 text-accent" />
                  Recommended Confirmatory Tests
                </h4>
                <div className="space-y-3">
                  {prediction.confirmatoryTests.map((test, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">{i + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{test.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{test.reason}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
