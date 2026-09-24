# BCC – Business Center Capellen · homepage Concept 2 (desktop mockup)

A light, photo-led concept for internal review. It is not the production website. It needs no build step and no internet connection.

## Run it
- **Quick:** double-click `index.html`.
- **While editing:** run `python3 -m http.server 8000` in this folder, then open http://localhost:8000.

## Structure
```
bcc-concept2/
├── index.html          page markup
├── css/fonts.css       self-hosted Schibsted Grotesk
├── css/style.css       layout, colours, animations, hover effects
├── js/main.js          header behaviour, language dropdown, parallax,
│                       scroll reveals, Our Spaces gallery (arrows + drag)
└── assets/
    ├── images/         real BCC photos, BCC logo, 7 client logos
    └── fonts/          woff2 font files
```

## Notes
- **Colours** are CSS variables at the top of `css/style.css`: `--bg` off-white, `--bg-2` light grey, `--ink`, and `--accent` (the BCC logo blue).
- **Photos** are real BCC photos, resized for the web, in `assets/images/`. The meeting-room photo comes from the current website. To swap a photo, replace the file and keep its name.
- **Language dropdown:** EN ▾ opens English, Français, Deutsch and Lëtzebuergesch. It is a UI concept; the content stays in English.
- **They trust us:** a slow, seamless right-to-left logo loop that pauses on hover.
- **Review-only parts:** the grey strip at the top (`.ribbon`) and the "Review notes" block at the bottom (`.appendix`) can be deleted.
- **Reduced motion:** all animations switch off for visitors who have "Reduce motion" turned on.
- **External addresses:** nothing loads from other websites. The only external URLs are ordinary links: BCC contact page, Google Maps, LinkedIn, Facebook.
