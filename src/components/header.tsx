"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

const links = [
  { href: "#who", label: "Who it's for" },
  { href: "#what", label: "What you get" },
  { href: "#packages", label: "Packages" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "Questions" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 text-white backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="flex items-center gap-2.5 font-display text-xl font-bold text-white">
          <Logo />
          {site.name}
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[0.95rem] font-medium text-white/70 transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
          <Button asChild size="sm">
            <a href="#book">Book a call</a>
          </Button>
        </nav>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="grid size-11 place-items-center rounded-sm text-white md:hidden" aria-label="Open menu">
              <Menu className="size-6" />
            </button>
          </Dialog.Trigger>
          <AnimatePresence>
            {open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="fixed inset-0 z-50 bg-ink/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild forceMount>
                  <motion.div
                    className="fixed inset-x-0 top-0 z-50 rounded-b-lg bg-paper text-ink px-5 pb-8 pt-4 shadow-xl"
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="font-display text-xl font-bold">{site.name}</Dialog.Title>
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
                          className="border-b border-line py-4 font-display text-2xl font-semibold"
                        >
                          {l.label}
                        </a>
                      ))}
                    </nav>
                    <Button asChild size="lg" className="mt-6 w-full">
                      <a href="#book" onClick={() => setOpen(false)}>
                        Book a free call
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

// Placeholder mark: a simple stepped shape (three rising tiers). Replace with the real logo.
function Logo() {
  return (
    <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
      <rect x="2" y="16" width="7" height="10" rx="1.5" fill="var(--color-sky-deep)" />
      <rect x="10.5" y="10" width="7" height="16" rx="1.5" fill="var(--color-flag)" />
      <rect x="19" y="3" width="7" height="23" rx="1.5" fill="var(--color-wheat)" />
    </svg>
  );
}
