import { motion } from "framer-motion";

interface Premium3DTextProps {
  text: string;
  className?: string;
  gradient?: boolean;
}

const Premium3DText = ({ text, className = "", gradient = true }: Premium3DTextProps) => {
  const letters = text.split("");

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="relative inline-block font-serif font-bold"
          style={{
            textShadow: `
              0 2px 4px hsl(0 0% 0% / 0.3),
              0 4px 8px hsl(0 0% 0% / 0.2),
              0 8px 16px hsl(270 95% 65% / 0.2)
            `,
            color: gradient ? "transparent" : "currentColor",
            backgroundImage: gradient 
              ? "linear-gradient(135deg, hsl(270 95% 75%) 0%, hsl(35 100% 70%) 50%, hsl(300 80% 70%) 100%)"
              : "none",
            backgroundClip: gradient ? "text" : "initial",
            WebkitBackgroundClip: gradient ? "text" : "initial",
          }}
          initial={{ 
            opacity: 0, 
            y: 20,
            rotateX: -90,
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotateX: 0,
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{
            scale: 1.2,
            y: -5,
            transition: { duration: 0.2 },
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default Premium3DText;
