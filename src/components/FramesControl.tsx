import { motion } from "framer-motion";
import { Settings, Minus, Plus } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface FramesControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const FramesControl = ({ value, onChange, min = 1, max = 10 }: FramesControlProps) => {
  const { playSound } = useSoundEffects();
  const percentage = ((value - min) / (max - min)) * 100;

  const handleDecrement = () => {
    if (value > min) {
      playSound("click");
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      playSound("click");
      onChange(value + 1);
    }
  };

  const handleMax = () => {
    playSound("click");
    onChange(max);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    playSound("hover");
    onChange(Number(e.target.value));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
            Frames
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleMax}
            className="px-3 py-1 text-xs font-mono tracking-wider rounded border"
            style={{
              background: value === max ? "hsl(270 95% 65% / 0.2)" : "transparent",
              borderColor: value === max ? "hsl(270 95% 65%)" : "hsl(250 20% 30%)",
              color: value === max ? "hsl(270 95% 75%)" : "hsl(0 0% 60%)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            MAX
          </motion.button>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "hsl(250 25% 12%)" }}>
            <motion.button
              onClick={handleDecrement}
              disabled={value <= min}
              className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <span className="w-8 text-center text-sm font-mono text-foreground">
              {value.toString().padStart(2, "0")}
            </span>
            <motion.button
              onClick={handleIncrement}
              disabled={value >= max}
              className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative h-2">
        {/* Track background */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "hsl(250 20% 15%)" }}
        />
        {/* Active track */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, hsl(270 95% 55%), hsl(35 100% 55%))",
            width: `${percentage}%`,
          }}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        {/* Inactive segment markers */}
        <div className="absolute inset-0 flex items-center justify-end pr-1">
          {Array.from({ length: max - value }, (_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full mx-1"
              style={{ background: "hsl(250 20% 25%)" }}
            />
          ))}
        </div>
        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 w-5 h-5 rounded-full border-2 cursor-grab active:cursor-grabbing"
          style={{
            left: `${percentage}%`,
            transform: "translate(-50%, -50%)",
            background: "hsl(250 25% 10%)",
            borderColor: "hsl(270 95% 65%)",
            boxShadow: "0 0 15px hsl(270 95% 65% / 0.5)",
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
        {/* Hidden range input for accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
    </motion.div>
  );
};

export default FramesControl;
