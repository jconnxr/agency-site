// Print-ready QR codes for referral partners. Each one opens /partners on the
// partner's seat and credits them (?ref=<slug>&type=<type>, stored for 90 days).
//
//   node scripts/make-partner-qr.mjs anderson-insurance insurance
//
// Writes public/qr/<slug>-<type>.svg (vector, for print) and a 3000px PNG.
// High error correction, navy on white, standard 4-module quiet zone, same as
// the business-card QR (scripts/make-qr.mjs). Add the partner's display name to
// src/lib/partners.ts (partnerNames) so the page can greet their clients by name.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import QRCode from "qrcode";

// Keep in step with partnerTypeIds in src/lib/partners.ts
const types = ["insurance", "cpa", "lender", "cre", "attorney", "photographer"];

const [rawSlug, type] = process.argv.slice(2);
// Same cleaning the site applies to ?ref= (src/lib/ref.ts), so what's printed is what gets stored
const slug = (rawSlug ?? "")
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9-]/g, "")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 64);

if (!slug || !types.includes(type)) {
  console.error(`Usage: node scripts/make-partner-qr.mjs <partner-slug> <type>\n  type: ${types.join(" | ")}`);
  process.exit(1);
}
if (slug !== rawSlug) console.warn(`Note: slug cleaned to "${slug}"`);

const url = `https://axiommediagroupokc.com/partners?ref=${slug}&type=${type}`;
const out = resolve(import.meta.dirname, "../public/qr");
mkdirSync(out, { recursive: true });

const opts = { errorCorrectionLevel: "H", margin: 4, color: { dark: "#0b1220ff", light: "#ffffffff" } };
const name = `${slug}-${type}`;
writeFileSync(join(out, `${name}.svg`), await QRCode.toString(url, { ...opts, type: "svg" }));
await QRCode.toFile(join(out, `${name}.png`), url, { ...opts, type: "png", width: 3000 });
console.log(`QR for ${url}\n  public/qr/${name}.svg\n  public/qr/${name}.png`);
