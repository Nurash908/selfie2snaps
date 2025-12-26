import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Download, Trash2, X, Sparkles, ImageOff, Clock, Palette, MapPin, Loader2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from 'sonner';

interface HistoryItem {
  id: string;
  image_url: string;
  style: string | null;
  scene: string | null;
  ratio: string | null;
  narrative: string | null;
  created_at: string;
}

interface HistorySectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistorySection = ({ isOpen, onClose }: HistorySectionProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<HistoryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (user && isOpen) {
      fetchHistory();
    }
  }, [user, isOpen]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('generation_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      playSound('click');
      setDeletingId(id);
      const { error } = await supabase
        .from('generation_history')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setHistory(prev => prev.filter(h => h.id !== id));
      toast.success('Removed from history');
    } catch (error) {
      console.error('Error deleting history:', error);
      toast.error('Failed to remove from history');
    } finally {
      setDeletingId(null);
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
      a.download = `selfie2snap-history-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded!');
    } catch (error) {
      toast.error('Failed to download');
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

  const styleLabels: Record<string, string> = {
    natural: 'Natural',
    vintage: 'Vintage',
    cinematic: 'Cinematic',
    vibrant: 'Vibrant',
    neon: 'Neon',
    bw: 'B&W',
    sepia: 'Sepia',
    hdr: 'HDR',
    dreamy: 'Dreamy',
    warm: 'Warm',
  };

  const sceneLabels: Record<string, string> = {
    natural: 'Natural',
    beach: 'Beach',
    city: 'City',
    mountains: 'Mountains',
    studio: 'Studio',
    party: 'Party',
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
              background: 'linear-gradient(135deg, hsl(250 30% 10%) 0%, hsl(250 25% 6%) 100%)',
              borderLeft: '1px solid hsl(250 30% 20%)',
              boxShadow: '-20px 0 60px hsl(0 0% 0% / 0.5)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, hsl(200 90% 55%), hsl(270 95% 65%))',
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.3) 50%, transparent 100%)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <History className="w-5 h-5 text-foreground relative z-10" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground">Generation History</h2>
                  <p className="text-sm text-muted-foreground">{history.length} snaps created</p>
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

            {/* Content */}
            <div className="p-6 overflow-y-auto h-[calc(100vh-100px)]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-muted-foreground">Loading history...</p>
                </div>
              ) : history.length === 0 ? (
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
                    No history yet.<br />
                    <span className="text-sm">Your generated snaps will appear here!</span>
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="relative group rounded-2xl overflow-hidden"
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: 'linear-gradient(135deg, hsl(250 25% 15%) 0%, hsl(250 25% 12%) 100%)',
                        boxShadow: '0 10px 30px hsl(0 0% 0% / 0.3)',
                      }}
                    >
                      <div className="flex gap-4 p-4">
                        {/* Thumbnail */}
                        <motion.div 
                          className="relative w-24 h-28 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                          onClick={() => {
                            playSound('preview');
                            setSelectedImage(item);
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={item.image_url}
                            alt="Generated snap"
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
                            {formatDate(item.created_at)}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {item.style && (
                              <motion.span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                                style={{
                                  background: 'hsl(270 95% 65% / 0.2)',
                                  color: 'hsl(270 95% 75%)',
                                }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <Palette className="w-2.5 h-2.5" />
                                {styleLabels[item.style] || item.style}
                              </motion.span>
                            )}
                            {item.scene && (
                              <motion.span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                                style={{
                                  background: 'hsl(35 100% 60% / 0.2)',
                                  color: 'hsl(35 100% 70%)',
                                }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <MapPin className="w-2.5 h-2.5" />
                                {sceneLabels[item.scene] || item.scene}
                              </motion.span>
                            )}
                            {item.ratio && (
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                                style={{
                                  background: 'hsl(0 0% 50% / 0.2)',
                                  color: 'hsl(0 0% 70%)',
                                }}
                              >
                                {item.ratio}
                              </span>
                            )}
                          </div>

                          {/* Narrative */}
                          {item.narrative && (
                            <p className="text-xs text-muted-foreground line-clamp-2 italic">
                              "{item.narrative}"
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <motion.button
                            onClick={() => handleDownload(item.image_url, index)}
                            className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive hover:text-foreground transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </motion.button>
                        </div>
                      </div>

                      {/* Decorative corner */}
                      <motion.div
                        className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle at top right, hsl(270 95% 65% / 0.1), transparent 70%)',
                        }}
                      />
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
                <motion.div
                  className="relative max-w-2xl w-full"
                  initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.8, opacity: 0, rotateY: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={selectedImage.image_url}
                    alt="Preview"
                    className="w-full rounded-2xl"
                    style={{
                      boxShadow: '0 30px 60px hsl(0 0% 0% / 0.5), 0 0 100px hsl(270 95% 65% / 0.2)',
                    }}
                  />
                  
                  {/* Info overlay */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6 rounded-b-2xl"
                    style={{
                      background: 'linear-gradient(to top, hsl(0 0% 0% / 0.9), transparent)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-foreground font-medium">
                        {formatDate(selectedImage.created_at)}
                      </span>
                    </div>
                    {selectedImage.narrative && (
                      <p className="text-sm text-muted-foreground italic">"{selectedImage.narrative}"</p>
                    )}
                  </motion.div>

                  {/* Close button */}
                  <motion.button
                    className="absolute -top-4 -right-4 p-2 rounded-full bg-card text-foreground"
                    onClick={() => setSelectedImage(null)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HistorySection;