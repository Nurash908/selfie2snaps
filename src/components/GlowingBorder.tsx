import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowingBorderProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

const GlowingBorder = ({ 
  children, 
  className = "",
  colors = ["hsl(270 95% 65%)", "hsl(35 100% 60%)", "hsl(300 80% 60%)"],
  speed = 3
}: GlowingBorderProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated border gradient - single layer only */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl opacity-75"
        style={{
          background: `linear-gradient(90deg, ${colors.join(", ")}, ${colors[0]})`,
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative rounded-2xl overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};

export default GlowingBorder;
