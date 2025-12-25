import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface ParticleFieldProps {
  isActive?: boolean;
  intensity?: "low" | "medium" | "high";
}

const ParticleField = ({ isActive = true, intensity = "medium" }: ParticleFieldProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const particleCount = intensity === "low" ? 15 : intensity === "medium" ? 30 : 50;

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const colors = [
      "hsl(270 95% 65%)", // violet
      "hsl(35 100% 60%)", // amber
      "hsl(300 80% 55%)", // pink
      "hsl(0 0% 100%)",   // white
    ];

    const initialParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
    }));

    setParticles(initialParticles);
  }, [isActive, particleCount]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Larger floating orbs */}
      {intensity !== "low" && (
        <>
          <motion.div
            className="absolute w-32 h-32 rounded-full"
            style={{
              left: "20%",
              top: "30%",
              background: "radial-gradient(circle, hsl(270 95% 65% / 0.1), transparent)",
              filter: "blur(20px)",
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-24 h-24 rounded-full"
            style={{
              right: "25%",
              top: "50%",
              background: "radial-gradient(circle, hsl(35 100% 60% / 0.08), transparent)",
              filter: "blur(15px)",
            }}
            animate={{
              y: [0, 15, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </>
      )}
    </div>
  );
};

export default ParticleField;
