import { motion } from "framer-motion";
import { Palette, Sun, Film, Sparkles, Moon, Zap } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useState } from "react";

interface StyleSelectorProps {
  selected: string;
  onSelect: (style: string) => void;
}

const StyleSelector = ({ selected, onSelect }: StyleSelectorProps) => {
  const { playSound } = useSoundEffects();
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

  const styles = [
    { 
      id: "natural", 
      label: "Natural", 
      icon: Sun, 
      color: "hsl(45 100% 55%)",
      gradient: "linear-gradient(135deg, hsl(45 100% 55%), hsl(35 100% 50%))",
      description: "Clean & realistic"
    },
    { 
      id: "vintage", 
      label: "Vintage", 
      icon: Film, 
      color: "hsl(35 60% 50%)",
      gradient: "linear-gradient(135deg, hsl(35 60% 50%), hsl(25 50% 40%))",
      description: "Retro film look"
    },
    { 
      id: "cinematic", 
      label: "Cinematic", 
      icon: Moon, 
      color: "hsl(220 80% 55%)",
      gradient: "linear-gradient(135deg, hsl(220 80% 55%), hsl(240 70% 45%))",
      description: "Movie-like drama"
    },
    { 
      id: "vibrant", 
      label: "Vibrant", 
      icon: Sparkles, 
      color: "hsl(320 90% 55%)",
      gradient: "linear-gradient(135deg, hsl(320 90% 55%), hsl(270 85% 55%))",
      description: "Bold & colorful"
    },
    { 
      id: "neon", 
      label: "Neon", 
      icon: Zap, 
      color: "hsl(280 100% 65%)",
      gradient: "linear-gradient(135deg, hsl(280 100% 65%), hsl(180 100% 50%))",
      description: "Cyberpunk glow"
    },
  ];

  const handleSelect = (styleId: string) => {
    playSound("click");
    onSelect(styleId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          className="p-2 rounded-lg"
          style={{ background: "hsl(250 25% 18%)" }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Palette className="w-4 h-4 text-primary" />
        </motion.div>
        <span className="text-sm font-mono text-muted-foreground tracking-wider">
          PHOTO STYLE
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {styles.map((style, index) => {
          const isSelected = selected === style.id;
          const isHovered = hoveredStyle === style.id;
          const Icon = style.icon;

          return (
            <motion.button
              key={style.id}
              onClick={() => handleSelect(style.id)}
              onMouseEnter={() => setHoveredStyle(style.id)}
              onMouseLeave={() => setHoveredStyle(null)}
              className="relative flex flex-col items-center p-3 rounded-xl group overflow-hidden"
              style={{
                background: isSelected 
                  ? style.gradient
                  : "hsl(250 25% 15%)",
                border: isSelected 
                  ? `2px solid ${style.color}`
                  : "2px solid hsl(250 20% 20%)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                boxShadow: isSelected 
                  ? `0 0 25px ${style.color}40`
                  : "none",
              }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 20px ${style.color}30`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 opacity-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${style.color}30, transparent 70%)`,
                }}
                animate={{ opacity: isHovered || isSelected ? 1 : 0 }}
              />

              {/* Floating particles effect */}
              {isSelected && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{ background: style.color }}
                      animate={{
                        y: [-20, 20],
                        x: [Math.random() * 20 - 10, Math.random() * 20 - 10],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </>
              )}

              <motion.div
                className="relative z-10"
                animate={isSelected ? { 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: isSelected ? "white" : style.color }}
                />
              </motion.div>

              <span 
                className="text-[10px] font-mono mt-1.5 relative z-10"
                style={{ color: isSelected ? "white" : "hsl(0 0% 70%)" }}
              >
                {style.label}
              </span>

              {/* Selection indicator ring */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    border: `2px solid ${style.color}`,
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Style description */}
      <motion.div
        className="text-center"
        key={selected}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-xs text-muted-foreground">
          {styles.find(s => s.id === selected)?.description}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default StyleSelector;
