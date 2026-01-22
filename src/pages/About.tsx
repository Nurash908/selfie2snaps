import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Users, Zap, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingOrbs from "@/components/FloatingOrbs";

const About = () => {
  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(250 30% 8%) 0%, hsl(250 25% 5%) 100%)",
      }}
    >
      <FloatingOrbs intensity="low" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-border/30 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground font-medium">Back to App</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Selfie2Snap</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About <span className="text-primary">Selfie2Snap</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're on a mission to help everyone create stunning, professional-quality photos 
              using the power of artificial intelligence. Transform your everyday selfies into 
              extraordinary works of art with just a few clicks.
            </p>
          </motion.div>

          {/* Our Story */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Our Story
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Selfie2Snap was born from a simple idea: everyone deserves access to professional 
                photo editing tools without the steep learning curve or expensive software. We 
                noticed that while AI was revolutionizing many industries, creating beautiful 
                photos still required either expensive equipment, professional photographers, 
                or hours of manual editing.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our team of AI researchers, designers, and photography enthusiasts came together 
                to build a platform that makes photo transformation accessible to everyone. Whether 
                you're a social media content creator, a small business owner needing professional 
                headshots, or someone who just wants their photos to look amazing – Selfie2Snap 
                is here for you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, thousands of users trust Selfie2Snap to transform their selfies into 
                stunning artworks. From anime-style portraits to professional business headshots, 
                our AI-powered platform delivers consistent, high-quality results in seconds.
              </p>
            </div>
          </motion.section>

          {/* What We Offer */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "AI-Powered Transformations",
                  description:
                    "Our advanced AI models analyze your photos and apply professional-grade enhancements, style transfers, and artistic effects automatically.",
                },
                {
                  title: "Multiple Creative Styles",
                  description:
                    "Choose from a variety of styles including Natural, Cinematic, Anime, Sketch, Vintage, Neon, Watercolor, and Pop Art to match your creative vision.",
                },
                {
                  title: "Custom Backgrounds",
                  description:
                    "Transport yourself anywhere with our AI-generated backgrounds – from tropical beaches to bustling city streets, the possibilities are endless.",
                },
                {
                  title: "Instant Processing",
                  description:
                    "No waiting around. Our optimized AI pipeline delivers stunning results in seconds, not minutes or hours.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-6 rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Our Values */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Our Values
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "User Privacy First",
                  description:
                    "Your photos are yours. We process images securely and never store or share your personal photos without consent.",
                },
                {
                  title: "Continuous Innovation",
                  description:
                    "We're constantly improving our AI models and adding new features based on user feedback and the latest research.",
                },
                {
                  title: "Accessibility",
                  description:
                    "Great photo editing shouldn't require expensive software or years of training. We make professional results accessible to everyone.",
                },
                {
                  title: "Quality Without Compromise",
                  description:
                    "We never sacrifice image quality for speed. Every photo processed through Selfie2Snap meets our high standards.",
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-foreground font-medium mb-1">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Security */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Security & Privacy
            </h2>
            <div className="p-6 rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm">
              <p className="text-muted-foreground leading-relaxed mb-4">
                We take your privacy seriously. All image processing is done on secure servers 
                with enterprise-grade encryption. Your photos are processed in real-time and 
                are not stored on our servers after processing is complete unless you explicitly 
                save them to your account.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We comply with GDPR, CCPA, and other major privacy regulations. For more 
                details, please read our{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Transform Your Selfies?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of users creating stunning photos with Selfie2Snap.
            </p>
            <Link to="/">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/how-it-works" className="hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
        <p className="text-center text-muted-foreground text-xs mt-4">
          © {new Date().getFullYear()} Selfie2Snap. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default About;
