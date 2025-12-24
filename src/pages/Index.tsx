import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MeshBackground from "@/components/MeshBackground";
import GlassSphere from "@/components/GlassSphere";
import ConnectionLine from "@/components/ConnectionLine";
import MagicSlider from "@/components/MagicSlider";
import VibeSelector from "@/components/VibeSelector";
import AuraFilters from "@/components/AuraFilters";
import NeuralConstellation from "@/components/NeuralConstellation";
import FilmStrip from "@/components/FilmStrip";
import ScratchReveal from "@/components/ScratchReveal";
import DownloadBundle from "@/components/DownloadBundle";
import NarrativeCaption from "@/components/NarrativeCaption";
import MascotWave from "@/components/MascotWave";

type AppState = "upload" | "configure" | "processing" | "scratch" | "result";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("upload");
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [frameCount, setFrameCount] = useState(5);
  const [selectedVibe, setSelectedVibe] = useState("stained-glass");
  const [selectedAura, setSelectedAura] = useState<string | null>(null);
  const [titleVisible, setTitleVisible] = useState(false);
  const [generatedFrames, setGeneratedFrames] = useState<string[]>([]);
  const [narrative, setNarrative] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = useCallback((file: File, sphereIndex: 1 | 2) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (sphereIndex === 1) {
        setImage1(result);
      } else {
        setImage2(result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const bothImagesUploaded = image1 && image2;

  const handleTransform = async () => {
    setAppState("processing");
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-snap", {
        body: {
          image1,
          image2,
          vibe: selectedVibe,
          aura: selectedAura,
          frameCount,
        },
      });

      if (error) throw error;

      if (data?.frames) {
        setGeneratedFrames(data.frames);
        setNarrative(data.narrative || "A beautiful moment of connection captured in time.");
        setAppState("scratch");
      } else {
        // Fallback to demo frames
        const demoFrames = [
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop",
        ];
        setGeneratedFrames(demoFrames.slice(0, frameCount));
        setNarrative("A shared laugh between friends captured in time.");
        setAppState("scratch");
      }
    } catch (error) {
      console.error("Error generating snap:", error);
      toast.error("Using demo mode - AI generation coming soon!");
      // Use demo frames
      const demoFrames = [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop",
      ];
      setGeneratedFrames(demoFrames.slice(0, frameCount));
      setNarrative("A shared laugh between friends captured in time.");
      setAppState("scratch");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScratchComplete = () => {
    setTimeout(() => setAppState("result"), 500);
  };

  const handleReset = () => {
    setAppState("upload");
    setImage1(null);
    setImage2(null);
    setGeneratedFrames([]);
    setNarrative("");
  };

  const handleDownload = (type: string) => {
    toast.success(`Downloading ${type}...`);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <MeshBackground />
      <MascotWave />

      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <motion.header
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          onAnimationComplete={() => setTitleVisible(true)}
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-4"
            initial={{ filter: "blur(20px)" }}
            animate={{ filter: "blur(0px)" }}
            transition={{ duration: 1.2 }}
          >
            <span className="text-metallic">Selfie</span>
            <motion.span
              className="text-primary inline-block"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              2
            </motion.span>
            <span className="text-metallic">Snap</span>
          </motion.h1>

          <motion.p
            className="text-sm md:text-base tracking-[0.3em] text-muted-foreground uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: titleVisible ? 1 : 0 }}
            transition={{ delay: 0.3 }}
          >
            Created by Nurash Weerasinghe
          </motion.p>

          <motion.p
            className="mt-4 text-lg text-foreground/70 max-w-md mx-auto font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Transform two selfies into beautiful AI-generated art moments
          </motion.p>
        </motion.header>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {(appState === "upload" || appState === "configure") && (
            <motion.div
              key="upload-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24">
                <GlassSphere
                  label="Person 1"
                  image={image1}
                  onImageUpload={(file) => handleImageUpload(file, 1)}
                  isConnected={!!bothImagesUploaded}
                  variant="left"
                />
                <ConnectionLine isConnected={!!bothImagesUploaded} />
                <GlassSphere
                  label="Person 2"
                  image={image2}
                  onImageUpload={(file) => handleImageUpload(file, 2)}
                  isConnected={!!bothImagesUploaded}
                  variant="right"
                />
              </div>

              <AnimatePresence>
                {bothImagesUploaded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8 overflow-hidden"
                  >
                    <MagicSlider value={frameCount} onChange={setFrameCount} min={1} max={10} />
                    <VibeSelector selected={selectedVibe} onSelect={setSelectedVibe} />
                    <AuraFilters selected={selectedAura} onSelect={setSelectedAura} />

                    <motion.div
                      className="flex justify-center pt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <motion.button
                        onClick={handleTransform}
                        disabled={isGenerating}
                        className="group relative px-10 py-4 rounded-full font-semibold text-lg tracking-wide overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, hsl(270 95% 65%), hsl(300 80% 55%), hsl(35 100% 60%))",
                          backgroundSize: "200% 200%",
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                        transition={{ backgroundPosition: { duration: 3, repeat: Infinity } }}
                      >
                        <span className="relative z-10 flex items-center gap-3 text-foreground">
                          <Wand2 className="w-5 h-5" />
                          Create Magic
                          <Sparkles className="w-5 h-5" />
                        </span>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {appState === "processing" && (
            <motion.div key="processing" className="flex flex-col items-center justify-center min-h-[60vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <NeuralConstellation />
            </motion.div>
          )}

          {appState === "scratch" && generatedFrames.length > 0 && (
            <motion.div key="scratch" className="flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.p className="text-lg text-muted-foreground mb-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Your snaps are ready! Scratch to reveal...
              </motion.p>
              <ScratchReveal revealImage={generatedFrames[0]} onRevealComplete={handleScratchComplete} />
            </motion.div>
          )}

          {appState === "result" && (
            <motion.div key="result" className="space-y-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <NarrativeCaption caption={narrative} />
              <FilmStrip frames={generatedFrames} onBless={() => toast.success("Blessings sent! 💛")} />
              <DownloadBundle frames={generatedFrames} onDownload={handleDownload} />

              <motion.div className="flex justify-center pt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <motion.button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-8 py-3 rounded-full font-medium text-muted-foreground border border-border hover:border-primary hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Create Another Snap
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.footer className="mt-20 text-center text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          <p className="flex items-center justify-center gap-2">
            Powered by <span className="text-secondary font-medium">Nano Banana</span> AI
            <span className="text-lg">🍌</span>
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
