import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, FileText } from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Terms = () => {
  const lastUpdated = "January 22, 2026";

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(250 30% 8%) 0%, hsl(250 25% 5%) 100%)",
      }}
    >
      <SEOHead
        title="Terms of Service"
        description="Read Selfie2Snap's terms of service including user rights, image ownership, prohibited content, and advertising disclosures."
        path="/terms"
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
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Terms of Service</h1>
            </div>
            <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Selfie2Snap ("the Service"), you accept and agree 
                  to be bound by these Terms of Service. If you do not agree to these terms, 
                  please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Selfie2Snap is an AI-powered photo transformation service that allows users 
                  to upload selfies and other photos, apply various AI-generated styles and 
                  effects, and download or share the resulting images.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Provide accurate and complete information during registration</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. Image Ownership and User Content</h2>
                
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.1 Your Ownership Rights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>You retain full ownership of all images you upload to Selfie2Snap.</strong> We 
                  do not claim any ownership rights over your original photos. By uploading 
                  content, you grant us a limited, temporary license to process and transform 
                  the content solely to provide the Service to you.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.2 Generated Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI-generated images created through our Service are provided for your personal 
                  use. You may use generated images for personal and non-commercial purposes. 
                  Commercial use may be subject to additional terms.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.3 Prohibited Content</h3>
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
                  <li>Depicts minors in any inappropriate context</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  We reserve the right to remove content and terminate accounts that violate 
                  these terms without prior notice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Advertising Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Selfie2Snap displays advertisements provided by third-party advertising 
                  networks, including Google AdSense. These advertisements may use cookies 
                  and similar technologies to serve ads based on your prior visits to this 
                  and other websites. The display of advertisements does not constitute an 
                  endorsement by Selfie2Snap of the advertised products or services. For more 
                  information about how advertising cookies are used, please see our{" "}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service, including its design, features, and content (excluding user 
                  content), is protected by copyright, trademark, and other intellectual 
                  property laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Service Availability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to maintain high availability but do not guarantee uninterrupted 
                  access. The Service may be temporarily unavailable due to maintenance, updates, 
                  or circumstances beyond our control.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground leading-relaxed">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF 
                  ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE 
                  WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL 
                  COMPONENTS. YOUR USE OF THE SERVICE IS AT YOUR OWN RISK.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY 
                  INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING 
                  OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">10. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify and hold harmless Selfie2Snap and its affiliates 
                  from any claims, damages, losses, or expenses arising from your use of the 
                  Service or your violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">11. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to suspend or terminate your access at any time. Upon 
                  termination, your right to use the Service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">12. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws 
                  of Sri Lanka. Any disputes shall first be attempted to be resolved through 
                  good-faith negotiation.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">13. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms, please contact us:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email:{" "}
                  <a href="mailto:legal@selfie2snap.com" className="text-primary hover:underline">
                    legal@selfie2snap.com
                  </a>
                </p>
                <p className="text-muted-foreground">
                  Or visit our{" "}
                  <Link to="/contact" className="text-primary hover:underline">Contact Page</Link>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
