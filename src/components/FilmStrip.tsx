import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Download, Heart, Share2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface FilmStripProps {
  frames: string[];
  onBless: () => void;
}

const FilmStrip = ({ frames, onBless }: FilmStripProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [blessedFrames, setBlessedFrames] = useState<Set<number>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Particle system for continuous ambient effect
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newParticle = {
          id: Date.now(),
          x: Math.random() * 100,
          y: 100,
          color: Math.random() > 0.5 ? "hsl(35 100% 60%)" : "hsl(270 95% 65%)",
        };
        setParticles((prev) => [...prev.slice(-20), newParticle]);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleBless = (index: number, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const newBlessed = new Set(blessedFrames);
    if (newBlessed.has(index)) {
      newBlessed.delete(index);
    } else {
      newBlessed.add(index);

      // Elaborate confetti explosion
      const colors = ["#FFD700", "#FFA500", "#FF6B6B", "#FFE4B5", "#FFDAB9"];
      const heartShape = confetti.shapeFromText({ text: "❤️", scalar: 2 });

      // Gold confetti burst
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x, y },
        colors: colors,
        ticks: 200,
        gravity: 0.8,
        scalar: 1.2,
        shapes: ["circle", "square"],
      });

      // Heart particles
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { x, y },
          shapes: [heartShape],
          scalar: 3,
          gravity: 0.5,
          ticks: 150,
        });
      }, 100);

      // Sparkle effect
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 180,
          origin: { x, y },
          colors: ["#FFD700", "#FFF8DC"],
          startVelocity: 30,
          gravity: 0.3,
          ticks: 100,
          shapes: ["star"],
          scalar: 0.8,
        });
      }, 200);

      onBless();
    }
    setBlessedFrames(newBlessed);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="w-full relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onMouseMove={handleMouseMove}
    >
      {/* Ambient floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{ background: particle.color, left: `${particle.x}%` }}
          initial={{ y: "100%", opacity: 0, scale: 0 }}
          animate={{ y: "-100%", opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 3, ease: "easeOut" }}
          onAnimationComplete={() => {
            setParticles((prev) => prev.filter((p) => p.id !== particle.id));
          }}
        />
      ))}

      {/* 3D Lighting effect following cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(270 95% 65% / 0.3), transparent 50%)`,
        }}
      />

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-serif font-semibold text-foreground flex items-center gap-2">
          Your Snaps
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-secondary" />
          </motion.div>
        </h3>
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(270 95% 65%), hsl(35 100% 60%))",
            backgroundSize: "200% 200%",
          }}
          whileHover={{ scale: 1.05, backgroundPosition: "100% 100%" }}
          whileTap={{ scale: 0.95 }}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
          transition={{ backgroundPosition: { duration: 3, repeat: Infinity } }}
        >
          <Download className="w-4 h-4 text-foreground" />
          <span className="text-foreground">Download All</span>
        </motion.button>
      </div>

      {/* Film strip container with 3D perspective */}
      <div className="relative" style={{ perspective: "1500px" }}>
        {/* Film perforations */}
        <div className="absolute top-0 left-0 right-0 h-4 flex justify-around z-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`top-${i}`}
              className="w-3 h-2 rounded-sm bg-background"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-4 flex justify-around z-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`bottom-${i}`}
              className="w-3 h-2 rounded-sm bg-background"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>

        {/* Film strip with 3D tilt */}
        <motion.div
          className="py-6 px-2 overflow-x-auto scrollbar-hide"
          style={{
            background: "linear-gradient(180deg, hsl(0 0% 8%), hsl(0 0% 12%), hsl(0 0% 8%))",
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateX: (mousePos.y - 0.5) * 5,
            rotateY: (mousePos.x - 0.5) * -5,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="flex gap-4" style={{ transformStyle: "preserve-3d" }}>
            {frames.map((frame, index) => (
              <motion.div
                key={index}
                className="relative flex-shrink-0 group"
                initial={{ opacity: 0, scale: 0.8, rotateY: -30, z: -100 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="w-44 h-56 rounded-lg overflow-hidden relative"
                  style={{
                    transformStyle: "preserve-3d",
                    boxShadow:
                      hoveredIndex === index
                        ? "0 30px 60px hsl(0 0% 0% / 0.5), 0 0 50px hsl(270 95% 65% / 0.4), 0 0 100px hsl(35 100% 60% / 0.2)"
                        : "0 10px 30px hsl(0 0% 0% / 0.3)",
                  }}
                  animate={{
                    rotateY: hoveredIndex === index ? 8 : 0,
                    rotateX: hoveredIndex === index ? -8 : 0,
                    scale: hoveredIndex === index ? 1.1 : 1,
                    z: hoveredIndex === index ? 50 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Holographic shimmer effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      background:
                        "linear-gradient(135deg, transparent 30%, hsl(270 95% 75% / 0.2) 50%, transparent 70%)",
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <img
                    src={frame}
                    alt={`Frame ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Blessed glow ring */}
                  <AnimatePresence>
                    {blessedFrames.has(index) && (
                      <motion.div
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        style={{
                          boxShadow:
                            "inset 0 0 20px hsl(35 100% 60% / 0.5), 0 0 30px hsl(35 100% 60% / 0.3)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Overlay actions */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex items-end justify-center gap-3 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  >
                    <motion.button
                      onClick={(e) => handleBless(index, e)}
                      className={`p-3 rounded-full backdrop-blur-md transition-all ${
                        blessedFrames.has(index)
                          ? "bg-secondary text-secondary-foreground shadow-lg"
                          : "bg-card/60 text-foreground hover:bg-card/80"
                      }`}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.8 }}
                      style={{
                        boxShadow: blessedFrames.has(index)
                          ? "0 0 20px hsl(35 100% 60% / 0.5)"
                          : "none",
                      }}
                    >
                      <Heart
                        className="w-5 h-5"
                        fill={blessedFrames.has(index) ? "currentColor" : "none"}
                      />
                    </motion.button>
                    <motion.button
                      className="p-3 rounded-full bg-card/60 backdrop-blur-md text-foreground hover:bg-card/80"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      className="p-3 rounded-full bg-card/60 backdrop-blur-md text-foreground hover:bg-card/80"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Frame number with 3D effect */}
                <motion.p
                  className="text-center mt-3 text-xs text-muted-foreground font-mono"
                  animate={{
                    textShadow:
                      hoveredIndex === index
                        ? "0 0 10px hsl(270 95% 65%)"
                        : "none",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FilmStrip;
