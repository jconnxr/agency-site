"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { CalendarCheck, Check, FileText, MapPin, Star } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useReduced } from "./fx";

const HEADLINE = "We set up the online side of your business, then keep it bringing in customers.";

// Above the fold: what we do, where, and one way to book. The headline reveal is
// CSS (see .hero-word) so it plays on first paint without waiting for JavaScript.
export function Hero() {
  const words = HEADLINE.split(" ");
  return (
    <section id="top" className="relative overflow-x-clip px-3 pb-24 pt-28 sm:px-4 md:px-6 md:pb-32 md:pt-32">
      <div className="mx-auto grid max-w-[1280px] items-center gap-6 px-2 md:grid-cols-[1.05fr_1fr] md:gap-8 md:px-6 lg:gap-12">
        <div className="relative z-10">
          <p className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2.5 pr-4 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-white/70">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-clay-glow opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-clay-glow" />
            </span>
            {site.city} &middot; taking new clients
          </p>

          <h1 className="mt-7 max-w-[17ch] text-[2.3rem] leading-[1.02] text-white sm:text-[3.1rem] md:mt-8 md:text-[2.9rem] lg:text-[3.5rem] xl:text-[4rem]">
            {words.map((w, i) => {
              const last = i === words.length - 1;
              return (
                <span key={i}>
                  <span
                    className={cn(
                      "hero-word",
                      last &&
                        "pr-1 font-serif text-[1.18em] font-normal italic leading-[0.9] tracking-[-0.01em] text-clay-glow [font-stretch:100%]"
                    )}
                    style={{ animationDelay: `${0.08 + i * 0.06}s` }}
                  >
                    {w}
                  </span>
                  {last ? null : " "}
                </span>
              );
            })}
          </h1>

          <p className="mt-6 max-w-[46ch] text-[1.06rem] leading-relaxed text-white/70 md:mt-8 md:text-lg">
            Websites, Google Business Profiles, online booking, social media and ads for {site.city} businesses.
            Start with the basics on day one, add a monthly team when you&rsquo;re ready.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 md:mt-10">
            <a
              href="#book"
              className="group relative inline-flex h-14 items-center rounded-full bg-clay px-7 text-[1.05rem] font-semibold text-white shadow-[0_10px_40px_-8px_rgb(232_105_63/0.7),inset_0_1px_0_rgb(255_255_255/0.25)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-clay-glow"
            >
              Book a free 30-minute call
            </a>
            <a
              href="#packages"
              className="font-semibold text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-white"
            >
              See packages and prices
            </a>
          </div>
        </div>

        <Composition />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Right side: map → glow → phone → floating card + stat chips         */
/* ------------------------------------------------------------------ */

const stats = [
  { k: "Websites from", v: "$750", pos: "left-[-2rem] top-[9%] sm:left-[-7.5rem] lg:left-[-9rem]", depth: 26 },
  { k: "Live in", v: "14 days", pos: "right-[-2rem] top-[-3%] sm:right-[-8rem] lg:right-[-9.5rem]", depth: 14 },
  { k: "You own", v: "everything", pos: "left-[-1.8rem] bottom-[6%] sm:left-[-6.5rem] lg:left-[-8rem]", depth: 34 },
];

function useParallax(depth: number, mx: MotionValue<number>, my: MotionValue<number>) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return { x, y };
}

function Composition() {
  const reduce = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });

  // Mouse parallax: pointer position across the window, -0.5..0.5. Off for reduced motion and touch.
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  const map = useParallax(-14, mx, my);
  const glow = useParallax(-6, mx, my);
  const phone = useParallax(10, mx, my);
  const card = useParallax(28, mx, my);

  return (
    <div ref={ref} className="relative mx-auto mt-6 h-[33rem] w-full max-w-[36rem] sm:h-[38rem] md:mt-0 lg:h-[40rem]">
      {/* Map, behind everything: blurred base + crisp glowing routes */}
      <motion.div aria-hidden className="absolute inset-[-12%] [mask-image:radial-gradient(closest-side,black_55%,transparent)]" style={map}>
        <MetroMap />
      </motion.div>

      {/* Rust glow behind the phone */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(232_105_63/0.55),rgb(196_80_43/0.18)_55%,transparent)]"
        style={glow}
      />

      {/* Phone + everything pinned to its edges */}
      <div className="absolute left-1/2 top-1/2 w-[13.5rem] -translate-x-1/2 -translate-y-1/2 sm:w-[15.5rem] lg:w-[16.5rem]">
        <motion.div style={phone}>
          <HeroPhone />
        </motion.div>

        {/* The card that breaks out of the phone, larger and in front */}
        <motion.div
          aria-hidden
          style={card}
          className="absolute right-[-3.4rem] top-[56%] z-20 w-[13.5rem] sm:right-[-8.5rem] sm:w-[17rem] lg:right-[-10rem] lg:w-[18rem]"
        >
          <FloatingBooking />
        </motion.div>

        <dl className="contents">
          {stats.map((s) => (
            <StatChip key={s.k} {...s} mx={mx} my={my} />
          ))}
        </dl>
      </div>

      <p className="absolute bottom-[-1.5rem] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.64rem] uppercase tracking-[0.1em] text-white/40">
        Example notifications &middot; not real customers
      </p>
    </div>
  );
}

