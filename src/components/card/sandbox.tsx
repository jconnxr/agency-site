"use client";

// "Try it with your business": the visitor types their business name and picks
// a trade, and a sample phone shows their website, Google listing and booking
// flow. Everything inside the phone is a labeled sample. No calls or bookings
// are made, and the name never leaves the browser (it's kept in localStorage
// so it can prefill the real booking form further down).
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  CalendarCheck,
  Check,
  ChevronLeft,
  Clock,
  Globe,
  Lock,
  MapPin,
  Menu,
  Navigation,
  Phone,
  PhoneOff,
  Search,
  Send,
} from "lucide-react";
import { PhoneFrame, Stars } from "@/components/story/phone-frame";
import { tradeById, trades, type Trade } from "@/lib/trades";
import { cn } from "@/lib/utils";
import { loadBiz, saveBiz, track } from "./track";

type Tab = "website" | "listing" | "booking";
const tabs: { id: Tab; label: string; hint: string }[] = [
  { id: "website", label: "Website", hint: "Scroll the site. Tap Call, or the booking button." },
  { id: "listing", label: "Google listing", hint: "What people see on Google Maps. Tap Website or Book." },
  { id: "booking", label: "Booking", hint: "Pick a time and confirm to see the text your customer gets." },
];

const ink = "#1d232c";
const sub = "#5d6570";

type Biz = { name: string; initials: string; domain: string; trade: Trade };

function makeBiz(raw: string, trade: Trade): Biz {
  const name = raw.trim() || "Your Business";
  const words = name.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w));
  const initials = (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
  const domain = (name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "").slice(0, 22) || "yourbusiness") + ".com";
  return { name, initials, domain, trade };
}

