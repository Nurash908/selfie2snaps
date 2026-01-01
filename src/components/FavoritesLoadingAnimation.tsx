import { motion } from 'framer-motion';
import { Heart, Sparkles, Star, ImageIcon } from 'lucide-react';

const floatingIcons = [
  { Icon: Heart, delay: 0, color: 'hsl(350 80% 60%)' },
  { Icon: Star, delay: 0.3, color: 'hsl(35 100% 60%)' },
  { Icon: Sparkles, delay: 0.6, color: 'hsl(270 95% 65%)' },
  { Icon: ImageIcon, delay: 0.9, color: 'hsl(200 90% 55%)' },
];

const heartParticles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 8 + 4,
  delay: Math.random() * 2,
  duration: Math.random() * 3 + 2,
}));

const FavoritesLoadingAnimation = () => {
  return (
    <div className="relative h-64 flex flex-col items-center justify-center overflow-hidden">
      {/* Background floating hearts */}
      {heartParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0.5],
            y: [-20, -60],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <Heart 
            className="text-primary/30" 
            style={{ 
              width: particle.size, 
              height: particle.size,
            }} 
            fill="currentColor"
          />
        </motion.div>
      ))}

      {/* Central pulsing heart */}
      <motion.div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, hsl(350 80% 60% / 0.3) 0%, transparent 70%)',
        }}
      >
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Pulsing glow */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(270 95% 65% / 0.4), hsl(350 80% 60% / 0.2))',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Heart icon */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Heart className="w-10 h-10 text-primary" fill="currentColor" />
        </motion.div>
      </motion.div>

      {/* Orbiting icons */}
      <div className="absolute inset-0 flex items-center justify-center">
        {floatingIcons.map(({ Icon, delay, color }, index) => {
          const angle = (index * 360) / floatingIcons.length;
          const radius = 70;
          
          return (
            <motion.div
              key={index}
              className="absolute"
              initial={{
                x: Math.cos((angle * Math.PI) / 180) * radius,
                y: Math.sin((angle * Math.PI) / 180) * radius,
              }}
              animate={{
                x: [
                  Math.cos((angle * Math.PI) / 180) * radius,
                  Math.cos(((angle + 360) * Math.PI) / 180) * radius,
                ],
                y: [
                  Math.sin((angle * Math.PI) / 180) * radius,
                  Math.sin(((angle + 360) * Math.PI) / 180) * radius,
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
                delay,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: delay * 2,
                }}
              >
                <Icon style={{ color, width: 18, height: 18 }} />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Loading text */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p
          className="text-muted-foreground text-sm font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading Your Favorites
        </motion.p>
        
        {/* Animated dots */}
        <div className="flex items-center justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom shimmer */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 h-0.5 w-24 rounded-full overflow-hidden"
        style={{ background: 'hsl(0 0% 20%)' }}
      >
        <motion.div
          className="h-full w-8 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(270 95% 65%), hsl(350 80% 60%), transparent)',
          }}
          animate={{ x: [-32, 120] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
};

export default FavoritesLoadingAnimation;
