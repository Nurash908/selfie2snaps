import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronLeft, ChevronRight, User, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PoseTip {
  id: string;
  title: string;
  description: string;
  icon: "single" | "duo";
  tips: string[];
}

const poseTips: PoseTip[] = [
  {
    id: "face-forward",
    title: "Face Forward",
    description: "Look directly at the camera with your face centered",
    icon: "single",
    tips: ["Keep eyes at camera level", "Chin slightly down", "Neutral or smiling expression"]
  },
  {
    id: "good-lighting",
    title: "Good Lighting",
    description: "Natural light from the front works best",
    icon: "single",
    tips: ["Face a window or light source", "Avoid harsh shadows", "No backlighting"]
  },
  {
    id: "similar-angle",
    title: "Match Angles",
    description: "Both selfies should have similar camera angles",
    icon: "duo",
    tips: ["Same distance from camera", "Similar head tilt", "Matching eye levels"]
  },
  {
    id: "clean-background",
    title: "Simple Background",
    description: "Plain backgrounds blend better together",
    icon: "single",
    tips: ["Solid colors work best", "Avoid busy patterns", "Less clutter = better merge"]
  },
  {
    id: "shoulder-visible",
    title: "Show Shoulders",
    description: "Include shoulders for natural positioning",
    icon: "duo",
    tips: ["Frame from chest up", "Leave space on sides", "Natural arm positions"]
  }
];

export const PoseSuggestion = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % poseTips.length);
  const prevTip = () => setCurrentTip((prev) => (prev - 1 + poseTips.length) % poseTips.length);

  const tip = poseTips[currentTip];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Pose Tips for Better Results</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-[-90deg]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevTip}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex gap-1">
                  {poseTips.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTip(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentTip ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextTip}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      {tip.icon === "single" ? (
                        <User className="w-6 h-6 text-primary" />
                      ) : (
                        <Users className="w-6 h-6 text-primary" />
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-semibold text-foreground mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {tip.description}
                  </p>

                  <div className="flex flex-wrap justify-center gap-2">
                    {tip.tips.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PoseSuggestion;
