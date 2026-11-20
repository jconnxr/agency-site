// Print-ready QR for the business card. It points at our own short redirect
// (/c, set in vercel.json), so the destination can change without reprinting.
// High error correction, navy on white, with the standard 4-module quiet zone.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import QRCode from "qrcode";

const url = "https://axiommediagroupokc.com/c";
const out = resolve(import.meta.dirname, "../print");
mkdirSync(out, { recursive: true });

const opts = { errorCorrectionLevel: "H", margin: 4, color: { dark: "#0b1220ff", light: "#ffffffff" } };
writeFileSync(join(out, "axiom-card-qr.svg"), await QRCode.toString(url, { ...opts, type: "svg" }));
await QRCode.toFile(join(out, "axiom-card-qr.png"), url, { ...opts, type: "png", width: 3000 });
console.log(`QR for ${url} written to print/`);
