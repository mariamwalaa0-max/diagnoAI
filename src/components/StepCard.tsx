import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepCardProps {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  isLast?: boolean;
}

export function StepCard({ step, icon: Icon, title, description, isLast = false }: StepCardProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Connector Line */}
      {!isLast && (
        <div className="hidden md:block absolute top-12 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: step * 0.3, duration: 0.5 }}
            className="w-full h-full bg-gradient-to-r from-secondary to-secondary/30 origin-left"
          />
        </div>
      )}

      {/* Step Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: step * 0.15, duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        {/* Icon Circle */}
        <div className="relative mb-6">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: step * 0.2, type: "spring", stiffness: 200 }}
            className={cn(
              "w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg",
              step % 2 === 1
                ? "bg-gradient-to-br from-primary to-primary/80"
                : "bg-gradient-to-br from-secondary to-accent"
            )}
          >
            <Icon className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          
          {/* Step Number Badge */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-foreground">{step}</span>
          </div>
        </div>

        {/* Text */}
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
          {description}
        </p>
      </motion.div>
    </div>
  );
}
