# Admin wallpapers: featured filter

## Summary

The admin wallpapers page could toggle a wallpaper's featured flag but not filter by
it. Added a featured chip group (Any status / Featured / Not featured) alongside the
existing kind and category filters, backed by a `featured` search param.

## Changes

- `src/routes/admin/wallpapers.tsx`: `Filters.featured?: boolean`, parsed in
  `validateSearch`, forwarded from the loader, and rendered as three `FilterChip`s
  between the kind and category groups.
- `src/server/admin.ts`: `listWallpapers` now forwards `featured` when it is defined
  instead of only when truthy, so `false` reaches the API.

## Decisions

- `validateSearch` accepts both `"true"`/`"false"` strings and real booleans — the URL
  carries a raw string on a cold load and a boolean once the router round-trips it.
- Filtering happens on the API (`?featured=`), not client-side, so pagination and the
  "N items match" count stay correct.

## Verification

- `bun run typecheck`: clean
- `bun run build`: built successfully
- API filter itself verified against the running api (see the api repo's report):
  169 total = 29 featured + 140 not featured

## Limitations

- The chips were not exercised in the browser; verified through typecheck/build and the
  underlying API responses.

## Follow-up

- none
