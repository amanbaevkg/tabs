# BCC – Business Center Capellen · homepage concept v2.1 (desktop mockup)

A static HTML/CSS/JS mockup for internal review. It is not the production website. It needs no build step, framework or internet connection.

## Run it

**Option 1: open the file.** Double-click `index.html`. It opens in your browser and everything works, including fonts, animations and the gallery.

**Option 2: local server (recommended while editing).** In Terminal:

```sh
cd path/to/bcc-homepage
python3 -m http.server 8000
```

Then open http://localhost:8000. Press Ctrl+C to stop the server. If you use VS Code, the "Live Server" extension works too.

## Structure

```
bcc-homepage/
├── index.html            page markup
├── css/
│   ├── fonts.css         self-hosted web fonts (@font-face)
│   └── style.css         all layout, colours, animations and hover effects
├── js/
│   └── main.js           header on scroll, language selector, Our Spaces gallery
└── assets/
    ├── images/           BCC logo, 4 BCC photos, 7 client logos
    ├── fonts/            Archivo, Newsreader, IBM Plex Mono (woff2)
    └── video/            empty: put the hero video here (see below)
```

## What is where

- **Colours:** CSS variables at the top of `css/style.css` (`--paper` off-white, `--lime` sand, `--stone`, `--haze` grey-blue, `--navy`, `--night`, `--cyan` …).
- **Animations** (all in `css/style.css`):
  - `spin`: "Work with us" ring
  - `marquee`: client logos (60 s loop, pauses on hover)
  - `drift`: soft light moving over the hero placeholder
  - `cue`: scroll line at the bottom of the hero
  - hover transitions on photos, links and buttons

  All of them switch off for visitors who have "Reduce motion" turned on.
- **Header behaviour** (`js/main.js`): transparent over the hero, then a solid slim bar; it hides when scrolling down and returns when scrolling up.
- **Language selector:** a UI concept only. EN/FR/DE/LU mark themselves active; the content stays in English.
- **Placeholders:** striped boxes labelled V1 and P1–P8, sized to the final image shape. Replace each box with an `<img>` (or `<video>`) of the same size.
- **Review-only parts:** the grey strip at the very top (`.ribbon`) and the "Review notes" block at the bottom (`.appendix`) can be deleted once the concept is approved.

## Adding the hero video (V1)

1. Save the video as `assets/video/hero.mp4` (H.264, 1920×1080 or 3840×2160, muted, 20–25 s loop, ideally under 10–15 MB).
2. Save a still frame as `assets/images/hero-poster.jpg`.
3. In `index.html`, find the commented `<video class="hero-video" …>` line in the hero and uncomment it.
4. Delete the placeholder `<div class="ph dark" …>` just above it and the `V1` tag.

## External links

The page loads nothing from other websites. The only external URLs are ordinary links that open when clicked: BCC's own pages (About Us, Our Services, Contact), LinkedIn, Facebook and Google Maps.

The live site uses an embedded Google Map. In this mockup it's a styled placeholder with an "Open in Google Maps" link. Paste the Google Maps `<iframe>` there when you build the real site.

## Fonts

Archivo, Newsreader and IBM Plex Mono come from Google Fonts and are licensed under the SIL Open Font License. They are included locally so the page works offline. The files are the macOS builds; they render identically in any modern browser.
