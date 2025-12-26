import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

const HolographicCard = ({ 
  children, 
  className = "", 
  glowColor = "hsl(270 95% 65%)" 
}: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  
  const rotateX = useTransform(smoothMouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-8, 8]);
  
  const gradientX = useTransform(smoothMouseX, [0, 1], [0, 100]);
  const gradientY = useTransform(smoothMouseY, [0, 1], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: "linear-gradient(180deg, hsl(250 30% 12%) 0%, hsl(250 25% 8%) 100%)",
          border: "1px solid hsl(250 30% 20%)",
          boxShadow: `
            0 25px 50px hsl(0 0% 0% / 0.3),
            0 0 30px ${glowColor}15
          `,
        }}
        whileHover={{ 
          boxShadow: `
            0 35px 70px hsl(0 0% 0% / 0.4),
            0 0 50px ${glowColor}25
          `,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Holographic shimmer overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `
              linear-gradient(
                135deg,
                transparent 0%,
                hsl(270 95% 75% / 0.1) 25%,
                hsl(35 100% 70% / 0.1) 50%,
                hsl(300 80% 70% / 0.1) 75%,
                transparent 100%
              )
            `,
            backgroundSize: "200% 200%",
            mixBlendMode: "overlay",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Dynamic highlight based on mouse position */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: useTransform(
              [gradientX, gradientY],
              ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, hsl(0 0% 100% / 0.1), transparent 50%)`
            ),
          }}
        />

        {/* Rainbow edge effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `
              linear-gradient(90deg, 
                hsl(270 95% 65% / 0.3) 0%, 
                hsl(35 100% 60% / 0.3) 33%, 
                hsl(300 80% 60% / 0.3) 66%, 
                hsl(270 95% 65% / 0.3) 100%
              )
            `,
            backgroundSize: "300% 100%",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            padding: "1px",
            borderRadius: "16px",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Content */}
        <div className="relative z-5">{children}</div>
      </motion.div>
    </motion.div>
  );
};

export default HolographicCard;
