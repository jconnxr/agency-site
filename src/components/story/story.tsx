"use client";

// "Watch a customer find you": a tall scroll track with a sticky stage inside.
// Scroll position picks the active step; the phone, the caption and the owner's
// side all follow it. Everything stays in the DOM so screen readers get every step.
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
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
          An animated example of a customer finding a local business on their phone, step by step, alongside
          what the business owner sees.
        </p>
      </div>

      {/* Scroll track: stage height plus roughly one screen of scrolling per step */}
      <div ref={track} className="relative" style={{ height: `calc(100svh - 4rem + ${n * 85}svh)` }}>
        <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
          <div className="mx-auto grid h-full max-w-6xl grid-rows-[1fr_auto] px-5 pb-5 pt-4 md:grid-cols-[1fr_300px_250px] md:grid-rows-1 md:items-center md:gap-12 md:px-8 md:py-10">
            {/* Captions (desktop: left column; mobile: under the phone) */}
            <ol className="relative order-2 grid min-h-[13.5rem] md:order-1 md:min-h-0">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  aria-current={i === active ? "step" : undefined}
                  className={cn(
                    "col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] md:self-center",
                    i === active ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                  )}
                >
                  <p className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-clay-glow">
                    <span>
                      {String(i + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-px w-6 bg-clay-glow/50" />
                    <span>{s.service}</span>
                  </p>
                  <h3 className="mt-2.5 text-[1.45rem] md:mt-4 md:text-[2.2rem]">{s.title}</h3>
                  <p className="mt-2 max-w-[44ch] text-[0.98rem] leading-relaxed text-white/70 md:mt-4 md:text-[1.06rem]">
                    {s.body}
                  </p>
                  {/* Owner's side, compact, on mobile */}
                  <div aria-hidden className="mt-3 md:hidden">
                    <p className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-white/45">
                      Your phone &middot; example
                    </p>
                    <OwnerRow event={s.owner} live={i === active} compact />
                  </div>
                </li>
              ))}
            </ol>

            <Phone screen={step.screen} className="order-1 min-h-0 md:order-2 md:h-[600px] md:max-h-full" />

            {/* Owner's side, desktop */}
            <aside aria-hidden className="order-3 hidden md:block">
              <div className="rounded-lg border border-night-line bg-night-2 p-4">
                <p className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.08em] text-white/45">
                  <span>Your phone</span>
                  <span>Example</span>
                </p>
                <div className="mt-3 space-y-2">
                  {steps.map((s, i) => (
                    <div
                      key={s.title}
                      className={cn(
                        "transition-[opacity,transform] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]",
                        i <= active ? "opacity-100" : "translate-y-2 opacity-0"
                      )}
                    >
                      <OwnerRow event={s.owner} live={i === active} />
                    </div>
                  ))}
                </div>
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

function Progress({ active }: { active: number }) {
  return (
    <div className="mt-4 flex gap-1.5">
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
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border px-3 py-2.5 transition-[border-color,box-shadow,background-color] duration-700",
        live
          ? "border-clay-glow/60 bg-clay-glow/[0.08] shadow-[0_0_0_4px_rgb(232_105_63/0.10),0_0_28px_-6px_rgb(232_105_63/0.55)]"
          : "border-night-line bg-white/[0.02]",
        compact && "py-2"
      )}
    >
      <span className={cn("size-2 shrink-0 rounded-full", live ? "bg-clay-glow" : "bg-white/25")} />
      <div className="min-w-0 flex-1">
        {event.kind === "count" ? (
          <p className="flex items-baseline justify-between gap-3 text-[0.88rem]">
            <span className="text-white/80">{event.label}</span>
            <CountUp to={event.to} run={live} />
          </p>
        ) : (
          <>
            <p className="flex items-center justify-between gap-3 text-[0.88rem] font-semibold text-white">
              {event.label}
              {event.stars && (
                <span className="flex shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-clay-glow text-clay-glow" />
                  ))}
                </span>
              )}
            </p>
            {!compact && <p className="mt-0.5 font-mono text-[0.68rem] text-white/50">{event.detail}</p>}
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
    const tw = gsap.to(obj, {
      v: to,
      duration: 1.6,
      ease: "power2.out",
      delay: 0.4,
      onUpdate: () => setV(Math.round(obj.v)),
    });
    setV(0);
    return () => {
      tw.kill();
      setV(to);
    };
  }, [run, to]);

  return <span className="font-mono text-[0.95rem] font-semibold tabular-nums text-white">{v}</span>;
}
