# Parakandla Bharath — Portfolio

A responsive personal portfolio built with semantic HTML, CSS and vanilla JavaScript. It uses a small, documented design system and has no build step.

## Design system

- **Framework file:** `css/design-system.css` — design tokens, spacing scale, radius, shadows, layout primitives, surface/card/button/chip utilities, and reduced-motion defaults.
- **Visual theme:** warm cream, charcoal, coral accent, muted supporting colors.
- **Typography:** DM Sans for UI/body, Instrument Serif for editorial emphasis, JetBrains Mono for metadata.
- **Page styles:** `css/styles.css` — portfolio-specific composition and art direction.
- **Framework docs:** `DESIGN_SYSTEM.md` — token reference, component recipes, usage rules.

## Run locally

1. Clone or download this repository.
2. Open the folder in VS Code.
3. Start a local server with the Live Server extension, or run `python -m http.server 8000` from the project folder.
4. Visit `http://localhost:8000`.

Opening `index.html` directly works for basic viewing, but a local server is recommended.

## Project structure

```
.
├── index.html
├── resume.html
├── css/
│   ├── styles.css
│   └── design-system.css
├── js/main.js
├── assets/favicon.svg
├── resume.pdf
├── DESIGN_SYSTEM.md
├── robots.txt
└── sitemap.xml
```

GSAP 3.12.5, ScrollTrigger 3.12.5 and Lenis 1.1.20 are loaded from pinned CDNs. If a CDN is unavailable, content remains readable and native scrolling is available.

## Personalise before sharing

- Verify project descriptions, internship details and certification titles.
- Add your actual PDF as `resume.pdf` in the repository root.
- Add the Calculator repository URL and live demo URLs if they exist.
- Replace any generic repository destinations in the More Work section with project-specific links.
- Do not publish unverified features, metrics or credentials.

## Edit the content

Most copy and links are in `index.html`. Update the design tokens in `css/design-system.css` and page-specific styling in `css/styles.css`. Interactions live in `js/main.js`.

## Deploy with GitHub Pages

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` and `/ (root)`, then save.
4. Wait for the Pages deployment to finish.

Site URL: `https://parakandlabharath.github.io/bharath-portfolio/`

No build command is required.

## Accessibility and motion

- Skip link, semantic landmarks, keyboard-friendly navigation and visible focus styles.
- Reduced-motion preference limits motion.
- Content remains visible if animation libraries fail.
- Touch devices use normal stacked layouts; hover effects are limited to appropriate pointer devices.

## SEO

Includes descriptive title, meta description, canonical URL, Open Graph metadata, favicon, robots.txt and sitemap.xml. Update canonical URLs if the deployment address changes.
