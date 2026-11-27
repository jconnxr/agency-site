"use client";

// /partners: how it works (scroll timeline), what the client gets (cream island
// with the package cards from src/lib/site.ts), the triple win, and the
// business-owner fallback band.
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ArrowRight, Camera, Check, Handshake, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { launch, plans } from "@/lib/site";
import { launchPlan, partnerSteps, presenceCheck } from "@/lib/partners";
import { withRef } from "@/lib/ref";
import { FadeUp, Panel, RevealHeading, Rise, SpotlightCard, Stagger, eyebrow, useReduced } from "@/components/fx";
import { usePartner } from "./state";
import { ownerHref } from "./hero";

/* ------------------------------------------------------------------ */
/* How it works: five steps, the line fills as you scroll              */
/* ------------------------------------------------------------------ */

export function PartnerSteps() {
  const reduce = useReduced();
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 70%", "end 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [reached, setReached] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(Math.min(partnerSteps.length - 1, Math.floor(v * partnerSteps.length + 0.15)));
  });
  const lit = (i: number) => reduce || i <= reached;

  return (
    <Panel id="how" className="scroll-mt-24" inner="px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className={cn(eyebrow, "text-brand-glow")}>How it works</p>
          <RevealHeading text="From coffee to credit." accent={2} className="mt-4 text-[2.3rem] md:text-[3.4rem]" />
          <p className="mt-5 max-w-[42ch] text-[1.06rem] leading-relaxed text-white/65">
            Five steps, and only the first one needs you in a chair. Every referral is credited through your own tracked
            QR code.
          </p>
        </div>

        <ol ref={list} className="relative pl-12 md:pl-14">
          <span aria-hidden className="absolute bottom-8 left-[15px] top-3 w-px bg-white/10 md:left-[19px]" />
          <motion.span
            aria-hidden
            className="absolute bottom-8 left-[15px] top-3 w-px origin-top bg-[linear-gradient(180deg,var(--color-brand-glow),rgb(111_116_255/0.7))] md:left-[19px]"
            style={{ scaleY: reduce ? 1 : fill }}
          />
          {partnerSteps.map((s, i) => (
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
                    lit(i) ? "bg-[color-mix(in_srgb,var(--color-panel-2)_75%,transparent)]" : "bg-[color-mix(in_srgb,var(--color-panel)_45%,transparent)]"
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
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* The client's side: Launch Plan → build → opening day, then packages */
/* ------------------------------------------------------------------ */

const journey = [
  { k: "Free Launch Plan", v: "15-minute call + a one-page plan" },
  { k: "We build", v: "Live in 14 to 30 days" },
  { k: "Opening day", v: "Already on Google" },
];

export function ClientJourney() {
  const [essentials, pro] = launch.options;
  const found = plans[0];
  const cards = [
    { name: essentials.name, price: essentials.price, note: essentials.priceNote, live: essentials.liveBy, items: essentials.highlights ?? [] },
    { name: pro.name, price: pro.price, note: pro.priceNote, live: pro.liveBy, items: pro.highlights ?? [] },
    { name: found.name, price: found.price, note: found.priceNote, live: "Monthly, after launch", items: found.highlights ?? [] },
  ];

  return (
    <Panel id="journey" surface="cream" className="scroll-mt-24" inner="px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <p className={cn(eyebrow, "text-brand")}>What your client gets</p>
            <RevealHeading
              text="Get found before opening day."
              accent={2}
              accentClass="text-brand"
              className="mt-4 text-[2.1rem] md:text-[3.2rem]"
            />
          </div>
          <p className="text-[1.06rem] leading-relaxed text-muted md:pt-10">
            Your client starts free. Opening soon? A free Launch Plan. Already open? A free Online Presence Check:{" "}
            {presenceCheck.body.replace(/^A /, "a ")}
          </p>
        </div>

        {/* Journey strip */}
        <Stagger
          as="ol"
          className="mt-12 grid overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,var(--color-night-2),var(--color-night))] text-white shadow-[0_30px_60px_-30px_rgb(15_26_42/0.6)] md:mt-14 md:grid-cols-3"
        >
          {journey.map((j, i) => (
            <Rise
              as="li"
              key={j.k}
              className="relative flex items-center gap-4 border-white/10 p-5 [&:not(:first-child)]:border-t md:px-7 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-t-0"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-brand-glow/60 font-mono text-[0.78rem] text-brand-glow">
                {i + 1}
              </span>
              <span>
                <span className="block font-wide text-[1.1rem] font-bold">{j.k}</span>
                <span className="text-[0.92rem] text-white/60">{j.v}</span>
              </span>
              {i < journey.length - 1 && (
                <ArrowRight aria-hidden className="ml-auto hidden size-5 shrink-0 text-brand-glow md:block" />
              )}
            </Rise>
          ))}
        </Stagger>

        <div className="mt-6 grid gap-5 md:grid-cols-[17rem_1fr] md:gap-8">
          <FadeUp className="rounded-[24px] border border-brand/25 bg-brand-soft/40 p-6">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-brand">{launchPlan.title} &middot; {launchPlan.for.toLowerCase()}</p>
            <ul className="mt-4 space-y-2.5 text-[0.96rem]">
              {launchPlan.items.map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 bg-brand" />
                  {t}
                </li>
              ))}
            </ul>
          </FadeUp>

          {/* Phones: swipe sideways through the three packages instead of a long stack */}
          <div
            role="region"
            aria-label="Packages"
            tabIndex={0}
            className="-mx-5 snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0"
          >
          <Stagger className="flex gap-4 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {cards.map((c, i) => (
              <Rise
                as="article"
                key={c.name}
                aria-label={`${c.name}, ${c.price}`}
                className="flex w-[80%] min-w-0 shrink-0 snap-start flex-col rounded-[24px] sm:w-auto border border-line/70 bg-white/70 p-6 shadow-[0_1px_0_rgb(255_255_255)_inset,0_30px_60px_-40px_rgb(15_26_42/0.35)]"
              >
                <div className="flex items-end justify-between">
                  <span aria-hidden className="flex items-end gap-1">
                    {[0, 1, 2].map((b) => (
                      <span key={b} className={cn("w-2.5", b <= i ? "bg-brand" : "bg-line")} style={{ height: 8 + b * 7 }} />
                    ))}
                  </span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.06em] text-brand">{c.live}</span>
                </div>
                <h3 className="mt-5 text-balance font-wide text-[1.4rem] font-extrabold">{c.name}</h3>
                <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-wide text-[2.2rem] font-extrabold leading-none">{c.price}</span>
                  <span className="text-[0.9rem] text-muted">{c.note}</span>
                </p>
                <ul className="mt-5 space-y-2 border-t border-line pt-4 text-[0.95rem]">
                  {c.items.map((t) => (
                    <li key={t} className="flex gap-3">
                      <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 bg-brand" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Rise>
            ))}
          </Stagger>
          </div>
        </div>
        <p className="mt-6 text-[0.95rem] text-muted md:ml-[19rem]">{launch.note.replace(/^Both include/, "Both Launch packages include")}</p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Triple win                                                          */
/* ------------------------------------------------------------------ */

const wins = [
  { icon: Store, who: "Your client", title: "Looks professional from day one", body: "A site, a Google profile and a review card, ready before the doors open." },
  { icon: Handshake, who: "You", title: "Look full-service, and get content", body: "The advisor who thought of everything, with opening-day photos for your LinkedIn and a results report." },
  { icon: Camera, who: "The photographer", title: "Gets paid work", body: "Every Launch Pro includes a shoot. We sell it and schedule it; they shoot it at their rate." },
];

export function TripleWin() {
  return (
    <Panel aria-labelledby="wins-title" surface="bare" inner="px-2 py-24 md:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <RevealHeading id="wins-title" text="One opening. Three wins." accent={2} className="text-[2.1rem] md:text-[3rem]" />
        <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
          {wins.map((w, i) => (
            <Rise key={w.who} className={cn(i === 1 && "md:translate-y-8")}>
              <SpotlightCard className="h-full p-6">
                <p className="flex items-center justify-between">
                  <w.icon aria-hidden className="size-5 text-brand-glow" />
                  <span className={cn(eyebrow, "text-white/45")}>{w.who}</span>
                </p>
                <h3 className="mt-6 text-[1.3rem]">{w.title}</h3>
                <p className="mt-3 text-[0.97rem] text-white/60">{w.body}</p>
              </SpotlightCard>
            </Rise>
          ))}
        </Stagger>

        {/* TODO: replace with real partner quote once the first partners are on board. */}
        <FadeUp className="mt-14 md:mt-20">
          <div className="glass flex flex-col gap-4 rounded-[24px] bg-[radial-gradient(80%_140%_at_0%_0%,color-mix(in_srgb,var(--color-brand-glow)_22%,transparent),transparent_60%)] p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className={cn(eyebrow, "text-brand-glow")}>Founding partners</p>
              <p className="mt-2 font-wide text-[1.35rem] font-bold leading-snug text-white md:text-[1.6rem]">
                Be one of the first five.
              </p>
              <p className="mt-1 text-white/60">We&rsquo;re just starting the program, so you&rsquo;ll help shape it.</p>
            </div>
            <a
              href="#apply"
              className="inline-flex h-12 shrink-0 items-center self-start rounded-full border border-white/30 px-6 font-semibold text-white transition-colors hover:bg-white hover:text-ink md:self-auto"
            >
              Save a seat
            </a>
          </div>
        </FadeUp>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Business owner fallback                                             */
/* ------------------------------------------------------------------ */

export function OwnerBand() {
  const { ref } = usePartner();
  const [href, setHref] = useState(ownerHref);
  useEffect(() => setHref(withRef(ownerHref, ref)), [ref]);

  return (
    <section id="owners" aria-label="For business owners" className="relative mt-5 px-3 pb-24 sm:px-4 md:-mt-8 md:px-6 md:pb-32">
      <FadeUp className="mx-auto max-w-5xl">
        <a
          href={href}
          className="glass group flex flex-col gap-3 rounded-[24px] bg-[color-mix(in_srgb,var(--color-panel)_60%,transparent)] p-5 transition-colors hover:bg-[color-mix(in_srgb,var(--color-panel-2)_80%,transparent)] sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:py-4 sm:pl-7 sm:pr-4"
        >
          <span className="flex items-center gap-3 text-white/80">
            <Check aria-hidden className="size-5 shrink-0 text-go-glow" />
            <span>
              <span className="font-semibold text-white">Got our card from your advisor?</span> Book your free Launch Plan.
            </span>
          </span>
          <span className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-white/10 px-5 font-semibold text-white transition-colors group-hover:bg-brand sm:self-auto">
            Book it free
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </a>
      </FadeUp>
    </section>
  );
}
