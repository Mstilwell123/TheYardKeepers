# Deploy The Yard Keepers — step by step

You own the code already (it's committed to a local git repo). These steps put it
on GitHub (yours), host it on Vercel (yours), and turn on instant lead alerts.
None of this requires touching code.

---

## Part 1 — Lead notifications (Formspree) · ~3 min

So every quote request hits your email/phone instantly.

1. Go to https://formspree.io and sign up (free) with `stilwellmark@gmail.com`.
2. Click **+ New form**. Name it "Yard Keepers quotes". Set the email it should
   notify to your email (and you can add SMS later).
3. Formspree gives you an endpoint that looks like:
   `https://formspree.io/f/abcdwxyz`
4. Open `the-yard-keepers/.env` and paste it after the `=`:
   ```
   VITE_FORM_ENDPOINT=https://formspree.io/f/abcdwxyz
   ```
5. Save. Done — you'll also paste this same value into Vercel in Part 3.

Until you do this, the form still works: it opens a pre-filled email to the
address in `src/config.js`.

---

## Part 2 — Put the code on GitHub (yours) · ~5 min

You need a GitHub account (free, https://github.com). Then pick ONE path:

### Path A — GitHub CLI (fastest if Claude installs it)
After `gh` is installed and you've run `gh auth login` once:
```bash
cd the-yard-keepers
gh repo create the-yard-keepers --private --source=. --remote=origin --push
```
That creates the repo under your account and pushes everything.

### Path B — GitHub Desktop (no terminal)
1. Install GitHub Desktop: https://desktop.github.com
2. File → Add Local Repository → choose the `the-yard-keepers` folder.
3. Click **Publish repository** (uncheck "keep private" if you want it public).

Either way, your code now lives at `github.com/<you>/the-yard-keepers`.

---

## Part 3 — Host it on Vercel (yours) · ~4 min

1. Go to https://vercel.com and **Sign up with GitHub** (links the two accounts).
2. Click **Add New… → Project**, then **Import** the `the-yard-keepers` repo.
3. Vercel auto-detects Vite — leave the defaults:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
4. Expand **Environment Variables** and add:
   - Name: `VITE_FORM_ENDPOINT`
   - Value: your Formspree endpoint from Part 1
5. Click **Deploy**. In ~1 minute you get a live URL like
   `the-yard-keepers.vercel.app`. Test the quote form there.

From now on, every time the code changes on GitHub, Vercel re-deploys
automatically. The builder (me) is just a contractor — the warehouse (GitHub)
and the building (Vercel) are yours.

---

## Part 4 — Point your domain · last, once

Only after the Vercel URL looks right:

1. Confirm you've registered `theyardkeepers.pet` at a registrar (Namecheap,
   Porkbun, Cloudflare, etc.).
2. In Vercel: Project → **Settings → Domains** → add `theyardkeepers.pet`.
3. Vercel shows the exact DNS records to add at your registrar (an A record and/or
   CNAME). Add them. Propagation is usually minutes to a couple hours.

Aim DNS at Vercel — never at a builder you might leave — so you only do this once.

---

## After launch — keep it yours

- Edit `src/config.js` for any price/phone/text change, commit, push → auto-deploys.
- Add the owner name and photo (see README).
- This stays one site when you expand to Corvallis in August — preserves your SEO.
