import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Sliders, Sparkles, Download, ChevronRight, ChevronLeft } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
}

interface TutorialOverlayProps {
  onComplete: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Upload Your Portraits",
    description: "Drag and drop or click to upload two portrait images. These will be magically combined by our AI.",
    icon: <Upload className="w-8 h-8" />,
    highlight: "portrait-cards",
  },
  {
    title: "Configure Your Snap",
    description: "Choose how many frames you want (1-10) and select your preferred aspect ratio for the perfect result.",
    icon: <Sliders className="w-8 h-8" />,
    highlight: "controls",
  },
  {
    title: "Generate Magic",
    description: "Hit the Generate button and watch as Nano Banana's neural engine transforms your portraits into stunning moments.",
    icon: <Sparkles className="w-8 h-8" />,
    highlight: "generate",
  },
  {
    title: "Download & Share",
    description: "Browse your generated frames, save your favorites, and download them individually or as a bundle.",
    icon: <Download className="w-8 h-8" />,
    highlight: "download",
  },
];

const TutorialOverlay = ({ onComplete }: TutorialOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { playSound } = useSoundEffects();

  const handleNext = () => {
    playSound("click");
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    playSound("click");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    playSound("success");
    setIsVisible(false);
    localStorage.setItem("selfie2snap_tutorial_complete", "true");
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    playSound("click");
    handleComplete();
  };

  const step = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "hsl(250 30% 5% / 0.9)", backdropFilter: "blur(8px)" }}
            onClick={handleSkip}
          />

          {/* Tutorial Card */}
          <motion.div
            className="relative w-full max-w-sm rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsl(250 30% 15%) 0%, hsl(250 25% 10%) 100%)",
              border: "1px solid hsl(250 30% 25%)",
            }}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Close button */}
            <motion.button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 rounded-full z-10"
              style={{ background: "hsl(250 25% 20%)" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>

            {/* Step indicator */}
            <div className="flex justify-center gap-2 pt-6 px-6">
              {tutorialSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className="h-1 rounded-full"
                  style={{
                    width: index === currentStep ? 24 : 8,
                    background: index <= currentStep ? "hsl(270 95% 65%)" : "hsl(250 20% 25%)",
                  }}
                  animate={{
                    width: index === currentStep ? 24 : 8,
                    background: index <= currentStep ? "hsl(270 95% 65%)" : "hsl(250 20% 25%)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                className="p-8 pt-6 text-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <motion.div
                  className="mx-auto mb-6 w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, hsl(270 95% 55% / 0.2), hsl(35 100% 55% / 0.1))",
                    border: "1px solid hsl(270 95% 65% / 0.3)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 20px hsl(270 95% 65% / 0.2)",
                      "0 0 40px hsl(270 95% 65% / 0.4)",
                      "0 0 20px hsl(270 95% 65% / 0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-primary">{step.icon}</div>
                </motion.div>

                {/* Title */}
                <h2 className="text-xl font-serif font-bold text-foreground mb-3">
                  {step.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  {step.description}
                </p>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                  <motion.button
                    onClick={handlePrev}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-mono tracking-wider text-muted-foreground"
                    style={{
                      background: "hsl(250 25% 18%)",
                      opacity: currentStep === 0 ? 0.5 : 1,
                    }}
                    disabled={currentStep === 0}
                    whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
                    whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </motion.button>

                  <motion.button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-6 py-2 rounded-lg text-sm font-mono tracking-wider text-primary-foreground"
                    style={{
                      background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(35 100% 55%))",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentStep === tutorialSteps.length - 1 ? "Get Started" : "Next"}
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Skip link */}
                <motion.button
                  onClick={handleSkip}
                  className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip tutorial
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialOverlay;
