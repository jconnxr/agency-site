// Referral partner program: every fact on /partners lives here. Prices come from
// src/lib/site.ts, so a package price change flows through the calculator too.
// Program facts only: no invented stats, logos, client counts or quotes.
import { prices, site, usd } from "./site";

/* ------------------------------------------------------------------ */
/* Partner display names                                               */
/* ------------------------------------------------------------------ */

/**
 * Optional display names for ?ref= slugs. When a slug is listed here, /partners
 * greets the visitor with the partner's name; otherwise it says "a partner"
 * and never shows the raw slug.
 * TODO: add each partner as they sign up.
 */
export const partnerNames: Record<string, { name: string }> = {
  // "anderson-insurance": { name: "Anderson Insurance" },
};

/* ------------------------------------------------------------------ */
/* Terms                                                               */
/* ------------------------------------------------------------------ */

export const terms = {
  feePro: 150,
  feeEssentials: 75,
  /** Share of the first N months of Get Found: Google + AI */
  getFoundShare: 0.1,
  getFoundMonths: 3,
  clientDiscount: 100,
};

/** 10% of 3 months of Get Found, in dollars (497 × 3 × 0.1 = 149.10) */
export const getFoundFee = prices.getFound * terms.getFoundMonths * terms.getFoundShare;

// TODO: payout timing isn't decided. Don't promise when partners get paid;
// keep this neutral until it is.
export const payoutNote = "Paid after your client's launch.";

export const feeLines = [
  { k: "Launch Pro", v: `${usd(terms.feePro)} per client` },
  { k: "Launch Essentials", v: `${usd(terms.feeEssentials)} per client` },
  { k: "Get Found: Google + AI", v: `10% of the first ${terms.getFoundMonths} months` },
];

/* ------------------------------------------------------------------ */
/* "Pick your seat": one entry per partner type                        */
/* ------------------------------------------------------------------ */

export const partnerTypeIds = ["insurance", "cpa", "lender", "cre", "attorney", "photographer"] as const;
export type PartnerTypeId = (typeof partnerTypeIds)[number];

export type Seat = {
  id: PartnerTypeId;
  /** Chip label */
  label: string;
  /** Form select label */
  formLabel: string;
  headline: string;
  moment: { title: string; body: string };
  hand: { title: string; body: string };
  get: string[];
  /** Photographers are supply partners, not referrers */
  supply?: boolean;
  /** Shows the "I work at a bank or credit union" switch */
  bankSwitch?: boolean;
};

const advisorGets = [
  "Clients who open stronger and stick around",
  "Opening-day photos of their space for your LinkedIn",
  "A results report on your client",
];

export const seats: Seat[] = [
  {
    id: "insurance",
    label: "Insurance",
    formLabel: "Commercial insurance agent",
    headline: "You bind the policy. We get them found.",
    moment: { title: "Binding a new business policy", body: "The day a new owner insures their space is the day they start worrying about being found." },
    hand: {
      title: "A co-branded New Business Checklist",
      body: "Your name and ours on a checklist they keep: insurance, lease, LLC, and getting online before opening day.",
    },
    get: [...advisorGets, "A co-branded New Business Checklist with your name on it"],
  },
  {
    id: "cpa",
    label: "CPAs & Bookkeepers",
    formLabel: "CPA or bookkeeper",
    headline: "You set up the books. We set up the phone ringing.",
    moment: { title: "LLC setup and first-year books", body: "New entity, new bank account, new books. Their next question is how customers will find them." },
    hand: {
      title: "The client insert",
      body: "A one-page insert for your welcome packet. Marketing is typically a deductible business expense: tell clients to check with you.",
    },
    get: [...advisorGets, "The look of a full-service advisor"],
  },
  {
    id: "lender",
    label: "Lenders & Bankers",
    formLabel: "SBA lender or business banker",
    headline: "You fund the opening. We fill the calendar.",
    moment: { title: "Loan closing", body: "The money's there and the build-out starts. Opening day is now a date on the calendar." },
    hand: {
      title: "A closing gift",
      body: "Hand over the client insert at closing: a free Launch Plan, and $100 off if you choose to pass it on.",
    },
    get: [...advisorGets, "The look of a full-service advisor"],
    bankSwitch: true,
  },
  {
    id: "cre",
    label: "Commercial Real Estate",
    formLabel: "Commercial real estate (tenant rep)",
    headline: "You find the space. We make sure people find it.",
    moment: { title: "Lease signing", body: "Keys in hand and months of build-out ahead. The best time to get online is before the sign goes up." },
    hand: {
      title: "The client insert with the keys",
      body: "A free Launch Plan with an opening-day timeline, tucked in with the lease paperwork.",
    },
    get: [...advisorGets, "The look of a full-service advisor"],
  },
  {
    id: "attorney",
    label: "Attorneys",
    formLabel: "Formation or franchise attorney",
    headline: "You form the business. We launch it.",
    moment: { title: "LLC or franchise setup", body: "The entity is formed and the name is final. Now the name needs a domain, a profile and a site." },
    hand: {
      title: "The client insert",
      body: "Their free Launch Plan includes a name, domain and social handle check, a good next step after formation.",
    },
    get: [...advisorGets, "The look of a full-service advisor"],
  },
  {
    id: "photographer",
    label: "Photographers",
    formLabel: "Photographer",
    headline: "We sell the shoot. You shoot it.",
    moment: { title: "Every Launch Pro", body: "Every Launch Pro includes a pro photo shoot for the client's site, Google profile and socials." },
    hand: {
      title: "We handle the rest",
      body: "We sell the shoot and handle scheduling and the client relationship. You show up and shoot.",
    },
    get: ["Paid work at your rate", "No selling, scheduling or client wrangling", "Your photos on a live site, a Google profile and socials"],
    supply: true,
  },
];

