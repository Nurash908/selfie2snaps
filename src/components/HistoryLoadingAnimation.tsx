import { motion } from "framer-motion";
import { Sparkles, Stars, Wand2, Camera, Heart, Zap } from "lucide-react";

const floatingIcons = [
  { Icon: Sparkles, delay: 0, color: "hsl(270 95% 65%)" },
  { Icon: Stars, delay: 0.2, color: "hsl(35 100% 60%)" },
  { Icon: Wand2, delay: 0.4, color: "hsl(300 80% 55%)" },
  { Icon: Camera, delay: 0.6, color: "hsl(200 90% 55%)" },
  { Icon: Heart, delay: 0.8, color: "hsl(340 80% 55%)" },
  { Icon: Zap, delay: 1, color: "hsl(50 100% 50%)" },
];

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 2,
  duration: Math.random() * 3 + 2,
}));

const HistoryLoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-6 relative overflow-hidden">
      {/* Background particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `hsl(${270 + Math.random() * 60} 80% 60% / 0.5)`,
            boxShadow: `0 0 ${particle.size * 2}px hsl(270 80% 60% / 0.3)`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Central orb */}
      <motion.div
        className="relative w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle, hsl(270 95% 65% / 0.3) 0%, hsl(270 95% 65% / 0.1) 50%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 30px hsl(270 95% 65% / 0.3)",
            "0 0 60px hsl(270 95% 65% / 0.5)",
            "0 0 30px hsl(270 95% 65% / 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Inner glow */}
        <motion.div
          className="absolute inset-4 rounded-full"
          style={{
            background: "linear-gradient(135deg, hsl(270 95% 65% / 0.5), hsl(35 100% 60% / 0.3))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Spinning ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed"
          style={{ borderColor: "hsl(270 95% 65% / 0.4)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Center icon */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-primary relative z-10" />
        </motion.div>
      </motion.div>

      {/* Orbiting icons */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {floatingIcons.map(({ Icon, delay, color }, index) => {
          const angle = (index / floatingIcons.length) * 360;
          const radius = 80;
          return (
            <motion.div
              key={index}
              className="absolute"
              style={{
                transformOrigin: "center",
              }}
              animate={{
                x: [
                  Math.cos((angle * Math.PI) / 180) * radius,
                  Math.cos(((angle + 360) * Math.PI) / 180) * radius,
                ],
                y: [
                  Math.sin((angle * Math.PI) / 180) * radius,
                  Math.sin(((angle + 360) * Math.PI) / 180) * radius,
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
                delay: delay,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Text animation */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.p
          className="text-muted-foreground font-medium"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Curating Your Memories
        </motion.p>
        
        <motion.div className="flex items-center justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Shimmer line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(270 95% 65%), transparent)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default HistoryLoadingAnimation;