function StatChip({
  k,
  v,
  pos,
  depth,
  mx,
  my,
}: {
  k: string;
  v: string;
  pos: string;
  depth: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const style = useParallax(depth, mx, my);
  return (
    <motion.div
      style={style}
      className={cn(
        "glass absolute z-30 rounded-2xl bg-[rgb(14_22_38/0.55)] px-3.5 py-2.5 sm:px-4 sm:py-3",
        // Deeper chips read as closer: a touch bigger and brighter
        depth > 25 ? "scale-100" : "scale-[0.92] opacity-90",
        pos
      )}
    >
      <dt className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-white/55 sm:text-[0.64rem]">{k}</dt>
      <dd className="mt-0.5 font-wide text-[1.05rem] font-extrabold leading-tight text-white sm:text-[1.3rem]">{v}</dd>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Phone with notifications stacking in on a loop                      */
/* ------------------------------------------------------------------ */

const notes = [
  { app: "Bookings", icon: CalendarCheck, tint: "bg-clay", text: "New booking: Thu 2:00pm" },
  { app: "Google", icon: Star, tint: "bg-[#3b6cf6]", text: "New 5★ Google review" },
  { app: "Phone", icon: MapPin, tint: "bg-go", text: "Call from Google Maps" },
  { app: "Website", icon: FileText, tint: "bg-[#7b5cf0]", text: "New quote request from your website" },
];

const STEP_MS = 1500;
const HOLD_MS = 3200;

function useNotificationLoop(run: boolean, reduce: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (reduce) {
      setCount(notes.length);
      return;
    }
    if (!run) return;
    const t = window.setTimeout(
      () => setCount((c) => (c >= notes.length ? 0 : c + 1)),
      count === 0 ? 700 : count >= notes.length ? HOLD_MS : STEP_MS
    );
    return () => window.clearTimeout(t);
  }, [run, count, reduce]);
  return count;
}

function HeroPhone() {
  const reduce = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const count = useNotificationLoop(inView, reduce);
  // Newest on top
  const shown = notes.slice(0, count).reverse();

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative aspect-[290/600] w-full rounded-[2.6rem] bg-[#141c2c] p-[0.5rem] shadow-[0_50px_100px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.14),inset_0_1px_0_rgb(255_255_255/0.2)]"
    >
      <div className="relative h-full overflow-hidden rounded-[2.15rem] bg-[radial-gradient(120%_70%_at_30%_0%,#3a2030,transparent_60%),radial-gradient(90%_60%_at_90%_100%,rgb(232_105_63/0.45),transparent_70%),linear-gradient(180deg,#121a2c,#0b1120)]">
        {/* status bar + island */}
        <div className="flex items-center justify-between px-6 pt-3 text-[0.62rem] font-semibold text-white/85">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-3 rounded-[2px] border border-white/70" />
          </span>
        </div>
        <span className="absolute left-1/2 top-2 h-[1.35rem] w-[4.8rem] -translate-x-1/2 rounded-full bg-black" />

        {/* lock screen clock */}
        <div className="mt-6 text-center text-white">
          <p className="text-[0.7rem] font-medium text-white/70">Thursday</p>
          <p className="font-wide text-[3.4rem] font-bold leading-none tracking-[-0.03em] [font-stretch:100%]">9:41</p>
        </div>

        {/* notification stack */}
        <ul className="absolute inset-x-2.5 top-[42%] flex flex-col gap-1.5">
          <AnimatePresence initial={false}>
            {shown.map((n) => (
              <motion.li
                key={n.text}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: -18, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.35 } }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              >
                <Note {...n} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <span className="absolute bottom-2 left-1/2 h-1 w-[5.5rem] -translate-x-1/2 rounded-full bg-white/60" />
      </div>
    </div>
  );
}

function Note({ app, icon: Icon, tint, text }: (typeof notes)[number]) {
  return (
    <div className="flex items-center gap-2 rounded-[0.9rem] border border-white/15 bg-white/[0.14] p-2 text-white shadow-[0_8px_20px_-10px_rgb(0_0_0/0.6)] backdrop-blur-md">
      <span className={cn("grid size-6 shrink-0 place-items-center rounded-[0.45rem]", tint)}>
        <Icon className="size-3.5 text-white" strokeWidth={2.4} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex justify-between text-[0.52rem] font-semibold uppercase tracking-[0.04em] text-white/60">
          <span>{app}</span>
          <span>now</span>
        </p>
        <p className="text-[0.68rem] font-semibold leading-tight">{text}</p>
      </div>
    </div>
  );
}

function FloatingBooking() {
  return (
    <div className="rounded-[1.3rem] border border-white/60 bg-white/[0.93] p-3.5 text-ink shadow-[0_40px_80px_-20px_rgb(0_0_0/0.75),0_0_0_1px_rgb(255_255_255/0.4)] backdrop-blur-xl sm:p-4">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-[0.6rem] bg-clay text-white shadow-[0_6px_16px_-6px_rgb(196_80_43/0.9)]">
          <CalendarCheck className="size-4" strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-[0.08em] text-muted">
            <span>Booked online</span>
            <span className="rounded-full bg-ink/[0.06] px-1.5 py-0.5">Example</span>
          </p>
          <p className="text-[0.92rem] font-bold leading-tight sm:text-[1rem]">New booking: Thu 2:00pm</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1" aria-hidden>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span
            key={i}
            className={cn(
              "grid h-6 place-items-center rounded-md font-mono text-[0.58rem]",
              i === 3 ? "bg-clay font-semibold text-white" : "bg-ink/[0.05] text-muted"
            )}
          >
            {d}
          </span>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[0.75rem] font-semibold text-go">
        <span className="grid size-4 place-items-center rounded-full bg-go text-white">
          <Check className="size-2.5" strokeWidth={4} />
        </span>
        Confirmed &middot; added to your calendar
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* OKC metro map                                                       */
/* ------------------------------------------------------------------ */

// Hairline sketch of the OKC metro: main highways, the Oklahoma River and the
// lakes, with a pulse on each city in the service area and light running along
// routes out from OKC. Stylized, not to scale.
const towns = [
  { name: "Edmond", x: 158, y: 52, lx: 8, anchor: "start" },
  { name: "Yukon", x: 52, y: 150, lx: 0, ly: -10, anchor: "middle" },
  { name: "Oklahoma City", x: 146, y: 152, lx: -8, anchor: "end" },
  { name: "Midwest City", x: 222, y: 150, lx: 0, ly: -10, anchor: "middle" },
  { name: "Moore", x: 152, y: 222, lx: 8, anchor: "start" },
  { name: "Norman", x: 156, y: 272, lx: 8, anchor: "start" },
] as const;

const hub = towns[2];
const routes = towns
  .filter((t) => t !== hub)
  .map((t) => {
    // gentle arc from OKC out to each town
    const cx = (hub.x + t.x) / 2 + (t.y - hub.y) * 0.25;
    const cy = (hub.y + t.y) / 2 - (t.x - hub.x) * 0.25;
    return `M${hub.x} ${hub.y} Q${cx} ${cy} ${t.x} ${t.y}`;
  });

function MetroMap() {
  return (
    <div className="relative size-full">
      {/* Static base, softly blurred (painted once) */}
      <svg viewBox="0 0 300 300" className="absolute inset-0 size-full blur-[1.2px]">
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <g stroke="rgb(255 255 255 / 0.18)" strokeWidth="0.8">
            <path d="M100 98 c8 -9 24 -8 28 2 c4 10 -6 18 -16 17 c-10 -1 -18 -9 -12 -19z" />
            <path d="M68 146 c4 -6 13 -6 15 0 c2 6 -3 10 -9 10 c-5 0 -9 -5 -6 -10z" />
            <path d="M222 262 c10 -10 30 -6 34 4 c3 9 -10 14 -20 16 c-12 2 -22 -10 -14 -20z" />
          </g>
          <path
            d="M18 168 C 50 160, 80 176, 112 166 S 160 158, 186 170 S 226 178, 250 168"
            stroke="rgb(232 105 63 / 0.4)"
            strokeWidth="1.2"
          />
          <g stroke="rgb(255 255 255 / 0.24)" strokeWidth="0.9">
            <path d="M168 0 L160 60 L152 150 L152 230 L157 300" />
            <path d="M0 152 L120 152 L190 156 L300 158" />
            <path d="M48 300 L118 205 L126 140 L132 112 L176 92 L300 44" />
            <path d="M118 202 L230 198" />
          </g>
          <path d="M70 172 C 66 120, 96 78, 150 70 S 232 74, 252 96" stroke="rgb(255 255 255 / 0.14)" strokeWidth="0.8" strokeDasharray="3 3" />
        </g>
        {towns.map((t) => (
          <text
            key={t.name}
            x={t.x + t.lx}
            y={t.y + ("ly" in t ? t.ly : 3.5)}
            textAnchor={t.anchor}
            className="fill-white/60 font-mono"
            style={{ fontSize: 8.5, letterSpacing: "0.04em" }}
          >
            {t.name}
          </text>
        ))}
      </svg>

      {/* Live layer: routes with travelling light, pulsing pins */}
      <svg viewBox="0 0 300 300" className="absolute inset-0 size-full">
        <g fill="none" strokeLinecap="round">
          {routes.map((d, i) => (
            <g key={d}>
              <path d={d} stroke="rgb(232 105 63 / 0.22)" strokeWidth="0.8" strokeDasharray="2 3" />
              <path
                d={d}
                className="route-run"
                stroke="rgb(255 160 120 / 0.95)"
                strokeWidth="1.4"
                strokeDasharray="16 224"
                style={{ animationDelay: `${i * -0.95}s` }}
              />
            </g>
          ))}
        </g>
        {towns.map((t, i) => (
          <g key={t.name} transform={`translate(${t.x} ${t.y})`}>
            <circle r="8" className="okc-pulse" style={{ animationDelay: `${i * 0.6}s` }} fill="rgb(232 105 63 / 0.4)" />
            <circle r={t === hub ? 3.4 : 2.4} fill="#ffb08f" />
            <circle r={t === hub ? 1.4 : 1} fill="#fff" />
          </g>
        ))}
      </svg>
    </div>
  );
}
