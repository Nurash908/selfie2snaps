import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Sparkles, Wand2, RotateCcw, Zap } from "lucide-react";
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
  const [generatedFrames, setGeneratedFrames] = useState<string[]>([]);
  const [narrative, setNarrative] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
    <div className="min-h-screen overflow-x-hidden relative">
      <MeshBackground />
      <MascotWave />

      {/* Interactive cursor glow */}
      <motion.div
        className="fixed w-64 h-64 rounded-full pointer-events-none z-0"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, hsl(270 95% 65% / 0.08), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-16 relative z-10">
        {/* Header with enhanced animations */}
        <motion.header
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          {/* Decorative top element */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <motion.div
              className="w-16 h-1 rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(270 95% 65%), hsl(35 100% 60%), transparent)",
              }}
              animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-4 relative"
            initial={{ filter: "blur(20px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.span
              className="inline-block"
              style={{
                background: "linear-gradient(135deg, hsl(0 0% 85%), hsl(0 0% 100%), hsl(0 0% 75%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 60px hsl(0 0% 100% / 0.2)",
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Selfie
            </motion.span>
            <motion.span
              className="inline-block mx-2"
              style={{
                background: "linear-gradient(135deg, hsl(270 95% 65%), hsl(300 80% 60%), hsl(35 100% 60%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              2
            </motion.span>
            <motion.span
              className="inline-block"
              style={{
                background: "linear-gradient(135deg, hsl(0 0% 85%), hsl(0 0% 100%), hsl(0 0% 75%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              Snap
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-sm md:text-base tracking-[0.3em] text-muted-foreground uppercase font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            by{" "}
            <span
              className="font-medium"
              style={{
                background: "linear-gradient(90deg, hsl(270 95% 75%), hsl(35 100% 70%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nurash Weerasinghe
            </span>
          </motion.p>

          <motion.p
            className="mt-6 text-lg md:text-xl text-foreground/60 max-w-lg mx-auto font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Transform two selfies into{" "}
            <span className="text-foreground font-medium">beautiful AI-generated</span> art moments
          </motion.p>

          {/* Feature badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {["No Sign Up", "Instant Results", "AI Powered"].map((badge, i) => (
              <motion.div
                key={badge}
                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide"
                style={{
                  background: "hsl(0 0% 10%)",
                  border: "1px solid hsl(0 0% 20%)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
                whileHover={{ scale: 1.05, borderColor: "hsl(270 95% 65%)" }}
              >
                <span className="text-muted-foreground">{badge}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {(appState === "upload" || appState === "configure") && (
            <motion.div
              key="upload-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-14"
            >
              {/* Upload section with enhanced layout */}
              <motion.div
                className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-28"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>

              {/* Configuration panel */}
              <AnimatePresence>
                {bothImagesUploaded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="space-y-10 overflow-hidden"
                  >
                    {/* Section divider */}
                    <motion.div
                      className="flex items-center justify-center gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="h-px w-20 bg-gradient-to-r from-transparent to-border" />
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <div className="h-px w-20 bg-gradient-to-l from-transparent to-border" />
                    </motion.div>

                    <MagicSlider value={frameCount} onChange={setFrameCount} min={1} max={10} />
                    <VibeSelector selected={selectedVibe} onSelect={setSelectedVibe} />
                    <AuraFilters selected={selectedAura} onSelect={setSelectedAura} />

                    {/* Transform button */}
                    <motion.div
                      className="flex justify-center pt-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <motion.button
                        onClick={handleTransform}
                        disabled={isGenerating}
                        className="group relative px-12 py-5 rounded-2xl font-semibold text-lg tracking-wide overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 50%), hsl(35 100% 55%))",
                          backgroundSize: "200% 200%",
                        }}
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 50px hsl(270 95% 65% / 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                        transition={{ backgroundPosition: { duration: 4, repeat: Infinity } }}
                      >
                        {/* Button shine effect */}
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.2) 45%, hsl(0 0% 100% / 0.3) 50%, hsl(0 0% 100% / 0.2) 55%, transparent 60%)",
                          }}
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />

                        <span className="relative z-10 flex items-center gap-3 text-foreground">
                          <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                          >
                            <Wand2 className="w-5 h-5" />
                          </motion.div>
                          Create Magic
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        </span>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {appState === "processing" && (
            <motion.div
              key="processing"
              className="flex flex-col items-center justify-center min-h-[60vh]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <NeuralConstellation />
            </motion.div>
          )}

          {appState === "scratch" && generatedFrames.length > 0 && (
            <motion.div
              key="scratch"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.p
                className="text-lg text-muted-foreground mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ✨ Your snaps are ready!{" "}
                <span className="text-foreground font-medium">Scratch to reveal...</span>
              </motion.p>
              <ScratchReveal revealImage={generatedFrames[0]} onRevealComplete={handleScratchComplete} />
            </motion.div>
          )}

          {appState === "result" && (
            <motion.div
              key="result"
              className="space-y-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NarrativeCaption caption={narrative} />
              <FilmStrip frames={generatedFrames} onBless={() => toast.success("Blessings sent! 💛")} />
              <DownloadBundle frames={generatedFrames} onDownload={handleDownload} />

              <motion.div
                className="flex justify-center pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={handleReset}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground transition-all duration-300 group"
                  style={{
                    background: "hsl(0 0% 8%)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 30px hsl(0 0% 0% / 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="group-hover:rotate-[-360deg] transition-transform duration-500"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.div>
                  Create Another Snap
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          className="mt-24 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: "hsl(0 0% 8%)",
              border: "1px solid hsl(0 0% 15%)",
            }}
            whileHover={{ borderColor: "hsl(0 0% 25%)" }}
          >
            <span className="text-sm text-muted-foreground">Powered by</span>
            <span
              className="text-sm font-semibold"
              style={{
                background: "linear-gradient(90deg, hsl(48 100% 60%), hsl(35 100% 55%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nano Banana AI
            </span>
            <motion.span
              className="text-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🍌
            </motion.span>
          </motion.div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