export function Sandbox() {
  const [name, setName] = useState("");
  const [tradeId, setTradeId] = useState(trades[0].id);
  const [tab, setTab] = useState<Tab>("website");
  const [calling, setCalling] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const typed = useRef(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Bring back what they typed last time (after hydration, so server and client match).
  useEffect(() => {
    const b = loadBiz();
    if (b) {
      setName(b.name);
      setTradeId(tradeById(b.trade).id);
    }
  }, []);

  const trade = tradeById(tradeId);
  const biz = makeBiz(name, trade);

  function changeName(v: string) {
    setName(v);
    saveBiz({ name: v, trade: tradeId });
    if (!typed.current && v.trim().length >= 2) {
      typed.current = true;
      track("Sandbox: typed a name", { trade: tradeId });
    }
  }
  function changeTrade(id: string) {
    setTradeId(id);
    saveBiz({ name, trade: id });
    track("Sandbox: picked a trade", { trade: id });
  }
  function goTab(t: Tab, how: "tab" | "in-phone" = "tab") {
    if (t === tab) return;
    setTab(t);
    setCalling(false);
    track("Sandbox: switched tab", { tab: t, how });
  }

  // Short "this is a sample" notes inside the phone.
  useEffect(() => {
    if (!note) return;
    const id = setTimeout(() => setNote(null), 2200);
    return () => clearTimeout(id);
  }, [note]);
  useEffect(() => {
    if (!calling) return;
    const id = setTimeout(() => setCalling(false), 4500);
    return () => clearTimeout(id);
  }, [calling]);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (i + d + tabs.length) % tabs.length;
    goTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  const current = tabs.find((t) => t.id === tab)!;

  return (
    <section id="try" aria-labelledby="try-title" className="scroll-mt-4 bg-night text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_340px] md:gap-14 lg:grid-cols-[1fr_370px]">
          <div className="md:pt-6">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-clay-glow">Try it with your business</p>
            <h2 id="try-title" className="mt-3 text-[2rem] leading-[1.05] md:text-[2.9rem]">
              See it with your name on it.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[1.04rem] leading-relaxed text-white/75">
              Type your business name and pick what you do. The phone fills in as you go, and you can tap around in it.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-white/60">Business name</span>
                <input
                  value={name}
                  onChange={(e) => changeName(e.target.value)}
                  placeholder="e.g. Lakeside Heating & Air"
                  maxLength={40}
                  autoComplete="organization"
                  enterKeyHint="done"
                  className="mt-2 block h-12 w-full rounded-sm border border-white/20 bg-night-2 px-3.5 text-[16px] text-white placeholder:text-white/35 focus:border-clay-glow focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-white/60">What you do</span>
                <span className="relative mt-2 block">
                  <select
                    value={tradeId}
                    onChange={(e) => changeTrade(e.target.value)}
                    className="block h-12 w-full appearance-none rounded-sm border border-white/20 bg-night-2 px-3.5 pr-10 text-[16px] text-white focus:border-clay-glow focus:outline-none"
                  >
                    {trades.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-white/60">
                    <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
              </label>
            </div>

            <div role="tablist" aria-label="Sample screens" className="mt-8 grid grid-cols-3 border-b border-white/15">
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`sbx-tab-${t.id}`}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.id}
                  aria-controls="sbx-panel"
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => goTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "-mb-px min-h-12 border-b-2 px-1 text-[0.95rem] font-semibold transition-colors",
                    tab === t.id ? "border-clay-glow text-white" : "border-transparent text-white/55 hover:text-white"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-[0.95rem] text-white/70">{current.hint}</p>
            <p className="mt-3 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-clay-glow">
              <span aria-hidden className="size-1.5 rounded-full bg-clay-glow" />
              Sample: this is a demo, not your real listing.
            </p>
          </div>

          <div
            id="sbx-panel"
            role="tabpanel"
            aria-labelledby={`sbx-tab-${tab}`}
            className="h-[min(600px,calc(100svh-6rem))] min-h-[470px] md:h-[640px]"
          >
            <PhoneFrame decorative={false} maxScale={1.06} className="size-full">
              <div key={tab} className="sbx-in absolute inset-0 bg-white pt-11">
                {tab === "website" && <WebsiteScreen biz={biz} onCall={() => setCalling(true)} onBook={() => goTab("booking", "in-phone")} />}
                {tab === "listing" && (
                  <ListingScreen
                    biz={biz}
                    onCall={() => setCalling(true)}
                    onSite={() => goTab("website", "in-phone")}
                    onBook={() => goTab("booking", "in-phone")}
                    onDirections={() => setNote("Sample: this would open directions in Maps.")}
                  />
                )}
                {tab === "booking" && <BookingScreen biz={biz} onBack={() => goTab("website", "in-phone")} />}
              </div>
              {calling && <CallSheet biz={biz} onEnd={() => setCalling(false)} />}
              <p
                role="status"
                className={cn(
                  "absolute inset-x-3 bottom-4 z-30 rounded-[12px] bg-[#1d232c] px-3 py-2.5 text-center text-[11px] text-white transition-[opacity,transform] duration-200",
                  note ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                )}
              >
                {note}
              </p>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Screens ----------

function Avatar({ biz, size = 32 }: { biz: Biz; size?: number }) {
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: biz.trade.accent, fontSize: size * 0.36 }}
    >
      {biz.initials}
    </span>
  );
}

function Lines({ widths = ["100%", "70%"] }: { widths?: string[] }) {
  return (
    <span aria-hidden className="block space-y-1.5">
      {widths.map((w, i) => (
        <span key={i} className="block h-[5px] rounded-full bg-[#e3e6ea]" style={{ width: w }} />
      ))}
    </span>
  );
}

// The trade photo if there is one, otherwise a soft panel in the accent color.
function Cover({ biz, sizes }: { biz: Biz; sizes: string }) {
  return biz.trade.photo ? (
    <Image src={biz.trade.photo} alt="" fill sizes={sizes} className="object-cover" />
  ) : (
    <span
      aria-hidden
      className="absolute inset-0"
      style={{ background: `radial-gradient(120% 90% at 85% 0%, ${biz.trade.accent}cc, ${biz.trade.accent} 55%, #0f1a2a)` }}
    />
  );
}

