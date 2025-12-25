import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Sparkles, Wand2, RotateCcw, Zap, Heart, User as UserIcon, LogOut } from "lucide-react";
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
import AuthModal from "@/components/AuthModal";
import ProgressIndicator from "@/components/ProgressIndicator";
import FavoritesSection from "@/components/FavoritesSection";
import PreviewGallery from "@/components/PreviewGallery";
import { useAuth } from "@/hooks/useAuth";
import { useSoundEffects } from "@/hooks/useSoundEffects";

type AppState = "upload" | "configure" | "processing" | "scratch" | "result";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("upload");
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [frameCount, setFrameCount] = useState(5);
  const [selectedVibe, setSelectedVibe] = useState("stained-glass");
  const [selectedAura, setSelectedAura] = useState<string | null>(null);
  const [generatedFrames, setGeneratedFrames] = useState<string[]>([]);
  const [narrative, setNarrative] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { user, signOut } = useAuth();
  const { playSound } = useSoundEffects();

  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Progress calculation
  useEffect(() => {
    if (!image1 && !image2) {
      setProgress(0);
      setProgressStatus("");
    } else if (image1 && !image2) {
      setProgress(40);
      setProgressStatus("First portrait selected");
    } else if (image1 && image2 && appState === "upload") {
      setProgress(80);
      setProgressStatus("Both portraits ready");
    } else if (appState === "processing") {
      setProgress(95);
      setProgressStatus("Generating magic...");
    } else if (appState === "result" || appState === "scratch") {
      setProgress(100);
      setProgressStatus("Complete!");
    }
  }, [image1, image2, appState]);

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
    playSound('generate');
    setAppState("processing");
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-snap", {
        body: { image1, image2, vibe: selectedVibe, aura: selectedAura, frameCount },
      });

      if (error) throw error;

      playSound('complete');
      if (data?.frames) {
        setGeneratedFrames(data.frames);
        setNarrative(data.narrative || "A beautiful moment captured in time.");
        setAppState("scratch");
      } else {
        const demoFrames = [
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop",
        ];
        setGeneratedFrames(demoFrames.slice(0, frameCount));
        setNarrative("A shared moment between friends captured in time.");
        setAppState("scratch");
      }
    } catch (error) {
      console.error("Error generating snap:", error);
      toast.error("Using demo mode - AI generation coming soon!");
      const demoFrames = [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop",
      ];
      setGeneratedFrames(demoFrames.slice(0, frameCount));
      setNarrative("A shared moment between friends.");
      setAppState("scratch");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScratchComplete = () => {
    playSound('success');
    setTimeout(() => setAppState("result"), 500);
  };

  const handleReset = () => {
    playSound('reset');
    setAppState("upload");
    setImage1(null);
    setImage2(null);
    setGeneratedFrames([]);
    setNarrative("");
    setProgress(0);
  };

  const handleDownload = (type: string) => {
    playSound('download');
    toast.success(`Downloading ${type}...`);
  };

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <MeshBackground />
      <MascotWave />

      {/* Progress indicator */}
      <AnimatePresence>
        {progress > 0 && progress < 100 && (
          <ProgressIndicator progress={progress} status={progressStatus} />
        )}
      </AnimatePresence>

      {/* Auth & Favorites buttons */}
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        {user && (
          <motion.button
            onClick={() => { playSound('click'); setShowFavorites(true); }}
            className="p-3 rounded-full backdrop-blur-xl"
            style={{ background: 'hsl(0 0% 10% / 0.8)', border: '1px solid hsl(0 0% 20%)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="w-5 h-5 text-secondary" />
          </motion.button>
        )}
        <motion.button
          onClick={() => {
            playSound('click');
            if (user) {
              signOut();
              toast.success('Signed out');
            } else {
              setShowAuthModal(true);
            }
          }}
          className="p-3 rounded-full backdrop-blur-xl"
          style={{ background: 'hsl(0 0% 10% / 0.8)', border: '1px solid hsl(0 0% 20%)' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {user ? <LogOut className="w-5 h-5 text-foreground" /> : <UserIcon className="w-5 h-5 text-foreground" />}
        </motion.button>
      </div>

      {/* Interactive cursor glow */}
      <motion.div
        className="fixed w-64 h-64 rounded-full pointer-events-none z-0"
        style={{
          x: smoothMouseX, y: smoothMouseY, translateX: "-50%", translateY: "-50%",
          background: "radial-gradient(circle, hsl(270 95% 65% / 0.08), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-16 relative z-10">
        {/* Header */}
        <motion.header className="text-center mb-12 md:mb-20" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-4">
            <span style={{ background: "linear-gradient(135deg, hsl(0 0% 85%), hsl(0 0% 100%), hsl(0 0% 75%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Selfie</span>
            <motion.span className="inline-block mx-2" style={{ background: "linear-gradient(135deg, hsl(270 95% 65%), hsl(300 80% 60%), hsl(35 100% 60%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }} animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>2</motion.span>
            <span style={{ background: "linear-gradient(135deg, hsl(0 0% 85%), hsl(0 0% 100%), hsl(0 0% 75%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Snap</span>
          </motion.h1>
          <motion.p className="text-sm tracking-[0.3em] text-muted-foreground uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            by <span style={{ background: "linear-gradient(90deg, hsl(270 95% 75%), hsl(35 100% 70%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nurash Weerasinghe</span>
          </motion.p>
          <motion.p className="mt-6 text-lg text-foreground/60 max-w-lg mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            Upload two reference images, choose how many frames you need, and watch <span className="text-foreground font-medium">Nano Banana</span> transform them into charming selfie moments.
          </motion.p>
        </motion.header>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {(appState === "upload" || appState === "configure") && (
            <motion.div key="upload-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-14">
              <motion.div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-28">
                <GlassSphere label="Person 1" image={image1} onImageUpload={(file) => handleImageUpload(file, 1)} onRemoveImage={() => setImage1(null)} isConnected={!!bothImagesUploaded} variant="left" />
                <ConnectionLine isConnected={!!bothImagesUploaded} />
                <GlassSphere label="Person 2" image={image2} onImageUpload={(file) => handleImageUpload(file, 2)} onRemoveImage={() => setImage2(null)} isConnected={!!bothImagesUploaded} variant="right" />
              </motion.div>

              <AnimatePresence>
                {bothImagesUploaded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-10 overflow-hidden">
                    <motion.div className="flex items-center justify-center gap-4"><div className="h-px w-20 bg-gradient-to-r from-transparent to-border" /><Zap className="w-4 h-4 text-muted-foreground" /><div className="h-px w-20 bg-gradient-to-l from-transparent to-border" /></motion.div>
                    <MagicSlider value={frameCount} onChange={setFrameCount} min={1} max={10} />
                    <VibeSelector selected={selectedVibe} onSelect={setSelectedVibe} />
                    <AuraFilters selected={selectedAura} onSelect={setSelectedAura} />
                    <motion.div className="flex justify-center pt-6">
                      <motion.button onClick={handleTransform} disabled={isGenerating} className="group relative px-12 py-5 rounded-2xl font-semibold text-lg overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 50%), hsl(35 100% 55%))", backgroundSize: "200% 200%" }} whileHover={{ scale: 1.05, boxShadow: "0 20px 50px hsl(270 95% 65% / 0.4)" }} whileTap={{ scale: 0.98 }}>
                        <span className="relative z-10 flex items-center gap-3 text-foreground"><Wand2 className="w-5 h-5" />Generate SelfiSnaps<Sparkles className="w-5 h-5" /></span>
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
            <motion.div key="scratch" className="flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.p className="text-lg text-muted-foreground mb-8 text-center">✨ Your snaps are ready! <span className="text-foreground font-medium">Scratch to reveal...</span></motion.p>
              <ScratchReveal revealImage={generatedFrames[0]} onRevealComplete={handleScratchComplete} />
            </motion.div>
          )}

          {appState === "result" && (
            <motion.div key="result" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <NarrativeCaption caption={narrative} />
              <FilmStrip frames={generatedFrames} onBless={() => toast.success("Blessings sent! 💛")} />
              <div className="flex justify-center gap-4">
                <motion.button onClick={() => { playSound('preview'); setShowPreview(true); }} className="px-6 py-3 rounded-xl font-medium flex items-center gap-2" style={{ background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(35 100% 55%))" }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Sparkles className="w-4 h-4" />Preview All
                </motion.button>
              </div>
              <DownloadBundle frames={generatedFrames} onDownload={handleDownload} />
              <motion.div className="flex justify-center pt-8">
                <motion.button onClick={handleReset} className="flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-muted-foreground border border-border hover:text-foreground" style={{ background: "hsl(0 0% 8%)" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <RotateCcw className="w-4 h-4" />Reset Workspace
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer className="mt-24 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          <motion.div className="inline-flex items-center gap-3 px-6 py-3 rounded-full" style={{ background: "hsl(0 0% 8%)", border: "1px solid hsl(0 0% 15%)" }}>
            <span className="text-sm text-muted-foreground">Powered by</span>
            <span className="text-sm font-semibold" style={{ background: "linear-gradient(90deg, hsl(48 100% 60%), hsl(35 100% 55%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nano Banana AI</span>
            <span className="text-xl">🍌</span>
          </motion.div>
        </motion.footer>
      </div>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <FavoritesSection isOpen={showFavorites} onClose={() => setShowFavorites(false)} />
      <AnimatePresence>
        {showPreview && <PreviewGallery frames={generatedFrames} vibe={selectedVibe} onClose={() => setShowPreview(false)} onOpenAuth={() => setShowAuthModal(true)} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
