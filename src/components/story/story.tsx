"use client";

// "Watch a customer find you": a tall scroll track with a sticky stage inside.
// Scroll position picks the active step; the phone, the caption and the owner's
// feed all follow it. Every caption stays in the DOM so screen readers get each step.
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToY } from "@/lib/scroll";
import { NextButton, PrevButton, ScrollHint, StepProgress } from "./controls";
import { Phone } from "./phone";
import { steps, type OwnerEvent } from "./steps";

gsap.registerPlugin(ScrollTrigger);

const n = steps.length;

export function Story() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // True while the stage is pinned on screen; mobile banners only run then.
  const [engaged, setEngaged] = useState(false);

  const stRef = useRef<ScrollTrigger | null>(null);
  // Step a button/key/swipe is heading to, so quick repeat presses keep counting
  // from there instead of from the step still on screen.
  const pending = useRef<number | null>(null);
  const pendingTimer = useRef<number>(0);
  // The scroll hint shows on step 1 until the visitor first reaches step 2.
  const [movedOn, setMovedOn] = useState(false);
  useEffect(() => {
    if (active > 0) setMovedOn(true);
  }, [active]);

  useEffect(() => {
    if (!track.current) return;
    const st = (stRef.current = ScrollTrigger.create({
      trigger: track.current,
      start: "top 64px",
      end: "bottom bottom",
      onToggle: (self) => setEngaged(self.isActive),
      onUpdate: (self) => {
        const i = Math.min(n - 1, Math.floor(self.progress * n));
        setActive((prev) => (prev === i ? prev : i));
        if (pending.current === i) pending.current = null;
      },
    }));
    return () => {
      st.kill();
      stRef.current = null;
    };
  }, []);

  // Scroll the page to the start of step i. Scroll stays the single source of
  // truth, so the phone, caption and feed follow exactly as if the visitor scrolled.
  const goTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const target = Math.max(0, Math.min(n - 1, i));
    pending.current = target;
    window.clearTimeout(pendingTimer.current);
    pendingTimer.current = window.setTimeout(() => (pending.current = null), 1400);
    scrollToY(st.start + (st.end - st.start) * ((target + 0.12) / n));
  };
  const from = () => pending.current ?? active;
  const next = () => goTo(from() + 1);
  const prev = () => goTo(from() - 1);

  // Wheel/trackpad: while the story is pinned, one gesture moves exactly one step.
  // The first wheel event of a gesture starts a smooth scroll to the next/previous
  // step; the rest of that gesture (trackpad momentum included) is absorbed until
  // the wheel has been quiet for a moment. At the ends (down on the last step, up
  // on the first) the wheel is left alone so nobody gets trapped in the section.
  // Runs in the capture phase so it gets the event before Lenis does.
  const live = useRef({ active: 0, engaged: false, goTo: (_: number) => {} });
  live.current = { active, engaged, goTo };
  useEffect(() => {
    const g = { locked: false, minUntil: 0, quiet: 0, last: 0, wasEngaged: false };
    const QUIET = 170; // ms of no wheel events that ends a gesture
    const MIN_LOCK = 520; // a step's scroll is ~900ms; don't take a new gesture too early
    const release = () => {
      const wait = g.minUntil - performance.now();
      if (wait > 0) g.quiet = window.setTimeout(release, wait);
      else g.locked = false;
    };
    const absorb = (e: WheelEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.clearTimeout(g.quiet);
      g.quiet = window.setTimeout(release, QUIET);
    };
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const midGesture = now - g.last < QUIET;
      g.last = now;
      const { engaged: on, active: act, goTo: jump } = live.current;
      const entering = on && !g.wasEngaged;
      g.wasEngaged = on;
      if (!on || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      const cur = pending.current ?? act;
      if (g.locked) return absorb(e);
      // A flick that carries the visitor into the story settles on the current step
      // instead of skipping ahead.
      if (entering && midGesture) {
        g.locked = true;
        g.minUntil = now + MIN_LOCK;
        jump(cur);
        return absorb(e);
      }
      const dir = e.deltaY > 0 ? 1 : -1;
      if ((dir > 0 && cur >= n - 1) || (dir < 0 && cur <= 0)) return; // let them leave
      if (Math.abs(e.deltaY) < 2) return;
      g.locked = true;
      g.minUntil = now + MIN_LOCK;
      jump(cur + dir);
      absorb(e);
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.clearTimeout(g.quiet);
    };
  }, []);

  // Left/right arrow keys while the story is pinned on screen
  useEffect(() => {
    if (!engaged) return;
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

  // Horizontal swipe on the phone (touch): next/previous step. Vertical scrolling
  // is untouched: only a clearly sideways swipe counts, and the phone allows pan-y.
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
  const reduce = useReducedMotion();

  return (
    <section id="story" aria-labelledby="story-title" className="relative bg-night text-white">
      <div className="mx-auto max-w-6xl border-t border-night-line px-5 pt-14 md:px-8 md:pt-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 id="story-title" className="text-[1.9rem] md:text-[2.8rem]">
            Watch a customer find you.
          </h2>
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-white/50">
            Example &middot; the business shown is made up
          </p>
        </div>
        <p className="sr-only">
          An animated example of a customer finding a local business on their phone, step by step, alongside what the
          business owner sees.
        </p>
      </div>

      {/* Scroll track: the stage's height plus a stretch of scrolling for each step */}
      <div
        ref={track}
        className="relative h-[calc(100svh-4rem+var(--n)*72svh)] md:h-[calc(100svh-4rem+var(--n)*80svh)]"
        style={{ "--n": n } as React.CSSProperties}
      >
        <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
          <div className="mx-auto grid h-full max-w-6xl grid-rows-[1fr_auto_auto] px-5 pb-4 pt-3 md:grid-cols-[1fr_340px_272px] md:grid-rows-1 md:items-center md:gap-10 md:px-8 md:py-8 lg:gap-14">
            {/* Captions. Desktop: left column. Mobile: under the phone.
                Every caption is rendered invisibly in the same grid cell to reserve the
                tallest one's height; the visible one swaps with a short timed fade
                (out 160ms, then in 260ms) that always completes. */}
            <div className="relative order-3 mt-2.5 md:order-1 md:mt-0 md:self-center">
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
            <ScrollHint show={!movedOn} className="absolute left-0 top-full mt-7 hidden md:flex" />
            </div>
            <p className="sr-only" aria-live="polite">
              Step {active + 1} of {n}: {step.title}
            </p>
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

            <div
              className="relative order-1 min-h-0 touch-pan-y md:order-2 md:h-[702px] md:max-h-full"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <Phone screen={step.screen} maxScale={1.17} className="h-full w-full" overlay={<MobileAlert active={active} engaged={engaged} />}
                overlayTop={step.banner?.top}
                overlayInset={step.banner?.inset} />
              <ScrollHint
                show={!movedOn}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-night/85 px-2.5 py-1.5 backdrop-blur md:hidden"
              />
            </div>

            {/* Mobile controls: centered under the phone */}
            <nav aria-label="Story steps" className="order-2 mt-2 flex items-center gap-3 md:hidden">
              <PrevButton active={active} onPrev={prev} />
              <StepProgress active={active} onJump={goTo} className="flex-1" />
              <NextButton active={active} onNext={next} />
            </nav>

            {/* Owner's side, desktop: a feed that grows with each step, newest on top */}
            <aside className="order-3 hidden md:flex md:h-[702px] md:max-h-full md:flex-col md:self-center">
              <div aria-hidden className="rounded-lg border border-night-line bg-night-2 p-3.5">
                <p className="flex items-center justify-between px-0.5 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-white/45">
                  <span>Your phone</span>
                  <span>Example</span>
                </p>
                <OwnerFeed active={active} />
              </div>
              {/* Desktop controls: fixed at the bottom of the column (level with the
                  phone's bottom edge) so they never move as the feed grows */}
              <nav aria-label="Story steps" className="mt-auto pt-3">
                <StepProgress active={active} onJump={goTo} />
                <div className="mt-2 flex items-center justify-between">
                  <PrevButton active={active} onPrev={prev} />
                  <NextButton active={active} onNext={next} />
                </div>
              </nav>
            </aside>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-6 md:px-8 md:pb-28">
        <div className="border-t border-night-line pt-12 md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-16 md:pt-16">
          <h2 className="max-w-[20ch] text-[1.9rem] md:text-[3rem]">
            That&rsquo;s the whole system. We set it up and keep it running.
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 md:mt-0">
            <a
              href="#book"
              className="inline-flex h-14 items-center rounded-sm bg-clay px-7 text-[1.05rem] font-semibold text-white transition-colors hover:bg-clay-glow"
            >
              Book a free 30-minute call
            </a>
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
const FEED_MAX = 5;

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
