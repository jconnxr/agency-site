// One place to scroll the page from code. When Lenis smooth scroll is running it
// does the scrolling (so it stays in sync with ScrollTrigger); otherwise, and for
// reduced-motion visitors, the browser jumps straight there.
import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToY(y: number) {
  const instant = prefersReducedMotion();
  if (lenis && !instant) {
    lenis.scrollTo(y, { duration: 0.9, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
  } else {
    window.scrollTo({ top: y, behavior: instant ? "auto" : "smooth" });
  }
}
