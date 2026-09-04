# Task 2 report — bilingual Systems Atlas experience

## Status

Complete. Task 2 now delivers the English and Spanish Systems Atlas marketing experience, six localized case studies, the preserved project/archive routes, and all eight blog articles in both languages. The final build is static and contains 48 pages.

## Commits covered

- `8ed299d` — `feat: build bilingual systems atlas experience`: the Task 2 checkpoint introduced the homepage, reusable marketing pages, localized case-study data and routes, responsive navigation, systems-map and method interactions, supporting UI primitives, component tests, and the main Systems Atlas visual language.
- Completion commit (this commit; its final SHA is recorded in the handoff): completes the bilingual article system and eight Spanish translations, then closes defects found during integration and visual inspection.

## Implementation summary

- Replaced the portfolio surface with a compact bilingual navigation, editorial hero, original SVG/CSS system plate, interactive systems map, contextual evidence, selected work, human-directed AI method, services, experience, writing, and closing call to action.
- Added reusable Astro presentation components and narrowly hydrated React islands for navigation, tabs, radio controls, progress, dialogs/sheets, and the method accordion.
- Added English and Spanish routes for `/work`, six work details, `/services`, `/about`, `/projects`, `/experience`, `/education`, `/contact`, `/resume`, `/blog`, and all eight article details.
- Preserved the 15-project archive and legacy public URLs while restyling them within the Systems Atlas design.
- Added a shared article layout and faithful Spanish versions of all eight English articles.
- Made publication dates UTC-stable so date-only frontmatter does not render one day early in Mexico.
- Portaled dialogs and sheets to `document.body`, trapped keyboard focus, restored focus on close, retained Escape/backdrop dismissal, and localized close controls.
- Kept `Work` current on nested case-study routes, localized Spanish case-study link labels and article destinations, and completed the Spanish systems-map accessible name.
- Added an explicit Vitrina qualification to its archive card and aligned the related article with the factual boundary: the public site remains available while the production WhatsApp channel is paused. Removed an unsupported precise test-suite count.
- Retained the MISO OS boundary throughout: FastAPI is the product backend, Go is the compiler/conformance harness, and the product is still in development—not fully integrated or deployed.

## TDD evidence

### Checkpoint behavior contracts

The Task 2 checkpoint retains its behavior contracts in `src/components/islands/SiteNavigation.test.tsx`, `src/components/islands/SystemsMap.test.tsx`, and `src/data/content.test.ts`. They cover labelled/escapable mobile navigation, Spanish route switching, system-lens and node interactions, dependency annotations, dialog behavior, project localization, factual Vitrina/MISO qualifiers, and invalid case-study slugs. The Task 1 parent (`763b382`) has neither those tests nor their Task 2 components, which preserves the test/implementation boundary in git.

The prior implementer's raw pre-implementation RED console was not persisted, so this report does not reconstruct output that cannot be verified. The checkpoint GREEN handoff is retained as:

```text
npm run test       6 files passed; 19 tests passed
npm run check      0 errors, 0 warnings, 0 hints
npm run build      40 pages built
```

### RED/GREEN — modal focus and localized controls

Initial focused command:

```text
npm run test -- src/components/ui/dialog.test.tsx src/components/islands/SiteNavigation.test.tsx
RED: 2 files failed; 2 tests failed | 2 passed
- focus escaped to the background link
- no Spanish button named "Cerrar"
GREEN after focus containment and localization: 2 files passed; 4 tests passed
```

The viewport-bound mobile sheet exposed a second integration defect, so portal placement received its own test:

```text
npm run test -- src/components/ui/dialog.test.tsx
RED: 1 file failed; 1 test failed | 1 passed
- dialog layer parent was not document.body

npm run test -- src/components/ui/dialog.test.tsx src/components/islands/SiteNavigation.test.tsx
GREEN: 2 files passed; 5 tests passed
```

### RED/GREEN — UTC-stable article dates

```text
npm run test -- src/lib/utils.test.ts
RED: 1 file failed; 1 test failed | 1 passed
- expected "15 de abril de 2025"; formatter was undefined
GREEN: 1 file passed; 2 tests passed
```

### RED/GREEN — Spanish case links and systems-map name

```text
npm run test -- src/data/content.test.ts src/components/islands/SystemsMap.test.tsx
RED: 2 files failed; 2 tests failed | 5 passed
- Spanish Vitrina links still used English labels
- the Spanish node button ended with the English word "detail"
GREEN: 2 files passed; 7 tests passed
```

