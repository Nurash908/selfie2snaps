import { motion } from "framer-motion";
import { Shuffle, Sparkles } from "lucide-react";

interface QuickRegenerateButtonProps {
  onRegenerate: (randomStyle: string) => void;
  isGenerating?: boolean;
}

const STYLES = [
  "natural",
  "cinematic",
  "anime",
  "sketch",
  "vintage",
  "neon",
  "watercolor",
  "pop-art",
];

const QuickRegenerateButton = ({
  onRegenerate,
  isGenerating = false,
}: QuickRegenerateButtonProps) => {
  const handleClick = () => {
    if (isGenerating) return;
    
    // Pick a random style
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
    onRegenerate(randomStyle);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isGenerating}
      className="px-5 py-3 rounded-xl font-mono text-sm tracking-wider flex items-center gap-2 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: "linear-gradient(135deg, hsl(180 70% 40%), hsl(200 80% 45%))",
        boxShadow: "0 8px 24px hsl(180 70% 40% / 0.3)",
      }}
      whileHover={
        isGenerating
          ? {}
          : {
              scale: 1.05,
              boxShadow: "0 12px 32px hsl(180 70% 40% / 0.5)",
            }
      }
      whileTap={isGenerating ? {} : { scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.2) 50%, transparent 100%)",
        }}
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />

      {isGenerating ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
          <span className="relative z-10 text-white">Generating...</span>
        </>
      ) : (
        <>
          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Shuffle className="w-4 h-4 text-white" />
          </motion.div>
          <span className="relative z-10 text-white">Quick Remix</span>
          <motion.span
            className="text-white/70 text-xs"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎲
          </motion.span>
        </>
      )}
    </motion.button>
  );
};

export default QuickRegenerateButton;
