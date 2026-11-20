import type { Metadata } from "next";
import { Download, MessageSquare, Phone } from "lucide-react";
import { Sandbox } from "@/components/card/sandbox";
import { CardTracker } from "@/components/card/tracker";
import { StickyBar } from "@/components/card/sticky-bar";
import { CalendlyEmbed } from "@/components/card/book";
import { founding, launch, plans, promises, site } from "@/lib/site";
import { goSite, mainSite, phoneDisplay, smsHref, telHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

// The page behind the QR code on our business card, served at
// go.axiommediagroupokc.com (see vercel.json). For people we've just met:
// one job, help them picture it for their business and book a call.
export const metadata: Metadata = {
  title: `Good to meet you | ${site.name}`,
  description: "Websites, Google profiles and online booking for Oklahoma City businesses. Book a free 30-minute call.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${goSite}/` },
  openGraph: { url: `${goSite}/` },
};

const essentials = launch.options[0];
const getFound = plans[0];
const owned = promises.find((p) => p.title === "You own everything")!;

export default function CardPage() {
  return (
    <>
      <CardTracker />
      <header className="bg-night text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href={`${mainSite}/?src=card`} className="font-wide text-[0.95rem] font-extrabold tracking-tight">
            Axiom <span className="text-clay-glow">Media Group</span>
          </a>
          {telHref && (
            <a href={telHref} data-track="Tapped call" data-where="header" className="font-mono text-[0.8rem] text-white/75 hover:text-white">
              {phoneDisplay}
            </a>
          )}
        </div>
      </header>

      <main className="pb-24 md:pb-0">
        <Hero />
        <WhyItMatters />
        <Sandbox />
        <WhatYouGet />
        <HowSimple />
        <Trust />
        <BookSection />
      </main>

      <footer className="border-t border-night-line bg-night pb-28 text-white/55 md:pb-0">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 font-mono text-[0.72rem] md:px-8">
          <span>
            &copy; {new Date().getFullYear()} {site.name} &middot; {site.city}
          </span>
          <a href={`${mainSite}/?src=card`} className="underline decoration-white/30 underline-offset-4 hover:text-white">
            axiommediagroupokc.com
          </a>
        </div>
      </footer>

      <StickyBar />
    </>
  );
}

function ContactLinks({ where, tone = "dark" }: { where: string; tone?: "dark" | "light" }) {
  if (!telHref || !smsHref) return null;
  const link = cn(
    "inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-[6px] transition-colors",
    tone === "dark" ? "text-white decoration-white/35 hover:decoration-white" : "text-ink decoration-line hover:decoration-clay"
  );
  return (
    <>
      <a href={telHref} data-track="Tapped call" data-where={where} className={link}>
        <Phone aria-hidden className="size-4" /> Call
      </a>
      <a href={smsHref} data-track="Tapped text" data-where={where} className={link}>
        <MessageSquare aria-hidden className="size-4" /> Text
      </a>
    </>
  );
}

function Hero() {
  return (
    <section className="bg-night text-white">
      <div className="mx-auto max-w-6xl px-5 pb-14 pt-8 md:px-8 md:pb-24 md:pt-16">
        <p className="font-mono text-[0.74rem] uppercase tracking-[0.1em] text-white/60">
          {site.name} &middot; {site.city}
        </p>
        <h1 className="mt-5 text-[2.7rem] leading-[1] sm:text-[3.6rem] lg:text-[5rem]">Good to meet you.</h1>
        <p className="mt-5 max-w-[42ch] text-[1.1rem] leading-relaxed text-white/80 md:mt-7 md:text-xl">
          We set up websites, Google listings and online booking for local businesses, then keep them bringing in customers.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          <a
            href="#book"
            data-track="Tapped book"
            data-where="hero"
            className="inline-flex h-14 w-full items-center justify-center rounded-sm bg-clay px-7 text-[1.05rem] font-semibold text-white transition-colors hover:bg-clay-glow sm:w-auto"
          >
            Book a free 30-minute call
          </a>
          <ContactLinks where="hero" />
        </div>
        <a href="#try" className="mt-8 inline-flex items-center gap-2 font-mono text-[0.74rem] uppercase tracking-[0.08em] text-clay-glow hover:text-white">
          Or try it with your business first <span aria-hidden>&darr;</span>
        </a>
      </div>
    </section>
  );
}

function SectionHead({ label, title, dark }: { label: string; title: string; dark?: boolean }) {
  return (
    <>
      <p className={cn("font-mono text-[0.72rem] uppercase tracking-[0.1em]", dark ? "text-clay-glow" : "text-clay-ink")}>{label}</p>
      <h2 className="mt-3 max-w-[20ch] text-[2rem] leading-[1.05] md:text-[2.9rem]">{title}</h2>
    </>
  );
}

function WhyItMatters() {
  const points = [
    {
      t: "People search before they call.",
      b: "Before someone picks a local business, they look it up on their phone. If you don't show up, they never see you.",
    },
    {
      t: "They pick the better listing.",
      b: "Side by side on Google, people choose the business with good reviews, real photos and clear hours.",
    },
    {
      t: "Missed calls go to someone else.",
      b: "When nobody picks up, the caller tries the next business on the list. A quick text back keeps them with you.",
    },
  ];
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead label="Why it matters" title="Your customers are already looking." />
        <ol className="mt-10 divide-y divide-line border-y border-line md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
          {points.map((p, i) => (
            <li key={p.t} className="py-6 md:px-6 md:py-8 md:first:pl-0">
              <span className="font-mono text-[0.75rem] text-clay-ink">0{i + 1}</span>
              <h3 className="mt-2 text-[1.3rem] leading-tight">{p.t}</h3>
              <p className="mt-2 leading-relaxed text-muted">{p.b}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WhatYouGet() {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead label="What you get" title="Start simple. Add more when it's working." />
        <div className="mt-10 grid border-t border-line md:grid-cols-2">
          <Offer
            label="Launch"
            line="Website + Google profile"
            price={`From ${essentials.price}`}
            note={`One-time · ${essentials.liveBy?.toLowerCase()}`}
            items={essentials.includes}
            foot="Includes 3 months of hosting, updates and small edits, free."
          />
          <Offer
            label={getFound.name}
            line="We keep it working"
            price={`${getFound.price}${getFound.priceNote}`}
            note={getFound.terms}
            items={getFound.includes.slice(0, 4)}
            className="md:border-l md:border-line md:pl-10"
          />
        </div>
        <a
          href={`${mainSite}/?src=card#packages`}
          className="mt-8 inline-flex min-h-11 items-center font-semibold underline decoration-line decoration-2 underline-offset-[6px] hover:decoration-clay"
        >
          See every package and price
        </a>
      </div>
    </section>
  );
}

function Offer({
  label,
  line,
  price,
  note,
  items,
  foot,
  className,
}: {
  label: string;
  line: string;
  price: string;
  note: string;
  items: string[];
  foot?: string;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-line py-8 md:pr-10", className)}>
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">{label}</p>
      <h3 className="mt-2 text-[1.5rem] leading-tight">{line}</h3>
      <p className="mt-3 font-wide text-[2rem] font-extrabold leading-none">{price}</p>
      <p className="mt-2 font-mono text-[0.75rem] text-muted">{note}</p>
      <ul className="mt-5 space-y-2.5">
        {items.map((x) => (
          <li key={x} className="flex gap-3 leading-snug">
            <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-clay" />
            {x}
          </li>
        ))}
      </ul>
      {foot && <p className="mt-5 text-sm text-muted">{foot}</p>}
    </div>
  );
}

function HowSimple() {
  const steps = [
    { t: "Free 30-minute call", b: "Phone or Zoom. We look at where you are now and tell you plainly what would help." },
    { t: "We build it, you approve it", b: "We write, design and set everything up. You look it over and ask for changes before anything goes live." },
    { t: "You're live and getting found", b: `Your site and Google profile go live. ${essentials.name} is ${essentials.liveBy?.toLowerCase()}.` },
  ];
  return (
    <section className="bg-night text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead dark label="How simple it is" title="Three steps. We do the heavy lifting." />
        <ol className="mt-10 divide-y divide-night-line border-y border-night-line">
          {steps.map((s, i) => (
            <li key={s.t} className="grid gap-2 py-6 md:grid-cols-[4rem_1fr_1.4fr] md:items-baseline md:gap-6">
              <span className="font-mono text-[0.8rem] text-clay-glow">0{i + 1}</span>
              <h3 className="text-[1.35rem] leading-tight">{s.t}</h3>
              <p className="leading-relaxed text-white/70">{s.b}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 border-l-[3px] border-clay pl-5 md:max-w-[52ch]">
          <h3 className="text-[1.2rem]">What we need from you</h3>
          <ul className="mt-3 space-y-1.5 text-white/75">
            <li>Your logo, if you have one</li>
            <li>A few photos of your work or your place</li>
            <li>Your hours and the services you offer</li>
          </ul>
          <p className="mt-3 text-white/75">That&rsquo;s it. We handle the rest.</p>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const rows = [
    {
      t: "Local to Oklahoma City",
      b: "We're based here and come to you across the metro, including Edmond, Norman, Moore, Midwest City and Yukon.",
    },
    { t: owned.title, b: owned.body },
    { t: `Founding clients: the first ${founding.spots}`, b: founding.body },
  ];
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead label="Why work with us" title="Straightforward, and local." />
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <div key={r.t} className="grid gap-2 py-6 md:grid-cols-[1fr_1.6fr] md:gap-10">
              <dt className="font-wide text-[1.2rem] font-extrabold leading-tight">{r.t}</dt>
              <dd className="leading-relaxed text-muted">{r.b}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function BookSection() {
  return (
    <section id="book" className="scroll-mt-4 border-t border-line bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <SectionHead label="Next step" title="Book your free 30-minute call." />
        <p className="mt-4 max-w-[52ch] text-[1.04rem] leading-relaxed text-muted">
          Pick a time and choose a phone call or Zoom. If you typed your business name above, it&rsquo;s already in the notes.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2">
          <ContactLinks where="final" tone="light" />
          <a
            href="/axiom-media-group.vcf"
            data-track="Saved contact"
            data-where="final"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline decoration-line underline-offset-[6px] transition-colors hover:decoration-clay"
          >
            <Download aria-hidden className="size-4" /> Save our contact
          </a>
        </div>
        <div className="mt-8">
          <CalendlyEmbed />
        </div>
      </div>
    </section>
  );
}
