import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

interface MagicSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const MagicSlider = ({ value, onChange, min = 1, max = 10 }: MagicSliderProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pulses, setPulses] = useState<Array<{ id: number; x: number }>>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleChange = (newValue: number) => {
    if (newValue !== value) {
      const percentage = ((newValue - min) / (max - min)) * 100;
      setPulses(prev => [...prev.slice(-5), { id: Date.now(), x: percentage }]);
      onChange(newValue);
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;
  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-xs font-semibold text-muted-foreground tracking-[0.2em] uppercase">
          Frame Count
        </span>
        <motion.div
          className="flex items-center gap-2"
          key={value}
          initial={{ scale: 1.5, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <span
            className="text-4xl font-mono font-bold"
            style={{
              background: "linear-gradient(135deg, hsl(270 95% 65%), hsl(35 100% 60%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 40px hsl(270 95% 65% / 0.3)",
            }}
          >
            {String(value).padStart(2, "0")}
          </span>
        </motion.div>
      </div>

      {/* Interactive Track */}
      <div
        ref={trackRef}
        className="relative h-16 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsDragging(false); }}
      >
        {/* Background track with depth */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-3 rounded-full overflow-hidden"
          style={{
            background: "linear-gradient(180deg, hsl(0 0% 8%), hsl(0 0% 12%), hsl(0 0% 8%))",
            boxShadow: "inset 0 2px 6px hsl(0 0% 0% / 0.5), inset 0 -1px 2px hsl(0 0% 100% / 0.05)",
          }}
        >
          {/* Step markers inside track */}
          <div className="absolute inset-0 flex justify-between px-1">
            {steps.map((step) => (
              <motion.div
                key={step}
                className="w-0.5 h-full"
                style={{
                  background: step <= value ? "hsl(0 0% 100% / 0.1)" : "hsl(0 0% 100% / 0.05)",
                }}
              />
            ))}
          </div>

          {/* Active fill with animated gradient */}
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, hsl(270 95% 65%), hsl(300 80% 60%), hsl(35 100% 60%))",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.3) 50%, transparent 100%)",
                backgroundSize: "50% 100%",
              }}
              animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Glow effect under active track */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-8 rounded-full blur-xl pointer-events-none"
          style={{
            left: 0,
            width: `${percentage}%`,
            background: "linear-gradient(90deg, hsl(270 95% 65% / 0.5), hsl(35 100% 60% / 0.5))",
          }}
          animate={{ opacity: isHovered || isDragging ? 0.8 : 0.4 }}
        />

        {/* Thumb with 3D effect */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full cursor-grab active:cursor-grabbing"
          style={{
            left: `calc(${percentage}% - 16px)`,
            background: "linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 90%), hsl(0 0% 80%))",
            boxShadow: `
              0 0 0 3px hsl(270 95% 65% / ${isHovered || isDragging ? 0.5 : 0.2}),
              0 0 30px hsl(270 95% 65% / ${isHovered || isDragging ? 0.6 : 0.3}),
              0 4px 12px hsl(0 0% 0% / 0.4),
              inset 0 1px 2px hsl(0 0% 100% / 0.8)
            `,
          }}
          animate={{
            scale: isDragging ? 1.3 : isHovered ? 1.15 : 1,
            y: isDragging ? -2 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          whileTap={{ scale: 1.2 }}
        >
          {/* Inner glow */}
          <motion.div
            className="absolute inset-1 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, hsl(0 0% 100%), transparent 60%)",
            }}
          />
          {/* Center dot */}
          <div
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: "linear-gradient(135deg, hsl(270 95% 65%), hsl(35 100% 60%))" }}
              animate={{ scale: isDragging ? [1, 1.5, 1] : 1 }}
              transition={{ duration: 0.3, repeat: isDragging ? Infinity : 0 }}
            />
          </div>
        </motion.div>

        {/* Pulse effects on change */}
        <AnimatePresence>
          {pulses.map((pulse) => (
            <motion.div
              key={pulse.id}
              className="absolute top-1/2 -translate-y-1/2 w-16 h-16 rounded-full pointer-events-none"
              style={{
                left: `calc(${pulse.x}% - 32px)`,
                background: "radial-gradient(circle, hsl(270 95% 65% / 0.6), transparent 70%)",
              }}
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onAnimationComplete={() => {
                setPulses(prev => prev.filter(p => p.id !== pulse.id));
              }}
            />
          ))}
        </AnimatePresence>

        {/* Invisible range input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mt-4 px-0.5">
        {steps.map((step) => (
          <motion.button
            key={step}
            onClick={() => handleChange(step)}
            className="relative flex flex-col items-center gap-1 group/step"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full transition-all duration-200"
              style={{
                background: step <= value
                  ? step === value
                    ? "linear-gradient(135deg, hsl(270 95% 65%), hsl(35 100% 60%))"
                    : "hsl(270 95% 65%)"
                  : "hsl(0 0% 25%)",
                boxShadow: step === value ? "0 0 10px hsl(270 95% 65% / 0.5)" : "none",
              }}
              animate={{
                scale: step === value ? [1, 1.4, 1] : 1,
              }}
              transition={{ duration: 0.4, repeat: step === value ? Infinity : 0, repeatDelay: 2 }}
            />
            <span
              className={`text-[10px] font-mono transition-all duration-200 ${
                step === value
                  ? "text-foreground font-bold"
                  : step <= value
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50"
              }`}
            >
              {step}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default MagicSlider;
