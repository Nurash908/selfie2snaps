import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface Point {
  x: number;
  y: number;
  delay: number;
  size: number;
}

interface Connection {
  from: number;
  to: number;
  delay: number;
}

const NeuralConstellation = () => {
  const [phase, setPhase] = useState(0);

  // Generate constellation points
  const { points, connections } = useMemo(() => {
    const pts: Point[] = [];
    const conns: Connection[] = [];

    // Create two face silhouettes
    // Left face
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI + Math.PI / 2;
      pts.push({
        x: 25 + Math.cos(angle) * 18,
        y: 50 + Math.sin(angle) * 25,
        delay: i * 0.05,
        size: 1.5 + Math.random() * 0.5,
      });
    }

    // Right face
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI - Math.PI / 2;
      pts.push({
        x: 75 + Math.cos(angle) * 18,
        y: 50 + Math.sin(angle) * 25,
        delay: 0.6 + i * 0.05,
        size: 1.5 + Math.random() * 0.5,
      });
    }

    // Bridge points between faces
    for (let i = 0; i < 8; i++) {
      pts.push({
        x: 35 + i * 5,
        y: 45 + Math.sin(i * 0.8) * 8,
        delay: 1.2 + i * 0.08,
        size: 1 + Math.random() * 0.5,
      });
    }

    // Random ambient points
    for (let i = 0; i < 20; i++) {
      pts.push({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        delay: 1.8 + Math.random() * 0.5,
        size: 0.5 + Math.random() * 0.8,
      });
    }

    // Create connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dist = Math.sqrt(
          Math.pow(pts[i].x - pts[j].x, 2) + Math.pow(pts[i].y - pts[j].y, 2)
        );
        if (dist < 20 && Math.random() > 0.4) {
          conns.push({ from: i, to: j, delay: Math.max(pts[i].delay, pts[j].delay) });
        }
      }
    }

    return { points: pts, connections: conns };
  }, []);

  // Cycle through loading phases
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadingTexts = [
    "Analyzing faces...",
    "Mapping connections...",
    "Fusing moments...",
    "Creating magic...",
  ];

  return (
    <motion.div
      className="relative w-80 h-80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, transparent 40%, hsl(270 95% 65% / 0.1) 60%, transparent 70%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <filter id="constellationGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur1" />
            <feGaussianBlur stdDeviation="2" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(270 95% 65%)" />
            <stop offset="100%" stopColor="hsl(35 100% 60%)" />
          </linearGradient>

          <radialGradient id="pointGrad">
            <stop offset="0%" stopColor="hsl(0 0% 100%)" />
            <stop offset="50%" stopColor="hsl(35 100% 70%)" />
            <stop offset="100%" stopColor="hsl(270 95% 65%)" />
          </radialGradient>
        </defs>

        {/* Connection lines with staggered animation */}
        {connections.map((conn, i) => {
          const from = points[conn.from];
          const to = points[conn.to];
          return (
            <motion.line
              key={`line-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#lineGrad)"
              strokeWidth="0.3"
              strokeOpacity="0.4"
              filter="url(#constellationGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ delay: conn.delay, duration: 0.4 }}
            />
          );
        })}

        {/* Points with pulse effect */}
        {points.map((point, i) => (
          <motion.g key={`point-${i}`}>
            {/* Outer glow */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={point.size * 3}
              fill="hsl(270 95% 65%)"
              opacity={0.2}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 0.3, 0.1] }}
              transition={{
                delay: point.delay,
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            {/* Main point */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={point.size}
              fill="url(#pointGrad)"
              filter="url(#constellationGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.3, 1],
                opacity: [0, 1, 0.9],
              }}
              transition={{
                delay: point.delay,
                duration: 0.5,
              }}
            />
          </motion.g>
        ))}

        {/* Central pulsing core */}
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          fill="hsl(270 95% 65%)"
          opacity={0.3}
          filter="url(#constellationGlow)"
          animate={{
            r: [8, 15, 8],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="5"
          fill="url(#pointGrad)"
          filter="url(#constellationGlow)"
          animate={{
            r: [5, 7, 5],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orbiting particles */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`orbit-${i}`}
            r="2"
            fill={i === 0 ? "hsl(270 95% 65%)" : i === 1 ? "hsl(35 100% 60%)" : "hsl(300 80% 60%)"}
            filter="url(#constellationGlow)"
            animate={{
              cx: [50 + Math.cos((i * 2 * Math.PI) / 3) * 30, 50 + Math.cos((i * 2 * Math.PI) / 3 + Math.PI) * 30],
              cy: [50 + Math.sin((i * 2 * Math.PI) / 3) * 30, 50 + Math.sin((i * 2 * Math.PI) / 3 + Math.PI) * 30],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}
      </svg>

      {/* Loading text with phase animation */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.p
          key={phase}
          className="text-sm font-medium tracking-widest uppercase"
          style={{
            background: "linear-gradient(90deg, hsl(270 95% 75%), hsl(35 100% 70%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {loadingTexts[phase]}
        </motion.p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-3">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: i <= phase ? "hsl(270 95% 65%)" : "hsl(0 0% 30%)",
              }}
              animate={{
                scale: i === phase ? [1, 1.5, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: i === phase ? Infinity : 0 }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NeuralConstellation;
