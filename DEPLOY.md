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

## Part 4 — Connect your domain (GoDaddy) · last, once

Do this only after the Vercel URL looks right. Domain is registered at GoDaddy.

### 4a. Add the domain in Vercel
1. In your Vercel project: **Settings → Domains**.
2. Type `theyardkeepers.pet` and click **Add**. Add `www.theyardkeepers.pet` too —
   Vercel will set it to redirect to the main domain.
3. Vercel shows the DNS records it wants. They're almost always:
   - **A** record — Host/Name `@` → Value `76.76.21.21`
   - **CNAME** record — Host/Name `www` → Value `cname.vercel-dns.com`

   Use whatever values Vercel actually displays (they can differ) — copy them exactly.

### 4b. Add those records at GoDaddy
1. Sign in at https://godaddy.com → top-right profile → **My Products**.
2. Find `theyardkeepers.pet` → click the three dots / **DNS** → **Manage DNS**.
3. Under **Records**:
   - GoDaddy ships a default parked **A** record on Host `@`. Click the pencil to
     **edit** it: set Value to `76.76.21.21`, Save. (Don't add a second `@` A
     record — edit the existing one.)
   - **Add** a record: Type `CNAME`, Host `www`, Value `cname.vercel-dns.com`, Save.
   - If GoDaddy auto-added a `www` CNAME pointing somewhere else, edit that one
     instead of adding a duplicate.
4. Leave TTL at default (1 hour is fine).

### 4c. Wait + verify
- Back in Vercel → Domains, the domain shows **"Valid Configuration"** once it sees
  the records — usually minutes, sometimes up to a couple hours.
- Vercel issues the HTTPS certificate automatically. Then `https://theyardkeepers.pet`
  is live.

Point DNS at Vercel — never at a builder you might leave — so you only do this once.

---

## After launch — keep it yours

- Edit `src/config.js` for any price/phone/text change, commit, push → auto-deploys.
- Add the owner name and photo (see README).
- This stays one site when you expand to Corvallis in August — preserves your SEO.
