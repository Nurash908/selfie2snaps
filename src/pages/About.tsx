import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Users, Zap, Shield, Heart, Globe, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingOrbs from "@/components/FloatingOrbs";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const About = () => {
  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(250 30% 8%) 0%, hsl(250 25% 5%) 100%)",
      }}
    >
      <SEOHead
        title="About Selfie2Snap"
        description="Learn about Selfie2Snap, the AI-powered photo transformation platform built by Nurash Weerasinghe from Sri Lanka. Our mission, values, and story."
        path="/about"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Selfie2Snap",
          url: "https://selfie2snaps.lovable.app",
          description: "AI-powered photo transformation platform",
          founder: {
            "@type": "Person",
            name: "Nurash Weerasinghe",
            url: "https://www.linkedin.com/in/nurash-weerasinghe/",
          },
          address: { "@type": "PostalAddress", addressCountry: "LK" },
        }}
      />
      <FloatingOrbs intensity="low" />

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

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
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
              using the power of artificial intelligence.
            </p>
          </motion.div>

          {/* Creator Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-16"
          >
            <div className="p-6 md:p-8 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Built by Nurash Weerasinghe</h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Sri Lanka 🇱🇰</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Selfie2Snap was created with a simple belief: everyone deserves access to 
                    professional photo editing tools without the steep learning curve or expensive 
                    software. As a passionate developer and photography enthusiast, I combined 
                    cutting-edge AI technology with intuitive design to build a platform that 
                    makes photo transformation accessible to everyone around the world.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/nurash-weerasinghe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <Linkedin className="w-4 h-4" />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </motion.section>

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
                Selfie2Snap was born from a simple observation: while AI was revolutionizing 
                many industries, creating beautiful photos still required either expensive 
                equipment, professional photographers, or hours of manual editing. There had to 
                be a better way.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Starting from Sri Lanka, we set out to build a platform that makes professional 
                photo transformation accessible to everyone, regardless of their location, 
                budget, or technical skills. Whether you're a social media content creator, a 
                small business owner needing professional headshots, or someone who simply wants 
                their photos to look amazing, Selfie2Snap is here for you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, users from around the world trust Selfie2Snap to transform their selfies 
                into stunning artworks. From anime-style portraits to professional business 
                headshots, our AI-powered platform delivers consistent, high-quality results in 
                seconds.
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
                  description: "Our advanced AI models analyze your photos and apply professional-grade enhancements, style transfers, and artistic effects automatically.",
                },
                {
                  title: "Multiple Creative Styles",
                  description: "Choose from Natural, Cinematic, Anime, Sketch, Vintage, Neon, Watercolor, and Pop Art to match your creative vision.",
                },
                {
                  title: "Custom Backgrounds",
                  description: "Transport yourself anywhere with AI-generated backgrounds – from tropical beaches to bustling city streets.",
                },
                {
                  title: "Instant Processing",
                  description: "No waiting around. Our optimized AI pipeline delivers stunning results in seconds, not minutes or hours.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-6 rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
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
              <Shield className="w-6 h-6 text-primary" />
              Our Values
            </h2>
            <div className="space-y-4">
              {[
                { title: "User Privacy First", description: "Your photos are yours. We process images securely and never store or share your personal photos without consent." },
                { title: "Continuous Innovation", description: "We're constantly improving our AI models and adding new features based on user feedback and the latest research." },
                { title: "Accessibility", description: "Great photo editing shouldn't require expensive software or years of training. We make professional results accessible to everyone." },
                { title: "Quality Without Compromise", description: "We never sacrifice image quality for speed. Every photo processed through Selfie2Snap meets our high standards." },
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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Transform Your Selfies?</h2>
            <p className="text-muted-foreground mb-6">
              Join users worldwide creating stunning photos with Selfie2Snap.
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

      <Footer />
    </div>
  );
};

export default About;
