import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

interface Floating3DElementProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  floatAmplitude?: number;
  floatDuration?: number;
}

const Floating3DElement = ({ 
  children, 
  className = "",
  intensity = 15,
  floatAmplitude = 10,
  floatDuration = 4,
}: Floating3DElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const rotateX = useTransform(smoothMouseY, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-intensity, intensity]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from element center
      const distX = (e.clientX - centerX) / (window.innerWidth / 2);
      const distY = (e.clientY - centerY) / (window.innerHeight / 2);
      
      mouseX.set(0.5 + distX * 0.5);
      mouseY.set(0.5 + distY * 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -floatAmplitude, 0],
        }}
        transition={{
          y: {
            duration: floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Floating3DElement;
