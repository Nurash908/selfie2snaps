import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  Camera,
  Sunset,
  Film,
  Palette,
  Zap,
  CircleOff,
  Moon,
  Sun,
  Cloud,
  Flame
} from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface StylePreviewGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  currentFrame: string;
  currentStyle: string;
  onStyleSelect: (style: string) => void;
}

const styles = [
  { id: "natural", label: "Natural", icon: Camera, description: "Original, true-to-life colors", filter: "none" },
  { id: "vintage", label: "Vintage", icon: Sunset, description: "Warm, nostalgic film look", filter: "sepia(30%) contrast(1.1) brightness(0.95)" },
  { id: "cinematic", label: "Cinematic", icon: Film, description: "Dramatic movie tones", filter: "contrast(1.2) saturate(0.9) brightness(0.9)" },
  { id: "vibrant", label: "Vibrant", icon: Palette, description: "Bold, punchy colors", filter: "saturate(1.5) contrast(1.1)" },
  { id: "neon", label: "Neon", icon: Zap, description: "Electric, glowing effect", filter: "saturate(1.8) contrast(1.3) hue-rotate(10deg)" },
  { id: "bw", label: "B&W", icon: CircleOff, description: "Classic monochrome", filter: "grayscale(100%) contrast(1.2)" },
  { id: "sepia", label: "Sepia", icon: Moon, description: "Timeless brown tones", filter: "sepia(80%) brightness(0.95)" },
  { id: "hdr", label: "HDR", icon: Sun, description: "High dynamic range", filter: "contrast(1.4) saturate(1.2) brightness(1.05)" },
  { id: "dreamy", label: "Dreamy", icon: Cloud, description: "Soft, ethereal glow", filter: "brightness(1.1) contrast(0.9) saturate(1.1) blur(0.5px)" },
  { id: "warm", label: "Warm", icon: Flame, description: "Golden hour vibes", filter: "sepia(20%) saturate(1.2) brightness(1.05)" },
];

const StylePreviewGallery = ({ 
  isOpen, 
  onClose, 
  currentFrame, 
  currentStyle,
  onStyleSelect 
}: StylePreviewGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(() => 
    styles.findIndex(s => s.id === currentStyle) || 0
  );
  const { playSound } = useSoundEffects();

  const handlePrev = () => {
    playSound("click");
    setActiveIndex((prev) => (prev - 1 + styles.length) % styles.length);
  };

  const handleNext = () => {
    playSound("click");
    setActiveIndex((prev) => (prev + 1) % styles.length);
  };

  const handleSelect = () => {
    playSound("success");
    onStyleSelect(styles[activeIndex].id);
    onClose();
  };

  const activeStyle = styles[activeIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "hsl(250 30% 5% / 0.95)", backdropFilter: "blur(12px)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsl(250 30% 12%) 0%, hsl(250 25% 8%) 100%)",
              border: "1px solid hsl(250 30% 20%)",
            }}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div>
                <h3 className="text-lg font-serif font-bold text-foreground">Style Preview</h3>
                <p className="text-xs text-muted-foreground">See how different styles transform your photo</p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full"
                style={{ background: "hsl(250 25% 20%)" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Preview Area */}
            <div className="relative p-4">
              {/* Main Preview */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4">
                <motion.img
                  key={activeStyle.id}
                  src={currentFrame}
                  alt="Style preview"
                  className="w-full h-full object-cover"
                  style={{ filter: activeStyle.filter }}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Style badge */}
                <motion.div
                  className="absolute top-3 left-3 px-3 py-1.5 rounded-full flex items-center gap-2"
                  style={{ background: "hsl(250 25% 10% / 0.9)", backdropFilter: "blur(8px)" }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <activeStyle.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{activeStyle.label}</span>
                </motion.div>

                {/* Navigation arrows */}
                <motion.button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full"
                  style={{ background: "hsl(250 25% 15% / 0.9)" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </motion.button>

                <motion.button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full"
                  style={{ background: "hsl(250 25% 15% / 0.9)" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>

              {/* Style description */}
              <motion.p
                key={activeStyle.id}
                className="text-center text-sm text-muted-foreground mb-4"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {activeStyle.description}
              </motion.p>

              {/* Thumbnail strip */}
              <div className="flex gap-2 overflow-x-auto pb-2 px-1">
                {styles.map((style, index) => {
                  const Icon = style.icon;
                  const isActive = index === activeIndex;
                  const isCurrent = style.id === currentStyle;
                  
                  return (
                    <motion.button
                      key={style.id}
                      onClick={() => {
                        playSound("click");
                        setActiveIndex(index);
                      }}
                      className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden ${
                        isActive ? "ring-2 ring-primary" : ""
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={currentFrame}
                        alt={style.label}
                        className="w-full h-full object-cover"
                        style={{ filter: style.filter }}
                      />
                      {isCurrent && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/30">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 border-t border-border/30 flex gap-3">
              <motion.button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-muted-foreground"
                style={{ background: "hsl(250 25% 15%)" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSelect}
                disabled={activeStyle.id === currentStyle}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(35 100% 55%))",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-4 h-4" />
                Apply Style
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StylePreviewGallery;
