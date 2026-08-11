# Landing page redesign from Claude Design

## Summary

Replaced the landing page wholesale with the `OhMyWallpaper Landing.dc.html` design
imported from the Claude Design project (`021b7e61-…`) via the DesignSync MCP: aurora
backdrop, floating glass pill nav, Gabarito/Figtree pairing, app screenshots, two
gallery marquees, glass feature and review cards, a free-tier pricing card, and an
accordion FAQ.

## Changes

- `src/routes/index.tsx`: full rewrite of the landing route to match the design.
- `src/routes/__root.tsx`: Gabarito + Figtree webfont links, `theme-color` → `#050505`.
- `src/styles.css`: `--font-display` / `--font-body` tokens, `mqA`/`mqB`/`rise`/`breathe`
  keyframes, and `.marquee-a|b` / `.hero-rise` / `.hero-glow` classes with a
  `prefers-reduced-motion` opt-out.
- `public/landing/`: `app-home.webp`, `app-explore.webp`, `desktop-demo.webp`,
  `logo-320.png`, `logo-96.png` — generated with sharp from the screenshots the design
  project was built on (`~/Downloads/ohmywallpaper_*.png`, `logo_ohmywallpaper.png`).

## Decisions

- Gallery marquees render the catalog's **featured** wallpapers (live API data) instead of
  the design's static `w0x`/`c0x` tiles. The loader asks for 24 and the list is split down
  the middle — 12 in the top row, 12 in the bottom — so the two rows never share a piece.
  Short of 24 each row repeats its half in whole laps, keeping the duplicated track wider
  than the viewport without placing a wallpaper next to a copy of itself; under four
  featured a half would be one repeating tile, so both rows take the whole list.
- `/featured` capped its featured query at 6 rows, so the marquees could only ever show 3
  per row even with 27 wallpapers flagged featured. The endpoint now takes an optional
  `limit` (clamped to 48) and **still defaults to 6**, leaving the desktop app's home
  screen — the other consumer of that route — untouched.
- Screenshots ship as WebP (86q) — 229/67/361 KB instead of 2.0/0.9/6.2 MB PNG.
- The design's animation keyframes live in `styles.css` as classes rather than inline
  styles, so `prefers-reduced-motion` can switch them all off in one place.
- Wrapper uses `overflow-x: clip` rather than `hidden`: `hidden` would make the wrapper a
  scroll container and break the sticky nav.
- The aurora backdrop and Figtree body font are scoped to the landing wrapper, not `body`,
  so `/login` and `/admin` keep the existing Fluent-dark look.
- Dropped the old live-stats section — the new design has no equivalent slot.

## Verification

- `bun run typecheck`: clean
- `bun run build`: built, no warnings
- Running dev app at `http://localhost:3001`: hero, demo, screens, gallery, features,
  pricing, reviews, FAQ and footer all render; no console errors; `scrollWidth` 1286 vs
  `innerWidth` 1296 (no horizontal overflow)
- SSR HTML of `/`: 48 marquee tiles — 24 per row, 12 unique each, 0 overlap between rows
- `GET /featured` still returns 6 featured (desktop app unchanged); `?limit=24` returns 24,
  all `featured=true`; `?limit=999` clamps and returns the 27 that exist

## Limitations

- Testimonials are placeholder copy carried over from the design file, not real reviews.
- Only checked at desktop widths in the live browser; the narrow-viewport layout relies on
  the `md:` nav collapse and `minmax(min(…,100%),1fr)` grids rather than a measured pass.
- Every download CTA is still an in-page anchor — there is no installer to link to yet.

## Follow-up

- Swap the testimonials for real quotes (or drop the section) before launch.
- Point the download CTAs at the installer once `nsis`/`msi` artifacts are published.
