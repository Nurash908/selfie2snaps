import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full aspect-square rounded-2xl overflow-hidden cursor-ew-resize select-none"
      style={{
        background: "hsl(250 25% 10%)",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onClick={handleClick}
    >
      {/* After Image (full width, behind) */}
      <div className="absolute inset-0">
        <img
          src={afterImage}
          alt={afterLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* After Label */}
        <motion.div
          className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider"
          style={{
            background: "linear-gradient(135deg, hsl(270 95% 55% / 0.9), hsl(300 80% 50% / 0.9))",
            boxShadow: "0 4px 12px hsl(270 95% 55% / 0.3)",
          }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          ✨ {afterLabel}
        </motion.div>
      </div>

      {/* Before Image (clipped by slider) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* Before Label */}
        <motion.div
          className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider"
          style={{
            background: "hsl(250 25% 15% / 0.9)",
            border: "1px solid hsl(0 0% 100% / 0.2)",
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          📸 {beforeLabel}
        </motion.div>
      </div>

      {/* Slider Line */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 -translate-x-1/2 z-10"
        style={{
          left: `${sliderPosition}%`,
          background: "linear-gradient(180deg, hsl(0 0% 100% / 0.9), hsl(270 95% 65% / 0.8), hsl(0 0% 100% / 0.9))",
          boxShadow: isDragging
            ? "0 0 20px hsl(270 95% 65% / 0.6), 0 0 40px hsl(270 95% 65% / 0.3)"
            : "0 0 10px hsl(0 0% 0% / 0.5)",
        }}
        animate={{
          boxShadow: isDragging
            ? "0 0 20px hsl(270 95% 65% / 0.6), 0 0 40px hsl(270 95% 65% / 0.3)"
            : "0 0 10px hsl(0 0% 0% / 0.5)",
        }}
      />

      {/* Slider Handle */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 cursor-grab active:cursor-grabbing"
        style={{
          left: `${sliderPosition}%`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center relative"
          style={{
            background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(35 100% 55%))",
            boxShadow: "0 4px 20px hsl(270 95% 55% / 0.5)",
          }}
          animate={
            isDragging
              ? {}
              : {
                  boxShadow: [
                    "0 4px 20px hsl(270 95% 55% / 0.5)",
                    "0 4px 30px hsl(270 95% 55% / 0.7)",
                    "0 4px 20px hsl(270 95% 55% / 0.5)",
                  ],
                }
          }
          transition={{ duration: 2, repeat: Infinity }}
        >
          <GripVertical className="w-5 h-5 text-white" />
          
          {/* Pulse effect when not dragging */}
          {!isDragging && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(35 100% 55%))",
              }}
              animate={{
                scale: [1, 1.5],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Instruction hint */}
      {!isDragging && sliderPosition === 50 && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs font-mono text-muted-foreground"
          style={{
            background: "hsl(250 25% 15% / 0.8)",
            backdropFilter: "blur(8px)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.5 }}
        >
          ← Drag to compare →
        </motion.div>
      )}
    </motion.div>
  );
};

export default BeforeAfterSlider;
