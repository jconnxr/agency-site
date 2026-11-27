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

Prices live in one place, the `prices` object near the top of `src/lib/site.ts`. The packages section, the Launch Pro payment plan (price ÷ 3), the bundle and its savings (Launch Pro minus the bundle price) and its payment plan (bundle ÷ 3), the FAQ answers, the hero chip, the `/partners` package cards and the partner calculator all read from it.

## Partner program (`/partners`)

The landing page for referral partners and their QR codes. Program facts (seats, fees, steps, FAQ) live in `src/lib/partners.ts`; prices come from `src/lib/site.ts`.

- `?type=insurance|cpa|lender|cre|attorney|photographer` opens the page on that partner's tab (and keeps the address bar in step as the tab changes).
- `?ref=<partner-slug>` works on every page. It's stored for 90 days (localStorage plus a first-party cookie, `src/lib/ref.ts`) and sent with every form (intake modal, contact form, partner form) and Calendly link (`utm_content=ref-<slug>`, keeping any UTMs the visitor arrived with). Lead emails show it under "Attribution".
- To greet a partner's clients by name, add the slug to `partnerNames` in `src/lib/partners.ts`. Unlisted slugs show "a partner", never the raw slug.
- Bank and credit union employees are locked to the client-discount option (no fee) in the seat picker, calculator and form.

## E-commerce Growth (`/ecommerce`)

The second lane, for online brands (most traffic from X). It's linked from a slim last tile in the homepage "What you get" grid and the footer, and on purpose it isn't in the header nav or the hero. Page facts and the FAQ live in `src/lib/ecommerce.ts`. Prices live in `ecommerce` in `src/lib/site.ts`, all `null` until approved, so the page says "Pricing after your free audit".

The Store Audit form posts to `/api/intake` with `kind: "ecommerce"` and `lead_type: "ecommerce"`, plus the visitor's `?ref=` and UTMs. The CRM webhook gets `lead_type` on every lead (`local`, `partner` or `ecommerce`), and the email subject starts "New e-commerce Store Audit request".

### Make a partner QR code

```bash
node scripts/make-partner-qr.mjs anderson-insurance insurance
```

Writes `public/qr/anderson-insurance-insurance.svg` (vector, for print) and a 3000px PNG, pointing at `https://axiommediagroupokc.com/partners?ref=anderson-insurance&type=insurance`. Slugs are lowercase letters, numbers and dashes.

## Link preview images

`node scripts/make-og-image.mjs` (after `npm run build`) renders `public/og-image.png` and `public/og-partners.png` from `scripts/og/*.html`.

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
