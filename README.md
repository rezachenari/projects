# مستر کباب — Mister Kebab

Persian (RTL) restaurant site with a **true scroll-driven video hero**: the visitor's
scroll position sets `video.currentTime`, so the cinematic opening plays forward,
reverses and freezes exactly with the scroll — it never autoplays or loops.

- `frontend/` — React + Vite, self-hosted Vazirmatn, charcoal/amber design system
- `backend/` — Express + PostgreSQL (menu, settings, testimonials, reservations)

```bash
docker compose -f docker-compose.base44.yml up -d --build
# web: http://localhost:3000   api: http://localhost:8000/api/health
```

See `AGENTS.md` for the scrubbing implementation, the all-intra video re-encodes and
the verification commands.
