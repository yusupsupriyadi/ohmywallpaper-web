# ohmywallpaper-web

Landing page and superadmin console for [OhMyWallpaper](https://github.com/yusupsupriyadi/ohmywallpaper) — this is **not** a web version of the desktop app; it is the marketing site plus the content-management panel for the wallpaper catalog.

Stack: [TanStack Start](https://tanstack.com/start) (React 19, SSR, server functions), Tailwind CSS v4, [HugeIcons](https://hugeicons.com), Bun.

## Pages

- `/` — landing page (hero, features, live gallery pulled from the catalog API, download section)
- `/login` — superadmin sign-in (email + password); not linked from the landing page
- `/admin` — dashboard (stats, category breakdown, recent uploads)
- `/admin/wallpapers` — catalog table: search, filters, inline featured toggle, edit, delete, and an Upload dialog (image or video; dimensions, duration, and a 640px thumbnail are extracted in the browser before upload)

## How it talks to the backend

All data access goes through TanStack Start **server functions** that proxy [ohmywallpaper-api](https://github.com/yusupsupriyadi/ohmywallpaper-api):

- Login exchanges email/password at `POST /admin/login` for the admin bearer token, stored in an `httpOnly` cookie — the token never reaches the browser.
- Admin CRUD forwards to `/admin/*` with that bearer token; the landing gallery reads the public `/featured` endpoint and degrades gracefully when the API is offline.

## Development

```powershell
# 1. run the API first (port 3000) — see ohmywallpaper-api
# 2. then:
bun install
bun run dev        # http://localhost:3001
```

Superadmin accounts are created in the API repo: `bun run create-admin <email> <password>`.

## Checks

```powershell
bun run typecheck  # tsc --noEmit
bun run build      # vite build (client + SSR server)
```

Set `API_BASE_URL` (see `.env.example`) when the API is not on `http://localhost:3000`.
