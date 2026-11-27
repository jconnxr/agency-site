// Partner referral attribution. A partner's QR or link carries ?ref=<slug>
// (e.g. ?ref=anderson-insurance). On landing we keep it, plus any UTM tags, for
// 90 days in localStorage, with a first-party cookie as a backup for browsers
// that block storage. Every form submission and Calendly link then carries it,
// so the partner gets credit even if the visitor books a week later.
// Browser-only helpers: call them from effects or event handlers, never during render.

export const REF_DAYS = 90;
const KEY = "amg-ref";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;

export type Attribution = { ref: string; utm: Utm; at: number };

/** Slugs only: lowercase letters, numbers and dashes. Anything else is dropped. */
export function cleanRef(v: string | null | undefined): string {
  if (!v) return "";
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

const cleanUtm = (v: string) => v.trim().slice(0, 100);
const fresh = (a: Attribution | null) => !!a && Date.now() - a.at < REF_DAYS * 864e5;

function parse(raw: string | null | undefined): Attribution | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    if (!v || typeof v !== "object" || typeof v.at !== "number") return null;
    const utm: Utm = {};
    for (const k of UTM_KEYS) if (typeof v.utm?.[k] === "string") utm[k] = cleanUtm(v.utm[k]);
    return { ref: cleanRef(v.ref), utm, at: v.at };
  } catch {
    return null;
  }
}

function readCookie(): string | null {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${KEY}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

/** What's stored, if it's under 90 days old. */
export function loadAttribution(): Attribution | null {
  let a: Attribution | null = null;
  try {
    a = parse(localStorage.getItem(KEY));
  } catch {}
  if (!a) a = parse(readCookie());
  return fresh(a) ? a : null;
}

function save(a: Attribution) {
  const raw = JSON.stringify(a);
  try {
    localStorage.setItem(KEY, raw);
  } catch {}
  try {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${KEY}=${encodeURIComponent(raw)}; Max-Age=${REF_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
  } catch {}
}

/**
 * Read ?ref= and utm_* from the current URL and store them. A new ref replaces
 * the old one (the most recent partner gets the credit) and restarts the 90 days;
 * UTMs on a visit without a ref are kept alongside the stored ref.
 */
export function captureAttribution(search = typeof location === "undefined" ? "" : location.search) {
  const q = new URLSearchParams(search);
  const ref = cleanRef(q.get("ref"));
  const utm: Utm = {};
  for (const k of UTM_KEYS) {
    const v = q.get(k);
    if (v) utm[k] = cleanUtm(v);
  }
  const hasUtm = Object.keys(utm).length > 0;
  if (!ref && !hasUtm) return loadAttribution();

  const prev = loadAttribution();
  const next: Attribution = {
    ref: ref || prev?.ref || "",
    utm: hasUtm ? utm : (prev?.utm ?? {}),
    at: ref ? Date.now() : (prev?.at ?? Date.now()),
  };
  save(next);
  return next;
}

/** Fields every form adds to its submission. */
export function attributionFields(): { ref: string; utm: Utm } {
  const a = loadAttribution();
  return { ref: a?.ref ?? "", utm: a?.utm ?? {} };
}

/**
 * Calendly tracks utm_* on each booking. Keep the visitor's own UTMs as they
 * came in; the partner ref rides in utm_content (or utm_term if that's taken).
 */
export function calendlyTracking(defaults: Utm = {}): URLSearchParams {
  const a = loadAttribution();
  const q = new URLSearchParams();
  const utm: Utm = { ...defaults, ...(a?.utm ?? {}) };
  if (a?.ref) {
    if (!utm.utm_content) utm.utm_content = `ref-${a.ref}`;
    else if (!utm.utm_term) utm.utm_term = `ref-${a.ref}`;
  }
  for (const k of UTM_KEYS) if (utm[k]) q.set(k, utm[k]!);
  return q;
}

/** Add ?ref= to an internal link so credit survives a switch of device or browser. */
export function withRef(href: string, ref: string | undefined) {
  if (!ref) return href;
  const [path, hash] = href.split("#");
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}ref=${encodeURIComponent(ref)}${hash !== undefined ? `#${hash}` : ""}`;
}
