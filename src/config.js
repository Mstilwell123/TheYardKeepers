/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  THE YARD KEEPERS — EDIT EVERYTHING HERE                             │
 * │  Phone, prices, towns, hours, and the quote math all live in this    │
 * │  file. The page reads them from here. Keep index.html SEO in sync    │
 * │  when you change the city, phone, coordinates, or published prices.  │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * NYTE — PLEASE CONFIRM before relying on this in ads:
 *   - Nearby towns (Philomath, Albany, Adair Village)
 *   - Weekly prices: 1 dog $100, 2 dogs $120
 *   - Yard + Two Walks launch price is published for 1 dog only ($100)
 *   - Twice-weekly price is published for 1 dog only ($125)
 *   - Phone number below
 *   - Hours below
 */

export const config = {
  businessName: "The Yard Keepers",
  ownerName: "Nyte De Leon",
  ownerPronouns: "he/him",
  domain: "www.theyardkeepers.pet",
  url: "https://www.theyardkeepers.pet",

  phoneDisplay: "(541) 999-6452",
  phoneE164: "+15419996452",

  primaryCity: "Corvallis",
  primaryState: "OR",
  primaryStateName: "Oregon",
  postalCode: "97330",

  // Downtown Corvallis, Oregon. Update geo tags in index.html if this pin moves.
  geo: { lat: 44.5646, lng: -123.262 },

  // Editable nearby list. These are suggestions for Benton County / the
  // mid-Willamette Valley — Nyte should confirm each one.
  nearbyAreas: ["Philomath", "Albany", "Adair Village"],

  // Meters from the pin above. About 15 miles, enough to cover the towns listed.
  serviceRadiusMeters: 25000,

  // Only true claims. Do not flip this on until it is actually true.
  licensedAndInsured: false,
  credentials: ["Licensed CNA"],
  school: "Oregon State University",

  hours: {
    label: "Every day, 8:00 am – 7:00 pm",
    opens: "08:00",
    closes: "19:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },

  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || "",

  /**
   * Sweep&Go booking — not connected.
   * Set enabled to true only after Nyte has a Sweep&Go account.
   * The empty mount point is #sweepandgo-booking in the quote section of App.jsx.
   * Leave enabled false. Do not paste a third-party script here.
   */
  booking: {
    provider: "sweepandgo",
    enabled: false,
  },
};

export const FIRST_CLEANUP = {
  withRecurringPlan: true,
  label: "Free first cleanup with a recurring plan",
  terms:
    "The first yard cleanup is included when you start a recurring plan. Pet sitting, and any visit that is not part of a recurring plan, is quoted separately.",
};

export const PLANS = {
  weekly: {
    id: "weekly",
    name: "Weekly Yard Keep",
    tag: "Most popular",
    visitsPerMonth: 4,
    prices: { 1: 100, 2: 120 },
    includes: [
      "Every week, 4 visits a month",
      "Haul-away included",
      "Text before arrival",
      "Photo when the gate is closed",
      "No contract",
    ],
  },
  weeklyWalks: {
    id: "weekly-walks",
    name: "Yard + Two Walks",
    tag: "Launch offer",
    visitsPerMonth: 4,
    walksPerMonth: 2,
    walkMinutes: 30,
    prices: { 1: 100 },
    includes: [
      "Weekly scoop, 4 visits a month",
      "Two 30-minute walks a month",
      "Haul-away included",
      "Launch price for 1 dog",
      "No contract",
    ],
  },
  twice: {
    id: "twice",
    name: "Twice-Weekly Yard Keep",
    tag: null,
    visitsPerMonth: 8,
    prices: { 1: 125 },
    includes: [
      "Two visits a week, 8 a month",
      "Haul-away included",
      "Text before arrival",
      "Photo when the gate is closed",
      "No contract",
    ],
  },
  sitting: {
    id: "sitting",
    name: "In-home pet sitting",
    tag: null,
    priced: false,
    summary: "Ask for a quote",
    includes: [
      "Overnight stays or drop-in visits",
      "In your home",
      "Feeding, potty breaks, and company",
      "A free meet-and-greet before the first stay",
      "No published package price",
    ],
  },
};

/**
 * Client-side price. Returns a published amount only when config has one.
 * Anything else is a custom quote — this function does not invent a number.
 */
export function estimateQuote({ dogs = 1, frequency = "weekly", addWalks = false } = {}) {
  const dogCount = Number(dogs);
  const knownDog = dogCount === 1 || dogCount === 2 ? dogCount : null;

  if (!knownDog) {
    return {
      priced: false,
      planId: null,
      name: "Yard with 3 or more dogs",
      note: "Three or more dogs are quoted after Nyte hears about the pack and the yard.",
    };
  }

  if (frequency === "weekly" && addWalks) {
    const amount = PLANS.weeklyWalks.prices[knownDog];
    if (amount == null) {
      return {
        priced: false,
        planId: PLANS.weeklyWalks.id,
        name: PLANS.weeklyWalks.name,
        note: "The launch price is published for 1 dog. Nyte will quote two dogs with walks.",
      };
    }
    return {
      priced: true,
      planId: PLANS.weeklyWalks.id,
      name: PLANS.weeklyWalks.name,
      amount,
      visits: PLANS.weeklyWalks.visitsPerMonth,
      perVisit: amount / PLANS.weeklyWalks.visitsPerMonth,
      detail: `Includes ${PLANS.weeklyWalks.walksPerMonth} walks of ${PLANS.weeklyWalks.walkMinutes} minutes`,
    };
  }

  if (frequency === "weekly") {
    const amount = PLANS.weekly.prices[knownDog];
    return {
      priced: true,
      planId: PLANS.weekly.id,
      name: PLANS.weekly.name,
      amount,
      visits: PLANS.weekly.visitsPerMonth,
      perVisit: amount / PLANS.weekly.visitsPerMonth,
      detail: `${knownDog === 1 ? "1 dog" : "2 dogs"} · haul-away included`,
    };
  }

  if (addWalks) {
    return {
      priced: false,
      planId: PLANS.twice.id,
      name: "Twice-weekly yard care with walks",
      note: "Walks are published with the weekly plan. Nyte will quote twice-weekly service plus walks.",
    };
  }

  const amount = PLANS.twice.prices[knownDog];
  if (amount == null) {
    return {
      priced: false,
      planId: PLANS.twice.id,
      name: PLANS.twice.name,
      note: "The published twice-weekly price is for 1 dog. Nyte will quote two dogs.",
    };
  }

  return {
    priced: true,
    planId: PLANS.twice.id,
    name: PLANS.twice.name,
    amount,
    visits: PLANS.twice.visitsPerMonth,
    perVisit: amount / PLANS.twice.visitsPerMonth,
    detail: "1 dog · haul-away included",
  };
}
