# Devansh — Developer Portfolio

A one-page personal portfolio built with plain HTML5, CSS3, and vanilla JavaScript. No frameworks, no build step, no dependencies.

## File structure

```
portfolio/
├── index.html      # all page content and structure
├── style.css        # all styling, organized into numbered sections
├── script.js        # all interactivity
├── assets/          # put resume.pdf and any local images here
└── README.md
```

## Run it locally

Either:

1. Double-click `index.html` to open it directly in a browser, or
2. Use VS Code's **Live Server** extension: right-click `index.html` → "Open with Live Server" (recommended, since some browsers restrict `fetch`/module behavior on `file://` URLs — this project doesn't use those, but Live Server gives you auto-reload too).

## Push to GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo you just pushed.
2. When configuring the project:
   - **Framework Preset:** `Other`
   - **Build Command:** leave blank
   - **Output Directory:** leave as the repo root (`.`)
3. Click **Deploy**. Vercel will serve `index.html` directly — no build step needed.

## Notes

- Fonts are loaded from Google Fonts (Space Grotesk + Manrope) with system-font fallbacks, so the page stays usable if fonts fail to load.
- Respects `prefers-reduced-motion` — animations are disabled for users who request it.
- Custom cursor and magnetic button effects are desktop-only (disabled on touch devices).
