import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  progress: number;
  status: string;
}

const ProgressIndicator = ({ progress, status }: ProgressIndicatorProps) => {
  return (
    <motion.div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <motion.div
        className="px-6 py-3 rounded-2xl backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, hsl(0 0% 10% / 0.9), hsl(0 0% 8% / 0.95))',
          border: '1px solid hsl(0 0% 20%)',
          boxShadow: `0 10px 40px hsl(0 0% 0% / 0.3), 0 0 ${progress}px hsl(270 95% 65% / ${progress / 200})`,
        }}
      >
        <div className="flex items-center gap-4">
          {/* Animated circle indicator */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              {/* Background circle */}
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="hsl(0 0% 20%)"
                strokeWidth="3"
                fill="none"
              />
              {/* Progress circle */}
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                stroke="url(#progressGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  strokeDasharray: 125.6,
                  strokeDashoffset: 125.6 * (1 - progress / 100),
                }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(270 95% 65%)" />
                  <stop offset="50%" stopColor="hsl(300 80% 60%)" />
                  <stop offset="100%" stopColor="hsl(35 100% 60%)" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center percentage */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              key={progress}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, hsl(270 95% 75%), hsl(35 100% 70%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {progress}%
              </span>
            </motion.div>
          </div>

          {/* Status text */}
          <div className="flex flex-col">
            <motion.span
              className="text-sm font-medium text-foreground"
              key={status}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {status}
            </motion.span>
            <span className="text-xs text-muted-foreground">
              {progress < 100 ? 'Processing...' : 'Complete!'}
            </span>
          </div>

          {/* Animated dots */}
          {progress < 100 && (
            <div className="flex gap-1 ml-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressIndicator;
