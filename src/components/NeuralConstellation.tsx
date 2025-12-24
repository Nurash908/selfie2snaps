import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Point {
  x: number;
  y: number;
  delay: number;
}

const NeuralConstellation = () => {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    // Generate constellation points in a face-like pattern
    const facePoints: Point[] = [];
    
    // Left face silhouette
    for (let i = 0; i < 8; i++) {
      facePoints.push({
        x: 20 + Math.sin(i * 0.4) * 10,
        y: 20 + i * 8,
        delay: i * 0.1
      });
    }

    // Right face silhouette
    for (let i = 0; i < 8; i++) {
      facePoints.push({
        x: 80 - Math.sin(i * 0.4) * 10,
        y: 20 + i * 8,
        delay: i * 0.1 + 0.8
      });
    }

    // Connecting points
    for (let i = 0; i < 5; i++) {
      facePoints.push({
        x: 35 + i * 8,
        y: 50 + Math.random() * 10,
        delay: 1.5 + i * 0.1
      });
    }

    setPoints(facePoints);
  }, []);

  return (
    <motion.div
      className="relative w-64 h-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <filter id="constellationGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {points.map((point, i) => {
          if (i === 0) return null;
          const prevPoint = points[i - 1];
          return (
            <motion.line
              key={`line-${i}`}
              x1={prevPoint.x}
              y1={prevPoint.y}
              x2={point.x}
              y2={point.y}
              stroke="hsl(270 95% 65%)"
              strokeWidth="0.3"
              strokeOpacity="0.5"
              filter="url(#constellationGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ delay: point.delay, duration: 0.3 }}
            />
          );
        })}

        {/* Points */}
        {points.map((point, i) => (
          <motion.circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r="1.5"
            fill="hsl(35 100% 70%)"
            filter="url(#constellationGlow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 1],
              opacity: [0, 1, 0.8]
            }}
            transition={{ 
              delay: point.delay,
              duration: 0.4,
            }}
          />
        ))}

        {/* Pulsing center */}
        <motion.circle
          cx="50"
          cy="50"
          r="3"
          fill="hsl(270 95% 65%)"
          filter="url(#constellationGlow)"
          animate={{
            r: [3, 5, 3],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>

      {/* Loading text */}
      <motion.p
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm font-medium text-muted-foreground tracking-widest"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        FUSING MOMENTS...
      </motion.p>
    </motion.div>
  );
};

export default NeuralConstellation;