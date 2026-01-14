import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, RotateCcw, Zap, Stars, Wand2 } from "lucide-react";
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
  const [showParticles, setShowParticles] = useState(false);

  const handleGenerate = () => {
    if (!disabled && !isGenerating) {
      playSound("generate");
      triggerHaptic("heavy");
      setPulseGenerate(true);
      setShowParticles(true);
      setTimeout(() => setPulseGenerate(false), 500);
      setTimeout(() => setShowParticles(false), 1500);
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

  // Generate particle positions
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * 360,
    delay: i * 0.05,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main buttons row */}
      <div className="flex items-center gap-3">
        {/* Generate button - Premium Design */}
        <motion.button
          onClick={handleGenerate}
          disabled={disabled || isGenerating}
          className="flex-1 flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-mono tracking-wider text-sm relative overflow-hidden group disabled:cursor-not-allowed"
          style={{
            background: isGenerating 
              ? "linear-gradient(135deg, hsl(270 95% 45%) 0%, hsl(300 80% 50%) 50%, hsl(35 100% 50%) 100%)"
              : disabled 
                ? "hsl(250 25% 12%)"
                : "linear-gradient(135deg, hsl(270 95% 55% / 0.2) 0%, hsl(300 80% 50% / 0.15) 50%, hsl(35 100% 55% / 0.2) 100%)",
            border: disabled ? "1px solid hsl(250 20% 18%)" : "1px solid hsl(270 95% 65% / 0.4)",
            boxShadow: isGenerating 
              ? "0 0 50px hsl(270 95% 65% / 0.6), 0 0 100px hsl(270 95% 65% / 0.3), inset 0 0 30px hsl(270 95% 65% / 0.2)"
              : disabled 
                ? "none"
                : "0 0 30px hsl(270 95% 65% / 0.2), 0 8px 32px hsl(0 0% 0% / 0.4)",
          }}
          whileHover={disabled ? {} : { 
            scale: 1.02, 
            y: -3,
            boxShadow: "0 0 50px hsl(270 95% 65% / 0.4), 0 12px 40px hsl(0 0% 0% / 0.5)"
          }}
          whileTap={disabled ? {} : { scale: 0.98 }}
          animate={pulseGenerate ? { 
            scale: [1, 1.08, 1], 
            boxShadow: [
              "0 0 0 hsl(270 95% 65% / 0)", 
              "0 0 80px hsl(270 95% 65% / 0.9), 0 0 150px hsl(35 100% 60% / 0.5)", 
              "0 0 30px hsl(270 95% 65% / 0.4)"
            ] 
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Premium glow border effect */}
          {!disabled && !isGenerating && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, hsl(270 95% 65% / 0.3), hsl(35 100% 60% / 0.2), hsl(300 80% 50% / 0.3))",
                backgroundSize: "200% 200%",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Animated background gradient when generating */}
          {isGenerating && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, hsl(270 95% 55% / 0.4) 0%, hsl(35 100% 55% / 0.4) 50%, hsl(270 95% 55% / 0.4) 100%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Premium shimmer sweep */}
          {!disabled && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 0%, transparent 40%, hsl(0 0% 100% / 0.15) 50%, transparent 60%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
            />
          )}

          {/* Haptic pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={pulseGenerate ? { 
              boxShadow: [
                "inset 0 0 0 0 hsl(270 95% 65% / 0.8)", 
                "inset 0 0 0 8px hsl(270 95% 65% / 0)", 
                "inset 0 0 0 0 hsl(270 95% 65% / 0)"
              ]
            } : {}}
            transition={{ duration: 0.7 }}
          />

          {/* Particle explosion */}
          <AnimatePresence>
            {showParticles && (
              <>
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: particle.id % 2 === 0 ? "hsl(270 95% 65%)" : "hsl(35 100% 60%)",
                      left: "50%",
                      top: "50%",
                      boxShadow: `0 0 15px ${particle.id % 2 === 0 ? "hsl(270 95% 65%)" : "hsl(35 100% 60%)"}`,
                    }}
                    initial={{ x: "-50%", y: "-50%", scale: 0, opacity: 1 }}
                    animate={{ 
                      x: `calc(-50% + ${Math.cos(particle.angle * Math.PI / 180) * 100}px)`,
                      y: `calc(-50% + ${Math.sin(particle.angle * Math.PI / 180) * 100}px)`,
                      scale: [0, 1.8, 0],
                      opacity: [1, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, delay: particle.delay, ease: "easeOut" }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          
          {/* Icon with enhanced animations */}
          <motion.div
            animate={isGenerating ? { 
              rotate: 360,
              scale: [1, 1.3, 1],
            } : {}}
            transition={{ 
              rotate: { duration: 0.8, repeat: isGenerating ? Infinity : 0, ease: "linear" },
              scale: { duration: 0.5, repeat: isGenerating ? Infinity : 0, ease: "easeInOut" },
            }}
            className="relative"
          >
            {isGenerating ? (
              <Wand2 className="w-6 h-6 text-foreground" />
            ) : (
              <motion.div
                animate={disabled ? {} : { 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
              </motion.div>
            )}
            {/* Icon glow */}
            {isGenerating && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, hsl(270 95% 65% / 0.6), transparent)" }}
                animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
          </motion.div>

          <div className="flex flex-col items-start relative z-10">
            <span className={`font-bold text-base ${
              isGenerating 
                ? "text-foreground" 
                : disabled 
                  ? "text-muted-foreground/50"
                  : "text-foreground group-hover:text-secondary"
            } transition-colors`}>
              {isGenerating ? "Creating Magic..." : "Create My Snap ✨"}
            </span>
            {!isGenerating && !disabled && (
              <motion.span 
                className="text-[10px] text-muted-foreground group-hover:text-primary/80 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Turn your selfie into AI art
              </motion.span>
            )}
          </div>

          {/* Floating stars when idle and enabled */}
          {!disabled && !isGenerating && (
            <>
              <motion.div
                className="absolute top-3 left-6"
                animate={{ y: [0, -5, 0], opacity: [0.3, 0.7, 0.3], rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Stars className="w-3 h-3 text-secondary/60" />
              </motion.div>
              <motion.div
                className="absolute bottom-3 right-16"
                animate={{ y: [0, -4, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <Zap className="w-3 h-3 text-primary/60" />
              </motion.div>
            </>
          )}

          {/* Floating stars when generating */}
          {isGenerating && (
            <>
              <motion.div
                className="absolute top-2 left-8"
                animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Stars className="w-4 h-4 text-secondary" />
              </motion.div>
              <motion.div
                className="absolute bottom-2 right-12"
                animate={{ y: [0, -8, 0], opacity: [0.3, 0.9, 0.3], rotate: [0, -180, -360] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <Zap className="w-4 h-4 text-primary" />
              </motion.div>
            </>
          )}
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
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            animate={pulseAdd ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.2 }}
          >
            {/* Glow on hover */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: "radial-gradient(circle at center, hsl(270 95% 65% / 0.2), transparent 70%)",
              }}
            />
            {/* Haptic pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              animate={pulseAdd ? { 
                boxShadow: ["inset 0 0 0 0 hsl(270 95% 65% / 0.5)", "inset 0 0 0 3px hsl(270 95% 65% / 0)", "inset 0 0 0 0 hsl(270 95% 65% / 0)"]
              } : {}}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors mt-1">
              +1 FRAME
            </span>
          </motion.button>
        )}
      </div>

      {/* Reset button */}
      <motion.button
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 py-3 text-xs font-mono tracking-widest text-muted-foreground hover:text-foreground transition-colors relative overflow-hidden rounded-xl group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={pulseReset ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        {/* Background reveal on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
          style={{ background: "hsl(0 70% 50% / 0.1)" }}
        />
        {/* Haptic pulse effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          animate={pulseReset ? { 
            background: ["hsl(0 70% 50% / 0)", "hsl(0 70% 50% / 0.15)", "hsl(0 70% 50% / 0)"]
          } : {}}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          whileHover={{ rotate: -360 }}
          transition={{ duration: 0.5 }}
        >
          <RotateCcw className="w-4 h-4" />
        </motion.div>
        <span className="relative z-10">RESET WORKSPACE</span>
      </motion.button>
    </motion.div>
  );
};

export default GenerateButton;
