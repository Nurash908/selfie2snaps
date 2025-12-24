import { motion } from "framer-motion";

const MeshBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Animated mesh gradients */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 30%, hsl(270 95% 65% / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, hsl(35 100% 60% / 0.1) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 30%, hsl(270 95% 65% / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, hsl(35 100% 60% / 0.1) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 80%, hsl(270 95% 65% / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 20%, hsl(35 100% 60% / 0.1) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 30%, hsl(270 95% 65% / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, hsl(35 100% 60% / 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle grain texture */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default MeshBackground;