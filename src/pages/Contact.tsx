import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Mail, MessageSquare, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import FloatingOrbs from "@/components/FloatingOrbs";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions, feedback, or need support? We'd love to hear from you. 
              Fill out the form below or reach out directly via email.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {isSubmitted ? (
                <div className="p-8 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your message has been sent successfully. We'll get back to you within 
                    24-48 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    variant="outline"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-6 md:p-8 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your question or feedback..."
                      rows={5}
                      required
                      className="bg-background/50 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Email */}
              <div className="p-6 rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{ background: "hsl(270 95% 65% / 0.15)" }}
                  >
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Email Us</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      For general inquiries and support
                    </p>
                    <a
                      href="mailto:hello@selfie2snap.com"
                      className="text-primary hover:underline"
                    >
                      hello@selfie2snap.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="p-6 rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{ background: "hsl(270 95% 65% / 0.15)" }}
                  >
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Technical Support
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Having issues with the app? We're here to help.
                    </p>
                    <a
                      href="mailto:support@selfie2snap.com"
                      className="text-primary hover:underline"
                    >
                      support@selfie2snap.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="p-6 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-foreground mb-3">Response Time</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We typically respond to all inquiries within <strong>24-48 hours</strong> 
                  during business days. For urgent issues, please include "URGENT" in your 
                  subject line.
                </p>
              </div>

              {/* FAQ Link */}
              <div className="p-6 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Before You Contact Us
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Many common questions are answered in our FAQ section. Check it out – 
                  you might find your answer faster!
                </p>
                <Link to="/how-it-works">
                  <Button variant="outline" className="w-full">
                    View FAQ & How It Works
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
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

export default Contact;
