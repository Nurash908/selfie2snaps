import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Download, Trash2, X, Sparkles, ImageOff, Package, Loader2, CheckCircle2, Clock, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from 'sonner';
import FavoritesLoadingAnimation from './FavoritesLoadingAnimation';

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
  const [selectedImage, setSelectedImage] = useState<Favorite | null>(null);
  const [selectedForBatch, setSelectedForBatch] = useState<Set<string>>(new Set());
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (user && isOpen) {
      fetchFavorites();
    }
  }, [user, isOpen]);

  const fetchFavorites = async () => {
    if (!user) {
      console.log('No user, skipping fetch');
      return;
    }
    setLoading(true);
    try {
      console.log('Fetching favorites for user:', user.id);
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }
      console.log('Fetched favorites:', data);
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
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
                <FavoritesLoadingAnimation />
              ) : favorites.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-64 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <ImageOff className="w-16 h-16 text-muted-foreground/30" />
                  </motion.div>
                  <p className="text-muted-foreground text-center">
                    No favorites yet.<br />
                    <span className="text-sm">Save your favorite snaps to see them here!</span>
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((fav, index) => (
                    <motion.div
                      key={fav.id}
                      className={`relative group rounded-2xl overflow-hidden cursor-pointer ${selectedForBatch.has(fav.id) ? 'ring-2 ring-primary' : ''}`}
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: selectedForBatch.has(fav.id) 
                          ? 'linear-gradient(135deg, hsl(350 40% 18%) 0%, hsl(270 25% 14%) 100%)'
                          : 'linear-gradient(135deg, hsl(270 25% 15%) 0%, hsl(270 25% 12%) 100%)',
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
                              : 'border-muted-foreground/50 bg-card/50'
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

                      <div className="flex gap-4 p-4">
                        {/* Thumbnail */}
                        <motion.div 
                          className="relative w-24 h-28 rounded-xl overflow-hidden flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            playSound('preview');
                            setSelectedImage(fav);
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={fav.image_url}
                            alt={fav.title || 'Favorite snap'}
                            className="w-full h-full object-cover"
                          />
                          {/* Hover overlay */}
                          <motion.div
                            className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="w-6 h-6 text-foreground" />
                          </motion.div>
                          {/* Glow effect */}
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              boxShadow: 'inset 0 0 20px hsl(270 95% 65% / 0.2)',
                            }}
                          />
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          {/* Date */}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                            <Clock className="w-3 h-3" />
                            {formatDate(fav.created_at)}
                          </div>

                          {/* Title */}
                          {fav.title && (
                            <p className="text-sm font-medium text-foreground mb-2 truncate">
                              {fav.title}
                            </p>
                          )}

                          {/* Vibe badge */}
                          {fav.vibe && (
                            <motion.div
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
                              style={{
                                background: 'linear-gradient(135deg, hsl(270 95% 65% / 0.2), hsl(350 80% 60% / 0.2))',
                                color: 'hsl(270 95% 75%)',
                              }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Sparkles className="w-3 h-3" />
                              {fav.vibe}
                            </motion.div>
                          )}

                          {/* Action buttons */}
                          <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                            <motion.button
                              onClick={() => handleDownload(fav.image_url, index)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                              style={{
                                background: 'hsl(250 25% 18%)',
                                color: 'hsl(0 0% 80%)',
                              }}
                              whileHover={{ scale: 1.05, background: 'hsl(250 25% 25%)' }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setDeletingId(fav.id);
                                handleDelete(fav.id);
                              }}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{
                                background: 'hsl(0 60% 20% / 0.5)',
                                color: 'hsl(0 70% 60%)',
                              }}
                              whileHover={{ scale: 1.1, background: 'hsl(0 70% 35%)' }}
                              whileTap={{ scale: 0.95 }}
                              disabled={deletingId === fav.id}
                            >
                              {deletingId === fav.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
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
                className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
              >
                <motion.div
                  className="relative max-w-2xl w-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.title || 'Preview'}
                    className="w-full object-contain rounded-2xl"
                    style={{
                      boxShadow: '0 30px 60px hsl(0 0% 0% / 0.5)',
                      maxHeight: '80vh',
                    }}
                  />
                  
                  {/* Close button */}
                  <motion.button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-card/80 backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </motion.button>

                  {/* Info overlay */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 rounded-b-2xl"
                    style={{
                      background: 'linear-gradient(to top, hsl(0 0% 5% / 0.9), transparent)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        {selectedImage.title && (
                          <p className="text-foreground font-medium">{selectedImage.title}</p>
                        )}
                        <p className="text-sm text-muted-foreground">{formatDate(selectedImage.created_at)}</p>
                      </div>
                      {selectedImage.vibe && (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          <Heart className="w-3.5 h-3.5" fill="currentColor" />
                          {selectedImage.vibe}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FavoritesSection;
