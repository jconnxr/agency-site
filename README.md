# Axiom Media Group landing page

A one-page site for the agency: hero, who it's for, the three packages, how it works, booking (an inline Calendly embed plus a contact form), FAQ.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 (brand tokens in `src/app/globals.css`)
- shadcn/ui-style components on Radix primitives (`src/components/ui`)
- Framer Motion (mobile menu, form success state)
- GSAP + ScrollTrigger (hero listing animation, package staircase reveal)
- Lenis smooth scroll (`src/components/smooth-scroll.tsx`)
- React Hook Form + Zod; both forms post to `/api/intake` (Resend email + CRM webhook)
- Calendly inline widget
- Lucide icons
- Self-hosted Bitter + Public Sans through `next/font/local`

Not included yet: an MDX blog (add Velite once there's content to post) and React Three Fiber.

## Edit the content

Everything a non-developer would change lives in `src/lib/site.ts`: the name, email, Calendly link, package prices and FAQ. Change it there, and the logo in `src/components/header.tsx`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Intake modal

Every package button and "Book a call" CTA opens a 4-step intake modal (`src/components/intake.tsx`), with the clicked package's services pre-checked (mapping in `src/lib/intake.ts`). The contact form next to Calendly posts to the same route (`source: "contact-form"`).

`POST /api/intake` (`src/app/api/intake/route.ts`):

1. Rate limits each IP (5 per 10 minutes, in memory; add a Vercel Firewall rule for a hard global limit) and silently drops bots (hidden `company_url` field, or a form filled in under 3 seconds).
2. Validates with the same zod schema the browser uses (`src/lib/intake.ts`).
3. Logs every submission, then in parallel emails it through Resend and POSTs it to the CRM webhook (`src/lib/server/deliver.ts`). A failure in one never blocks the other, and the visitor always sees success; anything that wasn't delivered anywhere is flagged `NOT DELIVERED` in the logs with the full submission above it.

Because of this route the site runs as a full Next.js app on Vercel rather than a static export.

### Environment variables (Vercel → Settings → Environment Variables)

| Name | Required | What it is |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Resend API key |
| `NOTIFY_EMAIL` | Yes | Where lead emails go (comma-separate for several) |
| `RESEND_FROM` | Recommended | Sender on a domain verified in Resend, e.g. `Axiom Intake <leads@axiommediagroupokc.com>`. Without it, `onboarding@resend.dev` is used, which only delivers to the Resend account's own email |
| `CRM_WEBHOOK_URL` | Optional | Every submission is POSTed here as JSON |
| `CRM_WEBHOOK_SECRET` | Optional | Sent to the webhook as `Authorization: Bearer <secret>` |

See `.env.example`.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com/new. It detects Next.js automatically.
3. Add the environment variables listed under "Environment variables" above, deploy, then connect your domain.

Keep TypeScript on version 5. Next.js 15's build doesn't work with TypeScript 7.