### RED/GREEN — nested work-route navigation state

```text
npm run test -- src/components/islands/SiteNavigation.test.tsx
RED: 1 file failed; 1 test failed | 3 passed
- /work/vitrina left Work without aria-current="page"
GREEN: 1 file passed; 4 tests passed
```

## Content and route validation

- Source parity check: 8 English articles, 8 Spanish articles, zero slug differences, and zero paired-date mismatches.
- The production build emits all 8 English and 8 Spanish article details, both blog indexes, both homepages, both sets of six case-study details, and every requested marketing/archive route: 48 pages total.
- Fresh preview inspection of `/es/work/vitrina` confirmed the qualified status, claim boundary, and localized links `Sitio público de Vitrina` and `Artículo sobre cero node_modules`.
- Fresh preview inspection of `/es/work/miso-os` confirmed the in-development/not-deployed status and the FastAPI product-backend versus Go contract-harness distinction.
- Generated-output scan found 134 `target="_blank"` anchors across the 48 static pages and zero without `rel` containing `noopener`.

## Visual and accessibility inspection

The production preview ran locally at `http://127.0.0.1:4321` and was inspected with browser screenshots, accessibility-tree snapshots, interaction checks, and DOM measurements.

### Desktop — 1440 × 900

- Homepage screenshot showed the sticky navigation, editorial hero, calls to action, grid canvas, and original system plate with coherent spacing and no visible clipping.
- Measured `innerWidth=1440`, `clientWidth=1425`, and `scrollWidth=1425`: no horizontal page overflow.
- Navigation exposed all seven desktop actions and the homepage H1 remained `I make complex systems measurable, fast, and shippable.`
- Accessibility-tree inspection confirmed the system-lens tablist, map-detail radio group, five inspectable nodes, selected-node progress, detail dialog trigger, evidence cards, and all six case-study cards.
- Performance lens, Dependencies detail, Verification node selection, detail opening, Escape dismissal, and focus containment were exercised.

### Mobile — 375 × 667

- Homepage and Spanish article screenshots showed natural headline wrapping, readable typography, and the compact menu trigger. Measured `innerWidth=375`, `clientWidth=360`, and `scrollWidth=360`: no horizontal overflow.
- The final Spanish article preview displayed `15 de abril de 2025`, kept its title and prose within the viewport, and retained readable code/table treatment further down the article.
- Open navigation screenshot showed the complete sheet: title, localized close control, Trabajo, Servicios, Perfil, Escritura, Contacto, English, and Conversemos.
- Sheet measurements after the portal fix: overlay `top=0`, `bottom=667.27`; panel `top=15.99`, `bottom=651.28`; close control `top=40.59`; all navigation links remained visible from `top=104.58` through `bottom=506.80`.
- `Shift+Tab` from the initially focused dialog wrapped to the last in-sheet control (`Conversemos`), rather than leaking focus behind the overlay.
- Systems-map screenshot and state inspection confirmed the Spanish Performance lens (`Rendimiento`), Dependencies mode, selected `04 Verificación` node, legible node labels/annotations, and no horizontal page overflow.
- Browser console inspection after the final build returned zero warnings and zero errors.

The in-app browser compositor duplicated a cropped portion of wide full-page screenshots; DOM dimensions, accessibility snapshots, interaction state, and the unduplicated mobile captures were used to distinguish that tooling artifact from page overflow.

## Final verification

Fresh combined gate after all implementation and inspection fixes:

```text
npm run verify

Test Files  7 passed (7)
Tests       26 passed (26)
astro check — Result (82 files):
- 0 errors
- 0 warnings
- 0 hints
astro build — 48 page(s) built
```

Additional checks:

```text
git diff --check                         clean
English/Spanish article parity           8 / 8; 0 slug or date mismatches
Generated target=_blank safety scan      134 checked; 0 missing noopener
Preview console                          0 warnings; 0 errors
```

## Self-review and concerns

- Reviewed the full completion diff and every new/untracked Task 2 file; no unrelated user work was reverted.
- Confirmed the modal fixes preserve Escape/backdrop dismissal and focus restoration while preventing background keyboard escape.
- Confirmed factual Vitrina and MISO wording at shared-data, article, archive-card, and rendered-route levels.
- No release blocker remains for Task 2.
- Task 3 remains intentionally untouched: quote-flow implementation, expanded SEO/hreflang work, Playwright end-to-end coverage, and automated external-link validation are outside this commit.
