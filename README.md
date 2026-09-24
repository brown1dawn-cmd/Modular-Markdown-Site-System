# Modular Markdown Site System

A multi-template, bilingual static site system where Markdown files act like a lightweight content database. Pages select a template and map named content blocks into the template’s regions. A small Python builder then produces standard HTML that can be deployed to Cloudflare Pages.

## What is included

- Five distinct templates: home, about, services, work, and contact, plus a default template.
- Five bilingual page definitions in `content/pages/`.
- Demonstration Markdown content in `content/sections/zh/` and `content/sections/en/`.
- A frontmatter-aware builder at `scripts/build.py`.
- Responsive editorial styling, language links, mobile navigation, and accessible form controls.
- A GitHub Actions build workflow and a format guide for future editors.

## Quick start

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r scripts/requirements.txt
python scripts/build.py --clean --output dist
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000/zh/` or `http://localhost:8000/en/`. Edit content in `content/sections/` and rebuild. You only need to edit a template when the visual structure changes.

## Cloudflare Workers deployment

The React/Vite preview is configured for Cloudflare Workers using Cloudflare’s official `@cloudflare/vite-plugin` and Wrangler workflow. The root `wrangler.jsonc` declares the Worker name, current compatibility date, `dist/public` as the generated Vite asset directory, and SPA fallback handling. This follows Cloudflare’s React + Vite guidance and Static Assets configuration.

```bash
pnpm install --frozen-lockfile
pnpm run build
pnpm exec wrangler deploy --dry-run
pnpm run deploy
```

For Cloudflare Workers Builds, use `pnpm run build` as the build command and `pnpm run deploy` as the deploy command. The dry run should report the files read from `dist/public` and exit without uploading. The Python Markdown builder remains available for the independent static HTML output described above.

## Project structure

```text
content/pages/       Page metadata and region mappings
content/sections/    Bilingual Markdown content blocks
templates/           Presentation-only HTML templates
assets/              Shared CSS and JavaScript
scripts/build.py     Frontmatter parsing, Markdown rendering, and assembly
site.json            Site-level metadata
pages.json           Generated page manifest (after build)
wrangler.jsonc       Cloudflare Workers asset and SPA routing config
```

See [FORMAT.md](FORMAT.md) for the complete authoring guide.
