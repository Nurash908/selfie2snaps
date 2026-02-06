import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingOrbsProps {
  intensity?: "low" | "medium" | "high";
}

const FloatingOrbs = ({ intensity = "medium" }: FloatingOrbsProps) => {
  const [orbs, setOrbs] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const orbCount = intensity === "low" ? 3 : intensity === "medium" ? 5 : 8;
    const colors = [
      "hsl(270 95% 65%)",
      "hsl(35 100% 60%)",
      "hsl(300 80% 60%)",
      "hsl(200 90% 60%)",
      "hsl(145 80% 55%)",
    ];

    const generatedOrbs = Array.from({ length: orbCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 80 + Math.random() * 100,
      color: colors[i % colors.length],
      duration: 20 + Math.random() * 15,
      delay: Math.random() * 5,
    }));

    setOrbs(generatedOrbs);
  }, [intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle at 30% 30%, ${orb.color}15, transparent 70%)`,
          }}
          animate={{
            x: [0, 80, -40, 60, 0],
            y: [0, -60, 40, -30, 0],
            opacity: [0.2, 0.4, 0.3, 0.5, 0.2],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingOrbs;
