import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConnectionLineProps {
  isConnected: boolean;
}

const ConnectionLine = ({ isConnected }: ConnectionLineProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number }>>([]);

  useEffect(() => {
    if (isConnected) {
      // Create multiple particles
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        delay: i * 0.3,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isConnected]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-24 flex items-center justify-center pointer-events-none">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 160 100">
        <defs>
          {/* Animated gradient */}
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(270 95% 65%)">
              <animate
                attributeName="stop-color"
                values="hsl(270 95% 65%); hsl(300 80% 60%); hsl(270 95% 65%)"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="hsl(300 80% 60%)">
              <animate
                attributeName="stop-color"
                values="hsl(300 80% 60%); hsl(35 100% 60%); hsl(300 80% 60%)"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="hsl(35 100% 60%)">
              <animate
                attributeName="stop-color"
                values="hsl(35 100% 60%); hsl(270 95% 65%); hsl(35 100% 60%)"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          {/* Enhanced glow filter */}
          <filter id="energyGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle glow */}
          <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background subtle line */}
        <motion.path
          d="M 15 50 C 50 25, 110 25, 145 50"
          fill="none"
          stroke="hsl(0 0% 20%)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: isConnected ? 0.3 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Main energy line */}
        <motion.path
          d="M 15 50 C 50 25, 110 25, 145 50"
          fill="none"
          stroke="url(#flowGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#energyGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isConnected ? 1 : 0,
            opacity: isConnected ? 1 : 0,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Secondary pulsing line */}
        <motion.path
          d="M 15 50 C 50 25, 110 25, 145 50"
          fill="none"
          stroke="hsl(0 0% 100%)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 8"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isConnected ? [0.2, 0.5, 0.2] : 0,
            strokeDashoffset: [0, -24],
          }}
          transition={{
            opacity: { duration: 1.5, repeat: Infinity },
            strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" },
          }}
        />

        {/* Energy particles flowing along path */}
        {isConnected &&
          particles.map((particle) => (
            <motion.g key={particle.id}>
              {/* Outer glow */}
              <motion.circle
                r="8"
                fill="hsl(270 95% 65% / 0.3)"
                filter="url(#particleGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              >
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${particle.delay}s`}
                  path="M 15 50 C 50 25, 110 25, 145 50"
                />
              </motion.circle>

              {/* Inner bright core */}
              <motion.circle
                r="3"
                fill="hsl(0 0% 100%)"
                filter="url(#particleGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              >
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${particle.delay}s`}
                  path="M 15 50 C 50 25, 110 25, 145 50"
                />
              </motion.circle>
            </motion.g>
          ))}

        {/* Center fusion point */}
        {isConnected && (
          <motion.g>
            <motion.circle
              cx="80"
              cy="35"
              r="6"
              fill="hsl(300 80% 60%)"
              filter="url(#energyGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.circle
              cx="80"
              cy="35"
              r="3"
              fill="hsl(0 0% 100%)"
              initial={{ scale: 0 }}
              animate={{ scale: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.g>
        )}

        {/* Endpoint glows */}
        {isConnected && (
          <>
            <motion.circle
              cx="15"
              cy="50"
              r="4"
              fill="hsl(270 95% 65%)"
              filter="url(#particleGlow)"
              initial={{ scale: 0 }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="145"
              cy="50"
              r="4"
              fill="hsl(35 100% 60%)"
              filter="url(#particleGlow)"
              initial={{ scale: 0 }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </svg>

      {/* Connection status text */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: isConnected ? 1 : 0,
          y: isConnected ? 0 : -10,
        }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Connected
        </span>
      </motion.div>
    </div>
  );
};

export default ConnectionLine;
