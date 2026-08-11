# Category editor: cover, accent, tagline

## Summary

Extended the categories page from a name/order list into the place where a category's
whole look is set — cover art, accent colour and tagline — so none of it lives in code.

## Changes

- `src/routes/admin/categories.tsx`: rows now show the resolved cover, an accent tint
  and the tagline; a new edit dialog holds name, tagline, accent (colour well + hex +
  "Pick from cover" + "Use app default") and a cover picker built from that category's
  own wallpapers, with a live preview of how the app will render it.
- `src/server/admin.ts`: `CategoryPatch` type, extended `updateCategory`, and
  `autoAccent` for the derive-a-colour action.
- `src/lib/types.ts`: `Category` gains description, accent, cover fields.

## Decisions

- "Auto" stays a first-class cover choice rather than a hidden default, and rows carry
  an `auto cover` badge — an auto cover follows the category's most popular wallpaper,
  so it keeps itself current.
- The accent preview passes the *pending* cover selection, so the button reflects what
  the editor is looking at instead of what is saved.

## Verification

- `bun run build` (tsc + vite): passes.
- Live on localhost:3001: opened Nature, set a tagline, picked "Green Valley" as cover,
  derived the accent (`#5c1fd6` -> `#3888d8`, then `#5caeea` after the API's algorithm
  fix), saved, and confirmed all three fields in `GET /categories`.

## Limitations

- The cover picker shows the first page of a category's wallpapers (20), not all of them.

## Follow-up

- None.
