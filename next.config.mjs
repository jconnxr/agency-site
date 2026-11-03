// `output: "export"` builds a static site (the `out/` folder) that can be
// hosted anywhere. On Vercel you can delete `output` to get the full
// Next.js server (needed if you later swap Formspree for a Resend API route).
// PREVIEW=1 builds with relative asset paths for the claude.ai preview link.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(process.env.PREVIEW === "1" ? { assetPrefix: "." } : {}),
};

export default nextConfig;
