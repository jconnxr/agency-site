"use client";

// Earnings / perk estimate. All numbers come from src/lib/partners.ts (fees) and
// src/lib/site.ts (prices), and the formula is printed under the result.
// Bank and credit union employees are locked to the client-discount option.
import { useId, useState } from "react";
import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFoundFee, payoutNote, terms } from "@/lib/partners";
import { usd } from "@/lib/site";
import { FadeUp, Panel, RevealHeading, eyebrow } from "@/components/fx";
import { usePartner } from "./state";

type Mode = "fee" | "discount";

const money = (n: number) => usd(Math.round(n));
const cents = (n: number) => `$${n.toFixed(2)}`;

export function Calculator() {
  const { clients, setClients, bank, setBank } = usePartner();
  const [modeChoice, setMode] = useState<Mode>("fee");
  const [pro, setPro] = useState(50);
  const [found, setFound] = useState(30);
  const mode: Mode = bank ? "discount" : modeChoice;
  const id = useId();

  const perClient = (pro / 100) * terms.feePro + (1 - pro / 100) * terms.feeEssentials + (found / 100) * getFoundFee;
  const yearlyFee = clients * 12 * perClient;
  const yearlySavings = clients * 12 * terms.clientDiscount;
  const result = mode === "fee" ? yearlyFee : yearlySavings;

  return (
    <Panel id="earnings" surface="glow" className="scroll-mt-24" inner="px-4 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl px-1">
          <p className={cn(eyebrow, "text-brand-glow")}>Your side of it</p>
          <RevealHeading text="Take the fee, or give the discount." accent={2} className="mt-4 text-[2.1rem] md:text-[3.2rem]" />
          <p className="mt-5 max-w-[56ch] text-[1.06rem] leading-relaxed text-white/65">
            {usd(terms.feePro)} per Launch Pro, {usd(terms.feeEssentials)} per Launch Essentials, and 10% of the first{" "}
            {terms.getFoundMonths} months of Get Found: Google + AI. Or pass {usd(terms.clientDiscount)} off any Launch
            package to your client instead.
          </p>
        </div>

        <FadeUp className="mt-10 grid gap-5 md:mt-12 lg:grid-cols-[1.3fr_1fr] lg:gap-6">
          <div className="glass rounded-[24px] p-5 md:p-8">
            {/* Mode: native radios, styled as a segmented control */}
            <fieldset disabled={bank}>
              <legend className={cn(eyebrow, "mb-3 text-white/55")}>How you&rsquo;d like it</legend>
              <div className="grid grid-cols-2 gap-1 rounded-full bg-white/[0.06] p-1">
                {(
                  [
                    ["fee", "Pay me the referral fee"],
                    ["discount", `Give my client ${usd(terms.clientDiscount)} off`],
                  ] as const
                ).map(([v, label]) => (
                  <label
                    key={v}
                    className={cn(
                      "relative flex min-h-12 cursor-pointer items-center justify-center rounded-full px-3 py-2 text-center text-[0.9rem] font-semibold leading-tight transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-glow sm:text-[0.95rem]",
                      mode === v ? "bg-brand text-white shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--color-brand-glow)_80%,transparent)]" : "text-white/70 hover:text-white",
                      bank && "cursor-not-allowed",
                      bank && v === "fee" && "opacity-45"
                    )}
                  >
                    <input
                      type="radio"
                      name={`${id}-mode`}
                      value={v}
                      checked={mode === v}
                      onChange={() => setMode(v)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 rounded-xl bg-white/[0.04] px-3.5 py-3 text-[0.95rem] text-white/85">
              <input
                type="checkbox"
                checked={bank}
                onChange={(e) => setBank(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-brand"
                aria-describedby={bank ? `${id}-bank` : undefined}
              />
              <span>
                <span className="font-medium">I work at a bank or credit union</span>
                {bank && (
                  <span id={`${id}-bank`} className="mt-1 flex items-start gap-2 text-[0.88rem] text-white/60">
                    <Landmark aria-hidden className="mt-0.5 size-3.5 shrink-0 text-brand-glow" />
                    Bank and credit union employees take the client discount only, with no fee, so it fits bank policy.
                  </span>
                )}
              </span>
            </label>

            <div className="mt-8 grid gap-7">
              <Slider
                id={`${id}-clients`}
                label="New business clients you refer per month"
                value={clients}
                min={1}
                max={10}
                onChange={setClients}
                display={`${clients}`}
              />
              <Slider
                id={`${id}-pro`}
                label="How many choose Launch Pro (the rest choose Essentials)"
                value={pro}
                min={0}
                max={100}
                step={10}
                onChange={setPro}
                display={`${pro}% Pro · ${100 - pro}% Essentials`}
                muted={mode === "discount"}
              />
              <Slider
                id={`${id}-found`}
                label="How many add Get Found: Google + AI"
                value={found}
                min={0}
                max={100}
                step={10}
                onChange={setFound}
                display={`${found}%`}
                muted={mode === "discount"}
              />
              {mode === "discount" && (
                <p className="-mt-3 text-[0.88rem] text-white/50">
                  The package mix doesn&rsquo;t change the discount: every Launch package gets {usd(terms.clientDiscount)} off.
                </p>
              )}
            </div>
          </div>

          <div className="relative order-first flex flex-col justify-between overflow-hidden rounded-[24px] lg:order-none bg-[radial-gradient(90%_80%_at_100%_0%,color-mix(in_srgb,var(--color-brand-glow)_35%,transparent),transparent_60%),linear-gradient(160deg,var(--color-panel-2),var(--color-night))] p-6 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-brand-glow)_25%,transparent),0_30px_80px_-30px_rgb(0_0_0/0.8)] md:p-8">
            <div aria-live="polite" aria-atomic="true">
              <p className={cn(eyebrow, "text-white/55")}>
                {mode === "fee" ? "Estimated referral fees per year" : "Estimated client savings per year"}
              </p>
              <p className="mt-4 font-wide text-[3.2rem] font-extrabold leading-none tracking-[-0.02em] text-white tabular-nums md:text-[4rem]">
                {money(result)}
              </p>
              <p className="mt-2 text-[0.95rem] text-white/60">
                {mode === "fee" ? `about ${money(yearlyFee / 12)} a month` : `${usd(terms.clientDiscount)} off for each of ${clients * 12} clients`}
              </p>
            </div>

            <dl className="mt-8 grid gap-2.5 text-[0.95rem]">
              {(mode === "fee"
                ? [
                    ["From Launch Pro", money(clients * 12 * (pro / 100) * terms.feePro)],
                    ["From Launch Essentials", money(clients * 12 * (1 - pro / 100) * terms.feeEssentials)],
                    ["From Get Found: Google + AI", money(clients * 12 * (found / 100) * getFoundFee)],
                  ]
                : [
                    ["Clients helped per year", String(clients * 12)],
                    ["Off each Launch package", usd(terms.clientDiscount)],
                    ["Fee to you", usd(0)],
                  ]
              ).map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] pb-2.5 last:border-b-0 last:pb-0">
                  <dt className="text-white/60">{k}</dt>
                  <dd className="font-mono font-medium text-white tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="font-mono text-[0.78rem] leading-relaxed text-white/60">
                {mode === "fee" ? (
                  <>
                    {clients} × 12 months × ({pro}% × {usd(terms.feePro)} + {100 - pro}% × {usd(terms.feeEssentials)} + {found}% ×{" "}
                    {cents(getFoundFee)}) = {money(yearlyFee)}
                  </>
                ) : (
                  <>
                    {clients} × 12 months × {usd(terms.clientDiscount)} = {money(yearlySavings)}
                  </>
                )}
              </p>
              {mode === "fee" && (
                <p className="mt-2 text-[0.82rem] text-white/45">
                  {cents(getFoundFee)} is 10% of {terms.getFoundMonths} months of Get Found: Google + AI.
                </p>
              )}
              <p className="mt-4 text-[0.88rem] text-white/55">
                An estimate, not a promise: it depends on what your clients choose.{" "}
                {mode === "fee" ? payoutNote : "No fee to you."}
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </Panel>
  );
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  muted,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
  display: string;
  muted?: boolean;
}) {
  return (
    <div className={cn("transition-opacity", muted && "opacity-50")}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <label htmlFor={id} className="text-[0.95rem] font-medium text-white/85">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-[0.9rem] font-medium text-white">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3 w-full"
        style={{ "--fill": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
      />
    </div>
  );
}