const tap = "transition-transform active:scale-[0.97]";

function WebsiteScreen({ biz, onCall, onBook }: { biz: Biz; onCall: () => void; onBook: () => void }) {
  const { trade } = biz;
  return (
    <div className="flex h-full flex-col">
      <div className="mx-3 mt-1 flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-[9px] bg-[#f1f3f5] text-[11px]" style={{ color: sub }}>
        <Lock aria-hidden className="size-3" />
        <span className="max-w-[180px] truncate">{biz.domain}</span>
      </div>
      <div tabIndex={0} aria-label={`Sample website for ${biz.name}. Scrollable.`} className="mt-2 flex-1 overflow-y-auto focus:outline-none" style={{ color: ink }}>
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <span className="truncate font-wide text-[13px] font-extrabold uppercase tracking-tight">{biz.name}</span>
          <Menu aria-hidden className="size-4 shrink-0" />
        </div>
        <div className="relative h-[260px] overflow-hidden">
          <Cover biz={biz} sizes="290px" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,26,42,0.3),rgba(15,26,42,0.9))]" />
          <div className="absolute inset-x-4 bottom-4 text-white">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-white/75">{trade.category} &middot; Oklahoma City</p>
            <p className="mt-1.5 font-wide text-[19px] font-extrabold leading-[1.05]">{trade.headline}</p>
            <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] font-semibold">
              <button type="button" onClick={onCall} className={cn("flex h-9 items-center justify-center gap-1 rounded-[3px] border border-white/70", tap)}>
                <Phone aria-hidden className="size-3" /> Call now
              </button>
              <button type="button" onClick={onBook} className={cn("flex h-9 items-center justify-center rounded-[3px] px-1", tap)} style={{ background: trade.accent }}>
                {trade.booking}
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 border-b border-[#eceef1] text-center text-[9px] font-semibold">
          {[
            { icon: <Clock />, t: "Open today" },
            { icon: <MapPin />, t: "Oklahoma City" },
            { icon: <CalendarCheck />, t: "Book online" },
          ].map((x) => (
            <span key={x.t} className="flex flex-col items-center gap-1 px-1 py-3 [&_svg]:size-4" >
              <span aria-hidden style={{ color: trade.accent }}>{x.icon}</span>
              {x.t}
            </span>
          ))}
        </div>

        <p className="px-4 pt-5 font-wide text-[13px] font-extrabold">Services</p>
        <div className="space-y-3 px-4 py-3">
          {trade.services.map((t) => (
            <div key={t} className="flex items-center gap-3">
              <span aria-hidden className="size-9 shrink-0 rounded-[4px]" style={{ background: `${trade.accent}1f` }} />
              <span className="flex-1">
                <span className="block text-[11px] font-semibold">{t}</span>
                <span className="mt-1 block">
                  <Lines widths={["80%"]} />
                </span>
              </span>
            </div>
          ))}
        </div>

        <p className="px-4 pt-3 font-wide text-[13px] font-extrabold">Hours</p>
        <dl className="mx-4 mt-2 divide-y divide-[#eceef1] border-y border-[#eceef1] text-[10.5px]">
          {[
            ["Mon – Fri", "8 AM – 6 PM"],
            ["Saturday", "9 AM – 2 PM"],
            ["Sunday", "Closed"],
          ].map(([d, h]) => (
            <div key={d} className="flex justify-between py-2">
              <dt style={{ color: sub }}>{d}</dt>
              <dd className="font-mono">{h}</dd>
            </div>
          ))}
        </dl>

        <div className="m-4 rounded-[6px] p-4 text-white" style={{ background: trade.accent }}>
          <p className="font-wide text-[14px] font-extrabold leading-tight">Ready when you are.</p>
          <p className="mt-1 text-[10px] text-white/80">Pick a time online in under a minute.</p>
          <button type="button" onClick={onBook} className={cn("mt-3 flex h-9 w-full items-center justify-center rounded-[3px] bg-white text-[10.5px] font-semibold", tap)} style={{ color: trade.accent }}>
            {trade.booking}
          </button>
        </div>
        <p className="px-4 pb-6 text-center font-mono text-[8.5px]" style={{ color: sub }}>
          &copy; {biz.name} &middot; Oklahoma City
        </p>
      </div>
    </div>
  );
}

