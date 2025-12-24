import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";

interface ScratchRevealProps {
  revealImage: string;
  onRevealComplete: () => void;
}

const ScratchReveal = ({ revealImage, onRevealComplete }: ScratchRevealProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const hasInitialized = useRef(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useTransform(mouseX, (val) => val);
  const glowY = useTransform(mouseY, (val) => val);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || hasInitialized.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    hasInitialized.current = true;

    // Create beautiful frosted glass effect
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "rgba(30, 30, 40, 0.98)");
    gradient.addColorStop(0.5, "rgba(40, 35, 50, 0.95)");
    gradient.addColorStop(1, "rgba(25, 25, 35, 0.98)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add crystalline frost texture
    for (let i = 0; i < 15000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const alpha = Math.random() * 0.15;
      const size = Math.random() * 2;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add subtle color tints
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 30 + Math.random() * 50;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      const hue = Math.random() > 0.5 ? 270 : 35;
      gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.05)`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const scratch = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isScratching || isRevealed) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      let x: number, y: number;

      if ("touches" in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      mouseX.set(x);
      mouseY.set(y);

      // Scale coordinates
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const canvasX = x * scaleX;
      const canvasY = y * scaleY;

      // Create beautiful scratch effect with soft edges
      ctx.globalCompositeOperation = "destination-out";

      // Main scratch circle with feathered edge
      const gradient = ctx.createRadialGradient(canvasX, canvasY, 0, canvasX, canvasY, 50);
      gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
      gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.8)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 50, 0, Math.PI * 2);
      ctx.fill();

      // Add sparkle effect at scratch point
      if (Math.random() > 0.6) {
        setSparkles((prev) => [
          ...prev.slice(-15),
          { id: Date.now(), x, y },
        ]);
      }

      // Calculate reveal progress
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] < 128) transparent++;
      }
      const progress = (transparent / (imageData.data.length / 4)) * 100;
      setRevealProgress(progress);

      if (progress > 55 && !isRevealed) {
        setIsRevealed(true);
        onRevealComplete();
      }
    },
    [isScratching, isRevealed, onRevealComplete, mouseX, mouseY]
  );

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      style={{
        perspective: "1000px",
        boxShadow:
          "0 25px 80px hsl(0 0% 0% / 0.5), 0 0 60px hsl(270 95% 65% / 0.25), 0 0 120px hsl(35 100% 60% / 0.15)",
      }}
    >
      {/* Revealed image with 3D depth */}
      <motion.img
        src={revealImage}
        alt="Revealed"
        className="absolute inset-0 w-full h-full object-cover"
        animate={{
          scale: isRevealed ? 1 : 0.98,
          filter: isRevealed ? "brightness(1)" : "brightness(0.8)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Magical glow following cursor */}
      <motion.div
        className="absolute w-32 h-32 rounded-full pointer-events-none"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, hsl(270 95% 65% / 0.4), transparent 70%)",
          filter: "blur(20px)",
          opacity: isScratching && !isRevealed ? 1 : 0,
        }}
      />

      {/* Scratch canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={533}
        className={`absolute inset-0 w-full h-full cursor-pointer ${
          isRevealed ? "pointer-events-none" : ""
        }`}
        onMouseDown={() => setIsScratching(true)}
        onMouseUp={() => setIsScratching(false)}
        onMouseLeave={() => setIsScratching(false)}
        onMouseMove={scratch}
        onTouchStart={() => setIsScratching(true)}
        onTouchEnd={() => setIsScratching(false)}
        onTouchMove={scratch}
        style={{
          opacity: isRevealed ? 0 : 1,
          transition: "opacity 0.8s ease-out",
        }}
      />

      {/* Sparkle effects */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{ left: sparkle.x, top: sparkle.y }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => {
            setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id));
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <motion.path
              d="M12 2L13.5 9L20 10.5L13.5 12L12 19L10.5 12L4 10.5L10.5 9L12 2Z"
              fill="hsl(35 100% 70%)"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Instructions */}
      {!isScratching && revealProgress < 10 && !isRevealed && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Animated scratch hint */}
            <motion.div
              className="w-20 h-20 rounded-full border-2 border-dashed border-foreground/40"
              animate={{
                rotate: [0, 360],
                borderColor: ["hsl(270 95% 65% / 0.4)", "hsl(35 100% 60% / 0.4)", "hsl(270 95% 65% / 0.4)"],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                borderColor: { duration: 3, repeat: Infinity },
              }}
            />
            <motion.div
              className="absolute inset-4 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(270 95% 65% / 0.3), transparent)",
              }}
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          <motion.p
            className="mt-6 text-sm text-foreground/70 font-medium tracking-widest uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scratch to Reveal
          </motion.p>
        </motion.div>
      )}

      {/* Progress indicator with glow */}
      <motion.div
        className="absolute bottom-0 left-0 h-1.5 rounded-full"
        style={{
          width: `${revealProgress}%`,
          background: "linear-gradient(90deg, hsl(270 95% 65%), hsl(300 80% 60%), hsl(35 100% 60%))",
          boxShadow: "0 0 20px hsl(270 95% 65% / 0.5)",
        }}
      />

      {/* Reveal celebration */}
      {isRevealed && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5 }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                background: i % 3 === 0 ? "hsl(35 100% 60%)" : i % 3 === 1 ? "hsl(270 95% 65%)" : "hsl(0 0% 100%)",
              }}
              initial={{ x: 0, y: 0, scale: 0 }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 500,
                scale: [0, 1.5, 0],
                rotate: Math.random() * 720,
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ScratchReveal;
