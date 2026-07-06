# File Reference (for handoff to ChatGPT or another session)

Theme: hugo-narrow (submodule at `themes/hugo-narrow`). Everything below is a
SITE-LEVEL file — Hugo automatically prefers these over the theme's own copy
at the same path, so editing these never touches the submodule.

## Config (`config/_default/`)
- **hugo.yaml** — site title, baseURL (currently `new.sagarpanda.com` staging), mainSections (`blogs`), markup/goldmark settings, module version requirement (Hugo ≥0.158).
- **params.yaml** — ALL content data lives here as YAML, consumed by the partials below: `author` (hero identity/social), `aboutMe` (About Me section text+banner), `skills` (pill list), `experience` (job history + tech icons), `education`, `contact` (mail CTA + Telegram/Bluesky), `home.contentOrder` (controls section order on homepage), `colorScheme`, `header.logo.image`.
- **menus.yaml** — top nav (`main`), footer links (`footer`), footer social icons (`social`). Nav items with `parent: More` collapse into the "More" dropdown.

## Content (`content/`)
- **_index.md** — homepage (front matter only, body unused since `page-content` isn't in `contentOrder`).
- **blogs/** — all 48 posts, unchanged paths/URLs from the old site. Front matter uses `description` + `cover` (not the old `Description`/`image`).
- **projects/** — Projects section. `_index.md` is the list page; `otel-labs-platform.md` is the one project entry so far (front matter: `summary`, `status`, `tags`, `link`; body has an inline tech-icon row + description).
- **archives/, tags/, series/** — thin `_index.md` pages so those nav/taxonomy pages render with a title.
- ~~**about/**~~ — removed; About content now lives in `params.yaml`'s `aboutMe` + `author` + homepage partials.

## Homepage sections (`layouts/_partials/home/*.html`)
Each file is one section of the single-page homepage. Order is controlled by `params.yaml`'s `home.contentOrder`, currently: `author-section → about-me → skills → experience → education → contact → recent-posts` (recent-posts is the theme's own file, unmodified).
- **author-section.html** — hero: avatar, name, tagline, bio, "Checkout my Blogs" / "View Experience" buttons, social row (GitHub/LinkedIn/Email/Medium). `id="hero"`.
- **about-me.html** — "About Me" heading, `red_bg_full.webp` banner, intro paragraph (reads `params.yaml` → `aboutMe`).
- **skills.html** — flex-wrap pill row, each with a tech logo (`params.yaml` → `skills.items`).
- **experience.html** — job history cards with markdown highlights + tech icons per job (`params.yaml` → `experience`). `id="experience"`.
- **education.html** — degree cards (`params.yaml` → `education`). `id="education"`.
- **contact.html** — mail CTA + Telegram/Bluesky row (`params.yaml` → `contact`). `id="contact"`.

## Other layout overrides (`layouts/`)
- **home.html** — wraps all sections above in one flex column with `gap` (not margin) between them, so spacing can't collapse to zero.
- **baseof.html** — page shell; widens ONLY the homepage container to `homeContentWidth` (80rem in `params.yaml`), every other page keeps the theme's normal 56rem reading width.
- **blogs/list.html, blogs/single.html** — copies of the theme's `posts/list.html`/`single.html`, since Hugo only auto-applies templates matching the content folder name (`blogs`, not `posts`). `single.html`'s cover image uses `w-full h-auto` (no cropping, ever).
- **_partials/navigation/header.html** — nav: About/Projects/Experience/Education/Contact/Blog + "More" (Archives/Tags/Series). Logo removed, spacing tightened to fit one line. Added a persistent search button (desktop + mobile) calling `window.Search.toggle()`.

## Assets (`assets/`)
- **css/custom.css** — the theme's own (normally empty) site-customization hook. Currently holds: lightbox close-icon sizing, image caption font-size, and the external-image layout-shift fix (see below).
- **css/compiled.css** — **the actual compiled CSS.** The theme ships a static precompiled file that only contains classes the theme's own developer used — any NEW class in our custom files (this whole site) has ZERO effect unless this file is regenerated. This is a pre-built, correct copy. Regenerate with `npm run compile` (needs `npm install` first) any time you add a new Tailwind class anywhere.
- **icons/medium.svg** — the theme has no Medium icon; this is a manually-added one (fixed to use `fill="currentColor"` so it's visible in dark mode).
- **js/gallery.js** — patched so all "standalone" (non-adjacent) images in a post share ONE lightbox gallery, so Next/Prev works across the whole post instead of every image opening as an isolated "1/1".
- **js/gallery-lightbox.js** — patched: (1) close button is now an SVG icon instead of a misaligned `&times;` glyph, (2) opening the lightbox pushes a history entry so the back button/mobile back-gesture closes the lightbox first instead of navigating away.
- **js/dock.js** — patched: the dock's own "back" button also closes the lightbox first if it's open, instead of navigating away.

## Known/possible remaining issue
Lightbox intermittently failing on some Medium/Miro images was very likely a
layout-shift bug: external images get no `width`/`height` HTML attributes
(the theme only knows real dimensions for local/processed images), so the
browser collapses their box to 0 height until they finish loading — anything
below shifts, so a click can land on the wrong element while images are
still loading in. Fixed in `custom.css` by reserving a 16:10 box for any
`<img>` missing a `width` attribute. If it's still flaky after this, it's
likely something CDN-side (hotlink protection) rather than the template.

## Still not done (from your last big list)
JSON-LD/breadcrumbs, custom `render-link.html` (safe-link/lazy-load/auto alt),
`figure` shortcode, robots.txt + Search Console verification file,
semantic-release config, assigning specific posts to specific Series.
