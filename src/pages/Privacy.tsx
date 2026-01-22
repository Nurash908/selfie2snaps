import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Shield } from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";

const Privacy = () => {
  const lastUpdated = "January 22, 2026";

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
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Privacy Policy</h1>
            </div>
            <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to Selfie2Snap ("we," "our," or "us"). We are committed to protecting 
                  your privacy and ensuring you have a positive experience on our website and 
                  in using our AI photo transformation services. This Privacy Policy explains 
                  how we collect, use, disclose, and safeguard your information when you visit 
                  our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  2. Information We Collect
                </h2>
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                  2.1 Personal Information
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  When you create an account, we may collect:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Email address</li>
                  <li>Display name (optional)</li>
                  <li>Profile picture (optional)</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                  2.2 Photos and Images
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you use our service, you upload photos for AI processing. These images 
                  are processed in real-time and are NOT permanently stored on our servers 
                  unless you explicitly save them to your account favorites or history.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                  2.3 Usage Data
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We automatically collect certain information when you visit our website, 
                  including your IP address, browser type, operating system, referring URLs, 
                  and information about how you interact with our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  3. How We Use Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Provide and maintain our AI photo transformation services</li>
                  <li>Process and store your generated images (when saved)</li>
                  <li>Communicate with you about your account or our services</li>
                  <li>Improve and optimize our website and services</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  4. Data Retention
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Uploaded photos that are not saved are automatically deleted after processing. 
                  Saved favorites and generation history are retained until you delete them or 
                  close your account. Account information is retained as long as your account 
                  is active.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  5. Data Sharing and Disclosure
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We do NOT sell, trade, or rent your personal information to third parties. 
                  We may share information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>
                    With service providers who assist in operating our website and services 
                    (subject to confidentiality agreements)
                  </li>
                  <li>If required by law, subpoena, or other legal process</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures including encryption, 
                  secure servers, and access controls to protect your personal information. 
                  However, no method of transmission over the Internet is 100% secure, and 
                  we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Depending on your location, you may have certain rights regarding your 
                  personal information, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>The right to access your personal data</li>
                  <li>The right to correct inaccurate data</li>
                  <li>The right to delete your data</li>
                  <li>The right to restrict or object to processing</li>
                  <li>The right to data portability</li>
                  <li>The right to withdraw consent</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  To exercise these rights, please contact us at the email provided below.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  8. Cookies and Tracking
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, 
                  analyze usage patterns, and deliver personalized content. You can control 
                  cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  9. Children's Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not intended for children under 13 years of age. We do not 
                  knowingly collect personal information from children under 13. If you believe 
                  we have collected information from a child under 13, please contact us 
                  immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  10. Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of 
                  any changes by posting the new Privacy Policy on this page and updating the 
                  "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, 
                  please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email:{" "}
                  <a
                    href="mailto:privacy@selfie2snap.com"
                    className="text-primary hover:underline"
                  >
                    privacy@selfie2snap.com
                  </a>
                </p>
                <p className="text-muted-foreground">
                  Or visit our{" "}
                  <Link to="/contact" className="text-primary hover:underline">
                    Contact Page
                  </Link>
                </p>
              </section>
            </div>
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

export default Privacy;
