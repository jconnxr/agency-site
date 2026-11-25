"use client";

// How it works (hub + tilted step cards) and the pinned 14-day launch timeline.
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Check, Globe, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { launchDays } from "@/lib/site";
import { cn } from "@/lib/utils";
import { FadeUp, Panel, RevealHeading, Rise, Stagger, eyebrow, useReduced } from "./fx";

const ease = [0.2, 0.8, 0.2, 1] as const;

const process = [
  { title: "Free call and Presence Check", body: "We look at your Google listing, site, reviews and competitors, plus what ChatGPT and other AI tools say about you, and tell you what's worth doing first, and what isn't.", time: "30 minutes" },
  { title: "We launch it", body: "Fixed price, fixed date. You approve everything before it's public, and Site Care is free for 3 months.", time: "14 to 30 days" },
  { title: "Grow monthly, if you want", body: "Step up to Get Found: Google + AI, Get Leads or Full Department. 3-month minimum, then month to month.", time: "Ongoing" },
];

/* ------------------------------------------------------------------ */
/* How it works: hub and spokes                                        */
/* ------------------------------------------------------------------ */

// Card centres in a 1000 x 680 box; the hub sits at (500, 270).
const HUB = { x: 500, y: 270 };
const spots = [
  { x: 175, y: 190, tilt: -5, cls: "left-[1%] top-[8%]" },
  { x: 825, y: 190, tilt: 4, cls: "right-[1%] top-[8%]" },
  { x: 500, y: 560, tilt: -2, cls: "left-1/2 top-[66%] -translate-x-1/2" },
];

