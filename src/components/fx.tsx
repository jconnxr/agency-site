"use client";

// Shared depth + motion pieces for the homepage. Animations only touch
// transform, opacity (and filter for the blur-in, which is short-lived).
import { createElement, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const ease = [0.2, 0.8, 0.2, 1] as const;

/**
 * prefers-reduced-motion, but false on the server and the first client render so
 * hydration matches; the real value arrives right after mount.
 */
export function useReduced() {
  const pref = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!pref : false;
}

/* ------------------------------------------------------------------ */
/* Backdrop                                                            */
/* ------------------------------------------------------------------ */

export function Backdrop() {
  return (
    <div aria-hidden className="home-bg">
      <div className="glow glow-rust" />
      <div className="glow glow-violet" />
      <div className="glow glow-low" />
      <div className="grid" />
      <div className="noise" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section panels                                                      */
/* ------------------------------------------------------------------ */

type Surface = "dark" | "cream" | "glow" | "bare";

const surfaces: Record<Surface, string> = {
  // Elevated navy card, a touch lighter than the page
  dark: "glass bg-[linear-gradient(180deg,rgb(17_26_43/0.92),rgb(10_17_32/0.94))] text-white",
  // The one warm "island" mid-page
  cream: "bg-cream text-ink shadow-[0_-30px_80px_-30px_rgb(0_0_0/0.6),0_40px_80px_-40px_rgb(0_0_0/0.7)]",
  // Elevated dark panel with a glowing rust/violet rim
  glow: "glow-border bg-[radial-gradient(120%_80%_at_50%_0%,rgb(232_105_63/0.10),transparent_60%),linear-gradient(180deg,#0e1729,#0a1120)] text-white shadow-[0_0_0_1px_rgb(232_105_63/0.08),0_0_80px_-20px_rgb(232_105_63/0.35),0_-30px_80px_-30px_rgb(0_0_0/0.7)]",
  bare: "text-white",
};

/**
 * A section as a rounded card inset from the viewport edge. `overlap` pulls it up
 * over the previous section so the page stacks like cards instead of stripes.
 */
export function Panel({
  surface = "dark",
  overlap = true,
  className,
  inner,
  children,
  ...rest
}: {
  surface?: Surface;
  overlap?: boolean;
  className?: string;
  inner?: string;
  children: ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  return (
    <section
      {...rest}
      className={cn("relative px-3 sm:px-4 md:px-6", overlap && "-mt-10 md:-mt-16", className)}
    >
      <div className={cn("relative mx-auto max-w-[1440px] rounded-[28px] md:rounded-[32px]", surfaces[surface], inner)}>
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Blur-in heading                                                     */
/* ------------------------------------------------------------------ */

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};

/**
 * Heading that reveals word by word (blur 12px → 0, y 20 → 0, 0.06s stagger)
 * when it scrolls into view. `accent` styles the last N words in italic serif.
 */
export function RevealHeading({
  as = "h2",
  text,
  accent = 0,
  accentClass = "text-clay-glow",
  className,
  id,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  text: string;
  accent?: number;
  accentClass?: string;
  className?: string;
  id?: string;
}) {
  const reduce = useReduced();
  const words = text.split(" ");
  const MotionTag = motion[as];
  return (
    <MotionTag
      id={id}
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ staggerChildren: 0.06 }}
    >
      {words.map((w, i) => {
        const isAccent = i >= words.length - accent;
        return (
          <span key={i}>
            <motion.span
              variants={wordVariants}
              className={cn(
                "inline-block",
                isAccent && cn("font-serif font-normal italic tracking-[-0.01em] [font-stretch:100%]", accentClass)
              )}
            >
              {w}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* Staggered fade-up                                                   */
/* ------------------------------------------------------------------ */

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/** Container: children wrapped in <Rise> fade up one after another on scroll. */
export function Stagger({
  as = "div",
  className,
  children,
  delay = 0,
  gap = 0.08,
}: {
  as?: "div" | "ul" | "ol" | "dl";
  className?: string;
  children: ReactNode;
  delay?: number;
  gap?: number;
}) {
  const reduce = useReduced();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: gap, delayChildren: delay }}
    >
      {children}
    </MotionTag>
  );
}

export function Rise({
  as = "div",
  className,
  children,
  ...rest
}: { as?: "div" | "li" | "article"; className?: string; children: ReactNode } & Record<string, unknown>) {
  const MotionTag = motion[as];
  return (
    <MotionTag variants={itemVariants} className={className} {...rest}>
      {children}
    </MotionTag>
  );
}

/** Standalone fade-up for one block. */
export function FadeUp({ className, children, delay = 0 }: { className?: string; children: ReactNode; delay?: number }) {
  const reduce = useReduced();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Glass card with a cursor-following spotlight                        */
/* ------------------------------------------------------------------ */

const SPOT = 420;

/**
 * Glass card. On hover a soft glow follows the cursor inside it. The glow is one
 * element moved with transform, so it never triggers layout or paint.
 */
export function SpotlightCard({
  as = "div",
  className,
  spot = "rgb(232 105 63 / 0.22)",
  children,
  ...rest
}: {
  as?: "div" | "article" | "li";
  className?: string;
  spot?: string;
  children: ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(-SPOT);
  const y = useMotionValue(-SPOT);
  const opacity = useSpring(0, { stiffness: 200, damping: 30 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left - SPOT / 2);
    y.set(e.clientY - r.top - SPOT / 2);
  };

  return createElement(
    as,
    {
      ...rest,
      ref,
      onPointerMove: onMove,
      onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && opacity.set(1),
      onPointerLeave: () => opacity.set(0),
      className: cn("glass group/spot relative isolate overflow-hidden rounded-[24px]", className),
    },
    <motion.span
      key="spot"
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 -z-10 rounded-full"
      style={{
        x,
        y,
        opacity,
        width: SPOT,
        height: SPOT,
        background: `radial-gradient(closest-side, ${spot}, transparent)`,
      }}
    />,
    children
  );
}

/* ------------------------------------------------------------------ */
/* Rust marquee band                                                   */
/* ------------------------------------------------------------------ */

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-wide text-[1.35rem] font-extrabold tracking-[-0.01em] md:px-9 md:text-[2rem]">{t}</span>
          <span aria-hidden className="font-serif text-[1.6rem] italic text-white/55 md:text-[2.2rem]">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("relative z-10 overflow-hidden", className)}>
      <div className="relative -mx-4 -rotate-[1.5deg] bg-[linear-gradient(90deg,#b8461f,#d65a2e_40%,#e8693f_60%,#c4502b)] py-4 text-white shadow-[0_20px_60px_-20px_rgb(196_80_43/0.7),inset_0_1px_0_rgb(255_255_255/0.25)] md:py-5">
        <p className="sr-only">Services: {items.join(", ")}</p>
        <div className="marquee-track flex w-max">
          {row(true)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}

/* Small mono label used across sections */
export const eyebrow = "font-mono text-[0.7rem] uppercase tracking-[0.1em]";
