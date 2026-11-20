// Custom next/image loader for the static export. Next can't resize images at
// request time here, so scripts/optimize-images.mjs pre-builds each photo at a
// few widths, and this picks the smallest one that covers the requested width.
import { imageManifest } from "./images";

const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? "";

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const entry = imageManifest[src];
  if (!entry) return prefix + src;
  const w = entry.widths.find((x) => x >= width) ?? entry.widths[entry.widths.length - 1];
  return `${prefix}${src.replace(/\.webp$/, `-${w}.webp`)}`;
}
