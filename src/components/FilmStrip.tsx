import { motion } from "framer-motion";
import { useState } from "react";
import { Download, Heart, Share2 } from "lucide-react";

interface FilmStripProps {
  frames: string[];
  onBless: () => void;
}

const FilmStrip = ({ frames, onBless }: FilmStripProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [blessedFrames, setBlessedFrames] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  const handleBless = (index: number) => {
    const newBlessed = new Set(blessedFrames);
    if (newBlessed.has(index)) {
      newBlessed.delete(index);
    } else {
      newBlessed.add(index);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
      onBless();
    }
    setBlessedFrames(newBlessed);
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-serif font-semibold text-foreground">Your Snaps</h3>
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            background: "linear-gradient(135deg, hsl(270 95% 65%), hsl(35 100% 60%))",
            color: "hsl(0 0% 100%)"
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" />
          Download All
        </motion.button>
      </div>

      {/* Film strip container */}
      <div className="relative">
        {/* Film perforations */}
        <div className="absolute top-0 left-0 right-0 h-4 flex justify-around">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={`top-${i}`} className="w-3 h-2 rounded-sm bg-background" />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-4 flex justify-around">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={`bottom-${i}`} className="w-3 h-2 rounded-sm bg-background" />
          ))}
        </div>

        {/* Film strip */}
        <div 
          className="py-6 px-2 overflow-x-auto scrollbar-hide"
          style={{
            background: "linear-gradient(180deg, hsl(0 0% 8%), hsl(0 0% 12%), hsl(0 0% 8%))"
          }}
        >
          <div className="flex gap-4">
            {frames.map((frame, index) => (
              <motion.div
                key={index}
                className="relative flex-shrink-0 group"
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                style={{
                  perspective: "1000px"
                }}
              >
                <motion.div
                  className="w-40 h-52 rounded-lg overflow-hidden"
                  style={{
                    boxShadow: hoveredIndex === index 
                      ? "0 20px 40px hsl(0 0% 0% / 0.4), 0 0 30px hsl(270 95% 65% / 0.3)"
                      : "0 10px 30px hsl(0 0% 0% / 0.3)"
                  }}
                  animate={{
                    rotateY: hoveredIndex === index ? 5 : 0,
                    rotateX: hoveredIndex === index ? -5 : 0,
                    scale: hoveredIndex === index ? 1.05 : 1
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img 
                    src={frame} 
                    alt={`Frame ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay actions */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center gap-3 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  >
                    <motion.button
                      onClick={() => handleBless(index)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        blessedFrames.has(index) 
                          ? "bg-secondary text-secondary-foreground" 
                          : "bg-card/50 text-foreground"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart 
                        className="w-5 h-5" 
                        fill={blessedFrames.has(index) ? "currentColor" : "none"}
                      />
                    </motion.button>
                    <motion.button
                      className="p-2 rounded-full bg-card/50 backdrop-blur-sm text-foreground"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      className="p-2 rounded-full bg-card/50 backdrop-blur-sm text-foreground"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Frame number */}
                <p className="text-center mt-2 text-xs text-muted-foreground font-mono">
                  {String(index + 1).padStart(2, '0')}
                </p>

                {/* Confetti on bless */}
                {blessedFrames.has(index) && showConfetti && (
                  <>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={`confetti-${i}`}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          left: "50%",
                          top: "50%",
                          background: i % 2 === 0 ? "hsl(35 100% 60%)" : "hsl(270 95% 65%)"
                        }}
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{
                          x: (Math.random() - 0.5) * 100,
                          y: Math.random() * -80 - 20,
                          scale: 0,
                          opacity: 0
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    ))}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilmStrip;