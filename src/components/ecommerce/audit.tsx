"use client";

// The free Store Audit: the page's main offer, on the cream island like the
// homepage packages. The card on the right is a sample of the deliverable, for
// a made-up store: labelled "Sample", no real brand, no metrics.
import { FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { auditChecks, auditTurnaround } from "@/lib/ecommerce";
import { FadeUp, Panel, RevealHeading, Rise, Stagger } from "@/components/fx";

const label = "font-mono text-[0.7rem] uppercase tracking-[0.08em]";

const sampleFixes = [
  { area: "Ads", fix: "Split retargeting: cart abandoners and product viewers get different ads", first: true },
  { area: "Email", fix: "No abandoned-cart flow is running. Set one up before anything else" },
  { area: "Speed", fix: "Product page images load full size on mobile. Compress and resize" },
  { area: "Checkout", fix: "Shipping cost first shows at the last step. Show it on the product page" },
  { area: "AI", fix: "Add plain FAQs and specs to product pages so AI assistants can cite them" },
];

export function StoreAudit() {
  return (
    <Panel id="audit" surface="cream" className="scroll-mt-24" inner="px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <p className={cn(label, "text-brand")}>The free Store Audit</p>
          <RevealHeading
            text="Your top 5 fixes, free."
            accent={2}
            accentClass="text-brand"
            className="mt-4 text-[2.1rem] md:text-[3.2rem]"
          />
          <p className="mt-5 max-w-[48ch] text-[1.06rem] leading-relaxed text-muted">
            We go through your store the way a new customer and an ad account would, then send back the five changes
            we&rsquo;d make first. No pitch required: keep the list and do it yourself if you like.
          </p>

          <dl className="mt-8 border-t border-line">
            {auditChecks.map((c) => (
              <div key={c.k} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt className="font-semibold">{c.k}</dt>
                <dd className="text-[0.96rem] text-muted">{c.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#request"
              className="inline-flex h-14 items-center rounded-full bg-brand px-7 text-[1.05rem] font-semibold text-white shadow-[0_10px_30px_-10px_color-mix(in_srgb,var(--color-brand)_70%,transparent)] transition-colors hover:bg-brand-ink"
            >
              Get my free Store Audit
            </a>
            <p className="text-[0.95rem] text-muted">Back in {auditTurnaround}.</p>
          </div>
        </div>

        {/* Sample deliverable */}
        <FadeUp className="lg:pt-10">
          <figure className="relative rotate-0 rounded-[24px] bg-[radial-gradient(90%_70%_at_100%_0%,color-mix(in_srgb,var(--color-brand-glow)_30%,transparent),transparent_60%),linear-gradient(160deg,var(--color-panel-2),var(--color-night))] p-5 text-white shadow-[0_40px_80px_-40px_rgb(15_26_42/0.75)] md:p-7 lg:rotate-[1.5deg]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className={cn(label, "flex items-center gap-2 text-brand-glow")}>
                  <FileCheck2 aria-hidden className="size-4" /> Store Audit
                </p>
                <p className="mt-2 truncate font-wide text-[1.3rem] font-extrabold">yourstore.com</p>
              </div>
              <span className="shrink-0 rounded-full border border-white/20 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-white/60">
                Sample
              </span>
            </div>

            <p className={cn(label, "mt-6 text-white/50")}>Top 5 fixes, in the order we&rsquo;d do them</p>
            <Stagger as="ol" className="mt-3 grid gap-2" gap={0.1}>
              {sampleFixes.map((f, i) => (
                <Rise
                  as="li"
                  key={f.fix}
                  className={cn(
                    "flex gap-3 rounded-xl px-3.5 py-3",
                    f.first ? "border border-brand-glow/45 bg-brand/20" : "bg-white/[0.05]"
                  )}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-brand-glow/60 font-mono text-[0.7rem] text-brand-glow">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={cn(label, "block text-[0.62rem] text-white/50")}>{f.area}</span>
                    <span className="mt-0.5 block text-[0.93rem] leading-snug text-white/90">{f.fix}</span>
                  </span>
                </Rise>
              ))}
            </Stagger>
            <figcaption className="mt-5 border-t border-white/10 pt-4 text-[0.82rem] text-white/50">
              Illustrative only, for a made-up store. Yours is written for your store.
            </figcaption>
          </figure>
        </FadeUp>
      </div>
    </Panel>
  );
}
