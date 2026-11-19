# Parakandla Bharath — Portfolio

A responsive personal portfolio built with semantic HTML, CSS and vanilla JavaScript. There is no framework, package installation or build step.

## Run locally

1. Clone or download this repository.
2. Open the folder in VS Code.
3. Start a local server with the Live Server extension, or run `python -m http.server 8000` from the project folder.
4. Visit `http://localhost:8000`.

Opening `index.html` directly also works for the basic page, but a local server is recommended for testing.

## Project structure

```
.
├── index.html
├── css/styles.css
├── js/main.js
├── assets/favicon.svg
├── resume.pdf
├── robots.txt
└── sitemap.xml
```

GSAP 3.12.5, ScrollTrigger 3.12.5 and Lenis 1.1.20 are loaded from pinned CDNs. If a CDN is unavailable, the content remains readable and the page falls back to native scrolling.

## Personalise before sharing

- Replace every `[ADD ...]` placeholder with verified project, internship, database, tool and certification details.
- Add your actual PDF as `resume.pdf` in the repository root.
- Add the Full-Stack Calculator App source URL and the two missing live demo URLs if they exist.
- Add one accurate sentence for each item in More Work.
- Add a portrait only if you want one; no stock image is used.

Do not publish unverified features, metrics or credentials.

## Edit the content

Most copy and links are in `index.html`. Update styles and design tokens at the top of `css/styles.css`. Interactions are split into small functions in `js/main.js`: theme, menu, Lenis, intro, reveals, projects, hover, cursor, contact and navigation.

The contact email is assembled in JavaScript from two strings rather than printed in the HTML source. Update those two values in `initContact()` if the address changes.

## Deploy with GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and `/ (root)`, then save.
5. Wait for the Pages deployment to finish. The site URL is:
   `https://parakandlabharath.github.io/bharath-portfolio/`

No build command is required.

## Accessibility and motion

- Skip link, semantic landmarks, keyboard-friendly mobile navigation and visible focus styles.
- The menu closes with Escape and traps Tab navigation while open.
- Reduced-motion preference disables smooth scrolling, project pinning, marquee motion, parallax-like hover movement and custom cursor.
- Content remains visible when JavaScript or animation CDNs fail.
- Touch devices use a normal project stack; desktop-only hover effects are disabled on coarse pointers.

## SEO

The page includes a descriptive title, meta description, canonical URL, Open Graph and Twitter metadata, Person JSON-LD, favicon, robots.txt and sitemap.xml. Update canonical URLs if the deployment address changes.
