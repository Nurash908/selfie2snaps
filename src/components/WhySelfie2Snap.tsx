import { motion } from "framer-motion";
import { Zap, Palette, Smartphone, Shield } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const features = [
  {
    icon: Zap,
    title: "Instant AI Processing",
    description: "Results in seconds",
    color: "hsl(270 95% 65%)",
  },
  {
    icon: Palette,
    title: "Multiple Creative Styles",
    description: "8+ unique styles",
    color: "hsl(35 100% 60%)",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly",
    description: "Works everywhere",
    color: "hsl(200 90% 55%)",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Images auto-deleted",
    color: "hsl(160 80% 50%)",
  },
];

const WhySelfie2Snap = () => {
  const { ref, inView } = useInView({ rootMargin: "50px" });

  return (
    <div ref={ref}>
      {inView && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 mb-6"
        >
          <h2 className="text-center text-xs font-mono tracking-[0.3em] text-muted-foreground/60 uppercase mb-5">
            Why Selfie2Snap?
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 * index }}
                className="relative p-4 rounded-2xl overflow-hidden group cursor-default"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(250 25% 12%) 0%, hsl(250 25% 8%) 100%)",
                  border: "1px solid hsl(250 20% 18%)",
                }}
                whileHover={{ scale: 1.03, y: -2 }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${feature.color.replace(")", " / 0.08)")}, transparent 70%)`,
                  }}
                />

                <div className="relative flex flex-col items-center text-center gap-2.5">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{
                      background: `${feature.color.replace(")", " / 0.12)")}`,
                      border: `1px solid ${feature.color.replace(")", " / 0.2)")}`,
                    }}
                  >
                    <feature.icon
                      className="w-5 h-5"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground leading-tight block">
                      {feature.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 mt-0.5 block">
                      {feature.description}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WhySelfie2Snap;
