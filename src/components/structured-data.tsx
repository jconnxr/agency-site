// JSON-LD for the homepage, built from src/lib/site.ts so the business details
// and FAQ answers always match what's on the page.
import { faqs, services, site } from "@/lib/site";
import { mainSite } from "@/lib/contact";

const business = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${mainSite}/#business`,
  name: site.name,
  url: `${mainSite}/`,
  image: `${mainSite}/og-image.png`,
  description:
    "Websites, Google Business Profiles, AI search visibility, online booking, social media and ads for local businesses in the Oklahoma City metro.",
  ...(site.phone ? { telephone: site.phone } : {}),
  ...(site.email ? { email: site.email } : {}),
  // Service-area business: city and state only, no street address.
  address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: "OK", addressCountry: "US" },
  areaServed: site.serviceArea.map((c) => ({
    "@type": "City",
    name: `${c}, OK`,
    containedInPlace: { "@type": "State", name: "Oklahoma" },
  })),
  knowsAbout: services,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })),
  },
};

const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const json = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

export function StructuredData() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={json(business)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={json(faqPage)} />
    </>
  );
}
