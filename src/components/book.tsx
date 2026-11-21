"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { interests, site } from "@/lib/site";
import { FadeUp, Panel, RevealHeading } from "@/components/fx";

export function Book() {
  return (
    <Panel id="book" surface="glow" className="scroll-mt-24" inner="px-4 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-[60ch] px-1">
          <RevealHeading text="Book a free 30-minute call" accent={1} className="text-[2.1rem] md:text-[3.2rem]" />
          <p className="mt-5 text-[1.06rem] leading-relaxed text-white/65">
            {site.axiomFormKey || site.formspreeId ? (
              <>
                Pick a time below. Rather type it out? Send the form and we&rsquo;ll reply within one business day. Want the free Online Presence Check first? Choose it in the form and we&rsquo;ll send it within 24 hours.
              </>
            ) : (
              <>Pick a time below and choose a phone call or Zoom. Want the free Online Presence Check first? Mention it when you book and we&rsquo;ll send it within 24 hours.</>
            )}
          </p>
        </div>

        <FadeUp className="mt-12 grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-8">
          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_0_0_1px_rgb(255_255_255/0.12),0_40px_80px_-30px_rgb(0_0_0/0.8)]">
            {/* Calendly inline widget: scheduling happens right on the page */}
            <div
              className="calendly-inline-widget h-[700px] min-w-[320px]"
              data-url={`${site.calendlyUrl}?hide_gdpr_banner=1&primary_color=c4502b`}
            />
            <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
            <p className="border-t border-line px-5 py-3 text-sm text-muted">
              Calendar not showing?{" "}
              <a href={site.calendlyUrl} target="_blank" rel="noopener" className="font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-clay">
                Open the booking page in a new tab
              </a>
            </p>
          </div>
          {site.axiomFormKey || site.formspreeId ? <ContactForm /> : <NoFormCard />}
        </FadeUp>
      </div>
    </Panel>
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

// Shown instead of the form until a CRM form key (or Formspree ID) is set,
// so visitors never fill in a form that can't send.
function NoFormCard() {
  return (
    <div className="glass flex flex-col gap-4 self-start rounded-[24px] p-6 md:p-8">
      <span aria-hidden className="h-1 w-10 rounded-full bg-clay-glow" />
      <h3 className="text-[1.5rem]">Rather we call you?</h3>
      <p className="text-white/65">
        Pick any open time and choose &ldquo;phone call&rdquo;. We&rsquo;ll call the number you leave, look over your Google listing and website with you, and tell you plainly what would bring in more calls.
      </p>
      <p className="text-white/65">
        Want the free Online Presence Check? Mention it in the booking notes and we&rsquo;ll send it within 24 hours.
      </p>
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  // When the form appeared: the CRM uses it as spam protection.
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
    if (site.axiomFormKey) {
      // Axiom CRM: creates the lead, logs it and adds a "call back" task for today.
      const message = [`Interested in: ${values.interest}`, values.message].filter(Boolean).join("\n\n");
      try {
        const res = await fetch(`${site.crmUrl}/api/forms/${site.axiomFormKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: values.name,
            business: values.business,
            email: values.email,
            phone: values.phone ?? "",
            message,
            website: trap,
            _t: String(started.current),
            _page: window.location.href,
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
      return;
    }
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
              <input name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>
            {status === "error" && (
              <p role="alert" className="rounded-sm bg-clay-soft px-4 py-3 text-[0.95rem] text-ink">
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
            <Button type="submit" size="lg" className="rounded-full hover:bg-clay-glow" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 text-white placeholder:text-white/40 focus:border-clay-glow focus:outline-none [&>option]:text-ink";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-[0.95rem] font-medium text-white/85">
      {label}
      {children}
      {error && <span className="text-sm font-normal text-clay-glow">{error}</span>}
    </label>
  );
}
