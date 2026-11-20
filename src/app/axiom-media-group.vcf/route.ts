// "Save our contact" on the card page: a vCard built from site.ts at build time.
import { site } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1");

export function GET() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${esc(site.name)}`,
    `ORG:${esc(site.name)}`,
    site.phone && `TEL;TYPE=WORK,VOICE:${site.phone}`,
    site.email && `EMAIL;TYPE=WORK:${site.email}`,
    "URL:https://www.axiommediagroupokc.com",
    `ADR;TYPE=WORK:;;;${esc(site.city)};OK;;USA`,
    `NOTE:${esc(`Websites, Google profiles and ads for ${site.city} businesses. Book a free call: ${site.calendlyUrl}`)}`,
    "END:VCARD",
  ].filter(Boolean);
  return new Response(lines.join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/vcard; charset=utf-8" },
  });
}
