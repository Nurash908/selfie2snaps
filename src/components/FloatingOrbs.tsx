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
    const orbCount = intensity === "low" ? 5 : intensity === "medium" ? 8 : 12;
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
      size: 60 + Math.random() * 120,
      color: colors[i % colors.length],
      duration: 15 + Math.random() * 20,
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
            background: `radial-gradient(circle at 30% 30%, ${orb.color}20, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, 100, -50, 80, 0],
            y: [0, -80, 60, -40, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
            opacity: [0.3, 0.5, 0.4, 0.6, 0.3],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Central gradient pulse */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(270 95% 65% / 0.05), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default FloatingOrbs;
