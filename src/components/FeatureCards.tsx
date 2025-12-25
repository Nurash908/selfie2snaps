import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const features = [
  {
    title: "Portrait Fidelity",
    description:
      "Portrait 1 and Portrait 2 keep consistent faces, hair, and wardrobe as Nano Banana fuses them into a single cinematic screen.",
  },
  {
    title: "Curated Direction",
    description:
      "Creative direction is preset for playful cinematic warmth, so every frame feels cohesive without extra tweaking.",
  },
  {
    title: "Independent Rendering",
    description:
      "Each requested frame is generated separately. Successes are instantly downloadable even if one shot needs a retry.",
  },
];

const FeatureCards = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4 mt-12"
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          className="relative p-5 rounded-xl overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, hsl(250 25% 12%) 0%, hsl(250 25% 8%) 100%)",
            border: "1px solid hsl(250 20% 18%)",
          }}
        >
          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "radial-gradient(circle at 50% 50%, hsl(270 95% 65% / 0.05), transparent 70%)",
            }}
          />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-mono tracking-widest text-foreground uppercase mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
            <motion.div
              className="flex-shrink-0"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3 + index,
              }}
            >
              <Zap
                className="w-6 h-6"
                style={{ color: "hsl(270 95% 65%)" }}
              />
            </motion.div>
          </div>

          {/* Subtle border glow on hover */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              boxShadow: "inset 0 0 0 1px hsl(270 95% 65% / 0.2)",
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureCards;
