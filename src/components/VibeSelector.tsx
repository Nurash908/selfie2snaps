import { motion } from "framer-motion";
import { Palette, Sparkles, Church, Sun, Mountain, Gem } from "lucide-react";

interface Vibe {
  id: string;
  name: string;
  icon: React.ReactNode;
  gradient: string;
}

const vibes: Vibe[] = [
  { 
    id: "renaissance", 
    name: "Renaissance Oil", 
    icon: <Palette className="w-5 h-5" />,
    gradient: "linear-gradient(135deg, hsl(30 60% 30%), hsl(40 70% 50%))"
  },
  { 
    id: "minimalist", 
    name: "Modern Minimalist", 
    icon: <Gem className="w-5 h-5" />,
    gradient: "linear-gradient(135deg, hsl(0 0% 20%), hsl(0 0% 40%))"
  },
  { 
    id: "stained-glass", 
    name: "Stained Glass Glow", 
    icon: <Church className="w-5 h-5" />,
    gradient: "linear-gradient(135deg, hsl(270 80% 50%), hsl(35 100% 60%))"
  },
  { 
    id: "golden-hour", 
    name: "Golden Hour", 
    icon: <Sun className="w-5 h-5" />,
    gradient: "linear-gradient(135deg, hsl(35 100% 50%), hsl(20 100% 60%))"
  },
  { 
    id: "ethereal", 
    name: "Ethereal Dreams", 
    icon: <Sparkles className="w-5 h-5" />,
    gradient: "linear-gradient(135deg, hsl(280 80% 60%), hsl(200 90% 70%))"
  },
  { 
    id: "majestic", 
    name: "Majestic Peaks", 
    icon: <Mountain className="w-5 h-5" />,
    gradient: "linear-gradient(135deg, hsl(210 50% 30%), hsl(200 70% 50%))"
  },
];

interface VibeSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

const VibeSelector = ({ selected, onSelect }: VibeSelectorProps) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <p className="text-sm font-medium text-muted-foreground tracking-wide mb-4 text-center">
        CHOOSE YOUR VIBE
      </p>
      
      <div className="flex gap-3 overflow-x-auto pb-4 px-2 snap-x snap-mandatory scrollbar-hide">
        {vibes.map((vibe, index) => (
          <motion.button
            key={vibe.id}
            onClick={() => onSelect(vibe.id)}
            className="flex-shrink-0 snap-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`relative w-28 h-36 rounded-2xl overflow-hidden transition-all duration-300 ${
                selected === vibe.id 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                  : ""
              }`}
              style={{
                background: vibe.gradient,
                boxShadow: selected === vibe.id 
                  ? "0 0 30px hsl(270 95% 65% / 0.4)" 
                  : "0 4px 20px hsl(0 0% 0% / 0.3)"
              }}
            >
              {/* Glass overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, hsl(0 0% 100% / 0.1) 0%, transparent 50%, hsl(0 0% 0% / 0.2) 100%)"
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
                <motion.div
                  className="p-2 rounded-full bg-background/20 backdrop-blur-sm"
                  animate={{
                    rotate: selected === vibe.id ? [0, 10, -10, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {vibe.icon}
                </motion.div>
                <span className="text-xs font-medium text-center leading-tight text-foreground/90">
                  {vibe.name}
                </span>
              </div>

              {/* Selected indicator */}
              {selected === vibe.id && (
                <motion.div
                  className="absolute top-2 right-2 w-3 h-3 rounded-full bg-foreground"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default VibeSelector;