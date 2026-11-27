// Renders each link preview card (scripts/og/*.html) to public/ (1200x630) with
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

const cards = [
  ["og-image.html", "og-image.png"],
  ["og-partners.html", "og-partners.png"],
  ["og-ecommerce.html", "og-ecommerce.png"],
];
const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const tmp = mkdtempSync(join(tmpdir(), "og-"));

for (const [src, png] of cards) {
  const html = readFileSync(join(root, "scripts/og", src), "utf8")
    .replace("__ARCHIVO__", "file://" + latinFont("Archivo", "100 900"))
    .replace("__PLEX__", "file://" + latinFont("IBM Plex Mono", "500"))
    .replace("__SERIF__", "file://" + latinFont('"Instrument Serif"', "400"))
    .replace("__LOGO__", "file://" + join(root, "public/brand/AMG-header-white.svg"));
  const page = join(tmp, src);
  const shot = join(tmp, png);
  writeFileSync(page, html);
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
  await sharp(shot).resize(1200, 630).png({ compressionLevel: 9, palette: false }).toFile(join(root, "public", png));
  console.log(`Wrote public/${png}`);
}
