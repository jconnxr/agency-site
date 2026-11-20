"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  ArrowRight,
  CalendarCheck,
  Globe,
  MapPin,
  MessageSquareText,
  Navigation,
  Phone,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { services, site } from "@/lib/site";

// The one orchestrated moment on the page: a Google-style business listing
// assembles itself, each piece is tagged with the service that built it,
// then the results (bookings, reviews, texts) start arriving around it.
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-line]", { yPercent: 110, duration: 0.9, stagger: 0.08 })
        .from("[data-swash]", { scaleX: 0, transformOrigin: "left", duration: 0.6 }, "-=0.3")
        .from("[data-fade]", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.4")
        .from("[data-card]", { y: 40, opacity: 0, duration: 0.8 }, 0.3)
        .from("[data-map]", { opacity: 0, duration: 0.5 }, "-=0.3")
        .from("[data-pin]", { y: -40, opacity: 0, duration: 0.6, ease: "bounce.out" }, "-=0.2")
        .from("[data-piece]", { y: 10, opacity: 0, duration: 0.45, stagger: 0.12 }, "-=0.3")
        .from("[data-action]", { scale: 0.85, opacity: 0, duration: 0.35, stagger: 0.08 }, "-=0.1")
        .from("[data-tag]", { scale: 0.6, opacity: 0, duration: 0.35, stagger: 0.15, ease: "back.out(2)" }, "+=0.05")
        .to("[data-book]", { boxShadow: "0 0 0 6px rgba(227,168,62,0.45)", duration: 0.35, yoyo: true, repeat: 1 })
        .from("[data-ping]", { x: (i) => (i % 2 ? 30 : -30), opacity: 0, duration: 0.55, stagger: 0.35, ease: "back.out(1.6)" }, "-=0.2");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]" />
      <div aria-hidden className="absolute -right-40 top-10 size-[520px] rounded-full bg-flag/40 blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 pb-24 pt-14 md:grid-cols-[1.15fr_1fr] md:px-8 md:pb-32 md:pt-20">
        <div>
          <p data-fade className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-white/85">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-wheat opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-wheat" />
            </span>
            Taking new {site.city} clients
          </p>

          <h1 className="mt-7 text-[2.6rem] font-extrabold leading-[1.02] sm:text-[3.4rem] lg:text-[4rem]">
            <Line>We set up the</Line>
            <Line>online side of</Line>
            <Line>your business,</Line>
            <Line>then keep it</Line>
            <Line>
              <span className="text-wheat">bringing in</span>
            </Line>
            <Line>
              <span className="relative inline-block text-wheat">
                customers.
                <svg
                  data-swash
                  aria-hidden
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full"
                >
                  <path d="M2 10 C 70 2, 160 2, 298 8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </Line>
          </h1>

          <p data-fade className="mt-8 max-w-[50ch] text-lg text-white/75">
            Websites, Google Business Profiles, online booking, social media and ads for {site.city} businesses.
            Start with the basics on day one, add a monthly team when you&rsquo;re ready.
          </p>
          <div data-fade className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group">
              <a href="#book">
                Book a free 30-minute call
                <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white hover:text-ink">
              <a href="#packages">See packages and prices</a>
            </Button>
          </div>
          <p data-fade className="mt-7 flex items-center gap-2 text-[0.95rem] text-white/65">
            <MapPin className="size-4 text-wheat" aria-hidden />
            Based in {site.city}. We come to you anywhere in the metro.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[440px]">
          <div aria-hidden className="absolute -right-10 -top-8 bottom-12 left-12 rounded-lg bg-flag" />
          <ListingCard />

          {/* Kept over the map so they never cover the listing's text */}
          <Ping className="-left-4 -top-5 md:-left-16" icon={<CalendarCheck />} title="New booking" body="Tue, 10:30 AM" />
          <Ping className="-right-3 top-16 md:-right-14" icon={<Star className="fill-wheat text-wheat" />} title="New 5-star review" body="Requested after the job" />
          <Ping className="-left-6 top-[118px] md:-left-20" icon={<MessageSquareText />} title="Missed call" body="Texted back in 30 sec" />

          <p data-fade className="relative mt-5 text-center text-sm text-white/55">
            Example listing. Every tag is something we set up for you.
          </p>
        </div>
      </div>

      <Marquee />
    </section>
  );
}

function Line({ children }: { children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span data-line className="block">
        {children}
      </span>
    </span>
  );
}

