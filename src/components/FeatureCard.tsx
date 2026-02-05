import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  variant?: 'default' | 'accent';
}

export function FeatureCard({ icon: Icon, title, description, index, variant = 'default' }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        "medical-card p-6 md:p-8 group",
        variant === 'accent' && "border-secondary/30"
      )}
    >
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110",
        variant === 'default' 
          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
          : "bg-gradient-to-br from-secondary to-accent text-secondary-foreground"
      )}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
