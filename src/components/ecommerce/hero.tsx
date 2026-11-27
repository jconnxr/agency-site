// /ecommerce hero. The headline reveal is CSS (.hero-word), like the homepage and
// /partners, so it plays on first paint without waiting for JavaScript. The ad
// and flow cards on the right are illustrations, labelled "Example": no real
// brand, no real numbers.
import { ArrowRight, Mail, MessageSquare, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const HEADLINE = "Grow your online store.";

export function EcomHero() {
  const words = HEADLINE.split(" ");
  return (
    <section id="top" className="relative overflow-x-clip px-3 pb-20 pt-28 sm:px-4 md:px-6 md:pb-32 md:pt-36">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-2 md:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="relative z-10">
          <p className="glass inline-flex max-w-full items-center gap-2.5 rounded-full py-1.5 pl-2.5 pr-4 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-white/70">
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-brand-glow" />
            <span className="truncate">E-commerce Growth · for online brands</span>
          </p>

          <h1 className="mt-6 max-w-[12ch] text-[2.75rem] leading-[1.02] text-white sm:text-[3.4rem] md:mt-8 md:text-[4rem] xl:text-[4.6rem]">
            {words.map((w, i) => {
              const last = i === words.length - 1;
              return (
                <span key={i}>
                  <span
                    className={cn(
                      "hero-word",
                      last &&
                        "pr-1 font-serif text-[1.18em] font-normal italic leading-[0.9] tracking-[-0.01em] text-brand-glow [font-stretch:100%]"
                    )}
                    style={{ animationDelay: `${0.08 + i * 0.07}s` }}
                  >
                    {w}
                  </span>
                  {last ? null : " "}
                </span>
              );
            })}
          </h1>

          <p className="mt-5 max-w-[44ch] text-[1.06rem] leading-relaxed text-white/70 md:mt-7 md:text-lg">
            Ads, creative and email automation for online brands, built and run by a small team that does the work
            itself.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4 md:mt-10">
            <a
              href="#request"
              className="inline-flex h-14 items-center rounded-full bg-brand px-7 text-[1.05rem] font-semibold text-white shadow-[0_10px_40px_-8px_color-mix(in_srgb,var(--color-brand-glow)_70%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-brand-ink"
            >
              Get a free Store Audit
            </a>
            <a
              href="#services"
              className="inline-flex min-h-11 items-center font-semibold text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-white"
            >
              See what we do
            </a>
          </div>

          {/* Each item stays on one line; the list wraps between items, never inside one */}
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-white/45">
            {["Shopify", "Meta ads", "Klaviyo", "You own every account"].map((t) => (
              <li key={t} className="whitespace-nowrap">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <Visual />
      </div>
    </section>
  );
}

const flow = [
  { icon: ShoppingCart, k: "Cart abandoned", v: "Trigger" },
  { icon: Mail, k: "Reminder email", v: "1 hour later" },
  { icon: MessageSquare, k: "SMS nudge", v: "Next day" },
];

function Visual() {
  return (
    <div aria-hidden className="relative mx-auto mb-10 w-full max-w-[25rem] sm:mb-0 lg:mr-0">
      <span className="absolute left-1/2 top-1/2 size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-brand-glow)_42%,transparent),color-mix(in_srgb,var(--color-brand)_12%,transparent)_55%,transparent)]" />

      {/* An ad, the way it shows in a feed */}
      <div className="glass relative w-[78%] rotate-[-3deg] rounded-[24px] bg-[color-mix(in_srgb,var(--color-panel)_78%,transparent)] p-3.5">
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-[linear-gradient(135deg,var(--color-brand),var(--color-violet-glow))]" />
            <span className="text-[0.78rem] font-semibold text-white">yourstore</span>
            <span className="text-[0.68rem] text-white/45">Sponsored</span>
          </span>
          <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-white/45">
            Example
          </span>
        </div>
        {/* Product shot: an abstract bottle on a soft set, no real brand */}
        <div className="relative mt-3 grid aspect-[4/3.4] place-items-center overflow-hidden rounded-[16px] bg-[radial-gradient(80%_70%_at_50%_30%,color-mix(in_srgb,var(--color-brand-pale)_45%,transparent),transparent_70%),linear-gradient(180deg,#2a3557,#1a2238)]">
          <span className="absolute bottom-[14%] h-3 w-[46%] rounded-[50%] bg-black/35 blur-[6px]" />
          <span className="relative flex flex-col items-center">
            <span className="h-5 w-7 rounded-t-md bg-white/85" />
            <span className="grid h-28 w-20 place-items-center rounded-[18px] bg-[linear-gradient(160deg,#ffffff,#c9d2ff_70%)] shadow-[inset_-6px_0_14px_rgb(70_76_235/0.25)]">
              <span className="h-8 w-12 rounded-md bg-brand/85" />
            </span>
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 px-1">
          <span className="min-w-0">
            <span className="block h-2 w-24 rounded bg-white/30" />
            <span className="mt-1.5 block h-2 w-16 rounded bg-white/12" />
          </span>
          <span className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-brand px-3 text-[0.72rem] font-semibold text-white">
            Shop now <ArrowRight className="size-3" />
          </span>
        </div>
      </div>

      {/* The flow that catches the cart, overlapping the ad */}
      <div className="glass absolute -bottom-8 right-0 w-[62%] rotate-[3deg] rounded-[20px] bg-[color-mix(in_srgb,var(--color-panel-2)_88%,transparent)] p-3.5 sm:-right-6">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-brand-glow">Abandoned cart flow</p>
        <ol className="mt-2.5 grid gap-1.5">
          {flow.map((f, i) => (
            <li
              key={f.k}
              className="partner-tick flex items-center gap-2.5 rounded-xl bg-white/[0.05] px-2.5 py-2"
              style={{ animationDelay: `${0.6 + i * 0.3}s` }}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-brand/30 text-brand-pale">
                <f.icon className="size-3.5" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[0.76rem] font-semibold text-white">{f.k}</span>
                <span className="block text-[0.66rem] text-white/50">{f.v}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
