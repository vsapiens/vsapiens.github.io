# Systems Atlas portfolio implementation plan

## Context

Rebuild Erick Gonzalez's Astro portfolio as a bilingual, recruiter-first Systems Atlas experience. Consulting remains a visible secondary route. The approved visual direction uses a bright technical canvas, oversized editorial type, violet scientific abstraction, modular evidence panels, and an interactive systems map. The site must remain static and deployable to GitHub Pages.

## Global Constraints

- Work only in `C:\Users\erick\.codex\worktrees\portfolio-systems-atlas` on `feat/systems-atlas`.
- Keep Astro as the framework; upgrade to Astro 7, Node 24, Tailwind CSS 4, React 19, and shadcn/ui-compatible local primitives.
- English is canonical at `/`; Spanish lives under `/es`. Preserve existing public routes.
- Recruiters are primary. Consulting, freelance, and collaboration are secondary.
- Use Systems Atlas tokens: canvas `#F7F9FC`, ink `#101828`, technical blue `#0B5FFF`, systems violet `#6D28D9`, signal coral `#FF5A3D`, grid line `#D7DFEA`.
- Use Archivo for primary typography and IBM Plex Mono only for code and measured data.
- Do not copy or embed Pinterest assets. Create original CSS/SVG visuals.
- Do not invent testimonials, metrics, clients, production status, or confidential details.
- Vitrina must disclose that its public site is available but the production WhatsApp channel is paused.
- MISO OS must be described as in development: FastAPI is the product backend; Go compiles and validates contracts. Do not call it deployed or fully integrated.
- Quote prices: diagnosis USD 500 / MXN 10,000; performance audit USD 1,500 / MXN 30,000; agent workflow USD 2,500 / MXN 50,000; backend/MVP USD 5,000 / MXN 100,000.
- WhatsApp CTA target: `528120008400`. Email fallback: `iamerickfrank@gmail.com`.
- Quote answers stay in the browser. No backend, analytics, account, or data persistence.
- Respect keyboard navigation, WCAG AA contrast, and `prefers-reduced-motion`.
- Follow TDD for every non-trivial new function. Record failing and passing commands in the task report.

## Task 1: Modernize the foundation and define tested content contracts

- Upgrade dependencies/configuration to Astro 7, React 19, Tailwind CSS 4, TypeScript checking, Vitest, and local shadcn-compatible primitives. Update GitHub Actions to Node 24.
- Establish path aliases and semantic CSS variables for the approved token system; remove the old dark terminal theme.
- Create typed shared content/config for locales, navigation, services, prices, contact destinations, evidence metrics, projects, and featured case studies.
- Add the six featured stories: Performance at Scale, Vitrina, MISO OS, AgentOS, MX Stock Analyzer, and Open-source Performance Toolkit. Keep all fifteen curated projects in the archive.
- Implement and test pure helpers for locale-aware paths/prices, quote validation, contact brief generation, WhatsApp URL encoding, and mailto fallback.
- Add scripts for `test`, `check`, and a combined verification command. Run focused RED/GREEN tests, then the full unit suite and build.
- Commit the task and write the report with exact TDD evidence.

## Task 2: Build the bilingual Systems Atlas experience

- Replace the current homepage with the approved structure: compact navigation, hero, original interactive systems-map visual, evidence rail, selected work, AI delivery method, services preview, experience, writing, and final CTA.
- Build reusable Astro presentation components plus React islands only for interactions. Use local shadcn-style Button, Sheet/Dialog, Tabs, Badge, Progress, RadioGroup, and Accordion primitives where they materially support behavior.
- Create `/work`, `/work/[slug]`, `/services`, `/about`, and Spanish equivalents under `/es`; preserve and redesign `/projects`, `/experience`, `/education`, `/contact`, and `/resume` so existing URLs remain useful.
- Provide English and Spanish content for marketing pages, service descriptions, project metadata, all six case studies, and all eight existing blog articles. English articles remain canonical and Spanish translations live under `/es/blog`.
- Present Claude and Codex as human-directed engineering workflow: roles, context, isolated execution, review, verification, and human authorization.
- Use only factual, status-qualified claims from the current portfolio and source repositories. Add clear external/live/source links with safe rel attributes.
- Add responsive navigation, visible focus, skip link, reduced-motion behavior, and original SVG/CSS visuals.
- Add component/render tests where behavior exists, run full tests/check/build, visually inspect desktop and mobile, then commit and report.

## Task 3: Implement conversion, metadata, and end-to-end verification

- Build the four-step quote experience: service, current situation, timeline, budget/context, then generated brief. Users can edit answers, copy the summary, open WhatsApp, or open the email fallback.
- Make WhatsApp the primary CTA in navigation/mobile, services, and the closing section. Remove the Google Forms iframe.
- Add bilingual metadata, canonical URLs, `hreflang`, Person/ProfessionalService JSON-LD, Open Graph defaults, sitemap, RSS, and a bilingual 404.
- Add Playwright smoke/E2E tests for navigation, locale switching, case studies, service pricing, quote validation, WhatsApp URL generation, email fallback, resume download, and key responsive states.
- Add automated internal-link validation and ensure external links use safe attributes. Add accessibility checks where feasible without introducing a hosted service.
- Run the complete verification command, production build, and Playwright suite. Inspect the production preview at desktop and mobile widths and review console output.
- Commit the task and write the report with evidence.
