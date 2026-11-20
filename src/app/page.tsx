import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Story } from "@/components/story/story";
import { WhoFor, Showcase, HowItWorks, Promises, Faq, Footer, RevealOnScroll } from "@/components/sections";
import { Packages } from "@/components/packages";
import { Book } from "@/components/book";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 bg-clay px-4 py-2 text-white font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Story />
        <WhoFor />
        <Showcase />
        <Packages />
        <HowItWorks />
        <Promises />
        <Book />
        <Faq />
      </main>
      <Footer />
      <RevealOnScroll />
    </>
  );
}
