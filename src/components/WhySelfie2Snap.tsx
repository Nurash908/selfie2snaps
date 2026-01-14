import { motion } from "framer-motion";
import { Zap, Palette, Smartphone, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant AI Processing",
    color: "hsl(270 95% 65%)",
  },
  {
    icon: Palette,
    title: "Multiple Creative Styles",
    color: "hsl(35 100% 60%)",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly",
    color: "hsl(200 90% 55%)",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    color: "hsl(160 80% 50%)",
  },
];

const WhySelfie2Snap = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-10 mb-6"
    >
      <motion.h2
        className="text-center text-sm font-mono tracking-widest text-muted-foreground uppercase mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        Why Selfie2Snap?
      </motion.h2>

      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + index * 0.1 }}
            className="relative p-4 rounded-xl overflow-hidden group cursor-default"
            style={{
              background: "linear-gradient(135deg, hsl(250 25% 12%) 0%, hsl(250 25% 8%) 100%)",
              border: "1px solid hsl(250 20% 18%)",
            }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${feature.color.replace(")", " / 0.1)")}, transparent 70%)`,
              }}
            />

            <div className="relative flex flex-col items-center text-center gap-2">
              <motion.div
                className="p-2.5 rounded-lg"
                style={{
                  background: `${feature.color.replace(")", " / 0.15)")}`,
                }}
                animate={{
                  boxShadow: [
                    `0 0 0 ${feature.color.replace(")", " / 0)")}`,
                    `0 0 15px ${feature.color.replace(")", " / 0.3)")}`,
                    `0 0 0 ${feature.color.replace(")", " / 0)")}`,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                <feature.icon
                  className="w-5 h-5"
                  style={{ color: feature.color }}
                />
              </motion.div>
              <span className="text-xs font-medium text-foreground leading-tight">
                {feature.title}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WhySelfie2Snap;
