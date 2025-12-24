import { motion } from "framer-motion";
import { useState } from "react";

const MascotWave = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMessage, setShowMessage] = useState(true);

  const messages = [
    "Hey there! 👋",
    "Ready to snap? ✨",
    "Let's create magic! 🎨",
    "Looking good! 🌟",
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  const handleClick = () => {
    setCurrentMessage((prev) => (prev + 1) % messages.length);
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0, y: 50, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.div
        className="relative w-20 h-20 cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, rotate: 10 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ background: "hsl(48 100% 50% / 0.4)" }}
          animate={{
            scale: isHovered ? 1.5 : [1, 1.2, 1],
            opacity: isHovered ? 0.8 : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Banana body */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="bananaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(50 100% 70%)" />
              <stop offset="30%" stopColor="hsl(48 100% 60%)" />
              <stop offset="70%" stopColor="hsl(45 100% 50%)" />
              <stop offset="100%" stopColor="hsl(40 90% 40%)" />
            </linearGradient>
            <linearGradient id="bananaHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(50 100% 85%)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="bananaGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="innerShadow">
              <feOffset dx="0" dy="2" />
              <feGaussianBlur stdDeviation="2" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="black" floodOpacity="0.3" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>

          {/* Main banana body with 3D effect */}
          <motion.path
            d="M 25 75 Q 15 50 30 25 Q 48 8 72 20 Q 90 32 85 55 Q 80 78 52 85 Q 32 88 25 75"
            fill="url(#bananaGradient)"
            filter="url(#bananaGlow)"
            animate={{
              d: isHovered
                ? "M 23 73 Q 13 48 28 23 Q 48 5 74 18 Q 92 30 87 53 Q 82 76 54 83 Q 34 86 23 73"
                : [
                    "M 25 75 Q 15 50 30 25 Q 48 8 72 20 Q 90 32 85 55 Q 80 78 52 85 Q 32 88 25 75",
                    "M 27 73 Q 17 48 32 23 Q 50 6 74 18 Q 92 30 87 53 Q 82 76 54 83 Q 34 86 27 73",
                    "M 25 75 Q 15 50 30 25 Q 48 8 72 20 Q 90 32 85 55 Q 80 78 52 85 Q 32 88 25 75",
                  ],
            }}
            transition={{ duration: isHovered ? 0.2 : 2, repeat: isHovered ? 0 : Infinity, ease: "easeInOut" }}
          />

          {/* Highlight */}
          <motion.ellipse
            cx="45"
            cy="35"
            rx="18"
            ry="12"
            fill="url(#bananaHighlight)"
            opacity={0.4}
          />

          {/* Eyes with expressions */}
          <motion.g
            animate={{
              y: isHovered ? -2 : 0,
            }}
          >
            {/* Left eye */}
            <circle cx="42" cy="42" r="6" fill="hsl(0 0% 10%)" />
            <motion.circle
              cx="42"
              cy="42"
              r="4"
              fill="hsl(0 0% 20%)"
              animate={{ scale: isHovered ? 1.2 : 1 }}
            />
            <circle cx="43" cy="40" r="2" fill="hsl(0 0% 100%)" />

            {/* Right eye */}
            <circle cx="58" cy="38" r="6" fill="hsl(0 0% 10%)" />
            <motion.circle
              cx="58"
              cy="38"
              r="4"
              fill="hsl(0 0% 20%)"
              animate={{ scale: isHovered ? 1.2 : 1 }}
            />
            <circle cx="59" cy="36" r="2" fill="hsl(0 0% 100%)" />
          </motion.g>

          {/* Smile that changes on hover */}
          <motion.path
            d="M 40 55 Q 50 65 60 52"
            fill="none"
            stroke="hsl(0 0% 10%)"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{
              d: isHovered ? "M 38 53 Q 50 70 62 50" : "M 40 55 Q 50 65 60 52",
            }}
          />

          {/* Blush */}
          <motion.ellipse
            cx="35"
            cy="52"
            rx="5"
            ry="3"
            fill="hsl(350 80% 65%)"
            opacity={0.4}
            animate={{ opacity: isHovered ? 0.6 : 0.4 }}
          />
          <motion.ellipse
            cx="65"
            cy="48"
            rx="5"
            ry="3"
            fill="hsl(350 80% 65%)"
            opacity={0.4}
            animate={{ opacity: isHovered ? 0.6 : 0.4 }}
          />

          {/* Waving hand */}
          <motion.g
            style={{ transformOrigin: "72px 25px" }}
            animate={{
              rotate: isHovered ? [-25, 25, -25] : [-15, 15, -15],
            }}
            transition={{
              duration: isHovered ? 0.3 : 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ellipse cx="78" cy="22" rx="10" ry="6" fill="url(#bananaGradient)" />
            {/* Fingers */}
            <ellipse cx="82" cy="17" rx="3" ry="5" fill="url(#bananaGradient)" />
            <ellipse cx="78" cy="15" rx="3" ry="5" fill="url(#bananaGradient)" />
            <ellipse cx="74" cy="17" rx="3" ry="4" fill="url(#bananaGradient)" />
          </motion.g>

          {/* Sparkles around */}
          <motion.circle
            cx="20"
            cy="30"
            r="3"
            fill="hsl(270 95% 75%)"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.circle
            cx="88"
            cy="65"
            r="2.5"
            fill="hsl(35 100% 70%)"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
          <motion.circle
            cx="30"
            cy="80"
            r="2"
            fill="hsl(300 80% 70%)"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          />

          {/* Star sparkle */}
          <motion.path
            d="M 15 55 L 17 52 L 20 55 L 17 58 Z"
            fill="hsl(48 100% 70%)"
            animate={{
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "17px 55px" }}
          />
        </svg>

        {/* Speech bubble */}
        <motion.div
          className="absolute -top-14 -left-20 px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap"
          style={{
            background: "linear-gradient(135deg, hsl(0 0% 15%), hsl(0 0% 10%))",
            border: "1px solid hsl(0 0% 25%)",
            boxShadow: "0 10px 30px hsl(0 0% 0% / 0.4)",
          }}
          initial={{ opacity: 0, scale: 0.8, x: 10, y: 10 }}
          animate={{
            opacity: showMessage ? 1 : 0,
            scale: showMessage ? 1 : 0.8,
            x: 0,
            y: 0,
          }}
          transition={{ delay: 2, type: "spring" }}
        >
          <motion.span
            className="text-secondary"
            key={currentMessage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {messages[currentMessage]}
          </motion.span>
          <div
            className="absolute -bottom-2 right-6 w-4 h-4 rotate-45"
            style={{
              background: "linear-gradient(135deg, transparent 50%, hsl(0 0% 12%) 50%)",
              borderRight: "1px solid hsl(0 0% 25%)",
              borderBottom: "1px solid hsl(0 0% 25%)",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MascotWave;
