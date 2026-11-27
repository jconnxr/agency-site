// E-commerce Growth (/ecommerce): every fact on the page lives here.
// Facts only: no results, ROAS numbers, client counts, logos or testimonials
// until we have real ones. Prices live in src/lib/site.ts (ecommerce, all null).
import type { Step } from "@/components/steps";

export const services = [
  {
    id: "ads",
    title: "Ads & Creative",
    body: "Meta ads on Facebook and Instagram: campaign setup, creative testing, retargeting cart and product viewers, optimized weekly. We shoot and edit the creative ourselves.",
    points: ["Product photos", "Short-form video", "UGC-style edits"],
  },
  {
    id: "pages",
    title: "Landing pages",
    body: "Fast, focused pages for one product or offer, so your ads point somewhere built to convert. Built in-house.",
    points: ["One product or offer", "Mobile-first", "Built in-house"],
  },
  {
    id: "email",
    title: "Email & SMS automation",
    body: "Klaviyo set up properly, the core flows running, and monthly campaigns on top.",
    points: ["Welcome", "Abandoned cart", "Browse abandon", "Post-purchase", "Win-back"],
  },
  {
    id: "ai",
    title: "AI shopping visibility",
    body: "Getting your products and brand named when shoppers ask ChatGPT, Perplexity or Google's AI what to buy.",
    points: ["ChatGPT", "Perplexity", "Google AI"],
  },
] as const;

export const backEnd = {
  title: "Back-end automation",
  body: "Order and inventory alerts, review requests, customer-service auto-replies, and data synced between your tools.",
};

/** What the free Store Audit looks at */
export const auditChecks = [
  { k: "Ads", v: "Account structure, creative, targeting and retargeting" },
  { k: "Product pages", v: "Photos, copy, offer and trust signals" },
  { k: "Checkout", v: "Steps, friction and drop-off points" },
  { k: "Email flows", v: "Which flows exist, which are missing" },
  { k: "Site speed", v: "Mobile load time on the pages your ads hit" },
  { k: "AI shopping visibility", v: "Whether AI assistants name you when shoppers ask" },
];

// TODO: confirm the audit turnaround (3 business days) before launch.
export const auditTurnaround = "about 3 business days";

export const steps: Step[] = [
  { title: "Free Store Audit", body: "We review your store and send back the top 5 fixes. No pitch required.", tag: "Free" },
  { title: "Plan", body: "What to fix first, what we'd run, and what it costs. You decide from there.", tag: "After the audit" },
  { title: "Launch", body: "Ads, creative, pages and flows built and switched on, in your accounts.", tag: "Build" },
  { title: "Monthly reporting and testing", body: "New creative tested every month, a plain report on what ran and what we're changing next.", tag: "Monthly" },
];

export const whyUs = [
  { title: "We shoot our own creative", body: "Product photos, short-form video and UGC-style edits, made by the team running your ads." },
  { title: "We build our own pages and automations", body: "Landing pages and Klaviyo flows built in-house, not handed off." },
  { title: "You talk to the people doing the work", body: "A small team. No account manager relaying messages." },
  { title: "You own your accounts", body: "Your ad account, Klaviyo and Shopify stay yours. We get access, never ownership." },
];

// TODO: confirm contract terms (minimum length, notice period) before launch.
const contractAnswer = "Short minimums, no long lock-ins. We'll put the exact terms in your plan before you sign anything.";

export const faqs = [
  { q: "What platforms do you work with?", a: "Mainly Shopify. On WooCommerce or something else? Ask, and we'll tell you honestly if it's a fit." },
  {
    q: "How does pricing work?",
    a: "A monthly management fee, plus your ad spend, which you pay directly to Meta. We give you exact pricing after your free Store Audit, once we know what's worth doing.",
  },
  { q: "Do I own my ad account and email list?", a: "Yes. Your ad account, Klaviyo, email list and Shopify stay in your name. We get access, never ownership." },
  { q: "Do you lock me into a long contract?", a: contractAnswer },
  {
    q: "Do you guarantee results?",
    a: "No one honestly can. We guarantee the work: the creative, the testing cadence and honest reporting on what's working and what isn't.",
  },
  {
    q: "Are you only local?",
    a: "Our local work is for Oklahoma City businesses. E-commerce clients can be anywhere.",
  },
];

export const platforms = ["Shopify", "WooCommerce", "Other"] as const;
export const adSpends = ["None yet", "Under $3k/mo", "$3k–$10k/mo", "$10k+/mo"] as const;
