import { motion } from "framer-motion";
import { Zap, MoreHorizontal } from "lucide-react";

interface SystemStatusPanelProps {
  progress: number;
  status: string;
}

const SystemStatusPanel = ({ progress, status }: SystemStatusPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(250 30% 12%) 0%, hsl(250 25% 8%) 100%)",
        border: "1px solid hsl(250 30% 20%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
            {status || "System Ready"}
          </span>
        </div>
        <button className="p-1 rounded-lg hover:bg-muted/50 transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Source Data Progress */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-primary/50 flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-primary/50" />
            </div>
            <span className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              Source Data
            </span>
          </div>
          <motion.div
            className="px-3 py-1 rounded-full text-xs font-mono"
            style={{
              background: progress > 0 ? "hsl(270 95% 65% / 0.2)" : "hsl(0 0% 20%)",
              color: progress > 0 ? "hsl(270 95% 75%)" : "hsl(0 0% 50%)",
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: progress > 0 && progress < 100 ? Infinity : 0 }}
          >
            {progress}%
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemStatusPanel;
