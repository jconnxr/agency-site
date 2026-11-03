"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, ChevronRight, Clock, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow, sectionTitle } from "@/components/sections";
import { addons, automate, founding, launch, plans, type Option } from "@/lib/site";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// Five packages in the order clients move through them:
// Launch (one-time) → the three monthly plans → Automate whenever busywork piles up.
export function Packages() {
  return (
    <section id="packages" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <div className="max-w-[62ch]">
        <Eyebrow n="03">Packages</Eyebrow>
        <h2 data-reveal className={sectionTitle}>
          Five packages. Each one solves one problem.
        </h2>
        <p data-reveal className="mt-5 text-lg text-muted">
          Pick the one that matches where you are. Monthly plans stack, so each includes everything in the one before it.
        </p>
      </div>

      <Path />
      <Founding />

      <div id="launch" className="mt-20 scroll-mt-24">
        <GroupHeader label="One-time project" title={launch.name} problem={launch.problem} bestFor={launch.bestFor} />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {launch.options.map((o, i) => (
            <OptionCard key={o.name} option={o} dark={i === 1} badge={i === 1 ? "Payment plan available" : undefined} />
          ))}
        </div>
        <div data-reveal className="mt-5 grid gap-3 text-[0.98rem] md:grid-cols-2">
          <p className="flex gap-3 rounded-md bg-sky/60 px-5 py-4 text-ink">
            <Check className="mt-1 size-4 shrink-0 text-flag" strokeWidth={3} aria-hidden />
            {launch.note}
          </p>
          <p className="flex gap-3 rounded-md bg-wheat-soft px-5 py-4 text-ink">
            <Gift className="mt-0.5 size-5 shrink-0 text-[#a36f12]" aria-hidden />
            <span>
              <span className="font-semibold">Launch + Get Found bundle.</span> {launch.bundle}
            </span>
          </p>
        </div>
      </div>

      <Monthly />

      <div id="automate" data-reveal className="mt-24 scroll-mt-24 rounded-lg bg-sky/60 p-6 md:p-10">
        <GroupHeader label="One-time project" title={automate.name} problem={automate.problem} bestFor={automate.bestFor} />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {automate.options.map((o) => (
            <OptionCard key={o.name} option={o} />
          ))}
        </div>
        <p className="mt-5 text-[0.98rem] text-muted">{automate.note}</p>
      </div>

      <AlaCarte />
    </section>
  );
}

function Path() {
  const steps = [
    { label: "Launch", href: "#launch" },
    { label: "Get Found", href: "#monthly" },
    { label: "Get Leads", href: "#monthly" },
    { label: "Full Department", href: "#monthly" },
  ];
  return (
    <div data-reveal className="mt-10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">The path most clients take</p>
      <ol className="mt-3 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2">
            <a
              href={s.href}
              className={cn(
                "rounded-full px-4 py-2 font-display text-[0.95rem] font-bold transition-colors",
                i === 0 ? "bg-wheat text-ink hover:bg-[#d4972b]" : "border border-line bg-white text-ink hover:border-flag hover:text-flag"
              )}
            >
              {s.label}
            </a>
            {i < steps.length - 1 && <ChevronRight className="size-4 text-muted" aria-hidden />}
          </li>
        ))}
        <li className="flex items-center gap-2 text-[0.95rem] text-muted sm:ml-3">
          <span aria-hidden className="font-bold text-flag">+</span>
          <a href="#automate" className="font-semibold text-flag underline underline-offset-4 hover:text-flag-dark">
            Automate
          </a>
          whenever busywork piles up
        </li>
      </ol>
    </div>
  );
}

function Founding() {
  return (
    <div
      data-reveal
      className="mt-10 flex flex-col gap-4 rounded-lg border border-wheat bg-wheat-soft/60 p-6 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-wheat text-ink">
          <Sparkles className="size-5" aria-hidden />
        </span>
        <p className="text-ink">
          <span className="block font-display text-lg font-bold">Founding client offer</span>
          <span className="text-[0.98rem] text-ink/80">{founding.body}</span>
        </p>
      </div>
      <Button asChild variant="solid" className="shrink-0 self-start md:self-auto">
        <a href="#book">Ask about a founding spot</a>
      </Button>
    </div>
  );
}

function GroupHeader({ label, title, problem, bestFor }: { label: string; title: string; problem: string; bestFor: string }) {
  return (
    <div data-reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-flag">{label}</p>
        <h3 className="mt-1 text-4xl font-extrabold">{title}</h3>
      </div>
      <div className="md:max-w-[46ch] md:text-right">
        <p className="font-display text-lg italic text-ink">&ldquo;{problem}&rdquo;</p>
        <p className="text-[0.95rem] text-muted">Best for: {bestFor}</p>
      </div>
    </div>
  );
}

