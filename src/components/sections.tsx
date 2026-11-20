"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  FileBarChart,
  KeyRound,
  MapPin,
  Phone,
  Repeat,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs, promises, site } from "@/lib/site";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// One scroll-reveal for the whole page: anything marked data-reveal rises in as it enters.
export function RevealOnScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    gsap.set(els, { y: 28, opacity: 0 });
    const triggers = ScrollTrigger.batch(els, {
      start: "top 88%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" }),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      gsap.set(els, { clearProps: "all" });
    };
  }, []);
  return null;
}

export function Eyebrow({ n, children, light }: { n: string; children: React.ReactNode; light?: boolean }) {
  return (
    <p
      data-reveal
      className={cn(
        "flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.18em]",
        light ? "text-wheat" : "text-flag"
      )}
    >
      <span>{n}</span>
      <span aria-hidden className={cn("h-0.5 w-8", light ? "bg-wheat/70" : "bg-wheat")} />
      <span>{children}</span>
    </p>
  );
}

export const sectionTitle = "mt-4 text-[2.4rem] font-extrabold leading-[1.04] md:text-[3.4rem]";

export function WhoFor() {
  const groups = [
    {
      title: "Just getting started",
      lede: "You need customers to find you and book you, without paying agency prices.",
      pains: [
        "No website yet, or one you're embarrassed to send people to",
        "Not showing up on Google Maps when people search",
        "Booking by text and phone tag",
      ],
      fit: "Most start with Launch",
      price: "from $750 one-time, live in 14 days",
      dark: false,
      photo: {
        src: "/images/barbershop-meeting.webp",
        alt: "Two people at a table in a barbershop looking over a website layout on a tablet",
        position: "object-[50%_62%]",
      },
    },
    {
      title: "Already up and running",
      lede: "You have the basics. Now you want more leads and less busywork.",
      pains: [
        "Posting on social when you remember to",
        "Ads that cost money but you can't tell what they bring in",
        "Missed calls and reviews you never asked for",
      ],
      fit: "Most start with Get Found or Get Leads",
      price: "from $397 a month",
      dark: true,
      photo: {
        src: "/images/contractor-truck.webp",
        alt: "A contractor sitting in his work truck, smiling at a message on his phone",
        position: "object-[50%_38%]",
      },
    },
  ];

  return (
    <section id="who" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Eyebrow n="01">Who it&rsquo;s for</Eyebrow>
      <h2 data-reveal className={cn(sectionTitle, "max-w-[18ch]")}>
        Built for where your business is right now.
      </h2>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <article
            key={g.title}
            data-reveal
            className={cn(
              "flex flex-col overflow-hidden rounded-lg p-8 md:p-10",
              g.dark ? "bg-ink text-white" : "border border-line bg-white"
            )}
          >
            <div className="relative -mx-8 -mt-8 mb-8 h-48 md:-mx-10 md:-mt-10 md:mb-10 md:h-56">
              <Image src={g.photo.src} alt={g.photo.alt} fill sizes="(min-width: 768px) 560px, 100vw" className={cn("object-cover", g.photo.position)} />
              {/* fades the photo into the card so it reads as part of it */}
              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 bg-gradient-to-b from-transparent from-45%",
                  g.dark ? "to-ink" : "to-white"
                )}
              />
            </div>
            <h3 className={cn("text-3xl font-bold", g.dark ? "text-wheat" : "text-flag")}>{g.title}</h3>
            <p className={cn("mt-3 text-lg", g.dark ? "text-white/75" : "text-muted")}>{g.lede}</p>
            <p className={cn("mt-8 text-xs font-bold uppercase tracking-[0.16em]", g.dark ? "text-white/50" : "text-muted")}>
              Sound familiar?
            </p>
            <ul className="mt-4 space-y-3.5">
              {g.pains.map((t) => (
                <li key={t} className="flex gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full",
                      g.dark ? "bg-white/10 text-white/70" : "bg-paper text-muted"
                    )}
                  >
                    <X className="size-3.5" strokeWidth={3} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <a
              href="#packages"
              className={cn(
                "group mt-auto flex items-center justify-between gap-4 border-t pt-6 [margin-top:max(2.5rem,auto)]",
                g.dark ? "border-white/15" : "border-line"
              )}
            >
              <span>
                <span className="block font-semibold">{g.fit}</span>
                <span className={cn("text-[0.95rem]", g.dark ? "text-white/65" : "text-muted")}>{g.price}</span>
              </span>
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-1",
                  g.dark ? "bg-wheat text-ink" : "bg-flag text-white"
                )}
              >
                <ArrowRight className="size-5" aria-hidden />
                <span className="sr-only">See packages</span>
              </span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

