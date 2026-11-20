"use client";

// Phone screens for story steps 3-9. Same rules as the first two: realistic,
// brand-free UI, placeholder lines instead of invented quotes, and animations
// (in globals.css) that only run while the screen is the active one.
import Image from "next/image";
import {
  CalendarCheck,
  Check,
  ChevronLeft,
  Heart,
  Lock,
  Menu,
  MessageCircle,
  Mic,
  Phone,
  PhoneOff,
  Send,
  Share2,
  ShieldCheck,
  Timer,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { demoBusiness } from "./steps";

const ink = "#1d232c";
const sub = "#6b7480";
const clay = "#c4502b";

function Lines({ widths = ["100%", "70%"], tone = "#e3e6ea" }: { widths?: string[]; tone?: string }) {
  return (
    <span className="block space-y-1.5">
      {widths.map((w, i) => (
        <span key={i} className="block h-[5px] rounded-full" style={{ width: w, background: tone }} />
      ))}
    </span>
  );
}

function Avatar({ size = 32, dark }: { size?: number; dark?: boolean }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: dark ? "#334155" : clay, fontSize: size * 0.34 }}
    >
      {demoBusiness.initials}
    </span>
  );
}

// Step 3: the business's own website
export function WebsiteScreen() {
  return (
    <div className="flex h-full flex-col">
      <div className="mx-3 mt-1 flex h-8 items-center justify-center gap-1.5 rounded-[9px] bg-[#f1f3f5] text-[11px]" style={{ color: sub }}>
        <Lock className="size-3" />
        <span className="h-[5px] w-24 rounded-full bg-[#d9dde3]" />
      </div>
      <div className="relative mt-2 flex-1 overflow-hidden">
        <div className="story-scroll">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="font-wide text-[13px] font-extrabold tracking-tight" style={{ color: ink }}>
              RED DIRT
            </span>
            <Menu className="size-4" style={{ color: ink }} />
          </div>
          <div className="relative h-[250px] overflow-hidden">
            <Image src="/images/aerial-roof.webp" alt="" fill sizes="290px" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,26,42,0.35),rgba(15,26,42,0.88))]" />
            <div className="absolute inset-x-4 bottom-4 text-white">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-white/70">Serving the OKC metro</p>
              <p className="mt-1.5 font-wide text-[19px] font-extrabold leading-[1.05]">Foundation repair, done right the first time.</p>
              <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] font-semibold">
                <span className="flex h-8 items-center justify-center gap-1 rounded-[3px] border border-white/60">
                  <Phone className="size-3" /> Call now
                </span>
                <span className="relative flex h-8 items-center justify-center rounded-[3px]" style={{ background: clay }}>
                  Book an inspection
                  <span className="story-tap pointer-events-none absolute -inset-1 rounded-[5px] ring-2 ring-white" />
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 border-b border-[#eceef1] text-center text-[9px] font-semibold" style={{ color: ink }}>
            {[
              { icon: <CalendarCheck />, t: "Free inspections" },
              { icon: <Timer />, t: "Same-week visits" },
              { icon: <ShieldCheck />, t: "Licensed & insured" },
            ].map((x) => (
              <span key={x.t} className="flex flex-col items-center gap-1 px-1 py-3 [&_svg]:size-4 [&_svg]:text-[#c4502b]">
                {x.icon}
                {x.t}
              </span>
            ))}
          </div>
          <div className="space-y-3 px-4 py-4">
            {["Slab repair", "Pier and beam", "Drainage"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <span className="size-9 shrink-0 rounded-[4px] bg-[#eef0f3]" />
                <span className="flex-1">
                  <span className="block text-[11px] font-semibold" style={{ color: ink }}>
                    {t}
                  </span>
                  <span className="mt-1 block">
                    <Lines widths={["80%"]} />
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 4: picking a time
export function BookingScreen() {
  const days = [
    { d: "Mon", n: 10 },
    { d: "Tue", n: 11, on: true },
    { d: "Wed", n: 12 },
    { d: "Thu", n: 13 },
    { d: "Fri", n: 14 },
  ];
  const times = [
    { t: "8:00 AM" },
    { t: "9:30 AM", off: true },
    { t: "10:30 AM", pick: true },
    { t: "1:00 PM" },
    { t: "2:30 PM", off: true },
    { t: "4:00 PM" },
  ];
  return (
    <div className="flex h-full flex-col px-4" style={{ color: ink }}>
      <div className="flex items-center gap-2 pt-1">
        <ChevronLeft className="size-4" style={{ color: sub }} />
        <span className="text-[11px]" style={{ color: sub }}>
          {demoBusiness.short}
        </span>
      </div>
      <p className="mt-3 font-wide text-[17px] font-extrabold leading-tight">Book a free inspection</p>
      <p className="mt-1 font-mono text-[9.5px]" style={{ color: sub }}>
        45 min &middot; at your home
      </p>

      <p className="mt-5 text-[11px] font-semibold">November</p>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {days.map((x) => (
          <span
            key={x.d}
            className={cn(
              "flex flex-col items-center rounded-[6px] border py-2 text-[10px]",
              x.on ? "border-transparent text-white" : "border-[#e3e6ea]"
            )}
            style={x.on ? { background: ink } : undefined}
          >
            <span className={x.on ? "text-white/70" : ""} style={x.on ? undefined : { color: sub }}>
              {x.d}
            </span>
            <span className="mt-0.5 text-[14px] font-bold">{x.n}</span>
          </span>
        ))}
      </div>

      <p className="mt-5 text-[11px] font-semibold">Available times</p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {times.map((x) => (
          <span
            key={x.t}
            className={cn(
              "flex h-9 items-center justify-center rounded-[6px] border font-mono text-[11px]",
              x.off && "border-dashed text-[#b6bcc5] line-through",
              x.pick ? "story-pick border-transparent font-semibold text-white" : !x.off && "border-[#e3e6ea]"
            )}
          >
            {x.t}
          </span>
        ))}
      </div>

      <div className="mt-auto pb-5">
        <div className="flex items-center justify-between border-t border-[#eceef1] py-3 text-[10.5px]">
          <span style={{ color: sub }}>Tue, Nov 11</span>
          <span className="font-mono font-semibold">10:30 AM</span>
        </div>
        <span className="story-press flex h-10 items-center justify-center rounded-[6px] text-[12px] font-semibold text-white" style={{ background: clay }}>
          Confirm booking
        </span>
      </div>
    </div>
  );
}

// Step 5: confirmation and reminder by text
export function MessagesScreen() {
  return (
    <div className="flex h-full flex-col bg-[#f6f7f9]" style={{ color: ink }}>
      <div className="flex flex-col items-center border-b border-[#eceef1] bg-white pb-2.5 pt-1">
        <Avatar size={34} />
        <span className="mt-1 text-[11px] font-semibold">{demoBusiness.short}</span>
        <span className="font-mono text-[8.5px]" style={{ color: sub }}>
          Text message
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3 pt-4 text-[11px] leading-snug">
        <p className="text-center font-mono text-[8.5px]" style={{ color: sub }}>
          Today 9:42 AM
        </p>
        <span className="story-msg max-w-[82%] self-start rounded-[14px] rounded-bl-[4px] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
          You&rsquo;re booked! Free inspection, Tue Nov 11 at 10:30 AM. Reply C to confirm or R to reschedule.
        </span>
        <span className="story-msg story-d2 self-end rounded-[14px] rounded-br-[4px] px-3 py-2 text-white" style={{ background: ink }}>
          C
        </span>
        <span className="story-msg story-d3 max-w-[82%] self-start rounded-[14px] rounded-bl-[4px] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
          Confirmed. See you Tuesday! We&rsquo;ll text a reminder the day before.
        </span>
        <span className="story-msg story-d4 mt-2 flex items-center gap-1.5 self-center rounded-full bg-[#e6f4ec] px-3 py-1.5 text-[10.5px] font-semibold text-[#1e7a46]">
          <Check className="size-3.5" strokeWidth={3} /> Booked &middot; Tue 10:30 AM
        </span>
      </div>
      <div className="m-3 flex items-center gap-2 rounded-full border border-[#e3e6ea] bg-white px-3 py-2">
        <span className="h-[5px] flex-1 rounded-full bg-[#eceef1]" />
        <Send className="size-3.5" style={{ color: sub }} />
      </div>
    </div>
  );
}

// Step 6: a call that nobody could answer, followed by an instant text back
export function MissedScreen() {
  return (
    <div className="relative flex h-full flex-col items-center bg-[#151b26] px-5 pt-11 text-white">
      <div className="story-banner absolute inset-x-2.5 top-12 z-10 rounded-[16px] bg-white/95 p-3 text-[#1d232c] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] backdrop-blur">
        <div className="flex items-center gap-2">
          <Avatar size={20} />
          <span className="text-[10px] font-semibold">{demoBusiness.short}</span>
          <span className="ml-auto font-mono text-[8.5px]" style={{ color: sub }}>
            now
          </span>
        </div>
        <p className="mt-1.5 text-[10.5px] leading-snug">
          Sorry we missed your call! We&rsquo;re out on a job. Want a call back, or book a time here?
        </p>
      </div>

      <div className="mt-[118px] flex flex-col items-center">
        <Avatar size={64} dark />
        <p className="mt-3 text-[15px] font-semibold">{demoBusiness.name}</p>
        <p className="mt-1 font-mono text-[10px] text-white/55">Call ended &middot; no answer</p>
      </div>

      <div className="mt-auto mb-12 grid w-full grid-cols-3 gap-y-5 text-center text-[9px] text-white/70">
        {[<Mic key="m" />, <Video key="v" />, <MessageCircle key="c" />].map((icon, i) => (
          <span key={i} className="flex flex-col items-center gap-1.5">
            <span className="grid size-11 place-items-center rounded-full bg-white/10 [&_svg]:size-4">{icon}</span>
            {["Mute", "Video", "Message"][i]}
          </span>
        ))}
        <span className="col-span-3 flex justify-center">
          <span className="grid size-12 place-items-center rounded-full bg-[#4b5563]">
            <PhoneOff className="size-5" />
          </span>
        </span>
      </div>
    </div>
  );
}

// Step 7: a sponsored post in a generic social feed
export function AdScreen() {
  return (
    <div className="flex h-full flex-col bg-[#f2f3f5]" style={{ color: ink }}>
      <div className="flex items-center justify-between bg-white px-4 pb-2.5 pt-1">
        <span className="font-wide text-[14px] font-extrabold">Feed</span>
        <span className="flex gap-1.5">
          <span className="size-6 rounded-full bg-[#eef0f3]" />
          <span className="size-6 rounded-full bg-[#eef0f3]" />
        </span>
      </div>
      <div className="story-rise mt-2 bg-white">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Avatar size={28} />
          <span className="leading-tight">
            <span className="block text-[11px] font-semibold">{demoBusiness.name}</span>
            <span className="font-mono text-[8.5px]" style={{ color: sub }}>
              Sponsored
            </span>
          </span>
        </div>
        <p className="px-3 pb-2.5 text-[10.5px] leading-snug">
          Cracks in your walls or doors that stick? Book a free foundation inspection this month.
        </p>
        <div className="relative h-[210px]">
          <Image src="/images/contractor-truck.webp" alt="" fill sizes="290px" className="object-cover object-[65%_40%]" />
        </div>
        <div className="flex items-center justify-between gap-3 bg-[#f6f7f9] px-3 py-2.5">
          <span className="leading-tight">
            <span className="block font-mono text-[8px] uppercase" style={{ color: sub }}>
              Free inspection
            </span>
            <span className="text-[10.5px] font-semibold">Book online in 30 seconds</span>
          </span>
          <span className="relative rounded-[4px] px-3 py-2 text-[10px] font-semibold text-white" style={{ background: clay }}>
            Book now
            <span className="story-tap pointer-events-none absolute -inset-1 rounded-[6px] ring-2 ring-[#c4502b]" />
          </span>
        </div>
        <div className="flex justify-around border-t border-[#eceef1] py-2 text-[9.5px]" style={{ color: sub }}>
          <span className="flex items-center gap-1">
            <Heart className="size-3" /> Like
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="size-3" /> Comment
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="size-3" /> Share
          </span>
        </div>
      </div>
      <div className="mt-2 flex-1 bg-white px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="size-7 rounded-full bg-[#eef0f3]" />
          <Lines widths={["40%"]} />
        </div>
      </div>
    </div>
  );
}

// Step 8: a profile with a steady grid of posts
export function SocialScreen() {
  const tiles: ({ img: string; pos?: string } | { text: string; bg: string; fg: string })[] = [
    { text: "Before / after", bg: clay, fg: "#fff" },
    { img: "/images/aerial-roof.webp" },
    { img: "/images/contractor-truck.webp", pos: "object-[70%_40%]" },
    { img: "/images/drone-operator.webp", pos: "object-[55%_50%]" },
    { text: "3 signs your slab is moving", bg: ink, fg: "#fff" },
    { img: "/images/aerial-roof.webp", pos: "object-[20%_80%]" },
    { text: "Free inspections", bg: "#f3ded3", fg: ink },
    { img: "/images/contractor-truck.webp", pos: "object-[20%_60%]" },
    { img: "/images/drone-operator.webp", pos: "object-[80%_10%]" },
  ];
  return (
    <div className="flex h-full flex-col" style={{ color: ink }}>
      <div className="flex items-center gap-4 px-4 pt-2">
        <Avatar size={52} />
        <div className="grid flex-1 grid-cols-3 text-center">
          {[
            ["148", "posts"],
            ["2,310", "followers"],
            ["87", "following"],
          ].map(([n, l]) => (
            <span key={l}>
              <span className="block font-mono text-[12px] font-semibold">{n}</span>
              <span className="text-[9px]" style={{ color: sub }}>
                {l}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="px-4 pt-2.5">
        <p className="text-[11.5px] font-semibold">{demoBusiness.name}</p>
        <p className="text-[10px]" style={{ color: sub }}>
          Foundation repair &middot; OKC metro
        </p>
      </div>
      <div className="mx-4 mt-3 grid grid-cols-2 gap-1.5 text-[10px] font-semibold">
        <span className="flex h-7 items-center justify-center rounded-[6px] bg-[#eef0f3]">Message</span>
        <span className="flex h-7 items-center justify-center rounded-[6px] text-white" style={{ background: clay }}>
          Book
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-[2px]">
        {tiles.map((t, i) => (
          <span key={i} className={cn("relative aspect-square overflow-hidden", i === 0 && "story-newtile")}>
            {"img" in t ? (
              <Image src={t.img} alt="" fill sizes="100px" className={cn("object-cover", t.pos)} />
            ) : (
              <span
                className="flex h-full items-end p-1.5 font-wide text-[9.5px] font-extrabold leading-[1.05]"
                style={{ background: t.bg, color: t.fg }}
              >
                {t.text}
              </span>
            )}
            {i === 0 && (
              <span className="absolute right-1 top-1 rounded-[2px] bg-white px-1 font-mono text-[7px] font-semibold" style={{ color: clay }}>
                NEW
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

// Step 9: a vertical clip of drone footage, playing
export function ReelScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-black text-white">
      <div className="story-kenburns absolute inset-0">
        <Image src="/images/aerial-roof.webp" alt="" fill sizes="290px" className="object-cover object-[48%_50%]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,transparent_25%,transparent_55%,rgba(0,0,0,0.8)_100%)]" />

      <div className="absolute inset-x-0 top-12 flex justify-center gap-4 text-[11px] font-semibold">
        <span className="text-white/60">Following</span>
        <span className="border-b-2 border-white pb-0.5">Clips</span>
      </div>

      <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4 text-[9px]">
        {[
          { icon: <Heart />, n: "1.2k" },
          { icon: <MessageCircle />, n: "84" },
          { icon: <Share2 />, n: "61" },
        ].map((x) => (
          <span key={x.n} className="flex flex-col items-center gap-1 font-mono [&_svg]:size-5">
            {x.icon}
            {x.n}
          </span>
        ))}
      </div>

      <div className="absolute inset-x-3.5 bottom-6">
        <div className="flex items-center gap-2">
          <Avatar size={24} />
          <span className="text-[11px] font-semibold">{demoBusiness.short}</span>
        </div>
        <p className="mt-2 text-[11px] leading-snug">Slab repair from above, start to finish.</p>
        <p className="mt-1 font-mono text-[8.5px] text-white/60">Drone &middot; 4K</p>
        <span className="mt-3 block h-[2px] overflow-hidden rounded-full bg-white/25">
          <span className="story-progress block h-full w-full origin-left bg-white" />
        </span>
      </div>
    </div>
  );
}
