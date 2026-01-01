import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { toast } from "sonner";

interface BackgroundSelectorProps {
  selected: string;
  onSelect: (background: string, type: "preset" | "custom" | "ai") => void;
  customBackground: string | null;
  onCustomUpload: (imageUrl: string) => void;
  aiBackground: string | null;
  onAiGenerate: (imageUrl: string) => void;
}

const stockBackgrounds = [
  { 
    id: "sunset-beach", 
    label: "Sunset Beach", 
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=75&fit=crop"
  },
  { 
    id: "tropical-paradise", 
    label: "Tropical Paradise", 
    url: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=100&h=75&fit=crop"
  },
  { 
    id: "city-night", 
    label: "City Night", 
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=100&h=75&fit=crop"
  },
  { 
    id: "tokyo-neon", 
    label: "Tokyo Neon", 
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&h=75&fit=crop"
  },
  { 
    id: "mountains", 
    label: "Mountains", 
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100&h=75&fit=crop"
  },
  { 
    id: "snowy-peaks", 
    label: "Snowy Peaks", 
    url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=100&h=75&fit=crop"
  },
  { 
    id: "forest", 
    label: "Forest", 
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=100&h=75&fit=crop"
  },
  { 
    id: "autumn-woods", 
    label: "Autumn Woods", 
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=75&fit=crop"
  },
  { 
    id: "studio-gradient", 
    label: "Studio Pink", 
    url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=100&h=75&fit=crop"
  },
  { 
    id: "studio-blue", 
    label: "Studio Blue", 
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&h=75&fit=crop"
  },
  { 
    id: "neon-party", 
    label: "Neon Party", 
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=100&h=75&fit=crop"
  },
  { 
    id: "club-lights", 
    label: "Club Lights", 
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=75&fit=crop"
  },
  { 
    id: "cherry-blossom", 
    label: "Cherry Blossom", 
    url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=100&h=75&fit=crop"
  },
  { 
    id: "northern-lights", 
    label: "Northern Lights", 
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=100&h=75&fit=crop"
  },
  { 
    id: "desert-dunes", 
    label: "Desert Dunes", 
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=100&h=75&fit=crop"
  },
  { 
    id: "underwater", 
    label: "Underwater", 
    url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=300&fit=crop",
    preview: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=100&h=75&fit=crop"
  },
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useSoundEffects();

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
            className="grid grid-cols-3 gap-2"
          >
            {stockBackgrounds.map((bg) => {
              const isSelected = selected === bg.id;
              return (
                <motion.button
                  key={bg.id}
                  onClick={() => {
                    playSound("click");
                    onSelect(bg.id, "preset");
                  }}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden ${
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
                  <span className="absolute bottom-1 left-1 right-1 text-[10px] font-medium text-foreground truncate">
                    {bg.label}
                  </span>
                  {isSelected && (
                    <motion.div
                      className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
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