function OptionCard({ option, dark, badge }: { option: Option; dark?: boolean; badge?: string }) {
  return (
    <article
      data-reveal
      className={cn(
        "relative flex min-w-0 flex-col break-words rounded-lg p-7 md:p-8",
        dark ? "bg-ink text-white" : "border border-line bg-white text-ink"
      )}
    >
      {badge && (
        <span className="absolute -top-3 right-7 rounded-full bg-wheat px-3 py-1 text-xs font-bold text-ink shadow-sm">{badge}</span>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-display text-2xl font-bold">{option.name}</h4>
        {option.liveBy && (
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              dark ? "bg-white/10 text-wheat" : "bg-sky text-flag-dark"
            )}
          >
            <Clock className="size-3.5" aria-hidden />
            {option.liveBy}
          </span>
        )}
      </div>
      <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className={cn("font-display text-[3rem] font-extrabold leading-none", dark && "text-wheat")}>{option.price}</span>
        <span className={cn("text-sm", dark ? "text-white/70" : "text-muted")}>{option.priceNote}</span>
      </p>
      <div className={cn("my-6 h-px", dark ? "bg-white/15" : "bg-line")} />
      <ul className="space-y-3 text-[0.98rem]">
        {option.includes.map((inc) => (
          <li key={inc} className="flex gap-3">
            <Check aria-hidden className={cn("mt-1 size-4 shrink-0", dark ? "text-wheat" : "text-flag")} strokeWidth={3} />
            <span>{inc}</span>
          </li>
        ))}
      </ul>
      <Button asChild variant={dark ? "primary" : "solid"} size="lg" className="group mt-8 w-full [margin-top:max(2rem,auto)]">
        <a href="#book">
          Start with {option.name}
          <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
        </a>
      </Button>
    </article>
  );
}

// Monthly plans as a staircase: each step sits higher than the last, because
// each plan includes the one before it.
const stepStyle = [
  { card: "bg-white border border-line text-ink", offset: "md:translate-y-20", price: "text-ink", muted: "text-muted", check: "text-flag", rule: "bg-line", btn: "solid" as const },
  { card: "bg-flag text-white", offset: "md:translate-y-10", price: "text-white", muted: "text-white/80", check: "text-wheat", rule: "bg-white/15", btn: "primary" as const },
  { card: "bg-ink text-white", offset: "md:translate-y-0", price: "text-wheat", muted: "text-white/70", check: "text-wheat", rule: "bg-white/15", btn: "primary" as const },
];

function Monthly() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.from("[data-step]", {
        yPercent: 18,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div id="monthly" className="mt-24 scroll-mt-24">
      <div data-reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-flag">Monthly plans</p>
          <h3 className="mt-1 text-4xl font-extrabold">Plans that stack</h3>
        </div>
        <p className="text-[0.95rem] text-muted md:max-w-[44ch] md:text-right">
          3-month minimum, then month to month. Move up a step whenever you&rsquo;re ready.
        </p>
      </div>

      <div ref={root} className="mt-14 grid gap-5 md:mb-20 md:grid-cols-3 md:items-start">
        {plans.map((p, i) => {
          const s = stepStyle[i];
          return (
            <article key={p.name} data-step className={cn("relative flex flex-col rounded-lg p-7", s.card, s.offset)}>
              <div className="flex items-baseline justify-between">
                <h4 className="font-display text-[1.7rem] font-bold">{p.name}</h4>
                <span className={cn("font-display text-sm font-bold", s.muted)}>Step {i + 1}</span>
              </div>
              <p className={cn("mt-2 min-h-[3em] font-display italic", s.muted)}>&ldquo;{p.problem}&rdquo;</p>
              <p className={cn("text-sm", s.muted)}>Best for: {p.bestFor}</p>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className={cn("font-display text-[2.6rem] font-extrabold leading-none", s.price)}>{p.price}</span>
                <span className={cn("text-sm", s.muted)}>{p.priceNote}</span>
              </p>
              <div className={cn("my-6 h-px", s.rule)} />
              {p.base && <p className="mb-3 text-[0.95rem] font-semibold">Everything in {p.base}, plus:</p>}
              <ul className="space-y-3 text-[0.96rem]">
                {p.includes.map((inc) => (
                  <li key={inc} className="flex gap-3">
                    <Check aria-hidden className={cn("mt-1 size-4 shrink-0", s.check)} strokeWidth={3} />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
              <p className={cn("mt-6 text-sm", s.muted)}>{p.terms}</p>
              <Button asChild variant={s.btn} size="lg" className="group mt-6 w-full">
                <a href="#book">
                  Talk about {p.name}
                  <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
                </a>
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function AlaCarte() {
  return (
    <div className="mt-24 grid gap-10 md:grid-cols-[1fr_1.7fr]">
      <div data-reveal>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-flag">À la carte</p>
        <h3 className="mt-1 text-4xl font-extrabold">Need just one thing?</h3>
        <p className="mt-4 text-muted">Book any of these on their own, or add them to a package.</p>
        <a href="#book" className="mt-5 inline-block font-semibold text-flag underline underline-offset-4 hover:text-flag-dark">
          Ask about a one-off
        </a>
      </div>
      <ul data-reveal className="border-t border-line">
        {addons.map((a) => (
          <li key={a.name} className="flex items-baseline gap-4 border-b border-line py-3.5">
            <span className="text-ink">{a.name}</span>
            <span aria-hidden className="flex-1 translate-y-[-4px] border-b border-dotted border-line" />
            <span className="shrink-0 font-semibold text-ink">{a.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
