import { motion } from "framer-motion";
import { Zap, Eye, Layers } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const features = [
  {
    icon: Eye,
    title: "Portrait Fidelity",
    description:
      "Portrait 1 and Portrait 2 keep consistent faces, hair, and wardrobe as Nano Banana fuses them into a single cinematic screen.",
    accent: "hsl(270 95% 65%)",
  },
  {
    icon: Zap,
    title: "Curated Direction",
    description:
      "Creative direction is preset for playful cinematic warmth, so every frame feels cohesive without extra tweaking.",
    accent: "hsl(35 100% 60%)",
  },
  {
    icon: Layers,
    title: "Independent Rendering",
    description:
      "Each requested frame is generated separately. Successes are instantly downloadable even if one shot needs a retry.",
    accent: "hsl(200 90% 55%)",
  },
];

const FeatureCards = () => {
  const { ref, inView } = useInView({ rootMargin: "50px" });

  return (
    <div ref={ref}>
      {inView && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <h3 className="text-xs font-mono tracking-[0.3em] text-muted-foreground/60 uppercase text-center mb-5">
            How It Works
          </h3>

          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.12 }}
                className="relative p-5 rounded-2xl overflow-hidden group"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(250 25% 12%) 0%, hsl(250 25% 8%) 100%)",
                  border: "1px solid hsl(250 20% 18%)",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${feature.accent.replace(")", " / 0.06)")}, transparent 70%)`,
                  }}
                />

                <div className="relative flex items-start gap-4">
                  {/* Number badge */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${feature.accent.replace(")", " / 0.12)")}`,
                      border: `1px solid ${feature.accent.replace(")", " / 0.2)")}`,
                    }}
                  >
                    <feature.icon
                      className="w-5 h-5"
                      style={{ color: feature.accent }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-mono tracking-widest text-foreground uppercase mb-1.5">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] rounded-full"
                  style={{ background: feature.accent }}
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.3 + index * 0.15, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FeatureCards;
