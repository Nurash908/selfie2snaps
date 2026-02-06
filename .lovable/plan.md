

# AdSense Approval Mega Plan

This plan covers all the improvements needed to pass Google AdSense review: enhanced legal pages, cookie consent, blog section, SEO meta tags, structured data, and more.

---

## 1. Cookie Consent Banner (GDPR Compliance)

Create a new `CookieConsent` component that:
- Shows a bottom banner on first visit asking users to accept/reject cookies
- Stores preference in localStorage
- Mentions Google AdSense and Analytics cookies specifically
- Has "Accept All", "Reject Non-Essential", and "Cookie Policy" link
- Renders on every page (added to `App.tsx`)

---

## 2. Enhanced Privacy Policy

Update `src/pages/Privacy.tsx` to explicitly mention:
- Google AdSense: "Third-party vendors, including Google, use cookies to serve ads based on your prior visits"
- Google Analytics tracking
- Cookie categories (essential, analytics, advertising)
- Image upload data handling: "Uploaded images are processed securely and automatically deleted after processing unless saved"
- GDPR rights section with more detail
- CCPA compliance section

---

## 3. Enhanced Terms of Service

Update `src/pages/Terms.tsx` to add:
- Image ownership clause: "You retain full ownership of all uploaded images"
- Prohibited uploads (illegal/abusive content) - already exists, enhance it
- "Service provided as-is" disclaimer - already exists
- Advertising disclosure section

---

## 4. Enhanced About Page

Update `src/pages/About.tsx` to add:
- Creator info: "Built by Nurash Weerasinghe from Sri Lanka"
- LinkedIn link: your provided LinkedIn URL
- More personal story about why Selfie2Snap exists
- Country of operation disclosure (important for AdSense trust)

---

## 5. Enhanced Contact Page

Update `src/pages/Contact.tsx` to add:
- Your LinkedIn profile link as a social contact method
- Creator name display

---

## 6. Blog Section (5 Articles, 800-1200 words each)

Create a blog system with:

**New files:**
- `src/pages/Blog.tsx` - Blog listing page
- `src/pages/BlogPost.tsx` - Individual blog post page
- `src/data/blogPosts.ts` - Blog content data (all 5 articles stored as structured data)

**5 Articles:**
1. "How to Take Better Selfies: A Complete Guide from Beginner to Pro"
2. "Best Lighting Tips for Stunning Selfies at Home"
3. "Selfie Poses That Actually Work for Every Occasion"
4. "How AI Enhances Your Photos: The Technology Behind Selfie2Snap"
5. "Best Photo Sizes for Instagram, LinkedIn & Social Media in 2026"

Each article will be 800-1200 words of original, useful content.

**Routes:** Add `/blog` and `/blog/:slug` routes to `App.tsx`.

**Navigation:** Add "Blog" link to Footer component and all page footers.

---

## 7. Open Graph Meta Tags & JSON-LD Structured Data

Create a reusable `SEOHead` component using `react-helmet` (or manual document.title + meta tag updates via useEffect) that sets per-page:
- `og:title`, `og:description`, `og:url`, `og:image`
- `twitter:title`, `twitter:description`
- Canonical URL
- JSON-LD structured data (WebApplication schema for homepage, Article schema for blog posts, Organization schema site-wide)

Add `SEOHead` to every page: Index, About, HowItWorks, Privacy, Terms, Contact, Blog, BlogPost.

---

## 8. Sitemap & Robots.txt Enhancement

Update `public/robots.txt` to include sitemap reference:
```
Sitemap: https://selfie2snaps.lovable.app/sitemap.xml
```

Create `public/sitemap.xml` with all page URLs including blog posts.

---

## 9. Image Upload Privacy Notice

Add a small notice near the upload area on the homepage:
"Uploaded images are processed securely and not stored permanently. Images are automatically deleted after processing."

---

## Summary of Files to Create/Modify

**New files (6):**
- `src/components/CookieConsent.tsx`
- `src/components/SEOHead.tsx`
- `src/pages/Blog.tsx`
- `src/pages/BlogPost.tsx`
- `src/data/blogPosts.ts`
- `public/sitemap.xml`

**Modified files (9):**
- `src/App.tsx` - Add blog routes, CookieConsent
- `src/pages/Privacy.tsx` - AdSense/Analytics/cookie disclosures
- `src/pages/Terms.tsx` - Image ownership, ad disclosure
- `src/pages/About.tsx` - Creator info, LinkedIn, country
- `src/pages/Contact.tsx` - LinkedIn link
- `src/pages/Index.tsx` - SEOHead + upload privacy notice
- `src/pages/HowItWorks.tsx` - SEOHead
- `src/components/Footer.tsx` - Add Blog link
- `public/robots.txt` - Add sitemap reference
- `index.html` - Base structured data

