"use client";

// Apply / book-a-coffee form. Same handling as the homepage contact form:
// react-hook-form + the zod schema the server uses, the honeypot and fill-time
// spam checks, POST /api/intake. Tagged with the partner type and ref code.
import { useEffect, useRef, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, CheckCircle2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { partnerSchema } from "@/lib/intake";
import { partnerContact, seats, seatById } from "@/lib/partners";
import { attributionFields, calendlyTracking } from "@/lib/ref";
import { site } from "@/lib/site";
import { phoneDisplay, telHref } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { FadeUp, Panel, RevealHeading, eyebrow } from "@/components/fx";
import { Field, inputCls } from "@/components/book";
import { usePartner } from "./state";

const schema = partnerSchema.pick({
  name: true,
  firm: true,
  partnerType: true,
  bankEmployee: true,
  email: true,
  phone: true,
  clientsPerMonth: true,
  coffee: true,
});
type FormValues = z.input<typeof schema>;

// TODO: there's no partner-coffee event type in Calendly yet, so this opens the
// existing call with a note prefilled. Swap in a 20-minute coffee event when it exists.
const coffeeBase = site.calendlyUrl;

export function Apply() {
  const { type, ref } = usePartner();
  const [coffeeUrl, setCoffeeUrl] = useState(coffeeBase);
  useEffect(() => {
    const q = calendlyTracking({ utm_source: "partners-page", utm_medium: "referral-partner" });
    q.set("a1", `Partner coffee (${seatById(type)?.formLabel ?? type})${ref ? `. Referred by: ${ref}` : ""}`);
    setCoffeeUrl(`${coffeeBase}?${q}`);
  }, [type, ref]);

  return (
    <Panel id="apply" surface="glow" className="scroll-mt-24" inner="px-4 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        <div className="px-1 lg:sticky lg:top-32 lg:self-start">
          <p className={cn(eyebrow, "text-brand-glow")}>Apply</p>
          <RevealHeading text="Book a 20-minute coffee." accent={2} className="mt-4 text-[2.1rem] md:text-[3.2rem]" />
          <p className="mt-5 max-w-[46ch] text-[1.06rem] leading-relaxed text-white/65">
            Tell us a little about who you work with. We&rsquo;ll reply within one business day to set a time and place,
            and bring the flyers, client inserts and your own QR code.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={coffeeUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-12 items-center gap-3 self-start rounded-full border border-white/25 px-5 font-semibold text-white transition-colors hover:bg-white hover:text-ink"
            >
              <CalendarDays aria-hidden className="size-4" />
              Book a coffee directly
            </a>
            {telHref && (
              <a href={telHref} className="inline-flex min-h-11 items-center gap-3 self-start text-white/75 hover:text-white">
                <Phone aria-hidden className="size-4 text-brand-glow" />
                {phoneDisplay}
              </a>
            )}
            <a href={`mailto:${partnerContact.email}`} className="inline-flex min-h-11 items-center gap-3 self-start break-all text-white/75 hover:text-white">
              <Mail aria-hidden className="size-4 shrink-0 text-brand-glow" />
              {partnerContact.email}
            </a>
          </div>
        </div>

        <FadeUp>
          <PartnerForm />
        </FadeUp>
      </div>
    </Panel>
  );
}

function PartnerForm() {
  const { type, bank, clients } = usePartner();
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [sentName, setSentName] = useState("");
  const started = useRef(0);
  // The confirmation is shorter than the form: hold the card's height so the
  // page doesn't collapse and scroll the confirmation out of view
  const card = useRef<HTMLDivElement>(null);
  const [holdHeight, setHoldHeight] = useState<number | undefined>();
  const [trap, setTrap] = useState("");
  useEffect(() => {
    started.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getFieldState,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { partnerType: type, bankEmployee: bank, clientsPerMonth: clients, coffee: "" },
  });

  // Follow the seat picker and calculator until the visitor edits the field themselves
  useEffect(() => {
    if (!getFieldState("partnerType").isDirty) setValue("partnerType", type);
  }, [type, setValue, getFieldState]);
  useEffect(() => {
    if (!getFieldState("bankEmployee").isDirty) setValue("bankEmployee", bank);
  }, [bank, setValue, getFieldState]);
  useEffect(() => {
    if (!getFieldState("clientsPerMonth").isDirty) setValue("clientsPerMonth", clients);
  }, [clients, setValue, getFieldState]);

  const picked = watch("partnerType");
  // Controlled, so the slider always shows the form's value (an uncontrolled range starts mid-track)
  const { field: perMonthField } = useController({ control, name: "clientsPerMonth" });
  const perMonth = Number(perMonthField.value ?? 0);

  async function onSubmit(values: FormValues) {
    setStatus("idle");
    setErrorText(null);
    try {
      const res = await fetch("/api/intake/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...values,
          // Only lenders and bankers can be bank employees
          bankEmployee: values.partnerType === "lender" ? !!values.bankEmployee : false,
          ...attributionFields(),
          kind: "partner",
          source: "partners-page",
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
      reset({ partnerType: values.partnerType, bankEmployee: false, clientsPerMonth: clients, coffee: "" });
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
            <h3 className="text-[1.6rem]">Thanks{sentName ? `, ${sentName}` : ""}. Let&rsquo;s get coffee.</h3>
            <p className="text-white/65">Here&rsquo;s what happens next:</p>
            <ol className="grid gap-3 text-[0.98rem] text-white/80">
              {[
                "We reply within one business day to set a time and place.",
                "Over coffee, we walk through what your clients get and answer your questions.",
                "You leave with flyers, client inserts and your own tracked QR code.",
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
              Send another
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
            <h3 className="text-[1.5rem]">Tell us about you</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" error={errors.name?.message}>
                <input {...register("name")} autoComplete="name" aria-invalid={!!errors.name} className={inputCls} />
              </Field>
              <Field label="Firm or company" error={errors.firm?.message}>
                <input {...register("firm")} autoComplete="organization" aria-invalid={!!errors.firm} className={inputCls} />
              </Field>
            </div>
            <Field label="What you do" error={errors.partnerType?.message}>
              <select {...register("partnerType")} className={inputCls}>
                {seats.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.formLabel}
                  </option>
                ))}
              </select>
            </Field>
            {picked === "lender" && (
              <label className="-mt-1 flex min-h-11 cursor-pointer items-center gap-3 text-[0.95rem] text-white/85">
                <input type="checkbox" {...register("bankEmployee")} className="size-5 shrink-0 accent-brand" />
                I work at a bank or credit union (discount option, no fee)
              </label>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" error={errors.email?.message}>
                <input {...register("email")} type="email" autoComplete="email" aria-invalid={!!errors.email} className={inputCls} />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <input {...register("phone")} type="tel" autoComplete="tel" aria-invalid={!!errors.phone} className={inputCls} />
              </Field>
            </div>
            <div className="grid gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="partner-clients" className="text-[0.95rem] font-medium text-white/85">
                  New business clients you see per month
                </label>
                <output htmlFor="partner-clients" className="font-mono text-[0.9rem] font-medium text-white">
                  {perMonth >= 20 ? "20+" : perMonth}
                </output>
              </div>
              <input
                id="partner-clients"
                type="range"
                min={0}
                max={20}
                step={1}
                name={perMonthField.name}
                ref={perMonthField.ref}
                value={perMonth}
                onChange={(e) => perMonthField.onChange(Number(e.target.value))}
                onBlur={perMonthField.onBlur}
                aria-valuetext={perMonth >= 20 ? "20 or more" : String(perMonth)}
                className="range w-full"
                style={{ "--fill": `${(perMonth / 20) * 100}%` } as React.CSSProperties}
              />
            </div>
            <Field label="Best coffee spot or time (optional)" error={errors.coffee?.message}>
              <input {...register("coffee")} placeholder="e.g. Midtown, Tuesday mornings" className={inputCls} />
            </Field>

            {/* Spam trap: hidden from people, bots fill it in. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
              <input name="company_url" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>

            {status === "error" && (
              <p role="alert" className="rounded-sm border-l-4 border-error bg-error-soft px-4 py-3 text-[0.95rem] text-ink">
                {errorText ?? "That didn’t go through."} Email{" "}
                <a href={`mailto:${partnerContact.email}`} className="font-semibold underline">
                  {partnerContact.email}
                </a>
                {phoneDisplay ? <> or call {phoneDisplay}</> : null}.
              </p>
            )}
            <Button type="submit" size="lg" className="rounded-full hover:bg-brand-ink" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Book my coffee"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
