"use client";

// Store Audit request. Same handling as the contact and partner forms:
// react-hook-form + the zod schema the server uses, the honeypot and fill-time
// spam checks, POST /api/intake. Tagged lead_type "ecommerce", with the
// visitor's ?ref= and UTMs (src/lib/ref.ts).
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ecommerceSchema } from "@/lib/intake";
import { adSpends, auditTurnaround, platforms } from "@/lib/ecommerce";
import { attributionFields } from "@/lib/ref";
import { site } from "@/lib/site";
import { phoneDisplay, telHref } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { FadeUp, Panel, RevealHeading, eyebrow } from "@/components/fx";
import { Field, inputCls } from "@/components/book";

const schema = ecommerceSchema.pick({ name: true, storeUrl: true, email: true, platform: true, adSpend: true, problem: true });
type FormValues = z.input<typeof schema>;

export function AuditRequest() {
  return (
    <Panel id="request" surface="glow" className="scroll-mt-24" inner="px-4 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        <div className="px-1 lg:sticky lg:top-32 lg:self-start">
          <p className={cn(eyebrow, "text-brand-glow")}>Free Store Audit</p>
          <RevealHeading text="Get your top 5 fixes." accent={2} className="mt-4 text-[2.1rem] md:text-[3.2rem]" />
          <p className="mt-5 max-w-[46ch] text-[1.06rem] leading-relaxed text-white/65">
            Tell us where to look. We review your ads, product pages, checkout, email flows, site speed and AI shopping
            visibility, and send the list in {auditTurnaround}. Pricing comes after the audit, only if you want it.
          </p>
          <div className="mt-8 flex flex-col gap-1">
            {telHref && (
              <a href={telHref} className="inline-flex min-h-11 items-center gap-3 self-start text-white/75 hover:text-white">
                <Phone aria-hidden className="size-4 text-brand-glow" />
                {phoneDisplay}
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-3 self-start break-all text-white/75 hover:text-white">
                <Mail aria-hidden className="size-4 shrink-0 text-brand-glow" />
                {site.email}
              </a>
            )}
          </div>
        </div>

        <FadeUp>
          <AuditForm />
        </FadeUp>
      </div>
    </Panel>
  );
}

function AuditForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [sentName, setSentName] = useState("");
  const [trap, setTrap] = useState("");
  // When the form appeared, for the server's "filled in too fast" spam check
  const started = useRef(0);
  // Hold the card's height so the shorter confirmation doesn't collapse the page
  const card = useRef<HTMLDivElement>(null);
  const [holdHeight, setHoldHeight] = useState<number | undefined>();
  useEffect(() => {
    started.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { platform: "Shopify", problem: "" },
  });

  async function onSubmit(values: FormValues) {
    setStatus("idle");
    setErrorText(null);
    try {
      const res = await fetch("/api/intake/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...values,
          ...attributionFields(),
          kind: "ecommerce",
          lead_type: "ecommerce",
          source: "ecommerce-page",
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
      setHoldHeight(card.current?.offsetHeight);
      setSentName(values.name.trim().split(/\s+/)[0] ?? "");
      reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div ref={card} className="glass rounded-[24px] p-6 md:p-8" style={status === "sent" ? { minHeight: holdHeight } : undefined}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start gap-4 py-6"
            role="status"
          >
            <CheckCircle2 className="size-10 text-go-glow" aria-hidden />
            <h3 className="text-[1.6rem]">Got it{sentName ? `, ${sentName}` : ""}. Your audit is in the queue.</h3>
            <p className="text-white/65">Here&rsquo;s what happens next:</p>
            <ol className="grid gap-3 text-[0.98rem] text-white/80">
              {[
                "We go through your ads, product pages, checkout, email flows, site speed and AI shopping visibility.",
                `Your top 5 fixes land in your inbox in ${auditTurnaround}.`,
                "Want to talk them through? Reply to that email. No pitch required.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-brand-glow/60 font-mono text-[0.7rem] text-brand-glow">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
            <Button
              variant="outline"
              className="mt-2 rounded-full border-white/40 text-white hover:bg-white hover:text-ink"
              onClick={() => {
                setStatus("idle");
                started.current = Date.now();
              }}
            >
              Request another audit
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
            <h3 className="text-[1.5rem]">Request your Store Audit</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" error={errors.name?.message}>
                <input {...register("name")} autoComplete="name" aria-invalid={!!errors.name} className={inputCls} />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input {...register("email")} type="email" autoComplete="email" aria-invalid={!!errors.email} className={inputCls} />
              </Field>
            </div>
            <Field label="Store URL" error={errors.storeUrl?.message}>
              <input
                {...register("storeUrl")}
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder="yourstore.com"
                aria-invalid={!!errors.storeUrl}
                className={inputCls}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Platform" error={errors.platform?.message}>
                <select {...register("platform")} aria-invalid={!!errors.platform} className={inputCls}>
                  {platforms.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Monthly ad spend" error={errors.adSpend?.message}>
                <select {...register("adSpend")} defaultValue="" aria-invalid={!!errors.adSpend} className={inputCls}>
                  <option value="" disabled>
                    Pick a range
                  </option>
                  {adSpends.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="What's your biggest problem right now? (optional)" error={errors.problem?.message}>
              <textarea
                {...register("problem")}
                rows={3}
                placeholder="e.g. ads stopped working, carts but no checkouts, no email flows yet"
                className={`${inputCls} h-auto py-3`}
              />
            </Field>

            {/* Spam trap: hidden from people, bots fill it in. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
              <input name="company_url" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>

            {status === "error" && (
              <p role="alert" className="rounded-sm border-l-4 border-error bg-error-soft px-4 py-3 text-[0.95rem] text-ink">
                {errorText ?? "That didn’t go through."} Email{" "}
                <a href={`mailto:${site.email}`} className="font-semibold underline">
                  {site.email}
                </a>
                {phoneDisplay ? <> or call {phoneDisplay}</> : null}.
              </p>
            )}
            <Button type="submit" size="lg" className="rounded-full hover:bg-brand-ink" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Get my free Store Audit"}
            </Button>
            <p className="-mt-1 text-[0.88rem] text-white/50">Free. No pitch required. Pricing after your audit, if you want it.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
