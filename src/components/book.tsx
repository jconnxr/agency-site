"use client";

import { useState } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { interests, site } from "@/lib/site";

export function Book() {
  return (
    <section id="book" className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="max-w-[56ch]">
          <p className="flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-wheat">
            <span>05</span>
            <span aria-hidden className="h-0.5 w-8 bg-wheat/70" />
            <span>Book a call</span>
          </p>
          <h2 className="mt-4 text-[2.4rem] font-extrabold leading-[1.04] md:text-[3.4rem]">
            Book a free <span className="whitespace-nowrap">30-minute</span> call
          </h2>
          <p className="mt-4 text-lg text-white/75">
            Pick a time below. Rather type it out? Send the form and we&rsquo;ll reply within one business day. Want the free Online Presence Check first? Choose it in the form and we&rsquo;ll send it within 24 hours.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.45fr_1fr]">
          <div className="overflow-hidden rounded-lg bg-white">
            {/* Calendly inline widget: scheduling happens right on the page */}
            <div
              className="calendly-inline-widget h-[700px] min-w-[320px]"
              data-url={`${site.calendlyUrl}?hide_gdpr_banner=1&primary_color=2c68b0`}
            />
            <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
            <p className="border-t border-line px-5 py-3 text-sm text-muted">
              Calendar not showing?{" "}
              <a href={site.calendlyUrl} target="_blank" rel="noopener" className="font-semibold text-flag underline underline-offset-4">
                Open the booking page in a new tab
              </a>
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  business: z.string().trim().min(2, "Enter your business name."),
  email: z.string().trim().email("Enter an email we can reply to."),
  phone: z.string().trim().optional(),
  interest: z.enum(interests),
  message: z.string().trim().max(1000, "Keep it under 1,000 characters.").optional(),
});
type FormValues = z.infer<typeof schema>;

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { interest: "Not sure yet" } });

  async function onSubmit(values: FormValues) {
    setStatus("idle");
    if (!site.formspreeId) {
      setStatus("error");
      return;
    }
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("send failed");
      reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-lg border border-white/15 bg-white/[0.03] p-6 md:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex h-full flex-col items-start justify-center gap-4 py-10"
            role="status"
          >
            <CheckCircle2 className="size-10 text-wheat" aria-hidden />
            <h3 className="text-2xl font-bold">Message sent</h3>
            <p className="text-white/75">We&rsquo;ll reply within one business day.</p>
            <Button variant="outline" className="border-white/60 text-white hover:bg-white hover:text-ink" onClick={() => setStatus("idle")}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="grid gap-5"
          >
            <h3 className="text-2xl font-bold">Send a message</h3>
            <Field label="Your name" error={errors.name?.message}>
              <input {...register("name")} autoComplete="name" className={inputCls} />
            </Field>
            <Field label="Business name" error={errors.business?.message}>
              <input {...register("business")} autoComplete="organization" className={inputCls} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" error={errors.email?.message}>
                <input {...register("email")} type="email" autoComplete="email" className={inputCls} />
              </Field>
              <Field label="Phone (optional)">
                <input {...register("phone")} type="tel" autoComplete="tel" className={inputCls} />
              </Field>
            </div>
            <Field label="What are you interested in?">
              <select {...register("interest")} className={inputCls}>
                {interests.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </Field>
            <Field label="Anything we should know? (optional)" error={errors.message?.message}>
              <textarea {...register("message")} rows={3} className={`${inputCls} h-auto py-3`} />
            </Field>
            {status === "error" && (
              <p role="alert" className="rounded-sm bg-wheat-soft px-4 py-3 text-[0.95rem] text-ink">
                The message didn&rsquo;t go through. Email us at{" "}
                <a href={`mailto:${site.email}`} className="font-semibold underline">
                  {site.email}
                </a>{" "}
                or book a time instead.
              </p>
            )}
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-sm border border-white/25 bg-white/5 px-4 text-white placeholder:text-white/40 focus:border-wheat focus:outline-none [&>option]:text-ink";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-[0.95rem] font-medium">
      {label}
      {children}
      {error && <span className="text-sm font-normal text-wheat">{error}</span>}
    </label>
  );
}
