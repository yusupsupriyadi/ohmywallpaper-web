# Landing gallery: shuffle order per load

## Summary

The gallery marquees always showed the featured wallpapers in the API's popularity
order, so every visit looked identical. The showcase loader now shuffles them, giving
each page load a different layout.

## Changes

- `src/server/public.ts`: added a Fisher-Yates `shuffle` helper; `getShowcase` returns
  `featured` shuffled.
- `src/routes/index.tsx`: split comment notes the list arrives pre-shuffled.

## Decisions

- Shuffled in the server function, not during render. The loader result is what gets
  serialized into the SSR payload, so a `Math.random()` in the component would give the
  client a different order than the server-rendered markup and break hydration.
- `picks` and `stats` are untouched — only the gallery rows are randomized.

## Verification

- Three `GET http://localhost:3001/` against the running dev server: 108 image refs each
  time, first six wallpaper ids different on every load
- `bun run typecheck`: clean
- `bun run build`: built successfully

## Limitations

- "Per load", not per React render — the order is stable while the page is open, which
  is what the marquee needs (a reshuffle mid-scroll would make tiles jump).
- Behind a full-page CDN cache the order would be fixed per cached response.

## Follow-up

- none
