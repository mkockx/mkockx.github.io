# mkockx.github.io

Personal site — landing page, writing (Field Notes), papers, and résumé.
Static HTML/CSS/JS, no build step. Field Notes design system with light/dark
theming that follows the browser preference and offers a manual toggle.

## Structure

```
mkockx.github.io/
├── index.html                     # Landing: bio, latest writing, pillars
├── articles/
│   ├── index.html                 # Writing index (Operational Readiness series)
│   ├── we-commission-systems-and-equipment.html   # Part 1
│   └── commissioning-the-organization.html         # Part 2
├── papers/index.html              # White papers & research
├── resume/index.html              # Résumé / CV
├── assets/
│   ├── site.css                   # Design system + light/dark tokens + article styles
│   └── theme.js                   # Theme toggle (defaults to OS) + reading progress
├── .nojekyll                      # Serve files as-is (no Jekyll processing)
└── README.md
```

Content of record for the articles lives in the Obsidian vault under
`Publications/standalone/<slug>/`. These site pages are the published renderings.

## Local preview

No server strictly required (open `index.html`), but a local server avoids any
`file://` quirks:

```bash
cd ~/Dev/projects/mkockx.github.io
python3 -m http.server 8080   # then visit http://localhost:8080
```

## Deploy (GitHub Pages, user site)

A repo named `mkockx.github.io` is served at `https://mkockx.github.io/` automatically.

First time:

```bash
cd ~/Dev/projects/mkockx.github.io
git init && git branch -M main
git add -A && git commit -m "Initial site"
gh repo create mkockx.github.io --public --source=. --remote=origin --push
# Enable Pages from the main branch root:
gh api -X POST repos/mkockx/mkockx.github.io/pages -f source.branch=main -f source.path=/ 2>/dev/null || \
  echo "If that errored, enable Pages in repo Settings → Pages → Source: main / root"
```

Every later update:

```bash
git add -A && git commit -m "…" && git push
```

Pages redeploys in ~30–60s.

## Custom domain (optional, ~$10–12/yr)

1. Buy a domain (Cloudflare Registrar at-cost, or Porkbun/Namecheap).
2. Add a `CNAME` file at the repo root containing just the domain, e.g. `martinkockx.com`.
3. DNS: `A`/`AAAA` records to GitHub Pages IPs, or a `CNAME` record to `mkockx.github.io`.
4. Repo Settings → Pages → set the custom domain and tick "Enforce HTTPS".

## Adding a new article

1. Copy an existing file in `articles/` as the template.
2. Update `<title>`, meta description, `.kicker`, `<h1>`, `.dek`, body, and `.series-nav`.
3. Add a card to `articles/index.html` and (if it's the latest) to `index.html`.
4. Keep bespoke graphics inline in the article; promote a pattern into `site.css`
   only once it recurs across 3+ pieces.

## Theming notes

`assets/site.css` defines light tokens in `:root` and dark tokens via
`@media (prefers-color-scheme: dark)` plus a `:root[data-theme="dark"]` override.
`assets/theme.js` stores the user's explicit choice in `localStorage`; with no
stored choice the site follows the OS. Article graphics (including the SVG) are
styled with CSS variables so they adapt to both themes.

## TODO before going fully public

- Replace placeholder footer links (LinkedIn URL, email) across all pages.
- Fill in `resume/index.html` bracketed placeholders; attach a résumé PDF.
- Attach paper PDFs in `papers/` as they're cleared for release.
