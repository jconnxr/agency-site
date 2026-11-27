"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

type NavLink = { href: string; label: string };

const homeLinks: NavLink[] = [
  { href: "#story", label: "How it works" },
  { href: "#who", label: "Who it's for" },
  { href: "#what", label: "What you get" },
  { href: "#packages", label: "Packages" },
  { href: "#how", label: "Getting started" },
  { href: "#faq", label: "Questions" },
  { href: "/partners/", label: "Partners" },
];

/**
 * Floating glass nav. The homepage uses the defaults; other pages pass their own
 * section links, a CTA, and a logo link back home.
 */
export function Header({
  links = homeLinks,
  cta = { href: "#book", label: "Book a call", mobileLabel: "Book a free call" },
  home = "#top",
}: {
  links?: NavLink[];
  cta?: { href: string; label: string; mobileLabel?: string };
  home?: string;
} = {}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-3 top-3 z-40 text-white sm:inset-x-4 md:inset-x-6 md:top-4">
      <div className="glass mx-auto flex h-14 max-w-[1280px] items-center justify-between rounded-full bg-[color-mix(in_srgb,var(--color-panel)_78%,transparent)] pl-4 pr-2 md:h-16 md:pl-6">
        {/* The header is always a dark glass bar, so it always takes the white logo. */}
        <a href={home} className="flex shrink-0 items-center">
          <Image
            src="/brand/AMG-header-white.svg"
            alt="Axiom Media Group"
            width={414}
            height={113}
            priority
            className="h-[30px] w-auto md:h-[38px]"
          />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-4 lg:flex xl:gap-7">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="whitespace-nowrap text-[0.86rem] font-medium text-white/65 transition-colors hover:text-white xl:text-[0.92rem]">
              {l.label}
            </a>
          ))}
          <Button asChild size="sm" className="rounded-full shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--color-brand-glow)_80%,transparent)] hover:bg-brand-ink">
            {/* Straight to the booking section; package buttons open the intake instead */}
            <a href={cta.href}>{cta.label}</a>
          </Button>
        </nav>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="grid size-11 place-items-center rounded-full text-white lg:hidden" aria-label="Open menu">
              <Menu className="size-6" />
            </button>
          </Dialog.Trigger>
          <AnimatePresence>
            {open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="fixed inset-0 z-50 bg-abyss/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild forceMount>
                  <motion.div
                    className="glass fixed inset-x-3 top-3 z-50 rounded-[28px] bg-[color-mix(in_srgb,var(--color-panel)_92%,transparent)] px-5 pb-6 pt-3 text-white"
                    initial={{ opacity: 0, y: -24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.98 }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between">
                      <Dialog.Title>
                        <Image src="/brand/AMG-header-white.svg" alt={site.name} width={414} height={113} className="h-[30px] w-auto" />
                      </Dialog.Title>
                      <Dialog.Close className="grid size-11 place-items-center" aria-label="Close menu">
                        <X className="size-6" />
                      </Dialog.Close>
                    </div>
                    <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
                    <nav aria-label="Mobile" className="mt-4 flex flex-col">
                      {links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="border-b border-white/10 py-4 font-wide text-2xl font-bold"
                        >
                          {l.label}
                        </a>
                      ))}
                    </nav>
                    <Button asChild size="lg" className="mt-6 w-full rounded-full">
                      <a href={cta.href} onClick={() => setOpen(false)}>
                        {cta.mobileLabel ?? cta.label}
                      </a>
                    </Button>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </div>
    </header>
  );
}
