import { motion, AnimatePresence } from "framer-motion";
import { Share2, Twitter, Facebook, Instagram, Link, Check, Download } from "lucide-react";
import { useState } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { toast } from "sonner";

interface SocialShareButtonsProps {
  imageUrl: string;
  caption?: string;
  onDownload?: () => void;
}

const SocialShareButtons = ({ imageUrl, caption = "Check out my Selfie2Snap creation! 🍌✨", onDownload }: SocialShareButtonsProps) => {
  const { playSound } = useSoundEffects();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const platforms = [
    {
      id: "twitter",
      label: "Twitter",
      icon: Twitter,
      color: "hsl(203 89% 53%)",
      gradient: "linear-gradient(135deg, hsl(203 89% 53%), hsl(203 89% 43%))",
      action: () => {
        const text = encodeURIComponent(caption);
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
        toast.success("Opening Twitter...");
      },
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: Facebook,
      color: "hsl(220 46% 48%)",
      gradient: "linear-gradient(135deg, hsl(220 46% 48%), hsl(220 46% 38%))",
      action: () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
        toast.success("Opening Facebook...");
      },
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: Instagram,
      color: "hsl(340 75% 55%)",
      gradient: "linear-gradient(135deg, hsl(340 75% 55%), hsl(35 100% 55%), hsl(280 80% 55%))",
      action: async () => {
        // Instagram doesn't support direct web sharing, so we copy the image
        try {
          if (navigator.share && navigator.canShare) {
            const blob = await fetch(imageUrl).then(r => r.blob());
            const file = new File([blob], "selfie2snap.jpg", { type: "image/jpeg" });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: "Selfie2Snap",
                text: caption,
              });
              toast.success("Share dialog opened!");
              return;
            }
          }
          // Fallback: download and instruct user
          if (onDownload) onDownload();
          toast.info("Image downloaded! Open Instagram and share from your gallery.");
        } catch (error) {
          toast.error("Unable to share. Try downloading the image first.");
        }
      },
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: copiedLink ? Check : Link,
      color: "hsl(270 95% 65%)",
      gradient: "linear-gradient(135deg, hsl(270 95% 65%), hsl(270 95% 55%))",
      action: async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopiedLink(true);
          toast.success("Link copied!");
          setTimeout(() => setCopiedLink(false), 2000);
        } catch {
          toast.error("Failed to copy link");
        }
      },
    },
  ];

  const handleButtonClick = (platform: typeof platforms[0]) => {
    playSound("click");
    setActiveButton(platform.id);
    platform.action();
    setTimeout(() => setActiveButton(null), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Main share button */}
      <motion.button
        onClick={() => {
          playSound("click");
          setIsExpanded(!isExpanded);
        }}
        className="flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-sm tracking-wider relative overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 50%))",
          boxShadow: "0 8px 32px hsl(270 95% 55% / 0.3)",
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 12px 40px hsl(270 95% 55% / 0.5)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.3) 50%, transparent 100%)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />

        <motion.div
          animate={isExpanded ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Share2 className="w-4 h-4" />
        </motion.div>
        <span>Share</span>

        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{ border: "2px solid hsl(270 95% 75%)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Expanded share options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 flex gap-3 p-4 rounded-2xl"
            style={{
              background: "linear-gradient(180deg, hsl(250 30% 15%) 0%, hsl(250 25% 10%) 100%)",
              border: "1px solid hsl(250 30% 25%)",
              boxShadow: "0 20px 50px hsl(0 0% 0% / 0.5)",
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Decorative floating particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/30"
                style={{
                  left: `${20 + i * 15}%`,
                  top: "-10%",
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}

            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              const isActive = activeButton === platform.id;

              return (
                <motion.button
                  key={platform.id}
                  onClick={() => handleButtonClick(platform)}
                  className="relative flex flex-col items-center gap-2 p-3 rounded-xl group"
                  style={{
                    background: isActive ? platform.gradient : "hsl(250 25% 18%)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.1,
                    background: platform.gradient,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100"
                    style={{
                      boxShadow: `0 0 25px ${platform.color}50`,
                    }}
                    transition={{ duration: 0.2 }}
                  />

                  <motion.div
                    animate={isActive ? { 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ color: platform.color }}
                    />
                  </motion.div>
                  <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground">
                    {platform.label}
                  </span>

                  {/* Ripple effect on click */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ background: `${platform.color}30` }}
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* Download button */}
            {onDownload && (
              <motion.button
                onClick={() => {
                  playSound("download");
                  onDownload();
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl group"
                style={{ background: "hsl(250 25% 18%)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ 
                  scale: 1.1,
                  background: "linear-gradient(135deg, hsl(145 80% 45%), hsl(145 80% 35%))",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Download className="w-5 h-5 text-green-400" />
                <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground">
                  Download
                </span>
              </motion.button>
            )}

            {/* Arrow pointing down */}
            <div 
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
              style={{ background: "hsl(250 25% 10%)", border: "1px solid hsl(250 30% 25%)", borderTop: "none", borderLeft: "none" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SocialShareButtons;
