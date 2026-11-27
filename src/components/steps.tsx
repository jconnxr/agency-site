"use client";

// Numbered steps on a vertical line that fills as you scroll; each step lights
// up as the line reaches it. Used by /partners and /ecommerce. With reduced
// motion the line is full and every step is lit from the start.
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { FadeUp, eyebrow, useReduced } from "@/components/fx";

export type Step = { title: string; body: string; tag: string };

export function ScrollSteps({ steps, className }: { steps: Step[]; className?: string }) {
  const reduce = useReduced();
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 70%", "end 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [reached, setReached] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(Math.min(steps.length - 1, Math.floor(v * steps.length + 0.15)));
  });
  const lit = (i: number) => reduce || i <= reached;

  return (
    <ol ref={list} className={cn("relative pl-12 md:pl-14", className)}>
      <span aria-hidden className="absolute bottom-8 left-[15px] top-3 w-px bg-white/10 md:left-[19px]" />
      <motion.span
        aria-hidden
        className="absolute bottom-8 left-[15px] top-3 w-px origin-top bg-[linear-gradient(180deg,var(--color-brand-glow),rgb(111_116_255/0.7))] md:left-[19px]"
        style={{ scaleY: reduce ? 1 : fill }}
      />
      {steps.map((s, i) => (
        <li key={s.title} className="relative pb-5 last:pb-0">
          <span
            aria-hidden
            className={cn(
              "absolute -left-12 top-5 grid size-8 place-items-center rounded-full border font-mono text-[0.75rem] transition-[background-color,border-color,color,box-shadow] duration-500 md:-left-14 md:size-10",
              lit(i)
                ? "border-brand-glow bg-brand text-white shadow-[0_0_20px_color-mix(in_srgb,var(--color-brand-glow)_60%,transparent)]"
                : "border-white/15 bg-abyss text-white/50"
            )}
          >
            {i + 1}
          </span>
          <FadeUp>
            <article
              className={cn(
                "glass rounded-[22px] p-5 transition-colors duration-500 md:p-6",
                lit(i)
                  ? "bg-[color-mix(in_srgb,var(--color-panel-2)_75%,transparent)]"
                  : "bg-[color-mix(in_srgb,var(--color-panel)_45%,transparent)]"
              )}
            >
              <p className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[0.85rem] text-brand-glow">{String(i + 1).padStart(2, "0")}</span>
                <span className={cn(eyebrow, "rounded-full border border-white/10 px-2.5 py-1 text-white/55")}>{s.tag}</span>
              </p>
              <h3 className="mt-3 text-[1.3rem] leading-[1.15] md:text-[1.45rem]">{s.title}</h3>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-white/65">{s.body}</p>
            </article>
          </FadeUp>
        </li>
      ))}
    </ol>
  );
}
