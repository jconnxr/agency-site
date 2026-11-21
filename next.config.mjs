// Runs as a full Next.js app (no static export) so /api/intake works on Vercel.
// PREVIEW=1 still builds with relative asset paths, but a static preview can't
// run the API route, so the intake form won't submit there.
//
// Photos are pre-sized by scripts/optimize-images.mjs; the custom loader picks
// the right width, so next/image still gets a responsive srcset in a static export.
const preview = process.env.PREVIEW === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
