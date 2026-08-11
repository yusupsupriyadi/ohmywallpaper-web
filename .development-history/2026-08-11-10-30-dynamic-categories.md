# Read categories from the API instead of a constant

## Summary

The admin console had its own copy of the six category names. It now loads the list
from the API's new `GET /categories`, so categories added in the database (Dark,
Samurai) show up without a redeploy.

## Changes

- `src/lib/types.ts`: dropped the `CATEGORIES` constant and the `Category` union; added
  a `Category` row interface (`id`, `name`, `sortOrder`, `count`).
- `src/server/public.ts`: `listCategories()` server function over `GET /categories`.
- `src/routes/admin/wallpapers.tsx`: loader fetches list + categories in parallel; filter
  chips, the upload dialog and the edit dialog all render from the loaded rows.

## Decisions

- Fetched in the existing route loader rather than a separate client request, so the
  chips and the dialogs render server-side with the wallpaper list.

## Verification

- `bun run build` (tsc + vite): passes.
- API `GET /categories` returns 8 rows; the page consumes that shape.

## Limitations

- UI verification of the chips/dropdown in the running web app was not done.

## Follow-up

- None.
