import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const MeshBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [scrollY, setScrollY] = useState(0);
  const particlesRef = useRef<Array<{ id: number; x: number; y: number; size: number; speed: number; hue: number }>>([]);

  // Initialize particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1,
      hue: Math.random() > 0.5 ? 270 : 35,
    }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Base dark background with depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(240 20% 12%) 0%, hsl(240 30% 8%) 50%, hsl(240 40% 4%) 100%)`,
        }}
      />

      {/* Animated aurora mesh gradients */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse at 20% 30%, hsl(270 95% 65% / 0.2) 0%, transparent 50%), 
             radial-gradient(ellipse at 80% 70%, hsl(35 100% 60% / 0.15) 0%, transparent 50%),
             radial-gradient(ellipse at 50% 50%, hsl(300 80% 50% / 0.1) 0%, transparent 60%)`,
            `radial-gradient(ellipse at 80% 20%, hsl(270 95% 65% / 0.2) 0%, transparent 50%), 
             radial-gradient(ellipse at 20% 80%, hsl(35 100% 60% / 0.15) 0%, transparent 50%),
             radial-gradient(ellipse at 60% 40%, hsl(300 80% 50% / 0.1) 0%, transparent 60%)`,
            `radial-gradient(ellipse at 50% 80%, hsl(270 95% 65% / 0.2) 0%, transparent 50%), 
             radial-gradient(ellipse at 50% 20%, hsl(35 100% 60% / 0.15) 0%, transparent 50%),
             radial-gradient(ellipse at 30% 60%, hsl(300 80% 50% / 0.1) 0%, transparent 60%)`,
            `radial-gradient(ellipse at 20% 30%, hsl(270 95% 65% / 0.2) 0%, transparent 50%), 
             radial-gradient(ellipse at 80% 70%, hsl(35 100% 60% / 0.15) 0%, transparent 50%),
             radial-gradient(ellipse at 50% 50%, hsl(300 80% 50% / 0.1) 0%, transparent 60%)`,
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Interactive glow following cursor */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        animate={{
          x: mousePos.x * (typeof window !== "undefined" ? window.innerWidth : 1000) - 192,
          y: mousePos.y * (typeof window !== "undefined" ? window.innerHeight : 800) - 192,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        style={{
          background: "radial-gradient(circle, hsl(270 95% 65% / 0.15), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* 3D Grid lines for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(270 95% 65% / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(270 95% 65% / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          transform: `perspective(500px) rotateX(60deg) translateY(${scrollY * 0.5}px)`,
          transformOrigin: "center 0",
        }}
      />

      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Enhanced floating particles with 3D movement */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
            width: `${2 + (i % 4)}px`,
            height: `${2 + (i % 4)}px`,
            background: i % 2 === 0 ? "hsl(270 95% 65%)" : "hsl(35 100% 60%)",
            filter: `blur(${i % 3}px)`,
          }}
          animate={{
            y: [0, -50 - (i % 30), 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 5 + (i % 5),
            repeat: Infinity,
            delay: (i % 10) * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 rounded-full bg-foreground"
          style={{
            left: `${20 + i * 30}%`,
            top: `${10 + i * 20}%`,
          }}
          animate={{
            x: [0, 200],
            y: [0, 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 5 + 3,
            repeatDelay: 8,
            ease: "easeOut",
          }}
        >
          {/* Star trail */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.5))",
            }}
          />
        </motion.div>
      ))}

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsl(240 40% 4% / 0.8) 100%)",
        }}
      />
    </div>
  );
};

export default MeshBackground;
