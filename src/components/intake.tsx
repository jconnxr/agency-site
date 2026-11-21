"use client";

// Multi-step intake modal. Every package button and "Book a call" CTA opens it
// (via <IntakeTrigger>), with the clicked package's services pre-checked.
// Submits to POST /api/intake; the confirmation links to the Calendly section.
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import { useForm, type FieldPath } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Loader2, X } from "lucide-react";
import {
  budgets,
  intakeServices,
  intakeSteps,
  packageServices,
  timelines,
  type IntakeInput,
  type IntakeService,
} from "@/lib/intake";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Context + trigger                                                   */
/* ------------------------------------------------------------------ */

type Ctx = { open: (source: string) => void };
const IntakeContext = createContext<Ctx | null>(null);

export function useIntake() {
  const ctx = useContext(IntakeContext);
  if (!ctx) throw new Error("useIntake must be used inside <IntakeProvider>");
  return ctx;
}

/**
 * Wraps a link or button so it opens the intake modal. Keep href="#book" on links:
 * without JavaScript they still go to the booking section.
 */
export function IntakeTrigger({
  source,
  children,
  onOpen,
  ...rest
}: {
  source: string;
  children: React.ReactElement;
  onOpen?: () => void;
} & React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }) {
  const { open } = useIntake();
  // ...rest carries className/ref when a <Button asChild> wraps this trigger
  return (
    <Slot
      {...rest}
      aria-haspopup="dialog"
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        rest.onClick?.(e);
        e.preventDefault();
        onOpen?.();
        open(source);
      }}
    >
      {children}
    </Slot>
  );
}

/* ------------------------------------------------------------------ */
/* Lenis helpers (smooth scroll is paused while the modal is open)     */
/* ------------------------------------------------------------------ */

type LenisLike = { stop: () => void; start: () => void; scrollTo: (t: string | HTMLElement, o?: object) => void };
const lenis = () => (typeof window === "undefined" ? undefined : (window as unknown as { __lenis?: LenisLike }).__lenis);

