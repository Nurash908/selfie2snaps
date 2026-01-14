import { motion } from "framer-motion";
import { ArrowRight, Image as ImageIcon } from "lucide-react";

interface SideBySideComparisonProps {
  beforeImages: string[];
  afterImage: string;
}

const SideBySideComparison = ({
  beforeImages,
  afterImage,
}: SideBySideComparisonProps) => {
  return (
    <motion.div
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3
        className="text-center text-sm font-mono text-muted-foreground uppercase tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        📸 Side by Side Comparison
      </motion.h3>

      <div className="flex items-center justify-center gap-3 md:gap-6">
        {/* Before Images */}
        <div className="flex-1 space-y-2">
          <motion.p
            className="text-xs font-mono text-muted-foreground text-center uppercase tracking-wider"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Original Selfies
          </motion.p>
          <div className="grid grid-cols-2 gap-2">
            {beforeImages.map((image, index) => (
              <motion.div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden border border-border/30"
                style={{
                  background: "hsl(250 25% 10%)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {image ? (
                  <img
                    src={image}
                    alt={`Original selfie ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
                <motion.div
                  className="absolute bottom-1 left-1 px-2 py-0.5 rounded text-[10px] font-mono"
                  style={{
                    background: "hsl(250 25% 15% / 0.9)",
                    border: "1px solid hsl(0 0% 100% / 0.1)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  #{index + 1}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <motion.div
          className="flex-shrink-0 flex flex-col items-center gap-1"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(35 100% 55%))",
              boxShadow: "0 4px 20px hsl(270 95% 55% / 0.4)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 4px 20px hsl(270 95% 55% / 0.4)",
                "0 4px 30px hsl(270 95% 55% / 0.6)",
                "0 4px 20px hsl(270 95% 55% / 0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-[10px] font-mono text-muted-foreground">AI</span>
        </motion.div>

        {/* After Image */}
        <div className="flex-1 space-y-2">
          <motion.p
            className="text-xs font-mono text-muted-foreground text-center uppercase tracking-wider"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            AI Snap ✨
          </motion.p>
          <motion.div
            className="relative aspect-square rounded-xl overflow-hidden"
            style={{
              background: "hsl(250 25% 10%)",
              boxShadow: "0 8px 32px hsl(270 95% 55% / 0.2)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 12px 40px hsl(270 95% 55% / 0.3)",
            }}
          >
            <img
              src={afterImage}
              alt="AI generated snap"
              className="w-full h-full object-cover"
            />
            {/* Glow overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, hsl(270 95% 55% / 0.1), transparent, hsl(35 100% 55% / 0.1))",
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {/* Label */}
            <motion.div
              className="absolute bottom-2 right-2 px-2 py-1 rounded-lg text-xs font-mono"
              style={{
                background: "linear-gradient(135deg, hsl(270 95% 55% / 0.9), hsl(300 80% 50% / 0.9))",
                boxShadow: "0 4px 12px hsl(270 95% 55% / 0.3)",
              }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              ✨ Result
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SideBySideComparison;
