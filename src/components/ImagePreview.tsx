import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Camera, User } from 'lucide-react';

interface ImagePreviewProps {
  image: string;
  variant: 'left' | 'right';
  onRemove: () => void;
}

const ImagePreview = ({ image, variant, onRemove }: ImagePreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative w-14 h-14 rounded-xl overflow-hidden cursor-pointer group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      style={{
        boxShadow: `0 4px 20px ${variant === 'left' ? 'hsl(270 95% 65% / 0.3)' : 'hsl(35 100% 60% / 0.3)'}`,
        border: `2px solid ${variant === 'left' ? 'hsl(270 95% 65%)' : 'hsl(35 100% 60%)'}`,
      }}
    >
      {/* Image */}
      <motion.img
        src={image}
        alt="Preview"
        className="w-full h-full object-cover"
        animate={{
          filter: isHovered ? 'blur(3px) brightness(0.7)' : 'blur(0px) brightness(1)',
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Hover overlay with blur effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              className="p-1.5 rounded-full bg-destructive text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Check indicator */}
      <motion.div
        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, hsl(145 80% 45%), hsl(145 80% 35%))',
          boxShadow: '0 2px 8px hsl(145 80% 45% / 0.4)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
      >
        <Check className="w-3 h-3 text-foreground" strokeWidth={3} />
      </motion.div>

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 py-0.5 text-[8px] font-bold text-center text-foreground bg-background/60 backdrop-blur-sm">
        {variant === 'left' ? 'P1' : 'P2'}
      </div>
    </motion.div>
  );
};

export default ImagePreview;
