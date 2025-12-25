import { motion } from "framer-motion";
import { Crop } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface RatioSelectorProps {
  selected: string;
  onSelect: (ratio: string) => void;
}

const ratios = [
  { id: "1:1", label: "1:1", width: 16, height: 16 },
  { id: "3:4", label: "3:4", width: 12, height: 16 },
  { id: "4:3", label: "4:3", width: 16, height: 12 },
  { id: "9:16", label: "9:16", width: 9, height: 16 },
  { id: "16:9", label: "16:9", width: 16, height: 9 },
];

const RatioSelector = ({ selected, onSelect }: RatioSelectorProps) => {
  const { playSound } = useSoundEffects();

  const handleSelect = (id: string) => {
    playSound("click");
    onSelect(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Crop className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
          Ratio
        </span>
      </div>

      {/* Options */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{ background: "hsl(250 25% 10%)" }}
      >
        {ratios.map((ratio) => (
          <motion.button
            key={ratio.id}
            onClick={() => handleSelect(ratio.id)}
            className="flex flex-col items-center gap-2 px-3 py-2 rounded-lg transition-colors"
            style={{
              background: selected === ratio.id ? "hsl(270 95% 65% / 0.15)" : "transparent",
              border: selected === ratio.id ? "1px solid hsl(270 95% 65% / 0.5)" : "1px solid transparent",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Ratio preview box */}
            <div
              className="rounded border transition-colors"
              style={{
                width: ratio.width,
                height: ratio.height,
                borderColor: selected === ratio.id ? "hsl(270 95% 65%)" : "hsl(250 20% 35%)",
                background: selected === ratio.id ? "hsl(270 95% 65% / 0.1)" : "transparent",
              }}
            />
            {/* Label */}
            <span
              className="text-xs font-mono transition-colors"
              style={{
                color: selected === ratio.id ? "hsl(270 95% 75%)" : "hsl(0 0% 50%)",
              }}
            >
              {ratio.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default RatioSelector;
