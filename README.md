# مستر کباب — Mister Kebab

Persian (RTL) restaurant site built as a **nine-world cinematic scroll experience**:
nine scroll-driven video worlds, each pinned over its own scroll range, handing off to
the next through a scroll-controlled dissolve. The visitor's scroll position sets
`video.currentTime`, so every clip plays forward, reverses and freezes exactly with the
scroll — nothing autoplays or loops.

- `frontend/` — React + Vite, self-hosted Vazirmatn, charcoal/amber design system
- `backend/` — Express + PostgreSQL (menu, settings, testimonials, reservations)

```bash
docker compose -f docker-compose.base44.yml up -d --build
# web: http://localhost:3000   api: http://localhost:8000/api/health
```

See `AGENTS.md` for the world engine, the scrubbing implementation, the all-intra video
re-encodes and the verification commands.
