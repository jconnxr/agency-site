"use client";

// Stores ?ref= and UTM tags on landing, on every page (see src/lib/ref.ts).
import { useEffect } from "react";
import { captureAttribution } from "@/lib/ref";

export function RefCapture() {
  useEffect(() => {
    const a = captureAttribution();
    // Lets components already on the page (the partner welcome, Calendly links) refresh
    if (a) window.dispatchEvent(new CustomEvent("amg:attribution"));
  }, []);
  return null;
}
