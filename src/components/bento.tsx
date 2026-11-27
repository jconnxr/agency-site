"use client";

// "What you get" as a bento grid. Each card carries a small live UI instead of an
// icon. All numbers inside the mini UIs are illustrative and labelled "Example".
import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { ArrowRight, Check, MapPin, MessageSquare, Navigation, Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel, RevealHeading, Rise, SpotlightCard, Stagger, eyebrow, useReduced } from "./fx";

const ease = [0.2, 0.8, 0.2, 1] as const;

type Service = { tier: string; title: string; body: string };
const services: Record<string, Service> = {
  site: { tier: "Launch", title: "A website that gets calls", body: "Fast, mobile-first, and built around one job: getting people to call or book." },
  maps: { tier: "Get Found: Google + AI", title: "Show up on Google Maps", body: "Weekly posts, fresh photos, review replies and consistent listings everywhere people search." },
  booking: { tier: "Launch Pro", title: "Online booking", body: "Customers pick a time themselves. No more phone tag." },
  social: { tier: "Get Leads", title: "Social, handled", body: "Three posts a week on two platforms, planned and designed for you." },
  leads: { tier: "Automate", title: "Never miss a lead", body: "Missed calls get a text back, leads get an instant reply, and customers get reminders." },
  ads: { tier: "Get Leads", title: "Ads you can measure", body: "Meta or Google ads with call and form tracking, so you see your cost per lead." },
  shoot: { tier: "Full Department", title: "Photo, video and drone", body: "A monthly half-day shoot cut into 8–12 clips, plus quarterly drone footage of your work." },
};

const strip = [
  { src: "/images/local-search-plaza.webp", alt: "A hand holding a phone showing a map and business listing on a brick-storefront street", label: "Google Maps", pos: "object-[50%_45%]" },
  { src: "/images/auto-shop-counter.webp", alt: "A phone showing a text conversation, propped against the register on an auto shop counter", label: "Text-back", pos: "object-[45%_55%]" },
  { src: "/images/chef-filming.webp", alt: "Someone filming a chef plating a dish with a phone on a handheld gimbal", label: "Social", pos: "object-[50%_40%]" },
  { src: "/images/aerial-roof.webp", alt: "Aerial drone photo of a brick home and its roof in an Oklahoma subdivision at golden hour", label: "Drone", pos: "object-[50%_45%]" },
];

export function Showcase() {
  return (
    <Panel id="what" surface="bare" className="scroll-mt-24" inner="py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-2 md:px-6">
        <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <RevealHeading
            text="Everything a local business needs online."
            accent={1}
            className="max-w-[16ch] text-[2.1rem] md:text-[3.2rem]"
          />
          <p className="max-w-[44ch] text-[1.06rem] leading-relaxed text-white/65 md:self-end">
            One team handles all of it, so your site, Google profile, booking and ads actually work together.
          </p>
        </div>

        <Stagger as="ul" className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-4 md:mt-20 md:grid-cols-6 lg:grid-cols-12 lg:gap-5">
          <Tile s={services.site} className="md:col-span-6 lg:col-span-7 lg:row-span-2" ui={<BrowserScore />} big
            chip={<Chip className="right-3 -top-3 rotate-[4deg] md:-right-4"><Check className="size-3.5 text-go-glow" strokeWidth={3} /> Mobile-first</Chip>} />
          <Tile s={services.maps} className="md:col-span-3 lg:col-span-5" ui={<MapsListing />}
            chip={<Chip className="-bottom-3 left-3 -rotate-[3deg] md:-left-4"><Navigation className="size-3.5 text-brand-glow" /> Directions</Chip>} />
          <Tile s={services.booking} className="md:col-span-3 lg:col-span-5" ui={<BookingSlots />} />
          <Tile s={services.social} className="md:col-span-2 lg:col-span-4" ui={<SocialStack />} />
          <Tile s={services.leads} className="md:col-span-2 lg:col-span-4" ui={<TextBack />}
            chip={<Chip className="right-3 -top-3 rotate-[3deg] md:-right-2"><MessageSquare className="size-3.5 text-brand-glow" /> Auto-reply</Chip>} />
          <Tile s={services.ads} className="md:col-span-2 lg:col-span-4" ui={<LeadsChart />} />
          <Tile s={services.shoot} className="md:col-span-6 lg:col-span-12" ui={<PhotoStrip />} wide />
          {/* The second lane, kept quiet: one slim row last, so the local grid above doesn't change */}
          <Rise as="li" className="relative min-w-0 md:col-span-6 lg:col-span-12">
            <SpotlightCard as="article" className="p-5 md:px-6 md:py-5">
              <a href="/ecommerce/" className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <span className="min-w-0">
                  <span className={cn(eyebrow, "block text-brand-glow")}>For online brands</span>
                  <span className="mt-1.5 block font-wide text-[1.2rem] font-extrabold text-white md:text-[1.3rem]">E-commerce Growth</span>
                  <span className="mt-1 block text-[0.98rem] text-white/60">Ads, creative and email automation for online brands</span>
                </span>
                <span className="inline-flex min-h-11 shrink-0 items-center gap-1.5 font-semibold text-white underline decoration-white/25 underline-offset-[5px] transition-colors group-hover:decoration-brand-glow">
                  See E-commerce Growth
                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </SpotlightCard>
          </Rise>
        </Stagger>
      </div>
    </Panel>
  );
}