// "What you get": each service as a tile with a small drawing of the thing itself,
// so visitors can see the deliverables before there are client case studies to show.
export function Showcase() {
  return (
    <section id="what" className="border-y border-line bg-white">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow n="02">What you get</Eyebrow>
            <h2 data-reveal className={cn(sectionTitle, "max-w-[16ch]")}>
              Everything a local business needs online.
            </h2>
          </div>
          <p data-reveal className="max-w-[40ch] text-lg text-muted">
            One team handles all of it, so your site, Google profile, booking and ads actually work together.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <Tile className="md:col-span-2" tier="Launch" title="A website that gets calls" body="Fast, mobile-first, and built around one job: getting people to call or book.">
            <SiteArt />
          </Tile>
          <Tile
            tier="Get Found"
            title="Show up on Google Maps"
            body="Weekly posts, fresh photos, review replies and consistent listings everywhere people search."
            photo={{ src: "/images/local-search-plaza.webp", alt: "A hand holding a phone showing a map and business listing on a brick-storefront street", position: "object-[50%_45%]" }}
          />
          <Tile tier="Launch Pro" title="Online booking" body="Customers pick a time themselves. No more phone tag.">
            <CalendarArt />
          </Tile>
          <Tile
            tier="Get Leads"
            title="Social, handled"
            body="Three posts a week on two platforms, planned and designed for you."
            photo={{ src: "/images/chef-filming.webp", alt: "Someone filming a chef plating a dish with a phone on a handheld gimbal", position: "object-[50%_40%]" }}
          />
          <Tile
            tier="Automate"
            title="Never miss a lead"
            body="Missed calls get a text back, leads get an instant reply, and customers get reminders."
            photo={{ src: "/images/auto-shop-counter.webp", alt: "A phone showing a text conversation, propped against the register on an auto shop counter", position: "object-[45%_55%]" }}
          />
          <Tile tier="Get Leads" title="Ads you can measure" body="Meta or Google ads with call and form tracking, so you see your cost per lead.">
            <AdsArt />
          </Tile>
          <Tile className="md:col-span-2" tier="Full Department" title="Photo, video and drone" body="A monthly half-day shoot cut into 8–12 clips, plus quarterly drone footage of your work." dark exposeArt>
            <ShootArt />
          </Tile>
        </div>
      </div>
    </section>
  );
}

function Tile({
  title,
  body,
  tier,
  dark,
  className,
  children,
  photo,
  exposeArt,
}: {
  title: string;
  body: string;
  tier: string;
  dark?: boolean;
  className?: string;
  children?: React.ReactNode;
  photo?: { src: string; alt: string; position: string };
  exposeArt?: boolean;
}) {
  return (
    <article
      data-reveal
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border transition-shadow hover:shadow-[0_24px_48px_-28px_rgba(22,38,59,0.45)]",
        dark ? "border-ink bg-ink text-white" : "border-line bg-paper",
        className
      )}
    >
      {photo ? (
        <div className="relative h-52 overflow-hidden">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 768px) 380px, 100vw"
            className={cn("object-cover transition-transform duration-700 group-hover:scale-105", photo.position)}
          />
          {/* a light flag-blue wash ties the photos to the drawn tiles around them */}
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,104,176,0.10),rgba(22,38,59,0.22))]" />
        </div>
      ) : (
        <div className="relative h-52 overflow-hidden" aria-hidden={!exposeArt}>
          {children}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 pt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
              dark ? "bg-white/10 text-wheat" : "bg-sky text-flag-dark"
            )}
          >
            {tier}
          </span>
        </div>
        <p className={cn("mt-2 text-[0.98rem]", dark ? "text-white/70" : "text-muted")}>{body}</p>
      </div>
    </article>
  );
}

// ---- Tile drawings (decorative, built from divs so they stay crisp and themeable) ----

