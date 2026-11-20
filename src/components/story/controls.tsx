"use client";

// Controls for the phone story: previous/next buttons, a clickable progress bar
// with a step counter, and a one-time "scroll to follow along" hint.
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { steps } from "./steps";

const n = steps.length;

const btn =
  "inline-grid h-11 min-w-11 place-items-center rounded-sm border border-white/20 px-3 text-white transition-colors hover:border-clay-glow hover:text-clay-glow focus-visible:border-clay-glow disabled:pointer-events-none disabled:opacity-30";

export function PrevButton({ active, onPrev }: { active: number; onPrev: () => void }) {
  return (
    <button type="button" aria-label="Previous step" onClick={onPrev} disabled={active === 0} className={btn}>
      <ArrowLeft className="size-[18px]" aria-hidden />
    </button>
  );
}

// On the last step "next" becomes the way out: book a call.
export function NextButton({ active, onNext }: { active: number; onNext: () => void }) {
  if (active === n - 1) {
    return (
      <a href="#book" className={cn(btn, "px-4 text-[0.92rem] font-semibold")}>
        Book a call
      </a>
    );
  }
  return (
    <button type="button" aria-label="Next step" onClick={onNext} className={btn}>
      <ArrowRight className="size-[18px]" aria-hidden />
    </button>
  );
}

export function StepProgress({
  active,
  onJump,
  className,
}: {
  active: number;
  onJump: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ol className="flex flex-1 items-center">
        {steps.map((s, i) => (
          <li key={s.title} className="flex-1">
            {/* Tall hit area, thin visible dash */}
            <button
              type="button"
              onClick={() => onJump(i)}
              aria-label={`Go to step ${i + 1}: ${s.title}`}
              aria-current={i === active ? "step" : undefined}
              className="group block w-full px-[2px] py-2.5"
            >
              <span
                className={cn(
                  "block h-[3px] transition-[background-color,transform] duration-300 group-hover:scale-y-[1.8]",
                  i <= active ? "bg-clay-glow" : "bg-white/15 group-hover:bg-white/45"
                )}
              />
            </button>
          </li>
        ))}
      </ol>
      <span className="shrink-0 font-mono text-[0.78rem] tabular-nums text-white/60">
        <span className="text-white">{active + 1}</span> / {n}
      </span>
    </div>
  );
}

export function ScrollHint({ show, className }: { show: boolean; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          aria-hidden
          className={cn("flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-clay-glow", className)}
          initial={false}
          exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.3 } }}
        >
          Scroll to follow along
          <ChevronDown className={cn("size-3.5", !reduce && "animate-[hint-bob_1.6s_ease-in-out_infinite]")} />
        </motion.p>
      )}
    </AnimatePresence>
  );
}
