# vsapiens.github.io

Personal site of **Erick González** — Lead Performance Engineer, Backend Developer, and AI Builder.

Built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com). Bright, systems-atlas visual foundation. Deployed to GitHub Pages.

## Structure

| Path | What it is |
| :--- | :--- |
| `src/pages/` | Routes — home, experience, projects, blog, education, contact, resume |
| `src/data/projects.json` | Curated project portfolio (the "status board" on `/projects`) |
| `src/data/experience.json` | Work history rendered on `/experience` |
| `src/data/education.json` | Education rendered on `/education` |
| `src/content/blog/` | Blog posts (Markdown, Astro content collection) |
| `src/components/` | Astro components — cards, timeline, skills grid, nav, footer |
| `src/lib/projects.ts` | Project types + status/language color helpers |
| `public/` | Static assets — `resume.pdf`, favicons |

## Adding a project

Add an entry to `src/data/projects.json`. Set `status` to one of
`live` · `beta` · `building` · `shipped` · `oss` · `archived` (drives the status
badge color), mark `featured: true` to surface it at the top with highlights, and
fill `links.live` / `links.repo` as available.

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the production build locally |
