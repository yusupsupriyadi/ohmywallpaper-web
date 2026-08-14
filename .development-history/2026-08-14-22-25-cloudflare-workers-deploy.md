# Deploy web to Cloudflare Workers

## Summary

The TanStack Start app now builds for and deploys to Cloudflare Workers, live at
https://ohmywallpaper.ystudio.my.id. SSR server functions call the public edge API
at https://api.ohmywallpaper.ystudio.my.id (see ohmywallpaper-api/worker).

## Changes

- `vite.config.ts`: added `cloudflare({ viteEnvironment: { name: 'ssr' } })` plugin
- `wrangler.jsonc`: worker `ohmywallpaper-web`, main @tanstack/react-start/server-entry, nodejs_compat, custom domain, var API_BASE_URL
- `src/server/api.ts`: API base read per request (`apiBase()`), required on Workers
- `package.json`: added `deploy` script; devDeps @cloudflare/vite-plugin + wrangler
- `.gitignore`: ignore .dev.vars (local dev keeps API_BASE_URL=http://localhost:3000)

## Decisions

- Production API_BASE_URL lives in wrangler.jsonc `vars`; `.dev.vars` overrides it locally so `vite dev` keeps hitting the local Bun API.

## Verification

- `bun run typecheck` and `bun run build`: pass
- Production page returns 200 with fully SSR-rendered gallery (R2 thumbnails present)

## Limitations

- /admin on the production domain cannot work: the edge API serves only public endpoints. Admin remains a local-dev tool.
- `vite dev` now runs the SSR environment in workerd via the Cloudflare plugin; local dev flow not re-tested here (dev stack is user-owned).

## Follow-up

- none
