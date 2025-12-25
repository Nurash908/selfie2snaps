import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Heart, X, ChevronLeft, ChevronRight, Share2, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from 'sonner';

interface PreviewGalleryProps {
  frames: string[];
  vibe: string;
  onClose: () => void;
  onOpenAuth: () => void;
}

const PreviewGallery = ({ frames, vibe, onClose, onOpenAuth }: PreviewGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user } = useAuth();
  const { playSound } = useSoundEffects();

  const handlePrev = () => {
    playSound('click');
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : frames.length - 1));
  };

  const handleNext = () => {
    playSound('click');
    setCurrentIndex((prev) => (prev < frames.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = async (index: number) => {
    playSound('download');
    try {
      const response = await fetch(frames[index]);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `selfie2snap-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded!');
    } catch (error) {
      toast.error('Failed to download');
    }
  };

  const handleFavorite = async (index: number) => {
    if (!user) {
      playSound('click');
      toast.error('Please sign in to save favorites');
      onOpenAuth();
      return;
    }

    playSound('favorite');
    const imageUrl = frames[index];
    
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          title: `Snap ${index + 1}`,
          vibe: vibe,
        });

      if (error) throw error;

      setFavorites(prev => new Set([...prev, index]));
      toast.success('Added to favorites!');
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to save favorite');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-background/95 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Gallery container */}
      <motion.div
        className="relative w-full max-w-4xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Close button */}
        <motion.button
          className="absolute -top-16 right-0 p-3 rounded-full bg-card/80 backdrop-blur-sm text-foreground hover:bg-card transition-colors z-10"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Main image */}
        <div className="relative rounded-3xl overflow-hidden" style={{ perspective: '1000px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="relative aspect-[4/5] w-full max-h-[70vh]"
              initial={{ opacity: 0, rotateY: -10 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 10 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                playSound('preview');
                setIsFullscreen(true);
              }}
              style={{
                boxShadow: '0 30px 60px hsl(0 0% 0% / 0.4), 0 0 100px hsl(270 95% 65% / 0.2)',
              }}
            >
              <img
                src={frames[currentIndex]}
                alt={`Frame ${currentIndex + 1}`}
                className="w-full h-full object-cover cursor-zoom-in"
              />
              
              {/* Holographic overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 40%, hsl(270 95% 75% / 0.1) 50%, transparent 60%)',
                  backgroundSize: '200% 200%',
                }}
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              {/* Expand icon */}
              <motion.div
                className="absolute top-4 right-4 p-2 rounded-full bg-background/50 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100"
                whileHover={{ scale: 1.1 }}
              >
                <Maximize2 className="w-4 h-4" />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {frames.length > 1 && (
            <>
              <motion.button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                onClick={handlePrev}
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                onClick={handleNext}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between">
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {frames.map((frame, index) => (
              <motion.button
                key={index}
                className={`relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                  currentIndex === index ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => {
                  playSound('click');
                  setCurrentIndex(index);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: currentIndex === index
                    ? '0 0 20px hsl(270 95% 65% / 0.4)'
                    : '0 4px 10px hsl(0 0% 0% / 0.2)',
                }}
              >
                <img
                  src={frame}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {favorites.has(index) && (
                  <motion.div
                    className="absolute top-1 right-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Heart className="w-3 h-3 text-secondary" fill="currentColor" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <motion.button
              className={`p-3 rounded-xl font-medium flex items-center gap-2 ${
                favorites.has(currentIndex)
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-card/80 text-foreground hover:bg-card'
              }`}
              onClick={() => handleFavorite(currentIndex)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: favorites.has(currentIndex)
                  ? '0 0 20px hsl(35 100% 60% / 0.4)'
                  : 'none',
              }}
            >
              <Heart className="w-5 h-5" fill={favorites.has(currentIndex) ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">Favorite</span>
            </motion.button>
            <motion.button
              className="p-3 rounded-xl bg-card/80 text-foreground hover:bg-card font-medium flex items-center gap-2"
              onClick={() => handleDownload(currentIndex)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Download</span>
            </motion.button>
          </div>
        </div>

        {/* Counter */}
        <p className="text-center mt-4 text-sm text-muted-foreground font-mono">
          {currentIndex + 1} / {frames.length}
        </p>
      </motion.div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <motion.img
              src={frames[currentIndex]}
              alt={`Full ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PreviewGallery;
