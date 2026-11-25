// Delivers a validated submission: an email to the owner through Resend, and a
// POST to the CRM webhook when one is configured. Each runs independently; a
// failure in one never blocks the other, and both outcomes are logged.
import { packageSources, type Submission as Parsed } from "@/lib/intake";

/** A submission with the spam-check fields removed (distributes over the union). */
type Submission = Parsed extends infer T ? (T extends unknown ? Omit<T, "company_url" | "elapsedMs"> : never) : never;
export type Lead = Submission;

type Row = [label: string, value: string];

/** The package or offer in the subject line, falling back to a plain label. */
function subjectFor(s: Submission) {
  if (s.kind === "contact") return `New contact form: ${s.interest} · ${s.business}`;
  const pkg = packageSources.includes(s.source) ? s.source : "General inquiry";
  return `New intake: ${pkg} · ${s.business}`;
}

function rowsFor(s: Submission): { title: string; rows: Row[] }[] {
  if (s.kind === "contact") {
    return [
      {
        title: "Contact",
        rows: [
          ["Name", s.name],
          ["Business", s.business],
          ["Email", s.email],
          ["Phone", s.phone || "Not given"],
        ],
      },
      {
        title: "Request",
        rows: [
          ["Interested in", s.interest],
          ["Message", s.message || "No message"],
        ],
      },
    ];
  }
  return [
    {
      title: "Contact",
      rows: [
        ["Name", s.name],
        ["Email", s.email],
        ["Phone", s.phone],
      ],
    },
    {
      title: "Business",
      rows: [
        ["Business", s.business],
        ["Industry", s.industry],
        ["City", s.city],
        ["Website", s.website || "None yet"],
      ],
    },
    {
      title: "What they want",
      rows: [
        ["Opened from", s.source || "Unknown"],
        ["Services", s.services.join(", ")],
        ["Type", s.engagement],
        ["Budget", s.budget],
        ["Timeline", s.timeline],
      ],
    },
  ];
}

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function formatEmail(s: Submission, receivedAt: string) {
  const sections = rowsFor(s);
  const when = new Date(receivedAt).toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "medium", timeStyle: "short" });
  const text = [
    subjectFor(s),
    `Received ${when} (Central)`,
    "",
    ...sections.flatMap((sec) => [sec.title.toUpperCase(), ...sec.rows.map(([k, v]) => `${k}: ${v}`), ""]),
    `Reply to this email to answer ${s.name} directly.`,
  ].join("\n");

  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="margin:0;background:#f4f1ea;padding:24px;font-family:-apple-system,Segoe UI,Arial,sans-serif;color:#0f1a2a">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #dcd4c5" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 28px 8px">
<p style="margin:0;font:600 11px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:#4046d8">${s.kind === "contact" ? "Contact form" : "Intake form"} · ${esc(when)} Central</p>
<h1 style="margin:8px 0 0;font-size:20px;line-height:1.3">${esc(subjectFor(s))}</h1>
</td></tr>
${sections
  .map(
    (sec) => `<tr><td style="padding:16px 28px 0">
<p style="margin:0 0 6px;font:600 11px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:#5b6370">${esc(sec.title)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee7da">
${sec.rows
  .map(
    ([k, v]) => `<tr><td style="padding:8px 12px 8px 0;width:120px;vertical-align:top;color:#5b6370;font-size:14px;border-bottom:1px solid #eee7da">${esc(k)}</td><td style="padding:8px 0;font-size:14px;border-bottom:1px solid #eee7da;white-space:pre-wrap">${esc(v)}</td></tr>`
  )
  .join("")}
</table></td></tr>`
  )
  .join("")}
<tr><td style="padding:20px 28px 26px;font-size:13px;color:#5b6370">Reply to this email to answer ${esc(s.name)} directly.</td></tr>
</table></body></html>`;

  return { subject: subjectFor(s), text, html };
}

async function sendEmail(s: Submission, receivedAt: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return { ok: false as const, skipped: true, error: "RESEND_API_KEY or NOTIFY_EMAIL not set" };

  const { subject, text, html } = formatEmail(s, receivedAt);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      // Must be on a domain verified in Resend; onboarding@resend.dev works for
      // testing but only delivers to the Resend account's own address.
      from: process.env.RESEND_FROM || "Axiom Intake <onboarding@resend.dev>",
      to: to.split(",").map((e) => e.trim()).filter(Boolean),
      reply_to: s.email,
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return { ok: false as const, error: `Resend ${res.status}: ${(await res.text()).slice(0, 300)}` };
  return { ok: true as const };
}

async function postToCrm(s: Submission, receivedAt: string) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return { ok: false as const, skipped: true, error: "CRM_WEBHOOK_URL not set" };
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.CRM_WEBHOOK_SECRET) headers.Authorization = `Bearer ${process.env.CRM_WEBHOOK_SECRET}`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ receivedAt, ...s }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return { ok: false as const, error: `CRM ${res.status}: ${(await res.text()).slice(0, 300)}` };
  return { ok: true as const };
}

/** Sends to every configured destination in parallel and reports what happened. */
export async function deliver(s: Submission, receivedAt: string) {
  const [email, crm] = await Promise.allSettled([sendEmail(s, receivedAt), postToCrm(s, receivedAt)]);
  const outcome = (r: PromiseSettledResult<{ ok: boolean; skipped?: boolean; error?: string }>) =>
    r.status === "fulfilled" ? r.value : { ok: false, error: String(r.reason) };
  return { email: outcome(email), crm: outcome(crm) };
}
