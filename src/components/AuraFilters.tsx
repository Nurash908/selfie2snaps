import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Smile, Heart, Users, Sparkles } from "lucide-react";

interface AuraFilter {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const auraFilters: AuraFilter[] = [
  {
    id: "joy",
    name: "Joy",
    description: "Warm golden radiance",
    icon: <Smile className="w-6 h-6" />,
    color: "hsl(35 100% 60%)",
    gradient: "linear-gradient(135deg, hsl(35 100% 60%), hsl(45 100% 70%), hsl(25 100% 55%))",
  },
  {
    id: "peace",
    name: "Peace",
    description: "Serene blue glow",
    icon: <Heart className="w-6 h-6" />,
    color: "hsl(200 80% 60%)",
    gradient: "linear-gradient(135deg, hsl(200 80% 60%), hsl(180 70% 65%), hsl(220 75% 55%))",
  },
  {
    id: "fellowship",
    name: "Fellowship",
    description: "Violet connection",
    icon: <Users className="w-6 h-6" />,
    color: "hsl(270 95% 65%)",
    gradient: "linear-gradient(135deg, hsl(270 95% 65%), hsl(280 85% 70%), hsl(260 90% 60%))",
  },
  {
    id: "none",
    name: "None",
    description: "No aura effect",
    icon: <Sparkles className="w-6 h-6" />,
    color: "hsl(0 0% 50%)",
    gradient: "linear-gradient(135deg, hsl(0 0% 30%), hsl(0 0% 40%))",
  },
];

interface AuraFiltersProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

const AuraFilters = ({ selected, onSelect }: AuraFiltersProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <p className="text-xs font-semibold text-muted-foreground tracking-[0.2em] uppercase">
        Aura Energy
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        {auraFilters.map((filter, index) => {
          const isSelected = selected === filter.id || (filter.id === "none" && !selected);
          const isHovered = hoveredId === filter.id;

          return (
            <motion.button
              key={filter.id}
              onClick={() => onSelect(filter.id === "none" ? "" : filter.id)}
              onHoverStart={() => setHoveredId(filter.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="relative group"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1, type: "spring", stiffness: 200 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Outer ring glow */}
              <motion.div
                className="absolute -inset-1 rounded-2xl"
                style={{
                  background: filter.gradient,
                  opacity: isSelected ? 0.5 : 0,
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity: isSelected ? [0.3, 0.6, 0.3] : isHovered ? 0.3 : 0,
                  scale: isSelected ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
              />

              {/* Main button */}
              <motion.div
                className="relative w-20 h-24 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-2 p-3"
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${filter.color}25, ${filter.color}10)`
                    : "hsl(0 0% 10%)",
                  border: `1px solid ${isSelected ? filter.color : "hsl(0 0% 20%)"}`,
                  boxShadow: isSelected
                    ? `0 0 30px ${filter.color}40, inset 0 0 20px ${filter.color}15`
                    : "0 4px 15px hsl(0 0% 0% / 0.3)",
                }}
                animate={{
                  y: isHovered && !isSelected ? -5 : 0,
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {/* Animated background particles */}
                {isSelected && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{ background: filter.color }}
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{
                          x: Math.cos((i / 6) * Math.PI * 2) * 30,
                          y: Math.sin((i / 6) * Math.PI * 2) * 30,
                          opacity: [0, 0.8, 0],
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

                {/* Icon container with floating effect */}
                <motion.div
                  className="relative z-10 p-2 rounded-xl"
                  style={{
                    background: isSelected ? `${filter.color}20` : "transparent",
                    color: filter.color,
                  }}
                  animate={{
                    y: isSelected ? [0, -3, 0] : 0,
                    rotate: isSelected ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{
                    duration: 3,
                    repeat: isSelected ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  {filter.icon}

                  {/* Icon glow ring */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        boxShadow: `0 0 15px ${filter.color}`,
                      }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className="text-xs font-semibold relative z-10 transition-colors"
                  style={{ color: isSelected ? filter.color : "hsl(0 0% 60%)" }}
                >
                  {filter.name}
                </span>

                {/* Selection indicator */}
                <AnimatePresence>
                  {isSelected && filter.id !== "none" && (
                    <motion.div
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                      style={{ background: filter.color }}
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.3, 1] }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Tooltip on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg whitespace-nowrap z-20"
                    style={{
                      background: "hsl(0 0% 15%)",
                      border: "1px solid hsl(0 0% 25%)",
                    }}
                    initial={{ opacity: 0, y: -5, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="text-[10px] text-muted-foreground">
                      {filter.description}
                    </span>
                    <div
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                      style={{ background: "hsl(0 0% 15%)", borderTop: "1px solid hsl(0 0% 25%)", borderLeft: "1px solid hsl(0 0% 25%)" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AuraFilters;
