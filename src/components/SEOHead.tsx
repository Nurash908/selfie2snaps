import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = "https://selfie2snaps.lovable.app";

const SEOHead = ({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  jsonLd,
}: SEOHeadProps) => {
  const fullUrl = `${BASE_URL}${path}`;
  const fullTitle = path === "/" ? title : `${title} | Selfie2Snap`;

  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Selfie2Snap",
    url: BASE_URL,
    description: "Transform your selfies into stunning AI-generated artwork in seconds.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: {
      "@type": "Person",
      name: "Nurash Weerasinghe",
      url: "https://www.linkedin.com/in/nurash-weerasinghe/",
    },
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:site_name" content="Selfie2Snap" />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />

      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
