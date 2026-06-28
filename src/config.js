/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  THE YARD KEEPERS — EDIT EVERYTHING HERE                             │
 * │  This is the one file you touch to update the site. Change a phone   │
 * │  number, a price, the owner's name, or the service area, and it      │
 * │  updates everywhere on the page. No need to hunt through code.       │
 * └─────────────────────────────────────────────────────────────────────┘
 */

export const config = {
  // ── Business identity ────────────────────────────────────────────────
  businessName: "The Yard Keepers",
  ownerName: "[Your Name]", // ← put your real first name (and last initial) here
  domain: "theyardkeepers.pet",
  url: "https://theyardkeepers.pet",

  // ── Contact ──────────────────────────────────────────────────────────
  // Phone is used for click-to-call. Use real digits.
  phoneDisplay: "(541) 999-6452", // ← shown to visitors
  phoneE164: "+15419996452", // ← used for tel: and sms: links (no spaces)
  email: "hello@theyardkeepers.pet", // ← where quote requests should land

  // ── Service area (drives the headline + SEO) ─────────────────────────
  primaryCity: "Florence",
  primaryState: "OR",
  postalCode: "97439",
  comingSoonCity: "Corvallis",
  comingSoonWhen: "August",

  // Coordinates for local SEO (downtown Florence, OR). If you change these,
  // also update geo.position / geo / ICBM in index.html to match.
  geo: { lat: 43.9826, lng: -124.0998 },

  // Nearby communities you'll also serve — naming them in visible page text
  // and in structured data is what wins "near me" searches.
  nearbyAreas: ["Dunes City", "Mapleton", "Glenada", "Cushman", "Heceta Beach", "Westlake"],

  // ── Trust toggles ────────────────────────────────────────────────────
  // Only flip this to true once it is ACTUALLY true. Don't claim it early.
  licensedAndInsured: false,

  // ── Form handling ────────────────────────────────────────────────────
  // Paste a Formspree (https://formspree.io) or Web3Forms endpoint here to
  // get instant email notifications of every lead — no server needed.
  // Leave blank and the form falls back to opening a pre-filled email, so
  // it still works on day one.
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || "",
};

// ── Pricing (all numbers in one place) ──────────────────────────────────
export const YARD = {
  frequencies: [
    { id: "weekly", label: "Weekly", sub: "4 visits / month", popular: true },
    { id: "twice", label: "Twice weekly", sub: "8 visits / month", popular: false },
    { id: "biweekly", label: "Every other week", sub: "2 visits / month", popular: false },
  ],
  prices: {
    weekly: { 1: 80, 2: 95, 3: 110 },
    twice: { 1: 130, 2: 150, 3: 175 },
    biweekly: { 1: 55, 2: 65, 3: 78 },
  },
  initialCleanup: 65,
};

export const WALKS = [
  { len: "15 min", desc: "Quick potty break & stretch", price: 18, popular: false },
  { len: "30 min", desc: "Standard walk — the favorite", price: 25, popular: true },
  { len: "45 min", desc: "Extra time to burn energy", price: 30, popular: false },
  { len: "60 min", desc: "The long one", price: 35, popular: false },
];

export const SITTING = {
  overnightFrom: 55,
  overnightWeekend: 110,
  dropInFrom: 20,
  dropInStandard: 25,
};
