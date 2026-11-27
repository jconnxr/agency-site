"use client";

// The real booking: Calendly, loaded only when the visitor gets close to it so
// the page stays fast on mobile data. Whatever they typed in the sandbox goes
// into the booking notes, and the source rides along as UTM tags.
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { tradeById } from "@/lib/trades";
import { loadBiz, source } from "./track";
import { calendlyTracking } from "@/lib/ref";

export function CalendlyEmbed() {
  const box = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const q = new URLSearchParams({ hide_gdpr_banner: "1", primary_color: "464ceb" });
        // The card's own tags unless the visitor arrived with UTMs; a partner ref rides along.
        calendlyTracking({ utm_source: source(), utm_medium: "card-page" }).forEach((v, k) => q.set(k, v));
        const biz = loadBiz();
        if (biz?.name.trim()) q.set("a1", `Business: ${biz.name.trim()} (${tradeById(biz.trade).label}). Scanned our card.`);
        setUrl(`${site.calendlyUrl}?${q}`);
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Load Calendly's script once the widget is in the page.
  useEffect(() => {
    if (!url) return;
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);
  }, [url]);

  return (
    <div ref={box} className="overflow-hidden rounded-md border border-line bg-white">
      {url ? (
        <div className="calendly-inline-widget h-[700px] min-w-[300px]" data-url={url} />
      ) : (
        <div className="grid h-[700px] place-items-center text-sm text-muted">Loading the calendar&hellip;</div>
      )}
      <p className="border-t border-line px-5 py-3 text-sm text-muted">
        Calendar not showing?{" "}
        <a
          href={site.calendlyUrl}
          target="_blank"
          rel="noopener"
          data-track="Tapped book"
          data-where="calendly fallback link"
          className="font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-brand"
        >
          Open the booking page
        </a>
      </p>
    </div>
  );
}
