# Portfolio Design System

Version: 1.0  
Theme: Warm Editorial / Engineering Portfolio

This is a lightweight, dependency-free design framework for the portfolio. It is intentionally not a utility-heavy framework: it provides a consistent token layer and a small set of reusable building blocks while leaving the page's art direction in `css/styles.css`.

## 1. Design principles

- **Editorial, not template-like:** large type, clear hierarchy, purposeful whitespace.
- **Engineering details as decoration:** diagrams, data-flow, code-like labels and project artifacts.
- **Warm and precise:** cream surfaces, charcoal text, coral accent, restrained blue.
- **Motion with meaning:** reveals and transitions are short and subtle; reduced-motion preferences are respected.
- **Accessible by default:** semantic HTML, keyboard focus, readable contrast and mobile-first layouts.

## 2. Color tokens

Defined in `css/styles.css` and extended by the design-system stylesheet.

| Token | Light theme | Role |
|---|---|---|
| `--bg` | `#f5f1e8` | Page background |
| `--surface` | `#fffdf8` | Cards / elevated surfaces |
| `--surface2` | `#eee8dd` | Secondary panels |
| `--ink` | `#201f1d` | Main text |
| `--muted` | `#77716b` | Secondary text |
| `--line` | `#dcd4c9` | Borders / dividers |
| `--accent` | `#e4512b` | Coral actions / emphasis |

Dark mode swaps the surface, text and line colors and brightens the accent. Use the tokens instead of hardcoded colors when adding new components.

## 3. Typography

| Token | Font | Usage |
|---|---|---|
| `--sans` | DM Sans | Body, interface and headings |
| `--serif` | Instrument Serif | Editorial italic emphasis |
| `--mono` | JetBrains Mono | Metadata, labels, technical values |

Use short uppercase mono labels for metadata. Body copy should remain comfortably readable and never use letter-spacing for long paragraphs.

## 4. Spacing and layout

Design-system scale: `--ds-space-1` through `--ds-space-8` (4, 8, 12, 16, 24, 32, 48, 64px).  
Page gutters are controlled by `--g`; content width by `--ds-content` (1320px). Use CSS Grid for major layouts and Flexbox for alignment.

## 5. Radius, shadow, motion

- Radius: `--ds-radius-sm` (6px), `--ds-radius-md` (10px), `--ds-radius-lg` (16px), `--ds-radius-pill`.
- Soft shadow: `--ds-shadow-soft`; hover elevation: `--ds-shadow-lift`.
- Motion: `--ds-motion-fast`, `--ds-motion-base`, `--ds-motion-slow`.
- Do not animate layout-heavy properties when opacity/transform will work.
- Honor `prefers-reduced-motion`.

## 6. Reusable classes

All classes are defined in `css/design-system.css`.

| Class | Purpose |
|---|---|
| `.ds-container` | Shared max-width + responsive gutters |
| `.ds-reading` | Readable text-width constraint |
| `.ds-stack` | Vertical stack with consistent gap |
| `.ds-inline` | Inline/flex grouping with gap |
| `.ds-grid` | Grid layout with gap |
| `.ds-surface` | Surface panel with border and radius |
| `.ds-card` | Padded interactive card |
| `.ds-button` | Reusable button/link styling |
| `.ds-button-primary` | Accent button variant |
| `.ds-chip` | Small pill label |
| `.ds-eyebrow` | Accent mono label |
| `.ds-muted` | Muted text |
| `.ds-rule` | Tokenized divider |

## 7. Component recipes

### Card
```html
<article class="ds-surface ds-card">
  <span class="ds-eyebrow">PROJECT / 01</span>
  <h3>Project title</h3>
  <p class="ds-muted">Short, factual description.</p>
</article>
```

### Buttons
```html
<a class="ds-button" href="#work">Secondary action</a>
<a class="ds-button ds-button-primary" href="#contact">Primary action</a>
```

### Chip
```html
<span class="ds-chip">JAVA · REST</span>
```

## 8. Rules for extending

1. Reuse existing tokens; don't introduce one-off colors or spacing values without a reason.
2. Keep component styles in the framework file; unique page composition belongs in `styles.css`.
3. Keep the HTML semantic; do not use utility classes as a replacement for landmarks or labels.
4. All interactive elements need visible focus, a meaningful accessible name and a keyboard-accessible action.
5. Never hide important content behind animation. The page must remain readable if scripts or animation CDNs fail.
6. Use placeholder project links only temporarily and clearly identify them before publishing.

## 9. File responsibilities

- `css/design-system.css`: global tokens, reusable primitives and reduced-motion safeguard.
- `css/styles.css`: portfolio-specific layouts, illustrations and page styling.
- `js/main.js`: theme, navigation, copy-email, scroll progress, canvas and motion enhancements.
- `index.html`: content, semantic structure and section order.
