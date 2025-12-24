import { motion, AnimatePresence } from "framer-motion";
import { Upload, User } from "lucide-react";
import { useState, useCallback } from "react";

interface GlassSphereProps {
  label: string;
  image: string | null;
  onImageUpload: (file: File) => void;
  isConnected?: boolean;
  variant?: "left" | "right";
}

const GlassSphere = ({ label, image, onImageUpload, isConnected, variant = "left" }: GlassSphereProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAbsorbing, setIsAbsorbing] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setIsAbsorbing(true);
      setTimeout(() => {
        onImageUpload(file);
        setIsAbsorbing(false);
      }, 600);
    }
  }, [onImageUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAbsorbing(true);
      setTimeout(() => {
        onImageUpload(file);
        setIsAbsorbing(false);
      }, 600);
    }
  }, [onImageUpload]);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: variant === "left" ? 0.2 : 0.4, duration: 0.6 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: variant === "left" 
            ? "radial-gradient(circle, hsl(270 95% 65% / 0.3), transparent 70%)"
            : "radial-gradient(circle, hsl(35 100% 60% / 0.3), transparent 70%)"
        }}
        animate={{
          scale: isDragging ? 1.3 : isConnected ? [1, 1.1, 1] : 1,
          opacity: isDragging ? 0.8 : isConnected ? 0.6 : 0.4,
        }}
        transition={{ duration: 0.5, repeat: isConnected ? Infinity : 0, repeatDelay: 1 }}
      />

      {/* Main sphere */}
      <motion.div
        className="relative w-48 h-48 md:w-56 md:h-56 rounded-full cursor-pointer overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(0 0% 15% / 0.6), hsl(0 0% 8% / 0.8))",
          backdropFilter: "blur(20px)",
          border: "1px solid hsl(0 0% 100% / 0.1)",
          boxShadow: `
            inset 0 1px 1px hsl(0 0% 100% / 0.1),
            0 0 40px ${variant === "left" ? "hsl(270 95% 65% / 0.2)" : "hsl(35 100% 60% / 0.2)"},
            0 20px 40px hsl(0 0% 0% / 0.3)
          `,
        }}
        animate={{
          scale: isDragging ? 1.1 : isAbsorbing ? 0.95 : 1,
          y: [0, -10, 0],
        }}
        transition={{
          scale: { duration: 0.3 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />

        <AnimatePresence mode="wait">
          {image ? (
            <motion.img
              key="image"
              src={image}
              alt="Uploaded"
              className="absolute inset-0 w-full h-full object-cover rounded-full"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <motion.div
              key="placeholder"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ 
                  scale: isDragging ? 1.2 : 1,
                  opacity: isDragging ? 1 : 0.6 
                }}
              >
                {variant === "left" ? (
                  <User className="w-12 h-12 text-primary" />
                ) : (
                  <User className="w-12 h-12 text-secondary" />
                )}
              </motion.div>
              <span className="text-sm text-muted-foreground font-medium tracking-wide">
                {isDragging ? "Drop here" : "Upload selfie"}
              </span>
              <Upload className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Absorbing animation */}
        <AnimatePresence>
          {isAbsorbing && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: variant === "left"
                  ? "radial-gradient(circle, hsl(270 95% 65% / 0.5), transparent)"
                  : "radial-gradient(circle, hsl(35 100% 60% / 0.5), transparent)"
              }}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      <motion.p
        className="text-center mt-4 text-sm font-medium tracking-widest uppercase"
        style={{
          color: variant === "left" ? "hsl(270 95% 75%)" : "hsl(35 100% 70%)"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
};

export default GlassSphere;