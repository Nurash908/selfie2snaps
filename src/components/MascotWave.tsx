import { motion } from "framer-motion";

const MascotWave = () => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
    >
      <motion.div
        className="relative w-16 h-16 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Banana body */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          <defs>
            <linearGradient id="bananaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(48 100% 67%)" />
              <stop offset="50%" stopColor="hsl(45 100% 55%)" />
              <stop offset="100%" stopColor="hsl(42 90% 45%)" />
            </linearGradient>
            <filter id="bananaGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Banana shape */}
          <motion.path
            d="M 30 70 Q 20 50 35 30 Q 50 15 70 25 Q 85 35 80 55 Q 75 75 50 80 Q 35 82 30 70"
            fill="url(#bananaGradient)"
            filter="url(#bananaGlow)"
            animate={{
              d: [
                "M 30 70 Q 20 50 35 30 Q 50 15 70 25 Q 85 35 80 55 Q 75 75 50 80 Q 35 82 30 70",
                "M 28 68 Q 18 48 33 28 Q 50 13 72 23 Q 87 33 82 53 Q 77 73 52 78 Q 37 80 28 68",
                "M 30 70 Q 20 50 35 30 Q 50 15 70 25 Q 85 35 80 55 Q 75 75 50 80 Q 35 82 30 70"
              ]
            }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Eyes */}
          <circle cx="45" cy="45" r="4" fill="hsl(0 0% 15%)" />
          <circle cx="60" cy="40" r="4" fill="hsl(0 0% 15%)" />
          <circle cx="46" cy="44" r="1.5" fill="hsl(0 0% 100%)" />
          <circle cx="61" cy="39" r="1.5" fill="hsl(0 0% 100%)" />

          {/* Smile */}
          <motion.path
            d="M 42 55 Q 52 65 62 52"
            fill="none"
            stroke="hsl(0 0% 15%)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Waving hand */}
          <motion.ellipse
            cx="75"
            cy="30"
            rx="8"
            ry="5"
            fill="url(#bananaGradient)"
            animate={{
              rotate: [-20, 20, -20],
            }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "70px 35px" }}
          />

          {/* Sparkles */}
          <motion.circle
            cx="25"
            cy="35"
            r="2"
            fill="hsl(270 95% 75%)"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.circle
            cx="85"
            cy="60"
            r="2"
            fill="hsl(35 100% 70%)"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </svg>

        {/* Speech bubble */}
        <motion.div
          className="absolute -top-12 -left-16 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
          style={{
            background: "hsl(0 0% 15%)",
            border: "1px solid hsl(0 0% 25%)"
          }}
          initial={{ opacity: 0, scale: 0.8, x: 10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 2 }}
        >
          <span className="text-secondary">Hey there! 👋</span>
          <div 
            className="absolute -bottom-1 right-4 w-2 h-2 rotate-45"
            style={{ background: "hsl(0 0% 15%)" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MascotWave;