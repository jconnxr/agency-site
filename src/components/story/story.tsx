"use client";

// "Watch a customer find you": a normal-height section (no scroll pinning). The
// story moves by the arrows, the progress dashes, a sideways swipe on the phone,
// left/right keys while the section is in view, and a 5-second autoplay that runs
// while the section is on screen. Autoplay has a Pause/Play button, pauses when the
// visitor takes over, and stops at the last step.
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTOPLAY_MS, FollowHint, NextButton, PlayToggle, PrevButton, StepProgress } from "./controls";
import { Phone } from "./phone";
import { RevealHeading, useReduced } from "@/components/fx";
import { IntakeTrigger } from "@/components/intake";
import { steps, type OwnerEvent } from "./steps";

const n = steps.length;

export function Story() {
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Hydration-safe: false until mounted, so server and client markup match.
  const reduce = useReduced();
  // Mostly on screen? Drives autoplay, the arrow keys and the mobile banners.
  const [inView, setInView] = useState(false);
  // Autoplay runs until the first interaction or the last step; never with reduced motion.
  // null = never touched: autoplay on, unless reduced motion. The Pause/Play button
  // sets it explicitly; arrows, dashes, swipes and keys pause it.
  const [playChoice, setPlayChoice] = useState<boolean | null>(null);
  const playing = playChoice ?? !reduce;
  // First interaction of any kind hides the "follow along" hint.
  const [interacted, setInteracted] = useState(false);
  // Announced to screen readers only for changes the visitor makes, not autoplay.
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const autoplay = playing && inView && active < n - 1;
  useEffect(() => {
    if (!autoplay) return;
    const t = window.setTimeout(() => setActive((a) => Math.min(n - 1, a + 1)), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [autoplay, active]);

  const goTo = (i: number) => {
    const target = Math.max(0, Math.min(n - 1, i));
    setInteracted(true);
    setPlayChoice(false);
    setActive(target);
    setAnnounce(`Step ${target + 1} of ${n}: ${steps[target].title}`);
  };
  // Pause stops autoplay; Play resumes it (from step 1 if the story has finished).
  const showingPause = playing && active < n - 1;
  const togglePlay = () => {
    setInteracted(true);
    if (showingPause) {
      setPlayChoice(false);
      setAnnounce("Story paused");
    } else {
      if (active === n - 1) setActive(0);
      setPlayChoice(true);
      setAnnounce("Story playing");
    }
  };
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  // Left/right arrow keys while the section is in view
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Sideways swipe on the phone (touch). Only a clearly horizontal swipe counts,
  // and the phone allows vertical panning, so page scrolling is untouched.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
  };

  const step = steps[active];
  const progress = (
    <StepProgress
      active={active}
      onJump={goTo}
      filling={autoplay}
      fillKey={`${active}-${inView}`}
      after={<PlayToggle playing={showingPause} onToggle={togglePlay} />}
    />
  );

  return (
    <section id="story" aria-labelledby="story-title" className="relative -mt-10 scroll-mt-24 px-3 text-white sm:px-4 md:-mt-16 md:px-6">
      <div className="glass relative mx-auto max-w-[1440px] rounded-[28px] bg-[linear-gradient(180deg,rgb(17_26_43/0.94),rgb(10_17_32/0.96))] md:rounded-[32px]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 rounded-t-[inherit] bg-[radial-gradient(60%_100%_at_50%_0%,rgb(111_116_255/0.12),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5 pt-20 md:px-8 md:pt-28">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <RevealHeading id="story-title" text="Watch a customer find you." accent={1} className="text-[1.9rem] md:text-[2.8rem]" />
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-white/50">
            Example &middot; the business shown is made up
          </p>
        </div>
        <p className="sr-only">
          An example of a customer finding a local business on their phone, in {n} steps, alongside what the business
          owner sees. Use the previous and next buttons or the step list to move through it.
        </p>
      </div>

      <div
        ref={stage}
        className="mx-auto grid max-w-6xl grid-rows-[auto_auto_auto] px-5 pb-4 pt-3 md:h-[min(780px,calc(100svh-5rem))] md:min-h-[620px] md:grid-cols-[1fr_340px_272px] md:grid-rows-1 md:items-center md:gap-10 md:px-8 md:py-8 lg:gap-14"
      >
        {/* Captions. Desktop: left column. Mobile: under the phone. Every caption is
            rendered invisibly in the same cell to reserve the tallest one's height.
            On phones the phone is sized so phone + controls + caption fit on one screen. */}
        <div className="relative order-3 mt-3 md:order-1 md:mt-0 md:self-start md:pt-6">
          <div aria-hidden className="grid items-center">
            {steps.map((s, i) => (
              <div key={s.title} className="invisible col-start-1 row-start-1">
                <Caption index={i} />
              </div>
            ))}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                className="col-start-1 row-start-1"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.26, ease: [0.2, 0.8, 0.2, 1] } }}
                exit={{ opacity: 0, y: -8, transition: { duration: reduce ? 0 : 0.16, ease: "easeIn" } }}
              >
                <Caption index={active} />
              </motion.div>
            </AnimatePresence>
          </div>
          <FollowHint
            show={!interacted}
            label="Use the arrows to follow along"
            className="absolute left-0 top-full mt-7 hidden md:flex"
          />
        </div>
        <ol className="sr-only">
          {steps.map((s, i) => (
            <li key={s.title} aria-current={i === active ? "step" : undefined}>
              <h3>
                {s.service}: {s.title}
              </h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>

        <div
          className="relative order-1 h-[min(560px,calc(100svh-17rem))] min-h-[340px] touch-pan-y md:order-2 md:h-[702px] md:max-h-full"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Phone
            screen={step.screen}
            maxScale={1.17}
            className="h-full w-full"
            overlay={<MobileAlert active={active} engaged={inView} />}
            overlayTop={step.banner?.top}
            overlayInset={step.banner?.inset}
          />
          <FollowHint
            show={!interacted}
            label="Tap → or swipe to follow along"
            className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-night/85 px-2.5 py-1.5 backdrop-blur md:hidden"
          />
        </div>

        {/* Mobile controls: centered under the phone */}
        <nav aria-label="Story steps" className="order-2 mt-3 flex items-center gap-3 md:hidden">
          <PrevButton active={active} onPrev={prev} />
          <div className="flex-1">{progress}</div>
          <NextButton active={active} onNext={next} />
        </nav>

        {/* Owner's side, desktop: the five latest events, with the controls fixed
            at the bottom of the column, level with the phone's bottom edge */}
        <aside className="order-3 hidden md:flex md:h-[702px] md:max-h-full md:flex-col md:self-start">
          <div aria-hidden className="glass flex min-h-0 flex-1 flex-col rounded-[20px] bg-white/[0.03] p-3.5">
            <p className="flex items-center justify-between px-0.5 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-white/45">
              <span>Your phone</span>
              <span>Example</span>
            </p>
            <OwnerFeed active={active} />
            {/* Tally at the foot of the card */}
            <div className="mt-auto border-t border-white/10 px-0.5 pt-3">
              <p className="flex items-baseline justify-between font-mono text-[0.66rem] uppercase tracking-[0.08em] text-white/45">
                <span>Today so far</span>
                <span className="text-white/70 tabular-nums">
                  {active + 1} / {n} events
                </span>
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full origin-left rounded-full bg-clay-glow transition-transform duration-500"
                  style={{ transform: `scaleX(${(active + 1) / n})` }}
                />
              </div>
            </div>
          </div>
          <nav aria-label="Story steps" className="mt-auto pt-3">
            {progress}
            <div className="mt-2 flex items-center justify-between">
              <PrevButton active={active} onPrev={prev} />
              <NextButton active={active} onNext={next} />
            </div>
          </nav>
        </aside>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-6 md:px-8 md:pb-28">
        <div className="border-t border-night-line pt-12 md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-16 md:pt-16">
          <RevealHeading
            text="That’s the whole system. We set it up and keep it running."
            accent={1}
            className="max-w-[20ch] text-[1.9rem] md:text-[3rem]"
          />
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 md:mt-0">
            <IntakeTrigger source="Story: Book a call">
            <a
              href="#book"
              className="inline-flex h-14 items-center rounded-full bg-clay px-7 shadow-[0_10px_40px_-8px_rgb(232_105_63/0.7)] text-[1.05rem] font-semibold text-white transition-colors hover:bg-clay-glow"
            >
              Book a free 30-minute call
            </a>
            </IntakeTrigger>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

function Caption({ index }: { index: number }) {
  const s = steps[index];
  return (
    <>
      <p className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-clay-glow">
        <span>
          {String(index + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}
        </span>
        <span aria-hidden className="h-px w-6 bg-clay-glow/50" />
        <span>{s.service}</span>
      </p>
      <p className="mt-2.5 font-wide text-[1.4rem] font-extrabold leading-[1.05] tracking-[-0.02em] md:mt-4 md:text-[2.2rem]">
        {s.title}
      </p>
      <p className="mt-4 hidden max-w-[44ch] text-[1.06rem] leading-relaxed text-white/70 md:block">{s.body}</p>
      <p className="mt-1.5 text-[0.95rem] leading-snug text-white/70 md:hidden">{s.short}</p>
    </>
  );
}

// Mobile: the owner's alert drops down from just under the Dynamic Island like an
// iOS notification, 0.5s after the screen slides in. On screens where the top
// holds something important (search bar, booking title, sender, profile...) it
// dismisses itself after 2 seconds; elsewhere it stays.
const BANNER_DELAY = 500;
const BANNER_HOLD = 2000;

function MobileAlert({ active, engaged }: { active: number; engaged: boolean }) {
  const reduce = useReducedMotion();
  const step = steps[active];
  const ev = step.owner;
  const [visible, setVisible] = useState(false);
  const delay = step.banner?.delay ?? BANNER_DELAY;

  // Each time a step becomes current (while the story is on screen) the banner
  // shows again; the dismiss timer starts then, not at page load.
  useEffect(() => {
    if (!engaged) {
      setVisible(false);
      return;
    }
    setVisible(true);
    if (step.banner?.canStay) return;
    const t = window.setTimeout(() => setVisible(false), delay + BANNER_HOLD);
    return () => window.clearTimeout(t);
  }, [active, engaged, delay, step.banner?.canStay]);

  return (
    <div aria-hidden className="pointer-events-none md:hidden">
      <AnimatePresence mode="wait" initial={false}>
        {visible && (
        <motion.div
          key={active}
          className="rounded-[16px] border border-white/40 bg-white/90 p-2 text-ink shadow-[0_14px_32px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md"
          initial={reduce ? false : { opacity: 0, y: -22, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30, delay: delay / 1000 } }}
          exit={{ opacity: 0, y: -14, scale: 0.98, transition: { duration: reduce ? 0 : 0.2, ease: "easeIn" } }}
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-[7px] bg-night">
              {ev.kind === "alert" && ev.success ? (
                <Check className="size-4 text-go-glow" strokeWidth={3} />
              ) : (
                <span className="size-2 rounded-full bg-clay-glow" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center justify-between gap-2 whitespace-nowrap font-mono text-[0.56rem] uppercase tracking-[0.05em] text-muted">
                <span className="truncate">Your phone &middot; example</span>
                <span>now</span>
              </p>
              <p className="flex items-center justify-between gap-2 text-[0.8rem] font-semibold leading-tight">
                <span className="truncate">{ev.label}</span>
                {ev.kind === "count" ? (
                  <span className="font-mono text-[0.85rem] tabular-nums">{ev.to}</span>
                ) : ev.stars ? (
                  <span className="flex shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3 fill-clay text-clay" />
                    ))}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// The five most recent owner events, newest on top; older ones collapse out.
const FEED_MAX = 7;

function OwnerFeed({ active }: { active: number }) {
  const reduce = useReducedMotion();
  const shown = steps
    .map((s, i) => ({ s, i }))
    .slice(Math.max(0, active + 1 - FEED_MAX), active + 1)
    .reverse();
  return (
    <ul className="mt-3 flex flex-col">
      <AnimatePresence initial={false}>
        {shown.map(({ s, i }) => (
          <motion.li
            key={s.title}
            layout={!reduce}
            className="overflow-hidden"
            initial={reduce ? false : { opacity: 0, y: -14, scale: 0.97, height: "auto" }}
            animate={{ opacity: 1, y: 0, scale: 1, height: "auto" }}
            exit={reduce ? { opacity: 0, height: 0 } : { opacity: 0, height: 0, transition: { duration: 0.24, ease: "easeOut" } }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <div className="pb-2">
              <OwnerRow event={s.owner} live={i === active} />
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
      {/* Empty slots for events still to come, so the column never looks blank */}
      {Array.from({ length: FEED_MAX - shown.length }).map((_, i) => (
        <li key={`ghost-${i}`} className="pb-2">
          <div className="flex h-[3.25rem] items-center gap-3 rounded-md border border-dashed border-white/10 px-3">
            <span className="size-2 shrink-0 rounded-full bg-white/10" />
            <span className="h-1.5 w-[55%] rounded bg-white/[0.06]" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function OwnerRow({ event, live }: { event: OwnerEvent; live: boolean }) {
  const success = event.kind === "alert" && event.success;
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border px-3 py-2 transition-[border-color,box-shadow,background-color] duration-700",
        live
          ? "border-clay-glow/60 bg-clay-glow/[0.08] shadow-[0_0_0_4px_rgb(232_105_63/0.10),0_0_28px_-6px_rgb(232_105_63/0.55)]"
          : "border-night-line bg-white/[0.02]"
      )}
    >
      {success ? (
        <span className="grid size-4 shrink-0 place-items-center rounded-full bg-go-glow text-night">
          <Check className="size-2.5" strokeWidth={4} />
        </span>
      ) : (
        <span className={cn("size-2 shrink-0 rounded-full", live ? "bg-clay-glow" : "bg-white/25")} />
      )}
      <div className="min-w-0 flex-1">
        {event.kind === "count" ? (
          <>
            <p className="flex items-baseline justify-between gap-3 text-[0.86rem]">
              <span className="text-white/85">{event.label}</span>
              <CountUp to={event.to} run={live} />
            </p>
            {event.detail && <p className="font-mono text-[0.66rem] text-white/45">{event.detail}</p>}
          </>
        ) : (
          <>
            <p className="flex items-center justify-between gap-3 text-[0.86rem] font-semibold text-white">
              {event.label}
              {event.stars && (
                <span className="flex shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-clay-glow text-clay-glow" />
                  ))}
                </span>
              )}
            </p>
            <p className="font-mono text-[0.66rem] text-white/45">{event.detail}</p>
          </>
        )}
      </div>
    </div>
  );
}

// Counts up when its step becomes active; holds the final value afterwards.
function CountUp({ to, run }: { to: number; run: boolean }) {
  const [v, setV] = useState(to);

  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setV(to);
    const obj = { v: 0 };
    setV(0);
    const tw = gsap.to(obj, {
      v: to,
      duration: 1.6,
      ease: "power2.out",
      delay: 0.4,
      onUpdate: () => setV(Math.round(obj.v)),
    });
    return () => {
      tw.kill();
      setV(to);
    };
  }, [run, to]);

  return <span className="font-mono text-[0.92rem] font-semibold tabular-nums text-white">{v}</span>;
}
