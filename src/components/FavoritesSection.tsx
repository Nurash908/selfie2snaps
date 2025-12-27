import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Download, Trash2, X, Sparkles, ImageOff, Package, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from 'sonner';

interface Favorite {
  id: string;
  image_url: string;
  title: string | null;
  vibe: string | null;
  created_at: string;
}

interface FavoritesSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoritesSection = ({ isOpen, onClose }: FavoritesSectionProps) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedForBatch, setSelectedForBatch] = useState<Set<string>>(new Set());
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const { user } = useAuth();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (user && isOpen) {
      fetchFavorites();
    }
  }, [user, isOpen]);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      playSound('click');
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setFavorites(prev => prev.filter(f => f.id !== id));
      setSelectedForBatch(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error deleting favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    playSound('download');
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `favorite-snap-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded!');
    } catch (error) {
      toast.error('Failed to download');
    }
  };

  const toggleBatchSelect = (id: string) => {
    playSound('click');
    setSelectedForBatch(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    playSound('click');
    if (selectedForBatch.size === favorites.length) {
      setSelectedForBatch(new Set());
    } else {
      setSelectedForBatch(new Set(favorites.map(f => f.id)));
    }
  };

  const handleBatchDownload = async () => {
    if (selectedForBatch.size === 0) {
      toast.error('Select items to download');
      return;
    }

    setIsBatchDownloading(true);
    setBatchProgress(0);
    playSound('generate');

    const selectedItems = favorites.filter(f => selectedForBatch.has(f.id));
    let completed = 0;

    try {
      for (const item of selectedItems) {
        const response = await fetch(item.image_url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `favorite-${item.id.slice(0, 8)}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        completed++;
        setBatchProgress((completed / selectedItems.length) * 100);
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      playSound('success');
      toast.success(`Downloaded ${selectedItems.length} favorites!`);
      setSelectedForBatch(new Set());
    } catch (error) {
      toast.error('Some downloads failed');
    } finally {
      setIsBatchDownloading(false);
      setBatchProgress(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-full max-w-lg overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 6%))',
              borderLeft: '1px solid hsl(0 0% 15%)',
              boxShadow: '-20px 0 60px hsl(0 0% 0% / 0.5)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(270 95% 65%), hsl(35 100% 60%))',
                  }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Heart className="w-5 h-5 text-foreground" fill="currentColor" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground">My Favorites</h2>
                  <p className="text-sm text-muted-foreground">{favorites.length} saved snaps</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-card/50 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Batch Actions */}
            {favorites.length > 0 && (
              <motion.div
                className="px-6 py-3 border-b border-border/20 flex items-center justify-between gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={selectAll}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                    style={{
                      background: selectedForBatch.size === favorites.length ? 'hsl(270 95% 65% / 0.3)' : 'hsl(250 25% 15%)',
                      color: selectedForBatch.size === favorites.length ? 'hsl(270 95% 75%)' : 'hsl(0 0% 70%)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedForBatch.size === favorites.length ? 'Deselect All' : 'Select All'}
                  </motion.button>
                  {selectedForBatch.size > 0 && (
                    <motion.span
                      className="text-xs text-muted-foreground"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {selectedForBatch.size} selected
                    </motion.span>
                  )}
                </div>

                <motion.button
                  onClick={handleBatchDownload}
                  disabled={selectedForBatch.size === 0 || isBatchDownloading}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 relative overflow-hidden"
                  style={{
                    background: selectedForBatch.size > 0 
                      ? 'linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 50%))' 
                      : 'hsl(250 25% 15%)',
                    color: selectedForBatch.size > 0 ? 'hsl(0 0% 100%)' : 'hsl(0 0% 50%)',
                    boxShadow: selectedForBatch.size > 0 ? '0 4px 15px hsl(270 95% 55% / 0.3)' : 'none',
                  }}
                  whileHover={selectedForBatch.size > 0 ? { scale: 1.05 } : {}}
                  whileTap={selectedForBatch.size > 0 ? { scale: 0.95 } : {}}
                >
                  {isBatchDownloading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {Math.round(batchProgress)}%
                    </>
                  ) : (
                    <>
                      <Package className="w-3.5 h-3.5" />
                      Download Selected
                    </>
                  )}
                  
                  {/* Progress bar */}
                  {isBatchDownloading && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-foreground/50"
                      initial={{ width: 0 }}
                      animate={{ width: `${batchProgress}%` }}
                    />
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto h-[calc(100vh-180px)]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-muted-foreground">Loading favorites...</p>
                </div>
              ) : favorites.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-64 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ImageOff className="w-16 h-16 text-muted-foreground/30" />
                  <p className="text-muted-foreground text-center">
                    No favorites yet.<br />
                    <span className="text-sm">Save your favorite snaps to see them here!</span>
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {favorites.map((fav, index) => (
                    <motion.div
                      key={fav.id}
                      className={`relative group rounded-xl overflow-hidden cursor-pointer ${selectedForBatch.has(fav.id) ? 'ring-2 ring-primary' : ''}`}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        boxShadow: '0 10px 30px hsl(0 0% 0% / 0.3)',
                      }}
                      onClick={() => toggleBatchSelect(fav.id)}
                    >
                      {/* Selection indicator */}
                      <motion.div
                        className="absolute top-2 left-2 z-20"
                        initial={false}
                        animate={{ scale: selectedForBatch.has(fav.id) ? 1 : 0.8, opacity: selectedForBatch.has(fav.id) ? 1 : 0.5 }}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            selectedForBatch.has(fav.id) 
                              ? 'bg-primary border-primary' 
                              : 'border-foreground/50 bg-card/50'
                          }`}
                        >
                          {selectedForBatch.has(fav.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <CheckCircle2 className="w-3 h-3 text-foreground" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>

                      <img
                        src={fav.image_url}
                        alt={fav.title || 'Favorite snap'}
                        className="w-full aspect-[3/4] object-cover"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSound('preview');
                          setSelectedImage(fav.image_url);
                        }}
                      />
                      
                      {/* Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <motion.button
                          onClick={() => handleDownload(fav.image_url, index)}
                          className="p-2 rounded-full bg-card/80 backdrop-blur-sm text-foreground hover:bg-primary transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(fav.id)}
                          className="p-2 rounded-full bg-card/80 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-foreground transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.div>

                      {/* Vibe badge */}
                      {fav.vibe && (
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-medium bg-card/80 backdrop-blur-sm text-foreground flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {fav.vibe}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Fullscreen preview */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                className="fixed inset-0 z-60 flex items-center justify-center p-8 bg-background/95 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
              >
                <motion.img
                  src={selectedImage}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  style={{
                    boxShadow: '0 30px 60px hsl(0 0% 0% / 0.5)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FavoritesSection;
