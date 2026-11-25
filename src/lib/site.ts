// All the business details live here, so swapping the placeholder name
// or changing prices is a one-file edit. Packages mirror the Offer Sheet (v3).

export const site = {
  name: "Axiom Media Group",
  shortName: "Agency",
  city: "Oklahoma City",
  serviceArea: ["Oklahoma City", "Midwest City", "Edmond", "Moore", "Norman", "Yukon", "Mustang", "Del City"],
  // Leave empty until the real business email exists; every email link on
  // the page hides itself while this is empty.
  email: "",
  // Business phone in +1XXXXXXXXXX form. Leave empty until there's a number:
  // every Call / Text link hides itself while this is empty.
  phone: "+14059850806",
  calendlyUrl: "https://calendly.com/jnjsystems/free-website-google-profile-call",
  // Both forms (intake modal and the contact form) post to /api/intake, which
  // emails each lead (Resend) and forwards it to the CRM webhook. See README.
};

// Runs along the services ribbon under the hero.
export const services = [
  "Websites",
  "Google Business Profiles",
  "AI search visibility",
  "Online booking",
  "Review requests",
  "Local listings",
  "Facebook & Instagram",
  "Meta & Google ads",
  "Photo & video",
  "Drone footage",
  "Missed-call text-back",
  "AI receptionist",
];

// Promises we can stand behind on day one, pulled from how we actually work.
export const promises = [
  { title: "You own everything", body: "Domain, site, Google profile and ad accounts are in your name. Leave anytime and they go with you." },
  { title: "Fixed price, fixed date", body: "Launch and Quick Wins have set prices and live dates. If we miss the date, your next 3 months of Site Care or upkeep are free." },
  { title: "Short commitments", body: "Monthly plans have a 3-month minimum, then run month to month. No 12-month contracts." },
  { title: "Plain-number reports", body: "Calls, bookings, reviews and leads each month, in a report you can read in two minutes." },
];

// Founding client offer: the first 10 clients.
export const founding = {
  spots: 10,
  body: "The first 10 clients lock their rate for 12 months and get the Get Leads setup fee waived, no 6-month agreement needed. In exchange, you give us a testimonial and a short case study.",
};

export type Option = {
  name: string;
  price: string;
  priceNote: string;
  liveBy?: string;
  includes: string[];
};

// One-time projects
export const launch = {
  name: "Launch",
  problem: "Customers can't find us anywhere online.",
  bestFor: "Opening soon, or under 6 months old",
  options: [
    {
      name: "Launch Essentials",
      price: "$750",
      priceNote: "one-time",
      liveBy: "Live in 14 days",
      includes: [
        "One-page site with click-to-call and a contact form",
        "Google Business Profile set up and verified",
        "Your domain plus professional email (you@yourbusiness.com)",
        "Built with your existing logo",
        "Site built AI-ready, Bing listing claimed",
      ],
    },
    {
      name: "Launch Pro",
      price: "$1,800",
      priceNote: "one-time, or 3 payments of $600",
      liveBy: "Live in 30 days",
      includes: [
        "Up to 5 pages, built around your services",
        "Google Business Profile set up, verified and optimized with photos and services",
        "Your domain plus professional email",
        "Online booking and a simple customer list (CRM)",
        "Facebook and Instagram set up to match your brand",
        "Logo cleanup and a simple brand kit",
        "Review link plus a printed QR card for the counter or truck",
        "AI Visibility Setup included ($450 value)",
      ],
    },
  ] satisfies Option[],
  note: "Both include 3 months of Site Care free: hosting, updates and small edits. After that it's $99/mo, or included in Get Found: Google + AI.",
  bundle: "Sign 6 months of Get Found: Google + AI and Launch Pro drops to $1,500.",
};

export const automate = {
  name: "Automate",
  problem: "We're losing time and leads to busywork.",
  bestFor: "Any business with steady volume",
  options: [
    {
      name: "Quick Wins",
      price: "$1,000",
      priceNote: "one-time",
      liveBy: "Live in 14 days",
      includes: [
        "Missed-call text-back",
        "Automatic review requests",
        "Appointment reminders",
        "Instant lead follow-up by text and email",
        "30-minute walkthrough",
      ],
    },
    {
      name: "Full Systems",
      price: "From $3,000",
      priceNote: "one-time, quoted by scope",
      liveBy: "Live in 30–45 days",
      includes: [
        "Everything in Quick Wins",
        "CRM build, or a move off spreadsheets",
        "Sales pipeline and quote and invoice follow-ups",
        "AI chat or AI receptionist on your website",
        "Staff training plus written how-tos",
      ],
    },
  ] satisfies Option[],
  note: "Optional upkeep from $149/mo. Quick Wins is included in Full Department.",
};

// Monthly plans. Each includes everything in the plan before it.
export type Plan = {
  name: string;
  problem: string;
  bestFor: string;
  price: string;
  priceNote: string;
  base?: string;
  includes: string[];
  terms: string;
};

