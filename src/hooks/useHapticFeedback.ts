import { useCallback } from "react";

type HapticType = "light" | "medium" | "heavy" | "success" | "error";

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticType = "light") => {
    // Create visual pulse effect
    const pulse = document.createElement("div");
    pulse.className = "haptic-pulse";
    
    const colors: Record<HapticType, string> = {
      light: "hsl(270 95% 65% / 0.3)",
      medium: "hsl(270 95% 65% / 0.5)",
      heavy: "hsl(270 95% 65% / 0.7)",
      success: "hsl(142 76% 55% / 0.5)",
      error: "hsl(0 72% 51% / 0.5)",
    };

    const scales: Record<HapticType, number> = {
      light: 1.02,
      medium: 1.05,
      heavy: 1.08,
      success: 1.1,
      error: 1.06,
    };

    pulse.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      background: radial-gradient(circle at center, ${colors[type]}, transparent 60%);
      opacity: 0;
      animation: hapticPulse 0.3s ease-out forwards;
    `;

    document.body.appendChild(pulse);

    // Add keyframes if not exists
    if (!document.getElementById("haptic-styles")) {
      const style = document.createElement("style");
      style.id = "haptic-styles";
      style.textContent = `
        @keyframes hapticPulse {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.05); }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => pulse.remove(), 300);

    return scales[type];
  }, []);

  return { triggerHaptic };
};
