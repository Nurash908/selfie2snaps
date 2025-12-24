import { motion } from "framer-motion";
import { Smile, Heart, Users } from "lucide-react";

interface AuraFilter {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
}

const auraFilters: AuraFilter[] = [
  {
    id: "joy",
    name: "Joy",
    icon: <Smile className="w-5 h-5" />,
    color: "hsl(35 100% 60%)",
    glow: "0 0 30px hsl(35 100% 60% / 0.6)"
  },
  {
    id: "peace",
    name: "Peace",
    icon: <Heart className="w-5 h-5" />,
    color: "hsl(200 80% 60%)",
    glow: "0 0 30px hsl(200 80% 60% / 0.6)"
  },
  {
    id: "fellowship",
    name: "Fellowship",
    icon: <Users className="w-5 h-5" />,
    color: "hsl(270 95% 65%)",
    glow: "0 0 30px hsl(270 95% 65% / 0.6)"
  }
];

interface AuraFiltersProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

const AuraFilters = ({ selected, onSelect }: AuraFiltersProps) => {
  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <p className="text-sm font-medium text-muted-foreground tracking-wide">
        AURA FILTER
      </p>

      <div className="flex gap-4">
        {auraFilters.map((filter, index) => (
          <motion.button
            key={filter.id}
            onClick={() => onSelect(filter.id)}
            className={`relative p-4 rounded-2xl transition-all duration-300 ${
              selected === filter.id 
                ? "ring-2 ring-offset-2 ring-offset-background" 
                : ""
            }`}
            style={{
              background: selected === filter.id 
                ? `linear-gradient(135deg, ${filter.color}33, ${filter.color}11)`
                : "hsl(0 0% 12%)",
              boxShadow: selected === filter.id ? filter.glow : "none",
              borderColor: selected === filter.id ? filter.color : "transparent",
              borderWidth: "1px",
              borderStyle: "solid",
              ["--tw-ring-color" as string]: filter.color
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: filter.glow
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              style={{ color: filter.color }}
              animate={{
                scale: selected === filter.id ? [1, 1.2, 1] : 1
              }}
              transition={{
                duration: 2,
                repeat: selected === filter.id ? Infinity : 0
              }}
            >
              {filter.icon}
            </motion.div>

            {/* Aura glow effect */}
            {selected === filter.id && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${filter.color}20, transparent)`
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected filter name */}
      {selected && (
        <motion.p
          key={selected}
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: auraFilters.find(f => f.id === selected)?.color }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {auraFilters.find(f => f.id === selected)?.name}
        </motion.p>
      )}
    </motion.div>
  );
};

export default AuraFilters;