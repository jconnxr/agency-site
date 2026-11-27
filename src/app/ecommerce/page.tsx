import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Faq, Footer } from "@/components/sections";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Backdrop } from "@/components/fx";
import { MotionRoot } from "@/components/motion-root";
import { EcomHero } from "@/components/ecommerce/hero";
import { HowItWorks, Services, WhyUs } from "@/components/ecommerce/sections";
import { StoreAudit } from "@/components/ecommerce/audit";
import { AuditRequest } from "@/components/ecommerce/request";
import { faqs } from "@/lib/ecommerce";
import { mainSite } from "@/lib/contact";
import { site } from "@/lib/site";

// E-commerce Growth: the second lane, for online brands (mostly arriving from X).
// Kept off the homepage on purpose; linked from the services grid and the footer.
const title = `E-commerce Growth: ads, creative and email automation | ${site.name}`;
const description =
  "Meta ads, in-house creative, landing pages and Klaviyo email and SMS flows for online brands. Start with a free Store Audit: your top 5 fixes, no pitch required.";
const shareTitle = "Grow your online store | Axiom Media Group";
const shareDescription =
  "Ads, creative and email automation for online brands. Get a free Store Audit: the top 5 fixes for your store.";
// Regenerate with: node scripts/make-og-image.mjs (after a build)
const shareImage = `${mainSite}/og-ecommerce.png`;
const shareImageAlt = "Axiom Media Group E-commerce Growth: grow your online store";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/ecommerce/" },
  openGraph: {
    type: "website",
    url: `${mainSite}/ecommerce/`,
    siteName: site.name,
    title: shareTitle,
    description: shareDescription,
    images: [{ url: shareImage, width: 1200, height: 630, alt: shareImageAlt, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [{ url: shareImage, alt: shareImageAlt }],
  },
};

const faqJson = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const nav = [
  { href: "#services", label: "What we do" },
  { href: "#audit", label: "Store Audit" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "Questions" },
];

export default function EcommercePage() {
  return (
    <MotionRoot>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson).replace(/</g, "\\u003c") }} />
      <div className="home relative isolate overflow-x-clip">
        <Backdrop />
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only z-50 bg-brand px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header links={nav} home="/" cta={{ href: "#request", label: "Free Store Audit", mobileLabel: "Get a free Store Audit" }} />
        <main id="main">
          <EcomHero />
          <Services />
          <StoreAudit />
          <HowItWorks />
          <WhyUs />
          <Faq items={faqs} heading="Questions online brands ask" askWhere="in your audit request" />
          <AuditRequest />
        </main>
        <Footer base="/" heading="See what to fix first." cta={{ href: "#request", label: "Get a free Store Audit" }} />
      </div>
    </MotionRoot>
  );
}
