# Admin categories settings page

## Summary

Categories live in the database now, but managing them still meant calling the API by
hand. Added an `/admin/categories` page that adds, renames, reorders and deletes them.

## Changes

- `src/routes/admin/categories.tsx`: new page — add form, inline rename, up/down
  reorder, and a delete confirmation dialog. Delete is disabled while a category still
  holds wallpapers, with the reason in the button title.
- `src/routes/admin/route.tsx`: "Categories" entry in the sidebar nav.
- `src/server/admin.ts`: `createCategory`, `updateCategory`, `deleteCategory` server
  functions.

## Decisions

- Reorder swaps `sortOrder` with the neighbour (two PATCHes) instead of renumbering the
  whole list; a guard covers rows that share a value.
- Reused the public `listCategories` loader — the data is identical and already cached
  by the wallpapers page.

## Verification

- `bun run build` (tsc + vite): passes.
- Live on localhost:3001: added "Retro", renamed it to "Retro Wave", moved it above
  Samurai (sort_order 80/90 swapped in the API), then deleted it — list refreshed each
  time. Adding a duplicate "Dark" surfaced the API error in the page.

## Limitations

- No drag-and-drop ordering; the arrows are one step at a time.

## Follow-up

- None.
