"use client";

// Page-wide tracking for the card page: one view event with the source, any
// click on an element with data-track, and a booking completed inside Calendly.
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { track } from "./track";

export function CardTracker() {
  useEffect(() => {
    track("Card page view");

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (el) track(el.dataset.track!, el.dataset.where ? { where: el.dataset.where } : {});
    };
    // Calendly posts this message when someone finishes booking in the embed.
    const onMessage = (e: MessageEvent) => {
      if (e.origin === "https://calendly.com" && e.data?.event === "calendly.event_scheduled") track("Booked a call");
    };
    document.addEventListener("click", onClick);
    window.addEventListener("message", onMessage);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return <Analytics />;
}
