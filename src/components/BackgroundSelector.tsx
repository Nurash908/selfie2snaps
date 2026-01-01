import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  ImagePlus, 
  Sparkles, 
  Upload, 
  Grid3X3, 
  Wand2, 
  X, 
  Check, 
  Loader2,
  Palette,
  Trash2,
  RefreshCw,
  Search,
  Waves,
  Building2,
  TreePine,
  Camera,
  PartyPopper,
  Clock,
  Heart,
  Shuffle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const RECENTLY_USED_KEY = "snap-recently-used-backgrounds";
const FAVORITES_KEY = "snap-favorite-backgrounds";
const MAX_RECENT = 5;

interface BackgroundSelectorProps {
  selected: string;
  onSelect: (background: string, type: "preset" | "custom" | "ai") => void;
  customBackground: string | null;
  onCustomUpload: (imageUrl: string) => void;
  aiBackground: string | null;
  onAiGenerate: (imageUrl: string) => void;
}

type BackgroundCategory = "all" | "favorites" | "beach" | "city" | "nature" | "studio" | "party";

const stockBackgrounds = [
  { 
    id: "sunset-beach", 
    label: "Sunset Beach", 
    category: "beach" as const,
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=75&fit=crop"
  },
  { 
    id: "tropical-paradise", 
    label: "Tropical Paradise", 
    category: "beach" as const,
    url: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=100&h=75&fit=crop"
  },
  { 
    id: "city-night", 
    label: "City Night", 
    category: "city" as const,
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=100&h=75&fit=crop"
  },
  { 
    id: "tokyo-neon", 
    label: "Tokyo Neon", 
    category: "city" as const,
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&h=75&fit=crop"
  },
  { 
    id: "mountains", 
    label: "Mountains", 
    category: "nature" as const,
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100&h=75&fit=crop"
  },
  { 
    id: "snowy-peaks", 
    label: "Snowy Peaks", 
    category: "nature" as const,
    url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=100&h=75&fit=crop"
  },
  { 
    id: "forest", 
    label: "Forest", 
    category: "nature" as const,
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=100&h=75&fit=crop"
  },
  { 
    id: "autumn-woods", 
    label: "Autumn Woods", 
    category: "nature" as const,
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=75&fit=crop"
  },
  { 
    id: "studio-gradient", 
    label: "Studio Pink", 
    category: "studio" as const,
    url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=100&h=75&fit=crop"
  },
  { 
    id: "studio-blue", 
    label: "Studio Blue", 
    category: "studio" as const,
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&h=75&fit=crop"
  },
  { 
    id: "neon-party", 
    label: "Neon Party", 
    category: "party" as const,
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=100&h=75&fit=crop"
  },
  { 
    id: "club-lights", 
    label: "Club Lights", 
    category: "party" as const,
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=75&fit=crop"
  },
  { 
    id: "cherry-blossom", 
    label: "Cherry Blossom", 
    category: "nature" as const,
    url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=100&h=75&fit=crop"
  },
  { 
    id: "northern-lights", 
    label: "Northern Lights", 
    category: "nature" as const,
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=100&h=75&fit=crop"
  },
  { 
    id: "desert-dunes", 
    label: "Desert Dunes", 
    category: "nature" as const,
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=100&h=75&fit=crop"
  },
  { 
    id: "underwater", 
    label: "Underwater", 
    category: "beach" as const,
    url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=100&h=75&fit=crop"
  },
];

const categories: { id: BackgroundCategory; label: string; icon: typeof Waves }[] = [
  { id: "all", label: "All", icon: Grid3X3 },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "beach", label: "Beach", icon: Waves },
  { id: "city", label: "City", icon: Building2 },
  { id: "nature", label: "Nature", icon: TreePine },
  { id: "studio", label: "Studio", icon: Camera },
  { id: "party", label: "Party", icon: PartyPopper },
];

