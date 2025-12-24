import { motion } from "framer-motion";
import { useState } from "react";

interface MagicSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const MagicSlider = ({ value, onChange, min = 1, max = 10 }: MagicSliderProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  const handleChange = (newValue: number) => {
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 300);
    onChange(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-muted-foreground tracking-wide">FRAMES</span>
        <motion.span 
          className="text-2xl font-serif font-bold text-foreground"
          key={value}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {value}
        </motion.span>
      </div>

      <div 
        className="relative h-12 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Track background */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 rounded-full overflow-hidden"
          style={{
            background: "linear-gradient(90deg, hsl(0 0% 15%), hsl(0 0% 20%))",
            boxShadow: "inset 0 2px 4px hsl(0 0% 0% / 0.3)"
          }}
        >
          {/* Active track */}
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, hsl(270 95% 65%), hsl(35 100% 60%))",
              width: `${percentage}%`
            }}
            layoutId="activeTrack"
          />
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-8 rounded-full blur-xl pointer-events-none"
          style={{
            left: 0,
            width: `${percentage}%`,
            background: "linear-gradient(90deg, hsl(270 95% 65% / 0.4), hsl(35 100% 60% / 0.4))"
          }}
          animate={{ opacity: isHovered ? 0.8 : 0.4 }}
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full cursor-grab active:cursor-grabbing"
          style={{
            left: `calc(${percentage}% - 12px)`,
            background: "linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 85%))",
            boxShadow: `
              0 0 20px hsl(270 95% 65% / 0.5),
              0 4px 8px hsl(0 0% 0% / 0.3)
            `
          }}
          animate={{
            scale: isHovered ? 1.2 : 1,
          }}
          whileTap={{ scale: 0.95 }}
        />

        {/* Haptic pulse */}
        {showPulse && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full pointer-events-none"
            style={{
              left: `calc(${percentage}% - 24px)`,
              background: "radial-gradient(circle, hsl(270 95% 65% / 0.6), transparent)"
            }}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Invisible range input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Tick marks */}
      <div className="flex justify-between mt-2 px-1">
        {Array.from({ length: max - min + 1 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full"
            style={{
              background: i + min <= value ? "hsl(270 95% 65%)" : "hsl(0 0% 30%)"
            }}
            animate={{
              scale: i + min === value ? 1.5 : 1
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default MagicSlider;