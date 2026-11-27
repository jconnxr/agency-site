// Intake modal + contact form: options, which services each package button
// pre-checks, and the schemas shared by the browser (per-step validation) and
// POST /api/intake.
import { z } from "zod";
import { partnerTypeIds } from "./partners";
import { cleanRef } from "./ref";
import { adSpends, platforms } from "./ecommerce";

export const intakeServices = [
  "Website",
  "Google Business Profile",
  "Online Booking",
  "Social Media",
  "Ads",
  "Automation",
  "Photo & Drone",
  "AI Search Visibility",
] as const;
export type IntakeService = (typeof intakeServices)[number];

export const timelines = ["As soon as possible", "Within a month", "1–3 months", "Just exploring"] as const;

// Step 3 asks this first; the budget ranges shown depend on the answer.
export const engagements = ["One-time project", "Ongoing monthly help"] as const;
export type Engagement = (typeof engagements)[number];
export const budgetsFor: Record<Engagement, readonly string[]> = {
  "One-time project": ["Under $750", "$750–$1,500", "$1,500–$3,000", "$3,000+", "Not sure"],
  "Ongoing monthly help": ["Under $500/mo", "$500–$2,000/mo", "$2,000–$5,000/mo", "$5,000+/mo", "Not sure"],
};

// What each package or CTA pre-checks in step 1. Anything not listed opens with nothing checked.
export const packageServices: Record<string, IntakeService[]> = {
  "Launch Essentials": ["Website", "Google Business Profile"],
  "Launch Pro": ["Website", "Google Business Profile", "Online Booking", "Social Media", "Photo & Drone"],
  "Get Found: Google + AI": ["Google Business Profile"],
  "Get Leads": ["Ads", "Social Media"],
  "Full Department": ["Ads", "Social Media", "Photo & Drone"],
  "Quick Wins": ["Automation"],
  "Full Systems": ["Automation"],
};
/** Buttons that name a specific package or offer (used in the email subject). */
export const packageSources = [...Object.keys(packageServices), "Founding client spot", "À la carte"];

const urlish = z
  .string()
  .trim()
  .max(200)
  .refine((v) => v === "" || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v), "Enter a web address, like yourbusiness.com");

const phone = z
  .string()
  .trim()
  .max(40)
  .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a phone number with area code.");

// Step bodies, kept plain so they can be merged; cross-field checks live in refineBudget.
const stepShapes = [
  { services: z.array(z.enum(intakeServices)).min(1, "Pick at least one.") },
  {
    business: z.string().trim().min(2, "Enter your business name.").max(120),
    industry: z.string().trim().min(2, "What kind of business is it?").max(80),
    city: z.string().trim().min(2, "Enter your city.").max(80),
    website: urlish.optional().default(""),
  },
  {
    // Same order as on screen, so the first error found is the first one shown
    engagement: z.enum(engagements, { message: "Pick one-time or monthly." }),
    budget: z.string({ message: "Pick a budget range." }).min(1, "Pick a budget range."),
    timeline: z.enum(timelines, { message: "Pick a timeline." }),
  },
  {
    name: z.string().trim().min(2, "Enter your name.").max(80),
    email: z.string().trim().email("Enter an email we can reply to.").max(160),
    phone,
  },
] as const;

/** The budget has to be one of the ranges for the chosen engagement. */
function refineBudget(v: { engagement?: Engagement; budget?: string }, ctx: z.RefinementCtx) {
  if (v.engagement && v.budget && !budgetsFor[v.engagement].includes(v.budget)) {
    ctx.addIssue({ code: "custom", path: ["budget"], message: "Pick a budget range." });
  }
}

/** Field names per step (for clearing errors and focusing the first problem). */
export const stepFields = stepShapes.map((s) => Object.keys(s));

/** Per-step validators for the modal. */
export const intakeSteps = stepShapes.map((s, i) =>
  i === 2 ? z.object(s).superRefine(refineBudget) : z.object(s)
);

// Spam checks shared by both forms: a field people never see (honeypot), and how
// long the form was open, measured in the browser (faster than a person could
// fill it in means a bot). Elapsed time, not a timestamp, so clock skew can't matter.
export const HONEYPOT = "company_url";
export const MIN_FILL_MS = 3000;
const spam = {
  company_url: z.string().max(500).optional().default(""),
  elapsedMs: z.number().nonnegative().optional(),
};

