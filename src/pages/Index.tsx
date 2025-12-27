import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Heart, User as UserIcon, LogOut, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BananaLogo from "@/components/BananaLogo";
import SystemStatusPanel from "@/components/SystemStatusPanel";
import PortraitCard from "@/components/PortraitCard";
import FramesControl from "@/components/FramesControl";
import RatioSelector from "@/components/RatioSelector";
import SceneSelector from "@/components/SceneSelector";
import PositionSwapToggle from "@/components/PositionSwapToggle";
import GenerateButton from "@/components/GenerateButton";
import FeatureCards from "@/components/FeatureCards";
import NeuralConstellation from "@/components/NeuralConstellation";
import FilmStrip from "@/components/FilmStrip";
import ScratchReveal from "@/components/ScratchReveal";
import NarrativeCaption from "@/components/NarrativeCaption";
import AuthModal from "@/components/AuthModal";
import FavoritesSection from "@/components/FavoritesSection";
import HistorySection from "@/components/HistorySection";
import PersonalizedGreeting from "@/components/PersonalizedGreeting";
import PreviewGallery from "@/components/PreviewGallery";
import SuccessConfetti from "@/components/SuccessConfetti";
import ParticleField from "@/components/ParticleField";
import TutorialOverlay from "@/components/TutorialOverlay";
import ImageCropper from "@/components/ImageCropper";
import PoseSuggestion from "@/components/PoseSuggestion";
import FloatingOrbs from "@/components/FloatingOrbs";
import HolographicCard from "@/components/HolographicCard";
import GlowingBorder from "@/components/GlowingBorder";
import StyleSelector from "@/components/StyleSelector";
import SocialShareButtons from "@/components/SocialShareButtons";
import Floating3DElement from "@/components/Floating3DElement";
import MorphingBlob from "@/components/MorphingBlob";
import { useAuth } from "@/hooks/useAuth";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