export function HowItWorks() {
  const reduce = useReduced();
  return (
    <Panel id="how" surface="glow" className="scroll-mt-24" inner="px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className={cn(eyebrow, "text-clay-glow")}>Getting started</p>
          <RevealHeading
            text="From first call to customers calling you."
            accent={2}
            className="mx-auto mt-4 max-w-[18ch] text-[2.1rem] md:text-[3.2rem]"
          />
        </div>

        {/* Desktop: hub with tilted cards, joined by lines that draw in */}
        <div className="relative mx-auto mt-14 hidden h-[680px] max-w-[1000px] lg:block">
          <svg viewBox="0 0 1000 680" className="absolute inset-0 size-full" aria-hidden>
            {spots.map((p, i) => {
              const d = `M${HUB.x} ${HUB.y} C ${(HUB.x + p.x) / 2} ${HUB.y}, ${p.x} ${(HUB.y + p.y) / 2}, ${p.x} ${p.y}`;
              return (
                <g key={i}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="url(#spoke)"
                    strokeWidth="1.5"
                    initial={reduce ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.25, ease }}
                  />
                  <path d={d} fill="none" stroke="#ffb08f" strokeWidth="2" strokeLinecap="round" strokeDasharray="10 230" className="route-run" style={{ animationDelay: `${i * -1.6}s` }} />
                </g>
              );
            })}
            <defs>
              {/* userSpaceOnUse: the vertical spoke to step 03 has a zero-width bounding box,
                  which makes an objectBoundingBox gradient render nothing */}
              <linearGradient id="spoke" gradientUnits="userSpaceOnUse" x1="150" y1="150" x2="850" y2="600">
                <stop offset="0" stopColor="rgb(232 105 63 / 0.9)" />
                <stop offset="1" stopColor="rgb(111 116 255 / 0.6)" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute" style={{ left: `${HUB.x / 10}%`, top: `${(HUB.y / 680) * 100}%` }}>
            <HubTile />
          </div>

          <Stagger delay={0.5} gap={0.2}>
            {process.map((s, i) => (
              <Rise key={s.title} className={cn("absolute w-[300px]", spots[i].cls)}>
                <div style={{ transform: `rotate(${spots[i].tilt}deg)` }}>
                  <StepCard step={s} i={i} />
                </div>
              </Rise>
            ))}
          </Stagger>
        </div>

        {/* Mobile and tablet: vertical timeline */}
        <div className="mt-12 lg:hidden">
          <div className="flex justify-center">
            <HubTile static />
          </div>
          <ol className="relative mx-auto mt-10 max-w-xl pl-10">
            <motion.span
              aria-hidden
              className="absolute bottom-6 left-[13px] top-2 w-px origin-top bg-[linear-gradient(180deg,#e8693f,rgb(111_116_255/0.6))]"
              initial={reduce ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.4, ease }}
            />
            {process.map((s, i) => (
              <li key={s.title} className="relative pb-6 last:pb-0">
                <span aria-hidden className="absolute -left-10 top-5 grid size-7 place-items-center rounded-full border border-clay-glow/60 bg-abyss font-mono text-[0.7rem] text-clay-glow shadow-[0_0_16px_rgb(232_105_63/0.5)]">
                  {i + 1}
                </span>
                <FadeUp delay={i * 0.1}>
                  <StepCard step={s} i={i} />
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Panel>
  );
}

function StepCard({ step, i }: { step: (typeof process)[number]; i: number }) {
  return (
    <article className="glass rounded-[22px] bg-[rgb(16_25_44/0.7)] p-6">
      <p className="flex items-center justify-between">
        <span className="font-mono text-[0.85rem] text-clay-glow">{String(i + 1).padStart(2, "0")}</span>
        <span className={cn(eyebrow, "rounded-full border border-white/10 px-2.5 py-1 text-white/55")}>{step.time}</span>
      </p>
      <h3 className="mt-4 text-[1.35rem] leading-[1.1]">{step.title}</h3>
      <p className="mt-3 text-[0.96rem] leading-relaxed text-white/65">{step.body}</p>
    </article>
  );
}

function HubTile({ static: isStatic }: { static?: boolean }) {
  return (
    <div className={cn("relative", !isStatic && "-translate-x-1/2 -translate-y-1/2")}>
      <span aria-hidden className="absolute inset-[-40%] rounded-full bg-[radial-gradient(closest-side,rgb(232_105_63/0.55),transparent)]" />
      <div className="glass relative grid size-28 place-items-center rounded-[30px] bg-[linear-gradient(160deg,rgb(40_28_36/0.9),rgb(14_20_36/0.95))] shadow-[0_0_0_1px_rgb(232_105_63/0.35),0_0_60px_-6px_rgb(232_105_63/0.7),0_30px_60px_-20px_rgb(0_0_0/0.8)] md:size-32">
        <svg viewBox="0 0 28 28" className="size-12 md:size-14" aria-label="Axiom Media Group">
          <rect x="2" y="16" width="7" height="10" fill="rgb(255 255 255 / 0.35)" />
          <rect x="10.5" y="10" width="7" height="16" fill="rgb(255 255 255 / 0.75)" />
          <rect x="19" y="3" width="7" height="23" fill="#e8693f" />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 14-day launch: left side pins, right side swaps visuals             */
/* ------------------------------------------------------------------ */

export function LaunchTimeline() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 60%", "end 60%"] });
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(launchDays.length - 1, Math.max(0, Math.floor(v * launchDays.length))));
  });

  return (
    <Panel id="launch-days" className="scroll-mt-24" inner="px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Pinned side */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className={cn(eyebrow, "text-clay-glow")}>Launch Essentials</p>
          <RevealHeading text="Live in 14 days." accent={2} className="mt-4 text-[2.4rem] md:text-[3.6rem]" />
          <p className="mt-5 max-w-[42ch] text-[1.06rem] leading-relaxed text-white/65">
            How a build usually runs, counted from the day we get your info. If we miss the date, your next 3 months of
            Site Care are free.
          </p>

          <ol className="relative mt-10 hidden pl-6 lg:block">
            <span aria-hidden className="absolute bottom-2 left-0 top-2 w-px bg-white/10" />
            <motion.span aria-hidden className="absolute bottom-2 left-0 top-2 w-px origin-top bg-clay-glow" style={{ scaleY: bar }} />
            {launchDays.map((d, i) => (
              <li
                key={d.day}
                aria-current={i === active ? "step" : undefined}
                className={cn("py-2.5 transition-colors duration-300", i === active ? "text-white" : "text-white/35")}
              >
                <span className="font-mono text-[0.78rem] uppercase tracking-[0.1em]">Day {d.day}</span>
                <span className="ml-3 font-wide text-[1.1rem] font-bold">{d.title}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Scrolling side: one visual per day */}
        <div ref={track} className="flex flex-col gap-6 lg:gap-0">
          {launchDays.map((d, i) => (
            <div key={d.day} className="lg:flex lg:min-h-[70vh] lg:items-center">
              <DayCard d={d} i={i} active={i === active} />
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function DayCard({ d, i, active }: { d: (typeof launchDays)[number]; i: number; active: boolean }) {
  const reduce = useReduced();
  const Visual = visuals[i];
  return (
    <motion.article
      className="glass w-full rounded-[26px] bg-[rgb(14_22_40/0.6)] p-5 md:p-7"
      initial={reduce ? false : { opacity: 0.25, scale: 0.94, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ amount: 0.55 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="flex items-baseline justify-between">
        <p className="font-wide text-[2.6rem] font-extrabold leading-none text-white md:text-[3.2rem]">
          <span className="font-mono text-[0.8rem] font-normal uppercase tracking-[0.1em] text-clay-glow">Day </span>
          {d.day}
        </p>
        <span
          className={cn(
            "size-2.5 rounded-full transition-[opacity,transform] duration-500",
            active ? "scale-100 bg-clay-glow opacity-100 shadow-[0_0_12px_#e8693f]" : "scale-75 bg-white/30 opacity-60"
          )}
        />
      </div>
      <h3 className="mt-3 text-[1.45rem]">{d.title}</h3>
      <p className="mt-2 max-w-[48ch] text-white/65">{d.body}</p>
      <div className="mt-6" aria-hidden>
        <Visual />
      </div>
    </motion.article>
  );
}

const panel = "rounded-[18px] border border-white/10 bg-[rgb(8_13_25/0.7)] p-4";
const Ex = () => <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-white/40">Example</span>;

function Ticks({ items }: { items: { icon: typeof Check; label: string }[] }) {
  const reduce = useReduced();
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((it, i) => (
        <motion.li
          key={it.label}
          className="flex items-center gap-2.5 rounded-xl bg-white/[0.04] px-3 py-2.5 text-[0.85rem] text-white/80"
          initial={reduce ? false : { opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: 0.15 + i * 0.12, duration: 0.4 }}
        >
          <span className="grid size-5 place-items-center rounded-full bg-go text-white">
            <it.icon className="size-3" strokeWidth={3} />
          </span>
          {it.label}
        </motion.li>
      ))}
    </ul>
  );
}

const visuals = [
  function Kickoff() {
    return (
      <div className={panel}>
        <p className="mb-3 flex justify-between text-[0.8rem] font-semibold text-white/80">
          What we need from you <Ex />
        </p>
        <Ticks items={[{ icon: Check, label: "Logo" }, { icon: Check, label: "Photos" }, { icon: Check, label: "Services and hours" }, { icon: Check, label: "Domain in your name" }]} />
      </div>
    );
  },
  function Profile() {
    return (
      <div className={cn(panel, "flex items-center gap-4")}>
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#3b6cf6,#6f74ff)]">
          <MapPin className="size-6 text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex justify-between text-[0.95rem] font-semibold text-white">
            Your Business <Ex />
          </p>
          <p className="text-[0.8rem] text-white/50">Services · Hours · 12 photos</p>
        </div>
        <span className="shrink-0 rounded-full border border-[#f5b545]/40 bg-[#f5b545]/10 px-2.5 py-1 text-[0.7rem] font-semibold text-[#f5b545]">
          Verification sent
        </span>
      </div>
    );
  },
  function Draft() {
    return (
      <div className={cn(panel, "grid grid-cols-[7rem_1fr] gap-4")}>
        <div className="rounded-[16px] border border-white/15 bg-[#111a2b] p-2">
          <span className="block h-16 rounded-lg bg-[linear-gradient(135deg,rgb(232_105_63/0.5),rgb(111_116_255/0.3))]" />
          <span className="mt-2 block h-1.5 w-[80%] rounded bg-white/25" />
          <span className="mt-1 block h-1.5 w-[55%] rounded bg-white/10" />
          <span className="mt-2 block h-4 w-[60%] rounded-full bg-clay" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="flex justify-between text-[0.8rem] font-semibold text-white/80">
            Draft for your review <Ex />
          </p>
          <span className="flex items-start gap-2 rounded-xl bg-white/[0.05] px-3 py-2 text-[0.8rem] text-white/75">
            <MessageCircle className="mt-0.5 size-3.5 shrink-0 text-clay-glow" /> Can we swap the top photo?
          </span>
          <span className="mt-auto inline-flex items-center gap-1.5 self-start rounded-full bg-go px-3 py-1.5 text-[0.75rem] font-semibold text-white">
            <Check className="size-3" strokeWidth={3} /> Approve
          </span>
        </div>
      </div>
    );
  },
  function Live() {
    return (
      <div className={panel}>
        <p className="mb-3 flex items-center justify-between text-[0.8rem] font-semibold text-white/80">
          <span className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-go-glow opacity-60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-go-glow" />
            </span>
            yourbusiness.com is live
          </span>
          <Ex />
        </p>
        <Ticks items={[{ icon: Globe, label: "Website" }, { icon: MapPin, label: "Google profile" }, { icon: Mail, label: "you@yourbusiness.com" }, { icon: ShieldCheck, label: "Site Care, 3 months free" }]} />
      </div>
    );
  },
];
