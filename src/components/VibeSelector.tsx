import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Palette, Sparkles, Church, Sun, Mountain, Gem, Zap, Waves } from "lucide-react";

interface Vibe {
  id: string;
  name: string;
  icon: React.ReactNode;
  gradient: string;
  accentColor: string;
}

const vibes: Vibe[] = [
  {
    id: "renaissance",
    name: "Renaissance",
    icon: <Palette className="w-6 h-6" />,
    gradient: "linear-gradient(135deg, hsl(30 60% 25%), hsl(40 80% 45%), hsl(35 70% 35%))",
    accentColor: "hsl(40 80% 45%)",
  },
  {
    id: "minimalist",
    name: "Minimal",
    icon: <Gem className="w-6 h-6" />,
    gradient: "linear-gradient(135deg, hsl(0 0% 15%), hsl(0 0% 30%), hsl(0 0% 20%))",
    accentColor: "hsl(0 0% 80%)",
  },
  {
    id: "stained-glass",
    name: "Sacred Glow",
    icon: <Church className="w-6 h-6" />,
    gradient: "linear-gradient(135deg, hsl(270 80% 45%), hsl(300 70% 50%), hsl(35 100% 55%))",
    accentColor: "hsl(270 80% 65%)",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    icon: <Sun className="w-6 h-6" />,
    gradient: "linear-gradient(135deg, hsl(35 100% 45%), hsl(25 100% 55%), hsl(15 100% 50%))",
    accentColor: "hsl(35 100% 60%)",
  },
  {
    id: "ethereal",
    name: "Ethereal",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "linear-gradient(135deg, hsl(280 70% 50%), hsl(200 80% 60%), hsl(260 60% 55%))",
    accentColor: "hsl(280 70% 70%)",
  },
  {
    id: "neon",
    name: "Neon Pulse",
    icon: <Zap className="w-6 h-6" />,
    gradient: "linear-gradient(135deg, hsl(330 100% 50%), hsl(280 100% 60%), hsl(200 100% 50%))",
    accentColor: "hsl(330 100% 60%)",
  },
  {
    id: "ocean",
    name: "Deep Ocean",
    icon: <Waves className="w-6 h-6" />,
    gradient: "linear-gradient(135deg, hsl(200 80% 30%), hsl(180 70% 40%), hsl(210 60% 45%))",
    accentColor: "hsl(180 70% 50%)",
  },
  {
    id: "majestic",
    name: "Majestic",
    icon: <Mountain className="w-6 h-6" />,
    gradient: "linear-gradient(135deg, hsl(210 40% 25%), hsl(200 50% 40%), hsl(220 60% 35%))",
    accentColor: "hsl(200 60% 55%)",
  },
];

interface VibeSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

const VibeSelector = ({ selected, onSelect }: VibeSelectorProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <p className="text-xs font-semibold text-muted-foreground tracking-[0.2em] uppercase mb-5 text-center">
        Choose Your Vibe
      </p>

      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {vibes.map((vibe, index) => {
            const isSelected = selected === vibe.id;
            const isHovered = hoveredId === vibe.id;

            return (
              <motion.button
                key={vibe.id}
                onClick={() => onSelect(vibe.id)}
                onHoverStart={() => setHoveredId(vibe.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="flex-shrink-0 snap-center relative"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.08, type: "spring", stiffness: 200 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Card container */}
                <motion.div
                  className="relative w-24 h-32 rounded-2xl overflow-hidden"
                  style={{
                    background: vibe.gradient,
                    boxShadow: isSelected
                      ? `0 0 0 2px ${vibe.accentColor}, 0 0 40px ${vibe.accentColor}40, 0 20px 40px hsl(0 0% 0% / 0.4)`
                      : isHovered
                      ? `0 15px 35px hsl(0 0% 0% / 0.4), 0 0 20px ${vibe.accentColor}30`
                      : "0 8px 25px hsl(0 0% 0% / 0.3)",
                  }}
                  animate={{
                    y: isHovered && !isSelected ? -8 : 0,
                    rotateY: isHovered ? 5 : 0,
                    rotateX: isHovered ? -5 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Animated background pattern */}
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 50%, ${vibe.accentColor}40 1px, transparent 1px)`,
                      backgroundSize: "10px 10px",
                    }}
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Glass overlay with shine */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(0 0% 100% / 0.15) 0%, transparent 50%, hsl(0 0% 0% / 0.2) 100%)",
                    }}
                  />

                  {/* Animated shine on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.3) 45%, hsl(0 0% 100% / 0.5) 50%, hsl(0 0% 100% / 0.3) 55%, transparent 60%)",
                        }}
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-3">
                    {/* Icon with floating animation */}
                    <motion.div
                      className="relative p-3 rounded-xl backdrop-blur-md"
                      style={{
                        background: "hsl(0 0% 0% / 0.2)",
                        border: "1px solid hsl(0 0% 100% / 0.1)",
                      }}
                      animate={{
                        y: isSelected ? [0, -3, 0] : 0,
                        rotate: isSelected ? [0, 5, -5, 0] : 0,
                      }}
                      transition={{
                        duration: 2,
                        repeat: isSelected ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    >
                      <motion.div
                        animate={{ scale: isSelected ? [1, 1.1, 1] : 1 }}
                        transition={{ duration: 1.5, repeat: isSelected ? Infinity : 0 }}
                      >
                        {vibe.icon}
                      </motion.div>

                      {/* Icon glow */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          style={{ boxShadow: `inset 0 0 15px ${vibe.accentColor}60` }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>

                    {/* Label */}
                    <span className="text-xs font-semibold text-center leading-tight text-foreground drop-shadow-lg">
                      {vibe.name}
                    </span>
                  </div>

                  {/* Selected indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{
                          background: "hsl(0 0% 100%)",
                          boxShadow: `0 0 10px ${vibe.accentColor}`,
                        }}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      >
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          style={{ background: vibe.gradient }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom gradient fade */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-12"
                    style={{
                      background: `linear-gradient(to top, hsl(0 0% 0% / 0.4), transparent)`,
                    }}
                  />
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default VibeSelector;
