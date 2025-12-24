import { motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";

interface ScratchRevealProps {
  revealImage: string;
  onRevealComplete: () => void;
}

const ScratchReveal = ({ revealImage, onRevealComplete }: ScratchRevealProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const scratch = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    
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

    // Scale coordinates
    x = (x / rect.width) * canvas.width;
    y = (y / rect.height) * canvas.height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();

    // Calculate reveal progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const progress = (transparent / (imageData.data.length / 4)) * 100;
    setRevealProgress(progress);

    if (progress > 60 && !isRevealed) {
      setIsRevealed(true);
      onRevealComplete();
    }
  }, [isScratching, isRevealed, onRevealComplete]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create frosted glass effect
    ctx.fillStyle = "rgba(30, 30, 35, 0.95)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add frost texture
    for (let i = 0; i < 10000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const alpha = Math.random() * 0.1;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }, []);

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        boxShadow: "0 20px 60px hsl(0 0% 0% / 0.4), 0 0 40px hsl(270 95% 65% / 0.2)"
      }}
    >
      {/* Revealed image */}
      <img 
        src={revealImage}
        alt="Revealed"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Scratch canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={533}
        className={`absolute inset-0 w-full h-full cursor-pointer ${isRevealed ? "pointer-events-none" : ""}`}
        onMouseDown={() => { setIsScratching(true); initCanvas(); }}
        onMouseUp={() => setIsScratching(false)}
        onMouseLeave={() => setIsScratching(false)}
        onMouseMove={scratch}
        onTouchStart={() => { setIsScratching(true); initCanvas(); }}
        onTouchEnd={() => setIsScratching(false)}
        onTouchMove={scratch}
        onLoad={initCanvas}
        style={{
          opacity: isRevealed ? 0 : 1,
          transition: "opacity 0.5s ease-out"
        }}
      />

      {/* Instructions */}
      {!isScratching && revealProgress < 10 && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-dashed border-foreground/30"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <p className="mt-4 text-sm text-foreground/60 font-medium tracking-wider">
            SCRATCH TO REVEAL
          </p>
        </motion.div>
      )}

      {/* Progress indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-1"
        style={{
          width: `${revealProgress}%`,
          background: "linear-gradient(90deg, hsl(270 95% 65%), hsl(35 100% 60%))"
        }}
      />
    </motion.div>
  );
};

export default ScratchReveal;