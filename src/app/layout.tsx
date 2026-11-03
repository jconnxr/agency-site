import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/lib/site";
import "./globals.css";

// Self-hosted variable fonts (zero layout shift, no Google request at runtime).
// With network access you can switch to next/font/google with the same families.
const bitter = localFont({
  src: "./fonts/bitter-latin-wght-normal.woff2",
  variable: "--font-bitter",
  weight: "100 900",
  display: "swap",
});
const publicSans = localFont({
  src: "./fonts/public-sans-latin-wght-normal.woff2",
  variable: "--font-public-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} | Websites, Google profiles and ads for Oklahoma City businesses`,
  description:
    "We set up the online side of your business and keep it bringing in customers: websites, Google Business Profiles, online booking, social media and ads in Oklahoma City.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bitter.variable} ${publicSans.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