function Tile({
  s,
  ui,
  chip,
  className,
  big,
  wide,
}: {
  s: Service;
  ui: React.ReactNode;
  chip?: React.ReactNode;
  className?: string;
  big?: boolean;
  wide?: boolean;
}) {
  return (
    <Rise as="li" className={cn("relative min-w-0", className)}>
      <SpotlightCard
        as="article"
        className={cn(
          "flex h-full flex-col p-5 md:p-6",
          wide && "lg:grid lg:grid-cols-[22rem_1fr] lg:items-center lg:gap-10"
        )}
      >
        <div className={cn(!wide && "order-2", "mt-5", wide && "mt-0 lg:order-none")}>
          <p className={cn(eyebrow, "text-brand-glow")}>{s.tier}</p>
          <h3 className={cn("mt-2 text-white", big ? "text-[1.6rem] md:text-[2rem]" : "text-[1.3rem] md:text-[1.4rem]")}>{s.title}</h3>
          <p className="mt-2 max-w-[46ch] text-[0.98rem] text-white/60">{s.body}</p>
        </div>
        <div className={cn("relative order-1", wide && "mt-6 lg:mt-0", big && "flex-1")}>{ui}</div>
      </SpotlightCard>
      {chip}
    </Rise>
  );
}

/** Small secondary card overlapping a tile's corner */
function Chip({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className={cn(
        "glass absolute z-10 flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-panel-2)_85%,transparent)] px-3 py-1.5 text-[0.78rem] font-semibold text-white shadow-[0_14px_30px_-10px_rgb(0_0_0/0.8)]",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** A number that counts up once its element scrolls into view. */
function CountTo({ to, duration = 1.8, delay = 0.2, className }: { to: number; duration?: number; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReduced();
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => Math.round(n).toLocaleString());
  useEffect(() => {
    if (reduce) {
      v.set(to);
      return;
    }
    if (!inView) return;
    const c = animate(v, to, { duration, delay, ease: [0.2, 0.7, 0.2, 1] });
    return () => c.stop();
  }, [inView, reduce, to, duration, delay, v]);
  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {text}
    </motion.span>
  );
}

const Example = ({ className }: { className?: string }) => (
  <span className={cn("rounded-full border border-white/15 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-white/45", className)}>
    Example
  </span>
);

/** Common "screen" surface for the mini UIs */
const screen = "relative overflow-hidden rounded-[16px] border border-white/10 bg-[color-mix(in_srgb,var(--color-panel)_70%,transparent)] shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]";

/* ------------------------------------------------------------------ */
/* Mini UIs                                                            */
/* ------------------------------------------------------------------ */

// Website: mini browser, speed score ring filling to 98.
function BrowserScore() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReduced();
  const R = 34;
  const C = 2 * Math.PI * R;
  return (
    <div ref={ref} aria-hidden className={cn(screen, "flex h-full min-h-[17rem] flex-col")}>
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </span>
        <span className="mx-auto w-[60%] truncate rounded-full bg-white/[0.06] px-3 py-1 text-center font-mono text-[0.62rem] text-white/45">
          yourbusiness.com
        </span>
        <Example />
      </div>
      <div className="grid flex-1 grid-cols-[1fr_auto] gap-5 p-4 md:p-5">
        {/* wireframe page */}
        <div className="flex flex-col gap-2.5">
          <span className="h-3 w-[70%] rounded bg-white/20" />
          <span className="h-3 w-[48%] rounded bg-white/12" />
          <span className="mt-1 h-2 w-[85%] rounded bg-white/[0.07]" />
          <span className="h-2 w-[78%] rounded bg-white/[0.07]" />
          <div className="mt-2 flex gap-2">
            <span className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-3 text-[0.65rem] font-semibold text-white">
              <Phone className="size-3" /> Call now
            </span>
            <span className="hidden h-8 w-20 rounded-full border border-white/15 sm:block" />
          </div>
          <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
            {[0, 1, 2].map((i) => (
              <span key={i} className="flex h-20 flex-col justify-end gap-1 rounded-lg bg-white/[0.05] p-2">
                <span className="h-1.5 w-[70%] rounded bg-white/15" />
                <span className="h-1.5 w-[45%] rounded bg-white/[0.08]" />
              </span>
            ))}
          </div>
        </div>
        {/* speed score */}
        <div className="flex flex-col items-center justify-center gap-2 self-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
          <div className="relative size-[88px]">
            <svg viewBox="0 0 80 80" className="size-full -rotate-90">
              <circle cx="40" cy="40" r={R} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="6" />
              <motion.circle
                cx="40"
                cy="40"
                r={R}
                fill="none"
                stroke="#4cc38a"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: reduce ? C * 0.02 : C }}
                animate={inView ? { strokeDashoffset: C * 0.02 } : undefined}
                transition={{ duration: 1.8, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center font-wide text-[1.5rem] font-extrabold text-go-glow">
              <CountTo to={98} />
            </span>
          </div>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-white/50">Mobile speed</span>
        </div>
      </div>
    </div>
  );
}

// Google Business Profile: listing card with stars and a directions counter.
function MapsListing() {
  return (
    <div aria-hidden className={cn(screen, "p-3.5")}>
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#3b6cf6,#6f74ff)]">
          <MapPin className="size-5 text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center justify-between gap-2">
            <span className="truncate text-[0.92rem] font-semibold text-white">Your Business</span>
            <Example />
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[0.75rem] text-white/60">
            4.9
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3 fill-[#f5b545] text-[#f5b545]" />
              ))}
            </span>
            <span className="text-white/40">· Open now</span>
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2.5">
        <span className="flex items-center gap-2 text-[0.78rem] text-white/65">
          <Navigation className="size-3.5 text-brand-glow" /> Directions requests
        </span>
        <span className="font-wide text-[1.15rem] font-extrabold text-white">
          <CountTo to={214} duration={2.4} />
        </span>
      </div>
    </div>
  );
}