function SiteArt() {
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-5 bg-sky px-6 pt-6">
      <div className="h-[88%] w-full max-w-[420px] translate-y-3 rounded-t-md border border-line bg-white shadow-lg transition-transform duration-500 group-hover:translate-y-0">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="ml-3 h-2 w-32 rounded-full bg-paper" />
        </div>
        <div className="grid grid-cols-[1.3fr_1fr] gap-4 p-4">
          <div>
            <div className="h-3 w-[90%] rounded-full bg-ink" />
            <div className="mt-2 h-3 w-[70%] rounded-full bg-ink" />
            <div className="mt-3 h-2 w-full rounded-full bg-line" />
            <div className="mt-1.5 h-2 w-[80%] rounded-full bg-line" />
            <div className="mt-4 flex gap-2">
              <span className="rounded-sm bg-wheat px-3 py-1.5 text-[10px] font-bold text-ink">Book now</span>
              <span className="flex items-center gap-1 rounded-sm border border-line px-3 py-1.5 text-[10px] font-bold text-ink">
                <Phone className="size-2.5" /> Call
              </span>
            </div>
          </div>
          <div className="rounded-sm bg-[linear-gradient(135deg,var(--color-sky-deep),var(--color-flag))]" />
        </div>
      </div>
      <div className="hidden h-[78%] w-24 shrink-0 translate-y-6 rounded-t-xl border-4 border-b-0 border-ink bg-white p-2 shadow-lg transition-transform delay-75 duration-500 group-hover:translate-y-2 sm:block">
        <div className="h-2 w-full rounded-full bg-ink" />
        <div className="mt-1.5 h-2 w-3/4 rounded-full bg-ink" />
        <div className="mt-3 h-12 rounded-sm bg-sky-deep" />
        <div className="mt-3 rounded-sm bg-wheat py-1 text-center text-[8px] font-bold text-ink">Book now</div>
      </div>
    </div>
  );
}

function CalendarArt() {
  const booked = new Set([3, 8, 9, 15, 17, 22, 24]);
  return (
    <div className="absolute inset-0 grid place-items-center bg-sky p-5">
      <div className="w-full max-w-[240px] rounded-md bg-white p-4 shadow-md">
        <div className="flex justify-between text-xs font-semibold text-ink">
          <span>November</span>
          <span className="text-muted">Pick a time</span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "aspect-square rounded-[4px] transition-colors duration-300",
                booked.has(i) ? "bg-flag group-hover:bg-wheat" : "bg-paper"
              )}
            />
          ))}
        </div>
        <div className="mt-3 rounded-sm bg-flag py-1.5 text-center text-[10px] font-bold text-white">Confirm booking</div>
      </div>
    </div>
  );
}

function AdsArt() {
  const bars = [38, 55, 47, 70, 62, 85];
  return (
    <div className="absolute inset-0 bg-paper p-5">
      <div className="flex items-center justify-between text-xs font-semibold text-ink">
        <span>Leads by week</span>
        <span className="rounded-full bg-sky px-2 py-0.5 text-flag-dark">Tracked</span>
      </div>
      <div className="mt-4 flex h-[120px] items-end gap-2.5">
        {bars.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={cn(
              "flex-1 origin-bottom rounded-t-[4px] transition-transform duration-500 group-hover:scale-y-110",
              i === bars.length - 1 ? "bg-wheat" : "bg-flag/80"
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-[10px] text-muted">Illustration</p>
    </div>
  );
}

function ShootArt() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {/* real aerial shot under a drone viewfinder */}
      <Image
        src="/images/aerial-roof.webp"
        alt="Aerial drone photo of a brick home and its roof in an Oklahoma subdivision at golden hour"
        fill
        sizes="(min-width: 768px) 760px, 100vw"
        className="object-cover object-[50%_45%] transition-transform duration-700 group-hover:scale-105"
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,38,59,0.55)_0%,rgba(22,38,59,0.05)_40%,rgba(22,38,59,0.35)_100%)]" />
      <div aria-hidden className="absolute inset-6">
        {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((c) => (
          <span key={c} className={cn("absolute size-6 border-white/90", c)} />
        ))}
        <span className="absolute left-3 top-2.5 flex items-center gap-1.5 text-xs font-bold tracking-wider text-white">
          <span className="size-2 animate-pulse rounded-full bg-red-500" /> REC
        </span>
        <span className="absolute right-3 top-2.5 flex items-center gap-1.5 text-xs font-semibold text-white/90">
          <Camera className="size-3.5" /> 4K · 120 ft
        </span>
      </div>
    </div>
  );
}

const steps = [
  { title: "Free call and Presence Check", body: "We look at your Google listing, site, reviews and competitors, and tell you what's worth doing first, and what isn't.", time: "30 minutes" },
  { title: "We launch it", body: "Fixed price, fixed date. You approve everything before it's public, and Site Care is free for 3 months.", time: "14 to 30 days" },
  { title: "Grow monthly, if you want", body: "Step up to Get Found, Get Leads or Full Department. 3-month minimum, then month to month.", time: "Ongoing" },
];

