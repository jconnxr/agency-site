// Trade presets for the "Try it with your business" sandbox on the card page.
// Each one fills the sample phone with believable, trade-appropriate content:
// services, a booking type and a color that suits the trade. No reviews, quotes
// or numbers about real customers: everything in the sandbox is a labeled sample.

export type Trade = {
  id: string;
  label: string;
  /** Shown under the name on the sample Google listing. */
  category: string;
  /** What the customer types into the search bar. */
  query: string;
  /** Sample website headline. */
  headline: string;
  services: [string, string, string];
  /** Booking button and page title, e.g. "Book a free inspection". */
  booking: string;
  /** Mono line under the booking title. */
  bookingDetail: string;
  /** Accent color for the sample site. Dark enough for white text (4.5:1+). */
  accent: string;
  /** Optional photo for the sample site's header, from public/images. */
  photo?: string;
};

export const trades: Trade[] = [
  {
    id: "hvac",
    label: "HVAC",
    category: "Heating & air conditioning",
    query: "ac repair near me",
    headline: "Heating and air, fixed fast.",
    services: ["AC repair", "Furnace tune-ups", "New system installs"],
    booking: "Book a service call",
    bookingDetail: "1 hr · at your home",
    accent: "#1d5fa0",
    photo: "/images/contractor-truck.webp",
  },
  {
    id: "roofing",
    label: "Roofing",
    category: "Roofing contractor",
    query: "roofer near me",
    headline: "Roofs built for Oklahoma weather.",
    services: ["Roof inspections", "Storm damage repair", "Full replacements"],
    booking: "Book a free inspection",
    bookingDetail: "45 min · at your home",
    accent: "#9a3b22",
    photo: "/images/aerial-roof.webp",
  },
  {
    id: "plumbing",
    label: "Plumbing",
    category: "Plumber",
    query: "plumber near me",
    headline: "Leaks and clogs, handled today.",
    services: ["Drain cleaning", "Water heaters", "Leak repair"],
    booking: "Book a plumber",
    bookingDetail: "1 hr · at your home",
    accent: "#0e6a86",
    photo: "/images/contractor-truck.webp",
  },
  {
    id: "salon",
    label: "Salon / barber",
    category: "Barber shop & salon",
    query: "barber near me",
    headline: "Fresh cuts, easy booking.",
    services: ["Haircut", "Beard trim", "Color"],
    booking: "Book an appointment",
    bookingDetail: "45 min · in the shop",
    accent: "#7a3f7d",
    photo: "/images/barbershop-meeting.webp",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    category: "Restaurant",
    query: "restaurants near me",
    headline: "Good food, right around the corner.",
    services: ["Dine in", "Takeout", "Catering"],
    booking: "Reserve a table",
    bookingDetail: "Party of 2 · dine in",
    accent: "#a33a1c",
    photo: "/images/chef-filming.webp",
  },
  {
    id: "auto",
    label: "Auto repair",
    category: "Auto repair shop",
    query: "auto repair near me",
    headline: "Honest repairs, done on time.",
    services: ["Oil changes", "Brakes", "Diagnostics"],
    booking: "Book a service",
    bookingDetail: "1 hr · drop off at the shop",
    accent: "#3f4f63",
    photo: "/images/auto-shop-counter.webp",
  },
  {
    id: "landscaping",
    label: "Landscaping",
    category: "Landscaper",
    query: "landscaping near me",
    headline: "Yards that look cared for.",
    services: ["Lawn care", "Landscape design", "Seasonal cleanup"],
    booking: "Book a free estimate",
    bookingDetail: "30 min · at your property",
    accent: "#2f6b34",
  },
  {
    id: "cleaning",
    label: "Cleaning",
    category: "House cleaning service",
    query: "house cleaning near me",
    headline: "Come home to a clean house.",
    services: ["Standard cleaning", "Deep cleaning", "Move-out cleaning"],
    booking: "Book a cleaning",
    bookingDetail: "2–3 hrs · at your home",
    accent: "#1a7470",
  },
  {
    id: "other",
    label: "Other",
    category: "Local business",
    query: "near me",
    headline: "Easy to find, easy to book.",
    services: ["Consultations", "Services", "Same-week appointments"],
    booking: "Book an appointment",
    bookingDetail: "30 min",
    accent: "#4046d8",
  },
];

export const tradeById = (id: string) => trades.find((t) => t.id === id) ?? trades[0];
