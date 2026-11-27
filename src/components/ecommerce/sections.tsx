"use client";

// /ecommerce: what we do, how it works and why us. Same panels, spotlight cards
// and scroll timeline as the homepage and /partners.
import { Clapperboard, LayoutTemplate, MailCheck, Sparkles, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { backEnd, services, steps, whyUs } from "@/lib/ecommerce";
import { FadeUp, Panel, RevealHeading, Rise, SpotlightCard, Stagger, eyebrow } from "@/components/fx";
import { ScrollSteps } from "@/components/steps";

const icons = { ads: Clapperboard, pages: LayoutTemplate, email: MailCheck, ai: Sparkles };

/* ------------------------------------------------------------------ */
/* What we do                                                          */
/* ------------------------------------------------------------------ */

export function Services() {
  return (
    <Panel id="services" className="scroll-mt-24" inner="px-5 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <p className={cn(eyebrow, "text-brand-glow")}>What we do</p>
            <RevealHeading text="Ads, creative and the flows behind them." accent={3} className="mt-4 max-w-[18ch] text-[2.1rem] md:text-[2.8rem]" />
          </div>
          <p className="max-w-[44ch] text-[1.06rem] leading-relaxed text-white/65 md:self-end">
            One team makes the creative, runs the ads, builds the page they land on and the emails that follow up.
          </p>
        </div>

        <Stagger as="ul" className="mt-9 grid gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-4 lg:gap-5">
          {services.map((s, i) => {
            const Icon = icons[s.id];
            return (
              <Rise as="li" key={s.id} className={cn("min-w-0", i % 2 === 1 && "lg:translate-y-4")}>
                <SpotlightCard as="article" className="flex h-full flex-col p-5 md:p-6">
                  <p className="flex items-center justify-between">
                    <Icon aria-hidden className="size-5 text-brand-glow" />
                    <span className="font-mono text-[0.8rem] text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  </p>
                  <h3 className="mt-5 text-[1.3rem] md:text-[1.4rem]">{s.title}</h3>
                  <p className="mt-2 text-[0.96rem] leading-relaxed text-white/60">{s.body}</p>
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {s.points.map((p) => (
                      <li key={p} className="rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[0.78rem] text-white/75">
                        {p}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Rise>
            );
          })}
        </Stagger>

        {/* Fifth, smaller: back-end automation */}
        <FadeUp className="mt-4 lg:mt-8">
          <div className="flex flex-col gap-3 rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:gap-5 md:px-6">
            <span className="flex shrink-0 items-center gap-3">
              <Workflow aria-hidden className="size-5 text-brand-glow" />
              <span className="font-wide text-[1.05rem] font-bold text-white">{backEnd.title}</span>
            </span>
            <p className="text-[0.95rem] text-white/60">{backEnd.body}</p>
          </div>
        </FadeUp>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

export function HowItWorks() {
  return (
    <Panel id="how" surface="glow" className="scroll-mt-24" inner="px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className={cn(eyebrow, "text-brand-glow")}>How it works</p>
          <RevealHeading text="Audit first. Then we build." accent={2} className="mt-4 text-[2.3rem] md:text-[3.4rem]" />
          <p className="mt-5 max-w-[42ch] text-[1.06rem] leading-relaxed text-white/65">
            Nothing to commit to until you&rsquo;ve seen the audit and the plan. Then it&rsquo;s a monthly cycle: test,
            report, adjust.
          </p>
          <a
            href="#request"
            className="mt-7 inline-flex h-12 items-center rounded-full border border-white/30 px-6 font-semibold text-white transition-colors hover:bg-white hover:text-ink"
          >
            Start with the free audit
          </a>
        </div>
        <ScrollSteps steps={steps} />
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Why us                                                              */
/* ------------------------------------------------------------------ */

export function WhyUs() {
  return (
    <Panel aria-labelledby="why-title" surface="bare" inner="px-2 py-24 md:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <RevealHeading id="why-title" text="Small team. We do the work." accent={3} className="text-[2.1rem] md:text-[2.8rem]" />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((w, i) => (
            <Rise key={w.title} className={cn(i % 2 === 1 && "lg:translate-y-8")}>
              <SpotlightCard className="h-full p-6">
                <span className="font-mono text-[0.8rem] text-brand-glow">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-[1.2rem]">{w.title}</h3>
                <p className="mt-3 text-[0.96rem] text-white/60">{w.body}</p>
              </SpotlightCard>
            </Rise>
          ))}
        </Stagger>

        {/* TODO: replace with real case study once the first brands are live. */}
        <FadeUp className="mt-14 md:mt-20">
          <div className="glass flex flex-col gap-4 rounded-[24px] bg-[radial-gradient(80%_140%_at_0%_0%,color-mix(in_srgb,var(--color-brand-glow)_22%,transparent),transparent_60%)] p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className={cn(eyebrow, "text-brand-glow")}>Founding brands</p>
              <p className="mt-2 font-wide text-[1.35rem] font-bold leading-snug text-white md:text-[1.6rem]">
                Be one of our first five.
              </p>
              <p className="mt-1 max-w-[52ch] text-white/60">
                We&rsquo;re new to e-commerce, so we&rsquo;re not going to show you numbers we don&rsquo;t have. We&rsquo;ll
                show you the work, starting with your audit.
              </p>
            </div>
            <a
              href="#request"
              className="inline-flex h-12 shrink-0 items-center self-start rounded-full border border-white/30 px-6 font-semibold text-white transition-colors hover:bg-white hover:text-ink md:self-auto"
            >
              Get your audit
            </a>
          </div>
        </FadeUp>
      </div>
    </Panel>
  );
}
