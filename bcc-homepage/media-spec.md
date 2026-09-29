# BCC Concept 1: media specification (exact slot sizes)

Measured on the current mockup at 1440 px desktop width. "Minimum" is 2× the on-screen size so images stay sharp on high-resolution screens. Larger is fine.
Name the files as below and they can be dropped in without cropping.

## Hero video

| | |
|---|---|
| File name | `hero.mp4` |
| Orientation | Horizontal, 16:9 |
| Size | 1920×1080 minimum, 3840×2160 preferred |
| Frame rate | 25 or 30 fps |
| Length | 30–60 s, seamless loop |
| Audio | Not needed (removed) |
| Format | MP4 (H.264) |

- Set the editing sequence to 1920×1080 and export at that size.
- On screen the hero is 1424×840 (slightly taller than 16:9), so the browser trims about 30 px on each side. Keep important things away from the far left and right edges.
- The title and workspace selector sit in the centre: keep the centre calm.
- Start on a bright frame, no fade from black (the first frame becomes the loading poster).

## Photos

| Slot | File name | Orientation | On screen | Minimum size |
|---|---|---|---|---|
| Co-Working, large | `cowork-wide.jpg` | Horizontal ≈ 4:3 | 919×720 | 1840×1440 |
| Co-Working, small | `cowork-small.jpg` | Square | 413×420 | 830×840 |
| Private Offices, large | `office-tall.jpg` | Vertical ≈ 2:3 | 585×860 | 1170×1720 |
| Private Offices, detail | `office-detail.jpg` | Square 1:1 | 340×340 | 680×680 |
| BUILDING TOMORROW'S NOW (full-width background) | `building.jpg` | Horizontal ≈ 3:2 | 1424×1000 | 2880×2000 |
| Our Spaces 1: Meeting room | `meeting-room.jpg` | Horizontal ≈ 3:2 | 780×540 | 1560×1080 |
| Our Spaces 2: Mailroom | `mailroom.jpg` | Vertical 4:5 | 420×540 | 840×1080 |
| Our Spaces 3: Reception | `reception.jpg` | Vertical 3:4 | 460×620 | 920×1240 |
| Our Spaces 4: Lounge | `lounge.jpg` | Horizontal 3:2 | 720×480 | 1440×960 |
| Our Spaces 5: Parking | `parking.jpg` | Horizontal 3:2 | 620×420 | 1240×840 |
| Our Spaces 6: Common area | `common-area.jpg` | Vertical 4:5 | 440×560 | 880×1120 |
| Let's Build The Future Together (full-width background) | `final.jpg` | Horizontal ≈ 5:3 | 1424×860 | 2880×1720 |

## Rules

- Full-width backgrounds (hero, BUILDING TOMORROW'S NOW, final section): horizontal only, full camera resolution.
- In BUILDING TOMORROW'S NOW and the final section the headline sits top-left: keep that area calm (sky, plain wall).
- JPG, PNG or HEIC are all fine; files are compressed for the web afterwards.
- No filters or heavy editing, so all photos match.
- Recognisable people need signed consent. Avoid readable number plates (they will be blurred).

Upload: https://github.com/amanbaevkg/tabs/releases/new?tag=media-v3&target=main&title=BCC%20media%20v3
Only upload what should change; everything else stays as it is.