export const seatById = (id: string | null | undefined) => seats.find((s) => s.id === id);
export const isPartnerType = (v: string | null | undefined): v is PartnerTypeId =>
  !!v && (partnerTypeIds as readonly string[]).includes(v);

/* ------------------------------------------------------------------ */
/* Process, client offer, FAQ                                          */
/* ------------------------------------------------------------------ */

export const partnerSteps = [
  { title: "We meet for a 20-minute coffee", body: "You tell us who you work with. We show you exactly what your clients get.", tag: "20 minutes" },
  { title: "You get your kit", body: "Flyers, client inserts and your own tracked QR code.", tag: "Same week" },
  { title: "Your client books", body: "A free Launch Plan if they're opening soon, or a free Online Presence Check if they're already open.", tag: "Free for them" },
  { title: "We launch them", body: "Site, Google profile and the rest, live in 14 to 30 days.", tag: "14–30 days" },
  {
    title: "You get the credit",
    body: "A results report on your client, plus your referral fee. Or your client got $100 off, if that's what you chose.",
    tag: "After launch",
  },
];

export const launchPlan = {
  title: "Free Launch Plan",
  for: "Opening soon",
  items: [
    "A 15-minute call",
    "A one-page plan with an opening-day timeline",
    "A name, domain and social handle check",
    "A snapshot of the top 3 nearby competitors",
    "A launch checklist",
  ],
};

export const presenceCheck = {
  title: "Free Online Presence Check",
  for: "Already open",
  body: "A one-page look at their Google listing, website, reviews and what AI tools say about them.",
};

export const partnerFaqs = [
  { q: "Does it cost me anything?", a: "No. There's nothing to buy and nothing to sign up for beyond a coffee." },
  {
    q: "Do I have to sell anything?",
    a: "No. Hand your client the insert or show them your QR code. We take it from there, and the first step is free for them.",
  },
  {
    q: "How are referrals tracked?",
    a: "Every partner gets their own QR code and link. When your client scans it or books through it, the referral is credited to you.",
  },
  {
    q: "Can I give the discount instead of taking a fee?",
    a: `Yes. Instead of the referral fee, your client gets ${usd(terms.clientDiscount)} off any Launch package. Your call, client by client.`,
  },
  {
    q: "I work at a bank or credit union. Can I participate?",
    a: `Yes. Bank and credit union employees take the client discount option only: your client gets ${usd(terms.clientDiscount)} off any Launch package and you take no fee, so it fits bank policy.`,
  },
  {
    q: "What if my client is already open?",
    a: "They get a free Online Presence Check instead of a Launch Plan: their Google listing, website, reviews and what AI tools say about them, in one page.",
  },
  {
    q: "Is marketing deductible?",
    a: "Marketing is typically a deductible business expense. Tell your clients to check with their CPA.",
  },
  {
    q: "Who are you?",
    a: "Two Oklahoma City locals running Axiom Media Group. We build websites and Google profiles for new local businesses and help them get found before opening day.",
  },
];

export const partnerContact = {
  email: site.email,
};
