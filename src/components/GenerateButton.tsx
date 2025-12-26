import { motion } from "framer-motion";
import { Sparkles, Plus, RotateCcw } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useState } from "react";

interface GenerateButtonProps {
  onGenerate: () => void;
  onAddFrame?: () => void;
  onReset: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

const GenerateButton = ({
  onGenerate,
  onAddFrame,
  onReset,
  isGenerating,
  disabled,
}: GenerateButtonProps) => {
  const { playSound } = useSoundEffects();
  const { triggerHaptic } = useHapticFeedback();
  const [pulseGenerate, setPulseGenerate] = useState(false);
  const [pulseAdd, setPulseAdd] = useState(false);
  const [pulseReset, setPulseReset] = useState(false);

  const handleGenerate = () => {
    if (!disabled && !isGenerating) {
      playSound("generate");
      triggerHaptic("heavy");
      setPulseGenerate(true);
      setTimeout(() => setPulseGenerate(false), 300);
      onGenerate();
    }
  };

  const handleAddFrame = () => {
    if (onAddFrame) {
      playSound("click");
      triggerHaptic("light");
      setPulseAdd(true);
      setTimeout(() => setPulseAdd(false), 300);
      onAddFrame();
    }
  };

  const handleReset = () => {
    playSound("reset");
    triggerHaptic("medium");
    setPulseReset(true);
    setTimeout(() => setPulseReset(false), 300);
    onReset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main buttons row */}
      <div className="flex items-center gap-3">
        {/* Generate button */}
        <motion.button
          onClick={handleGenerate}
          disabled={disabled || isGenerating}
          className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-mono tracking-wider text-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, hsl(250 25% 15%) 0%, hsl(250 25% 12%) 100%)",
            border: "1px solid hsl(250 20% 22%)",
          }}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          animate={pulseGenerate ? { scale: [1, 1.05, 1], boxShadow: ["0 0 0 hsl(270 95% 65% / 0)", "0 0 30px hsl(270 95% 65% / 0.5)", "0 0 0 hsl(270 95% 65% / 0)"] } : {}}
          transition={{ duration: 0.3 }}
        >
          {/* Hover gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(135deg, hsl(270 95% 65% / 0.1) 0%, hsl(35 100% 60% / 0.05) 100%)",
            }}
          />

          {/* Haptic pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={pulseGenerate ? { 
              boxShadow: ["inset 0 0 0 0 hsl(270 95% 65% / 0.5)", "inset 0 0 0 4px hsl(270 95% 65% / 0)", "inset 0 0 0 0 hsl(270 95% 65% / 0)"]
            } : {}}
            transition={{ duration: 0.4 }}
          />
          
          <motion.div
            animate={isGenerating ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          <span className="relative z-10 text-muted-foreground group-hover:text-foreground transition-colors">
            {isGenerating ? "GENERATING..." : "GENERATE"}
          </span>
        </motion.button>

        {/* Add frame button */}
        {onAddFrame && (
          <motion.button
            onClick={handleAddFrame}
            className="flex flex-col items-center justify-center p-4 rounded-xl font-mono text-xs tracking-wider group relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(250 25% 15%) 0%, hsl(250 25% 12%) 100%)",
              border: "1px solid hsl(250 20% 22%)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={pulseAdd ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.2 }}
          >
            {/* Haptic pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              animate={pulseAdd ? { 
                boxShadow: ["inset 0 0 0 0 hsl(270 95% 65% / 0.5)", "inset 0 0 0 3px hsl(270 95% 65% / 0)", "inset 0 0 0 0 hsl(270 95% 65% / 0)"]
              } : {}}
              transition={{ duration: 0.3 }}
            />
            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors mt-1">
              +1 FRAME
            </span>
          </motion.button>
        )}
      </div>

      {/* Reset button */}
      <motion.button
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 py-3 text-xs font-mono tracking-widest text-muted-foreground hover:text-foreground transition-colors relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={pulseReset ? { scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        {/* Haptic pulse effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={pulseReset ? { 
            background: ["hsl(270 95% 65% / 0)", "hsl(270 95% 65% / 0.1)", "hsl(270 95% 65% / 0)"]
          } : {}}
          transition={{ duration: 0.3 }}
        />
        <RotateCcw className="w-4 h-4" />
        RESET SYSTEM
      </motion.button>
    </motion.div>
  );
};

export default GenerateButton;
