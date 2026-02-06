import { motion } from "framer-motion";

const BananaLogo = () => {
  return (
    <motion.div
      className="relative flex items-center justify-center mb-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Single orbiting ring */}
      <motion.div
        className="absolute w-32 h-32 rounded-full border border-muted-foreground/20"
        style={{ borderStyle: "dashed" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Banana emoji - simple float only */}
      <motion.div
        className="relative z-10 text-6xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          filter: "drop-shadow(0 0 15px hsl(48 100% 50% / 0.4))",
        }}
      >
        🍌
      </motion.div>
    </motion.div>
  );
};

export default BananaLogo;