// Partner attribution (src/lib/ref.ts), added to every form on send.
// Cleaned rather than rejected: a bad tag must never cost us the lead.
const utmValue = z.string().transform((v) => v.trim().slice(0, 100)).optional();
const attribution = {
  ref: z.string().max(200).transform(cleanRef).optional().default(""),
  utm: z
    .object({
      utm_source: utmValue,
      utm_medium: utmValue,
      utm_campaign: utmValue,
      utm_term: utmValue,
      utm_content: utmValue,
    })
    .optional()
    .default({}),
};

export const intakeSchema = z
  .object({
    kind: z.literal("intake").default("intake"),
    ...stepShapes[0],
    ...stepShapes[1],
    ...stepShapes[2],
    ...stepShapes[3],
    // Which button opened the modal (e.g. "Launch Pro", "Hero: Book a call")
    source: z.string().trim().max(80).optional().default(""),
    ...attribution,
    ...spam,
  })
  .superRefine(refineBudget);

// The short form next to the Calendly embed
export const contactInterests = [
  "Not sure yet",
  "Free Launch Plan (opening soon)",
  "Free Online Presence Check",
  "A website",
  "Google Business Profile setup or cleanup",
  "Online booking on my site",
  "Launch",
  "Get Found: Google + AI",
  "Get Leads",
  "Full Department",
  "Automate",
  "Something à la carte",
] as const;

export const contactSchema = z.object({
  kind: z.literal("contact"),
  source: z.literal("contact-form"),
  name: z.string().trim().min(2, "Enter your name.").max(80),
  business: z.string().trim().min(2, "Enter your business name.").max(120),
  email: z.string().trim().email("Enter an email we can reply to.").max(160),
  phone: z.string().trim().max(40).optional().default(""),
  interest: z.enum(contactInterests),
  message: z.string().trim().max(1000, "Keep it under 1,000 characters.").optional().default(""),
  ...attribution,
  ...spam,
});

// The apply / book-a-coffee form on /partners
export const partnerSchema = z.object({
  kind: z.literal("partner"),
  source: z.literal("partners-page"),
  name: z.string().trim().min(2, "Enter your name.").max(80),
  firm: z.string().trim().min(2, "Enter your firm or company.").max(120),
  partnerType: z.enum(partnerTypeIds, { message: "Pick what you do." }),
  bankEmployee: z.boolean().optional().default(false),
  email: z.string().trim().email("Enter an email we can reply to.").max(160),
  phone,
  clientsPerMonth: z.number().int().min(0).max(20),
  coffee: z.string().trim().max(200, "Keep it short.").optional().default(""),
  ...attribution,
  ...spam,
});

// The free Store Audit request on /ecommerce. lead_type keeps these apart from
// local leads in the email subject and the CRM.
export const ecommerceSchema = z.object({
  kind: z.literal("ecommerce"),
  lead_type: z.literal("ecommerce"),
  source: z.literal("ecommerce-page"),
  name: z.string().trim().min(2, "Enter your name.").max(80),
  storeUrl: z
    .string()
    .trim()
    .min(1, "Enter your store's web address.")
    .max(200)
    .refine((v) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v), "Enter a web address, like yourstore.com"),
  email: z.string().trim().email("Enter an email we can reply to.").max(160),
  platform: z.enum(platforms, { message: "Pick your platform." }),
  adSpend: z.enum(adSpends, { message: "Pick a range." }),
  problem: z.string().trim().max(1000, "Keep it under 1,000 characters.").optional().default(""),
  ...attribution,
  ...spam,
});

export const submissionSchema = z.union([contactSchema, intakeSchema, partnerSchema, ecommerceSchema]);

export type IntakeInput = z.input<typeof intakeSchema>;
export type Intake = z.output<typeof intakeSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type Contact = z.output<typeof contactSchema>;
export type PartnerInput = z.input<typeof partnerSchema>;
export type EcommerceInput = z.input<typeof ecommerceSchema>;
export type Submission = z.output<typeof submissionSchema>;
