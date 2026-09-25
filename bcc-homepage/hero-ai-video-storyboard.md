# BCC Concept 1: AI hero video storyboard (from existing photos)

Target: 18 s, horizontal 16:9, 1920×1080 (or 3840×2160), muted, seamless loop behind the hero title and the workspace selector.
Source: `bcc_photo3.zip` and `bcc_photo2.zip`. `bcc_photo1.zip` is empty.

## Storyboard (6 shots)

| # | Photo | Time | Camera | Tool | Why this photo |
|---|---|---|---|---|---|
| 1 | `Accueil (2).jpg`: reception with mail shelves, BCC tenant board, staircase | 0:00–0:03 | Slow dolly forward toward the staircase | Kling (or Veo) | The arrival moment. It shows the real building: tenant board with the BCC logo and Cloud Power, mail service, depth to the staircase. |
| 2 | `bureau C.01.JPG`: bright shared office, BCC logo on the window | 0:03–0:06.5 | Slow sideways track, left → right, with parallax | Kling (or Veo) | The strongest photo in the set: high resolution, bright, furnished, BCC branding. Also use it as the **poster frame**. |
| 3 | `bureau2 (3).jpg`: private office, desk and chair, BCC window | 0:06.5–0:09.5 | Very subtle push-in toward the window | **Depth parallax, not generative** (low resolution) | The only real private office shot with depth and branding. It is only 1051 px wide, so it must be upscaled first. |
| 4 | `bureau C.02 (2).jpg`: row of white desks with acoustic dividers | 0:09.5–0:12.5 | Slow dolly forward along the desks | Kling | Clean lines and strong perspective, so forward movement looks natural. |
| 5 | `Cuisine (2).JPG`: long black table leading to the table football | 0:12.5–0:15.5 | Slow dolly forward along the table | Kling (or Veo) | Symmetrical and graphic, it shows the community side (kitchen/common room). |
| 6 | `bureau C.02.jpg`: desks with the BCC roll-up banner | 0:15.5–0:18 | Slow sideways track, right → left | Kling | A brand close that mirrors shot 2's movement and crossfades back into shot 1. |

Crossfade between shots: 0.5 s. Loop: the last 0.8 s of shot 6 crossfades into the first frame of shot 1.

Not selected:
- `bureau B.09/B.10`: packaging and boards on the floor.
- `Accueil.JPG`: weak waiting corner.
- `bureau2 (1)/(2)`: 800–1080 px, strong wide-angle distortion. `bureau2 (1)` is the backup for shot 3.
- `Cuisine.JPG`: counter clutter.
- Facade collage: 432 px.
- Totem sign photo: vertical, low resolution, outdoor light that doesn't match.

## Prepare the photos first (important)
1. **Straighten** vertical lines and **crop to 16:9** before uploading, so the AI never has to invent missing picture areas. Crops I checked:
   - C.01: upper part, keeping the window logo.
   - Cuisine (2): upper part, keeping the table football.
   - Accueil (2): middle band.
2. **Colour-match** all six: neutral white balance, the same contrast. `bureau2 (3)` is warm and heavily edited, so neutralise it.
3. **Upscale** `bureau2 (3)` 3× (Topaz Gigapixel, or Magnific in precision mode with low creativity).
4. Optional cleanup: cables and a bin only. Never change furniture, logos or architecture.
5. Export each photo as a 1920×1080 (or 3840×2160) JPG.

## Prompts

Add this to every prompt:
> Photorealistic, real camera footage, 24 fps, natural soft daylight, smooth and steady motion. Keep the room exactly as in the image: same architecture, walls, windows, floor, furniture, colours, signs and logos. The scene is empty and still; only the camera moves.

Negative prompt (every shot):
> people, person, hands, silhouettes, animals, new objects, objects appearing or disappearing, moving furniture, opening doors, text changes, warped letters, logo distortion, morphing, melting, bending walls, perspective distortion, flicker, light strobing, lens flare, fast motion, zoom burst, camera shake, handheld, fisheye, motion blur, low resolution, CGI look, cartoon, oversaturated colours

**Shot 1: Accueil (2)**
> Slow cinematic dolly forward through the reception hall of an office building, moving gently toward the staircase at the back. The white mail shelves on the left and the black tenant directory board stay perfectly sharp and unchanged. Very slow constant speed, eye-level camera, calm and premium.

**Shot 2: bureau C.01**
> Slow lateral tracking shot from left to right across a bright shared office, camera at desk height. Subtle parallax between the black leather office chairs in the foreground and the windows in the background. The BCC logo on the window stays unchanged and readable. Calm, architectural, premium.

**Shot 3: bureau2 (3)** (only if you use AI instead of depth parallax)
> Very subtle slow push-in toward the large window with the BCC logo in a private office. The white desk and the black office chair stay perfectly still. Soft daylight through the frosted glass. Minimal, steady movement.

**Shot 4: bureau C.02 (2)**
> Slow dolly forward along a row of white desks with grey acoustic dividers and black leather office chairs, camera gliding at seated eye height. Everything stays still; only the camera moves. Clean, bright, quiet workspace.

**Shot 5: Cuisine (2)**
> Slow dolly forward along a long black table with black chairs on both sides, toward the table-football game at the end of the room. Symmetrical composition, gentle constant speed, soft daylight on the light grey floor.

**Shot 6: bureau C.02 (banner)**
> Slow lateral tracking shot from right to left past white desks and black office chairs, the BCC roll-up banner in the background. Subtle parallax, calm and steady. The banner text and logo stay unchanged.

## Generation settings
- Image-to-video, 5 s clips, 1080p, 16:9, prompt adherence/relevance high, motion or creativity low.
- Camera control: use the tool's preset (push-in / dolly forward, or horizontal truck) at the lowest strength.
- Generate 3–4 variations per shot and keep the best 3 s from the middle of the clip.
- Check every clip frame by frame for warped letters on the tenant board, window logos and banner.

## Edit and export
- Use DaVinci Resolve (free) or Premiere: a 1920×1080, 25 fps timeline, 0.5 s crossfades, one shared colour grade, and optional 1–2 % film grain to unify the shots.
- **Loop:** end with a crossfade into shot 1's first frame, and start the file at that same frame.
- **Export:** H.264 MP4, no audio track, 6–8 Mbps, ideally under 10 MB, plus a WebM (VP9) copy and a poster JPG from shot 2.
