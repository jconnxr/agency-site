import { Button } from "@/components/ui/button";
import { addons, automate, founding, launch, plans, type Option } from "@/lib/site";
import { cn } from "@/lib/utils";

// Packages on warm paper: rules and columns instead of cards, mono for the data.
// Order follows how clients move: Launch (one-time) → three monthly plans → Automate.
export function Packages() {
  return (
    <section id="packages" className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <h2 data-reveal className="text-[2.1rem] md:text-[3.2rem]">
            Five packages. Each one solves one problem.
          </h2>
          <div data-reveal className="md:pt-3">
            <p className="text-[1.06rem] leading-relaxed text-muted">
              Pick the one that matches where you are. Monthly plans stack, so each includes everything in the one
              before it.
            </p>
            <Path />
          </div>
        </div>

        <Founding />

        <Group
          id="launch"
          label="One-time project"
          title={launch.name}
          problem={launch.problem}
          bestFor={launch.bestFor}
        >
          <Options options={launch.options} notes={{ 1: "Payment plan available" }} />
          <dl className="mt-8 grid gap-6 border-t border-line pt-6 text-[0.98rem] md:grid-cols-2 md:gap-10">
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted">Included</dt>
              <dd className="mt-1.5">{launch.note}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-clay-ink">Launch + Get Found bundle</dt>
              <dd className="mt-1.5">{launch.bundle}</dd>
            </div>
          </dl>
        </Group>

        <Monthly />

        <Group
          id="automate"
          label="One-time project"
          title={automate.name}
          problem={automate.problem}
          bestFor={automate.bestFor}
        >
          <Options options={automate.options} />
          <p className="mt-8 border-t border-line pt-6 text-[0.98rem] text-muted">{automate.note}</p>
        </Group>

        <AlaCarte />
      </div>
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
    <div className="mt-7">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted">The path most clients take</p>
      <ol className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-semibold">
        {steps.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2.5">
            <a href={s.href} className="underline decoration-line decoration-2 underline-offset-[5px] hover:decoration-clay">
              {s.label}
            </a>
            {i < steps.length - 1 && (
              <span aria-hidden className="font-mono text-muted">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-1.5 text-[0.95rem] text-muted">
        Plus{" "}
        <a href="#automate" className="font-semibold text-ink underline decoration-line decoration-2 underline-offset-[5px] hover:decoration-clay">
          Automate
        </a>{" "}
        whenever busywork piles up.
      </p>
    </div>
  );
}

function Founding() {
  return (
    <div
      data-reveal
      className="mt-14 grid gap-5 border-l-[3px] border-clay bg-card py-6 pl-6 pr-6 md:grid-cols-[1fr_auto] md:items-center md:gap-12 md:pl-8"
    >
      <div>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-clay-ink">
          Founding client offer &middot; first {founding.spots} clients
        </p>
        <p className="mt-2 max-w-[70ch] text-[1.02rem] leading-relaxed">{founding.body}</p>
      </div>
      <Button asChild variant="outline" className="self-start md:self-auto">
        <a href="#book">Ask about a founding spot</a>
      </Button>
    </div>
  );
}

function Group({
  id,
  label,
  title,
  problem,
  bestFor,
  children,
}: {
  id: string;
  label: string;
  title: string;
  problem: string;
  bestFor: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="mt-20 scroll-mt-24 border-t-2 border-ink pt-8 md:mt-24">
      <div className="grid gap-8 md:grid-cols-[15rem_1fr] md:gap-14">
        <div data-reveal>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted">{label}</p>
          <h3 className="mt-2 text-[2.2rem] md:text-[2.6rem]">{title}</h3>
          <p className="mt-4 text-[1.02rem] font-semibold leading-snug">&ldquo;{problem}&rdquo;</p>
          <p className="mt-2 text-[0.95rem] text-muted">Best for: {bestFor}</p>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function Options({ options, notes = {} }: { options: Option[]; notes?: Record<number, string> }) {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-line">
      {options.map((o, i) => (
        <article key={o.name} data-reveal className={cn("flex min-w-0 flex-col", i === 0 ? "md:pr-10" : "md:pl-10")}>
          <h4 className="font-wide text-[1.35rem] font-bold">{o.name}</h4>
          {o.liveBy && (
            <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-clay-ink">{o.liveBy}</p>
          )}
          <p className="mt-4 font-wide text-[2.6rem] font-extrabold leading-none">{o.price}</p>
          <p className="mt-2 text-[0.92rem] text-muted">
            {o.priceNote}
            {notes[i] && <span className="font-semibold text-ink"> &middot; {notes[i]}</span>}
          </p>
          <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-[0.98rem]">
            {o.includes.map((inc) => (
              <li key={inc} className="flex gap-3">
                <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 bg-clay" />
                <span>{inc}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <a href="#book">Start with {o.name}</a>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

// Monthly plans: three columns on one rule. The bars at the top of each column
// grow by one, because each plan includes the one before it.
function Monthly() {
  return (
    <div id="monthly" className="mt-20 scroll-mt-24 border-t-2 border-ink pt-8 md:mt-24">
      <div data-reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-14">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted">Monthly plans</p>
          <h3 className="mt-2 text-[2.2rem] md:text-[2.6rem]">Plans that stack</h3>
        </div>
        <p className="max-w-[44ch] text-[1.02rem] text-muted md:text-right">
          3-month minimum, then month to month. Move up a step whenever you&rsquo;re ready.
        </p>
      </div>

      <div className="mt-10 grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
        {plans.map((p, i) => (
          <article
            key={p.name}
            data-reveal
            className={cn("flex min-w-0 flex-col", i === 0 ? "md:pr-8" : i === 1 ? "md:px-8" : "md:pl-8")}
          >
            <div className="flex items-end justify-between">
              <span aria-hidden className="flex items-end gap-1">
                {[0, 1, 2].map((b) => (
                  <span key={b} className={cn("w-2.5", b <= i ? "bg-clay" : "bg-line")} style={{ height: 8 + b * 7 }} />
                ))}
              </span>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted">Step {i + 1}</span>
            </div>
            <h4 className="mt-5 font-wide text-[1.6rem] font-extrabold">{p.name}</h4>
            <p className="mt-2 min-h-[3em] font-semibold leading-snug">&ldquo;{p.problem}&rdquo;</p>
            <p className="text-[0.92rem] text-muted">Best for: {p.bestFor}</p>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-wide text-[2.3rem] font-extrabold leading-none">{p.price}</span>
              <span className="text-[0.92rem] text-muted">{p.priceNote}</span>
            </p>
            <div className="mt-6 border-t border-line pt-5">
              {p.base && <p className="mb-3 text-[0.95rem] font-semibold">Everything in {p.base}, plus:</p>}
              <ul className="space-y-2.5 text-[0.96rem]">
                {p.includes.map((inc) => (
                  <li key={inc} className="flex gap-3">
                    <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 bg-clay" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-6">
              <p className="text-[0.88rem] text-muted">{p.terms}</p>
              <Button asChild variant="outline" size="lg" className="mt-5 w-full sm:w-auto md:w-full">
                <a href="#book">Talk about {p.name}</a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AlaCarte() {
  return (
    <div className="mt-20 grid gap-8 border-t-2 border-ink pt-8 md:mt-24 md:grid-cols-[15rem_1fr] md:gap-14">
      <div data-reveal>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted">&Agrave; la carte</p>
        <h3 className="mt-2 text-[2.2rem] md:text-[2.6rem]">Need just one thing?</h3>
        <p className="mt-4 text-muted">Book any of these on their own, or add them to a package.</p>
        <a
          href="#book"
          className="mt-4 inline-block font-semibold underline decoration-line decoration-2 underline-offset-[5px] hover:decoration-clay"
        >
          Ask about a one-off
        </a>
      </div>
      <ul data-reveal className="border-t border-line md:border-t-0">
        {addons.map((a) => (
          <li key={a.name} className="flex items-baseline gap-4 border-b border-line py-3.5">
            <span>{a.name}</span>
            <span aria-hidden className="flex-1 translate-y-[-4px] border-b border-dotted border-line" />
            <span className="shrink-0 font-mono text-[0.92rem] font-medium">{a.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
