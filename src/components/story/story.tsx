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
import { Phone } from "./phone";
import { steps, type OwnerEvent } from "./steps";

gsap.registerPlugin(ScrollTrigger);

const n = steps.length;

export function Story() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!track.current) return;
    const st = ScrollTrigger.create({
      trigger: track.current,
      start: "top 64px",
      end: "bottom bottom",
      onUpdate: (self) => {
        const i = Math.min(n - 1, Math.floor(self.progress * n));
        setActive((prev) => (prev === i ? prev : i));
      },
    });
    return () => st.kill();
  }, []);

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
          <div className="mx-auto grid h-full max-w-6xl grid-rows-[1fr_auto] px-5 pb-5 pt-4 md:grid-cols-[1fr_340px_272px] md:grid-rows-1 md:items-center md:gap-10 md:px-8 md:py-8 lg:gap-14">
            {/* Captions. Desktop: left column. Mobile: under the phone.
                Every caption is rendered invisibly in the same grid cell to reserve the
                tallest one's height; the visible one swaps with a short timed fade
                (out 160ms, then in 260ms) that always completes. */}
            <div aria-hidden className="relative order-2 mt-4 grid items-center md:order-1 md:mt-0">
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

            <div className="relative order-1 min-h-0 md:order-2 md:h-[702px] md:max-h-full">
              <Phone screen={step.screen} maxScale={1.17} className="h-full w-full" />
              <MobileAlert active={active} />
            </div>

            {/* Owner's side, desktop: a feed that grows with each step, newest on top */}
            <aside aria-hidden className="order-3 hidden md:block md:max-h-full md:self-center">
              <div className="rounded-lg border border-night-line bg-night-2 p-3.5">
                <p className="flex items-center justify-between px-0.5 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-white/45">
                  <span>Your phone</span>
                  <span>Example</span>
                </p>
                <OwnerFeed active={active} />
              </div>
              <Progress active={active} />
            </aside>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-6 md:px-8 md:pb-28">
        <div className="border-t border-night-line pt-12 md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-16 md:pt-16">
          <h2 className="max-w-[20ch] text-[1.9rem] md:text-[3rem]">
            That&rsquo;s the whole system. <span className="text-clay-glow">We set it up and keep it running.</span>
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

// Mobile: the owner's alert arrives as a notification banner over the bottom of
// the phone, after the screen has slid in, instead of taking space below it.
function MobileAlert({ active }: { active: number }) {
  const reduce = useReducedMotion();
  const ev = steps[active].owner;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center md:hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          className="w-[min(19rem,100%)] rounded-[18px] border border-white/40 bg-white/90 p-2.5 text-ink shadow-[0_18px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md"
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30, delay: 0.5 } }}
          exit={{ opacity: 0, y: 12, transition: { duration: reduce ? 0 : 0.15 } }}
        >
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-night">
              {ev.kind === "alert" && ev.success ? (
                <Check className="size-4 text-go-glow" strokeWidth={3} />
              ) : (
                <span className="size-2 rounded-full bg-clay-glow" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.06em] text-muted">
                <span>Your phone &middot; example</span>
                <span>now</span>
              </p>
              <p className="flex items-center justify-between gap-2 text-[0.85rem] font-semibold leading-tight">
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

function Progress({ active }: { active: number }) {
  return (
    <div className="mt-3 flex gap-1">
      {steps.map((s, i) => (
        <span
          key={s.title}
          className={cn("h-[3px] flex-1 transition-colors duration-500", i <= active ? "bg-clay-glow" : "bg-white/12")}
        />
      ))}
    </div>
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
