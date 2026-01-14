import { motion } from "framer-motion";
import { RefreshCw, Camera } from "lucide-react";

interface TryAnotherButtonProps {
  onTryAnother: () => void;
  preserveSettings?: boolean;
}

const TryAnotherButton = ({ onTryAnother, preserveSettings = true }: TryAnotherButtonProps) => {
  return (
    <motion.button
      onClick={onTryAnother}
      className="group relative px-6 py-3 rounded-xl font-mono text-sm tracking-wider flex items-center gap-3 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(250 30% 18%), hsl(250 25% 12%))",
        border: "1px solid hsl(35 100% 60% / 0.3)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        borderColor: "hsl(35 100% 60% / 0.6)",
        boxShadow: "0 8px 32px hsl(35 100% 55% / 0.2)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: "radial-gradient(circle at center, hsl(35 100% 60% / 0.1), transparent 70%)",
        }}
      />

      {/* Rotating camera icon */}
      <motion.div
        className="relative z-10"
        whileHover={{ rotate: 15 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Camera className="w-5 h-5 text-secondary" />
      </motion.div>

      {/* Button text */}
      <span className="relative z-10 text-foreground">Try Another Selfie</span>

      {/* Spinning refresh indicator */}
      <motion.div
        className="relative z-10"
        animate={{ rotate: 360 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <RefreshCw className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
      </motion.div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(35 100% 60% / 0.15) 50%, transparent 100%)",
        }}
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 4,
        }}
      />

      {/* Tooltip showing what's preserved */}
      {preserveSettings && (
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: "hsl(250 25% 10% / 0.9)",
            backdropFilter: "blur(4px)",
          }}
        >
          Style & settings preserved ✓
        </motion.div>
      )}
    </motion.button>
  );
};

export default TryAnotherButton;
