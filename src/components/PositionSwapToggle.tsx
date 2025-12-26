import { motion } from "framer-motion";
import { ArrowLeftRight, RotateCw } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useState } from "react";

interface PositionSwapToggleProps {
  isSwapped: boolean;
  onToggle: () => void;
}

const PositionSwapToggle = ({ isSwapped, onToggle }: PositionSwapToggleProps) => {
  const { playSound } = useSoundEffects();
  const { triggerHaptic } = useHapticFeedback();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    playSound("click");
    triggerHaptic("medium");
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    onToggle();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <motion.button
        onClick={handleToggle}
        className="relative w-full flex items-center justify-center gap-4 py-4 px-6 rounded-2xl overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, hsl(250 30% 12%) 0%, hsl(250 25% 8%) 100%)",
          border: "1px solid hsl(250 30% 20%)",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, hsl(270 95% 65% / 0.08) 0%, hsl(35 100% 60% / 0.05) 100%)",
          }}
        />

        {/* Floating particles on hover */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40 opacity-0 group-hover:opacity-100"
            style={{
              left: `${15 + i * 14}%`,
              top: "50%",
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}

        {/* Left position indicator */}
        <motion.div
          className="relative z-10 flex items-center gap-2"
          animate={{ x: isSwapped ? 10 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{
              background: isSwapped 
                ? "linear-gradient(135deg, hsl(35 100% 55%), hsl(35 100% 45%))"
                : "linear-gradient(135deg, hsl(270 95% 55%), hsl(270 95% 45%))",
              boxShadow: isSwapped
                ? "0 4px 15px hsl(35 100% 55% / 0.4)"
                : "0 4px 15px hsl(270 95% 55% / 0.4)",
            }}
            animate={isAnimating ? { rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {isSwapped ? "2" : "1"}
          </motion.div>
          <span className="text-xs font-mono text-muted-foreground">
            {isSwapped ? "Right" : "Left"}
          </span>
        </motion.div>

        {/* Swap icon with 3D rotation */}
        <motion.div
          className="relative z-10 p-3 rounded-xl"
          style={{
            background: "linear-gradient(135deg, hsl(250 25% 18%) 0%, hsl(250 25% 14%) 100%)",
            border: "1px solid hsl(250 30% 25%)",
          }}
          animate={isAnimating ? { 
            rotateY: [0, 180, 360],
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          whileHover={{ 
            boxShadow: "0 0 25px hsl(270 95% 65% / 0.4)",
          }}
        >
          <motion.div
            animate={isAnimating ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ArrowLeftRight className="w-5 h-5 text-primary" />
          </motion.div>
          
          {/* Rotating ring effect */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              border: "2px solid transparent",
              background: "linear-gradient(135deg, hsl(270 95% 65% / 0.3), hsl(35 100% 60% / 0.3)) border-box",
              mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
            }}
            animate={isAnimating ? { 
              rotate: 360,
              opacity: [0, 1, 0],
            } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>

        {/* Right position indicator */}
        <motion.div
          className="relative z-10 flex items-center gap-2"
          animate={{ x: isSwapped ? -10 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="text-xs font-mono text-muted-foreground">
            {isSwapped ? "Left" : "Right"}
          </span>
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{
              background: isSwapped 
                ? "linear-gradient(135deg, hsl(270 95% 55%), hsl(270 95% 45%))"
                : "linear-gradient(135deg, hsl(35 100% 55%), hsl(35 100% 45%))",
              boxShadow: isSwapped
                ? "0 4px 15px hsl(270 95% 55% / 0.4)"
                : "0 4px 15px hsl(35 100% 55% / 0.4)",
            }}
            animate={isAnimating ? { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {isSwapped ? "1" : "2"}
          </motion.div>
        </motion.div>

        {/* Shine effect on click */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, hsl(270 95% 65% / 0.3) 50%, transparent 100%)",
          }}
          animate={isAnimating ? { x: ["-100%", "200%"] } : { x: "-100%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.button>

      {/* Label */}
      <motion.p
        className="text-center mt-2 text-xs font-mono text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        SWAP POSITIONS IN COMBINED PHOTO
      </motion.p>
    </motion.div>
  );
};

export default PositionSwapToggle;
