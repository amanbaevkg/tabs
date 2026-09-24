# Cloud Power · homepage concept V2 (desktop mockup)

A static HTML/CSS/JS mockup for internal review. It is not the production website. It needs no build step and no internet connection.

## Run it
- **Quick:** double-click `index.html`.
- **While editing:** run `python3 -m http.server 8000` in this folder, then open http://localhost:8000.

## Structure
```
cloudpower-homepage/
├── index.html          page markup
├── css/fonts.css       self-hosted Geist + Geist Mono
├── css/style.css       layout, colours, animations, hover effects
├── js/main.js          hero streak canvas + logo tilt, header on scroll,
│                       Our DNA scroll index, reveal + count-up, FAQ accordion
└── assets/
    ├── images/         official Cloud Power logo + identity mark
    └── fonts/          woff2 font files
```

## Notes
- **Colours** are CSS variables at the top of `css/style.css`: `--teal` #002F35, `--cyan` #12D3D8, `--mint`, and the others. `--slant` (19°) is the angle of the slash in the logo, and it drives the buttons, markers and section edges.
- **Contact:** there is one action, "Contact Us", in the header, the hero and the final section. It links to https://www.cloud-power.eu/contact-us/.
- **Review-only parts:** the grey strip at the top (`.ribbon`) and the "Review notes" block at the bottom (`.appendix`) can be deleted.
- **Reduced motion:** all animations switch off for visitors who have "Reduce motion" turned on.
- **Content:** all text comes from cloud-power.eu. Nothing loads from other websites; the only external addresses are ordinary links.
