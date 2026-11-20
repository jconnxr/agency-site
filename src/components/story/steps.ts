// The "Watch a customer find you" story. Each step is one beat of a customer's
// journey, the service that makes it happen, and what the owner sees on their side.
// The business in the demo is fictional.

export type Screen = "search" | "listing" | "website" | "booking" | "messages" | "missed" | "ad" | "social" | "reel";

export type OwnerEvent =
  | { kind: "count"; label: string; to: number; detail?: string }
  | { kind: "alert"; label: string; detail: string; stars?: boolean; success?: boolean };

export type Step = {
  service: string;
  title: string;
  body: string;
  /** One short line for phones, where the full body doesn't fit beside the phone. */
  short: string;
  screen: Screen;
  owner: OwnerEvent;
  /** Mobile owner-notification placement for this step (design px of the 290x600 phone).
      canStay: the area it covers holds nothing important, so it stays; otherwise it
      auto-dismisses after ~2s. delay: ms after the screen changes (default 500).
      top/inset: where it sits (default: just under the Dynamic Island). */
  banner?: { canStay?: boolean; delay?: number; top?: number; inset?: number };
};

export const demoBusiness = {
  name: "Red Dirt Foundation Repair",
  short: "Red Dirt Foundation",
  initials: "RD",
  category: "Foundation repair",
  query: "foundation repair near me",
  rating: 4.9,
  reviews: 37,
};

export const steps: Step[] = [
  {
    service: "Google Business Profile",
    title: "They search. You show up.",
    body: "Someone nearby searches for what you do, and your business is in the map results with your hours, photos and phone number. We set up that profile and keep it active every week.",
    short: "Nearby searches find you in the map results.",
    screen: "search",
    owner: { kind: "count", label: "Profile views this week", to: 128 },
  },
  {
    service: "Review requests",
    title: "Your reviews do the selling.",
    body: "After every job, your customer gets a text asking for a review. More 5-star reviews move you up the list and make you the safe choice.",
    short: "Every job ends with a text asking for a review.",
    screen: "listing",
    banner: { canStay: true },
    owner: { kind: "alert", label: "New 5-star review", detail: "Requested by text after the job", stars: true },
  },
  {
    service: "Website",
    title: "One tap to a site that sells.",
    body: "They tap through to a fast, clean website that answers their questions and keeps the call and book buttons right under their thumb.",
    short: "A fast site with call and book buttons up front.",
    screen: "website",
    banner: { canStay: true },
    owner: { kind: "count", label: "Website visits today", to: 46 },
  },
  {
    service: "Online booking",
    title: "They book it themselves.",
    body: "No phone tag. They pick a day and time that works, and it lands on your calendar without you lifting a finger.",
    short: "They pick a time. It lands on your calendar.",
    screen: "booking",
    owner: { kind: "alert", label: "New booking", detail: "Free inspection · Tue 10:30 AM" },
  },
  {
    service: "Confirmations and reminders",
    title: "Booked, confirmed, reminded.",
    body: "A confirmation text goes out the second they book, and a reminder the day before, so fewer people forget or don't show.",
    short: "Confirmation right away, reminder the day before.",
    screen: "messages",
    owner: { kind: "alert", label: "Booking confirmed", detail: "Reminder set for Mon 10:30 AM", success: true },
  },
  {
    service: "Missed-call text-back",
    title: "A missed call isn't a lost job.",
    body: "When you're on a job and can't pick up, the caller gets a text back within seconds, so they wait for you instead of calling the next company.",
    short: "Missed calls get a text back in seconds.",
    screen: "missed",
    banner: { canStay: true, delay: 3200, top: 142, inset: 19 },
    owner: { kind: "alert", label: "Missed call, texted back", detail: "Replied in 30 sec" },
  },
  {
    service: "Meta and Google ads",
    title: "Ads you can count.",
    body: "Ads put you in front of people nearby who need what you do. Every call and form is tracked, so you see exactly what each lead costs.",
    short: "Local ads, with every call and form tracked.",
    screen: "ad",
    owner: { kind: "count", label: "Leads from ads this month", to: 23, detail: "Cost per lead tracked" },
  },
  {
    service: "Social, handled",
    title: "Your page looks alive.",
    body: "Three posts a week on two platforms, planned and designed for you, so anyone checking you out sees a busy, real business.",
    short: "Three posts a week, planned and designed for you.",
    screen: "social",
    owner: { kind: "alert", label: "3 posts scheduled", detail: "Mon · Wed · Fri" },
  },
  {
    service: "Photo, video and drone",
    title: "Real footage of your real work.",
    body: "A monthly shoot of your crew and jobs, cut into 8 to 12 short clips, plus quarterly drone footage that shows the work from above.",
    short: "Monthly clips plus quarterly drone footage.",
    screen: "reel",
    banner: { canStay: true },
    owner: { kind: "alert", label: "New clips ready", detail: "From this month's shoot" },
  },
];
