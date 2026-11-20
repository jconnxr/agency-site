"use client";

// A generic phone drawn in HTML/CSS at a fixed design size (290 x 600), scaled
// to fit whatever space it's given. Screens are realistic but brand-free UI.
import { useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, Globe, Navigation, Phone as PhoneIcon, Search } from "lucide-react";
import { PhoneFrame, Stars } from "./phone-frame";
import { AdScreen, BookingScreen, MessagesScreen, MissedScreen, ReelScreen, SocialScreen, WebsiteScreen } from "./screens";
import { cn } from "@/lib/utils";
import { demoBusiness, type Screen } from "./steps";

const order: Screen[] = ["search", "listing", "website", "booking", "messages", "missed", "ad", "social", "reel"];

export function Phone({
  screen,
  className,
  maxScale = 1,
  overlay,
  overlayTop = 48,
  overlayInset = 15,
}: {
  screen: Screen;
  className?: string;
  maxScale?: number;
  /** Rendered over the top of the screen, just under the Dynamic Island, at real (unscaled) size. */
  overlay?: React.ReactNode;
  /** Overlay position in design px (the island's bottom edge is at 45). */
  overlayTop?: number;
  overlayInset?: number;
}) {
  // Direction of travel decides which way screens slide (forward = push in from the right).
  // Latched only when the screen changes, so unrelated re-renders can't flip a slide mid-way.
  const idx = order.indexOf(screen);
  const prev = useRef(idx);
  const dirRef = useRef(1);
  if (idx !== prev.current) {
    dirRef.current = idx > prev.current ? 1 : -1;
    prev.current = idx;
  }
  const dir = dirRef.current;
  const reduce = useReducedMotion();
  const dark = screen === "missed" || screen === "reel";

  return (
    <PhoneFrame
      dark={dark}
      className={className}
      maxScale={maxScale}
      after={(scale) =>
        // Island bottom sits at 45 design px (9 bezel + 10 + 26); by default the overlay starts just below it.
        overlay && (
          <div
            className="absolute inset-x-0 z-30 transition-[top,padding] duration-300"
            style={{ top: overlayTop * scale, paddingInline: overlayInset * scale }}
          >
            {overlay}
          </div>
        )
      }
    >
      {/* One timed slide per step change (450ms). It always runs to the end,
          and once it settles only the current screen is mounted. */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={screen}
          custom={dir}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduce ? 0 : 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          data-active="true"
          className={cn("story-screen absolute inset-0", dark ? "bg-[#151b26]" : "bg-white pt-11")}
        >
          <ScreenView screen={screen} />
        </motion.div>
      </AnimatePresence>
    </PhoneFrame>
  );
}

// Forward: the new screen slides in over the old one, which eases left and dims.
// Backward: the reverse.
const slide = {
  enter: (d: number) => (d > 0 ? { x: "100%", zIndex: 2, filter: "brightness(1)" } : { x: "-30%", zIndex: 1, filter: "brightness(0.8)" }),
  center: { x: "0%", filter: "brightness(1)" },
  exit: (d: number) => (d > 0 ? { x: "-30%", zIndex: 1, filter: "brightness(0.8)" } : { x: "100%", zIndex: 2, filter: "brightness(1)" }),
};

function ScreenView({ screen }: { screen: Screen }) {
  switch (screen) {
    case "search":
      return <SearchScreen />;
    case "listing":
      return <ListingScreen />;
    case "website":
      return <WebsiteScreen />;
    case "booking":
      return <BookingScreen />;
    case "messages":
      return <MessagesScreen />;
    case "missed":
      return <MissedScreen />;
    case "ad":
      return <AdScreen />;
    case "social":
      return <SocialScreen />;
    case "reel":
      return <ReelScreen />;
  }
}

export { Stars };

// Step 1: a local search with the map results
function SearchScreen() {
  const others = [
    { name: "Foundation repair company", rating: "4.1", count: 12, dist: "3.4 mi" },
    { name: "Concrete & foundation", rating: "3.8", count: 6, dist: "5.0 mi" },
  ];
  return (
    <div className="flex h-full flex-col px-3.5">
      <div className="mt-1 flex h-10 items-center gap-2 rounded-full border border-[#e3e6ea] px-3.5 text-[13px] shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
        <Search className="size-4 text-[#6b7480]" />
        <span className="story-typed overflow-hidden whitespace-nowrap">{demoBusiness.query}</span>
        <span className="story-caret -ml-1.5 h-4 w-px bg-[#1d232c]" />
      </div>
      <div className="mt-2.5 flex gap-4 border-b border-[#eceef1] px-1 text-[11px] font-medium text-[#6b7480]">
        {["All", "Maps", "Images", "Reviews"].map((t, i) => (
          <span key={t} className={cn("pb-2", i === 0 && "border-b-2 border-[#1d232c] text-[#1d232c]")}>
            {t}
          </span>
        ))}
      </div>

      <div className="story-results">
        <div className="mt-3 overflow-hidden rounded-[10px] border border-[#eceef1]">
          <div className="relative h-[92px] bg-[#e8eef3]">
            <MiniMap />
          </div>
          <div className="relative border-b border-[#eceef1] p-3">
            <span className="story-tap pointer-events-none absolute inset-1 rounded-[8px] ring-2 ring-[#c4502b]" />
            <div className="flex gap-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{demoBusiness.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#6b7480]">
                  <span className="font-semibold text-[#1d232c]">{demoBusiness.rating}</span>
                  <Stars />
                  <span>({demoBusiness.reviews})</span>
                </p>
                <p className="mt-0.5 text-[11px] text-[#6b7480]">{demoBusiness.category} &middot; 2.1 mi</p>
                <p className="mt-0.5 text-[11px]">
                  <span className="font-semibold text-[#1e7a46]">Open</span>
                  <span className="text-[#6b7480]"> &middot; Closes 6 PM</span>
                </p>
              </div>
              <div className="relative size-[58px] shrink-0 overflow-hidden rounded-[6px]">
                <Image src="/images/aerial-roof.webp" alt="" fill sizes="60px" className="object-cover" />
              </div>
            </div>
          </div>
          {others.map((o) => (
            <div key={o.name} className="border-b border-[#eceef1] p-3 opacity-60 last:border-0">
              <p className="text-[12px] font-semibold">{o.name}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-[#6b7480]">
                <span>{o.rating}</span>
                <Stars n={4} size={9} />
                <span>
                  ({o.count}) &middot; {o.dist}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 px-1">
          <span className="block h-2 w-3/4 rounded-full bg-[#eceef1]" />
          <span className="block h-2 w-full rounded-full bg-[#f2f4f6]" />
          <span className="block h-2 w-5/6 rounded-full bg-[#f2f4f6]" />
        </div>
      </div>
    </div>
  );
}

function MiniMap() {
  return (
    <svg viewBox="0 0 270 92" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      <path d="M-10 70 C 60 55, 120 85, 190 66 S 260 52, 290 60" stroke="#c9dbe8" strokeWidth="9" fill="none" />
      <g stroke="#fff" fill="none">
        <path d="M0 30 H270" strokeWidth="5" />
        <path d="M90 0 V92" strokeWidth="5" />
        <path d="M200 0 V92" strokeWidth="5" />
        <path d="M0 12 H270 M0 52 H270 M40 0 V92 M150 0 V92 M240 0 V92" strokeWidth="2" />
      </g>
      <rect x="110" y="36" width="26" height="12" rx="2" fill="#d5e3d0" />
      <g>
        <circle cx="222" cy="20" r="5" fill="#9aa4b1" />
        <circle cx="52" cy="66" r="5" fill="#9aa4b1" />
      </g>
      <g className="story-pin">
        <path d="M120 10 c-8 0 -13 6 -13 12 c0 9 13 20 13 20 s13 -11 13 -20 c0 -6 -5 -12 -13 -12z" fill="#c4502b" />
        <circle cx="120" cy="22" r="4.5" fill="#fff" />
      </g>
    </svg>
  );
}

// Step 2: the business listing, with a new review arriving
function ListingScreen() {
  const bars = [88, 8, 2, 1, 1];
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-[118px] shrink-0">
        <Image src="/images/aerial-roof.webp" alt="" fill sizes="290px" className="object-cover" />
      </div>
      <div className="px-4 pt-3">
        <p className="text-[16px] font-bold leading-tight">{demoBusiness.name}</p>
        <p className="mt-1 flex items-center gap-1 text-[11.5px] text-[#6b7480]">
          <span className="font-semibold text-[#1d232c]">{demoBusiness.rating}</span>
          <Stars />
          <span>({demoBusiness.reviews})</span>
        </p>
        <p className="mt-0.5 text-[11.5px]">
          <span className="text-[#6b7480]">{demoBusiness.category} &middot; </span>
          <span className="font-semibold text-[#1e7a46]">Open</span>
        </p>

        <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px] font-medium text-[#1d232c]">
          {[
            { icon: <PhoneIcon />, label: "Call" },
            { icon: <Navigation />, label: "Directions" },
            { icon: <Globe />, label: "Website" },
            { icon: <CalendarCheck />, label: "Book", on: true },
          ].map((a) => (
            <span key={a.label} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full [&_svg]:size-4",
                  a.on ? "bg-[#c4502b] text-white" : "border border-[#e3e6ea]"
                )}
              >
                {a.icon}
              </span>
              {a.label}
            </span>
          ))}
        </div>

        <div className="mt-4 border-t border-[#eceef1] pt-3">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-[26px] font-bold leading-none">{demoBusiness.rating}</p>
              <Stars size={9} />
            </div>
            <div className="flex-1 space-y-[3px]">
              {bars.map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[8.5px] text-[#6b7480]">
                  <span className="w-1.5">{5 - i}</span>
                  <span className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#eceef1]">
                    <span className="story-bar block h-full rounded-full bg-[#f2a93b]" style={{ width: `${b}%` }} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <Review fresh />
            <Review />
          </div>
        </div>
      </div>
    </div>
  );
}

// Review text is drawn as placeholder lines: the business is fictional, so no made-up quotes.
function Review({ fresh }: { fresh?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[8px] border p-2.5",
        fresh ? "story-new border-[#c4502b]/40 bg-[#fdf3ef]" : "border-[#eceef1]"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="grid size-5 place-items-center rounded-full bg-[#d9dee5] text-[8px] font-bold text-[#4b5563]">
          {fresh ? "J" : "M"}
        </span>
        <Stars size={9} />
        <span className="ml-auto font-mono text-[8.5px] text-[#6b7480]">{fresh ? "just now" : "2 weeks ago"}</span>
      </div>
      <span className="mt-2 block h-[5px] w-full rounded-full bg-[#e3e6ea]" />
      <span className="mt-1 block h-[5px] w-2/3 rounded-full bg-[#e3e6ea]" />
    </div>
  );
}
