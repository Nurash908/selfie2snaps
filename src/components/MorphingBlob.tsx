import { motion } from "framer-motion";

interface MorphingBlobProps {
  color?: string;
  size?: number;
  className?: string;
}

const MorphingBlob = ({ 
  color = "hsl(270 95% 65%)", 
  size = 200,
  className = "",
}: MorphingBlobProps) => {
  const blobVariants = {
    animate: {
      borderRadius: [
        "60% 40% 30% 70% / 60% 30% 70% 40%",
        "30% 60% 70% 40% / 50% 60% 30% 60%",
        "50% 50% 30% 60% / 40% 50% 70% 50%",
        "40% 60% 60% 40% / 60% 40% 40% 60%",
        "60% 40% 30% 70% / 60% 30% 70% 40%",
      ],
      scale: [1, 1.1, 1.05, 1.15, 1],
      rotate: [0, 90, 180, 270, 360],
    },
  };

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}10)`,
        filter: "blur(40px)",
      }}
      variants={blobVariants}
      animate="animate"
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default MorphingBlob;
