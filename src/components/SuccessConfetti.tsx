import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

interface SuccessConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

const SuccessConfetti = ({ trigger, onComplete }: SuccessConfettiProps) => {
  const fireConfetti = useCallback(() => {
    // Primary burst - purple/violet theme
    const colors = ["#a855f7", "#8b5cf6", "#fbbf24", "#f59e0b", "#ffffff"];
    
    // Center explosion
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { x: 0.5, y: 0.5 },
      colors: colors,
      ticks: 300,
      gravity: 0.8,
      scalar: 1.2,
      shapes: ["circle", "square"],
      disableForReducedMotion: true,
    });

    // Left side burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        ticks: 250,
        gravity: 1,
        scalar: 1,
      });
    }, 100);

    // Right side burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        ticks: 250,
        gravity: 1,
        scalar: 1,
      });
    }, 100);

    // Stars burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 180,
        origin: { x: 0.5, y: 0.4 },
        colors: ["#fbbf24", "#fcd34d", "#fef3c7"],
        startVelocity: 45,
        gravity: 0.5,
        ticks: 200,
        shapes: ["star"],
        scalar: 1.5,
      });
    }, 200);

    // Heart particles
    setTimeout(() => {
      const heartShape = confetti.shapeFromText({ text: "💜", scalar: 2 });
      confetti({
        particleCount: 20,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        shapes: [heartShape],
        scalar: 3,
        gravity: 0.6,
        ticks: 180,
      });
    }, 300);

    // Final sparkle shower
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 360,
        origin: { x: 0.5, y: 0.3 },
        colors: ["#ffffff", "#a855f7", "#fbbf24"],
        startVelocity: 20,
        gravity: 0.4,
        ticks: 150,
        shapes: ["circle"],
        scalar: 0.6,
      });
      onComplete?.();
    }, 400);
  }, [onComplete]);

  useEffect(() => {
    if (trigger) {
      fireConfetti();
    }
  }, [trigger, fireConfetti]);

  return null;
};

export default SuccessConfetti;
