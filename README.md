# Science-Universe

[![Hire me on Fiverr](https://img.shields.io/badge/Hire%20me%20on-Fiverr-1DBF73?style=for-the-badge&logo=fiverr&logoColor=white)](https://www.fiverr.com/pablonietop)

Landing page for a science publication, built around explaining natural phenomena and making predictions.

[![Live demo](https://img.shields.io/badge/demo-scienceuniverse.wib.digital-2ea44f)](https://scienceuniverse.wib.digital)
![Dependencies](https://img.shields.io/badge/npm%20dependencies-0-brightgreen)
![Build step](https://img.shields.io/badge/build%20step-none-lightgrey)
![First load](https://img.shields.io/badge/first%20load-277%20KB-brightgreen)

## Description

Science outreach pages usually open with a picture of a galaxy and a slogan. This one opens with a definition of what science does — explain natural phenomena and make predictions — and treats that sentence as the hero rather than decoration around it.

Below the statement, the page names two sections: Analysis and Community. The claim being made is that the publication is a place where findings are examined and discussed, not a feed of images.

Motion is carried by an embedded video rather than a 3D library, which keeps the page light while giving the hero movement. The whole composition is designed to sit inside one screen on desktop and to stack into a scrollable column on phones.

## Features

- Definition-led hero, with the statement as the primary content.
- Analysis and community sections naming what the publication does.
- Video in the hero rather than a 3D runtime.
- Full-screen overlay menu: opens from the header, closes on `Escape`, on the close button, and on any link inside it.
- Entrance choreography built from CSS animations, so the page renders its final state even if JavaScript never runs.
- Honours `prefers-reduced-motion`: the marquee stops and the background video pauses.
- No build step, no package manager, no runtime dependencies.

## Tech stack

| Layer | Technology | Role in project |
|---|---|---|
| Markup | HTML5 | `index.html` and `404.html` |
| Styling | CSS3 custom properties | `base.css` (tokens/reset), `layout.css` (structure), `components.css` (UI) |
| Scripting | Vanilla JavaScript | Single IIFE in `assets/js/main.js`, no globals |
| Type | Plus Jakarta Sans | Google Fonts, `preconnect` + `display=swap` |
| Media | MP4 + JPEG poster | Hero video served from the repository |

## Prerequisites

None. There is nothing to install and nothing to compile. Opening `index.html` directly works; serving over HTTP is preferable so the hero video can be range-requested rather than downloaded whole.

## Installation

```bash
git clone https://github.com/pabloWIB/Science-Universe.git
cd Science-Universe
```

## Usage

Serve the folder with any static server:

```bash
python -m http.server 5177
```

Then open <http://127.0.0.1:5177>.

Editing is direct: change the CSS files under `assets/css/`, there is no preprocessor in between. Design values live as custom properties in the `:root` block of `assets/css/base.css` — colours, the 4/8/16/24/32/48/64/96 spacing scale, radii, the type scale and motion durations. Change a token there and it propagates.

The hero video is a static asset. Replacing it means swapping `assets/video/science-universe-loop.mp4` and regenerating the poster frame:

```bash
ffmpeg -i assets/video/science-universe-loop.mp4 -vframes 1 -q:v 4 assets/video/science-universe-loop-poster.jpg
```

## Project structure

```
.
├── index.html                  # The whole site: hero, three cards, marquee, overlay menu
├── 404.html                    # Error page; uses root-absolute paths so it works at any URL
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/
│   │   ├── base.css            # Design tokens, reset, typography, utilities
│   │   ├── layout.css          # Backdrop, page shell, header, grid, footer, choreography
│   │   └── components.css      # Chips, hero, cards, marquee, overlay menu, error page
│   ├── js/
│   │   └── main.js             # Overlay menu and reduced-motion handling
│   ├── img/
│   │   ├── logo/               # favicon, apple-touch-icon, Open Graph card
│   │   └── content/            # wib.digital mark used in the Community card
│   └── video/                  # Hero loop and its poster frame
└── docs/
    ├── auditoria.md            # State of the project before the reorganisation
    └── cambios.md              # What changed, grouped by phase
```

## Deployment

Deployed on Vercel at [scienceuniverse.wib.digital](https://scienceuniverse.wib.digital). Static: upload the repository root as-is, no build command and no output directory. Vercel serves `404.html` automatically for unknown paths, so no rewrite configuration is needed.

If the site is ever served from a different domain, four values need updating: `canonical`, `og:url` and `og:image` in `index.html`, and the `Sitemap:` line in `robots.txt` plus the `<loc>` in `sitemap.xml`.

## Known limitations

- The header links are in-page anchors. On desktop the whole composition already fits in one screen, so they move focus without moving the viewport; on phones they scroll as expected.
- The overlay menu requires JavaScript. Without it the trigger and the panel are hidden, and the header links still work.

## Author

**Pablo Nieto Pérez** — [wib.digital](https://wib.digital)
GitHub: [@pabloWIB](https://github.com/pabloWIB)

---

## Hire me

I build **custom internal tools, CRMs and dashboards** for small teams, and
**conversion-focused websites** for businesses.

- [Custom internal tool, CRM or dashboard](https://www.fiverr.com/pablonietop/build-a-custom-internal-app-for-your-business) — from $45
- [Conversion-focused website](https://www.fiverr.com/pablonietop/convert-your-landing-page-design-to-code) — from $80
- [All my services on Fiverr](https://www.fiverr.com/pablonietop)
- [wib.digital](https://wib.digital)
