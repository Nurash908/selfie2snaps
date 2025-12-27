import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Sparkles } from "lucide-react";

interface ThemeToggleProps {
  onToggle?: () => void;
}

const ThemeToggle = ({ onToggle }: ThemeToggleProps) => {
  const [isDark, setIsDark] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("selfie2snap_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
    document.documentElement.classList.toggle("light", !initialDark);
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("selfie2snap_theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
    document.documentElement.classList.toggle("light", !newTheme);
    onToggle?.();
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-3 rounded-full backdrop-blur-xl border border-border/30 overflow-hidden group"
      style={{ 
        background: isDark 
          ? "hsl(250 25% 12% / 0.8)" 
          : "hsl(40 30% 90% / 0.9)"
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: isDark 
            ? "radial-gradient(circle, hsl(45 100% 50% / 0.2), transparent)" 
            : "radial-gradient(circle, hsl(270 95% 65% / 0.2), transparent)"
        }}
      />

      {/* Sparkle particles during animation */}
      <AnimatePresence>
        {isAnimating && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: isDark ? "hsl(45 100% 60%)" : "hsl(270 95% 65%)",
                  left: "50%",
                  top: "50%",
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, Math.cos((i * 60 * Math.PI) / 180) * 30],
                  y: [0, Math.sin((i * 60 * Math.PI) / 180) * 30],
                  opacity: [0, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Icon transition */}
      <div className="relative w-5 h-5">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="w-5 h-5 text-blue-300" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="w-5 h-5 text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Orbital ring animation */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{
          borderTopColor: isDark ? "hsl(45 100% 60% / 0.4)" : "hsl(270 95% 65% / 0.4)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
