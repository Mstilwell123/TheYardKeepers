/**
 * Analytics — one place for both Vercel Web Analytics and Google Analytics 4.
 *
 * Vercel Web Analytics: cookieless, auto-enabled by the <Analytics /> component
 * in main.jsx. No setup beyond turning it on in the Vercel dashboard.
 *
 * Google Analytics 4: set VITE_GA_ID to your Measurement ID (looks like
 * "G-XXXXXXXXXX") in Vercel's env vars (and .env for local testing). If it's
 * blank, GA4 simply stays off — the site still works.
 */

import { track } from "@vercel/analytics";

const GA_ID = import.meta.env.VITE_GA_ID || "";

// Load the GA4 script once, only if a Measurement ID is configured.
export function initAnalytics() {
  if (!GA_ID || typeof window === "undefined") return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}

// Fire a conversion/event to BOTH Vercel and GA4 (whichever are active).
export function trackEvent(name, params = {}) {
  try { track(name, params); } catch { /* analytics never breaks the site */ }
  if (GA_ID && typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}
