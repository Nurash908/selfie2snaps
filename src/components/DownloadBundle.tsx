import { motion, AnimatePresence } from "framer-motion";
import { Download, Video, Image, Package, Sparkles, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface DownloadBundleProps {
  frames: string[];
  onDownload: (type: "frames" | "video" | "collage" | "all") => void;
}

const infusingMessages = [
  "Infusing moments...",
  "Crystallizing memories...",
  "Weaving magic...",
  "Capturing essence...",
  "Sealing perfection...",
];

const DownloadBundle = ({ frames, onDownload }: DownloadBundleProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [downloadingItem, setDownloadingItem] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const { playSound } = useSoundEffects();

  const handleDownload = async (type: "frames" | "video" | "collage" | "all") => {
    playSound("generate");
    setDownloadingItem(type);
    setDownloadProgress(0);
    setCurrentMessage(0);

    // Simulate download process with progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 75));
      setDownloadProgress(i);
      if (i % 25 === 0 && i < 100) {
        setCurrentMessage((prev) => (prev + 1) % infusingMessages.length);
      }
    }

    playSound("success");
    onDownload(type);
    
    // Show completion briefly
    await new Promise(resolve => setTimeout(resolve, 500));
    setDownloadingItem(null);
    setDownloadProgress(0);
  };

  const downloadOptions = [
    {
      id: "frames",
      icon: Image,
      label: "Individual Frames",
      description: "Download all frames as separate images",
      color: "hsl(270 95% 65%)",
      gradient: "linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 50%))",
    },
    {
      id: "video",
      icon: Video,
      label: "3-Second Video",
      description: "Animated slideshow of your snaps",
      color: "hsl(35 100% 60%)",
      gradient: "linear-gradient(135deg, hsl(35 100% 55%), hsl(45 100% 50%))",
    },
    {
      id: "collage",
      icon: Package,
      label: "Polaroid Collage",
      description: "Instagram-ready photo collage",
      color: "hsl(300 80% 60%)",
      gradient: "linear-gradient(135deg, hsl(300 80% 55%), hsl(320 80% 50%))",
    },
  ];

  // Generate floating particles
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Background particles */}
      {downloadingItem && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary"
              style={{ left: `${particle.x}%`, bottom: 0 }}
              animate={{
                y: [0, -200],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 2,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      <motion.h3
        className="text-xl font-serif font-semibold text-center mb-2 text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Download Your Bundle
      </motion.h3>

      {/* Infusing message during download */}
      <AnimatePresence mode="wait">
        {downloadingItem ? (
          <motion.p
            key={currentMessage}
            className="text-center text-sm text-primary mb-6 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
            {infusingMessages[currentMessage]}
          </motion.p>
        ) : (
          <motion.p
            className="text-center text-sm text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Choose your preferred format
          </motion.p>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {downloadOptions.map((option, index) => {
          const isDownloading = downloadingItem === option.id;
          const isComplete = !downloadingItem && downloadProgress === 0;
          
          return (
            <motion.button
              key={option.id}
              className="relative p-6 rounded-2xl text-left overflow-hidden group"
              style={{
                background: "hsl(250 25% 12%)",
                border: `1px solid ${hoveredItem === option.id ? option.color : "hsl(250 20% 20%)"}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onHoverStart={() => setHoveredItem(option.id)}
              onHoverEnd={() => setHoveredItem(null)}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload(option.id as "frames" | "video" | "collage")}
              disabled={downloadingItem !== null}
            >
              {/* Animated glow effect on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(circle at center, ${option.color}20, transparent 70%)`,
                }}
                animate={{ opacity: hoveredItem === option.id ? 1 : 0 }}
              />

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.1) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />

              <div className="relative z-10">
                <motion.div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden"
                  style={{
                    background: `${option.color}15`,
                    border: `1px solid ${option.color}30`,
                  }}
                >
                  {isDownloading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-6 h-6" style={{ color: option.color }} />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={hoveredItem === option.id ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <option.icon className="w-6 h-6" style={{ color: option.color }} />
                    </motion.div>
                  )}

                  {/* Icon background glow */}
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `${option.color}20` }}
                    animate={hoveredItem === option.id ? { 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>

                <h4 className="font-semibold text-foreground mb-1">{option.label}</h4>
                <p className="text-xs text-muted-foreground">{option.description}</p>

                {/* Download progress bar */}
                {isDownloading && (
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-1 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: option.gradient }}
                      initial={{ width: 0 }}
                      animate={{ width: `${downloadProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Download All button */}
      <motion.button
        className="w-full py-4 rounded-2xl font-semibold text-lg relative overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 50%), hsl(35 100% 55%))",
          backgroundSize: "200% 200%",
          boxShadow: "0 8px 32px hsl(270 95% 55% / 0.3)",
        }}
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 12px 40px hsl(270 95% 55% / 0.5)"
        }}
        whileTap={{ scale: 0.98 }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ backgroundPosition: { duration: 4, repeat: Infinity } }}
        onClick={() => handleDownload("all")}
        disabled={downloadingItem !== null}
      >
        {/* Shine sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.2) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />

        <span className="relative z-10 flex items-center justify-center gap-3 text-foreground">
          {downloadingItem === "all" ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-5 h-5" />
              </motion.div>
              {infusingMessages[currentMessage]}
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download Complete Bundle
            </>
          )}
        </span>

        {/* Progress overlay for all */}
        {downloadingItem === "all" && (
          <motion.div
            className="absolute inset-0 bg-foreground/10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: downloadProgress / 100 }}
            style={{ transformOrigin: "left" }}
          />
        )}
      </motion.button>

      {/* Preview thumbnails with hover effects */}
      <motion.div
        className="mt-6 flex justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {frames.slice(0, 5).map((frame, index) => (
          <motion.div
            key={index}
            className="w-12 h-12 rounded-lg overflow-hidden relative"
            style={{
              border: "2px solid hsl(270 95% 65% / 0.3)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ 
              scale: 1.3, 
              zIndex: 10,
              borderColor: "hsl(270 95% 65%)",
              boxShadow: "0 8px 24px hsl(270 95% 65% / 0.4)"
            }}
          >
            <img src={frame} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
            {/* Hover overlay with check */}
            <motion.div
              className="absolute inset-0 bg-primary/50 flex items-center justify-center opacity-0"
              whileHover={{ opacity: 1 }}
            >
              <Check className="w-4 h-4 text-foreground" />
            </motion.div>
          </motion.div>
        ))}
        {frames.length > 5 && (
          <motion.div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-medium text-muted-foreground"
            style={{
              background: "hsl(250 25% 12%)",
              border: "2px solid hsl(270 95% 65% / 0.2)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.1 }}
          >
            +{frames.length - 5}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DownloadBundle;
