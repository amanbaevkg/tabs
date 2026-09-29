# BCC – Business Center Capellen · homepage concept (desktop mockup)

A static HTML/CSS/JS mockup for review. It is not the production website. It needs no build step, framework or internet connection.

## Run it

**Option 1: open the file.** Double-click `index.html`. Everything works: fonts, hero video, animations and the gallery.

**Option 2: local server (recommended while editing).**

```sh
cd path/to/bcc-homepage
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Structure

```
bcc-homepage/
├── index.html            page markup
├── css/
│   ├── fonts.css         self-hosted web fonts (@font-face)
│   └── style.css         layout, colours, animations, hover effects
├── js/
│   └── main.js           header on scroll, language selector, workspace selector, Our Spaces gallery
└── assets/
    ├── images/           BCC logo, photos, client logos, hero poster
    ├── fonts/            Archivo, Newsreader, IBM Plex Mono (woff2)
    └── video/            hero video: bcc-hero.mp4 (48 s muted loop, H.264, plays in all browsers)
```

## Content

- All text, names, links and contact details come from businesscentercapellen.lu.
- Photos and the hero video were supplied by BCC (own photos and phone footage). Car number plates are blurred.
- Private office and reception photos partly come from the current website.
- The language selector is a UI concept only; the page stays in English.
- The existing contact assistant is not included and stays as it is on the live site.

## Replacing media

- **Hero video:** replace `assets/video/bcc-hero.mp4` (keep the name), and `assets/images/bcc-hero-poster.jpg` (first frame).
- **Photos:** replace a file in `assets/images/` with one of the same name and orientation.

The live website has not been modified.