// Booking: a week of slots filling in one by one.
const booked = [1, 4, 6, 9, 10, 13, 15, 18];
function BookingSlots() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReduced();
  return (
    <div ref={ref} aria-hidden className={cn(screen, "p-3.5")}>
      <p className="flex items-center justify-between text-[0.78rem] font-semibold text-white/80">
        This week <Example />
      </p>
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
          <span key={d} className="text-center font-mono text-[0.58rem] uppercase text-white/40">
            {d}
          </span>
        ))}
        {Array.from({ length: 20 }).map((_, i) => {
          const order = booked.indexOf(i);
          return (
            <span key={i} className="relative h-6 overflow-hidden rounded-md bg-white/[0.05]">
              {order >= 0 && (
                <motion.span
                  className="absolute inset-0 rounded-md bg-brand"
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={inView || reduce ? { opacity: 1, scale: 1 } : undefined}
                  transition={{ delay: 0.3 + order * 0.22, type: "spring", stiffness: 420, damping: 24 }}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// Social: three post previews fanning out.
function SocialStack() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReduced();
  const posts = [
    { r: -8, x: -46, img: "/images/chef-filming.webp", pos: "object-[50%_40%]" },
    { r: 7, x: 46, img: "/images/aerial-roof.webp", pos: "object-[50%_45%]" },
    { r: 0, x: 0, img: "/images/barbershop-meeting.webp", pos: "object-[50%_55%]" },
  ];
  return (
    <div ref={ref} aria-hidden className={cn(screen, "grid h-44 place-items-center")}>
      <Example className="absolute right-3 top-3" />
      {posts.map((p, i) => (
        <motion.div
          key={p.img}
          className="absolute w-[6.5rem] rounded-xl border border-white/15 bg-panel-2 p-1.5 shadow-[0_18px_30px_-12px_rgb(0_0_0/0.8)]"
          initial={reduce ? false : { rotate: 0, x: 0, opacity: i === 2 ? 1 : 0 }}
          animate={inView || reduce ? { rotate: p.r, x: p.x, opacity: 1 } : undefined}
          transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 160, damping: 18 }}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image src={p.img} alt="" fill sizes="120px" loading="lazy" className={cn("object-cover", p.pos)} />
          </div>
          <span className="mt-1.5 block h-1.5 w-[70%] rounded bg-white/25" />
          <span className="mt-1 block h-1.5 w-[45%] rounded bg-white/10" />
        </motion.div>
      ))}
    </div>
  );
}

// Never miss a lead: missed call → automatic text back.
function TextBack() {
  return (
    <Stagger className={cn(screen, "flex h-44 flex-col justify-end gap-2 p-3.5")} gap={0.35} delay={0.2}>
      <Rise className="flex items-center gap-2 self-start rounded-full bg-white/[0.06] px-3 py-1.5 text-[0.7rem] text-white/60">
        <Phone className="size-3 text-brand-glow" /> Missed call · example
      </Rise>
      <Rise className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-brand px-3 py-2 text-[0.74rem] leading-snug text-white">
        Sorry we missed you! Want us to call back, or book online?
      </Rise>
      <Rise className="max-w-[60%] self-start rounded-2xl rounded-bl-md bg-white/10 px-3 py-2 text-[0.74rem] text-white/85">
        Book online please
      </Rise>
    </Stagger>
  );
}

// Ads: a leads line drawing itself in.
function LeadsChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReduced();
  const d = "M4 92 C 30 88, 44 80, 62 74 S 96 70, 112 56 S 150 46, 168 34 S 200 22, 236 10";
  return (
    <div ref={ref} aria-hidden className={cn(screen, "h-44 p-3.5")}>
      <p className="flex items-center justify-between text-[0.78rem] font-semibold text-white/80">
        Leads from ads <Example />
      </p>
      <svg viewBox="0 0 240 100" preserveAspectRatio="none" className="mt-2 h-[6.6rem] w-full overflow-visible">
        <defs>
          <linearGradient id="leads-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="color-mix(in srgb, var(--color-brand-glow) 35%, transparent)" />
            <stop offset="1" stopColor="color-mix(in srgb, var(--color-brand-glow) 0%, transparent)" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="rgb(255 255 255 / 0.06)" />
        ))}
        <motion.path
          d={`${d} L236 100 L4 100 Z`}
          fill="url(#leads-fill)"
          initial={reduce ? false : { opacity: 0 }}
          animate={inView || reduce ? { opacity: 1 } : undefined}
          transition={{ delay: 1.1, duration: 0.8 }}
        />
        <motion.path
          d={d}
          fill="none"
          stroke="var(--color-brand-glow)"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          animate={inView || reduce ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.6, ease }}
        />
      </svg>
    </div>
  );
}

// Photo, video and drone: the real photo strip.
function PhotoStrip() {
  return (
    <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 md:grid md:grid-cols-4 md:overflow-visible">
      {strip.map((p, i) => (
        <figure key={p.src} className={cn("w-[70%] shrink-0 snap-start md:w-auto", i % 2 ? "md:translate-y-3" : "")}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-white/10">
            <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 200px, (min-width: 768px) 25vw, 70vw" className={cn("object-cover", p.pos)} />
          </div>
          <figcaption className={cn(eyebrow, "mt-2.5 text-white/50")}>{p.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
