# Venuora: multilingual hotel & event-venue website platform (MVP)

A premium, frontend-only MVP with three parts:

| Route | What it is |
|---|---|
| `/` | **Platform marketing website** that sells venue websites to hotels / wedding halls |
| `/demo` | **The Grand Emerald**, a *fictional* demo venue site (gallery, rooms, spaces, packages, availability calendar, inquiry form, WhatsApp) |
| `/dashboard` | **Owner dashboard demo** (inquiries, packages, availability, settings). *No login, local data only* |

Languages: English, Arabic, Dari (`fa-AF`), Pashto (`ps-AF`), with full RTL support.

## Stack
React 19, Vite, TypeScript, Tailwind CSS 3, React Router, i18next / react-i18next, lucide-react. Fonts are bundled via `@fontsource` (Playfair Display, Inter, Noto Sans Arabic), so nothing is fetched from Google at runtime.

## Run it
```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build into dist/
npm run preview      # serve the production build
npm run check:i18n   # compare all locale files with en.json (missing keys)
```

## Folder map
```
src/
  config/     site.ts (platform brand, contact, pricing, feature list)
              venue.ts (demo venue + gallery)   locales.ts (language metadata)   options.ts
  data/       rooms.ts spaces.ts packages.ts inquiries.ts   <- sample business data
  i18n/       index.ts + locales/{en,ar,fa-AF,ps-AF}.json   <- ALL interface text
  services/   demoStore.ts  <- the only file that touches localStorage
  components/ common/ layout/ marketing/ venue/ dashboard/ forms/
  pages/      marketing/ venue/ dashboard/
  utils/      dates.ts text.ts validation.ts
  hooks/      useLocale.ts usePageMeta.ts
scripts/      generate-images.mjs  check-i18n.mjs
public/images placeholder illustrations (SVG)
```
Every file starts with a comment explaining its purpose; tricky logic (RTL keyboard handling, date handling, storage) has inline explanations. Search for `TODO` to find the backend hand-off points.

## Common changes

**Platform branding**: edit `src/config/site.ts` (`platformName`, `logoLetter`, contact). Colours and fonts: `tailwind.config.js`. Favicon: `public/favicon.svg`.

**Customise the demo venue for a real customer**: edit `src/config/venue.ts` (name, tagline, description, address, contact, gallery, `sections` switches) and `src/data/rooms.ts`, `spaces.ts`, `packages.ts`. Set `sections.rooms: false` for a wedding hall and the rooms section, nav link and room-inquiry option disappear. Venue text is `{ en, ar, 'fa-AF', 'ps-AF' }`; any missing language falls back to English.

**Photos**: the shipped images are illustrated placeholders (no stock-photo access when this was built). Drop real `.jpg/.webp` files into `public/images/` and change the paths in `venue.ts` / `data/*.ts`.

**Packages & pricing**: platform plans are in `pricingPlans` (`site.ts`); `price: null` shows "Contact for pricing". Venue packages: `src/data/packages.ts` (or the dashboard).

**Contact & WhatsApp**: `site.ts` (platform) and `venue.contact` in `venue.ts`. The WhatsApp number is digits with country code, no `+` (e.g. `93700000001`). The message is translated and URL-encoded by `buildWhatsAppUrl()` in `src/utils/text.ts`. The shipped numbers are **placeholders**.

**Translations**: edit `src/i18n/locales/*.json` (same structure in each file). Use keys in components with `t('group.key')`. After editing run `npm run check:i18n`. Missing keys fall back to English. **The Arabic, Dari and Pashto text was written by an AI and must be reviewed by native speakers before real customers see it**, particularly Pashto and the Dari business wording.
To add a language: add it to `src/config/locales.ts`, create its JSON file, register it in `src/i18n/index.ts`.

**RTL behaviour**: `applyDocumentLanguage()` in `src/i18n/index.ts` sets `<html lang dir>`. Styling uses CSS logical properties (`ms-`, `ps-`, `start-`, `end-`, `border-s`...) so layouts mirror automatically; directional icons are swapped via `useLocale().isRtl`; phone numbers/e-mails use `.ltr-text` / `dir="ltr"`. Calendar and lightbox arrow keys are direction-aware. Dari and Pashto use Persian digits in dates (see the `intl` tag in `locales.ts`; change `nu-arabext` to `nu-latn` for Western digits).

**Deploy**: `npm run build`, upload `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, cPanel). It is a single-page app, so configure a fallback to `index.html` for unknown paths (Netlify: `/* /index.html 200`).

## What is demonstration-only (be honest with customers)
- Inquiries, packages, availability and venue edits are saved in **the browser's localStorage**: one device, no sharing, no security, can be edited or wiped by the user. **Do not collect real customer data with this build.**
- The inquiry form does **not** send anything to the venue. An inquiry is never a reservation; there is no "confirmed" status.
- The availability calendar is sample data, not real-time availability, and does no overlap checking across bookings.
- The dashboard has no authentication (deliberately no fake login); no tenants, e-mail notifications, uploads, payments or subscriptions.
- Photos are placeholders; prices, venue, names and numbers are fictional samples.
- SEO: titles/meta are set per page in the browser, but crawlers get one shared HTML shell. Pre-render or server-render before relying on search traffic.

## Connecting a Laravel + MySQL backend later
The types in `src/types/index.ts` map to tables: `venues`, `rooms`, `event_spaces`, `packages`, `inquiries`, `unavailable_dates` (plus a `translations` table or JSON columns for `LocalizedText`). Every row carries `venueId`, which is your tenant key.
1. Replace the bodies of the hooks in `src/services/demoStore.ts` with API calls; components keep using the same hooks.
2. `InquiryForm` → `POST /api/venues/{id}/inquiries`. Re-validate everything server-side (the rules in `utils/validation.ts` are UX only) and notify the venue by e-mail/WhatsApp.
3. Add authentication (Laravel Sanctum) in front of `/dashboard`; scope **every** query by the signed-in business on the server (tenant isolation); use policies for authorisation.
4. Availability/reservations: authoritative server-side data and overlap-safe booking (DB transactions / unique constraints).
5. Secure image uploads (type/size validation, storage outside the web root), then payments and subscriptions.

## Suggested roadmap
1. Review translations with native speakers; replace placeholder photos; set real contact numbers.
2. Laravel API + MySQL: inquiries first (the feature venues value most), plus e-mail/WhatsApp notification.
3. Owner authentication and a per-venue dashboard.
4. Per-venue sites by slug or custom domain (multi-tenant), SSR/pre-rendering for SEO.
5. Real availability and reservation confirmation.
6. Payments, subscription plans, platform admin, then the multi-venue marketplace.
7. Automated tests (unit tests for `utils/`, Playwright for the main flows).
