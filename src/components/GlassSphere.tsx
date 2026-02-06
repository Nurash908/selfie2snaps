import { motion, AnimatePresence } from "framer-motion";
import { Upload, User, Camera, Check } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface GlassSphereProps {
  label: string;
  image: string | null;
  onImageUpload: (file: File) => void;
  onRemoveImage: () => void;
  isConnected?: boolean;
  variant?: "left" | "right";
}

const GlassSphere = ({ label, image, onImageUpload, onRemoveImage, isConnected, variant = "left" }: GlassSphereProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAbsorbing, setIsAbsorbing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const sphereRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSoundEffects();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (sphereRef.current) {
      const rect = sphereRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      playSound('upload');
      setIsAbsorbing(true);
      setTimeout(() => {
        onImageUpload(file);
        setIsAbsorbing(false);
      }, 800);
    }
  }, [onImageUpload, playSound]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playSound('upload');
      setIsAbsorbing(true);
      setTimeout(() => {
        onImageUpload(file);
        setIsAbsorbing(false);
      }, 800);
    }
  }, [onImageUpload, playSound]);

  const rotateX = (mousePos.y - 0.5) * -20;
  const rotateY = (mousePos.x - 0.5) * 20;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: variant === "left" ? 0.2 : 0.4, duration: 0.8, type: "spring" }}
      style={{ perspective: "1000px" }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute -inset-4 rounded-full"
        style={{
          background: variant === "left"
            ? "radial-gradient(circle, hsl(270 95% 65% / 0.3), transparent 70%)"
            : "radial-gradient(circle, hsl(35 100% 60% / 0.3), transparent 70%)",
        }}
        animate={{
          scale: isDragging ? 1.5 : isConnected ? [1, 1.15, 1] : 1,
          opacity: isDragging ? 0.8 : isConnected ? [0.3, 0.5, 0.3] : 0.2,
        }}
        transition={{ duration: 3, repeat: isConnected ? Infinity : 0 }}
      />

      {/* Main sphere with 3D effect */}
      <motion.div
        ref={sphereRef}
        className="relative w-52 h-52 md:w-60 md:h-60 rounded-full cursor-pointer overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 30}%, hsl(0 0% 25% / 0.8), transparent 50%),
            linear-gradient(135deg, hsl(0 0% 18% / 0.7), hsl(0 0% 8% / 0.9))
          `,
          backdropFilter: "blur(20px)",
          border: "1px solid hsl(0 0% 100% / 0.15)",
          boxShadow: `
            inset 0 2px 4px hsl(0 0% 100% / 0.1),
            inset 0 -10px 20px hsl(0 0% 0% / 0.3),
            0 0 40px ${variant === "left" ? "hsl(270 95% 65% / 0.2)" : "hsl(35 100% 60% / 0.2)"},
            0 20px 40px hsl(0 0% 0% / 0.3)
          `,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isDragging ? 1.15 : isAbsorbing ? 0.9 : 1,
          rotateX: isDragging ? 0 : rotateX,
          rotateY: isDragging ? 0 : rotateY,
          y: [0, -10, 0],
        }}
        transition={{
          scale: { duration: 0.4, type: "spring" },
          rotateX: { duration: 0.1 },
          rotateY: { duration: 0.1 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setIsHovered(true);
          if (image) playSound('hover');
        }}
        onMouseLeave={() => setIsHovered(false)}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glass highlight */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at ${mousePos.x * 100}% ${mousePos.y * 50}%, hsl(0 0% 100% / 0.2), transparent 60%)`,
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />

        <AnimatePresence mode="wait">
          {image ? (
            <motion.div
              key="image"
              className="absolute inset-0 rounded-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <motion.img
                src={image}
                alt="Uploaded"
                className="w-full h-full object-cover"
                animate={{
                  filter: isHovered ? 'blur(4px) brightness(0.8)' : 'blur(0px) brightness(1)',
                }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Hover overlay */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/20 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-md"
                      initial={{ y: 10 }}
                      animate={{ y: 0 }}
                    >
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">Uploaded</span>
                    </motion.div>
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        playSound('click');
                        onRemoveImage();
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors underline"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      Remove
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success indicator */}
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center z-20"
                style={{
                  background: "linear-gradient(135deg, hsl(145 80% 45%), hsl(145 80% 35%))",
                  boxShadow: "0 4px 15px hsl(145 80% 45% / 0.4)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
              >
                <Check className="w-4 h-4 text-foreground" strokeWidth={3} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative"
                animate={{
                  scale: isDragging ? 1.3 : 1,
                  rotate: isDragging ? [0, -10, 10, 0] : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {variant === "left" ? (
                  <Camera className="w-14 h-14 text-primary relative z-10" />
                ) : (
                  <User className="w-14 h-14 text-secondary relative z-10" />
                )}
              </motion.div>
              <motion.span
                className="text-sm text-muted-foreground font-medium tracking-wide text-center px-4"
                animate={{ opacity: isDragging ? 1 : [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isDragging ? "Drop to upload!" : "Tap or drag selfie"}
              </motion.span>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Upload className="w-5 h-5 text-muted-foreground/60" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Absorbing vortex animation */}
        <AnimatePresence>
          {isAbsorbing && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, ${
                  variant === "left" ? "hsl(270 95% 65%)" : "hsl(35 100% 60%)"
                }, transparent, ${
                  variant === "left" ? "hsl(270 95% 65%)" : "hsl(35 100% 60%)"
                })`,
              }}
              initial={{ scale: 2, opacity: 0, rotate: 0 }}
              animate={{ scale: 0, opacity: [0, 0.8, 0], rotate: 720 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      <motion.p
        className="text-center mt-5 text-sm font-semibold tracking-[0.2em] uppercase"
        style={{
          color: variant === "left" ? "hsl(270 95% 75%)" : "hsl(35 100% 70%)",
          textShadow: variant === "left"
            ? "0 0 15px hsl(270 95% 65% / 0.4)"
            : "0 0 15px hsl(35 100% 60% / 0.4)",
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
};

export default GlassSphere;