const BackgroundSelector = ({ 
  selected, 
  onSelect, 
  customBackground, 
  onCustomUpload,
  aiBackground,
  onAiGenerate 
}: BackgroundSelectorProps) => {
  const [activeTab, setActiveTab] = useState<"stock" | "custom" | "ai">("stock");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [previewBackground, setPreviewBackground] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<BackgroundCategory>("all");
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleHighlight, setShuffleHighlight] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useSoundEffects();

  // Load recently used backgrounds from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENTLY_USED_KEY);
    if (stored) {
      try {
        setRecentlyUsed(JSON.parse(stored));
      } catch {
        setRecentlyUsed([]);
      }
    }
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  // Add background to recently used
  const addToRecentlyUsed = useCallback((bgId: string) => {
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((id) => id !== bgId);
      const updated = [bgId, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(RECENTLY_USED_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((bgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFavorite = favorites.includes(bgId);
    setFavorites((prev) => {
      const updated = isFavorite 
        ? prev.filter((id) => id !== bgId)
        : [...prev, bgId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
    playSound("click");
    const bg = stockBackgrounds.find((b) => b.id === bgId);
    if (bg) {
      toast.success(isFavorite ? `Removed "${bg.label}" from favorites` : `Added "${bg.label}" to favorites`);
    }
  }, [playSound, favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem(FAVORITES_KEY);
    playSound("click");
    toast.success("Favorites cleared");
  }, [playSound]);

  // Handle favorites reorder
  const handleFavoritesReorder = useCallback((newOrder: string[]) => {
    setFavorites(newOrder);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newOrder));
  }, []);

  // Get recently used background objects
  const recentBackgrounds = useMemo(() => {
    return recentlyUsed
      .map((id) => stockBackgrounds.find((bg) => bg.id === id))
      .filter((bg): bg is typeof stockBackgrounds[0] => bg !== undefined);
  }, [recentlyUsed]);

  // Get favorite background objects
  const favoriteBackgrounds = useMemo(() => {
    return favorites
      .map((id) => stockBackgrounds.find((bg) => bg.id === id))
      .filter((bg): bg is typeof stockBackgrounds[0] => bg !== undefined);
  }, [favorites]);

  // Filter backgrounds based on search and category
  const filteredBackgrounds = useMemo(() => {
    return stockBackgrounds.filter((bg) => {
      const matchesSearch = bg.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" 
        || activeCategory === "favorites" 
        || bg.category === activeCategory;
      const matchesFavorites = activeCategory !== "favorites" || favorites.includes(bg.id);
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [searchQuery, activeCategory, favorites]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playSound("upload");
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onCustomUpload(result);
        onSelect("custom", "custom");
        toast.success("Custom background uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please describe the background you want");
      return;
    }

    playSound("generate");
    setIsGeneratingAi(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-background", {
        body: { prompt: aiPrompt }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setPreviewBackground(data.imageUrl);
        playSound("success");
        toast.success("AI background generated!");
      } else {
        // Demo fallback
        const demoUrl = `https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop&seed=${Date.now()}`;
        setPreviewBackground(demoUrl);
        toast.success("AI background preview ready!");
      }
    } catch (error) {
      console.error("Error generating AI background:", error);
      // Demo fallback
      const demoUrl = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop";
      setPreviewBackground(demoUrl);
      toast.info("Using demo background preview");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const confirmAiBackground = () => {
    if (previewBackground) {
      playSound("success");
      onAiGenerate(previewBackground);
      onSelect("ai", "ai");
      setPreviewBackground(null);
      toast.success("AI background applied!");
    }
  };

  const discardAiBackground = () => {
    playSound("click");
    setPreviewBackground(null);
  };

  const tabs = [
    { id: "stock" as const, label: "Stock", icon: Grid3X3 },
    { id: "custom" as const, label: "Upload", icon: Upload },
    { id: "ai" as const, label: "AI Generate", icon: Wand2 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-primary" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Background / Scene
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "hsl(250 25% 12%)" }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => {
                playSound("click");
                setActiveTab(tab.id);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
              style={{
                background: isActive ? "hsl(270 95% 55% / 0.2)" : "transparent",
                borderColor: isActive ? "hsl(270 95% 65% / 0.3)" : "transparent",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "stock" && (
          <motion.div
            key="stock"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search backgrounds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-secondary/50 border-border/30"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </motion.button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                const count = cat.id === "all" 
                  ? stockBackgrounds.length 
                  : cat.id === "favorites"
                    ? favorites.length
                    : stockBackgrounds.filter(bg => bg.category === cat.id).length;
                
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => {
                      playSound("click");
                      setActiveCategory(cat.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      isActive 
                        ? cat.id === "favorites" 
                          ? "bg-destructive/20 text-destructive border border-destructive/30"
                          : "bg-primary/20 text-primary border border-primary/30" 
                        : "bg-secondary/50 text-muted-foreground border border-transparent hover:bg-secondary"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-3 h-3 ${cat.id === "favorites" && isActive ? "fill-destructive" : ""}`} />
                    {cat.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive 
                        ? cat.id === "favorites" ? "bg-destructive/30" : "bg-primary/30" 
                        : "bg-muted"
                    }`}>
                      {count}
                    </span>
                  </motion.button>
                );
              })}
              {/* Random/Shuffle Button */}
              <motion.button
                onClick={() => {
                  if (filteredBackgrounds.length > 0 && !isShuffling) {
                    setIsShuffling(true);
                    playSound("click");
                    
                    // Shuffle animation - cycle through backgrounds
                    const shuffleCount = Math.min(12, filteredBackgrounds.length * 2);
                    const shuffleDuration = 80; // ms per cycle
                    let currentIndex = 0;
                    
                    const shuffleInterval = setInterval(() => {
                      const randomIndex = Math.floor(Math.random() * filteredBackgrounds.length);
                      setShuffleHighlight(filteredBackgrounds[randomIndex].id);
                      currentIndex++;
                      
                      if (currentIndex >= shuffleCount) {
                        clearInterval(shuffleInterval);
                        // Final pick with a slight delay
                        setTimeout(() => {
                          const finalBg = filteredBackgrounds[Math.floor(Math.random() * filteredBackgrounds.length)];
                          setShuffleHighlight(finalBg.id);
                          onSelect(finalBg.id, "preset");
                          addToRecentlyUsed(finalBg.id);
                          playSound("success");
                          toast.success(`Random pick: ${finalBg.label}`);
                          
                          // Clear highlight after a moment
                          setTimeout(() => {
                            setShuffleHighlight(null);
                            setIsShuffling(false);
                          }, 500);
                        }, 150);
                      }
                    }, shuffleDuration);
                  }
                }}
                disabled={filteredBackgrounds.length === 0 || isShuffling}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all bg-accent/50 text-accent-foreground border border-accent/30 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={isShuffling ? { scale: [1, 1.05, 1] } : {}}
                transition={isShuffling ? { duration: 0.3, repeat: Infinity } : {}}
              >
                <Shuffle className={`w-3 h-3 ${isShuffling ? "animate-spin" : ""}`} />
                {isShuffling ? "Shuffling..." : "Shuffle"}
              </motion.button>
            </div>

            {/* Favorites Section */}
            {favoriteBackgrounds.length > 0 && !searchQuery && activeCategory === "all" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Heart className="w-3 h-3 text-destructive fill-destructive" />
                    <span>Favorites</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/20 text-destructive">
                      {favoriteBackgrounds.length}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 italic">• drag to reorder</span>
                  </div>
                  <motion.button
                    onClick={clearFavorites}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </motion.button>
                </div>
                <Reorder.Group
                  axis="x"
                  values={favorites}
                  onReorder={handleFavoritesReorder}
                  className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
                >
                  {favorites.map((bgId) => {
                    const bg = stockBackgrounds.find((b) => b.id === bgId);
                    if (!bg) return null;
                    const isSelected = selected === bg.id;
                    return (
                      <Reorder.Item
                        key={bg.id}
                        value={bg.id}
                        className={`relative flex-shrink-0 w-16 aspect-[4/3] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing ${
                          isSelected ? "ring-2 ring-primary" : ""
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 1.02 }}
                        whileDrag={{ scale: 1.1, zIndex: 50 }}
                      >
                        <div
                          onClick={() => {
                            playSound("click");
                            onSelect(bg.id, "preset");
                            addToRecentlyUsed(bg.id);
                          }}
                          className="w-full h-full"
                        >
                          <img
                            src={bg.preview}
                            alt={bg.label}
                            className="w-full h-full object-cover pointer-events-none"
                            draggable={false}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
                          <span className="absolute bottom-0.5 left-0.5 right-0.5 text-[8px] font-medium text-foreground truncate pointer-events-none">
                            {bg.label}
                          </span>
                        </div>
                        <motion.button
                          onClick={(e) => toggleFavorite(bg.id, e)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-background/60 flex items-center justify-center z-10"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart className="w-2.5 h-2.5 text-destructive fill-destructive" />
                        </motion.button>
                        {isSelected && (
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-primary flex items-center justify-center pointer-events-none"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Check className="w-2 h-2 text-primary-foreground" />
                          </motion.div>
                        )}
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
              </div>
            )}

            {/* Recently Used Section */}
            {recentBackgrounds.length > 0 && !searchQuery && activeCategory === "all" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Recently Used</span>
                  </div>
                  <motion.button
                    onClick={() => {
                      playSound("click");
                      setRecentlyUsed([]);
                      localStorage.removeItem(RECENTLY_USED_KEY);
                      toast.success("Recently used cleared");
                    }}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </motion.button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {recentBackgrounds.map((bg) => {
                    const isSelected = selected === bg.id;
                    const isFavorite = favorites.includes(bg.id);
                    return (
                      <motion.button
                        key={`recent-${bg.id}`}
                        onClick={() => {
                          playSound("click");
                          onSelect(bg.id, "preset");
                          addToRecentlyUsed(bg.id);
                        }}
                        className={`relative flex-shrink-0 w-16 aspect-[4/3] rounded-lg overflow-hidden ${
                          isSelected ? "ring-2 ring-primary" : ""
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={bg.preview}
                          alt={bg.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <span className="absolute bottom-0.5 left-0.5 right-0.5 text-[8px] font-medium text-foreground truncate">
                          {bg.label}
                        </span>
                        <motion.button
                          onClick={(e) => toggleFavorite(bg.id, e)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-background/60 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart className={`w-2.5 h-2.5 ${isFavorite ? "text-destructive fill-destructive" : "text-muted-foreground"}`} />
                        </motion.button>
                        {isSelected && (
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-primary flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Check className="w-2 h-2 text-primary-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Background Grid */}
            {filteredBackgrounds.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {filteredBackgrounds.map((bg) => {
                  const isSelected = selected === bg.id;
                  const isFavorite = favorites.includes(bg.id);
                  const isShuffleHighlighted = shuffleHighlight === bg.id;
                  return (
                    <HoverCard key={bg.id} openDelay={400} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <motion.button
                          onClick={() => {
                            if (!isShuffling) {
                              playSound("click");
                              onSelect(bg.id, "preset");
                              addToRecentlyUsed(bg.id);
                            }
                          }}
                          className={`relative aspect-[4/3] rounded-lg overflow-hidden transition-all ${
                            isSelected ? "ring-2 ring-primary" : ""
                          } ${isShuffleHighlighted ? "ring-2 ring-accent shadow-lg shadow-accent/50" : ""}`}
                          whileHover={!isShuffling ? { scale: 1.05 } : {}}
                          whileTap={!isShuffling ? { scale: 0.95 } : {}}
                          animate={isShuffleHighlighted ? { 
                            scale: [1, 1.1, 1],
                            transition: { duration: 0.15 }
                          } : {}}
                          layout
                        >
                          <img
                            src={bg.preview}
                            alt={bg.label}
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute inset-0 transition-colors ${
                            isShuffleHighlighted 
                              ? "bg-gradient-to-t from-accent/60 to-accent/20" 
                              : "bg-gradient-to-t from-background/80 to-transparent"
                          }`} />
                          <span className="absolute bottom-1 left-1 right-4 text-[10px] font-medium text-foreground truncate">
                            {bg.label}
                          </span>
                          {/* Favorite button */}
                          <motion.button
                            onClick={(e) => toggleFavorite(bg.id, e)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/60 flex items-center justify-center hover:bg-background/80 transition-colors"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className={`w-3 h-3 transition-colors ${isFavorite ? "text-destructive fill-destructive" : "text-muted-foreground hover:text-destructive"}`} />
                          </motion.button>
                          {isSelected && !isShuffleHighlighted && (
                            <motion.div
                              className="absolute top-1 left-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check className="w-2.5 h-2.5 text-primary-foreground" />
                            </motion.div>
                          )}
                          {isShuffleHighlighted && (
                            <motion.div
                              className="absolute inset-0 border-2 border-accent rounded-lg"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                        </motion.button>
                      </HoverCardTrigger>
                      <HoverCardContent 
                        side="right" 
                        align="start" 
                        className="w-64 p-2"
                        sideOffset={8}
                      >
                        <div className="space-y-2">
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <img
                              src={bg.url}
                              alt={bg.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{bg.label}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              Category: {bg.category}
                            </p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            ) : activeCategory === "favorites" && favorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <Heart className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No favorites yet</p>
                <p className="text-xs text-muted-foreground/70">Click the heart icon on any background to save it</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <Search className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No backgrounds found</p>
                <p className="text-xs text-muted-foreground/70">Try a different search or category</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "custom" && (
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {customBackground ? (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src={customBackground}
                  alt="Custom background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium"
                    style={{ background: "hsl(250 25% 15% / 0.9)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Replace
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      playSound("click");
                      onSelect("natural", "preset");
                      onCustomUpload("");
                    }}
                    className="px-3 py-2 rounded-lg"
                    style={{ background: "hsl(0 70% 50% / 0.3)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive-foreground" />
                  </motion.button>
                </div>
                {selected === "custom" && (
                  <motion.div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors"
                style={{ background: "hsl(250 25% 10%)" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ImagePlus className="w-8 h-8 text-muted-foreground" />
                </motion.div>
                <span className="text-sm text-muted-foreground">
                  Upload your own background
                </span>
              </motion.button>
            )}
          </motion.div>
        )}

        {activeTab === "ai" && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* AI Prompt Input */}
            <div className="relative">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your dream background... (e.g., 'A magical forest with glowing fireflies at sunset')"
                className="w-full h-20 p-3 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                style={{ background: "hsl(250 25% 12%)", color: "hsl(0 0% 95%)" }}
              />
              <motion.div
                className="absolute top-2 right-2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary/50" />
              </motion.div>
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleAiGenerate}
              disabled={isGeneratingAi || !aiPrompt.trim()}
              className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 50%))",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Magic...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate with AI
                </>
              )}
            </motion.button>

            {/* AI Preview */}
            <AnimatePresence>
              {previewBackground && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative aspect-video rounded-xl overflow-hidden"
                >
                  <img
                    src={previewBackground}
                    alt="AI generated preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                    <motion.button
                      onClick={confirmAiBackground}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-primary-foreground"
                      style={{ background: "linear-gradient(135deg, hsl(145 80% 40%), hsl(170 80% 40%))" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Use This
                    </motion.button>
                    <motion.button
                      onClick={discardAiBackground}
                      className="px-3 py-2 rounded-lg flex items-center justify-center"
                      style={{ background: "hsl(0 70% 50% / 0.5)" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive-foreground" />
                    </motion.button>
                    <motion.button
                      onClick={handleAiGenerate}
                      disabled={isGeneratingAi}
                      className="px-3 py-2 rounded-lg flex items-center justify-center"
                      style={{ background: "hsl(270 95% 55% / 0.5)" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAi ? "animate-spin" : ""}`} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Current AI Background */}
            {aiBackground && !previewBackground && (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src={aiBackground}
                  alt="AI background"
                  className="w-full h-full object-cover"
                />
                {selected === "ai" && (
                  <motion.div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg text-[10px] font-medium" style={{ background: "hsl(270 95% 55% / 0.5)" }}>
                  AI Generated
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackgroundSelector;
