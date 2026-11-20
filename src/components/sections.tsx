"use client";

import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs, promises, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const label = "font-mono text-[0.7rem] uppercase tracking-[0.08em]";
const link = "font-semibold underline decoration-2 underline-offset-[5px] transition-colors";

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
      photo: {
        src: "/images/contractor-truck.webp",
        alt: "A contractor sitting in his work truck, smiling at a message on his phone",
        position: "object-[50%_38%]",
      },
    },
  ];

  return (
    <section id="who" className="scroll-mt-16 bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <h2 className="max-w-[18ch] text-[2.1rem] md:text-[3.2rem]">
          Built for where your business is right now.
        </h2>

        <div className="mt-12 grid gap-14 md:mt-16 md:grid-cols-2 md:gap-0 md:divide-x md:divide-line">
          {groups.map((g, i) => (
            <article key={g.title} className={cn("flex flex-col", i === 0 ? "md:pr-10" : "md:pl-10")}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-md">
                <Image
                  src={g.photo.src}
                  alt={g.photo.alt}
                  fill
                  sizes="(min-width: 768px) 540px, 100vw"
                  className={cn("object-cover", g.photo.position)}
                />
              </div>
              <h3 className="mt-7 text-[1.7rem] md:text-[2rem]">{g.title}</h3>
              <p className="mt-3 text-[1.06rem] text-muted">{g.lede}</p>
              <p className={cn(label, "mt-7 text-muted")}>Sound familiar?</p>
              <ul className="mt-3 border-t border-line">
                {g.pains.map((t) => (
                  <li key={t} className="flex gap-3 border-b border-line py-3">
                    <span aria-hidden className="font-mono text-clay-ink">
                      &ndash;
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pt-7">
                <p>
                  <span className="block font-semibold">{g.fit}</span>
                  <span className="text-[0.95rem] text-muted">{g.price}</span>
                </p>
                <a href="#packages" className={cn(link, "decoration-line hover:decoration-clay")}>
                  See packages
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// What you get: an index of services, then a strip of photos.
const services = [
  { tier: "Launch", title: "A website that gets calls", body: "Fast, mobile-first, and built around one job: getting people to call or book." },
  { tier: "Get Found", title: "Show up on Google Maps", body: "Weekly posts, fresh photos, review replies and consistent listings everywhere people search." },
  { tier: "Launch Pro", title: "Online booking", body: "Customers pick a time themselves. No more phone tag." },
  { tier: "Get Leads", title: "Social, handled", body: "Three posts a week on two platforms, planned and designed for you." },
  { tier: "Automate", title: "Never miss a lead", body: "Missed calls get a text back, leads get an instant reply, and customers get reminders." },
  { tier: "Get Leads", title: "Ads you can measure", body: "Meta or Google ads with call and form tracking, so you see your cost per lead." },
  { tier: "Full Department", title: "Photo, video and drone", body: "A monthly half-day shoot cut into 8–12 clips, plus quarterly drone footage of your work." },
];

const strip = [
  { src: "/images/local-search-plaza.webp", alt: "A hand holding a phone showing a map and business listing on a brick-storefront street", label: "Google Maps", pos: "object-[50%_45%]" },
  { src: "/images/auto-shop-counter.webp", alt: "A phone showing a text conversation, propped against the register on an auto shop counter", label: "Text-back", pos: "object-[45%_55%]" },
  { src: "/images/chef-filming.webp", alt: "Someone filming a chef plating a dish with a phone on a handheld gimbal", label: "Social", pos: "object-[50%_40%]" },
  { src: "/images/aerial-roof.webp", alt: "Aerial drone photo of a brick home and its roof in an Oklahoma subdivision at golden hour", label: "Drone", pos: "object-[50%_45%]" },
];

export function Showcase() {
  return (
    <section id="what" className="scroll-mt-16 border-y border-line bg-card text-ink">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <h2 className="max-w-[16ch] text-[2.1rem] md:text-[3.2rem]">
            Everything a local business needs online.
          </h2>
          <p className="max-w-[44ch] text-[1.06rem] leading-relaxed text-muted md:self-end">
            One team handles all of it, so your site, Google profile, booking and ads actually work together.
          </p>
        </div>

        <ul className="mt-12 border-t-2 border-ink md:mt-16">
          {services.map((s) => (
            <li
              key={s.title}
             
              className="grid gap-1.5 border-b border-line py-5 md:grid-cols-[17rem_1fr_9rem] md:items-baseline md:gap-10 md:py-6"
            >
              <h3 className="text-[1.25rem] md:text-[1.35rem]">{s.title}</h3>
              <p className="text-muted">{s.body}</p>
              <p className={cn(label, "order-first text-clay-ink md:order-none md:text-right")}>{s.tier}</p>
            </li>
          ))}
        </ul>

        <div className="-mx-5 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pb-0">
          {strip.map((p) => (
            <figure key={p.src} className="w-[72%] shrink-0 snap-start md:w-auto">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 270px, 72vw" className={cn("object-cover", p.pos)} />
              </div>
              <figcaption className={cn(label, "mt-2.5 text-muted")}>{p.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const process = [
  { title: "Free call and Presence Check", body: "We look at your Google listing, site, reviews and competitors, and tell you what's worth doing first, and what isn't.", time: "30 minutes" },
  { title: "We launch it", body: "Fixed price, fixed date. You approve everything before it's public, and Site Care is free for 3 months.", time: "14 to 30 days" },
  { title: "Grow monthly, if you want", body: "Step up to Get Found, Get Leads or Full Department. 3-month minimum, then month to month.", time: "Ongoing" },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 bg-night text-white">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <h2 className="max-w-[16ch] text-[2.1rem] md:text-[3.2rem]">
          From first call to customers calling you.
        </h2>
        <ol className="mt-12 border-t border-night-line md:mt-16">
          {process.map((s, i) => (
            <li
              key={s.title}
             
              className="grid gap-2 border-b border-night-line py-7 md:grid-cols-[5rem_17rem_1fr_9rem] md:items-baseline md:gap-10 md:py-9"
            >
              <span className="font-mono text-[0.9rem] text-clay-glow">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[1.45rem] md:text-[1.6rem]">{s.title}</h3>
              <p className="max-w-[52ch] text-white/70">{s.body}</p>
              <p className={cn(label, "text-white/50 md:text-right")}>{s.time}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Promises() {
  return (
    <section aria-labelledby="promises-title" className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <h2 id="promises-title" className="text-[1.8rem] md:text-[2.4rem]">
          What we promise
        </h2>
        <div className="mt-10 grid border-t-2 border-ink sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-line">
          {promises.map((p, i) => (
            <div
              key={p.title}
             
              className={cn("border-b border-line py-7 lg:border-b-0", i === 0 ? "lg:pr-7" : i === 3 ? "lg:pl-7" : "lg:px-7")}
            >
              <h3 className="text-[1.2rem]">{p.title}</h3>
              <p className="mt-3 text-[0.97rem] text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-t border-line bg-paper text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1fr_1.6fr] md:gap-16 md:px-8 md:py-28">
        <div className="md:sticky md:top-28 md:self-start">
          <h2 className="text-[2.1rem] md:text-[3rem]">
            Questions we get a lot
          </h2>
          <p className="mt-5 text-muted">
            Something else on your mind? Ask on the call
            {site.email ? (
              <>
                , or email{" "}
                <a href={`mailto:${site.email}`} className={cn(link, "text-ink decoration-line hover:decoration-clay")}>
                  {site.email}
                </a>
              </>
            ) : null}
            .
          </p>
        </div>
        <Accordion type="single" collapsible defaultValue="q0" className="border-t-2 border-ink">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`q${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

const footerLinks = [
  { href: "#story", label: "How it works" },
  { href: "#who", label: "Who it's for" },
  { href: "#what", label: "What you get" },
  { href: "#packages", label: "Packages" },
  { href: "#book", label: "Book a call" },
  { href: "#faq", label: "Questions" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-white/70">
      {/* Sunset drone shot behind the closing call to action, fading into the footer */}
      <div className="absolute inset-x-0 top-0 h-[380px] [mask-image:linear-gradient(to_bottom,black_55%,transparent)] md:h-[290px] md:[mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
        <Image
          src="/images/drone-operator.webp"
          alt="Hands holding a drone controller in an Oklahoma field at sunset, with the drone flying overhead"
          fill
          sizes="100vw"
          className="object-cover object-[62%_20%] md:object-[50%_12%]"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,18,32,0.62)_0%,rgba(11,18,32,0.25)_50%,rgba(11,18,32,0)_100%)]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 pt-20 md:px-8">
        <div className="flex flex-col justify-between gap-8 border-b border-night-line pb-14 md:flex-row md:items-end">
          <h2 className="max-w-[16ch] text-[2.2rem] text-white md:text-[3.2rem]">Ready to be the one they find first?</h2>
          <a
            href="#book"
            className="inline-flex h-14 items-center self-start rounded-sm bg-clay px-7 text-[1.05rem] font-semibold text-white transition-colors hover:bg-clay-glow md:self-auto"
          >
            Book a free 30-minute call
          </a>
        </div>

        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-wide text-xl font-extrabold text-white">{site.name}</p>
            <p className="mt-3 max-w-[40ch] text-[0.95rem]">
              Websites, Google profiles, booking, social and ads for local businesses in {site.city}.
            </p>
            {site.email ? (
              <a href={`mailto:${site.email}`} className="mt-5 inline-block font-semibold text-clay-glow hover:text-white">
                {site.email}
              </a>
            ) : null}
          </div>
          <nav aria-label="Footer">
            <p className={cn(label, "text-white/45")}>Explore</p>
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
            <p className={cn(label, "text-white/45")}>Service area</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[0.95rem]">
              {site.serviceArea.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-night-line py-6 font-mono text-[0.75rem] text-white/45 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.name}
          </p>
          <p>Based in {site.city}</p>
        </div>
      </div>
    </footer>
  );
}
