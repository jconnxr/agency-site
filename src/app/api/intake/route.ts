import { NextResponse } from "next/server";
import { HONEYPOT, MIN_FILL_MS, contactSchema, intakeSchema, partnerSchema, ecommerceSchema } from "@/lib/intake";
import { deliver, type Lead } from "@/lib/server/deliver";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

// Intake modal, contact form, /partners and /ecommerce form submissions.
// 1. Rate limit per IP, then drop obvious bots (honeypot, filled in too fast).
// 2. Validate with the same schema the browser uses.
// 3. Log the full submission (always), then email it via Resend and POST it to
//    the CRM webhook in parallel. A failed CRM post never blocks the email, and
//    the visitor gets a success either way: the log keeps every lead.
export async function POST(req: Request) {
  const limit = rateLimit(clientIp(req));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions from this connection. Please try again in a few minutes, or book a call below." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Couldn't read the form." }, { status: 400 });
  }

  // Bots: answer like a success so they don't retry, but deliver nothing.
  const elapsed = typeof body.elapsedMs === "number" ? body.elapsedMs : undefined;
  if (body[HONEYPOT] || (elapsed !== undefined && elapsed < MIN_FILL_MS)) {
    console.warn("[intake] dropped as spam", JSON.stringify({ honeypot: !!body[HONEYPOT], elapsedMs: elapsed }));
    return NextResponse.json({ ok: true });
  }

  const schema =
    body.kind === "contact"
      ? contactSchema
      : body.kind === "partner"
        ? partnerSchema
        : body.kind === "ecommerce"
          ? ecommerceSchema
          : intakeSchema;
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: "Some answers need another look.", issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // Spam-check fields stay here; the log, email and CRM get the lead only
  const { company_url: _trap, elapsedMs: _elapsed, ...lead } = result.data;
  const receivedAt = new Date().toISOString();
  console.log("[intake] new submission", JSON.stringify({ receivedAt, ...lead }));

  const outcome = await deliver(lead as Lead, receivedAt);
  for (const [dest, r] of Object.entries(outcome)) {
    if (r.ok) console.log(`[intake] ${dest}: sent`);
    else if ("skipped" in r && r.skipped) console.log(`[intake] ${dest}: skipped (${r.error})`);
    else console.error(`[intake] ${dest}: FAILED (${r.error})`);
  }
  if (!outcome.email.ok && !outcome.crm.ok) {
    console.error("[intake] NOT DELIVERED anywhere; the submission above is the only copy");
  }

  return NextResponse.json({ ok: true });
}
