import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProbabilityRingProps {
  percentage: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'warning';
}

export function ProbabilityRing({ 
  percentage, 
  label, 
  size = 'md',
  variant = 'primary' 
}: ProbabilityRingProps) {
  const sizes = {
    sm: { container: 'w-20 h-20', stroke: 6, text: 'text-lg' },
    md: { container: 'w-28 h-28', stroke: 8, text: 'text-2xl' },
    lg: { container: 'w-36 h-36', stroke: 10, text: 'text-3xl' },
  };

  const colors = {
    primary: { ring: 'stroke-primary', bg: 'stroke-primary/10' },
    secondary: { ring: 'stroke-secondary', bg: 'stroke-secondary/10' },
    warning: { ring: 'stroke-warning', bg: 'stroke-warning/10' },
  };

  const { container, stroke, text } = sizes[size];
  const { ring, bg } = colors[variant];
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative", container)}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className={bg}
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            className={ring}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className={cn("font-bold text-foreground", text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground font-medium text-center">{label}</span>
    </div>
  );
}
