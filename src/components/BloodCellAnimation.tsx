import { motion } from 'framer-motion';

interface BloodCellProps {
  className?: string;
}

export function BloodCellAnimation({ className = '' }: BloodCellProps) {
  const cells = [
    { type: 'rbc', color: 'bg-destructive/80', size: 'w-16 h-16', delay: 0, x: 0, y: 0 },
    { type: 'rbc', color: 'bg-destructive/60', size: 'w-12 h-12', delay: 0.5, x: 60, y: -30 },
    { type: 'rbc', color: 'bg-destructive/70', size: 'w-14 h-14', delay: 1, x: -50, y: 40 },
    { type: 'wbc', color: 'bg-primary/50', size: 'w-10 h-10', delay: 1.5, x: 80, y: 50 },
    { type: 'platelet', color: 'bg-warning/60', size: 'w-6 h-6', delay: 2, x: -70, y: -50 },
    { type: 'platelet', color: 'bg-warning/50', size: 'w-5 h-5', delay: 2.5, x: 40, y: 70 },
    { type: 'rbc', color: 'bg-destructive/50', size: 'w-10 h-10', delay: 0.8, x: -80, y: -20 },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-primary/10 to-accent/20 rounded-full blur-3xl animate-pulse-glow" />
      
      {/* Blood cells */}
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {cells.map((cell, index) => (
          <motion.div
            key={index}
            className={`absolute ${cell.size} ${cell.color} rounded-full`}
            style={{
              left: '50%',
              top: '50%',
              marginLeft: cell.x,
              marginTop: cell.y,
              boxShadow: cell.type === 'rbc' ? 'inset 0 0 20px rgba(0,0,0,0.2)' : 'none',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -10, 0, 10, 0],
              x: [0, 5, 0, -5, 0],
            }}
            transition={{
              delay: cell.delay,
              duration: 0.5,
              y: {
                delay: cell.delay + 0.5,
                duration: 4 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
              x: {
                delay: cell.delay + 0.5,
                duration: 5 + index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            {/* Inner shadow for RBC concave look */}
            {cell.type === 'rbc' && (
              <div className="absolute inset-2 rounded-full bg-black/10" />
            )}
          </motion.div>
        ))}

        {/* Data transformation particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-secondary/60 rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.cos(i * 45 * Math.PI / 180) * 120],
              y: [0, Math.sin(i * 45 * Math.PI / 180) * 120],
            }}
            transition={{
              delay: 2 + i * 0.2,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Central analysis icon */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg"
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 1, duration: 0.8, type: "spring" }}
        >
          <svg className="w-10 h-10 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
