import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Shield } from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Privacy = () => {
  const lastUpdated = "January 22, 2026";

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(250 30% 8%) 0%, hsl(250 25% 5%) 100%)",
      }}
    >
      <SEOHead
        title="Privacy Policy"
        description="Learn how Selfie2Snap collects, uses, and protects your personal information including uploaded photos, cookies, and analytics data."
        path="/privacy"
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
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
                
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.1 Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">When you create an account, we may collect:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Email address</li>
                  <li>Display name (optional)</li>
                  <li>Profile picture (optional)</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.2 Photos and Images</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you use our service, you upload photos for AI processing. These images 
                  are processed in real-time and are <strong>NOT permanently stored</strong> on our servers. 
                  Uploaded images are automatically deleted after processing is complete unless 
                  you explicitly save them to your account favorites or history. We do not use 
                  your uploaded images for training AI models or any purpose other than providing 
                  you with the requested transformation.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.3 Usage Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We automatically collect certain information when you visit our website, 
                  including your IP address, browser type, operating system, referring URLs, 
                  and information about how you interact with our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use cookies and similar tracking technologies to enhance your experience. 
                  The types of cookies we use include:
                </p>
                
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.1 Essential Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable 
                  core functionality such as user authentication, session management, and security 
                  features. You cannot opt out of essential cookies.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.2 Analytics Cookies (Google Analytics)</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use Google Analytics to understand how visitors interact with our website. 
                  Google Analytics uses cookies to collect information about page views, session 
                  duration, traffic sources, and user behavior. This data helps us improve our 
                  services. Google Analytics may transfer data to servers in the United States. 
                  You can opt out of Google Analytics by using the{" "}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Google Analytics Opt-out Browser Add-on
                  </a>.
                </p>

                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.3 Advertising Cookies (Google AdSense)</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Third-party vendors, including Google, use cookies to serve ads based on your 
                  prior visits to this website and other websites. Google's use of advertising 
                  cookies enables it and its partners to serve ads based on your visit to 
                  Selfie2Snap and/or other sites on the Internet. You may opt out of personalized 
                  advertising by visiting{" "}
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Google Ads Settings
                  </a>.
                </p>

                <p className="text-muted-foreground leading-relaxed mt-3">
                  You can control cookie preferences through your browser settings or through 
                  our cookie consent banner when you first visit our website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Provide and maintain our AI photo transformation services</li>
                  <li>Process and store your generated images (when saved by you)</li>
                  <li>Communicate with you about your account or our services</li>
                  <li>Improve and optimize our website and services</li>
                  <li>Serve relevant advertisements through Google AdSense</li>
                  <li>Analyze website usage patterns through Google Analytics</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Uploaded photos that are not saved are <strong>automatically deleted immediately 
                  after processing</strong>. Saved favorites and generation history are retained until 
                  you delete them or close your account. Account information is retained as long 
                  as your account is active. Analytics data is retained according to Google 
                  Analytics' standard retention policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Sharing and Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We do NOT sell, trade, or rent your personal information to third parties. 
                  We may share information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>With service providers who assist in operating our website (subject to confidentiality agreements)</li>
                  <li>With Google for analytics and advertising purposes (as described in the cookies section)</li>
                  <li>If required by law, subpoena, or other legal process</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures including encryption, 
                  secure servers, and access controls to protect your personal information. 
                  All data transmission is encrypted using SSL/TLS protocols. However, no method 
                  of transmission over the Internet is 100% secure, and we cannot guarantee 
                  absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Your Rights (GDPR)</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  If you are located in the European Economic Area (EEA), you have certain 
                  data protection rights under the General Data Protection Regulation (GDPR):
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li><strong>Right to Access</strong> – You can request a copy of your personal data</li>
                  <li><strong>Right to Rectification</strong> – You can request correction of inaccurate data</li>
                  <li><strong>Right to Erasure</strong> – You can request deletion of your data</li>
                  <li><strong>Right to Restrict Processing</strong> – You can request we limit how we use your data</li>
                  <li><strong>Right to Data Portability</strong> – You can request your data in a machine-readable format</li>
                  <li><strong>Right to Object</strong> – You can object to processing based on legitimate interests</li>
                  <li><strong>Right to Withdraw Consent</strong> – You can withdraw consent at any time</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  To exercise these rights, please contact us at the email provided below.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. CCPA Rights (California Residents)</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  If you are a California resident, you have additional rights under the 
                  California Consumer Privacy Act (CCPA):
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>The right to know what personal information is collected about you</li>
                  <li>The right to know whether your personal information is sold or disclosed</li>
                  <li>The right to say no to the sale of personal information</li>
                  <li>The right to equal service and price, even if you exercise your privacy rights</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  We do not sell your personal information. To exercise your CCPA rights, 
                  contact us at the email below.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">10. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not intended for children under 13 years of age. We do not 
                  knowingly collect personal information from children under 13. If you believe 
                  we have collected information from a child under 13, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">11. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of 
                  any changes by posting the new Privacy Policy on this page and updating the 
                  "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">12. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, 
                  please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email:{" "}
                  <a href="mailto:privacy@selfie2snap.com" className="text-primary hover:underline">
                    privacy@selfie2snap.com
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

export default Privacy;
