import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react";

interface StyleSample {
  id: string;
  label: string;
  description: string;
  color: string;
  sampleImage: string;
}

const styleSamples: StyleSample[] = [
  {
    id: "natural",
    label: "Natural",
    description: "Clean, authentic look with soft lighting",
    color: "hsl(160 60% 50%)",
    sampleImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&q=80",
  },
  {
    id: "cinematic",
    label: "Cinematic",
    description: "Movie-quality lighting and color grading",
    color: "hsl(35 100% 60%)",
    sampleImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&q=80",
  },
  {
    id: "anime",
    label: "Anime",
    description: "Japanese animation style with vibrant colors",
    color: "hsl(330 90% 65%)",
    sampleImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=500&fit=crop&q=80",
  },
  {
    id: "sketch",
    label: "Sketch",
    description: "Artistic pencil drawing aesthetic",
    color: "hsl(0 0% 60%)",
    sampleImage: "https://images.unsplash.com/photo-1596638787647-904d822d751e?w=400&h=500&fit=crop&q=80",
  },
  {
    id: "vintage",
    label: "Vintage",
    description: "Retro film photography vibes",
    color: "hsl(30 70% 50%)",
    sampleImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&q=80",
  },
  {
    id: "neon",
    label: "Neon",
    description: "Cyberpunk-inspired glowing effects",
    color: "hsl(270 95% 65%)",
    sampleImage: "https://images.unsplash.com/photo-1526510747491-27d6c4c8b878?w=400&h=500&fit=crop&q=80",
  },
  {
    id: "watercolor",
    label: "Watercolor",
    description: "Soft, dreamy painted look",
    color: "hsl(200 70% 60%)",
    sampleImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&q=80",
  },
  {
    id: "pop-art",
    label: "Pop Art",
    description: "Bold colors inspired by Warhol",
    color: "hsl(50 100% 50%)",
    sampleImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop&q=80",
  },
];

const StyleSampleGallery = () => {
  const [selectedStyle, setSelectedStyle] = useState<StyleSample | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleCount = 4;
  const maxIndex = Math.max(0, styleSamples.length - visibleCount);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleStyles = styleSamples.slice(currentIndex, currentIndex + visibleCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
            Style Gallery
          </h3>
        </div>
        
        {/* Navigation arrows */}
        <div className="flex items-center gap-1">
          <motion.button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "hsl(250 25% 15%)",
              border: "1px solid hsl(250 20% 22%)",
            }}
            whileHover={currentIndex > 0 ? { scale: 1.1 } : {}}
            whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          <motion.button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "hsl(250 25% 15%)",
              border: "1px solid hsl(250 20% 22%)",
            }}
            whileHover={currentIndex < maxIndex ? { scale: 1.1 } : {}}
            whileTap={currentIndex < maxIndex ? { scale: 0.95 } : {}}
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Sample Cards Grid */}
      <div className="grid grid-cols-4 gap-2">
        <AnimatePresence mode="popLayout">
          {visibleStyles.map((style, index) => (
            <motion.button
              key={style.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedStyle(style)}
              className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer"
              style={{
                border: `2px solid ${style.color}40`,
              }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Sample Image */}
              <img
                src={style.sampleImage}
                alt={style.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${style.color}90 0%, transparent 60%)`,
                }}
              />

              {/* Style Label */}
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider drop-shadow-lg">
                  {style.label}
                </span>
              </div>

              {/* Hover Glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 30px ${style.color}60`,
                }}
              />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-3">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{
              background: index === currentIndex ? "hsl(270 95% 65%)" : "hsl(250 20% 25%)",
            }}
            whileHover={{ scale: 1.3 }}
          />
        ))}
      </div>

      {/* Expanded Preview Modal */}
      <AnimatePresence>
        {selectedStyle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "hsl(0 0% 0% / 0.9)" }}
            onClick={() => setSelectedStyle(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-sm w-full rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, hsl(250 30% 12%) 0%, hsl(250 25% 8%) 100%)",
                border: `2px solid ${selectedStyle.color}60`,
                boxShadow: `0 0 60px ${selectedStyle.color}30`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setSelectedStyle(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full"
                style={{
                  background: "hsl(0 0% 0% / 0.6)",
                  backdropFilter: "blur(8px)",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>

              {/* Large Preview Image */}
              <div className="aspect-[3/4] relative">
                <img
                  src={selectedStyle.sampleImage}
                  alt={selectedStyle.label}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, hsl(250 25% 8%) 0%, transparent 40%)`,
                  }}
                />
              </div>

              {/* Style Info */}
              <div className="p-5 -mt-16 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    className="w-3 h-3 rounded-full"
                    style={{ background: selectedStyle.color }}
                    animate={{
                      boxShadow: [
                        `0 0 10px ${selectedStyle.color}`,
                        `0 0 20px ${selectedStyle.color}`,
                        `0 0 10px ${selectedStyle.color}`,
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <h4 className="text-lg font-serif font-bold text-foreground">
                    {selectedStyle.label}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedStyle.description}
                </p>

                {/* Style tag */}
                <motion.div
                  className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: `${selectedStyle.color}20`,
                    border: `1px solid ${selectedStyle.color}40`,
                  }}
                >
                  <Sparkles className="w-3 h-3" style={{ color: selectedStyle.color }} />
                  <span className="text-xs font-mono" style={{ color: selectedStyle.color }}>
                    AI Style Available
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StyleSampleGallery;
