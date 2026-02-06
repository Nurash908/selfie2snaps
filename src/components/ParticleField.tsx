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

  const particleCount = intensity === "low" ? 8 : intensity === "medium" ? 15 : 25;

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const colors = [
      "hsl(270 95% 65%)",
      "hsl(35 100% 60%)",
      "hsl(300 80% 55%)",
      "hsl(0 0% 100%)",
    ];

    const initialParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
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
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;
