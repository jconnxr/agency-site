"use client";

// Partner-first hero. The headline reveal is CSS (.hero-word) like the homepage,
// so it plays on first paint. The checklist on the right is an illustration of
// the co-branded New Business Checklist and says "Example".
import { useEffect, useState } from "react";
import { ArrowRight, Check, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { withRef } from "@/lib/ref";
import { usePartner } from "./state";

const HEADLINE = "Your clients open stronger.";

export const ownerHref = "/?interest=launch-plan#book";

export function PartnerHero() {
  const { ref, refName } = usePartner();
  const words = HEADLINE.split(" ");
  const [ownerLink, setOwnerLink] = useState(ownerHref);
  useEffect(() => setOwnerLink(withRef(ownerHref, ref)), [ref]);

  return (
    <section id="top" className="relative overflow-x-clip px-3 pb-24 pt-28 sm:px-4 md:px-6 md:pb-32 md:pt-36">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-2 md:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="relative z-10">
          {/* One line, never wraps, so swapping in the welcome can't shift the layout */}
          <p className="glass inline-flex max-w-full items-center gap-2.5 rounded-full py-1.5 pl-2.5 pr-4 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-white/70">
            <span className="relative flex size-2 shrink-0" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-glow opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-glow" />
            </span>
            <span className="truncate" role={ref ? "status" : undefined}>
              {ref ? (refName ? `Welcome! ${refName} sent you` : "Welcome! You were sent by a partner") : "Referral partners · Oklahoma City"}
            </span>
          </p>

          <h1 className="mt-7 max-w-[13ch] text-[2.7rem] leading-[1.02] text-white sm:text-[3.4rem] md:mt-8 md:text-[4rem] xl:text-[4.6rem]">
            {words.map((w, i) => {
              const last = i === words.length - 1;
              return (
                <span key={i}>
                  <span
                    className={cn(
                      "hero-word",
                      last &&
                        "pr-1 font-serif text-[1.18em] font-normal italic leading-[0.9] tracking-[-0.01em] text-brand-glow [font-stretch:100%]"
                    )}
                    style={{ animationDelay: `${0.08 + i * 0.07}s` }}
                  >
                    {w}
                  </span>
                  {last ? null : " "}
                </span>
              );
            })}
          </h1>

          <p className="mt-6 max-w-[46ch] text-[1.06rem] leading-relaxed text-white/70 md:mt-8 md:text-lg">
            We get the new businesses you work with online and found on Google before opening day. You look like the
            advisor who thought of everything.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 md:mt-10">
            <a
              href="#apply"
              className="inline-flex h-14 items-center rounded-full bg-brand px-7 text-[1.05rem] font-semibold text-white shadow-[0_10px_40px_-8px_color-mix(in_srgb,var(--color-brand-glow)_70%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-brand-ink"
            >
              Book a 20-min coffee
            </a>
            <a
              href="#how"
              className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-white"
            >
              See how it works
            </a>
          </div>

          <a
            href={ownerLink}
            className="group mt-8 inline-flex min-h-11 items-center gap-1.5 text-[0.95rem] text-white/55 transition-colors hover:text-white"
          >
            Opening a business? Get your free Launch Plan
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <Checklist />
      </div>
    </section>
  );
}

const moments = ["Lease signed", "LLC formed", "Loan closed", "Policy bound"];

function Checklist() {
  return (
    <div aria-hidden className="relative mx-auto mb-16 w-full max-w-[26rem] sm:mb-0 lg:mr-0">
      <span className="absolute left-1/2 top-1/2 size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-brand-glow)_45%,transparent),color-mix(in_srgb,var(--color-brand)_12%,transparent)_55%,transparent)]" />

      <div className="glass relative rotate-[-2deg] rounded-[26px] bg-[color-mix(in_srgb,var(--color-panel)_72%,transparent)] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-white/50">
            Your firm &times; <AmgMark className="size-3.5" /> Axiom
          </p>
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-white/40">Example</span>
        </div>
        <p className="mt-2 font-wide text-[1.35rem] font-extrabold leading-tight text-white">New Business Checklist</p>

        <ul className="mt-5 grid gap-2">
          {moments.map((m, i) => (
            <li
              key={m}
              className="partner-tick flex items-center gap-3 rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-[0.95rem] text-white/80"
              style={{ animationDelay: `${0.5 + i * 0.25}s` }}
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-go text-white">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {m}
            </li>
          ))}
          <li
            className="partner-tick flex items-center gap-3 rounded-xl border border-brand-glow/50 bg-brand/15 px-3.5 py-3 text-[0.98rem] font-semibold text-white shadow-[0_0_30px_-8px_color-mix(in_srgb,var(--color-brand-glow)_70%,transparent)]"
            style={{ animationDelay: "1.6s" }}
          >
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-white">
              <Sparkles className="size-3" strokeWidth={2.5} />
            </span>
            Found on Google before opening day
          </li>
        </ul>
      </div>

      {/* Breaks out of the card, like the homepage booking card */}
      <div className="glass partner-tick absolute -bottom-[4.25rem] right-[-0.25rem] sm:-bottom-7 w-[13.5rem] rotate-[3deg] rounded-2xl bg-[color-mix(in_srgb,var(--color-panel)_85%,transparent)] p-3.5 sm:right-[-2rem]" style={{ animationDelay: "2s" }}>
        <p className="flex items-center gap-2 text-[0.85rem] font-semibold text-white">
          <span className="grid size-6 place-items-center rounded-lg bg-[linear-gradient(135deg,var(--color-brand),var(--color-violet-glow))]">
            <MapPin className="size-3.5 text-white" />
          </span>
          Your client&rsquo;s new shop
        </p>
        <p className="mt-1.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-go-glow">On Google &middot; opening Saturday</p>
      </div>
    </div>
  );
}

/** The AMG "A" from the header logo (public/brand/AMG-header-white.svg), for small co-branded spots. */
function AmgMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 113.2 113.2" aria-hidden className={className}>
      <path d="M56.6 8 L105.2 105.2 L82.25 105.2 L56.6 51.2 L30.95 105.2 L8 105.2 Z" fill="#fff" />
      <circle cx="56.6" cy="89" r="9.45" fill="var(--color-brand-glow)" />
    </svg>
  );
}
