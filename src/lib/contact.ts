import { site } from "./site";

// Call / Text links built from site.phone. Both are null while it's empty.
export const phoneDisplay = site.phone
  ? site.phone.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3")
  : null;
export const telHref = site.phone ? `tel:${site.phone}` : null;
// "?&body=" works on both iOS and Android.
export const smsHref = site.phone
  ? `sms:${site.phone}?&body=${encodeURIComponent("Hi, I got your card. ")}`
  : null;

export const mainSite = "https://www.axiommediagroupokc.com";
export const goSite = "https://go.axiommediagroupokc.com";