function scrollToBooking() {
  const el = document.getElementById("book");
  if (!el) return;
  const l = lenis();
  if (l) l.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
  // Move focus to the section for keyboard and screen-reader users
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

/* ------------------------------------------------------------------ */
/* Provider + modal                                                    */
/* ------------------------------------------------------------------ */

const STEPS = ["Services", "Your business", "Timeline", "Contact"] as const;

const defaults: IntakeInput = {
  services: [],
  business: "",
  industry: "",
  city: site.city,
  website: "",
  timeline: undefined as unknown as IntakeInput["timeline"],
  budget: undefined as unknown as IntakeInput["budget"],
  name: "",
  email: "",
  phone: "",
  source: "",
  company_url: "",
};

export function IntakeProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const goingToBook = useRef(false);

  const form = useForm<IntakeInput>({ defaultValues: defaults, shouldFocusError: false });
  const { register, setValue, getValues, setError, clearErrors, reset, watch, formState } = form;

  const open = useCallback(
    (source: string) => {
      // A fresh start after a finished submission; otherwise keep what they typed.
      if (status === "sent") reset(defaults);
      setValue("services", packageServices[source] ?? []);
      setValue("source", source);
      clearErrors();
      setStatus("idle");
      setDir(1);
      setStep(0);
      setIsOpen(true);
    },
    [status, reset, setValue, clearErrors]
  );

  // Pause page smooth-scroll while the modal is open
  useEffect(() => {
    const l = lenis();
    if (!l) return;
    if (isOpen) l.stop();
    else l.start();
  }, [isOpen]);

  const headingRef = useRef<HTMLHeadingElement>(null);
  // After each step change, move focus to the step heading so it's announced
  useEffect(() => {
    if (isOpen) headingRef.current?.focus({ preventScroll: true });
  }, [step, status, isOpen]);

  function validate(i: number) {
    const schema = intakeSteps[i];
    const fields = Object.keys(schema.shape) as FieldPath<IntakeInput>[];
    clearErrors(fields);
    const r = schema.safeParse(getValues());
    if (r.success) return true;
    let first: string | null = null;
    for (const issue of r.error.issues) {
      const key = String(issue.path[0]) as FieldPath<IntakeInput>;
      if (!first) first = key;
      setError(key, { message: issue.message });
    }
    // Focus the first problem (text inputs by name, chip groups by their first input)
    if (first) {
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>(`[data-intake] [name="${first}"]`);
        el?.focus();
      });
    }
    return false;
  }

  async function next(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate(step)) return;
    if (step < STEPS.length - 1) {
      setDir(1);
      setStep(step + 1);
      return;
    }
    setStatus("sending");
    setErrorText("");
    try {
      const res = await fetch("/api/intake/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(getValues()),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "send failed");
      setStatus("sent");
    } catch (err) {
      setErrorText(err instanceof Error && err.message !== "send failed" ? err.message : "");
      setStatus("error");
    }
  }

  function back() {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  }

  const ctx = useMemo(() => ({ open }), [open]);
  const errors = formState.errors;
  const progress = status === "sent" ? 1 : (step + 1) / STEPS.length;
  const name = watch("name");

  return (
    <IntakeContext.Provider value={ctx}>
      {children}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <AnimatePresence>
          {isOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-[60] bg-abyss/70 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content
                asChild
                forceMount
                aria-describedby={undefined}
                onOpenAutoFocus={(e) => {
                  // Start on the step heading (announced) rather than the close button
                  e.preventDefault();
                  requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
                }}
                onCloseAutoFocus={(e) => {
                  if (goingToBook.current) {
                    e.preventDefault();
                    goingToBook.current = false;
                    scrollToBooking();
                  }
                }}
              >
                <motion.div
                  data-intake
                  data-lenis-prevent
                  className="glass fixed inset-x-2 bottom-2 z-[61] flex max-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,rgb(18_27_46/0.97),rgb(10_16_30/0.98))] text-white shadow-[0_0_0_1px_rgb(232_105_63/0.12),0_0_80px_-20px_rgb(232_105_63/0.4),0_40px_120px_-30px_rgb(0_0_0/0.9)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[min(720px,calc(100svh-3rem))] sm:w-[min(600px,calc(100vw-3rem))] sm:-translate-x-1/2 sm:-translate-y-1/2"
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                >
                  {/* Header + progress */}
                  <div className="shrink-0 px-5 pt-5 md:px-7 md:pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <Dialog.Title className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-white/55">
                        {status === "sent" ? "All set" : `Step ${step + 1} of ${STEPS.length} · ${STEPS[step]}`}
                      </Dialog.Title>
                      <Dialog.Close
                        className="grid size-10 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Close"
                      >
                        <X className="size-5" />
                      </Dialog.Close>
                    </div>
                    <div
                      role="progressbar"
                      aria-label="Form progress"
                      aria-valuemin={0}
                      aria-valuemax={STEPS.length}
                      aria-valuenow={status === "sent" ? STEPS.length : step + 1}
                      className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"
                    >
                      <motion.div
                        className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#c4502b,#e8693f,#ffb08f)]"
                        animate={{ scaleX: progress }}
                        initial={false}
                        transition={{ type: "spring", stiffness: 200, damping: 30 }}
                      />
                    </div>
                  </div>

                  {status === "sent" ? (
                    <Confirmation
                      headingRef={headingRef}
                      name={name}
                      onBook={() => {
                        goingToBook.current = true;
                        setIsOpen(false);
                      }}
                    />
                  ) : (
                    <form onSubmit={next} noValidate className="flex min-h-0 flex-1 flex-col">
                      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 pb-2 pt-6 md:px-7">
                        <AnimatePresence mode="wait" initial={false} custom={dir}>
                          <motion.div
                            key={step}
                            custom={dir}
                            initial={{ opacity: 0, x: dir * 32 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: dir * -32 }}
                            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                          >
                            {step === 0 && (
                              <>
                                <StepHeading ref={headingRef} title="Which services are you interested in?" sub="Pick as many as you like. You can change this on the call." />
                                <ChipGroup
                                  legend="Services"
                                  name="services"
                                  type="checkbox"
                                  options={intakeServices}
                                  register={register}
                                  error={errors.services?.message}
                                />
                              </>
                            )}
                            {step === 1 && (
                              <>
                                <StepHeading ref={headingRef} title="Tell us about your business" />
                                <div className="mt-6 grid gap-4">
                                  <Field label="Business name" error={errors.business?.message}>
                                    <input {...register("business")} autoComplete="organization" className={inputCls(!!errors.business)} />
                                  </Field>
                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Industry" error={errors.industry?.message}>
                                      <input {...register("industry")} placeholder="e.g. roofing, salon" list="intake-industries" className={inputCls(!!errors.industry)} />
                                      <datalist id="intake-industries">
                                        {["Roofing", "HVAC", "Plumbing", "Landscaping", "Salon or barbershop", "Restaurant", "Auto repair", "Cleaning", "Fitness", "Real estate"].map((i) => (
                                          <option key={i} value={i} />
                                        ))}
                                      </datalist>
                                    </Field>
                                    <Field label="City" error={errors.city?.message}>
                                      <input {...register("city")} autoComplete="address-level2" list="intake-cities" className={inputCls(!!errors.city)} />
                                      <datalist id="intake-cities">
                                        {site.serviceArea.map((c) => (
                                          <option key={c} value={c} />
                                        ))}
                                      </datalist>
                                    </Field>
                                  </div>
                                  <Field label="Current website" hint="Optional" error={errors.website?.message}>
                                    <input {...register("website")} inputMode="url" autoComplete="url" placeholder="yourbusiness.com" className={inputCls(!!errors.website)} />
                                  </Field>
                                </div>
                              </>
                            )}
                            {step === 2 && (
                              <>
                                <StepHeading ref={headingRef} title="Timeline and budget" sub="A rough idea is fine. It helps us suggest the right starting point." />
                                <ChipGroup legend="When do you want to get started?" name="timeline" type="radio" options={timelines} register={register} error={errors.timeline?.message} />
                                <ChipGroup legend="Budget range" name="budget" type="radio" options={budgets} register={register} error={errors.budget?.message} />
                              </>
                            )}
                            {step === 3 && (
                              <>
                                <StepHeading ref={headingRef} title="How do we reach you?" sub="We reply within one business day." />
                                <div className="mt-6 grid gap-4">
                                  <Field label="Your name" error={errors.name?.message}>
                                    <input {...register("name")} autoComplete="name" className={inputCls(!!errors.name)} />
                                  </Field>
                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Email" error={errors.email?.message}>
                                      <input {...register("email")} type="email" autoComplete="email" className={inputCls(!!errors.email)} />
                                    </Field>
                                    <Field label="Phone" error={errors.phone?.message}>
                                      <input {...register("phone")} type="tel" autoComplete="tel" className={inputCls(!!errors.phone)} />
                                    </Field>
                                  </div>
                                  {/* Spam trap */}
                                  <div aria-hidden="true" className="absolute -left-[9999px]">
                                    <input {...register("company_url")} tabIndex={-1} autoComplete="off" />
                                  </div>
                                </div>
                                {status === "error" && (
                                  <p role="alert" className="mt-5 rounded-xl border border-clay-glow/40 bg-clay/15 px-4 py-3 text-[0.92rem] text-white/90">
                                    {errorText || "Your answers didn’t send."} Try again, or{" "}
                                    <button
                                      type="button"
                                      className="font-semibold underline underline-offset-4"
                                      onClick={() => {
                                        goingToBook.current = true;
                                        setIsOpen(false);
                                      }}
                                    >
                                      pick a call time instead
                                    </button>
                                    .
                                  </p>
                                )}
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Footer: back / next */}
                      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 px-5 py-4 md:px-7">
                        {step > 0 ? (
                          <button
                            type="button"
                            onClick={back}
                            className="inline-flex h-12 items-center gap-2 rounded-full px-4 font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <ArrowLeft className="size-4" /> Back
                          </button>
                        ) : (
                          <span />
                        )}
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="inline-flex h-12 items-center gap-2 rounded-full bg-clay px-6 font-semibold text-white shadow-[0_10px_30px_-8px_rgb(232_105_63/0.7)] transition-colors hover:bg-clay-glow disabled:opacity-60"
                        >
                          {step < STEPS.length - 1 ? (
                            <>
                              Next <ArrowRight className="size-4" />
                            </>
                          ) : status === "sending" ? (
                            <>
                              <Loader2 className="size-4 animate-spin" /> Sending…
                            </>
                          ) : (
                            <>Send</>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </IntakeContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function StepHeading({ title, sub, ref }: { title: string; sub?: string; ref: React.Ref<HTMLHeadingElement> }) {
  return (
    <div>
      <h2 ref={ref} tabIndex={-1} className="text-[1.55rem] leading-[1.1] outline-none md:text-[1.9rem]">
        {title}
      </h2>
      {sub && <p className="mt-2 text-[0.98rem] text-white/60">{sub}</p>}
    </div>
  );
}

function Confirmation({
  headingRef,
  name,
  onBook,
}: {
  headingRef: React.Ref<HTMLHeadingElement>;
  name: string;
  onBook: () => void;
}) {
  const first = name.trim().split(/\s+/)[0];
  return (
    <div className="flex flex-col items-start gap-4 px-5 pb-7 pt-8 md:px-7 md:pb-9" role="status">
      <span className="grid size-14 place-items-center rounded-2xl bg-go/20 shadow-[0_0_40px_-6px_rgb(76_195_138/0.6)]">
        <Check className="size-7 text-go-glow" strokeWidth={3} />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="text-[1.7rem] leading-[1.1] outline-none md:text-[2.1rem]">
        Thanks{first ? `, ${first}` : ""}. We&rsquo;ve got your answers.
      </h2>
      <p className="max-w-[46ch] text-white/65">
        We&rsquo;ll look them over and reply within one business day. Want to skip the back-and-forth? Pick a time for
        your free 30-minute call now.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBook}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-clay px-6 font-semibold text-white shadow-[0_10px_30px_-8px_rgb(232_105_63/0.7)] transition-colors hover:bg-clay-glow"
        >
          <CalendarDays className="size-4" /> Book your call
        </button>
        <Dialog.Close className="inline-flex h-12 items-center rounded-full px-4 font-semibold text-white/70 hover:bg-white/10 hover:text-white">
          Close
        </Dialog.Close>
      </div>
    </div>
  );
}

const inputCls = (bad: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-white/[0.05] px-4 text-white placeholder:text-white/35 transition-colors focus:bg-white/[0.08] focus:outline-none",
    bad ? "border-clay-glow/70" : "border-white/12 focus:border-clay-glow"
  );

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-[0.92rem] font-medium text-white/85">
      <span className="flex items-baseline justify-between">
        {label}
        {hint && <span className="text-[0.8rem] font-normal text-white/40">{hint}</span>}
      </span>
      {children}
      {error && <span className="text-[0.85rem] font-normal text-clay-glow">{error}</span>}
    </label>
  );
}

// Chips are real checkboxes/radios (visually restyled), so arrow keys, space and
// screen readers work as usual.
function ChipGroup({
  legend,
  name,
  type,
  options,
  register,
  error,
}: {
  legend: string;
  name: "services" | "timeline" | "budget";
  type: "checkbox" | "radio";
  options: readonly string[];
  register: ReturnType<typeof useForm<IntakeInput>>["register"];
  error?: string;
}) {
  const id = useId();
  return (
    <fieldset className="mt-6" aria-describedby={error ? `${id}-err` : undefined}>
      <legend className={cn("mb-3 text-[0.92rem] font-medium text-white/85", name === "services" && "sr-only")}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="relative">
            <input type={type} value={o} {...register(name)} className="peer sr-only" />
            <span className="flex h-11 cursor-pointer select-none items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 text-[0.95rem] text-white/80 transition-[background-color,border-color,color] hover:border-white/30 hover:text-white peer-checked:border-clay-glow peer-checked:bg-clay/25 peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay-glow [&>svg]:hidden peer-checked:[&>svg]:block">
              <Check className="size-3.5 text-clay-glow" strokeWidth={3} />
              {o}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-3 text-[0.85rem] text-clay-glow">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export type { IntakeService };
