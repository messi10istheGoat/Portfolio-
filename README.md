# Riha Begum — Portfolio

A dark-first editorial portfolio for a full-stack developer: hand-built interface
mockups, case studies, a live GitHub contribution graph, an interactive terminal,
and a command palette. Ships with a **light/dark toggle** and four switchable
accent colours, both pinned to a fixed rail on the right edge of the viewport
(on mobile they move into the menu).

The case studies describe real, shipped work — **Spendwise** (offline-first
personal finance), **Sylhet Live** (crowdsourced monsoon hazard map with
vehicle-aware routing), **Fresh Mart**, **Budget Tracker**, **ChronoClock** and
**User Management**. Every stack listed is read from the project's own
`package.json`; no performance numbers are claimed that cannot be verified from
the repository.

## Theming

Dark is the default. `ThemeProvider` and `AccentProvider` share one shape: a
value kept outside React, applied as a `data-` attribute on `<html>`, seeded
before first paint by an inline script so there is no flash of the wrong theme.

Every surface colour resolves through a token in `globals.css`, so a mode change
is a variable swap rather than a second stylesheet. The key lever is
`--color-white: rgb(var(--edge))` inside `@theme inline`: `--edge` is
`255,255,255` in dark mode and `20,18,14` in light, which makes ~400 existing
`white/<alpha>` utilities follow the theme without touching a component. Hero
and project artwork invert with it (see `--chrome-fill`).

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Framer Motion · Drizzle ORM · PostgreSQL**.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — the site runs fine without it
npm run dev                  # http://localhost:3000
```

Regenerating the social card and icons (needs ImageMagick + the fonts in
`src/app/fonts` installed with fontconfig — see the script header):

```bash
bash scripts/make-brand-assets.sh
```

No configuration is required to run the site. The contact form and live GitHub
data degrade gracefully and say so in the UI; nothing pretends to be connected
when it isn't.

---

## Scripts

| Script                | What it does                                                       |
| --------------------- | ------------------------------------------------------------------ |
| `npm run dev`         | Dev server with hot reload                                         |
| `npm run build`       | Production build (server mode: SSR, API routes, headers)           |
| `npm run build:static`| Static export to `out/` for GitHub Pages / any CDN                 |
| `npm run start`       | Serve the production build                                         |
| `npm run typecheck`   | `tsc --noEmit`                                                     |
| `npm run lint`        | ESLint (Next core-web-vitals + React hooks rules)                  |
| `npm run check`       | Typecheck → lint → build, in one go                                |
| `npm run db:push`     | Push the Drizzle schema to PostgreSQL                              |
| `npm run db:studio`   | Browse the database in Drizzle Studio                              |

---

## Structure

```
src/
├─ app/
│  ├─ page.tsx                 Home — hero, manifesto, about, stack, work, GitHub, experience, process, contact
│  ├─ work/[slug]/page.tsx     Case studies (SSG, one per project)
│  ├─ api/
│  │  ├─ contact/route.ts      Contact intake: Postgres → webhook → graceful 503
│  │  ├─ resume/route.ts       Serves the hand-authored CV PDF
│  │  └─ health/route.ts       Liveness + database probe
│  ├─ feed.xml/route.ts        Case studies as RSS
│  ├─ llms.txt/route.ts        Machine-readable site summary
│  ├─ sitemap.ts, robots.ts    SEO plumbing (single source of URL truth)
│  ├─ manifest.ts              Installable web-app manifest
│  ├─ fonts.css                Self-hosted variable fonts (no Google Fonts)
│  └─ globals.css              Design tokens, surfaces, typography, motion
├─ components/
│  ├─ hero/                    Hero + animated signature object
│  ├─ sections/                One file per home-page section
│  ├─ projects/                Hand-built CSS/SVG product mockups
│  ├─ site/                    Navigation, footer, palette, cursor, theme rail
│  ├─ providers/               Theme + accent stores (pre-paint bootstrap)
│  └─ ui/                      Motion primitives, magnetic wrapper, icons
├─ data/                       All copy and content lives here
├─ lib/                        GitHub, site URL, utils
└─ db/                         Drizzle schema + lazy connection pool
```

**The CV is the one exception.** `public/resume.pdf` is the authored document
itself, served byte-for-byte by both `/api/resume` and the static export. To
update it, replace that file. Nothing regenerates it, so a deploy can never
overwrite it.

**Everything else editable lives in `src/data/`.** Change your name, projects,
skills, or experience there and every surface — pages, metadata, structured
data, RSS and structured data — updates together.

---

## Deployment

### Option A — GitHub Pages (static, no server)

The repo ships `.github/workflows/deploy.yml`, which builds a static export and
publishes it on every push to `main`.

1. Repository **Settings → Pages → Source** must be **GitHub Actions**.
   (An admin has to click this once; the workflow cannot enable Pages itself.)
2. Push to `main`. The workflow builds, verifies, and publishes.
3. Live at `https://messi10isthegoat.github.io/Portfolio-/`.

Because the site is static in this mode:

- the contact form composes a prefilled email (`mailto:`) instead of POSTing;
- the CV is served from `public/resume.pdf`, which is a hand-authored document
  committed to the repo (not generated — builds never overwrite it);
- the GitHub contribution graph renders from the API at build time (nightly
  rebuild keeps it fresh) or falls back to clearly-labelled sample data.

### Option B — Vercel / any Node host (full features)

Import the repo, set the environment variables you want, deploy. This mode adds
server rendering, the `POST /api/contact` endpoint, health checks and security
headers.

```bash
npm run build && npm run start
```

### Environment variables

All optional — see `.env.example`.

| Variable                   | Purpose                                                        |
| -------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Canonical origin (e.g. `https://arifrahman.dev`)                |
| `DATABASE_URL`             | PostgreSQL connection string for the contact inbox              |
| `CONTACT_WEBHOOK_URL`      | Forward messages to Slack/Discord/Formspree instead of Postgres |
| `CONTACT_ADMIN_TOKEN`      | Bearer token that unlocks the inbox count via `HEAD /api/contact`|
| `GITHUB_TOKEN`             | GraphQL token for the live contribution graph                   |
| `GITHUB_USERNAME`          | Account to read activity from                                   |

---

## Contact form behaviour

The form is honest about its environment rather than silently failing:

1. **Database configured** → message is validated, rate-limited and stored.
2. **`CONTACT_WEBHOOK_URL` set** → message is forwarded to your webhook.
3. **Neither set** → the API answers `503 NO_INBOX` and the UI opens a
   prefilled email instead of claiming success.

Spam protection: honeypot field, sub-second submission rejection, per-IP rate
limiting (5/minute), payload size caps, and control-character stripping.

---

## Accessibility & performance notes

- Every interactive element is keyboard reachable; the palette traps focus and
  restores it on close, the mobile menu closes on Escape.
- All motion respects `prefers-reduced-motion`; the custom cursor disables itself
  on touch devices entirely.
- Fonts are self-hosted (`@fontsource-variable`) — zero third-party requests, no
  build-time network dependency.
- Project visuals are CSS/SVG only: no raster screenshots to download.
