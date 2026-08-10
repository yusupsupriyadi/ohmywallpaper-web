# Initial web implementation (landing + superadmin console)

## Summary

Built ohmywallpaper-web from scratch: TanStack Start (React 19, SSR) + Tailwind v4 + HugeIcons. Landing page markets the desktop app with live catalog data; /admin is a superadmin console for managing wallpaper content in ohmywallpaper-api.

## Changes

- `src/routes/index.tsx`: landing (hero + collage, 6 feature cards, gallery from /featured, download section); renders fine with the API offline.
- `src/routes/login.tsx`: email+password sign-in.
- `src/routes/admin/*`: guarded layout (beforeLoad session check), dashboard (stats/categories/recent), wallpapers table (search, kind/category filters, featured toggle, edit dialog, delete dialog, pagination), upload page (drag-drop, client-side probe + 640px canvas thumbnail for images AND videos).
- `src/server/*`: server functions proxying the API; admin bearer token lives in an httpOnly cookie (`session.server.ts`) — never shipped to the browser.
- `src/styles.css`: Tailwind theme tokens matching the desktop app (#101113 ink, #4c8dff accent).

## Decisions

- All API access via server functions (no CORS needed on the API; token stays server-side).
- Thumbnails and media metadata are extracted in the browser (Image/video element + canvas), so the API needs no ffmpeg.
- Server-only cookie helpers isolated in `session.server.ts` — TanStack Start import protection rejects them in client-reachable exports.

## Verification

- `bun run typecheck` + `bun run build`: clean.
- Browser E2E on real servers: login (bad password rejected 401, good → dashboard), guard (signed-out /admin/wallpapers redirects to /login), upload E2E (2560×1440 JPEG → probe → R2 200 public + DB row), edit (rename persisted), delete (DB row gone, R2 objects 404), landing screenshot verified.

## Limitations

- Dev port 3001; API must run on 3000 (or set API_BASE_URL).
- Upload streams through the web server before hitting R2 (fine locally; consider presigned uploads if deployed).

## Follow-up

- Deploy (needs R2 S3 credentials instead of wrangler OAuth for the API), rate-limit /admin/login.
