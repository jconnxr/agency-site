// Intake modal: options, which services each package button pre-checks, and the
// schema shared by the modal (per-step validation) and POST /api/intake.
import { z } from "zod";

export const intakeServices = [
  "Website",
  "Google Business Profile",
  "Online Booking",
  "Social Media",
  "Ads",
  "Automation",
  "Photo & Drone",
] as const;
export type IntakeService = (typeof intakeServices)[number];

export const timelines = ["As soon as possible", "Within a month", "1–3 months", "Just exploring"] as const;
export const budgets = ["Under $750", "$750–$1,500", "$1,500–$3,000", "$3,000+", "Not sure yet"] as const;

// What each package or CTA pre-checks in step 1. Anything not listed opens with nothing checked.
export const packageServices: Record<string, IntakeService[]> = {
  "Launch Essentials": ["Website", "Google Business Profile"],
  "Launch Pro": ["Website", "Google Business Profile", "Online Booking", "Social Media"],
  "Get Found": ["Google Business Profile"],
  "Get Leads": ["Ads", "Social Media"],
  "Full Department": ["Ads", "Social Media", "Photo & Drone"],
  "Quick Wins": ["Automation"],
  "Full Systems": ["Automation"],
};

const urlish = z
  .string()
  .trim()
  .max(200)
  .refine((v) => v === "" || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v), "Enter a web address, like yourbusiness.com");

export const intakeSteps = [
  z.object({
    services: z.array(z.enum(intakeServices)).min(1, "Pick at least one."),
  }),
  z.object({
    business: z.string().trim().min(2, "Enter your business name.").max(120),
    industry: z.string().trim().min(2, "What kind of business is it?").max(80),
    city: z.string().trim().min(2, "Enter your city.").max(80),
    website: urlish.optional().default(""),
  }),
  z.object({
    timeline: z.enum(timelines, { message: "Pick a timeline." }),
    budget: z.enum(budgets, { message: "Pick a budget range." }),
  }),
  z.object({
    name: z.string().trim().min(2, "Enter your name.").max(80),
    email: z.string().trim().email("Enter an email we can reply to."),
    phone: z
      .string()
      .trim()
      .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a phone number with area code."),
  }),
] as const;

export const intakeSchema = intakeSteps[0]
  .merge(intakeSteps[1])
  .merge(intakeSteps[2])
  .merge(intakeSteps[3])
  .extend({
    // Which button opened the modal (e.g. "Launch Pro", "Hero CTA"); for context only
    source: z.string().trim().max(80).optional().default(""),
    // Spam trap: people never see it, bots fill it in
    company_url: z.string().max(0).optional().default(""),
  });

export type IntakeInput = z.input<typeof intakeSchema>;
export type Intake = z.output<typeof intakeSchema>;
