// Renders scripts/og/og-image.html to public/og-image.png (1200x630) with
// headless Chrome, using the same Archivo and IBM Plex Mono files next/font
// self-hosts. Run after `npm run build`:  node scripts/make-og-image.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const cssDir = join(root, ".next/static/css");
const css = readdirSync(cssDir).map((f) => readFileSync(join(cssDir, f), "utf8")).join("\n");

// The latin subset of each font (its unicode-range starts with u+00??).
function latinFont(family, weight) {
  const face = css
    .split("@font-face")
    .find((f) => f.includes(`font-family:${family}`) && f.includes(`font-weight:${weight}`) && f.includes("unicode-range:u+00??"));
  if (!face) throw new Error(`No latin ${family} ${weight} in the build. Run npm run build first.`);
  return join(root, ".next", face.match(/url\(\/_next\/([^)]+)\)/)[1]);
}

const html = readFileSync(join(root, "scripts/og/og-image.html"), "utf8")
  .replace("__ARCHIVO__", "file://" + latinFont("Archivo", "100 900"))
  .replace("__PLEX__", "file://" + latinFont("IBM Plex Mono", "500"));

const tmp = mkdtempSync(join(tmpdir(), "og-"));
const page = join(tmp, "og.html");
const shot = join(tmp, "og.png");
writeFileSync(page, html);

const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--allow-file-access-from-files",
  "--force-device-scale-factor=1",
  "--window-size=1200,630",
  "--virtual-time-budget=3000",
  `--screenshot=${shot}`,
  "file://" + page,
], { stdio: "ignore" });

await sharp(shot).resize(1200, 630).png({ compressionLevel: 9, palette: false }).toFile(join(root, "public/og-image.png"));
console.log("Wrote public/og-image.png");
