"use client";

import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs, promises, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { FadeUp, Panel, RevealHeading, Rise, SpotlightCard, Stagger } from "@/components/fx";

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
    <Panel id="who" className="scroll-mt-24" inner="px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealHeading
          text="Built for where your business is right now."
          accent={2}
          className="max-w-[18ch] text-[2.1rem] md:text-[3.2rem]"
        />

        <Stagger className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 md:gap-6">
          {groups.map((g, i) => (
            <Rise key={g.title} className={cn(i === 1 && "md:translate-y-10")}>
              <SpotlightCard as="article" className="flex h-full flex-col p-3 md:p-4">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[16px]">
                  <Image
                    src={g.photo.src}
                    alt={g.photo.alt}
                    fill
                    sizes="(min-width: 768px) 540px, 100vw"
                    className={cn("object-cover", g.photo.position)}
                  />
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(10_17_32/0.75))]" />
                  <span className="glass absolute bottom-3 left-3 rounded-full bg-[rgb(10_17_32/0.5)] px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-white/85">
                    {i === 0 ? "New business" : "Established"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-3 pb-3 md:px-4 md:pb-4">
                  <h3 className="mt-6 text-[1.7rem] md:text-[2rem]">{g.title}</h3>
                  <p className="mt-3 text-[1.06rem] text-white/60">{g.lede}</p>
                  <p className={cn(label, "mt-7 text-white/45")}>Sound familiar?</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {g.pains.map((t) => (
                      <li key={t} className="flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5">
                        <span aria-hidden className="font-mono text-clay-glow">
                          &ndash;
                        </span>
                        <span className="text-white/85">{t}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pt-7">
                    <p>
                      <span className="block font-semibold">{g.fit}</span>
                      <span className="text-[0.95rem] text-white/55">{g.price}</span>
                    </p>
                    <a href="#packages" className={cn(link, "decoration-white/25 hover:decoration-clay-glow")}>
                      See packages
                    </a>
                  </div>
                </div>
              </SpotlightCard>
            </Rise>
          ))}
        </Stagger>
      </div>
    </Panel>
  );
}

export function Promises() {
  return (
    <Panel aria-labelledby="promises-title" surface="bare" inner="px-2 py-24 md:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <RevealHeading id="promises-title" text="What we promise" accent={1} className="text-[2rem] md:text-[2.8rem]" />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p, i) => (
            <Rise key={p.title} className={cn(i % 2 === 1 && "lg:translate-y-8")}>
              <SpotlightCard className="h-full p-6">
                <span className="font-mono text-[0.8rem] text-clay-glow">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-[1.25rem]">{p.title}</h3>
                <p className="mt-3 text-[0.97rem] text-white/60">{p.body}</p>
              </SpotlightCard>
            </Rise>
          ))}
        </Stagger>
      </div>
    </Panel>
  );
}

export function Faq() {
  return (
    <Panel id="faq" className="scroll-mt-24" inner="px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
        <div className="md:sticky md:top-32 md:self-start">
          <RevealHeading text="Questions we get a lot" accent={2} className="text-[2.1rem] md:text-[3rem]" />
          <p className="mt-5 text-white/60">
            Something else on your mind? Ask on the call
            {site.email ? (
              <>
                , or email{" "}
                <a href={`mailto:${site.email}`} className={cn(link, "text-white decoration-white/25 hover:decoration-clay-glow")}>
                  {site.email}
                </a>
              </>
            ) : null}
            .
          </p>
        </div>
        <FadeUp>
          <Accordion type="single" collapsible defaultValue="q0" className="flex flex-col gap-2.5">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`} className="glass rounded-[18px] border-0 px-5 data-[state=open]:bg-white/[0.07] md:px-6">
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </div>
    </Panel>
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
    <footer className="relative -mt-10 px-3 pb-3 text-white/70 sm:px-4 sm:pb-4 md:-mt-16 md:px-6 md:pb-6">
      <div className="glass relative mx-auto max-w-[1440px] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#0e1729,#080d18)] md:rounded-[32px]">
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
      <div className="relative mx-auto max-w-6xl px-5 pt-24 md:px-8 md:pt-28">
        <div className="flex flex-col justify-between gap-8 border-b border-night-line pb-14 md:flex-row md:items-end">
          <RevealHeading text="Ready to be the one they find first?" accent={1} className="max-w-[16ch] text-[2.2rem] text-white md:text-[3.2rem]" />
          <a
            href="#book"
            className="inline-flex h-14 items-center self-start rounded-full bg-clay shadow-[0_10px_40px_-8px_rgb(232_105_63/0.7)] px-7 text-[1.05rem] font-semibold text-white transition-colors hover:bg-clay-glow md:self-auto"
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
      </div>
    </footer>
  );
}
