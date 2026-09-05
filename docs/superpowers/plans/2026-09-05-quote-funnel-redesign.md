# Quote funnel redesign — decisions and verification record

## Why

The Systems Atlas rebuild left the consulting funnel as a generic widget: a percent bar, four radios, a free-text budget field, and a dark `<pre>`. A benchmark against productized-service pages (csswizardry.com, kentcdodds.com, Brittany Chiang's résumé layout, LATAM form-to-WhatsApp pages) and intake-form research (Baymard, NN/g) showed the gaps: no deliverables or duration next to the price, no risk reversal, budget asked as a paragraph, a non-clickable progress bar, an anonymous brief, one currency per locale, unbounded message length, and no recruiter lane on `/contact`.

## Commercial decisions (owner: Erick González, 2026-09-05)

| Item | Value |
| :-- | :-- |
| Durations | Diagnosis 3–5 working days · Performance audit 2–3 weeks · Agent workflow 3–4 weeks · Backend/MVP 6–10 weeks |
| Credit | Diagnosis fee credited toward a performance audit booked within 30 days |
| Pricing display | USD and MXN together in both locales; locale currency first |
| Invoicing | Prices exclude taxes; CFDI invoice available; Mexican entities add 16% IVA; MXN prices are fixed per engagement, not a daily exchange rate |
| Identity | Name, company, role are optional and travel only inside the message the visitor sends |
| Persistence | Answers live in this tab's `sessionStorage`, cleared on "Start over" or tab close. No backend, analytics, or account |

All values live in `src/data/site.ts` (`services`, `experienceEvidence`) and `src/data/content.ts` (`marketing.*.services`, `marketing.*.contact.hiring`).

## Evidence rules

`experienceEvidence` entries must cite a company and an excerpt that appears verbatim in `src/data/experience.json`; `src/data/site.test.ts` enforces it. No testimonials, client logos, or figures that are not already in the work history.

## Hand-off limits

`src/lib/quote.ts` caps each textarea at 600 characters, measures the encoded `mailto:` and `wa.me` lengths, and switches to copy-first when the mailto would exceed 1,900 characters (Outlook truncates near 2,048). The review step shows the budget line so the limit is visible, not silent.

## Infrastructure fixes shipped with this work

- Fonts are self-hosted through `@fontsource-variable/archivo` and `@fontsource/ibm-plex-mono`; the link validator fails if built output references Google Fonts hosts. A render-blocking third-party `@import` previously left the page blank on networks that block Google.
- Playwright serves `dist` with `scripts/static-server.mjs` because `astro preview` on Astro 7 daemonizes and Playwright reported the server as exited. `PLAYWRIGHT_CHROMIUM_PATH` lets sandboxed runners reuse a local Chromium.
- `#quote`, `#hiring`, and service-card anchors carry `scroll-margin-top` so deep links land below the sticky header.
