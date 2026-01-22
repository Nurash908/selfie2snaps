import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Palette,
  Wand2,
  Download,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FloatingOrbs from "@/components/FloatingOrbs";

const steps = [
  {
    icon: Upload,
    title: "1. Upload Your Selfie",
    description:
      "Simply drag and drop or click to upload one or two selfies. Our AI works with any photo – front-facing selfies work best for optimal results. The higher the resolution, the better your final image will look.",
    tips: [
      "Use well-lit photos for best results",
      "Front-facing photos work best",
      "Avoid blurry or pixelated images",
      "Natural expressions look most realistic",
    ],
  },
  {
    icon: Palette,
    title: "2. Choose Your Style",
    description:
      "Browse through our collection of AI styles and select the one that matches your vision. From natural enhancements to artistic transformations like anime or sketch, there's a style for every occasion.",
    tips: [
      "Natural style is great for professional headshots",
      "Anime style creates manga-inspired portraits",
      "Cinematic adds dramatic lighting effects",
      "Experiment with different styles!",
    ],
  },
  {
    icon: Wand2,
    title: "3. Generate Your Snap",
    description:
      "Click the Generate button and watch the magic happen! Our advanced AI processes your image in seconds, applying your chosen style while preserving your unique features and expressions.",
    tips: [
      "Generation typically takes 5-15 seconds",
      "You can generate multiple frames at once",
      "Each generation is unique",
      "Try different scenes for variety",
    ],
  },
  {
    icon: Download,
    title: "4. Download & Share",
    description:
      "Once your snap is ready, you can preview the before and after, download your transformed image in high resolution, or share it directly to your favorite social platforms.",
    tips: [
      "Save to favorites for quick access later",
      "Share directly to social media",
      "Download in full resolution",
      "Your history is saved automatically",
    ],
  },
];

const faqs = [
  {
    question: "Is Selfie2Snap free to use?",
    answer:
      "Yes! Selfie2Snap offers free transformations to get you started. You can create beautiful AI-enhanced photos without any upfront cost. Premium features and higher usage limits are available for power users.",
  },
  {
    question: "How does the AI transformation work?",
    answer:
      "Our AI uses advanced machine learning models trained on millions of images to understand facial features, lighting, and artistic styles. When you upload a photo, the AI analyzes it and applies the selected style while preserving your unique features and expressions.",
  },
  {
    question: "Is my photo data secure?",
    answer:
      "Absolutely. Your privacy is our top priority. Photos are processed on secure servers with encryption, and we don't store your original images after processing unless you save them to your account. We never share your photos with third parties.",
  },
  {
    question: "What photo formats are supported?",
    answer:
      "Selfie2Snap supports all common image formats including JPG, PNG, and WebP. For best results, we recommend using high-resolution photos (at least 512x512 pixels) with good lighting.",
  },
  {
    question: "Can I use Selfie2Snap on my phone?",
    answer:
      "Yes! Selfie2Snap is fully mobile-friendly. You can upload photos directly from your phone's camera or gallery, and the entire experience is optimized for touch screens.",
  },
  {
    question: "Why doesn't my transformation look right?",
    answer:
      "The quality of AI transformations depends on the input photo. For best results, use clear, well-lit photos where your face is clearly visible. Avoid photos with heavy filters, extreme angles, or multiple people.",
  },
  {
    question: "Can I transform photos with multiple people?",
    answer:
      "Yes! Selfie2Snap supports uploading two photos to create combined transformations. Upload portraits of two people, and our AI will merge them into a single stunning image.",
  },
  {
    question: "How do I save my favorite transformations?",
    answer:
      "After generating a snap, click the heart icon to add it to your favorites. You'll need to create a free account to access the favorites feature and view your generation history.",
  },
];

const HowItWorks = () => {
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
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How <span className="text-primary">Selfie2Snap</span> Works
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your selfies into stunning AI-generated artwork in just four simple 
              steps. No technical skills required – our AI handles everything for you.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="space-y-8 mb-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="p-6 md:p-8 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ background: "hsl(270 95% 65% / 0.15)" }}
                    >
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-foreground mb-3">{step.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border border-border/30 rounded-xl px-6 bg-card/30 backdrop-blur-sm"
                >
                  <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Create Your First Snap?
            </h2>
            <p className="text-muted-foreground mb-6">
              It's free, fast, and incredibly easy. Start transforming your selfies now!
            </p>
            <Link to="/">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Sparkles className="w-5 h-5 mr-2" />
                Try Selfie2Snap Free
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

export default HowItWorks;
