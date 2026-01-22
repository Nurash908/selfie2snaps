import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-10 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Selfie2Snap</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Transform your selfies into stunning AI-generated artwork. Our advanced AI 
              technology creates professional-quality photos from your everyday selfies 
              in seconds.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Selfie2Snap. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Made with ❤️ for creative selfie enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
