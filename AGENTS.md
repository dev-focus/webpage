# AGENTS.md — Focus Website

This repo is a Hugo (extended) site using the `hugoplate` theme and TailwindCSS.
The content is primarily in Spanish, but the site is currently configured as `en`.

## Stack
- Hugo Extended `>= 0.139.2`
- Go `>= 1.23.x` (for Hugo modules unless vendored)
- Node `>= 18` (CI uses Node 20)
- TailwindCSS + PostCSS (driven by `data/theme.json` + `hugo_stats.json`)

## Key Commands
- Dev server: `npm run dev` (Hugo server on `http://localhost:1313`)
- Production build: `npm run build` (outputs to `public/`)
- Production preview: `npm run preview`
- Format templates/styles: `npm run format` (Prettier + go-template plugin)
- Update Hugo modules: `npm run update-modules`

## Project Layout (High Signal)
- `hugo.toml`: main Hugo config (baseURL, outputs, build cachebusters)
- `config/_default/`
  - `languages.toml`: language setup (currently `en`, but content is Spanish)
  - `menus.en.toml`: main and footer navigation
  - `params.toml`: theme params (branding, SEO, search, analytics, contact form)
  - `module.toml`: Hugo module imports
- `content/english/`: site content (home, pages, blog, authors, sections)
  - Home params live in `content/english/_index.md` (banner + features)
  - Section data: `content/english/sections/` (testimonials, call-to-action)
- `data/theme.json`: design tokens (colors, typography) for Tailwind
- `data/social.json`: social links in footer/header
- `assets/scss/custom.scss`: place for custom CSS overrides (currently empty)
- `layouts/partials/essentials/head.html`: local override of theme head
- `themes/hugoplate/`: upstream theme source
- `static/`: static assets copied to site root (includes `CNAME`)

## Content Notes
- Home page layout comes from `themes/hugoplate/layouts/index.html` and reads
  `banner` + `features` from `content/english/_index.md`.
- There are large, full-page HTML exports in:
  - `content/english/_index.html`
  - `content/english/pages/clientes.html`
  These can override the `.md` equivalents and may conflict with the theme.
  Keep only one source per page to avoid Hugo ambiguity.

## Shortcodes in Use
- Slider: `{{< slider ... >}}` (used in `servicios.md`)
- Image: `{{< image ... >}}`
- Gallery: `{{< gallery ... >}}` (used in `clientes.md`)

## Styling
- Tailwind classes are generated from `hugo_stats.json`.
  If you add dynamic classes, update `tailwind.config.js` `safelist`.
- Theme colors and fonts come from `data/theme.json`.
- Use `assets/scss/custom.scss` for local overrides if needed.

## Deployment
- Primary: GitHub Pages (see `.github/workflows/main.yml`)
- Domain: `static/CNAME` set to `focusuy.org`
- There are Netlify + Vercel configs (`netlify.toml`, `vercel.json`,
  `vercel-build.sh`) which appear unused for current deployment.

## Configuration Gotchas
- `timeZone` in `hugo.toml` is `America/New_York` (should likely be
  `America/Montevideo`).
- `languages.toml` declares `en` while site content and menus are Spanish.
- `params.toml` includes default metadata (`keywords`, `description`), and
  placeholder sections (call-to-action/testimonials) still contain boilerplate.
