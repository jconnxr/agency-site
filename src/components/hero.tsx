import { site } from "@/lib/site";

// Above the fold, built for the 5-second test on a phone: what we do, where,
// and one way to book. The phone story starts right below it.
export function Hero() {
  return (
    <section id="top" className="relative bg-night text-white">
      <div className="mx-auto max-w-6xl px-5 pb-14 pt-10 md:px-8 md:pb-24 md:pt-20">
        <p className="flex items-center gap-2.5 font-mono text-[0.78rem] uppercase tracking-[0.08em] text-white/60">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-clay-glow opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-clay-glow" />
          </span>
          {site.city} &middot; taking new clients
        </p>

        <div className="mt-6 grid gap-10 md:mt-8 md:grid-cols-[1fr_18rem] md:gap-14 lg:grid-cols-[1fr_20rem]">
          <div className="md:self-center">
            <h1 className="max-w-[17ch] text-[2.15rem] leading-[1.02] sm:text-[3.2rem] lg:text-[4.3rem]">
              We set up the online side of your business, then keep it bringing in customers.
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

          <div>
            <MetroMap className="hidden md:block" />
            {/* Spec sheet: three facts that answer "what does it cost and how fast" */}
            <dl className="grid grid-cols-3 gap-4 border-t border-night-line pt-5 md:mt-6 md:grid-cols-1 md:gap-0 md:divide-y md:divide-night-line md:pt-0">
              {[
                { k: "Websites from", v: "$750" },
                { k: "Live in", v: "14 days" },
                { k: "You own", v: "everything" },
              ].map((f) => (
                <div key={f.k} className="md:flex md:items-baseline md:justify-between md:py-3.5">
                  <dt className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-white/50">{f.k}</dt>
                  <dd className="mt-1 font-wide text-lg font-bold text-white md:mt-0 md:text-xl">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

// Hairline sketch of the OKC metro: main highways, the Oklahoma River and the
// lakes, with a soft pulse on each city in the service area. Stylized, not to scale.
const towns = [
  { name: "Edmond", x: 158, y: 52, lx: 8, anchor: "start" },
  { name: "Yukon", x: 52, y: 150, lx: 0, ly: -10, anchor: "middle" },
  { name: "Oklahoma City", x: 146, y: 152, lx: -8, anchor: "end" },
  { name: "Midwest City", x: 222, y: 150, lx: 0, ly: -10, anchor: "middle" },
  { name: "Moore", x: 152, y: 222, lx: 8, anchor: "start" },
  { name: "Norman", x: 156, y: 272, lx: 8, anchor: "start" },
] as const;

function MetroMap({ className }: { className?: string }) {
  return (
    <figure className={className} aria-hidden>
      <svg viewBox="0 0 300 300" className="h-auto w-full">
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* lakes: Hefner, Overholser, Thunderbird */}
          <g stroke="rgb(255 255 255 / 0.16)" strokeWidth="0.8">
            <path d="M100 98 c8 -9 24 -8 28 2 c4 10 -6 18 -16 17 c-10 -1 -18 -9 -12 -19z" />
            <path d="M68 146 c4 -6 13 -6 15 0 c2 6 -3 10 -9 10 c-5 0 -9 -5 -6 -10z" />
            <path d="M222 262 c10 -10 30 -6 34 4 c3 9 -10 14 -20 16 c-12 2 -22 -10 -14 -20z" />
          </g>
          {/* Oklahoma River */}
          <path
            d="M18 168 C 50 160, 80 176, 112 166 S 160 158, 186 170 S 226 178, 250 168"
            stroke="rgb(232 105 63 / 0.35)"
            strokeWidth="1.1"
          />
          {/* highways */}
          <g stroke="rgb(255 255 255 / 0.22)" strokeWidth="0.9">
            {/* I-35 */}
            <path d="M168 0 L160 60 L152 150 L152 230 L157 300" />
            {/* I-40 */}
            <path d="M0 152 L120 152 L190 156 L300 158" />
            {/* I-44 */}
            <path d="M48 300 L118 205 L126 140 L132 112 L176 92 L300 44" />
            {/* I-240 */}
            <path d="M118 202 L230 198" />
          </g>
          {/* Kilpatrick Turnpike */}
          <path d="M70 172 C 66 120, 96 78, 150 70 S 232 74, 252 96" stroke="rgb(255 255 255 / 0.12)" strokeWidth="0.8" strokeDasharray="3 3" />
        </g>

        {towns.map((t, i) => (
          <g key={t.name} transform={`translate(${t.x} ${t.y})`}>
            <circle r="7" className="okc-pulse" style={{ animationDelay: `${i * 0.6}s` }} fill="rgb(232 105 63 / 0.35)" />
            <circle r={t.name === "Oklahoma City" ? 3 : 2.2} fill="var(--color-clay-glow)" />
            <text
              x={t.lx}
              y={"ly" in t ? t.ly : 3.5}
              textAnchor={t.anchor}
              className="fill-white/55 font-mono"
              style={{ fontSize: 9, letterSpacing: "0.04em" }}
            >
              {t.name}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
