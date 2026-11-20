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
                The old caption is fully gone (200ms) before the new one starts (delay 240ms). */}
            <ol className="relative order-2 mt-4 grid md:order-1 md:mt-0">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  aria-current={i === active ? "step" : undefined}
                  className={cn(
                    "col-start-1 row-start-1 transition-[opacity,transform] ease-[cubic-bezier(.2,.8,.2,1)] md:self-center",
                    i === active
                      ? "translate-y-0 opacity-100 delay-[240ms] duration-500"
                      : cn("pointer-events-none opacity-0 delay-0 duration-200", i < active ? "-translate-y-3" : "translate-y-3")
                  )}
                >
                  <p className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-clay-glow">
                    <span>
                      {String(i + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-px w-6 bg-clay-glow/50" />
                    <span>{s.service}</span>
                  </p>
                  <h3 className="mt-2.5 text-[1.4rem] md:mt-4 md:text-[2.2rem]">{s.title}</h3>
                  <p className="mt-2 max-w-[44ch] text-[0.95rem] leading-relaxed text-white/70 md:mt-4 md:text-[1.06rem]">
                    {s.body}
                  </p>
                  <div aria-hidden className="mt-3 md:hidden">
                    <p className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-white/45">
                      Your phone &middot; example
                    </p>
                    <OwnerRow event={s.owner} live={i === active} compact />
                  </div>
                </li>
              ))}
            </ol>

            <Phone screen={step.screen} maxScale={1.17} className="order-1 min-h-0 md:order-2 md:h-[702px] md:max-h-full" />

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

function OwnerFeed({ active }: { active: number }) {
  const reduce = useReducedMotion();
  const shown = steps.slice(0, active + 1).map((s, i) => ({ s, i })).reverse();
  return (
    <ul className="mt-3 flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {shown.map(({ s, i }) => (
          <motion.li
            key={s.title}
            layout={!reduce}
            initial={reduce ? false : { opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <OwnerRow event={s.owner} live={i === active} />
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

function OwnerRow({ event, live, compact }: { event: OwnerEvent; live: boolean; compact?: boolean }) {
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
            {event.detail && !compact && <p className="font-mono text-[0.66rem] text-white/45">{event.detail}</p>}
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
            {!compact && <p className="font-mono text-[0.66rem] text-white/45">{event.detail}</p>}
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
