"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { contactInterests as interests, contactSchema } from "@/lib/intake";
import { FadeUp, Panel, RevealHeading } from "@/components/fx";

export function Book() {
  return (
    <Panel id="book" surface="glow" className="scroll-mt-24" inner="px-4 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-[60ch] px-1">
          <RevealHeading text="Book a free 30-minute call" accent={1} className="text-[2.1rem] md:text-[3.2rem]" />
          <p className="mt-5 text-[1.06rem] leading-relaxed text-white/65">
            Pick a time below. Rather type it out? Send the form and we&rsquo;ll reply within one business day. Want the free Online Presence Check first? It also shows what ChatGPT and other AI tools say about you. Choose it in the form and we&rsquo;ll send it within 24 hours.
          </p>
        </div>

        <FadeUp className="mt-12 grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-8">
          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_rgb(255_255_255/0.12),0_40px_80px_-30px_rgb(0_0_0/0.8)]">
            {/* Calendly inline widget: scheduling happens right on the page */}
            <div
              className="calendly-inline-widget h-[700px] min-w-[320px]"
              data-url={`${site.calendlyUrl}?hide_gdpr_banner=1&primary_color=464ceb`}
            />
            <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
            <p className="border-t border-line px-5 py-3 text-sm text-muted">
              Calendar not showing?{" "}
              <a href={site.calendlyUrl} target="_blank" rel="noopener" className="font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-brand">
                Open the booking page in a new tab
              </a>
            </p>
          </div>
          <ContactForm />
        </FadeUp>
      </div>
    </Panel>
  );
}

// Same rules the server applies (src/lib/intake.ts), minus the fields we add on send.
const schema = contactSchema.pick({ name: true, business: true, email: true, phone: true, interest: true, message: true });
type FormValues = z.input<typeof schema>;

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  // When the form appeared, for the server's "filled in too fast" spam check
  const started = useRef(0);
  const [trap, setTrap] = useState("");
  useEffect(() => {
    started.current = Date.now();
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { interest: "Not sure yet" } });

  async function onSubmit(values: FormValues) {
    setStatus("idle");
    setErrorText(null);
    // Same endpoint as the intake modal: logged, emailed and sent to the CRM.
    try {
      const res = await fetch("/api/intake/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...values,
          kind: "contact",
          source: "contact-form",
          company_url: trap,
          elapsedMs: Date.now() - started.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErrorText(data.error ?? null);
        setStatus("error");
        return;
      }
      reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="glass rounded-[24px] p-6 md:p-8">
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
            <CheckCircle2 className="size-10 text-go" aria-hidden />
            <h3 className="text-[1.5rem]">Message sent</h3>
            <p className="text-white/65">We&rsquo;ll reply within one business day.</p>
            <Button variant="outline" className="rounded-full border-white/40 text-white hover:bg-white hover:text-ink" onClick={() => setStatus("idle")}>
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
            <h3 className="text-[1.5rem]">Send a message</h3>
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
            {/* Spam trap: hidden from people, bots fill it in. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
              <input name="company_url" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>
            {status === "error" && (
              <p role="alert" className="rounded-sm border-l-4 border-error bg-error-soft px-4 py-3 text-[0.95rem] text-ink">
                {errorText ?? "The message didn’t go through."}{" "}
                {site.email ? (
                  <>
                    Email us at{" "}
                    <a href={`mailto:${site.email}`} className="font-semibold underline">
                      {site.email}
                    </a>{" "}
                    or book a time instead.
                  </>
                ) : (
                  <>Please book a time instead.</>
                )}
              </p>
            )}
            <Button type="submit" size="lg" className="rounded-full hover:bg-brand-ink" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 text-white placeholder:text-white/40 focus:border-brand-glow focus:outline-none [&>option]:text-ink";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-[0.95rem] font-medium text-white/85">
      {label}
      {children}
      {error && <span className="text-sm font-normal text-error-glow">{error}</span>}
    </label>
  );
}
