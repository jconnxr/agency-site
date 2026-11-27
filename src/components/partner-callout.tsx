"use client";

// Homepage: one quiet band for referral partners, sitting in the open seam
// between the 14-day timeline and Promises (no card of its own behind it).
import { ArrowRight } from "lucide-react";
import { FadeUp } from "./fx";

const who = ["CPAs", "Insurance", "Lenders", "Brokers"];

export function PartnerCallout() {
  return (
    <section id="partner-band" aria-label="Referral partners" className="relative px-3 pt-24 sm:px-4 md:px-6 md:pt-32">
      <FadeUp className="mx-auto max-w-5xl">
        <a
          href="/partners/"
          className="glass group relative flex flex-col gap-5 overflow-hidden rounded-[26px] bg-[radial-gradient(70%_160%_at_0%_50%,color-mix(in_srgb,var(--color-brand-glow)_22%,transparent),transparent_65%),color-mix(in_srgb,var(--color-panel)_55%,transparent)] p-6 transition-colors hover:bg-[color-mix(in_srgb,var(--color-panel-2)_70%,transparent)] md:flex-row md:items-center md:justify-between md:gap-10 md:rounded-full md:py-5 md:pl-9 md:pr-5"
        >
          <span className="min-w-0">
            <span aria-hidden className="flex flex-wrap gap-1.5">
              {who.map((w) => (
                <span key={w} className="rounded-full border border-white/12 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/55">
                  {w}
                </span>
              ))}
            </span>
            <span className="mt-3 block font-wide text-[1.2rem] font-bold leading-snug text-white md:text-[1.35rem]">
              CPA, agent, lender or broker?{" "}
              <span className="block font-serif text-[1.15em] font-normal italic text-brand-glow [font-stretch:100%]">
                Your clients open stronger with us.
              </span>
            </span>
          </span>
          <span className="inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-white/10 px-5 font-semibold text-white transition-colors group-hover:bg-brand md:self-auto">
            See the partner program
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>
      </FadeUp>
    </section>
  );
}
