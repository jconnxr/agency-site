// `output: "export"` builds a static site (the `out/` folder) that can be
// hosted anywhere. On Vercel you can delete `output` to get the full
// Next.js server (needed if you later swap Formspree for a Resend API route).
// PREVIEW=1 builds with relative asset paths for the claude.ai preview link.
//
// Photos are pre-sized by scripts/optimize-images.mjs; the custom loader picks
// the right width, so next/image still gets a responsive srcset in a static export.
const preview = process.env.PREVIEW === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Sources are 1024px wide, so nothing larger is exported; keep the srcset to
    // widths that map to real files (the loader picks the closest one).
    deviceSizes: [640, 960, 1024],
    imageSizes: [480],
  },
  trailingSlash: true,
  env: { NEXT_PUBLIC_ASSET_PREFIX: preview ? "." : "" },
  ...(preview ? { assetPrefix: "." } : {}),
};

export default nextConfig;
