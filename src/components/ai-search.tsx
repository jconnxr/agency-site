"use client";

// AI search: customers now ask ChatGPT and friends who to call. Honest copy only:
// no rankings promised, no stats. The chat mock is labelled "Example".
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { prices, usd } from "@/lib/site";
import { IntakeTrigger } from "@/components/intake";
import { FadeUp, Panel, RevealHeading, Rise, SpotlightCard, Stagger, eyebrow } from "./fx";

const tools = ["ChatGPT", "Gemini", "Perplexity", "Claude"];

const points = [
  {
    title: "We fix what AI reads about you",
    body: "Your name, phone, hours and services kept the same on Google, Bing and Apple, which is where ChatGPT and other AI tools look. Plus clear services, prices and FAQs on your own site.",
  },
  {
    title: "We check every month",
    body: "We ask ChatGPT, Gemini, Perplexity and Claude the questions your customers ask, and show you how often you come up.",
  },
  {
    title: "No promises we can't keep",
    body: "Nobody can guarantee the top spot. AI answers change every time someone asks. We make sure the information they use about you is right.",
  },
];

export function AiSearch() {
  return (
    <Panel id="ai-search" surface="glow" className="scroll-mt-24" inner="px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-16">
        <div>
          <p className={cn(eyebrow, "text-brand-glow")}>Google + AI search</p>
          <RevealHeading
            text="Customers are asking AI who to call."
            accent={2}
            className="mt-4 max-w-[18ch] text-[2.1rem] md:text-[3.2rem]"
          />
          <p className="mt-6 max-w-[52ch] text-[1.06rem] leading-relaxed text-white/65">
            More people now ask ChatGPT, Gemini, Perplexity or Claude &ldquo;who&rsquo;s the best plumber near me?&rdquo;
            instead of scrolling Google. Those tools answer from what they can find about your business. We make sure
            what they find is right: your services, your service area, your phone number and your hours.
          </p>
          <p className="mt-4 text-[0.98rem] text-white/50">
            Included in Get Found: Google + AI, or as a one-time AI Visibility Setup for {usd(prices.aiVisibilitySetup)}.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <IntakeTrigger source="AI search: Ask about it">
              <a
                href="#book"
                className="inline-flex h-12 items-center rounded-full bg-brand px-6 font-semibold text-white shadow-[0_10px_40px_-8px_color-mix(in_srgb,var(--color-brand-glow)_70%,transparent)] transition-colors hover:bg-brand-ink"
              >
                Ask what AI says about you
              </a>
            </IntakeTrigger>
            <a
              href="#monthly"
              className="font-semibold underline decoration-white/25 decoration-2 underline-offset-[5px] hover:decoration-brand-glow"
            >
              See the plan
            </a>
          </div>
        </div>

        <FadeUp>
          <ChatExample />
        </FadeUp>
      </div>

      <Stagger className="mx-auto mt-14 grid max-w-6xl gap-4 md:mt-20 md:grid-cols-3">
        {points.map((p) => (
          <Rise key={p.title}>
            <SpotlightCard className="h-full p-6">
              <Check aria-hidden className="size-5 text-brand-glow" />
              <h3 className="mt-5 text-[1.25rem]">{p.title}</h3>
              <p className="mt-3 text-[0.97rem] text-white/60">{p.body}</p>
            </SpotlightCard>
          </Rise>
        ))}
      </Stagger>
    </Panel>
  );
}

// A mock AI chat. Purely illustrative, so it says "Example" and uses no real names.
function ChatExample() {
  return (
    <div className="glass relative rounded-[24px] bg-[color-mix(in_srgb,var(--color-panel)_55%,transparent)] p-5 md:p-6">
      <div className="flex items-center justify-between">
        <span className={cn(eyebrow, "text-white/45")}>Example</span>
        <span className="flex flex-wrap justify-end gap-1.5">
          {tools.map((t) => (
            <span key={t} className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[0.64rem] text-white/55">
              {t}
            </span>
          ))}
        </span>
      </div>

      <p className="ml-auto mt-6 w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white/[0.09] px-4 py-3 text-[0.98rem]">
        Who&rsquo;s the best plumber near Edmond?
      </p>

      <div className="mt-4 flex gap-3">
        <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-brand/20 text-brand-glow">
          <Sparkles aria-hidden className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-[0.95rem] text-white/70">Here are a few well-reviewed options near Edmond:</p>
          <div className="rounded-xl border border-brand/40 bg-brand/10 p-3.5">
            <p className="font-semibold">Your business</p>
            <p className="mt-1 text-[0.88rem] text-white/60">Right services, right hours, right phone number, so the answer is accurate.</p>
          </div>
          {[0, 1].map((i) => (
            <div key={i} aria-hidden className="space-y-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
              <span className="block h-2.5 w-2/5 rounded-full bg-white/15" />
              <span className="block h-2 w-4/5 rounded-full bg-white/[0.08]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
