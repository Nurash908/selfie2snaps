import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Heart, X, ChevronLeft, ChevronRight, Share2, Maximize2, Twitter, Facebook, Instagram, Link, Check, Sparkles, Loader2, Archive } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from 'sonner';
import JSZip from 'jszip';

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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const { user } = useAuth();
  const { playSound } = useSoundEffects();

  // Sync favorites on mount - check which frames are already favorited
  useEffect(() => {
    const syncFavorites = async () => {
      if (!user || frames.length === 0) return;
      
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('image_url')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching favorites for sync:', error);
          return;
        }
        
        if (data && data.length > 0) {
          const favoriteUrls = new Set(data.map(f => f.image_url));
          const syncedFavorites = new Set<number>();
          
          frames.forEach((frame, index) => {
            if (favoriteUrls.has(frame)) {
              syncedFavorites.add(index);
            }
          });
          
          if (syncedFavorites.size > 0) {
            setFavorites(syncedFavorites);
          }
        }
      } catch (error) {
        console.error('Error syncing favorites:', error);
      }
    };
    
    syncFavorites();
  }, [user, frames]);

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
    setDownloadingIndex(index);
    
    try {
      // Simulate a small delay for animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      toast.success('Downloaded successfully! 🎉');
    } catch (error) {
      toast.error('Failed to download');
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handleDownloadAll = async () => {
    if (frames.length === 0) return;
    
    playSound('download');
    setDownloadingAll(true);
    
    try {
      const zip = new JSZip();
      
      for (let i = 0; i < frames.length; i++) {
        const response = await fetch(frames[i]);
        const blob = await response.blob();
        zip.file(`selfie2snap-${i + 1}.jpg`, blob);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `selfie2snap-all-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Downloaded ${frames.length} frames as zip! 🎉`);
    } catch (error) {
      console.error('Error creating zip:', error);
      toast.error('Failed to create zip file');
    } finally {
      setDownloadingAll(false);
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
    setSavingFavorite(true);
    const imageUrl = frames[index];
    
    try {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('image_url', imageUrl)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);

        if (deleteError) {
          console.error('Supabase delete error:', deleteError);
          throw deleteError;
        }

        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
        toast.success('Removed from favorites');
        setSavingFavorite(false);
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          title: `Snap ${index + 1}`,
          vibe: vibe || 'Generated Snap',
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Favorite saved successfully:', data);
      setFavorites(prev => new Set([...prev, index]));
      toast.success('Added to favorites! ❤️');
    } catch (error: any) {
      console.error('Error adding favorite:', error);
      toast.error(error.message || 'Failed to save favorite');
    } finally {
      setSavingFavorite(false);
    }
  };

  const handleFavoriteAll = async () => {
    if (!user) {
      playSound('click');
      toast.error('Please sign in to save favorites');
      onOpenAuth();
      return;
    }

    playSound('favorite');
    setSavingFavorite(true);
    
    try {
      const { data: existingFavorites } = await supabase
        .from('favorites')
        .select('image_url')
        .eq('user_id', user.id);
      
      const existingUrls = new Set(existingFavorites?.map(f => f.image_url) || []);
      const newFavorites = frames
        .map((frame, index) => ({ frame, index }))
        .filter(({ frame }) => !existingUrls.has(frame));
      
      if (newFavorites.length === 0) {
        toast.info('All frames already in favorites');
        setFavorites(new Set(frames.map((_, i) => i)));
        setSavingFavorite(false);
        return;
      }
      
      const { error } = await supabase
        .from('favorites')
        .insert(
          newFavorites.map(({ frame, index }) => ({
            user_id: user.id,
            image_url: frame,
            title: `Snap ${index + 1}`,
            vibe: vibe || 'Generated Snap',
          }))
        );
      
      if (error) throw error;
      
      setFavorites(new Set(frames.map((_, i) => i)));
      toast.success(`Added ${newFavorites.length} to favorites! ❤️`);
    } catch (error: any) {
      console.error('Error batch adding favorites:', error);
      toast.error(error.message || 'Failed to save favorites');
    } finally {
      setSavingFavorite(false);
    }
  };

  const handleUnfavoriteAll = async () => {
    if (!user) return;

    playSound('click');
    setSavingFavorite(true);
    
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .in('image_url', frames);
      
      if (error) throw error;
      
      setFavorites(new Set());
      toast.success('Removed all from favorites');
    } catch (error: any) {
      console.error('Error batch removing favorites:', error);
      toast.error(error.message || 'Failed to remove favorites');
    } finally {
      setSavingFavorite(false);
    }
  };

  const handleShare = async (platform: string) => {
    playSound('click');
    const caption = encodeURIComponent("Check out my Selfie2Snap creation! Two selfies, one epic moment! 🍌✨ #Selfie2Snap");
    const url = encodeURIComponent(window.location.href);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${caption}&url=${url}`, "_blank", "width=600,height=400");
        toast.success("Opening Twitter...");
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${caption}`, "_blank", "width=600,height=400");
        toast.success("Opening Facebook...");
        break;
      case 'instagram':
        // Download for Instagram
        handleDownload(currentIndex);
        toast.info("Image downloaded! Open Instagram and share from your gallery. 📸");
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopiedLink(true);
          toast.success("Link copied to clipboard! 🔗");
          setTimeout(() => setCopiedLink(false), 2000);
        } catch {
          toast.error("Failed to copy link");
        }
        break;
    }
    setShowShareMenu(false);
  };

  // Download animation particles
  const downloadParticles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.1,
  }));

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
        initial={{ scale: 0.9, y: 20, rotateX: -10 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.9, y: 20, rotateX: 10 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        {/* Close button */}
        <motion.button
          className="absolute -top-16 right-0 p-3 rounded-full bg-card/80 backdrop-blur-sm text-foreground hover:bg-card transition-colors z-10"
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Main image */}
        <div className="relative rounded-3xl overflow-hidden group" style={{ perspective: '1000px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="relative aspect-[4/5] w-full max-h-[70vh]"
              initial={{ opacity: 0, rotateY: -15, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, rotateY: 15, scale: 0.9, x: -50 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
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
              
              {/* Holographic overlay with enhanced shimmer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 30%, hsl(270 95% 75% / 0.15) 50%, transparent 70%)',
                  backgroundSize: '200% 200%',
                }}
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Pulsing glow border on hover */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 30px hsl(270 95% 65% / 0.3)',
                }}
                animate={{
                  boxShadow: [
                    'inset 0 0 20px hsl(270 95% 65% / 0.2)',
                    'inset 0 0 40px hsl(270 95% 65% / 0.4)',
                    'inset 0 0 20px hsl(270 95% 65% / 0.2)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Floating sparkles effect */}
              {[
                { top: "10%", left: "10%", delay: 0, color: "secondary" },
                { top: "20%", right: "15%", delay: 0.5, color: "primary" },
                { bottom: "30%", left: "20%", delay: 1, color: "primary" },
                { bottom: "15%", right: "25%", delay: 1.5, color: "secondary" },
              ].map((spark, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1.5 h-1.5 rounded-full bg-${spark.color}`}
                  style={{ 
                    ...spark,
                    boxShadow: `0 0 10px var(--${spark.color})`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: spark.delay }}
                />
              ))}

              {/* Expand icon */}
              <motion.div
                className="absolute top-4 right-4 p-2 rounded-full bg-background/50 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.2 }}
              >
                <Maximize2 className="w-4 h-4" />
              </motion.div>

              {/* Frame number badge */}
              <motion.div
                className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-sm text-foreground text-xs font-mono"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Frame {currentIndex + 1}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {frames.length > 1 && (
            <>
              <motion.button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                onClick={handlePrev}
                whileHover={{ scale: 1.15, x: -3 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                onClick={handleNext}
                whileHover={{ scale: 1.15, x: 3 }}
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
                  currentIndex === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                }`}
                onClick={() => {
                  playSound('click');
                  setCurrentIndex(index);
                }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: currentIndex === index
                    ? '0 0 25px hsl(270 95% 65% / 0.5)'
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
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Heart className="w-3 h-3 text-secondary drop-shadow-lg" fill="currentColor" />
                  </motion.div>
                )}
                {/* Active indicator */}
                {currentIndex === index && (
                  <motion.div
                    className="absolute inset-0 bg-primary/10"
                    layoutId="activeThumb"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 sm:gap-3 relative flex-wrap justify-end">
            {/* Batch Favorite All Button */}
            {frames.length > 1 && (
              <motion.button
                className={`p-2 sm:p-3 rounded-xl font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                  favorites.size === frames.length
                    ? 'bg-secondary/20 text-secondary border border-secondary/30'
                    : 'bg-card/60 text-muted-foreground hover:bg-card/80 hover:text-foreground'
                }`}
                onClick={favorites.size === frames.length ? handleUnfavoriteAll : handleFavoriteAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={savingFavorite}
              >
                {savingFavorite ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className="w-4 h-4" fill={favorites.size === frames.length ? 'currentColor' : 'none'} />
                )}
                <span className="hidden sm:inline">
                  {favorites.size === frames.length ? 'Unfav All' : 'Fav All'}
                </span>
              </motion.button>
            )}
            
            {/* Download All as Zip Button */}
            {frames.length > 1 && (
              <motion.button
                className="p-2 sm:p-3 rounded-xl font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-card/60 text-muted-foreground hover:bg-card/80 hover:text-foreground"
                onClick={handleDownloadAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={downloadingAll}
              >
                {downloadingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Archive className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {downloadingAll ? 'Zipping...' : 'Download All'}
                </span>
              </motion.button>
            )}
            
            {/* Favorite Button */}
            <motion.button
              className={`p-3 rounded-xl font-medium flex items-center gap-2 relative overflow-hidden ${
                favorites.has(currentIndex)
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-card/80 text-foreground hover:bg-card'
              }`}
              onClick={() => handleFavorite(currentIndex)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled={savingFavorite}
              style={{
                boxShadow: favorites.has(currentIndex)
                  ? '0 0 25px hsl(35 100% 60% / 0.5)'
                  : 'none',
              }}
            >
              {/* Success particles */}
              <AnimatePresence>
                {favorites.has(currentIndex) && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-secondary"
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{ 
                          x: (Math.random() - 0.5) * 60,
                          y: (Math.random() - 0.5) * 60,
                          opacity: 0,
                          scale: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        style={{ left: "50%", top: "50%" }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
              {savingFavorite ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <motion.div
                  animate={favorites.has(currentIndex) ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className="w-5 h-5" fill={favorites.has(currentIndex) ? 'currentColor' : 'none'} />
                </motion.div>
              )}
              <span className="hidden sm:inline">Favorite</span>
            </motion.button>

            {/* Share Button */}
            <motion.button
              className="p-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 relative"
              onClick={() => {
                playSound('click');
                setShowShareMenu(!showShareMenu);
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: '0 0 25px hsl(270 95% 65% / 0.4)',
              }}
            >
              <motion.div
                animate={showShareMenu ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Share2 className="w-5 h-5" />
              </motion.div>
              <span className="hidden sm:inline">Share</span>
            </motion.button>

            {/* Share Menu */}
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  className="absolute bottom-full right-0 mb-3 flex gap-2 p-3 rounded-xl"
                  style={{
                    background: 'linear-gradient(180deg, hsl(250 30% 15%) 0%, hsl(250 25% 10%) 100%)',
                    border: '1px solid hsl(250 30% 25%)',
                    boxShadow: '0 10px 40px hsl(0 0% 0% / 0.5)',
                  }}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                >
                  {[
                    { id: 'twitter', icon: Twitter, color: 'hsl(203 89% 53%)', label: 'Twitter' },
                    { id: 'facebook', icon: Facebook, color: 'hsl(220 46% 48%)', label: 'Facebook' },
                    { id: 'instagram', icon: Instagram, color: 'hsl(340 75% 55%)', label: 'Instagram' },
                    { id: 'copy', icon: copiedLink ? Check : Link, color: 'hsl(270 95% 65%)', label: copiedLink ? 'Copied!' : 'Copy Link' },
                  ].map((platform, i) => (
                    <motion.button
                      key={platform.id}
                      onClick={() => handleShare(platform.id)}
                      className="p-2.5 rounded-lg flex flex-col items-center gap-1"
                      style={{ background: 'hsl(250 25% 18%)' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ 
                        scale: 1.15,
                        background: `${platform.color}30`,
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <platform.icon className="w-5 h-5" style={{ color: platform.color }} />
                      <span className="text-[10px] text-muted-foreground">{platform.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Download Button */}
            <motion.button
              className="p-3 rounded-xl bg-card/80 text-foreground hover:bg-card font-medium flex items-center gap-2 relative overflow-hidden"
              onClick={() => handleDownload(currentIndex)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled={downloadingIndex !== null}
            >
              {/* Download particles animation */}
              <AnimatePresence>
                {downloadingIndex === currentIndex && (
                  <>
                    {downloadParticles.map((p) => (
                      <motion.div
                        key={p.id}
                        className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 30, opacity: [0, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, delay: p.delay, repeat: Infinity }}
                        style={{ left: `${20 + p.id * 8}%` }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
              
              {downloadingIndex === currentIndex ? (
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Download className="w-5 h-5 text-primary" />
                </motion.div>
              ) : (
                <Download className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">
                {downloadingIndex === currentIndex ? 'Downloading...' : 'Download'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Counter with animation */}
        <motion.p 
          className="text-center mt-4 text-sm text-muted-foreground font-mono"
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.span
            className="inline-block"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            {currentIndex + 1}
          </motion.span>
          {" / "}
          {frames.length}
        </motion.p>
      </motion.div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center bg-background cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <motion.img
              src={frames[currentIndex]}
              alt={`Full ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
            {/* Close hint */}
            <motion.p
              className="absolute bottom-8 text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Click anywhere to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PreviewGallery;
