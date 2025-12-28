import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  X, 
  Bell, 
  Volume2, 
  Vibrate, 
  ExternalLink,
  Sparkles,
  VolumeX,
  BellOff
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsState {
  notificationsEnabled: boolean;
  notificationSound: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  hapticEnabled: boolean;
  hapticIntensity: "light" | "medium" | "heavy";
}

const defaultSettings: SettingsState = {
  notificationsEnabled: true,
  notificationSound: true,
  soundEnabled: true,
  soundVolume: 50,
  hapticEnabled: true,
  hapticIntensity: "medium",
};

const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [activeSection, setActiveSection] = useState<"notifications" | "audio" | "haptics">("notifications");

  useEffect(() => {
    const saved = localStorage.getItem("selfie2snap_settings");
    if (saved) {
      setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    }
  }, []);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("selfie2snap_settings", JSON.stringify(newSettings));
  };

  const sections = [
    { id: "notifications" as const, icon: Bell, label: "Notifications" },
    { id: "audio" as const, icon: Volume2, label: "Sound" },
    { id: "haptics" as const, icon: Vibrate, label: "Haptics" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsl(250 30% 12%) 0%, hsl(250 25% 8%) 100%)",
            }}
          >
            {/* Decorative gradient */}
            <div 
              className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, hsl(270 95% 65% / 0.1), transparent)",
              }}
            />

            {/* Header */}
            <div className="relative z-10 p-6 border-b border-border/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, hsl(270 95% 55%), hsl(300 80% 50%))",
                    }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Settings className="w-5 h-5 text-foreground" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-foreground">Settings</h2>
                    <p className="text-xs text-muted-foreground">Customize your experience</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Section Tabs */}
            <div className="p-4 flex gap-2 border-b border-border/10">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-1 py-2 px-3 rounded-lg font-mono text-xs flex items-center justify-center gap-2 transition-all ${
                    activeSection === section.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/80"
                  }`}
                  style={{
                    background: activeSection === section.id
                      ? "linear-gradient(135deg, hsl(270 95% 55% / 0.2), hsl(300 80% 50% / 0.1))"
                      : "transparent",
                    border: activeSection === section.id
                      ? "1px solid hsl(270 95% 65% / 0.3)"
                      : "1px solid transparent",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-280px)]">
              <AnimatePresence mode="wait">
                {activeSection === "notifications" && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Enable Notifications */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-border/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          {settings.notificationsEnabled ? (
                            <Bell className="w-4 h-4 text-primary" />
                          ) : (
                            <BellOff className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Generation Alerts</p>
                          <p className="text-xs text-muted-foreground">Get notified when snaps are ready</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notificationsEnabled}
                        onCheckedChange={(checked) => updateSetting("notificationsEnabled", checked)}
                      />
                    </div>

                    {/* Notification Sound */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-border/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Celebration Effects</p>
                          <p className="text-xs text-muted-foreground">Confetti & animations on success</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notificationSound}
                        onCheckedChange={(checked) => updateSetting("notificationSound", checked)}
                      />
                    </div>
                  </motion.div>
                )}

                {activeSection === "audio" && (
                  <motion.div
                    key="audio"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Sound Effects Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-border/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          {settings.soundEnabled ? (
                            <Volume2 className="w-4 h-4 text-primary" />
                          ) : (
                            <VolumeX className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Sound Effects</p>
                          <p className="text-xs text-muted-foreground">UI sounds & feedback</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                      />
                    </div>

                    {/* Volume Slider */}
                    <div className="p-4 rounded-xl bg-muted/10 border border-border/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">Volume Level</p>
                        <span className="text-xs font-mono text-primary">{settings.soundVolume}%</span>
                      </div>
                      <Slider
                        value={[settings.soundVolume]}
                        onValueChange={(value) => updateSetting("soundVolume", value[0])}
                        max={100}
                        step={5}
                        disabled={!settings.soundEnabled}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Quiet</span>
                        <span>Loud</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === "haptics" && (
                  <motion.div
                    key="haptics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Haptic Feedback Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-border/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Vibrate className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Haptic Feedback</p>
                          <p className="text-xs text-muted-foreground">Visual pulse effects on actions</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.hapticEnabled}
                        onCheckedChange={(checked) => updateSetting("hapticEnabled", checked)}
                      />
                    </div>

                    {/* Haptic Intensity */}
                    <div className="p-4 rounded-xl bg-muted/10 border border-border/20 space-y-4">
                      <p className="text-sm font-medium text-foreground">Haptic Intensity</p>
                      <div className="grid grid-cols-3 gap-2">
                        {(["light", "medium", "heavy"] as const).map((intensity) => (
                          <motion.button
                            key={intensity}
                            onClick={() => updateSetting("hapticIntensity", intensity)}
                            className={`py-2 px-3 rounded-lg font-mono text-xs capitalize transition-all ${
                              settings.hapticIntensity === intensity
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                            style={{
                              background: settings.hapticIntensity === intensity
                                ? "linear-gradient(135deg, hsl(270 95% 55% / 0.3), hsl(300 80% 50% / 0.2))"
                                : "hsl(250 25% 15% / 0.5)",
                              border: settings.hapticIntensity === intensity
                                ? "1px solid hsl(270 95% 65% / 0.5)"
                                : "1px solid hsl(250 25% 25% / 0.3)",
                            }}
                            disabled={!settings.hapticEnabled}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {intensity}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with External Link */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/20 bg-background/50 backdrop-blur-sm">
              <motion.a
                href="https://selfie2snap.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-mono text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, hsl(180 70% 40% / 0.2), hsl(200 80% 50% / 0.2))",
                  border: "1px solid hsl(180 70% 50% / 0.3)",
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 32px hsl(180 70% 50% / 0.2)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-foreground">Try SelfieSnaps App</span>
                <ExternalLink className="w-4 h-4 text-cyan-400" />
              </motion.a>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Our sister app • Transform portraits with AI magic
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
