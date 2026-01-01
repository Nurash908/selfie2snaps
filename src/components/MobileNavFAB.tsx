import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, History, Heart, LogOut, User as UserIcon } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileNavFABProps {
  user: any;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenFavorites: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

const MobileNavFAB = ({
  user,
  onOpenSettings,
  onOpenHistory,
  onOpenFavorites,
  onOpenAuth,
  onSignOut,
}: MobileNavFABProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { playSound } = useSoundEffects();
  const isMobile = useIsMobile();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      // Delay to prevent immediate close
      const timeout = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      return () => {
        clearTimeout(timeout);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isOpen]);

  const menuItems = [
    {
      icon: Settings,
      label: 'Settings',
      onClick: onOpenSettings,
      color: 'hsl(0 0% 70%)',
      showAlways: true,
    },
    {
      icon: History,
      label: 'History',
      onClick: onOpenHistory,
      color: 'hsl(200 90% 55%)',
      showWhenLoggedIn: true,
    },
    {
      icon: Heart,
      label: 'Favorites',
      onClick: onOpenFavorites,
      color: 'hsl(270 95% 65%)',
      showWhenLoggedIn: true,
    },
    {
      icon: user ? LogOut : UserIcon,
      label: user ? 'Sign Out' : 'Sign In',
      onClick: user ? onSignOut : onOpenAuth,
      color: user ? 'hsl(0 70% 60%)' : 'hsl(0 0% 70%)',
      showAlways: true,
    },
  ];

  const visibleItems = menuItems.filter(item => 
    item.showAlways || (item.showWhenLoggedIn && user)
  );

  const handleItemClick = (item: typeof menuItems[0]) => {
    playSound('click');
    item.onClick();
    setIsOpen(false);
  };

  // Only show FAB on mobile
  if (!isMobile) return null;

  return (
    <div className="fixed top-4 right-4 z-50" onClick={(e) => e.stopPropagation()}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-14 flex flex-col gap-2"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {visibleItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl border border-border/30 min-w-[150px]"
                style={{
                  background: 'hsl(250 25% 12% / 0.95)',
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => {
          playSound('click');
          setIsOpen(!isOpen);
        }}
        className="w-12 h-12 rounded-full backdrop-blur-xl border border-border/30 flex items-center justify-center relative overflow-hidden"
        style={{
          background: isOpen 
            ? 'linear-gradient(135deg, hsl(270 95% 55%), hsl(35 100% 60%))' 
            : 'hsl(250 25% 12% / 0.9)',
          boxShadow: isOpen 
            ? '0 8px 32px hsl(270 95% 55% / 0.4)' 
            : '0 4px 20px hsl(0 0% 0% / 0.3)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        {/* Pulse ring when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu className="w-6 h-6 text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default MobileNavFAB;
