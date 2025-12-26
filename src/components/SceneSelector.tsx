import { motion } from "framer-motion";
import { Palmtree, Building2, Mountain, Sparkles, PartyPopper, Camera } from "lucide-react";

interface SceneSelectorProps {
  selected: string;
  onSelect: (scene: string) => void;
}

const scenes = [
  { id: "natural", label: "Natural", icon: Camera, description: "Auto-detect best background" },
  { id: "beach", label: "Beach", icon: Palmtree, description: "Sunny tropical vibes" },
  { id: "city", label: "City", icon: Building2, description: "Urban skyline backdrop" },
  { id: "mountains", label: "Mountains", icon: Mountain, description: "Majestic peaks scenery" },
  { id: "studio", label: "Studio", icon: Sparkles, description: "Professional portrait" },
  { id: "party", label: "Party", icon: PartyPopper, description: "Fun celebration mood" },
];

const SceneSelector = ({ selected, onSelect }: SceneSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Scene / Background
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {scenes.map((scene) => {
          const Icon = scene.icon;
          const isSelected = selected === scene.id;

          return (
            <motion.button
              key={scene.id}
              onClick={() => onSelect(scene.id)}
              className={`relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-1.5 ${
                isSelected
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/30 bg-background/50 hover:border-border/50 hover:bg-background/80"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, hsl(270 95% 65% / 0.15), hsl(300 80% 50% / 0.1))",
                  }}
                  layoutId="sceneHighlight"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <Icon
                className={`w-5 h-5 relative z-10 ${
                  isSelected ? "text-primary" : "text-muted-foreground"
                }`}
              />

              <span
                className={`text-xs font-medium relative z-10 ${
                  isSelected ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {scene.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected scene description */}
      <motion.p
        key={selected}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-center text-muted-foreground"
      >
        {scenes.find((s) => s.id === selected)?.description}
      </motion.p>
    </div>
  );
};

export default SceneSelector;