export function HowItWorks() {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!root.current || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-track]", {
        scaleX: 0,
        transformOrigin: "left",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 60%", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how" className="relative overflow-hidden bg-flag text-white">
      <div aria-hidden className="bg-grid absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Eyebrow n="04" light>
          How it works
        </Eyebrow>
        <h2 data-reveal className={cn(sectionTitle, "max-w-[16ch]")}>
          From first call to customers calling you.
        </h2>

        <ol ref={root} className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          <span aria-hidden className="absolute left-0 right-0 top-8 hidden h-0.5 bg-white/20 md:block" />
          <span aria-hidden data-track className="absolute left-0 right-0 top-8 hidden h-0.5 bg-wheat md:block" />
          {steps.map((s, i) => (
            <li key={s.title} data-reveal className="relative">
              <span className="relative grid size-16 place-items-center rounded-full border-2 border-wheat bg-flag font-display text-2xl font-extrabold text-wheat">
                {i + 1}
              </span>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-white/60">{s.time}</p>
              <h3 className="mt-1 text-2xl font-bold">{s.title}</h3>
              <p className="mt-3 text-white/80">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const promiseIcons = [KeyRound, Repeat, FileBarChart, MapPin];

export function Promises() {
  return (
    <section aria-label="Our promises" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {promises.map((p, i) => {
          const Icon = promiseIcons[i];
          return (
            <div key={p.title} data-reveal className="bg-white p-7">
              <Icon className="size-6 text-flag" aria-hidden />
              <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-[0.96rem] text-muted">{p.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-[1fr_1.6fr] md:px-8 md:py-32">
      <div className="md:sticky md:top-28 md:self-start">
        <Eyebrow n="06">Questions</Eyebrow>
        <h2 data-reveal className={sectionTitle}>
          Questions we get a lot
        </h2>
        <p data-reveal className="mt-5 text-muted">
          Something else on your mind? Ask on the call, or email{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-flag underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
      </div>
      <Accordion data-reveal type="single" collapsible defaultValue="q0" className="border-t border-line">
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`q${i}`}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

const footerLinks = [
  { href: "#who", label: "Who it's for" },
  { href: "#what", label: "What you get" },
  { href: "#packages", label: "Packages" },
  { href: "#how", label: "How it works" },
  { href: "#book", label: "Book a call" },
  { href: "#faq", label: "Questions" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white/75">
      {/* Sunset drone shot behind the closing call to action, fading into the footer */}
      <div className="absolute inset-x-0 top-0 h-[420px] [mask-image:linear-gradient(to_bottom,black_40%,transparent)] md:h-[400px] md:[mask-image:linear-gradient(to_bottom,black_35%,transparent_95%)]">
        <Image
          src="/images/drone-operator.webp"
          alt="Hands holding a drone controller in an Oklahoma field at sunset, with the drone flying overhead"
          fill
          sizes="100vw"
          className="object-cover object-[62%_20%] md:object-[50%_12%]"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,38,59,0.88)_0%,rgba(22,38,59,0.6)_55%,rgba(22,38,59,0.45)_100%)]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 pt-20 md:px-8">
        <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-14 md:flex-row md:items-end">
          <h2 className="max-w-[16ch] text-4xl font-extrabold text-white md:text-5xl">
            Ready to be the one they find first?
          </h2>
          <Button asChild size="lg" className="group self-start md:self-auto">
            <a href="#book">
              Book a free 30-minute call
              <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
          </Button>
        </div>

        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-bold text-white">{site.name}</p>
            <p className="mt-3 max-w-[40ch] text-[0.95rem]">
              Websites, Google profiles, booking, social and ads for local businesses in {site.city}.
            </p>
            <a href={`mailto:${site.email}`} className="mt-5 inline-block font-semibold text-wheat hover:text-white">
              {site.email}
            </a>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Explore</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[0.95rem] md:grid-cols-1">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Service area</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {site.serviceArea.map((c) => (
                <li key={c} className="rounded-full border border-white/15 px-3 py-1 text-sm">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-white/10 py-6 text-sm text-white/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {site.name}</p>
          <p className="flex items-center gap-1.5">
            <BadgeCheck className="size-4 text-wheat" aria-hidden /> Based in {site.city}
          </p>
        </div>
      </div>
      <p
        aria-hidden
        className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[18vw] font-extrabold leading-[0.75] text-white/[0.04]"
      >
        OKLAHOMA
      </p>
    </footer>
  );
}
