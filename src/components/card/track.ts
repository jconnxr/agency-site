// Analytics for the card page. Every event carries the visitor's source
// (?src=card from the QR redirect), kept for the visit in sessionStorage.
// Never sends what people type: only that they typed something.
import { track as vercelTrack } from "@vercel/analytics";

const KEY = "axiom-src";

export function source(): string {
  if (typeof window === "undefined") return "direct";
  const clean = (v: string | null) => (v ? v.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 32) : "");
  const fromUrl = clean(new URLSearchParams(window.location.search).get("src"));
  try {
    if (fromUrl) sessionStorage.setItem(KEY, fromUrl);
    return fromUrl || sessionStorage.getItem(KEY) || "direct";
  } catch {
    return fromUrl || "direct";
  }
}

export function track(name: string, props: Record<string, string> = {}) {
  vercelTrack(name, { src: source(), ...props });
}

// What the sandbox remembers between visits (and hands to the booking form).
export const BIZ_KEY = "axiom-card-biz";
export type Biz = { name: string; trade: string };

export function loadBiz(): Biz | null {
  try {
    const v = JSON.parse(localStorage.getItem(BIZ_KEY) ?? "null");
    return v && typeof v.name === "string" && typeof v.trade === "string" ? v : null;
  } catch {
    return null;
  }
}

export function saveBiz(b: Biz) {
  try {
    localStorage.setItem(BIZ_KEY, JSON.stringify(b));
  } catch {}
}
