import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Calendar, Clock } from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: "Nurash Weerasinghe" },
    publisher: {
      "@type": "Organization",
      name: "Selfie2Snap",
      url: "https://selfie2snaps.lovable.app",
    },
  };

  // Convert markdown-like content to HTML sections
  const renderContent = (content: string) => {
    return content.split("\n\n").map((paragraph, i) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-4">
            {paragraph.replace("## ", "")}
          </h2>
        );
      }
      return (
        <p key={i} className="text-muted-foreground leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(250 30% 8%) 0%, hsl(250 25% 5%) 100%)",
      }}
    >
      <SEOHead
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.date}
        jsonLd={articleJsonLd}
      />
      <FloatingOrbs intensity="low" />

      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-border/30 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/blog" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground font-medium">Back to Blog</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Selfie2Snap</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              {post.title}
            </h1>

            <div className="prose prose-invert max-w-none">
              {renderContent(post.content)}
            </div>

            {/* CTA */}
            <div className="mt-12 p-6 rounded-2xl border border-primary/30 bg-primary/5 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Ready to Transform Your Selfies?
              </h3>
              <p className="text-muted-foreground mb-4">
                Try Selfie2Snap free and see the AI difference for yourself.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Try Selfie2Snap Free
              </Link>
            </div>
          </motion.article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