export const plans: Plan[] = [
  {
    name: "Get Found: Google + AI",
    problem: "We're online, but nobody sees us on Google or ChatGPT.",
    bestFor: "6 months to 3 years in business",
    price: "$497",
    priceNote: "/mo",
    includes: [
      "Google Business Profile managed: weekly posts, new photos, replies to every review",
      "Automatic review requests by text after each job",
      "Consistent listings on Apple Maps, Bing, Yelp, BBB and more",
      "Site Care: hosting, security and up to 1 hour of edits a month",
      "Monthly report in plain numbers",
      "Your details kept current on Bing and Apple, where ChatGPT and other AI tools look",
      "One new FAQ or pricing update on your site each month",
      "Monthly AI check: we ask ChatGPT, Gemini, Perplexity and Claude the questions your customers ask and show you how often you come up",
    ],
    terms: "3-month minimum, then month to month",
  },
  {
    name: "Get Leads",
    problem: "We need more calls and jobs every month.",
    bestFor: "Steady businesses ready to run ads",
    price: "$2,000",
    priceNote: "/mo + ad spend",
    base: "Get Found: Google + AI",
    includes: [
      "Ads on Meta or Google: setup, creative and weekly optimization",
      "A landing page for each offer",
      "3 social posts a week on 2 platforms",
      "Tracked phone number, form tracking and a CRM pipeline, so you see cost per lead",
      "Monthly strategy call",
    ],
    terms: "$500 setup, waived on a 6-month agreement. We recommend at least $500/mo in ad spend, paid to the platform directly.",
  },
  {
    name: "Full Department",
    problem: "We want marketing handled, content included.",
    bestFor: "Established, 5+ staff or multiple crews",
    price: "From $5,000",
    priceNote: "/mo + ad spend",
    base: "Get Leads",
    includes: [
      "Both Meta and Google ads",
      "Monthly half-day photo and video shoot, edited into 8–12 short clips",
      "Quarterly drone shoot of your jobs, property or location",
      "Automate Quick Wins built and maintained",
      "Email and text campaigns to your customer list",
      "Quarterly planning session and priority support",
    ],
    terms: "Quoted per business, based on shoot volume and locations.",
  },
];

export const addons: { name: string; price: string; detail?: string }[] = [
  { name: "Google Business Profile setup only", price: "$300" },
  { name: "Online booking or CRM setup on an existing site", price: "$350" },
  { name: "Logo and simple brand kit", price: "$400" },
  { name: "Extra website page", price: "$150 per page" },
  { name: "Ads management only (one platform)", price: "$950/mo + ad spend" },
  { name: "Social posting only (3 a week, 2 platforms)", price: "$750/mo" },
  {
    name: "AI Visibility Setup",
    price: "$450 one-time",
    detail: "Listings cleanup, Bing and Apple, FAQ content for your site, before-and-after AI report",
  },
  { name: "Monthly AI check and report (with Site Care)", price: "$149/mo" },
  { name: "Photo and video shoot (half day, edited)", price: "From $750" },
  { name: "Drone shoot (edited photos and a clip)", price: "From $500" },
  { name: "Headshots and team photos", price: "From $300" },
];

// The contact form's "What are you interested in?" options live in src/lib/intake.ts.

export const faqs = [
  {
    q: "I just opened. Is this too much for me?",
    a: "No. Most new businesses start with Launch: a site, a Google profile and email, for a fixed price and a fixed date. Launch Pro can be split into 3 payments of $600. You can stop there, or add a monthly plan once the phone is ringing.",
  },
  {
    q: "What happens after Launch?",
    a: "Your first 3 months of Site Care (hosting, updates, small edits) are free. After that it's $99 a month, or you move to Get Found: Google + AI, which includes Site Care.",
  },
  {
    q: "What's the free Online Presence Check?",
    a: "A one-page look at your Google listing, your website on a phone, your reviews against 3 competitors, and your social profiles. It also shows what ChatGPT and other AI tools say about your business when someone asks. We send it within 24 hours, free, and it shows exactly where you're losing customers.",
  },
  {
    q: "Can you just fix my Google profile or add booking to my site?",
    a: "Yes. You don't need a package. Google Business Profile setup or cleanup is $300, and adding online booking to the site you already have is $350. One-time, no monthly fee required.",
  },
  {
    q: "Do I own my website?",
    a: "Yes. The domain, the site, your Google Business Profile and your ad accounts are in your name. If you ever leave, they go with you.",
  },
  {
    q: "Who pays for ads?",
    a: "You pay Meta or Google directly for ad spend, so you always see exactly where that money goes. We recommend starting at $500 a month. Our monthly fee covers setting up, running and improving the campaigns.",
  },
  {
    q: "How long until I'm live?",
    a: "Launch Essentials is live 14 days after we get your info, and Launch Pro in 30. If we miss the date, you get 3 more months of Site Care free.",
  },
  {
    q: "Do you only work in Oklahoma City?",
    a: "We're based here and come to you for shoots and setup across the metro: Oklahoma City, Midwest City, Edmond, Moore, Norman, Yukon, Mustang and Del City.",
  },
  {
    q: "Can you get me to the top of ChatGPT?",
    a: "No one can promise that, and you should be wary of anyone who does. AI answers change every time someone asks, even for the same question. What we can do is fix what AI tools read about you: your Google, Bing and Apple listings, and clear services, prices and FAQs on your site. Then each month we ask ChatGPT, Gemini, Perplexity and Claude the questions your customers ask and show you a score: how often you came up.",
  },
];

// The 14-day Launch Essentials build, day by day (sticky section on the homepage).
// DRAFT: check these against how builds actually run before going live.
export const launchDays = [
  {
    day: 1,
    title: "Kickoff",
    body: "We collect your logo, photos, services and hours, and get your domain and Google Business Profile in your name.",
  },
  {
    day: 3,
    title: "Google profile set up",
    body: "Your Google Business Profile gets your services, hours and photos, and goes to Google for verification.",
  },
  {
    day: 7,
    title: "Your first look",
    body: "You get a working draft of the site to try on your phone. Tell us what to change. Nothing goes public until you approve it.",
  },
  {
    day: 14,
    title: "You're live",
    body: "Site, Google profile and professional email are live. Site Care is free for the first 3 months.",
  },
];
