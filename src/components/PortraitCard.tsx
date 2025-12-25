import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Check } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface PortraitCardProps {
  label: string;
  image: string | null;
  onImageUpload: (file: File) => void;
  onRemoveImage: () => void;
}

const PortraitCard = ({ label, image, onImageUpload, onRemoveImage }: PortraitCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useSoundEffects();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      playSound("upload");
      onImageUpload(file);
    }
  }, [onImageUpload, playSound]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    playSound("click");
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playSound("upload");
      onImageUpload(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound("click");
    onRemoveImage();
  };

  return (
    <motion.div
      className="relative w-full max-w-[180px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <motion.div
        className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
        style={{
          background: "linear-gradient(180deg, hsl(250 25% 15%) 0%, hsl(250 25% 10%) 100%)",
          border: isDragging ? "2px solid hsl(270 95% 65%)" : "2px dashed hsl(250 20% 25%)",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        animate={{
          borderColor: isDragging ? "hsl(270 95% 65%)" : "hsl(250 20% 25%)",
          boxShadow: isDragging ? "0 0 30px hsl(270 95% 65% / 0.3)" : "none",
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/40" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/40" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/40" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/40" />

        <AnimatePresence mode="wait">
          {image ? (
            <motion.div
              key="image"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0"
            >
              <img
                src={image}
                alt={label}
                className="w-full h-full object-cover transition-all duration-300"
                style={{
                  filter: isHovered ? "blur(4px) brightness(0.7)" : "none",
                }}
              />
              {/* Overlay on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.button
                      onClick={handleRemove}
                      className="p-3 rounded-full bg-destructive/80 backdrop-blur-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5 text-destructive-foreground" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Success indicator */}
              <motion.div
                className="absolute top-3 right-3 p-1.5 rounded-full bg-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <Check className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              <motion.div
                className="p-4 rounded-xl"
                style={{ background: "hsl(250 25% 18%)" }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Camera className="w-8 h-8 text-muted-foreground" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      <div className="mt-3 text-center">
        <p className="text-sm font-mono text-foreground tracking-wider">{label}</p>
        {!image && (
          <motion.button
            onClick={handleClick}
            className="mt-2 px-3 py-1 text-xs font-mono tracking-widest text-muted-foreground border border-border/50 rounded hover:border-primary/50 hover:text-primary transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            INITIATE SCAN
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default PortraitCard;
