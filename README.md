# Sagar Panda Portfolio — SvelteKit migration

This project migrates the existing Next.js portfolio to **Svelte 5 + SvelteKit**, keeping the existing visual system, content, route structure, and GitHub Pages static hosting target.

## Requirements

- Node.js 22+
- Bun 1.4.2 (primary package manager)

## Local development

```powershell
bun install
bun run dev
```

Open `http://localhost:5173/`.

## Validation and static build

```powershell
bun run check
bun run build
```

The static site is written to `out/`. The build regenerates `static/search-index.json` from the Markdown content before exporting the site.

## npm compatibility

The project supports npm as well:

```powershell
npm install
npm run dev
npm run check
npm run build
```

A `bun.lock` and `package-lock.json` must be generated from this SvelteKit package manifest in an environment with access to the package registry. Do not copy either lockfile from the old Next.js project because it describes a different dependency graph.

## Project layout

- `src/routes/` — SvelteKit routes and prerender loaders
- `src/lib/` — shared layout, content, article, navigation, and UI components
- `content/blogs/` and `content/projects/` — original Markdown content
- `static/` — original public assets, search index, and custom-domain `CNAME`
- `.github/workflows/deploy-pages.yml` — GitHub Pages static deployment
- `.github/workflows/release.yml` — Semantic Release workflow

## Migration notes

- `/about/` and `/contact/` remain dedicated pages and are also represented as sections on the homepage.
- Homepage sections use the original IntersectionObserver reveal behavior and section-aware navigation.
- Taxonomy links use normalized lowercase slugs; tag matching is case-insensitive.
- Markdown is preprocessed for the original content's figure shortcodes, custom heading IDs, and `relref` links.
- Umami analytics retains the existing website ID, host URL, and domain restriction.

The build must pass locally and in GitHub Actions before this migration should replace the live site.
