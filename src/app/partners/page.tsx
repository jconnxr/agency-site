import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Faq, Footer } from "@/components/sections";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Backdrop } from "@/components/fx";
import { MotionRoot } from "@/components/motion-root";
import { PartnerProvider } from "@/components/partners/state";
import { PartnerHero } from "@/components/partners/hero";
import { Seats } from "@/components/partners/seats";
import { ClientJourney, OwnerBand, PartnerSteps, TripleWin } from "@/components/partners/sections";
import { Calculator } from "@/components/partners/calculator";
import { Apply } from "@/components/partners/apply";
import { partnerFaqs } from "@/lib/partners";
import { mainSite } from "@/lib/contact";
import { site } from "@/lib/site";

// Landing page for partner QR codes (?ref=<slug>&type=<seat>). Indexable.
const title = `Referral partners | ${site.name}`;
const description =
  "For OKC insurance agents, CPAs, lenders, commercial real estate agents and attorneys: we get the new businesses you work with online and found on Google before opening day. Earn a referral fee or give your client $100 off.";
const shareTitle = "Your clients open stronger | Axiom Media Group partners";
const shareDescription =
  "We get the new businesses you work with found on Google before opening day. Earn a referral fee, or give your client $100 off.";
// Regenerate with: node scripts/make-og-image.mjs (after a build)
const shareImage = `${mainSite}/og-partners.png`;
const shareImageAlt = "Axiom Media Group referral partners: your clients open stronger";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/partners/" },
  openGraph: {
    type: "website",
    url: `${mainSite}/partners/`,
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
  mainEntity: partnerFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const nav = [
  { href: "#seats", label: "Pick your seat" },
  { href: "#how", label: "How it works" },
  { href: "#journey", label: "What clients get" },
  { href: "#earnings", label: "Your side" },
  { href: "#faq", label: "Questions" },
];

export default function PartnersPage() {
  return (
    <MotionRoot>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson).replace(/</g, "\\u003c") }} />
      <PartnerProvider>
        <div className="home relative isolate overflow-x-clip">
          <Backdrop />
          <SmoothScroll />
          <a
            href="#main"
            className="sr-only z-50 bg-brand px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <Header links={nav} home="/" cta={{ href: "#apply", label: "Book a coffee", mobileLabel: "Book a 20-min coffee" }} />
          <main id="main">
            <PartnerHero />
            <Seats />
            <PartnerSteps />
            <ClientJourney />
            <Calculator />
            <TripleWin />
            <Faq items={partnerFaqs} heading="Questions partners ask" askWhere="over coffee" />
            <Apply />
            <OwnerBand />
          </main>
          <Footer
            base="/"
            heading="Your clients open stronger."
            cta={{ href: "#apply", label: "Book a 20-min coffee" }}
          />
        </div>
      </PartnerProvider>
    </MotionRoot>
  );
}
