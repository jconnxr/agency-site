"use client";

// "Pick your seat": the partner-type picker. ARIA tabs pattern (arrow keys,
// Home/End, automatic activation). Every panel stays mounted in the same grid
// cell, so the box is always as tall as the tallest panel and never jumps when
// you switch; inactive panels are hidden from view, focus and screen readers.
import { useId, useRef } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { feeLines, payoutNote, seats, terms, type Seat } from "@/lib/partners";
import { usd } from "@/lib/site";
import { Panel, RevealHeading, eyebrow, useReduced } from "@/components/fx";
import { usePartner } from "./state";

const ease = [0.2, 0.8, 0.2, 1] as const;

export function Seats() {
  const { type, setType } = usePartner();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  function onKey(e: React.KeyboardEvent, i: number) {
    const last = seats.length - 1;
    const to =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (to === null) return;
    e.preventDefault();
    setType(seats[to].id);
    tabs.current[to]?.focus();
  }

  return (
    <Panel id="seats" surface="glow" className="scroll-mt-24" inner="px-4 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl px-1">
          <p className={cn(eyebrow, "text-brand-glow")}>Pick your seat</p>
          <RevealHeading
            text="You're already there the day they commit."
            accent={2}
            className="mt-4 text-[2.1rem] md:text-[3.2rem]"
          />
          <p className="mt-5 max-w-[56ch] text-[1.06rem] leading-relaxed text-white/65">
            New Oklahoma City businesses, right after the lease, the LLC, the loan or the insurance policy. Pick what you
            do and see where you fit.
          </p>
        </div>

        <div role="tablist" aria-label="What you do" aria-orientation="horizontal" className="mt-10 flex flex-wrap gap-1.5 sm:gap-2 md:mt-12">
          {seats.map((s, i) => {
            const on = s.id === type;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`${base}-tab-${s.id}`}
                aria-selected={on}
                aria-controls={`${base}-panel-${s.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setType(s.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "relative isolate inline-flex h-11 items-center rounded-full border px-4 text-[0.9rem] font-semibold transition-colors sm:h-12 sm:px-5 sm:text-[0.98rem]",
                  on ? "border-transparent text-white" : "border-white/12 bg-white/[0.04] text-white/70 hover:border-white/25 hover:text-white"
                )}
              >
                {on && (
                  <motion.span
                    layoutId={`${base}-pill`}
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-brand shadow-[0_8px_30px_-8px_color-mix(in_srgb,var(--color-brand-glow)_80%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)]"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid [grid-template-areas:'stack'] md:mt-8">
          {seats.map((s) => (
            <SeatPanel key={s.id} seat={s} active={s.id === type} base={base} />
          ))}
        </div>
      </div>
    </Panel>
  );
}

function SeatPanel({ seat, active, base }: { seat: Seat; active: boolean; base: string }) {
  const reduce = useReduced();
  return (
    <motion.div
      role="tabpanel"
      id={`${base}-panel-${seat.id}`}
      aria-labelledby={`${base}-tab-${seat.id}`}
      tabIndex={active ? 0 : -1}
      inert={!active}
      className={cn("glass rounded-[26px] bg-[color-mix(in_srgb,var(--color-panel)_60%,transparent)] p-5 [grid-area:stack] md:p-8", !active && "invisible")}
      initial={false}
      animate={
        active
          ? { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: reduce ? 0 : 0.45, ease } }
          : { opacity: 0, y: reduce ? 0 : 10, filter: reduce ? "blur(0px)" : "blur(6px)", transition: { duration: reduce ? 0 : 0.2 } }
      }
    >
      <h3 className="max-w-[24ch] text-[1.7rem] md:text-[2.3rem]">{seat.headline}</h3>

      {/* Moment and hand-off stack on the left; what you get (the longest) sits beside them */}
      <div className="mt-7 grid gap-4 md:mt-9 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-5">
        <div className="grid gap-4 md:gap-5">
          <Cell n="01" label={seat.supply ? "When" : "Your moment"}>
            <p className="font-wide text-[1.15rem] font-bold leading-snug text-white">{seat.moment.title}</p>
            <p className="mt-2 text-[0.96rem] leading-relaxed text-white/60">{seat.moment.body}</p>
          </Cell>
          <Cell n="02" label={seat.supply ? "What we do" : "What you hand them"}>
            <p className="font-wide text-[1.15rem] font-bold leading-snug text-white">{seat.hand.title}</p>
            <p className="mt-2 text-[0.96rem] leading-relaxed text-white/60">{seat.hand.body}</p>
          </Cell>
        </div>
        <Cell n="03" label="What you get" glow>
          <GetList seat={seat} />
        </Cell>
      </div>
    </motion.div>
  );
}

function Cell({ n, label, glow, children }: { n: string; label: string; glow?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[20px] border p-5",
        glow ? "border-brand-glow/30 bg-[radial-gradient(120%_90%_at_0%_0%,color-mix(in_srgb,var(--color-brand-glow)_14%,transparent),transparent_60%)]" : "border-white/[0.08] bg-white/[0.03]"
      )}
    >
      <p className="flex items-center gap-3">
        <span className="font-mono text-[0.8rem] text-brand-glow">{n}</span>
        <span className={cn(eyebrow, "text-white/50")}>{label}</span>
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function GetList({ seat }: { seat: Seat }) {
  const { bank, setBank } = usePartner();
  const discountOnly = seat.bankSwitch && bank;
  return (
    <>
      <ul className="grid gap-2 text-[0.96rem]">
        {seat.get.map((g) => (
          <li key={g} className="flex gap-2.5 text-white/85">
            <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand-glow" />
            {g}
          </li>
        ))}
      </ul>

      {!seat.supply && (
        <div className="mt-5 border-t border-white/10 pt-4">
          {discountOnly ? (
            <p className="text-[0.95rem] leading-relaxed text-white/85">
              <span className="font-semibold text-white">Your client gets {usd(terms.clientDiscount)} off</span> any Launch
              package. No fee to you, so it fits bank policy.
            </p>
          ) : (
            <>
              <dl className="grid gap-1.5 text-[0.93rem]">
                {feeLines.map((f) => (
                  <div key={f.k} className="flex flex-wrap justify-between gap-x-3">
                    <dt className="text-white/60">{f.k}</dt>
                    <dd className="font-mono font-medium text-white">{f.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[0.88rem] text-white/55">
                Or pass {usd(terms.clientDiscount)} off any Launch package to your client instead. {payoutNote}
              </p>
            </>
          )}

          {seat.bankSwitch && (
            <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 rounded-xl bg-white/[0.05] px-3.5 py-2 text-[0.93rem] font-medium text-white/85">
              <input
                type="checkbox"
                checked={bank}
                onChange={(e) => setBank(e.target.checked)}
                className="size-5 shrink-0 accent-brand"
              />
              I work at a bank or credit union
            </label>
          )}
        </div>
      )}
    </>
  );
}
