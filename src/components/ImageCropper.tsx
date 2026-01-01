import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, RotateCcw, ZoomIn, ZoomOut, Move, Maximize2, Minimize2 } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

const ImageCropper = ({ image, onCropComplete, onCancel, aspectRatio = 3 / 4 }: ImageCropperProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropSize, setCropSize] = useState<"small" | "medium" | "large">("medium");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { playSound } = useSoundEffects();

  // Dynamic crop size based on selection
  const cropSizes = {
    small: { width: 180, height: 180 / aspectRatio },
    medium: { width: 240, height: 240 / aspectRatio },
    large: { width: 300, height: 300 / aspectRatio },
  };

  const { width: cropWidth, height: cropHeight } = cropSizes[cropSize];

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = image;
  }, [image]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  }, [position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleZoomIn = () => {
    playSound("click");
    setScale(Math.min(scale + 0.2, 4)); // Extended max zoom
  };

  const handleZoomOut = () => {
    playSound("click");
    setScale(Math.max(scale - 0.2, 0.3)); // Extended min zoom
  };

  const handleReset = () => {
    playSound("reset");
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleCycleCropSize = () => {
    playSound("click");
    const sizes: ("small" | "medium" | "large")[] = ["small", "medium", "large"];
    const currentIndex = sizes.indexOf(cropSize);
    setCropSize(sizes[(currentIndex + 1) % sizes.length]);
  };

  const handleCrop = () => {
    playSound("success");
    
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to desired output
    const outputWidth = 400;
    const outputHeight = outputWidth / aspectRatio;
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Calculate the visible area of the image within the crop frame
    const img = imageRef.current;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    // Calculate scaled image dimensions
    const displayedWidth = img.naturalWidth * scale * 0.5;
    const displayedHeight = img.naturalHeight * scale * 0.5;

    // Center position
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    // Image position relative to center
    const imgLeft = centerX - displayedWidth / 2 + position.x;
    const imgTop = centerY - displayedHeight / 2 + position.y;

    // Crop area relative to image
    const cropLeft = (centerX - cropWidth / 2 - imgLeft) / (displayedWidth / img.naturalWidth);
    const cropTop = (centerY - cropHeight / 2 - imgTop) / (displayedHeight / img.naturalHeight);
    const cropWidthSrc = cropWidth / (displayedWidth / img.naturalWidth);
    const cropHeightSrc = cropHeight / (displayedHeight / img.naturalHeight);

    // Draw cropped area
    ctx.drawImage(
      img,
      Math.max(0, cropLeft),
      Math.max(0, cropTop),
      Math.min(cropWidthSrc, img.naturalWidth),
      Math.min(cropHeightSrc, img.naturalHeight),
      0,
      0,
      outputWidth,
      outputHeight
    );

    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onCropComplete(croppedDataUrl);
  };

  const zoomPercentage = Math.round(scale * 100);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "hsl(250 30% 5% / 0.95)", backdropFilter: "blur(8px)" }}
        />

        <motion.div
          className="relative w-full max-w-sm rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, hsl(250 30% 15%) 0%, hsl(250 25% 10%) 100%)",
            border: "1px solid hsl(250 30% 25%)",
          }}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <div>
              <h3 className="text-sm font-mono tracking-wider text-foreground">CROP IMAGE</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Zoom: {zoomPercentage}%</p>
            </div>
            <motion.button
              onClick={() => {
                playSound("click");
                onCancel();
              }}
              className="p-2 rounded-full"
              style={{ background: "hsl(250 25% 20%)" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>

          {/* Cropper area */}
          <div
            ref={containerRef}
            className="relative h-80 overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Image */}
            <motion.img
              ref={imageRef}
              src={image}
              alt="Crop preview"
              className="absolute select-none"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale * 0.5})`,
                transformOrigin: "center",
                maxWidth: "none",
              }}
              draggable={false}
            />

            {/* Crop overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Dark overlay */}
              <svg className="w-full h-full">
                <defs>
                  <mask id="cropMask">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x="50%"
                      y="50%"
                      width={cropWidth}
                      height={cropHeight}
                      fill="black"
                      style={{ transform: `translate(-${cropWidth / 2}px, -${cropHeight / 2}px)` }}
                      rx="12"
                    />
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="hsl(250 30% 5% / 0.7)"
                  mask="url(#cropMask)"
                />
              </svg>

              {/* Crop frame */}
              <motion.div
                className="absolute rounded-xl"
                style={{
                  width: cropWidth,
                  height: cropHeight,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  border: "2px solid hsl(270 95% 65%)",
                  boxShadow: "0 0 0 9999px hsl(250 30% 5% / 0.7), 0 0 20px hsl(270 95% 65% / 0.3)",
                }}
                animate={{ 
                  width: cropWidth, 
                  height: cropHeight,
                  boxShadow: [
                    "0 0 0 9999px hsl(250 30% 5% / 0.7), 0 0 20px hsl(270 95% 65% / 0.3)",
                    "0 0 0 9999px hsl(250 30% 5% / 0.7), 0 0 30px hsl(270 95% 65% / 0.5)",
                    "0 0 0 9999px hsl(250 30% 5% / 0.7), 0 0 20px hsl(270 95% 65% / 0.3)",
                  ]
                }}
                transition={{ 
                  width: { type: "spring", stiffness: 300 },
                  height: { type: "spring", stiffness: 300 },
                  boxShadow: { duration: 2, repeat: Infinity }
                }}
              >
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="border border-white/20"
                    />
                  ))}
                </div>

                {/* Corner handles */}
                {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => (
                  <div
                    key={corner}
                    className="absolute w-5 h-5"
                    style={{
                      [corner.includes("top") ? "top" : "bottom"]: -2,
                      [corner.includes("left") ? "left" : "right"]: -2,
                      borderTop: corner.includes("top") ? "3px solid hsl(270 95% 65%)" : "none",
                      borderBottom: corner.includes("bottom") ? "3px solid hsl(270 95% 65%)" : "none",
                      borderLeft: corner.includes("left") ? "3px solid hsl(270 95% 65%)" : "none",
                      borderRight: corner.includes("right") ? "3px solid hsl(270 95% 65%)" : "none",
                    }}
                  />
                ))}

                {/* Crop size indicator */}
                <motion.div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-mono"
                  style={{ background: "hsl(270 95% 55% / 0.8)" }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {cropSize.toUpperCase()}
                </motion.div>
              </motion.div>
            </div>

            {/* Drag hint */}
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono text-muted-foreground"
              style={{ background: "hsl(250 25% 15% / 0.9)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Move className="w-3 h-3" />
              Drag to adjust
            </motion.div>
          </div>

          {/* Controls */}
          <div className="p-4 space-y-4">
            {/* Zoom controls */}
            <div className="flex items-center justify-center gap-3">
              <motion.button
                onClick={handleZoomOut}
                className="p-3 rounded-xl"
                style={{ background: "hsl(250 25% 18%)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ZoomOut className="w-5 h-5 text-muted-foreground" />
              </motion.button>

              {/* Enhanced zoom slider */}
              <div className="flex-1 max-w-40 relative">
                <input
                  type="range"
                  min="0.3"
                  max="4"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, hsl(270 95% 65%) 0%, hsl(270 95% 65%) ${((scale - 0.3) / 3.7) * 100}%, hsl(250 20% 25%) ${((scale - 0.3) / 3.7) * 100}%, hsl(250 20% 25%) 100%)`,
                  }}
                />
                {/* Zoom percentage tooltip */}
                <motion.div
                  className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono"
                  style={{ 
                    background: "hsl(270 95% 55% / 0.8)",
                    left: `${((scale - 0.3) / 3.7) * 100}%`,
                  }}
                >
                  {zoomPercentage}%
                </motion.div>
              </div>

              <motion.button
                onClick={handleZoomIn}
                className="p-3 rounded-xl"
                style={{ background: "hsl(250 25% 18%)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ZoomIn className="w-5 h-5 text-muted-foreground" />
              </motion.button>

              <motion.button
                onClick={handleCycleCropSize}
                className="p-3 rounded-xl"
                style={{ background: "hsl(250 25% 18%)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Change crop size"
              >
                {cropSize === "large" ? (
                  <Minimize2 className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-muted-foreground" />
                )}
              </motion.button>

              <motion.button
                onClick={handleReset}
                className="p-3 rounded-xl"
                style={{ background: "hsl(250 25% 18%)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Quick zoom buttons */}
            <div className="flex justify-center gap-2">
              {[50, 100, 150, 200, 300].map((zoom) => (
                <motion.button
                  key={zoom}
                  onClick={() => {
                    playSound("click");
                    setScale(zoom / 100);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                    Math.round(scale * 100) === zoom 
                      ? "text-primary-foreground" 
                      : "text-muted-foreground"
                  }`}
                  style={{ 
                    background: Math.round(scale * 100) === zoom 
                      ? "hsl(270 95% 55%)" 
                      : "hsl(250 25% 15%)" 
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {zoom}%
                </motion.button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => {
                  playSound("click");
                  onCancel();
                }}
                className="flex-1 py-3 rounded-xl text-sm font-mono tracking-wider text-muted-foreground"
                style={{ background: "hsl(250 25% 18%)" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>

              <motion.button
                onClick={handleCrop}
                className="flex-1 py-3 rounded-xl text-sm font-mono tracking-wider text-primary-foreground flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(35 100% 55%))",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-4 h-4" />
                Apply Crop
              </motion.button>
            </div>
          </div>

          {/* Hidden canvas for cropping */}
          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageCropper;