function Marquee() {
  const row = [...services, ...services];
  return (
    <div className="relative border-y border-ink bg-wheat py-4 text-ink" aria-label={`Services: ${services.join(", ")}`}>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]" aria-hidden>
        {row.map((s, i) => (
          <span key={i} className="flex items-center gap-6 pr-6 font-display text-xl font-bold md:text-2xl">
            {s}
            <svg viewBox="0 0 10 10" className="size-2.5 fill-ink/70">
              <rect x="1" y="1" width="8" height="8" transform="rotate(45 5 5)" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

// Example notifications that float around the listing, showing what the setup produces.
function Ping({
  icon,
  title,
  body,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div data-ping aria-hidden className={`absolute z-20 hidden sm:block ${className}`}>
      <div className="flex animate-float items-center gap-3 rounded-md border border-line bg-white py-2.5 pl-2.5 pr-4 text-ink shadow-[0_18px_40px_-16px_rgba(0,0,0,0.5)]">
        <span className="grid size-9 place-items-center rounded-sm bg-sky text-flag [&_svg]:size-[18px]">{icon}</span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold">{title}</span>
          <span className="block text-xs text-muted">{body}</span>
        </span>
      </div>
    </div>
  );
}

function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      data-tag
      className={`absolute z-10 whitespace-nowrap rounded-full bg-wheat px-2.5 py-1 text-xs font-semibold text-ink shadow-sm ${className}`}
    >
      {children}
    </span>
  );
}

function ListingCard() {
  return (
    <div
      data-card
      role="img"
      aria-label="Example Google listing for a local foundation repair company, showing a map, 4.9 star rating, open hours, and buttons for website, directions, call and book online."
      className="relative rounded-lg border border-line bg-white p-3 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
    >
      <div data-map className="relative h-40 overflow-hidden rounded-md bg-[#e6eef5]">
        <MapArt />
        <div data-pin className="absolute left-[54%] top-[34%] -translate-x-1/2">
          <MapPin className="size-9 fill-flag text-white" strokeWidth={1.5} />
        </div>
      </div>

      <div className="px-2 pb-2 pt-4">
        <div data-piece className="relative">
          <Tag className="-top-7 right-0">Google Business Profile</Tag>
          <p className="font-display text-[1.45rem] font-bold leading-tight text-ink">Red Dirt Foundation Repair</p>
          <p className="text-sm text-muted">Foundation repair service in Oklahoma City</p>
        </div>

        <div data-piece className="relative mt-2 flex items-center gap-1.5 text-sm">
          <span className="font-semibold text-ink">4.9</span>
          <span className="flex" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-wheat text-wheat" />
            ))}
          </span>
          <span className="text-muted">(37 reviews)</span>
          <Tag className="-top-1 right-0">Review requests</Tag>
        </div>

        <p data-piece className="mt-1 text-sm">
          <span className="font-semibold text-[#1e7a46]">Open</span>
          <span className="text-muted"> until 6 PM</span>
        </p>

        <div className="mt-10 grid grid-cols-4 gap-2 text-center text-xs font-medium text-flag">
          <Action icon={<Globe />} label="Website" tag="Website" />
          <Action icon={<Navigation />} label="Directions" />
          <Action icon={<Phone />} label="Call" />
          <Action icon={<CalendarCheck />} label="Book online" tag="Booking" highlight />
        </div>
      </div>
    </div>
  );
}

function Action({
  icon,
  label,
  tag,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  tag?: string;
  highlight?: boolean;
}) {
  return (
    <div data-action className="relative flex flex-col items-center gap-1.5">
      {tag && <Tag className="-top-8 left-1/2 -translate-x-1/2">{tag}</Tag>}
      <span
        {...(highlight ? { "data-book": "" } : {})}
        className={`grid size-11 place-items-center rounded-full [&_svg]:size-5 ${
          highlight ? "bg-flag text-white" : "border border-line bg-white"
        }`}
      >
        {icon}
      </span>
      {label}
    </div>
  );
}

function MapArt() {
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
      <path d="M-10 118 C 80 96, 150 132, 230 112 S 360 92, 420 104" stroke="#b9d4ea" strokeWidth="14" fill="none" />
      <g stroke="#ffffff" strokeWidth="7" fill="none">
        <path d="M0 52 H400" />
        <path d="M0 140 H400" />
        <path d="M120 0 V160" />
        <path d="M290 0 V160" />
      </g>
      <g stroke="#ffffff" strokeWidth="3" fill="none">
        <path d="M0 22 H400" />
        <path d="M0 84 H400" />
        <path d="M60 0 V160" />
        <path d="M180 0 V160" />
        <path d="M235 0 V160" />
        <path d="M350 0 V160" />
      </g>
      <rect x="190" y="60" width="38" height="18" rx="3" fill="#d6e4d2" />
      <rect x="300" y="26" width="42" height="22" rx="3" fill="#d6e4d2" />
    </svg>
  );
}
