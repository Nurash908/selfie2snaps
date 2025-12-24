import { motion } from "framer-motion";
import { Download, Video, Image, Package } from "lucide-react";
import { useState } from "react";

interface DownloadBundleProps {
  frames: string[];
  onDownload: (type: "frames" | "video" | "collage" | "all") => void;
}

const DownloadBundle = ({ frames, onDownload }: DownloadBundleProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [downloadingItem, setDownloadingItem] = useState<string | null>(null);

  const handleDownload = async (type: "frames" | "video" | "collage" | "all") => {
    setDownloadingItem(type);
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 1500));
    onDownload(type);
    setDownloadingItem(null);
  };

  const downloadOptions = [
    {
      id: "frames",
      icon: Image,
      label: "Individual Frames",
      description: "Download all frames as separate images",
      color: "hsl(270 95% 65%)",
    },
    {
      id: "video",
      icon: Video,
      label: "3-Second Video",
      description: "Animated slideshow of your snaps",
      color: "hsl(35 100% 60%)",
    },
    {
      id: "collage",
      icon: Package,
      label: "Polaroid Collage",
      description: "Instagram-ready photo collage",
      color: "hsl(300 80% 60%)",
    },
  ];

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <motion.h3
        className="text-xl font-serif font-semibold text-center mb-6 text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Download Your Bundle
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {downloadOptions.map((option, index) => (
          <motion.button
            key={option.id}
            className="relative p-6 rounded-2xl text-left overflow-hidden group"
            style={{
              background: "hsl(0 0% 10% / 0.5)",
              border: "1px solid hsl(0 0% 100% / 0.1)",
              backdropFilter: "blur(10px)",
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
            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${option.color}20, transparent 70%)`,
              }}
              animate={{ opacity: hoveredItem === option.id ? 1 : 0 }}
            />

            {/* Border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                boxShadow: `inset 0 0 20px ${option.color}30`,
              }}
              animate={{ opacity: hoveredItem === option.id ? 1 : 0 }}
            />

            <div className="relative z-10">
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: `${option.color}20`,
                  border: `1px solid ${option.color}40`,
                }}
                animate={{
                  rotate: downloadingItem === option.id ? 360 : 0,
                }}
                transition={{
                  rotate: { duration: 1, repeat: downloadingItem === option.id ? Infinity : 0, ease: "linear" },
                }}
              >
                <option.icon className="w-6 h-6" style={{ color: option.color }} />
              </motion.div>

              <h4 className="font-semibold text-foreground mb-1">{option.label}</h4>
              <p className="text-xs text-muted-foreground">{option.description}</p>

              {downloadingItem === option.id && (
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${option.color}, transparent)`,
                  }}
                  initial={{ scaleX: 0, transformOrigin: "left" }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5 }}
                />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Download All button */}
      <motion.button
        className="w-full py-4 rounded-2xl font-semibold text-lg relative overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, hsl(270 95% 65%), hsl(300 80% 55%), hsl(35 100% 60%))",
          backgroundSize: "200% 200%",
        }}
        whileHover={{ scale: 1.02, backgroundPosition: "100% 100%" }}
        whileTap={{ scale: 0.98 }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ backgroundPosition: { duration: 4, repeat: Infinity } }}
        onClick={() => handleDownload("all")}
        disabled={downloadingItem !== null}
      >
        <span className="relative z-10 flex items-center justify-center gap-3 text-foreground">
          <Download className="w-5 h-5" />
          {downloadingItem === "all" ? "Preparing Bundle..." : "Download Complete Bundle"}
        </span>

        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 opacity-50"
          style={{
            background: "linear-gradient(135deg, hsl(270 95% 65%), hsl(35 100% 60%))",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Preview thumbnails */}
      <motion.div
        className="mt-6 flex justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {frames.slice(0, 5).map((frame, index) => (
          <motion.div
            key={index}
            className="w-12 h-12 rounded-lg overflow-hidden"
            style={{
              border: "2px solid hsl(0 0% 100% / 0.1)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.2, zIndex: 10 }}
          >
            <img src={frame} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
          </motion.div>
        ))}
        {frames.length > 5 && (
          <motion.div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-medium text-muted-foreground"
            style={{
              background: "hsl(0 0% 10%)",
              border: "2px solid hsl(0 0% 100% / 0.1)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            +{frames.length - 5}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DownloadBundle;
