import { motion } from "framer-motion";

const BananaLogo = () => {
  return (
    <motion.div
      className="relative flex items-center justify-center mb-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Orbiting ring */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border border-muted-foreground/20"
        style={{
          borderStyle: "dashed",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Second orbiting ring */}
      <motion.div
        className="absolute w-40 h-20 rounded-full border border-muted-foreground/10"
        style={{
          transform: "rotateX(60deg)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Banana emoji with glow */}
      <motion.div
        className="relative z-10 text-6xl"
        animate={{
          y: [0, -10, 0],
          rotateY: [0, 180, 360],
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          filter: "drop-shadow(0 0 20px hsl(48 100% 50% / 0.6))",
          transformStyle: "preserve-3d",
        }}
      >
        🍌
      </motion.div>

      {/* Glow effect behind */}
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(48 100% 50% / 0.3), transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default BananaLogo;
