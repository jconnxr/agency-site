import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Story } from "@/components/story/story";
import { Showcase } from "@/components/bento";
import { WhoFor, Promises, Faq, Footer } from "@/components/sections";
import { HowItWorks, LaunchTimeline } from "@/components/process";
import { Packages } from "@/components/packages";
import { Book } from "@/components/book";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Backdrop, Marquee } from "@/components/fx";
import { MotionRoot } from "@/components/motion-root";
import { AiSearch } from "@/components/ai-search";
import { StructuredData } from "@/components/structured-data";

const marquee = ["Websites", "Google Business Profile", "AI Search", "Online Booking", "Reviews", "Social", "Ads", "Drone Shoots"];

export default function Home() {
  return (
    <MotionRoot>
      <StructuredData />
      <div className="home relative isolate overflow-x-clip">
      <Backdrop />
      <SmoothScroll />
      <a
        href="#main"
        className="sr-only z-50 bg-clay px-4 py-2 text-white font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Marquee items={marquee} className="-mb-8 -mt-14 py-8 md:-mb-10 md:-mt-20" />
        <Story />
        <WhoFor />
        <Showcase />
        <AiSearch />
        <Packages />
        <HowItWorks />
        <LaunchTimeline />
        <Promises />
        <Book />
        <Faq />
      </main>
      <Footer />
      </div>
    </MotionRoot>
  );
}
