import { site } from "@/lib/site";

// Above the fold, built for the 5-second test on a phone: what we do, where,
// and one way to book. The phone story starts right below it.
export function Hero() {
  return (
    <section id="top" className="relative bg-night text-white">
      <div className="mx-auto max-w-6xl px-5 pb-14 pt-10 md:px-8 md:pb-24 md:pt-24">
        <p className="flex items-center gap-2.5 font-mono text-[0.78rem] uppercase tracking-[0.08em] text-white/60">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-clay-glow opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-clay-glow" />
          </span>
          {site.city} &middot; taking new clients
        </p>

        <div className="mt-6 grid gap-10 md:mt-8 md:grid-cols-[1fr_17rem] md:items-end md:gap-16">
          <div>
            <h1 className="max-w-[17ch] text-[2.15rem] leading-[1.02] sm:text-[3.2rem] lg:text-[4.3rem]">
              We set up the online side of your business, then keep it{" "}
              <span className="text-clay-glow">bringing in customers.</span>
            </h1>
            <p className="mt-6 max-w-[48ch] text-[1.06rem] leading-relaxed text-white/75 md:mt-8 md:text-lg">
              Websites, Google Business Profiles, online booking, social media and ads for {site.city} businesses.
              Start with the basics on day one, add a monthly team when you&rsquo;re ready.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4 md:mt-9">
              <a
                href="#book"
                className="inline-flex h-14 items-center rounded-sm bg-clay px-7 text-[1.05rem] font-semibold text-white transition-colors hover:bg-clay-glow"
              >
                Book a free 30-minute call
              </a>
              <a
                href="#packages"
                className="font-semibold text-white underline decoration-white/35 underline-offset-[6px] transition-colors hover:decoration-white"
              >
                See packages and prices
              </a>
            </div>
          </div>

          {/* Spec sheet: three facts that answer "what does it cost and how fast" */}
          <dl className="grid grid-cols-3 gap-4 border-t border-night-line pt-5 md:grid-cols-1 md:gap-0 md:divide-y md:divide-night-line md:pt-0">
            {[
              { k: "Websites from", v: "$750" },
              { k: "Live in", v: "14 days" },
              { k: "You own", v: "everything" },
            ].map((f) => (
              <div key={f.k} className="md:py-4">
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-white/50">{f.k}</dt>
                <dd className="mt-1 font-wide text-lg font-bold text-white md:text-xl">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
