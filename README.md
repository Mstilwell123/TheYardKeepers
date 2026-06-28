# The Yard Keepers — Website

Single-page marketing site for The Yard Keepers: dog waste removal, in-home pet
sitting, and dog walking in Florence, OR (Corvallis from August).

Built with **Vite + React**. Fast, free to host, easy to update.

## Run it locally

```bash
npm install
npm run dev      # opens a local dev server
npm run build    # production build into /dist
```

## Where to edit things

- **`src/config.js`** — the one file to change for business details: name, owner
  name, phone, email, prices, service area, nearby towns. Change a price here and
  it updates everywhere on the page.
- **`index.html`** — page title, meta description, and the Florence-targeted
  local SEO (geo tags + structured data). Keep the phone/ZIP/coordinates here in
  sync with `src/config.js`.
- **`src/App.jsx`** — the page itself (copy, sections, layout).

## Still to do before launch

1. **Owner name** — set `ownerName` in `src/config.js` (currently `[Your Name]`).
2. **Owner photo** — drop a photo at `public/owner.jpg`, then in `src/App.jsx`
   replace the "Owner photo coming soon" placeholder with
   `<img src="/owner.jpg" alt="Your Yard Keeper in Florence, OR" />`.
3. **Lead notifications** — create a free form at https://formspree.io (or
   https://web3forms.com), copy the endpoint into a `.env` file as
   `VITE_FORM_ENDPOINT=...` (see `.env.example`). Until then, the form falls back
   to opening a pre-filled email to the address in `src/config.js`.
4. **Domain** — confirm `theyardkeepers.pet` is registered and point it at your host.

## Deploy (Vercel — recommended)

1. Push this folder to a GitHub repo you own.
2. Import the repo at https://vercel.com — it auto-detects Vite.
3. Add the `VITE_FORM_ENDPOINT` environment variable in Vercel's settings.
4. Add your custom domain.

## Corvallis switch (August)

Keep this as one site. In `src/config.js`, you can promote Corvallis to the
primary city when you move; update the matching geo tags in `index.html`. Keeping
one site preserves your reviews, backlinks, and Google ranking.
