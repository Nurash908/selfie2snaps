import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Camera, Wand2, Stars, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

const greetings = [
  { text: "Ready to create some magic", emoji: "✨" },
  { text: "Let's capture something amazing", emoji: "🎬" },
  { text: "Time to shine", emoji: "⭐" },
  { text: "Your creativity awaits", emoji: "🎨" },
  { text: "Let's make memories", emoji: "📸" },
];

const motivations = [
  "Transform your selfies into art!",
  "Ready to get your snaps fused?",
  "Let's create cinematic moments!",
  "Your perfect shot is waiting!",
  "Time for some photo magic!",
];

const PersonalizedGreeting = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState(greetings[0]);
  const [motivation, setMotivation] = useState(motivations[0]);
  const [showSparkle, setShowSparkle] = useState(false);

  useEffect(() => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    setGreeting(randomGreeting);
    setMotivation(randomMotivation);
  }, []);

  // Periodic sparkle effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Creator';

  if (!user) return null;

  return (
    <motion.div
      className="relative mb-6 p-4 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      style={{
        background: 'linear-gradient(135deg, hsl(270 40% 15% / 0.6) 0%, hsl(250 35% 12% / 0.8) 100%)',
        border: '1px solid hsl(270 50% 30% / 0.3)',
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 50%, hsl(270 95% 65% / 0.1) 0%, transparent 50%)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Floating particles */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? 'hsl(270 95% 65%)' : 'hsl(35 100% 60%)',
              left: `${15 + i * 15}%`,
              boxShadow: `0 0 8px ${i % 2 === 0 ? 'hsl(270 95% 65%)' : 'hsl(35 100% 60%)'}`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

      {/* Sparkle burst effect */}
      <AnimatePresence>
        {showSparkle && (
          <motion.div
            className="absolute top-2 right-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Sparkles className="w-5 h-5 text-secondary" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex items-center gap-4">
        {/* Animated avatar */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <motion.div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 60%))',
              boxShadow: '0 4px 20px hsl(270 95% 55% / 0.4)',
            }}
            animate={{
              boxShadow: [
                '0 4px 20px hsl(270 95% 55% / 0.4)',
                '0 4px 30px hsl(270 95% 55% / 0.6)',
                '0 4px 20px hsl(270 95% 55% / 0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(120deg, transparent 40%, hsl(0 0% 100% / 0.3) 50%, transparent 60%)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <span className="text-foreground relative z-10">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </motion.div>
          
          {/* Status indicator */}
          <motion.div
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card"
            style={{ background: 'hsl(145 80% 50%)' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Greeting text */}
        <div className="flex-1 min-w-0">
          <motion.div
            className="flex items-center gap-2 flex-wrap"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm text-muted-foreground">Hey</span>
            <motion.span
              className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              {displayName}
            </motion.span>
            <motion.span
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              👋
            </motion.span>
          </motion.div>
          
          <motion.p
            className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {greeting.text}
            </motion.span>
            <span>{greeting.emoji}</span>
          </motion.p>
        </div>

        {/* Decorative icons */}
        <div className="hidden sm:flex items-center gap-1">
          {[Camera, Wand2, Stars].map((Icon, i) => (
            <motion.div
              key={i}
              className="p-1.5 rounded-lg"
              style={{ background: 'hsl(270 40% 20% / 0.5)' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Motivational tagline */}
      <motion.div
        className="mt-3 pt-3 border-t border-border/20 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.p
          className="text-xs text-muted-foreground italic flex items-center gap-1.5"
          animate={{ 
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Zap className="w-3 h-3 text-secondary" />
          {motivation}
        </motion.p>
        
        <motion.div
          className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
          style={{ 
            background: 'hsl(145 80% 50% / 0.15)',
            color: 'hsl(145 80% 60%)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          Online
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PersonalizedGreeting;
