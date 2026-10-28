# AGENTS.md — مستر کباب (Mister Kebab)

Persian (RTL) restaurant site built as a **nine-world cinematic scroll experience**:
every one of the nine video worlds is scrubbed by its own section's scroll position
(`video.currentTime = progress × duration`) and hands off to the next world through a
scroll-driven dissolve. React + Vite (frontend) · Express + PostgreSQL (backend).

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

## The nine worlds — one engine, nine configurations

`frontend/src/components/cinema/ScrollVideoSection.jsx` is the only place the scroll
experience is implemented. Each home section is one instance with its own props:

```jsx
<ScrollVideoSection
  id="craft" index={4} name="هنر آتش"          // anchor + chapter numeral/label
  src="/videos/charcoal-grilling.mp4"
  mobileSrc="/videos/charcoal-grilling-mobile.mp4"
  poster="/images/grill.webp"
  travel="215vh"                                // minimum pinned scroll distance
  veil="deep" transition="warm" focus="50% 55%"
  eyebrow title text actions meta               // the copy, always real HTML
>
  {/* optional blocks that scroll over the pinned film */}
</ScrollVideoSection>
```

| # | id | video | travel | layout | transition |
| --- | --- | --- | --- | --- | --- |
| 01 | `hero` | `hero-kebab.mp4` (+`-mobile`) | 240vh | `stage` | `warm` |
| 02 | `menu` | `signature-dishes.mp4` | 165vh | `flow` | `warm` |
| 03 | `story` | `restaurant-interior.mp4` | 190vh | `flow` | `dissolve` |
| 04 | `craft` | `charcoal-grilling.mp4` | 215vh | `flow` | `warm` |
| 05 | `gallery` | `serving-food.mp4` | 180vh | `flow` | `dissolve` |
| 06 | `experience` | `persian-hospitality.mp4` | 190vh | `flow` | `warm` |
| 07 | `reviews` | `testimonials-background.mp4` | 160vh | `flow` | `veil` |
| 08 | `reservation` | `reservation-cta.mp4` | 175vh | `flow` | `dissolve` |
| 09 | `closing` | `footer-closing.mp4` | 160vh | `stage` | `dissolve` |

### Geometry

```html
<section class="world">            <!-- min-height: var(--world-travel) + 100svh -->
  <div class="world__stage">        <!-- position: sticky; top: 0; height: 100svh -->
      video · veil · glow · bridge · vignette · chapter rail
      copy                            (layout="stage" only)
  </div>
  <div class="world__flow">         <!-- margin-top: -100svh -->
      copy                            (layout="flow" — enters exactly as the stage pins)
      content blocks                  (cards, forms, galleries)
  </div>
</section>
```

- The stage is pinned for `section.offsetHeight - stage.offsetHeight`, i.e. `travel`,
  measured live on resize/`ResizeObserver`. Tall content simply lengthens the world.
- `layout="flow"` keeps the copy and the interactive content in normal flow, so nothing
  is ever clipped and every button/form stays usable; it scrolls over the pinned film.
- **Never** put `overflow: hidden` on `.world` or an ancestor — sticky dies.
- Never nest one world inside another; nine sibling sticky stages are fine, nesting is
  not.

### Scrubbing (`frontend/src/lib/useScrollVideoScrub.js`)

```
progress = clamp((scrollY - sectionTop) / travel, 0, 1)
section.style.setProperty('--world-progress', progress)
video.currentTime = progress * video.duration        // clamped just inside the tail
```

- **Never** `play()` / `pause()` — the frame is a pure function of scroll, so the same
  scroll position always reproduces the same frame, forwards and backwards.
- One rAF loop, only while an `IntersectionObserver` says the section is on screen;
  the loop stops (and the frame holds) as soon as the world leaves.
- Progress is published on the **section**, not the stage, because the copy that
  scrolls over the stage reads the same number.
- One controller per `<video>` (module-level `WeakMap`), so StrictMode double mounts or
  a remount cannot create a second animation instance.
- `loadedmetadata` → duration + geometry, `loadeddata`/`canplay`/`seeked` → ready state
  and the freshest queued seek, `error` → poster fallback (the `<video>` unmounts).
- Seeks smaller than `0.012 s` are skipped (~⅓ frame at 24fps) and the CSS variable is
  only rewritten when it actually moved.

### Choreography is CSS, not JavaScript

Everything else is derived from `--world-progress` in `styles/world.css`:

| variable | meaning |
| --- | --- |
| `--in` / `--out` | scene arrives over the first ~6 % and dissolves over the last ~9 % |
| `--t1 … --t6` | copy steps: chapter → eyebrow → headline → text → actions → meta |
| `--p` | the raw progress (chapter rail, hero scroll cue) |

Because they are pure functions of one number, scrolling back reverses the whole
sequence exactly, and no React re-render happens while scrolling.

