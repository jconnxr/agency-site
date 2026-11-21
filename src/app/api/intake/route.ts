import { NextResponse } from "next/server";
import { intakeSchema } from "@/lib/intake";

// Intake modal submissions. For now they're validated and logged server-side
// (visible in `vercel logs` / the Vercel dashboard). Connect the CRM here later.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Couldn't read the form." }, { status: 400 });
  }

  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    // Spam trap filled in: pretend it worked so bots don't retry
    if (body && typeof body === "object" && "company_url" in body && (body as { company_url?: unknown }).company_url) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, error: "Some answers need another look.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { company_url: _trap, ...lead } = parsed.data;
  console.log("[intake] new submission", JSON.stringify({ receivedAt: new Date().toISOString(), ...lead }));

  return NextResponse.json({ ok: true });
}
