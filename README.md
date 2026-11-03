# [Agency Name] landing page

A one-page site for the agency: hero, who it's for, the three packages, how it works, booking (an inline Calendly embed plus a contact form), FAQ.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 (brand tokens in `src/app/globals.css`)
- shadcn/ui-style components on Radix primitives (`src/components/ui`)
- Framer Motion (mobile menu, form success state)
- GSAP + ScrollTrigger (hero listing animation, package staircase reveal)
- Lenis smooth scroll (`src/components/smooth-scroll.tsx`)
- React Hook Form + Zod, sending through Formspree
- Calendly inline widget
- Lucide icons
- Self-hosted Bitter + Public Sans through `next/font/local`

Not included yet: an MDX blog (add Velite once there's content to post) and React Three Fiber.

## Edit the content

Everything a non-developer would change lives in `src/lib/site.ts`: the name, email, Calendly link, package prices and FAQ. Replace `[Agency Name]` there, and the logo in `src/components/header.tsx`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Connect the contact form

1. Create a free form at https://formspree.io and copy its ID (the part after `/f/`).
2. Add `NEXT_PUBLIC_FORMSPREE_ID=yourid` to `.env.local`, and to Vercel's environment variables.

To use Resend instead, remove `output: "export"` from `next.config.mjs`, then add a route handler at `src/app/api/contact/route.ts` and point the form there.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com/new. It detects Next.js automatically.
3. Add the Formspree environment variable, deploy, then connect your domain.

Keep TypeScript on version 5. Next.js 15's build doesn't work with TypeScript 7.
