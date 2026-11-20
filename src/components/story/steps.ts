// The "Watch a customer find you" story. Each step is one beat of a customer's
// journey, the service that makes it happen, and what the owner sees on their side.
// The business in the demo is fictional.

export type Screen = "search" | "listing";

export type OwnerEvent =
  | { kind: "count"; label: string; to: number }
  | { kind: "alert"; label: string; detail: string; stars?: boolean };

export type Step = {
  service: string;
  title: string;
  body: string;
  screen: Screen;
  owner: OwnerEvent;
};

export const demoBusiness = {
  name: "Red Dirt Foundation Repair",
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
    screen: "search",
    owner: { kind: "count", label: "Profile views this week", to: 128 },
  },
  {
    service: "Review requests",
    title: "Your reviews do the selling.",
    body: "After every job, your customer gets a text asking for a review. More 5-star reviews move you up the list and make you the safe choice.",
    screen: "listing",
    owner: { kind: "alert", label: "New 5-star review", detail: "Requested by text after the job", stars: true },
  },
];
