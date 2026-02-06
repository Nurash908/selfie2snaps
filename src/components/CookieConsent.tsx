import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("selfie2snap_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("selfie2snap_cookie_consent", "all");
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem("selfie2snap_cookie_consent", "essential");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4"
        >
          <div className="max-w-4xl mx-auto p-6 rounded-2xl border border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0 mt-1">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-semibold mb-2">We Value Your Privacy</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  We use cookies to enhance your browsing experience, serve personalized ads via 
                  Google AdSense, and analyze our traffic with Google Analytics. Third-party vendors, 
                  including Google, use cookies to serve ads based on your prior visits to this and 
                  other websites. You can manage your preferences below. Learn more in our{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleAcceptAll} size="sm">
                    Accept All Cookies
                  </Button>
                  <Button onClick={handleRejectNonEssential} variant="outline" size="sm">
                    Essential Only
                  </Button>
                </div>
              </div>
              <button
                onClick={handleRejectNonEssential}
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
