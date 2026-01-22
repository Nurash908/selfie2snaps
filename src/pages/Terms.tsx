import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, FileText } from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";

const Terms = () => {
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
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Terms of Service
              </h1>
            </div>
            <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Selfie2Snap ("the Service"), you accept and agree 
                  to be bound by these Terms of Service. If you do not agree to these terms, 
                  please do not use our services. We reserve the right to modify these terms 
                  at any time, and your continued use of the Service constitutes acceptance 
                  of any modifications.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  2. Description of Service
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Selfie2Snap is an AI-powered photo transformation service that allows users 
                  to upload selfies and other photos, apply various AI-generated styles and 
                  effects, and download or share the resulting images. The Service includes 
                  features such as style selection, background generation, image history, 
                  and favorites.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  3. User Accounts
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  To access certain features of the Service, you must create an account. 
                  You agree to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Provide accurate and complete information during registration</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access to your account</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  4. User Content and Conduct
                </h2>
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                  4.1 Your Content
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  You retain ownership of any photos you upload to the Service. By uploading 
                  content, you grant us a limited license to process, transform, and display 
                  the content as necessary to provide the Service.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                  4.2 Prohibited Content
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You agree NOT to upload content that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Is illegal, harmful, threatening, abusive, or harassing</li>
                  <li>Contains nudity, sexually explicit material, or violence</li>
                  <li>Infringes on any third party's intellectual property rights</li>
                  <li>Contains malware, viruses, or harmful code</li>
                  <li>Violates any person's privacy rights</li>
                  <li>Is used to impersonate another person</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                  4.3 Generated Content
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI-generated images created through our Service are provided for personal 
                  use. You may use generated images for personal, non-commercial purposes. 
                  Commercial use may be subject to additional terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  5. Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service, including its design, features, and content (excluding user 
                  content), is protected by copyright, trademark, and other intellectual 
                  property laws. You may not copy, modify, distribute, or create derivative 
                  works based on the Service without our express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  6. Service Availability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to maintain high availability of the Service but do not guarantee 
                  uninterrupted access. The Service may be temporarily unavailable due to 
                  maintenance, updates, or circumstances beyond our control. We reserve the 
                  right to modify, suspend, or discontinue any aspect of the Service at any time.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  7. Disclaimer of Warranties
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF 
                  ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE 
                  WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL 
                  COMPONENTS. YOUR USE OF THE SERVICE IS AT YOUR OWN RISK.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  8. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY 
                  INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING 
                  OUT OF OR RELATED TO YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL 
                  NOT EXCEED THE AMOUNT YOU PAID US, IF ANY, IN THE PAST TWELVE MONTHS.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  9. Indemnification
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify and hold harmless Selfie2Snap and its affiliates, 
                  officers, employees, and agents from any claims, damages, losses, or 
                  expenses arising from your use of the Service, your violation of these 
                  Terms, or your violation of any rights of another party.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">10. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to suspend or terminate your access to the Service 
                  at any time, with or without cause, and with or without notice. Upon 
                  termination, your right to use the Service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  11. Governing Law
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the 
                  laws of the jurisdiction in which Selfie2Snap operates, without regard 
                  to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  12. Dispute Resolution
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Any disputes arising from these Terms or your use of the Service shall 
                  first be attempted to be resolved through good-faith negotiation. If 
                  negotiation fails, disputes shall be resolved through binding arbitration 
                  in accordance with applicable rules.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">13. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email:{" "}
                  <a
                    href="mailto:legal@selfie2snap.com"
                    className="text-primary hover:underline"
                  >
                    legal@selfie2snap.com
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

export default Terms;
