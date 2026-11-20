"use client";

// The phone body shared by the homepage story and the card-page sandbox: a
// generic phone drawn at a fixed design size (290 x 600), scaled to fit
// whatever space it's given. Kept free of animation libraries so the card
// page stays light.
import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const PHONE_W = 290;
export const PHONE_H = 600;

export function PhoneFrame({
  children,
  dark,
  className,
  maxScale = 1,
  decorative = true,
  after,
}: {
  children: React.ReactNode;
  /** Dark screen: white status bar text. */
  dark?: boolean;
  className?: string;
  maxScale?: number;
  /** Purely illustrative (hidden from screen readers). The sandbox phone is interactive, so it isn't. */
  decorative?: boolean;
  /** Rendered over the scaled phone at real size, e.g. a notification banner. Gets the scale. */
  after?: (scale: number) => React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setScale(Math.min(maxScale, width / PHONE_W, height / PHONE_H));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxScale]);

  return (
    <div ref={box} aria-hidden={decorative || undefined} className={cn("relative grid place-items-center", className)}>
      <div className="relative" style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
        <div
          style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${scale})`, transformOrigin: "top left" }}
          className="relative rounded-[46px] bg-[#1a2233] p-[9px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.12)]"
        >
          <div className="relative h-full overflow-hidden rounded-[38px] bg-white text-[#1d232c]">
            <StatusBar dark={dark} />
            {children}
            <span aria-hidden className="absolute left-1/2 top-2.5 z-20 h-[26px] w-[88px] -translate-x-1/2 rounded-full bg-black" />
          </div>
        </div>
        {after?.(scale)}
      </div>
    </div>
  );
}

function StatusBar({ dark }: { dark?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-between px-7 pt-1 font-mono text-[12px] font-semibold transition-colors duration-500",
        dark ? "bg-transparent text-white [&_.sb]:bg-white [&_.sbb]:border-white" : "bg-white text-[#1d232c] [&_.sb]:bg-[#1d232c] [&_.sbb]:border-[#1d232c]"
      )}
    >
      <span>9:41</span>
      <span className="flex items-end gap-[2px]">
        {[4, 6, 8, 10].map((h) => (
          <span key={h} className="sb w-[3px] rounded-[1px]" style={{ height: h }} />
        ))}
        <span className="sbb ml-1.5 h-[10px] w-[20px] rounded-[3px] border p-[1px]">
          <span className="sb block h-full w-[70%] rounded-[1px]" />
        </span>
      </span>
    </div>
  );
}

export function Stars({ n = 5, size = 10 }: { n?: number; size?: number }) {
  return (
    <span className="flex" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i < n ? "fill-[#f2a93b] text-[#f2a93b]" : "fill-[#dfe3e8] text-[#dfe3e8]"}
        />
      ))}
    </span>
  );
}
