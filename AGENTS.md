# AGENTS.md — مستر کباب (Mister Kebab)

Persian (RTL) restaurant site with a scroll-scrubbed cinematic hero.
React + Vite (frontend) · Express + PostgreSQL (backend) · Docker Compose.

## Run

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Web entry point: **host port 3000** (Vite dev server on 5173 inside the container).
- API: host port 8000, also proxied through Vite at `/api`, so the browser only ever
  talks to one origin.
- `db` (postgres:16-alpine) → `migrate` (one-shot schema + seed) → `api` → `web`.
- Source is bind-mounted; both app services run watchers (`node --watch`, Vite HMR).
  `node_modules` lives in a named volume, hydrated by `npm install` at container start.

## Content lives in the database

| Table | Edited in | Notes |
| --- | --- | --- |
| `site_settings` | `backend/src/seed-data.js` → `settings` | contact, hours, brand |
| `menu_categories` | `…/seed-data.js` → `categories` | 4 categories, order via `sort_order` |
| `dishes` | `…/seed-data.js` → `dishes` | `is_available=false` renders «امشب تمام شد» |
| `testimonials` | `…/seed-data.js` → `testimonials` | replaced as a set on every seed |
| `reservations` | runtime | written by `POST /api/reservations`; never touched by the seed |

Apply content edits with:

```bash
docker compose -f docker-compose.base44.yml run --rm migrate
```

The seed is idempotent (`ON CONFLICT (slug) DO UPDATE`) and never drops `reservations`.

## Hero: real scroll-driven video scrubbing

`frontend/src/lib/useScrollVideoScrub.js` drives the hero:

```
progress = clamp((scrollY - sectionTop) / travel, 0, 1)
video.currentTime = progress * video.duration        // clamped just inside the tail
```

- **Never** `play()` / `pause()` for the hero — the frame is a pure function of scroll.
- One rAF loop, and only while an `IntersectionObserver` says the section is on screen.
- One controller per `<video>` (module-level `WeakMap` guard), so StrictMode double
  mounts or a remount cannot create a second animation instance.
- `loadedmetadata` → duration + geometry, `loadeddata`/`canplay`/`seeked` → ready
  state and freshest queued seek, `error` → poster fallback (video unmounts).
- Geometry re-measured on `resize`, `orientationchange`, and a `ResizeObserver` on
  the section/stage. Cleanup removes listeners, observers, rAF and the controller.
- Skips seeks smaller than `0.012 s` (roughly a third of a 24fps frame) so scrolling
  does not queue duplicate timestamp assignments.

`frontend/src/components/home/Hero.jsx` holds the markup.
`frontend/src/styles/sections.css` → `.hero--scrub` is the tall container
(`--hero-stage-h` + `--hero-travel`, 280vh desktop / 210vh ≤900px) with a
`position: sticky` stage at `top: 0` and `height: 100svh`. **Keep `overflow` visible
on `.hero--scrub` or sticky stops working.**

### The hero video files are special

`frontend/public/videos/hero-kebab.mp4` and `hero-kebab-mobile.mp4` are re-encodes of
the uploaded `hero_kebab.mp4` with a keyframe every 4 frames (`-g 4`). The original
has **one** keyframe for the whole 10 s clip, so every seek decoded from frame 0 and
scrubbing lagged badly. Do not replace them with a normally encoded file, and do not
replace them with different footage. Regenerate with:

```bash
ffmpeg -i hero_kebab.mp4 -an -c:v libx264 -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 \
  -crf 24 -preset medium -movflags +faststart hero-kebab.mp4
ffmpeg -i hero_kebab.mp4 -an -vf scale=960:-2 -c:v libx264 -g 4 -keyint_min 4 \
  -sc_threshold 0 -bf 0 -crf 26 -preset medium -movflags +faststart hero-kebab-mobile.mp4
```

`hero-poster.webp` is the first frame and is preloaded in `index.html`; it is also
what the visitor sees when metadata has not arrived yet, when the connection is
save-data/2G, or when the video errors.

### Fallbacks

- `prefers-reduced-motion: reduce` → `.hero--static`: no sticky stage, no travel,
  poster only (the hook never mounts a controller). Live OS changes are honoured.
- `saveData` or 2G → same static hero.
- Video error → `data-video-state="failed"`, the `<video>` unmounts and the poster
  stays with the full copy and CTAs.
- `≤900px` → the 960px-wide re-encode and a bottom-anchored gradient/`object-position`.

## The other eight videos are ordinary background videos

`frontend/src/components/ui/BackgroundVideo.jsx` lazy-attaches the source once the
section is ~280px away, plays muted+looped while in view and pauses off screen.
`play()` is retried from `canplay` because a play request issued before media data
is rejected. `serving-food`, `persian-hospitality`, `signature-dishes`,
`charcoal-grilling`, `testimonials-background`, `reservation-cta` and
`footer-closing` all use this. **Do not add scrubbing to them.**

## Things that are easy to get wrong

- **Images and videos are local.** Everything is in `frontend/public/images` and
  `frontend/public/videos`; never hotlink the CDN.
- **Demo data.** Prices, phone, address and testimonials are template values; replace
  them in `backend/src/seed-data.js` before showing this as a real restaurant.
- **Reservation validation** lives on the server (`PHONE_RE`, guests 1–20, date/time
  format); the form only renders returned `fields` errors.
- **Host allowlist:** `vite.config.js` appends `.<BASE44_SANDBOX_HOST_DOMAIN>` only
  when `BASE44_PREVIEW_MODE === '1'`.
- `html { scroll-behavior: smooth }` means programmatic `window.scrollTo(y)` animates;
  when measuring scrub behaviour, wait for the scroll to settle or the sampled
  `currentTime` will correspond to an intermediate position.

## Verify

```bash
curl -s localhost:3000/api/health                 # {"ok":true}
curl -s localhost:3000/api/menu | head -c 200     # seeded menu
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/menu   # 200 via SPA fallback
docker compose -f docker-compose.base44.yml exec -T web npx vite build
```

Scrub check in the preview browser (`video.currentTime` ≈ progress × duration,
`video.paused` always true):

```js
document.querySelector('.hero').dataset.videoState;   // "ready"
const v = document.querySelector('[data-testid="hero-video"]');
window.scrollTo(0, 1120); v.currentTime;              // ≈ half of v.duration on a 800px viewport
```

Reservation round trip (creates a row — delete it afterwards):

```bash
curl -s -X POST localhost:3000/api/reservations -H 'Content-Type: application/json' \
  -d '{"full_name":"تست","phone":"09123456789","guests":2,"reserved_for":"2026-11-01","reserved_time":"20:00"}'
docker compose -f docker-compose.base44.yml exec -T db psql -U misterkebab -d misterkebab \
  -c "DELETE FROM reservations WHERE full_name='تست';"
```
