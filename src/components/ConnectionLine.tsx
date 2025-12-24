import { motion } from "framer-motion";

interface ConnectionLineProps {
  isConnected: boolean;
}

const ConnectionLine = ({ isConnected }: ConnectionLineProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 flex items-center justify-center pointer-events-none">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 120 80">
        {/* Glow filter */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(270 95% 65%)" />
            <stop offset="50%" stopColor="hsl(300 80% 60%)" />
            <stop offset="100%" stopColor="hsl(35 100% 60%)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection line */}
        <motion.path
          d="M 10 40 Q 60 20 110 40"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: isConnected ? 1 : 0, 
            opacity: isConnected ? 1 : 0 
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Animated pulse along the line */}
        {isConnected && (
          <motion.circle
            r="4"
            fill="hsl(0 0% 100%)"
            filter="url(#glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path="M 10 40 Q 60 20 110 40"
            />
          </motion.circle>
        )}

        {/* Sparkle particles */}
        {isConnected && [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            r="2"
            fill="hsl(35 100% 70%)"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.5,
              ease: "easeInOut" 
            }}
          >
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              begin={`${i * 0.5}s`}
              path="M 10 40 Q 60 20 110 40"
            />
          </motion.circle>
        ))}
      </svg>
    </div>
  );
};

export default ConnectionLine;