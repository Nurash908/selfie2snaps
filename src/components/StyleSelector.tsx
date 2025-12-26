import { motion, AnimatePresence } from "framer-motion";
import { Palette, Sun, Film, Sparkles, Moon, Zap, Contrast, Camera, Waves, CloudSun, Flame } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useState } from "react";

interface StyleSelectorProps {
  selected: string;
  onSelect: (style: string) => void;
}

const StyleSelector = ({ selected, onSelect }: StyleSelectorProps) => {
  const { playSound } = useSoundEffects();
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);
  const [showAllStyles, setShowAllStyles] = useState(false);

  const styles = [
    { 
      id: "natural", 
      label: "Natural", 
      icon: Sun, 
      color: "hsl(45 100% 55%)",
      gradient: "linear-gradient(135deg, hsl(45 100% 55%), hsl(35 100% 50%))",
      description: "Clean & realistic look"
    },
    { 
      id: "vintage", 
      label: "Vintage", 
      icon: Film, 
      color: "hsl(35 60% 50%)",
      gradient: "linear-gradient(135deg, hsl(35 60% 50%), hsl(25 50% 40%))",
      description: "Retro 70s/80s film aesthetic"
    },
    { 
      id: "cinematic", 
      label: "Cinematic", 
      icon: Moon, 
      color: "hsl(220 80% 55%)",
      gradient: "linear-gradient(135deg, hsl(220 80% 55%), hsl(240 70% 45%))",
      description: "Hollywood movie drama"
    },
    { 
      id: "vibrant", 
      label: "Vibrant", 
      icon: Sparkles, 
      color: "hsl(320 90% 55%)",
      gradient: "linear-gradient(135deg, hsl(320 90% 55%), hsl(270 85% 55%))",
      description: "Bold & colorful pop"
    },
    { 
      id: "neon", 
      label: "Neon", 
      icon: Zap, 
      color: "hsl(280 100% 65%)",
      gradient: "linear-gradient(135deg, hsl(280 100% 65%), hsl(180 100% 50%))",
      description: "Cyberpunk neon glow"
    },
    { 
      id: "bw", 
      label: "B&W", 
      icon: Contrast, 
      color: "hsl(0 0% 70%)",
      gradient: "linear-gradient(135deg, hsl(0 0% 30%), hsl(0 0% 10%))",
      description: "Classic black & white"
    },
    { 
      id: "sepia", 
      label: "Sepia", 
      icon: Camera, 
      color: "hsl(30 50% 45%)",
      gradient: "linear-gradient(135deg, hsl(30 50% 45%), hsl(25 40% 30%))",
      description: "Warm antique tones"
    },
    { 
      id: "hdr", 
      label: "HDR", 
      icon: CloudSun, 
      color: "hsl(200 90% 55%)",
      gradient: "linear-gradient(135deg, hsl(200 90% 55%), hsl(40 100% 55%))",
      description: "High dynamic range pop"
    },
    { 
      id: "dreamy", 
      label: "Dreamy", 
      icon: Waves, 
      color: "hsl(300 70% 70%)",
      gradient: "linear-gradient(135deg, hsl(300 70% 70%), hsl(200 80% 70%))",
      description: "Soft ethereal glow"
    },
    { 
      id: "warm", 
      label: "Warm", 
      icon: Flame, 
      color: "hsl(25 100% 55%)",
      gradient: "linear-gradient(135deg, hsl(25 100% 55%), hsl(10 90% 50%))",
      description: "Cozy golden hour vibes"
    },
  ];

  const visibleStyles = showAllStyles ? styles : styles.slice(0, 5);

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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
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
        <motion.button
          onClick={() => {
            playSound("click");
            setShowAllStyles(!showAllStyles);
          }}
          className="text-xs font-mono text-primary hover:text-secondary transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showAllStyles ? "Show Less" : `+${styles.length - 5} More`}
        </motion.button>
      </div>

      <motion.div 
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(5, 1fr)`,
        }}
        layout
      >
        <AnimatePresence mode="popLayout">
          {visibleStyles.map((style, index) => {
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
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: 0,
                  boxShadow: isSelected 
                    ? `0 0 25px ${style.color}40`
                    : "none",
                }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ delay: index * 0.03, type: "spring", stiffness: 300 }}
                whileHover={{ 
                  scale: 1.08,
                  y: -3,
                  boxShadow: `0 8px 25px ${style.color}40`,
                }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${style.color}40, transparent 70%)`,
                  }}
                  animate={{ opacity: isHovered || isSelected ? 1 : 0 }}
                />

                {/* Floating particles effect */}
                {isSelected && (
                  <>
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{ background: style.color }}
                        animate={{
                          y: [-25, 25],
                          x: [Math.random() * 30 - 15, Math.random() * 30 - 15],
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${style.color}20 50%, transparent 100%)`,
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                />

                <motion.div
                  className="relative z-10"
                  animate={isSelected ? { 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ 
                      color: isSelected ? "white" : style.color,
                      filter: isSelected ? `drop-shadow(0 0 8px ${style.color})` : "none",
                    }}
                  />
                </motion.div>

                <span 
                  className="text-[10px] font-mono mt-1.5 relative z-10 font-medium"
                  style={{ color: isSelected ? "white" : "hsl(0 0% 70%)" }}
                >
                  {style.label}
                </span>

                {/* Selection indicator ring with pulse */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: [1, 1.15, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      boxShadow: `inset 0 0 15px ${style.color}60`,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Style description with animation */}
      <motion.div
        className="text-center pt-1"
        key={selected}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.span 
          className="text-xs text-muted-foreground inline-flex items-center gap-2"
          animate={{ 
            color: [
              "hsl(0 0% 60%)",
              `${styles.find(s => s.id === selected)?.color}`,
              "hsl(0 0% 60%)",
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="w-3 h-3" />
          {styles.find(s => s.id === selected)?.description}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default StyleSelector;
