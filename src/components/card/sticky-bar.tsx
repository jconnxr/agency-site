"use client";

// Phone-only bar pinned to the bottom: Book a call and Text us. It steps aside
// while the booking section itself is on screen.
import { useEffect, useState } from "react";
import { smsHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

export function StickyBar() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const book = document.getElementById("book");
    if (!book) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { rootMargin: "0px 0px -30% 0px" });
    io.observe(book);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-night-line bg-night/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 md:hidden",
        hidden && "translate-y-full"
      )}
      inert={hidden || undefined}
    >
      <div className="flex gap-2.5">
        <a
          href="#book"
          data-track="Tapped book"
          data-where="sticky bar"
          className="flex h-12 flex-1 items-center justify-center rounded-sm bg-clay font-semibold text-white"
        >
          Book a call
        </a>
        {smsHref && (
          <a
            href={smsHref}
            data-track="Tapped text"
            data-where="sticky bar"
            className="flex h-12 flex-1 items-center justify-center rounded-sm border border-white/25 font-semibold text-white"
          >
            Text us
          </a>
        )}
      </div>
    </div>
  );
}
