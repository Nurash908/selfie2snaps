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
        {/* Generate button */}
        <motion.button
          onClick={handleGenerate}
          disabled={disabled || isGenerating}
          className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-mono tracking-wider text-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isGenerating 
              ? "linear-gradient(135deg, hsl(270 95% 45%) 0%, hsl(300 80% 50%) 50%, hsl(35 100% 50%) 100%)"
              : "linear-gradient(135deg, hsl(250 25% 15%) 0%, hsl(250 25% 12%) 100%)",
            border: "1px solid hsl(250 20% 22%)",
            boxShadow: isGenerating 
              ? "0 0 40px hsl(270 95% 65% / 0.5), 0 0 80px hsl(270 95% 65% / 0.3)"
              : "none",
          }}
          whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          animate={pulseGenerate ? { 
            scale: [1, 1.08, 1], 
            boxShadow: [
              "0 0 0 hsl(270 95% 65% / 0)", 
              "0 0 60px hsl(270 95% 65% / 0.8), 0 0 120px hsl(35 100% 60% / 0.4)", 
              "0 0 20px hsl(270 95% 65% / 0.3)"
            ] 
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Animated background gradient when generating */}
          {isGenerating && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, hsl(270 95% 55% / 0.3) 0%, hsl(35 100% 55% / 0.3) 50%, hsl(270 95% 55% / 0.3) 100%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Hover gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(135deg, hsl(270 95% 65% / 0.15) 0%, hsl(35 100% 60% / 0.1) 100%)",
            }}
          />

          {/* Shine sweep effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
            style={{
              background: "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.2) 50%, transparent 100%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          />

          {/* Haptic pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={pulseGenerate ? { 
              boxShadow: [
                "inset 0 0 0 0 hsl(270 95% 65% / 0.8)", 
                "inset 0 0 0 6px hsl(270 95% 65% / 0)", 
                "inset 0 0 0 0 hsl(270 95% 65% / 0)"
              ]
            } : {}}
            transition={{ duration: 0.6 }}
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
                      boxShadow: `0 0 10px ${particle.id % 2 === 0 ? "hsl(270 95% 65%)" : "hsl(35 100% 60%)"}`,
                    }}
                    initial={{ x: "-50%", y: "-50%", scale: 0, opacity: 1 }}
                    animate={{ 
                      x: `calc(-50% + ${Math.cos(particle.angle * Math.PI / 180) * 80}px)`,
                      y: `calc(-50% + ${Math.sin(particle.angle * Math.PI / 180) * 80}px)`,
                      scale: [0, 1.5, 0],
                      opacity: [1, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: particle.delay, ease: "easeOut" }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          
          {/* Icon with enhanced animations */}
          <motion.div
            animate={isGenerating ? { 
              rotate: 360,
              scale: [1, 1.2, 1],
            } : {}}
            transition={{ 
              rotate: { duration: 1, repeat: isGenerating ? Infinity : 0, ease: "linear" },
              scale: { duration: 0.5, repeat: isGenerating ? Infinity : 0, ease: "easeInOut" },
            }}
            className="relative"
          >
            {isGenerating ? (
              <Wand2 className="w-6 h-6 text-foreground" />
            ) : (
              <Sparkles className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
            )}
            {/* Icon glow */}
            {isGenerating && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, hsl(270 95% 65% / 0.5), transparent)" }}
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.div>

          <span className={`relative z-10 font-semibold ${isGenerating ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"} transition-colors`}>
            {isGenerating ? "GENERATING MAGIC..." : "GENERATE SELFIE SNAP"}
          </span>

          {/* Floating stars when generating */}
          {isGenerating && (
            <>
              <motion.div
                className="absolute top-2 left-8"
                animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Stars className="w-3 h-3 text-secondary" />
              </motion.div>
              <motion.div
                className="absolute bottom-2 right-12"
                animate={{ y: [0, -6, 0], opacity: [0.3, 0.8, 0.3], rotate: [0, -180, -360] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <Zap className="w-3 h-3 text-primary" />
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