type AppState = "upload" | "configure" | "processing" | "scratch" | "result";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("upload");
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [frameCount, setFrameCount] = useState(1);
  const [selectedRatio, setSelectedRatio] = useState("16:9");
  const [selectedScene, setSelectedScene] = useState("natural");
  const [selectedStyle, setSelectedStyle] = useState("natural");
  const [swapPositions, setSwapPositions] = useState(false);
  const [generatedFrames, setGeneratedFrames] = useState<string[]>([]);
  const [narrative, setNarrative] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("System Ready");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const handleRegenerateFromHistory = (settings: { style: string; scene: string; ratio: string }) => {
    setSelectedStyle(settings.style);
    setSelectedScene(settings.scene);
    setSelectedRatio(settings.ratio);
  };
  const [showPreview, setShowPreview] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [cropImage, setCropImage] = useState<{ image: string; index: 1 | 2 } | null>(null);

  const { user, signOut } = useAuth();
  const { playSound } = useSoundEffects();
  const { triggerHaptic } = useHapticFeedback();

  // Check if first-time user
  useEffect(() => {
    const tutorialComplete = localStorage.getItem("selfie2snap_tutorial_complete");
    if (!tutorialComplete) {
      // Small delay to let the page load first
      setTimeout(() => setShowTutorial(true), 1000);
    }
  }, []);

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
      setProgressStatus("System Ready");
    } else if (image1 && !image2) {
      setProgress(40);
      setProgressStatus("Portrait 1 Loaded");
    } else if (image1 && image2 && appState === "upload") {
      setProgress(80);
      setProgressStatus("Ready to Generate");
    } else if (appState === "processing") {
      setProgress(95);
      setProgressStatus("Neural Synthesis...");
    } else if (appState === "result" || appState === "scratch") {
      setProgress(100);
      setProgressStatus("Rendering Complete");
    }
  }, [image1, image2, appState]);

  const handleImageUpload = useCallback((file: File, index: 1 | 2) => {
    // Require authentication to upload
    if (!user) {
      playSound("click");
      toast.error("Please sign in to upload images");
      setShowAuthModal(true);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (index === 1) setImage1(result);
      else setImage2(result);
      playSound("upload");
    };
    reader.readAsDataURL(file);
  }, [user, playSound]);

  const handleCropRequest = useCallback((index: 1 | 2) => {
    const image = index === 1 ? image1 : image2;
    if (image) {
      setCropImage({ image, index });
    }
  }, [image1, image2]);

  const handleCropComplete = useCallback((croppedImage: string) => {
    if (cropImage) {
      if (cropImage.index === 1) setImage1(croppedImage);
      else setImage2(croppedImage);
      setCropImage(null);
      toast.success("Image cropped successfully!");
    }
  }, [cropImage]);

  // Function to save generated frames to history
  const saveToHistory = async (frames: string[], captionText: string) => {
    if (!user) return;
    
    try {
      // Save each frame to history
      for (const imageUrl of frames) {
        await supabase.from('generation_history').insert({
          user_id: user.id,
          image_url: imageUrl,
          style: selectedStyle,
          scene: selectedScene,
          ratio: selectedRatio,
          narrative: captionText,
        });
      }
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const handleTransform = async () => {
    // Require authentication to generate
    if (!user) {
      playSound("click");
      toast.error("Please sign in to generate snaps");
      setShowAuthModal(true);
      return;
    }
    
    playSound("generate");
    setAppState("processing");
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-snap", {
        body: { image1, image2, ratio: selectedRatio, frameCount, scene: selectedScene, swapPositions, style: selectedStyle },
      });

      if (error) throw error;

      playSound("complete");
      if (data?.frames && data.frames.length > 0) {
        setGeneratedFrames(data.frames);
        const narrativeText = data.narrative || "A beautiful moment captured in time.";
        setNarrative(narrativeText);
        // Save to history
        await saveToHistory(data.frames, narrativeText);
        setAppState("scratch");
      } else {
        // Generate demo frames based on frameCount
        const demoFrames = Array.from({ length: frameCount }, (_, i) => {
          const images = [
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop",
            "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop",
          ];
          return images[i % images.length] + `&seed=${Date.now()}-${i}`;
        });
        setGeneratedFrames(demoFrames);
        const demoNarrative = "A shared moment between friends captured in time.";
        setNarrative(demoNarrative);
        // Save demo frames to history too
        await saveToHistory(demoFrames, demoNarrative);
        setAppState("scratch");
      }
    } catch (error) {
      console.error("Error generating snap:", error);
      toast.error("Using demo mode - AI generation coming soon!");
      // Generate demo frames based on frameCount
      const demoFrames = Array.from({ length: frameCount }, (_, i) => {
        const images = [
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop",
          "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop",
        ];
        return images[i % images.length] + `&seed=${Date.now()}-${i}`;
      });
      setGeneratedFrames(demoFrames);
      const demoNarrative = "A shared moment between friends.";
      setNarrative(demoNarrative);
      // Save demo frames to history
      await saveToHistory(demoFrames, demoNarrative);
      setAppState("scratch");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScratchComplete = () => {
    playSound("success");
    setShowConfetti(true);
    setTimeout(() => {
      setAppState("result");
    }, 500);
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  const handleReset = () => {
    playSound("reset");
    setAppState("upload");
    setImage1(null);
    setImage2(null);
    setGeneratedFrames([]);
    setNarrative("");
    setProgress(0);
    setProgressStatus("System Ready");
  };

  const handleAddFrame = () => {
    if (frameCount < 2) {
      setFrameCount(frameCount + 1);
    }
  };


  const bothImagesUploaded = image1 && image2;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(250 30% 8%) 0%, hsl(250 25% 5%) 100%)",
      }}
    >
      {/* Confetti effect on success */}
      <SuccessConfetti trigger={showConfetti} onComplete={handleConfettiComplete} />

      {/* Floating orbs background */}
      <FloatingOrbs intensity="medium" />

      {/* Particle field for ambient effect */}
      <ParticleField isActive={appState === "result"} intensity="medium" />

      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            top: "10%",
            left: "10%",
            background: "radial-gradient(circle, hsl(270 95% 65% / 0.08), transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{
            bottom: "20%",
            right: "15%",
            background: "radial-gradient(circle, hsl(35 100% 60% / 0.05), transparent 70%)",
            filter: "blur(50px)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Cursor glow */}
      <motion.div
        className="fixed w-64 h-64 rounded-full pointer-events-none z-0"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, hsl(270 95% 65% / 0.06), transparent 60%)",
          filter: "blur(30px)",
        }}
      />

      {/* Auth, History & Favorites buttons */}
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        {user && (
          <>
            <motion.button
              onClick={() => {
                playSound("click");
                setShowHistory(true);
              }}
              className="p-3 rounded-full backdrop-blur-xl border border-border/30 relative overflow-hidden group"
              style={{ background: "hsl(250 25% 12% / 0.8)" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle, hsl(200 90% 55% / 0.2), transparent)" }}
              />
              <History className="w-5 h-5 text-blue-400" />
            </motion.button>
            <motion.button
              onClick={() => {
                playSound("click");
                setShowFavorites(true);
              }}
              className="p-3 rounded-full backdrop-blur-xl border border-border/30 relative overflow-hidden group"
              style={{ background: "hsl(250 25% 12% / 0.8)" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle, hsl(270 95% 65% / 0.2), transparent)" }}
              />
              <Heart className="w-5 h-5 text-primary" />
            </motion.button>
          </>
        )}
        <motion.button
          onClick={() => {
            playSound("click");
            if (user) {
              signOut();
              toast.success("Signed out");
            } else {
              setShowAuthModal(true);
            }
          }}
          className="p-3 rounded-full backdrop-blur-xl border border-border/30"
          style={{ background: "hsl(250 25% 12% / 0.8)" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {user ? (
            <LogOut className="w-5 h-5 text-muted-foreground" />
          ) : (
            <UserIcon className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.button>
      </div>

      <div className="container max-w-md mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Header with 3D Effects */}
        <motion.header
          className="text-center mb-8 relative"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating decorative elements */}
          <motion.div
            className="absolute -top-4 left-1/4 w-2 h-2 rounded-full bg-primary"
            animate={{
              y: [0, -15, 0],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ boxShadow: "0 0 15px hsl(270 95% 65%)" }}
          />
          <motion.div
            className="absolute top-8 right-1/4 w-1.5 h-1.5 rounded-full bg-secondary"
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{ boxShadow: "0 0 12px hsl(35 100% 60%)" }}
          />
          <motion.div
            className="absolute -top-2 right-1/3 w-1 h-1 rounded-full bg-foreground/60"
            animate={{
              y: [0, -8, 0],
              x: [0, 5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          <BananaLogo />

          <motion.h1
            className="text-4xl md:text-5xl font-serif font-bold mb-3 flex items-center justify-center gap-2 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ perspective: "1000px" }}
          >
            <motion.span 
              className="text-metallic relative"
              animate={{ 
                textShadow: [
                  "0 0 20px hsl(270 95% 65% / 0.3)",
                  "0 0 40px hsl(270 95% 65% / 0.5)",
                  "0 0 20px hsl(270 95% 65% / 0.3)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              Selfie
            </motion.span>
            <motion.span
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl font-mono relative"
              style={{
                background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 50%))",
                boxShadow: "0 8px 32px hsl(270 95% 55% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.2)",
              }}
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              whileHover={{ 
                scale: 1.2, 
                rotate: 15,
                boxShadow: "0 12px 40px hsl(270 95% 55% / 0.6)",
              }}
            >
              2
              {/* Inner glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, hsl(0 0% 100% / 0.2), transparent)",
                }}
              />
            </motion.span>
            <motion.span 
              className="text-metallic"
              animate={{ 
                textShadow: [
                  "0 0 20px hsl(35 100% 60% / 0.3)",
                  "0 0 40px hsl(35 100% 60% / 0.5)",
                  "0 0 20px hsl(35 100% 60% / 0.3)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              whileHover={{ scale: 1.05, rotateY: -5 }}
            >
              Snap
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xs font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Created by Nurash Weerasinghe
            </motion.span>
          </motion.p>

          <motion.p
            className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Fuse two realities into one perfect cinematic moment using{" "}
            <motion.span 
              className="text-secondary font-medium"
              animate={{ 
                textShadow: [
                  "0 0 8px hsl(35 100% 60% / 0)",
                  "0 0 12px hsl(35 100% 60% / 0.5)",
                  "0 0 8px hsl(35 100% 60% / 0)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Nano Banana's
            </motion.span>{" "}
            neural engine.
          </motion.p>
        </motion.header>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {(appState === "upload" || appState === "configure") && (
            <motion.div
              key="upload-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
              {/* Personalized Greeting */}
              <PersonalizedGreeting />
              
              {/* System Status */}
              <SystemStatusPanel progress={progress} status={progressStatus} />

              {/* Portrait Cards with 3D perspective */}
              <GlowingBorder colors={["hsl(270 95% 65%)", "hsl(35 100% 60%)", "hsl(300 80% 60%)"]} speed={4}>
                <motion.div
                  className="p-6 rounded-2xl relative overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, hsl(250 30% 12%) 0%, hsl(250 25% 8%) 100%)",
                  }}
                  initial={{ opacity: 0, y: 20, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                >
                  {/* Decorative corner elements */}
                  <motion.div
                    className="absolute top-3 left-3 w-8 h-8"
                    style={{
                      borderLeft: "2px solid hsl(270 95% 65% / 0.4)",
                      borderTop: "2px solid hsl(270 95% 65% / 0.4)",
                    }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute top-3 right-3 w-8 h-8"
                    style={{
                      borderRight: "2px solid hsl(35 100% 60% / 0.4)",
                      borderTop: "2px solid hsl(35 100% 60% / 0.4)",
                    }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.div
                    className="absolute bottom-3 left-3 w-8 h-8"
                    style={{
                      borderLeft: "2px solid hsl(35 100% 60% / 0.4)",
                      borderBottom: "2px solid hsl(35 100% 60% / 0.4)",
                    }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                  <motion.div
                    className="absolute bottom-3 right-3 w-8 h-8"
                    style={{
                      borderRight: "2px solid hsl(270 95% 65% / 0.4)",
                      borderBottom: "2px solid hsl(270 95% 65% / 0.4)",
                    }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                  />

                  {/* Scanning line effect */}
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent, hsl(270 95% 65% / 0.5), transparent)",
                      boxShadow: "0 0 10px hsl(270 95% 65% / 0.3)",
                    }}
                    animate={{ y: [0, 300, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <div className="flex justify-center gap-6 relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.02, rotateY: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{ perspective: "1000px" }}
                    >
                      <PortraitCard
                        label={swapPositions ? "Portrait 2" : "Portrait 1"}
                        image={swapPositions ? image2 : image1}
                        onImageUpload={(file) => handleImageUpload(file, swapPositions ? 2 : 1)}
                        onRemoveImage={() => swapPositions ? setImage2(null) : setImage1(null)}
                        onCropRequest={() => handleCropRequest(swapPositions ? 2 : 1)}
                      />
                    </motion.div>
                    
                    {/* Connection indicator */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                      animate={bothImagesUploaded ? {
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3],
                      } : { opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div 
                        className="w-16 h-16 rounded-full"
                        style={{
                          background: "radial-gradient(circle, hsl(270 95% 65% / 0.3), transparent)",
                          filter: "blur(10px)",
                        }}
                      />
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02, rotateY: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{ perspective: "1000px" }}
                    >
                      <PortraitCard
                        label={swapPositions ? "Portrait 1" : "Portrait 2"}
                        image={swapPositions ? image1 : image2}
                        onImageUpload={(file) => handleImageUpload(file, swapPositions ? 1 : 2)}
                        onRemoveImage={() => swapPositions ? setImage1(null) : setImage2(null)}
                        onCropRequest={() => handleCropRequest(swapPositions ? 1 : 2)}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </GlowingBorder>

              {/* Pose Suggestion Tips */}
              <PoseSuggestion />

              {/* Controls */}
              <AnimatePresence>
                {bothImagesUploaded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <HolographicCard>
                      <div className="p-5 space-y-6">
                        <SceneSelector selected={selectedScene} onSelect={setSelectedScene} />
                        <StyleSelector selected={selectedStyle} onSelect={setSelectedStyle} />
                        <PositionSwapToggle 
                          isSwapped={swapPositions} 
                          onToggle={() => setSwapPositions(!swapPositions)} 
                        />
                        <FramesControl
                          value={frameCount}
                          onChange={setFrameCount}
                          min={1}
                          max={2}
                        />
                        <RatioSelector selected={selectedRatio} onSelect={setSelectedRatio} />
                      </div>
                    </HolographicCard>

                    <GlowingBorder>
                      <GenerateButton
                        onGenerate={handleTransform}
                        onAddFrame={handleAddFrame}
                        onReset={handleReset}
                        isGenerating={isGenerating}
                        disabled={!bothImagesUploaded}
                      />
                    </GlowingBorder>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Feature Cards */}
              <FeatureCards />
            </motion.div>
          )}

          {appState === "processing" && (
            <motion.div
              key="processing"
              className="flex flex-col items-center justify-center min-h-[60vh]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NeuralConstellation />
            </motion.div>
          )}

          {appState === "scratch" && generatedFrames.length > 0 && (
            <motion.div
              key="scratch"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.p className="text-lg text-muted-foreground mb-8 text-center font-mono">
                ✨ Frames ready!{" "}
                <span className="text-foreground">Scratch to reveal...</span>
              </motion.p>
              <ScratchReveal
                revealImage={generatedFrames[0]}
                onRevealComplete={handleScratchComplete}
              />
            </motion.div>
          )}

          {appState === "result" && (
            <motion.div
              key="result"
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Morphing blobs for result screen */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <MorphingBlob color="hsl(270 95% 65%)" size={300} className="top-20 -left-20" />
                <MorphingBlob color="hsl(35 100% 60%)" size={250} className="bottom-40 -right-10" />
              </div>

              <Floating3DElement intensity={8} floatAmplitude={5}>
                <NarrativeCaption caption={narrative} />
              </Floating3DElement>

              <FilmStrip
                frames={generatedFrames}
                onBless={() => toast.success("Blessings sent! 💛")}
              />

              <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center gap-3">
                  <motion.button
                    onClick={() => {
                      playSound("preview");
                      setShowPreview(true);
                    }}
                    className="px-6 py-3 rounded-xl font-mono text-sm tracking-wider flex items-center gap-2 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(35 100% 55%))",
                      boxShadow: "0 8px 32px hsl(270 95% 55% / 0.3)",
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 12px 40px hsl(270 95% 55% / 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Shine animation */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.3) 50%, transparent 100%)",
                      }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                    <span className="relative z-10">Preview All</span>
                  </motion.button>
                </div>

                {/* Social Share Buttons */}
                {generatedFrames.length > 0 && (
                  <SocialShareButtons 
                    imageUrl={generatedFrames[0]} 
                    caption="Check out my Selfie2Snap creation! Two selfies, one epic moment! 🍌✨"
                    onDownload={() => {
                      playSound("download");
                      // Trigger download
                      const link = document.createElement('a');
                      link.href = generatedFrames[0];
                      link.download = 'selfie2snap.jpg';
                      link.click();
                      toast.success("Downloaded!");
                    }}
                  />
                )}
              </div>
              
              <GenerateButton
                onGenerate={handleTransform}
                onReset={handleReset}
                isGenerating={isGenerating}
                disabled={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span>Powered by</span>
            <span className="text-secondary">Nano Banana AI</span>
            <span>🍌</span>
          </div>
        </motion.footer>
      </div>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <FavoritesSection isOpen={showFavorites} onClose={() => setShowFavorites(false)} />
      <HistorySection isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <AnimatePresence>
        {showPreview && (
          <PreviewGallery
            frames={generatedFrames}
            vibe={selectedRatio}
            onClose={() => setShowPreview(false)}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}
      </AnimatePresence>
      
      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay onComplete={() => setShowTutorial(false)} />
      )}

      {/* Image Cropper */}
      {cropImage && (
        <ImageCropper
          image={cropImage.image}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImage(null)}
        />
      )}
    </div>
  );
};

export default Index;