function ListingScreen({
  biz,
  onCall,
  onSite,
  onBook,
  onDirections,
}: {
  biz: Biz;
  onCall: () => void;
  onSite: () => void;
  onBook: () => void;
  onDirections: () => void;
}) {
  const { trade } = biz;
  const query = trade.id === "other" ? biz.name.toLowerCase() : trade.query;
  const actions = [
    { icon: <Phone />, label: "Call", on: onCall },
    { icon: <Navigation />, label: "Directions", on: onDirections },
    { icon: <Globe />, label: "Website", on: onSite },
    { icon: <CalendarCheck />, label: "Book", on: onBook, main: true },
  ];
  return (
    <div className="flex h-full flex-col" style={{ color: ink }}>
      <div className="mx-3.5 mt-1 flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#e3e6ea] px-3.5 text-[13px] shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
        <Search aria-hidden className="size-4" style={{ color: sub }} />
        <span className="truncate">{query}</span>
      </div>
      <div tabIndex={0} aria-label={`Sample Google listing for ${biz.name}. Scrollable.`} className="mt-2.5 flex-1 overflow-y-auto focus:outline-none">
        <div className="relative h-[112px] overflow-hidden">
          <Cover biz={biz} sizes="290px" />
        </div>
        <div className="px-4 pt-3">
          <p className="text-[16px] font-bold leading-tight">{biz.name}</p>
          <p className="mt-1 flex items-center gap-1 text-[11px]" style={{ color: sub }}>
            <Stars size={10} /> <span>Sample rating</span>
          </p>
          <p className="mt-0.5 text-[11.5px]">
            <span style={{ color: sub }}>{trade.category} &middot; </span>
            <span className="font-semibold text-[#1e7a46]">Open</span>
            <span style={{ color: sub }}> &middot; Closes 6 PM</span>
          </p>

          <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px] font-medium">
            {actions.map((a) => (
              <button key={a.label} type="button" onClick={a.on} className={cn("flex flex-col items-center gap-1 py-0.5", tap)}>
                <span
                  aria-hidden
                  className={cn("grid size-9 place-items-center rounded-full [&_svg]:size-4", a.main ? "text-white" : "border border-[#e3e6ea]")}
                  style={a.main ? { background: trade.accent } : { color: trade.accent }}
                >
                  {a.icon}
                </span>
                {a.label}
              </button>
            ))}
          </div>

          <div className="mt-4 border-t border-[#eceef1] pt-3 text-[11px]">
            <p className="flex items-center gap-2">
              <MapPin aria-hidden className="size-3.5 shrink-0" style={{ color: sub }} />
              Oklahoma City, OK
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Clock aria-hidden className="size-3.5 shrink-0" style={{ color: sub }} />
              <span>
                <span className="font-semibold text-[#1e7a46]">Open</span> &middot; 8 AM – 6 PM
              </span>
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Globe aria-hidden className="size-3.5 shrink-0" style={{ color: sub }} />
              {biz.domain}
            </p>
          </div>

          <p className="mt-4 border-t border-[#eceef1] pt-3 text-[12px] font-semibold">Services</p>
          <ul className="mt-1.5 space-y-1.5 text-[11px]" style={{ color: sub }}>
            {trade.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <p className="mt-4 border-t border-[#eceef1] pt-3 text-[12px] font-semibold">Photos</p>
          <div aria-hidden className="mt-2 grid grid-cols-3 gap-1">
            {[0.18, 0.3, 0.12].map((o, i) => (
              <span key={i} className="aspect-square rounded-[4px]" style={{ background: trade.accent, opacity: o + 0.2 }} />
            ))}
          </div>

          <p className="mt-4 border-t border-[#eceef1] pt-3 text-[12px] font-semibold">Reviews</p>
          <div className="mt-2 space-y-2 pb-6">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-[8px] border border-[#eceef1] p-2.5">
                <Stars size={9} />
                <span className="mt-2 block">
                  <Lines widths={["100%", i ? "55%" : "75%"]} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const times = ["8:00 AM", "9:30 AM", "11:00 AM", "1:00 PM", "2:30 PM", "4:00 PM"];
const taken = new Set([1, 4]);

// The next five weekdays, starting tomorrow.
function nextWeekdays(n = 5) {
  const out: Date[] = [];
  const d = new Date();
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
  }
  return out;
}

function BookingScreen({ biz, onBack }: { biz: Biz; onBack: () => void }) {
  const { trade } = biz;
  const [days] = useState(nextWeekdays);
  const [service, setService] = useState(0);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-US", o);
  const dayLong = fmt(days[day], { weekday: "short", month: "short", day: "numeric" });

  if (done && time !== null) {
    return (
      <div className="flex h-full flex-col bg-[#f6f7f9]" style={{ color: ink }}>
        <div className="flex flex-col items-center border-b border-[#eceef1] bg-white pb-2.5 pt-1">
          <Avatar biz={biz} size={34} />
          <span className="mt-1 max-w-[220px] truncate text-[11px] font-semibold">{biz.name}</span>
          <span className="font-mono text-[8.5px]" style={{ color: sub }}>
            Text message
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 px-3 pt-4 text-[11px] leading-snug" aria-live="polite">
          <p className="text-center font-mono text-[8.5px]" style={{ color: sub }}>
            Just now
          </p>
          <p className="sbx-rise max-w-[86%] self-start rounded-[14px] rounded-bl-[4px] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            {biz.name}: You&rsquo;re booked! {trade.services[service]}, {dayLong} at {times[time]}. Reply C to confirm or R to reschedule.
          </p>
          <p className="sbx-rise sbx-d2 max-w-[86%] self-start rounded-[14px] rounded-bl-[4px] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            We&rsquo;ll text you a reminder the day before.
          </p>
          <p className="sbx-rise sbx-d3 mt-2 flex items-center gap-1.5 self-center rounded-full bg-[#e6f4ec] px-3 py-1.5 text-[10.5px] font-semibold text-[#1e7a46]">
            <Check aria-hidden className="size-3.5" strokeWidth={3} /> Booked &middot; {fmt(days[day], { weekday: "short" })} {times[time]}
          </p>
          <p className="sbx-rise sbx-d3 mt-1 text-center font-mono text-[8.5px]" style={{ color: sub }}>
            Sample: no real booking was made.
          </p>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setTime(null);
            }}
            className={cn("sbx-rise sbx-d3 mt-1 self-center text-[10.5px] font-semibold underline underline-offset-2", tap)}
            style={{ color: trade.accent }}
          >
            Try another time
          </button>
        </div>
        <div aria-hidden className="m-3 flex items-center gap-2 rounded-full border border-[#e3e6ea] bg-white px-3 py-2">
          <span className="h-[5px] flex-1 rounded-full bg-[#eceef1]" />
          <Send className="size-3.5" style={{ color: sub }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4" style={{ color: ink }}>
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 self-start pt-1 text-[11px]" style={{ color: sub }}>
        <ChevronLeft aria-hidden className="size-4" />
        <span className="max-w-[200px] truncate">{biz.name}</span>
      </button>
      <p className="mt-2 font-wide text-[16px] font-extrabold leading-tight">{trade.booking}</p>
      <p className="mt-1 font-mono text-[9.5px]" style={{ color: sub }}>
        {trade.bookingDetail}
      </p>

      <fieldset className="mt-3">
        <legend className="text-[11px] font-semibold">Service</legend>
        <div className="mt-1.5 grid gap-1">
          {trade.services.map((s, i) => (
            <button
              key={s}
              type="button"
              aria-pressed={service === i}
              onClick={() => setService(i)}
              className={cn("flex h-7 items-center justify-between rounded-[6px] border px-2.5 text-[10.5px]", tap)}
              style={service === i ? { borderColor: trade.accent, background: `${trade.accent}14` } : { borderColor: "#e3e6ea" }}
            >
              {s}
              {service === i && <Check aria-hidden className="size-3.5" style={{ color: trade.accent }} strokeWidth={3} />}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-3">
        <legend className="text-[11px] font-semibold">{fmt(days[0], { month: "long" })}</legend>
        <div className="mt-1.5 grid grid-cols-5 gap-1.5">
          {days.map((d, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={day === i}
              aria-label={fmt(d, { weekday: "long", month: "long", day: "numeric" })}
              onClick={() => {
                setDay(i);
                setTime(null);
              }}
              className={cn("flex flex-col items-center rounded-[6px] border py-1.5 text-[10px]", tap, day === i ? "border-transparent text-white" : "border-[#e3e6ea]")}
              style={day === i ? { background: ink } : undefined}
            >
              <span className={day === i ? "text-white/70" : ""} style={day === i ? undefined : { color: sub }}>
                {fmt(d, { weekday: "short" })}
              </span>
              <span className="mt-0.5 text-[14px] font-bold">{d.getDate()}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-3">
        <legend className="text-[11px] font-semibold">Available times</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {times.map((t, i) => {
            const off = taken.has((i + day) % times.length);
            return (
              <button
                key={t}
                type="button"
                disabled={off}
                aria-pressed={time === i}
                aria-label={off ? `${t}, taken` : t}
                onClick={() => setTime(i)}
                className={cn(
                  "flex h-7 items-center justify-center rounded-[6px] border font-mono text-[11px]",
                  tap,
                  off && "border-dashed text-[#b6bcc5] line-through",
                  time === i ? "border-transparent font-semibold text-white" : !off && "border-[#e3e6ea]"
                )}
                style={time === i ? { background: trade.accent } : undefined}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-auto pb-6 pt-2">
        <div className="flex items-center justify-between border-t border-[#eceef1] py-2 text-[10.5px]">
          <span style={{ color: sub }}>{dayLong}</span>
          <span className="font-mono font-semibold">{time === null ? "Pick a time" : times[time]}</span>
        </div>
        <button
          type="button"
          disabled={time === null}
          onClick={() => {
            setDone(true);
            track("Sandbox: completed sample booking", { trade: trade.id });
          }}
          className={cn("flex h-10 w-full items-center justify-center rounded-[6px] text-[12px] font-semibold text-white disabled:opacity-40", tap)}
          style={{ background: trade.accent }}
        >
          Confirm booking
        </button>
      </div>
    </div>
  );
}

function CallSheet({ biz, onEnd }: { biz: Biz; onEnd: () => void }) {
  return (
    <div role="dialog" aria-label="Sample call" className="sbx-in absolute inset-0 z-20 flex flex-col items-center bg-[#151b26] px-5 pt-24 text-white">
      <Avatar biz={biz} size={64} />
      <p className="mt-3 max-w-[230px] text-center text-[15px] font-semibold leading-tight">{biz.name}</p>
      <p className="mt-1 font-mono text-[10px] text-white/60">calling&hellip;</p>
      <p className="mt-6 max-w-[200px] text-center text-[10.5px] leading-snug text-white/65">
        Sample: no call is placed. On your real site this rings your phone.
      </p>
      <button
        type="button"
        onClick={onEnd}
        aria-label="End sample call"
        className={cn("mt-auto mb-14 grid size-12 place-items-center rounded-full bg-[#d64545]", tap)}
      >
        <PhoneOff aria-hidden className="size-5" />
      </button>
    </div>
  );
}
