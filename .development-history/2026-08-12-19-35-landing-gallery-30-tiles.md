# Landing gallery: 15 tiles per row

## Summary

The landing gallery's two marquee rows showed 12 unique wallpapers each (24 total).
Raised to 15 per row, 30 total.

## Changes

- `src/routes/index.tsx`: `GALLERY_ROW_TILES` 12 → 15; split comment updated.
- `src/server/public.ts`: showcase loader asks `/featured?limit=30` instead of 24.

## Decisions

- Kept the existing halve-the-list split, so the top row still never shares a
  wallpaper with the bottom row.
- No API change needed: `/featured` already clamps `limit` at 48.

## Verification

- `GET /featured?limit=30` on the running api: 30 items, 30 unique ids → rowA 15, rowB 15
- `bun run typecheck`: clean
- `bun run build`: built successfully

## Limitations

- Rows fill to 15 each only while the catalog has ≥30 featured wallpapers (currently
  exactly 30). Below that, `marqueeLap` repeats each half in whole laps as before.
- Not viewed in the browser; verified via the API response and build.

## Follow-up

- none
