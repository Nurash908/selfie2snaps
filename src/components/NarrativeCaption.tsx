import { motion } from "framer-motion";
import { Quote, RefreshCw } from "lucide-react";

const captions = [
  "A shared laugh between friends captured in time.",
  "Two souls, one beautiful moment of connection.",
  "Where joy meets serenity, magic happens.",
  "A memory worth a thousand words.",
  "Together, creating stories that last forever.",
  "In this frame, love speaks louder than words.",
  "A glimpse of pure, unfiltered happiness.",
  "When hearts align, the camera captures gold.",
];

interface NarrativeCaptionProps {
  onRefresh?: () => void;
}

const NarrativeCaption = ({ onRefresh }: NarrativeCaptionProps) => {
  const randomCaption = captions[Math.floor(Math.random() * captions.length)];

  return (
    <motion.div
      className="relative max-w-md mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="relative px-8 py-6 rounded-2xl glass">
        {/* Quote marks */}
        <Quote 
          className="absolute top-3 left-3 w-6 h-6 text-primary/30" 
          strokeWidth={1}
        />
        <Quote 
          className="absolute bottom-3 right-3 w-6 h-6 text-primary/30 rotate-180" 
          strokeWidth={1}
        />

        {/* Caption text */}
        <motion.p
          key={randomCaption}
          className="font-serif text-lg italic text-foreground/90 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {randomCaption}
        </motion.p>

        {/* AI attribution */}
        <p className="mt-3 text-xs text-muted-foreground tracking-wider">
          ✨ AI-GENERATED NARRATIVE
        </p>
      </div>

      {/* Refresh button */}
      {onRefresh && (
        <motion.button
          onClick={onRefresh}
          className="mt-3 p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <RefreshCw className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default NarrativeCaption;