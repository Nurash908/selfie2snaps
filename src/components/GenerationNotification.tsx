import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Camera, Zap, PartyPopper, X } from "lucide-react";

interface GenerationNotificationProps {
  isVisible: boolean;
  userName?: string;
  frameCount?: number;
  onClose: () => void;
  onViewResults?: () => void;
}

const celebrationMessages = [
  "Your snaps are absolutely stunning! 🎨",
  "Magic has been created! ✨",
  "Wow, these turned out amazing! 🌟",
  "Ready to blow minds! 💫",
  "Pure photographic gold! 📸",
  "The AI outdid itself this time! 🚀",
];

const GenerationNotification = ({
  isVisible,
  userName,
  frameCount = 1,
  onClose,
  onViewResults,
}: GenerationNotificationProps) => {
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const randomMessage = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
      setCelebrationMessage(randomMessage);
      setShowConfetti(true);
      
      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const displayName = userName?.split("@")[0] || "Creative Genius";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 right-4 z-50 max-w-sm"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {/* Glow effect behind card */}
          <motion.div
            className="absolute -inset-4 rounded-3xl"
            style={{
              background: "radial-gradient(circle, hsl(270 95% 65% / 0.3), transparent 70%)",
              filter: "blur(20px)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Main notification card */}
          <motion.div
            className="relative rounded-2xl p-5 backdrop-blur-xl border overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(250 25% 12% / 0.95), hsl(270 30% 15% / 0.95))",
              borderColor: "hsl(270 95% 65% / 0.4)",
              boxShadow: "0 20px 60px hsl(270 95% 65% / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.1)",
            }}
          >
            {/* Animated sparkle particles */}
            {showConfetti && [...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? "hsl(270 95% 65%)" : "hsl(35 100% 60%)",
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  y: [0, -30 - Math.random() * 20],
                  x: [0, (Math.random() - 0.5) * 40],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: 2,
                  repeatDelay: 0.5,
                }}
              />
            ))}

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-border/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>

            {/* Header with icon */}
            <div className="flex items-start gap-4 mb-4">
              <motion.div
                className="relative flex-shrink-0"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 50%))",
                    boxShadow: "0 8px 24px hsl(270 95% 55% / 0.5)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 8px 24px hsl(270 95% 55% / 0.5)",
                      "0 8px 40px hsl(270 95% 55% / 0.8)",
                      "0 8px 24px hsl(270 95% 55% / 0.5)",
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <PartyPopper className="w-7 h-7 text-foreground" />
                </motion.div>
                
                {/* Orbiting sparkle */}
                <motion.div
                  className="absolute w-3 h-3 rounded-full"
                  style={{ background: "hsl(35 100% 60%)" }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  initial={{ x: 20, y: 0 }}
                >
                  <motion.div
                    className="w-full h-full rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>

              <div className="flex-1 min-w-0">
                <motion.h3
                  className="text-lg font-serif font-bold text-foreground mb-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Hey {displayName}! 🎉
                </motion.h3>
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Your generation is complete!
                </motion.p>
              </div>
            </div>

            {/* Success message */}
            <motion.div
              className="mb-4 p-3 rounded-xl"
              style={{
                background: "linear-gradient(135deg, hsl(150 60% 40% / 0.15), hsl(170 60% 35% / 0.1))",
                border: "1px solid hsl(150 60% 50% / 0.3)",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-green-400">
                  {frameCount} {frameCount === 1 ? "snap" : "snaps"} generated!
                </span>
              </div>
              <p className="text-sm text-foreground/80 italic">
                {celebrationMessage}
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex items-center justify-between gap-3 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Camera className="w-4 h-4 text-primary" />
                <span>AI Enhanced</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="w-4 h-4 text-secondary" />
                <span>High Quality</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Ready!</span>
              </div>
            </motion.div>

            {/* Action button */}
            {onViewResults && (
              <motion.button
                onClick={() => {
                  onViewResults();
                  onClose();
                }}
                className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 50%))",
                  boxShadow: "0 4px 20px hsl(270 95% 55% / 0.4)",
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 6px 30px hsl(270 95% 55% / 0.6)",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Sparkles className="w-4 h-4" />
                View Your Snaps
              </motion.button>
            )}

            {/* Progress bar animation */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 rounded-b-2xl"
              style={{ background: "linear-gradient(90deg, hsl(270 95% 55%), hsl(35 100% 60%))" }}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 8, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GenerationNotification;