`.world__bridge` is the dark curtain between worlds (opaque while a world is
off-stage, gone while it plays); `.world__glow` is the warm bloom that spills out of
the incoming world. Both are driven by `--in`/`--out`, so two neighbouring worlds are
never brightly visible at the same time — at the exact handoff the outgoing scene is
at 0 and the incoming at 0, which is the dissolve.

`data-transition` picks the curtain's colour/shape (`dissolve` | `warm` | `veil`);
`data-entrance="instant"` (the hero) starts with the first frame and copy already up.

### Loading, decoding and mobile

- Only the hero is eager. Every other world attaches its source when it comes within
  ~1.3 viewports (`IntersectionObserver` + a geometry check that rejects hits reported
  while the page is still laying out). Typically the hero plus two neighbours are alive.
- `≤900px` gets the `-mobile.mp4` (960px wide) re-encode, chosen at mount time.
- `prefers-reduced-motion: reduce` or `saveData`/2G → `world--static`: no sticky stage,
  no travel, poster only, all copy visible in normal flow. The hook's `scrubEnabled`
  is false, so no controller is mounted at all.

### Video files

Every file in `frontend/public/videos` is re-encoded with a keyframe every 4 frames
(`-g 4`), no audio, `+faststart`. The uploaded originals have a **single** keyframe for
the whole clip, so every seek decoded from frame 0 and scrubbing lagged badly. Do not
replace them with normally encoded files or different footage. Regenerate with:

```bash
ffmpeg -i original.mp4 -an -c:v libx264 -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 \
  -crf 26 -preset medium -movflags +faststart out.mp4
ffmpeg -i original.mp4 -an -vf scale=960:-2 -c:v libx264 -g 4 -keyint_min 4 \
  -sc_threshold 0 -bf 0 -crf 29 -preset medium -movflags +faststart out-mobile.mp4
```

Posters are the matching `frontend/public/images/*.webp`; `hero-poster.webp` is
preloaded in `index.html`.

### Entering a world from a link

A pinned world's top edge is the charcoal handoff, so `lib/scroll.js` →
`scrollToSection(id)` lands ~18 % into the world's travel (frame up, copy revealed).
`RouteEffects` in `App.jsx` uses it for every `#hash` navigation, and the hero CTAs use
it for their in-page jumps. Keep it in sync if the travel values change a lot.

## Things that are easy to get wrong

- **Images and videos are local.** Everything is in `frontend/public/images` and
  `frontend/public/videos`; never hotlink the CDN.
- **Demo data.** Prices, phone, address and testimonials are template values; replace
  them in `backend/src/seed-data.js` before showing this as a real restaurant. The
  reviews world shows an empty state when the API returns no testimonials — never
  invent quotes or ratings.
- **Phone links** go through `telHref()` in `lib/site.js`, which converts the Persian
  digits of the configured number into a usable `tel:` href.
- **Reservation validation** lives on the server (`PHONE_RE`, guests 1–20, date/time
  format); the form only renders returned `fields` errors.
- **Host allowlist:** `vite.config.js` appends `.<BASE44_SANDBOX_HOST_DOMAIN>` only
  when `BASE44_PREVIEW_MODE === '1'`.
- `html { scroll-behavior: smooth }` means programmatic `window.scrollTo(y)` animates;
  when measuring scrub behaviour, set `document.documentElement.style.scrollBehavior =
  'auto'` first or the sampled `currentTime` corresponds to an intermediate position.

## Verify

```bash
curl -s localhost:3000/api/health                 # {"ok":true}
curl -s localhost:3000/api/menu | head -c 200     # seeded menu
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/menu   # 200 via SPA fallback
docker compose -f docker-compose.base44.yml exec -T web npx vite build
```

Scrub check in the preview browser (frame is a pure function of scroll, `paused` always
true — do this for any world, they all behave the same):

```js
document.documentElement.style.scrollBehavior = 'auto';
const w = document.querySelector('[data-world="4"]');
const stage = w.querySelector('.world__stage');
const top = w.getBoundingClientRect().top + scrollY;
const travel = w.offsetHeight - stage.offsetHeight;
scrollTo(0, top + travel * 0.5);
// after a frame or two:
w.style.getPropertyValue('--world-progress');      // ≈ 0.5
w.querySelector('video').currentTime;              // ≈ 0.5 × duration
w.querySelector('video').paused;                   // true
```

Handoff check (outgoing dissolved, incoming not yet up, no double exposure):

```js
const next = document.querySelector('[data-world="5"]');
scrollTo(0, next.getBoundingClientRect().top + scrollY);
// previous world --world-progress === 1 (scene opacity 0), next === 0
```

Reservation round trip (creates a row — delete it afterwards):

```bash
curl -s -X POST localhost:3000/api/reservations -H 'Content-Type: application/json' \
  -d '{"full_name":"تست","phone":"09123456789","guests":2,"reserved_for":"2026-11-01","reserved_time":"20:00"}'
docker compose -f docker-compose.base44.yml exec -T db psql -U misterkebab -d misterkebab \
  -c "DELETE FROM reservations WHERE full_name='تست';"
```
