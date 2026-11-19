# The Yard Keepers — Website

Single-page marketing site for The Yard Keepers: dog waste removal, dog walking,
and in-home pet sitting in Corvallis, Oregon.

Built with **Vite + React**. Business details live in one file.

## Run it locally

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into /dist
```

## Where to edit things

- **`src/config.js`** — the only file for business details: owner, phone, prices,
  nearby towns, hours, the first-cleanup terms, and the Sweep&Go flag.
  Change a price here and the page, the quote calculator, and the form payload follow.
- **`index.html`** — title, meta description, geo tags, and LocalBusiness structured
  data for Corvallis. If you change the city, phone, ZIP, coordinates, or a published
  price in `src/config.js`, update the matching tags here.
- **`src/App.jsx`** — layout and copy.

## Quote requests

Leads go to Formspree through `VITE_FORM_ENDPOINT` (see `.env.example`). No email
address is shown on the site. If the endpoint is empty, the form asks the visitor
to call or text the phone in `src/config.js`.

The homepage calculator (dogs, frequency, walks) prices only the combinations
published in `src/config.js`. Anything else is sent as “ask for a quote.”

Sweep&Go is not connected. `config.booking.enabled` is `false`. The mount point
is `#sweepandgo-booking` in the quote section. Turn the flag on only after an
account exists. Do not paste a booking script before that.

## Deploy

See `DEPLOY.md`. Hosting is Vercel. Do not change DNS from this repo.
