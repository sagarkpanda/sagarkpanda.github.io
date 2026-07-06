# Migration: hugo-profile → hugo-narrow

This folder contains everything needed to switch `sagarkpanda.github.io` from
`hugo-profile` to [hugo-narrow](https://github.com/tom2almighty/hugo-narrow).
It's built as a drop-in overlay: copy these files into your existing repo
root (they replace/add to what's already there) and follow the steps below.

## What changed vs. your old site

| Area | Decision |
|---|---|
| Blog URLs | **Unchanged.** Content stays in `content/blogs/...`, `mainSections: ["blogs"]` in `hugo.yaml`, and `layouts/blogs/{list,single}.html` copy the theme's `posts` templates so you get full styling. No redirects needed. |
| Front matter | All 48 posts auto-converted: `Description` → `description`, `image:` → `cover:` (kept as external URLs, unchanged). |
| Hero/Experience/Education/Skills/Contact | **Homepage now carries the full portfolio**: Hero → Skills (icon pills, 2-row grid) → Experience (full detail, tech icons per job) → Education → Contact → 4 recent posts. No separate About page. |
| Gallery | Dropped (was unused/broken in the old site). |
| Projects / Achievements | Skipped (old config had them disabled with placeholder demo data only). |
| Visual design | Fully adopts Narrow's default look — no custom Bootstrap overrides carried over. |
| Homepage width | Homepage container widened to `80rem` (`layouts/baseof.html` override, `homeContentWidth` param) — only the homepage, not blog posts/archives, which keep the theme's normal 56rem reading width. |
| Homepage hero | Overridden (`layouts/_partials/home/author-section.html`) to be a bigger, portfolio-style hero: larger avatar, bigger name/tagline type, "Read the Blog" / "View Experience" CTA buttons, then social row. `id="hero"` for nav anchor. |
| Homepage skills | `layouts/_partials/home/skills.html` — icon + name pills in a 2-row grid (7 cols × 2 rows on desktop), data in `params.yaml` under `skills:`. |
| Homepage experience | `layouts/_partials/home/experience.html` — full detail cards (highlights + tech icons per job), data in `params.yaml` under `experience:`. `id="experience"` for nav anchor. |
| Homepage education | New `layouts/_partials/home/education.html` — degree/school/GPA cards, data under `education:`. `id="education"` for nav anchor. |
| Homepage contact | New `layouts/_partials/home/contact.html` — simple card with mail CTA, data under `contact:`. `id="contact"` for nav anchor. |
| Top nav | Now: About (→ `/#hero`) · Experience (→ `/#experience`) · Education (→ `/#education`) · Contact (→ `/#contact`) · Blog · Archives · Tags. **Categories removed** from nav (and its content page deleted). |
| Nav logo | `header.logo.image` now points at `circle_profile.webp` instead of falling back to a plain letter "S". |
| Hosting | Still GitHub Pages via GitHub Actions. No Vercel needed. |

## This pass: critical bug fixes

This was a "fix the bugs first" pass before the follow-up content/feature pass (projects section, series content migration, JSON-LD, semantic-release, shortcodes). Here's everything that changed:

| Issue | Fix |
|---|---|
| **Tailwind CSS wasn't picking up new classes** | Root cause: the theme ships a *static precompiled* `compiled.css` — any new Tailwind class added in a custom partial (mine or yours, going forward) has zero effect unless recompiled. I ran a real Tailwind v4 build scanning the theme + all site overrides and shipped the result as `assets/css/compiled.css` (site-level override, doesn't touch the theme submodule). **`npm install && npm run compile` is now a required step**, not optional — added to `.github/workflows/deploy.yaml`. |
| **Nav overlapped the Table of Contents** | Simplified nav sitewide to primary items only (About/Experience/Education/Contact/Blog) + a single **"More"** dropdown holding Archives/Tags/Series — matches the theme's own default pattern, no more 2-line wrap. |
| **Medium icon invisible in social pills** | Your `medium.svg` had a hardcoded `fill="#000000"` — invisible on the dark theme. Changed to `fill="currentColor"` so it inherits the surrounding text color like every other icon. |
| **Lightbox close (×) button misaligned** | It was a bare `&times;` text glyph, which doesn't optically center well. Replaced with an inline SVG matching the prev/next arrows, sized via the theme's (previously empty) `assets/css/custom.css` extension point. |
| **Lightbox showed "1/1" even with more images after it** | The theme only groups *visually adjacent* images (no text between them) into one navigable gallery — anything separated by a paragraph became its own isolated 1-image gallery by design. Patched `gallery.js` so all such "standalone" images on a page now share one gallery, so Next/Prev steps through every image in the post regardless of text between them. Visually-adjacent image grids are untouched. |
| **Lightbox / hotlinked Medium & Miro images** | Investigated thoroughly — found no CORS/referrer restriction in the theme's code, and traced how external images get width/height fallbacks. Couldn't fully reproduce or confirm the failure without a live render (still blocked on Hugo 0.158+ locally). If it's still broken after you test, it's likely CDN-side hotlink protection on Miro/Medium's end rather than a template bug — let me know what you see and I'll dig further. |
| **Back button closed the lightbox AND navigated away** | `gallery-lightbox.js` now pushes a history entry on open; browser/mobile back button (and the dock's own back button) closes the lightbox on the first press via a `popstate` listener, and only navigates away on a second press. |
| **First post hero image cropped/trimmed** | Cover image was forced into `aspect-video object-cover` (crops to fill a fixed 16:9 box). Changed to `object-contain` with a background fill so the full image is always visible, capped at `70vh`. |
| **Search only appeared when scrolling up** | It previously lived only in the floating "dock" (scroll-triggered). Added a persistent search button to the header (desktop + mobile), wired to the same `window.Search.toggle()` used by the dock. |
| **Homepage restructure** | Added an **About Me** section (title + your `red_bg_full.webp` banner at full height + intro paragraph) right before Skills, moved "Here are a few technologies..." into that paragraph, and skills pills are back to a natural flex-wrap row (not a forced grid) — each with its real tech logo. Recent posts count dropped 4 → 3. |
| **Section spacing looked inconsistent / collapsed to zero in places** | Rebuilt `layouts/home.html` to lay out sections with flex `gap` instead of each partial's own `margin-bottom` — margins can silently collapse between siblings in CSS; `gap` can't. |
| **Nav-anchor scrolling hid the section behind the sticky header** | Added `scroll-mt-28` to every anchor target (`#hero`, `#experience`, `#education`, `#contact`) so the sticky header no longer covers the heading after a jump. |
| **Telegram / Bluesky placement** | Removed from the hero social row; now live in the Contact section alongside the "Mail me" button (Bluesky uses a `#` placeholder until you send the real URL). |
| **Color scheme** | Default set to `claude` (`colorScheme: "claude"` in `params.yaml`). |
| **Footer** | Added "All Systems Operational" linking to `https://status.sagarpanda.com/`, matching your old footer indicator. |
| **Staging URL** | `baseURL` set to `https://new.sagarpanda.com/` for testing before the main domain cutover. |

### Deferred to the next pass (by your choice, to keep this batch shippable)
Projects section, migrating your `#cloud #k8s` tag groupings into Narrow's Series feature (nav entry + content page are scaffolded, but posts aren't yet assigned to series), JSON-LD/breadcrumbs, custom `render-image.html`/`render-link.html` (safe-link, lazy-loading, auto width/height, auto alt/title), the `figure` shortcode, robots.txt + Google Search Console verification file, and semantic-release config.

## Steps to apply

1. **Start from a new branch** in your existing repo:
   ```bash
   git checkout -b migrate-to-hugo-narrow
   ```

2. **Remove the old theme and layout overrides** (they're hugo-profile-specific and won't be used):
   ```bash
   git rm -r themes/hugo-profile layouts static/images/ansible.svg static/images/argo.svg \
     static/images/aws.svg static/images/blog.svg static/images/bsky.svg static/images/docker.svg \
     static/images/github-actions.svg static/images/gitlab.svg static/images/grafana.svg \
     static/images/jenkins.svg static/images/kubernetes.svg static/images/linux.svg \
     static/images/nginx.svg static/images/pen.svg static/images/prometheus.svg \
     static/images/sonarqube.svg static/images/telegram.svg static/images/terraform.svg \
     static/images/red_bg_full.webp hugo.yaml
   ```
   (Keep `static/images/circle_profile.webp`, `static/images/og-image.jpg`, `static/images/github.svg`,
   `static/images/linkedin.svg`, `static/images/email.svg`, `static/images/medium.svg` — not required since
   Narrow ships its own icon set, but harmless to keep.)

3. **Copy everything from this folder into your repo root**, overwriting where needed:
   - `config/` (new — replaces root `hugo.yaml`)
   - `content/about/`, `content/archives/`, `content/categories/`, `content/tags/`, `content/_index.md`
   - `content/blogs/` (already front-matter-fixed — this replaces your existing `content/blogs/`)
   - `layouts/blogs/`
   - `assets/icons/medium.svg`
   - `static/images/circle_profile.webp`, `static/images/og-image.jpg`
   - `.github/workflows/deploy.yaml` (replaces your existing one)
   - `package.json` (optional, only needed if you customize Tailwind classes later)
   - `.gitignore`

4. **Add the theme as a git submodule** (same pattern your old site already used for hugo-profile):
   ```bash
   git submodule add https://github.com/tom2almighty/hugo-narrow.git themes/hugo-narrow
   git submodule update --init --recursive
   ```

5. **Install Hugo Extended ≥ 0.158.0 locally** (this is a hard requirement — the theme uses
   newer Hugo APIs that don't exist in older versions; your CI already pulls `latest` so this
   only matters for local testing):
   ```bash
   # macOS
   brew install hugo
   # or download the extended binary for your OS from
   # https://github.com/gohugoio/hugo/releases
   hugo version   # confirm it says "extended" and is >= 0.158.0
   ```

6. **Install Node deps and compile CSS** (now required, see table above):
   ```bash
   npm install
   npm run compile
   ```

7. **Preview locally**:
   ```bash
   hugo server -D
   ```
   Check:
   - `/` — homepage renders your intro + recent posts
   - `/about` — full bio/experience/education/skills prose
   - `/blogs/k8s/k8s-intro/` (or any post) — confirms old URLs still resolve with full Narrow styling
   - `/archives`, `/categories`, `/tags` — list pages work

7. **Manual follow-ups** (small things I couldn't fully automate):
   - `params.yaml` sets `favicon.svg` to `circle_profile.webp` as a placeholder — generate a
     real `favicon.svg` (e.g. via [favicon.io](https://favicon.io)) and update that path for a
     correct browser tab icon.
   - Review the color scheme (`colorScheme: "default"` in `params.yaml`) — Narrow ships 11
     built-in themes (`claude`, `nord`, `dracula`, etc.) if you want a different default look.
   - Comments and analytics are off by default (`comments.enabled: false`,
     `analytics.enabled: false`) — fill in a provider in `params.yaml` if you want them.

8. **Commit and push**, then open a PR or merge to `main` — the updated
   `.github/workflows/deploy.yaml` will build and deploy to GitHub Pages automatically
   (Hugo Extended, no npm step required, since the theme ships pre-compiled CSS).

## Why no Vercel

Vercel is only used by the Narrow theme's own maintainers to host their demo/docs site.
The theme is a plain Hugo theme with no server-side requirements — it builds to static
HTML/CSS/JS just like hugo-profile did, so your existing GitHub Pages + GitHub Actions
setup carries over with only the two tweaks in `deploy.yaml` (Hugo Extended, submodule checkout).

## What I verified vs. couldn't verify here

- ✅ All YAML config files and all 55 content files' front matter parse cleanly.
- ✅ Confirmed by reading the theme's own template source (not docs) that `layouts/posts/*`
  has no hardcoded "posts" path — safe to reuse for the `blogs` section.
- ✅ Confirmed the theme ships a prebuilt `compiled.css`, so no Tailwind build step is required.
- ⚠️ Could not do a full local `hugo server` render test in this environment — the only Hugo
  available here (via apt) is v0.123.7, and Narrow requires ≥ 0.158.0 (it uses a newer
  `Site.Language.Locale` API that doesn't exist in older Hugo). Please do step 6 above before
  merging.
