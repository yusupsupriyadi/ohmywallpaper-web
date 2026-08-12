# Landing page: Wallpoet headings and the real Rust logo

## Summary

Matches the desktop app's title font (Wallpoet) on the landing page headings, and
replaces the stand-in gear glyph on the "Built on Rust" pill with the actual Rust logo.

## Changes

- `src/styles.css`: added a `--font-title` theme token (Wallpoet → Gabarito → system) alongside the existing `--font-display`.
- `src/routes/__root.tsx`: added `family=Wallpoet` to the existing Google Fonts stylesheet link.
- `src/routes/index.tsx`:
  - `font-title` + `font-normal` on the nav brand, the hero `h1`, the shared `H2` section-heading constant (7 uses) and the closing CTA heading.
  - `GearGlyph` → `RustGlyph`: the official Rust logo path, `fill="currentColor"`, default size 14.

## Decisions

- Wallpoet is scoped to headings only. Feature-card `h3` (16px), the "4K" badge glyph and the 62px stat number stay on Gabarito — Wallpoet is a stencil face and gets noisy on dense, repeated small text. This mirrors the app, where card titles stayed on the body font.
- Headings dropped `font-semibold` for `font-normal` and loosened tracking from -0.032/-0.035em to -0.01em: Wallpoet ships a single 400 weight, and its glyphs are already blocky and wide, so the old Gabarito tracking read as cramped.
- Hero clamp reduced 46-88px → 42-80px and the CTA 38-68px → 36-62px, because Wallpoet is materially wider than Gabarito at the same size.
- Glyph uses `currentColor`, not the source SVG's `#fff`, so it takes the pill's `#ffd0b8` text tint the way `WindowsGlyph` does.
- Font loading stays on the Google Fonts CDN here, matching the existing Gabarito/Figtree link. (The desktop app self-hosts instead, because its CSP only allows `font-src 'self'`.)
- One commit rather than two: both edits land in `index.tsx` and this environment has no interactive `git add -p` to split the hunks safely.

## Verification

- `bun run typecheck` (tsc --noEmit): passed.
- `grep GearGlyph src`: no remaining references.
- Rendered `http://localhost:3001` in headless Chromium: nav brand and hero `h1` render in Wallpoet.
- Rendered the pill standalone at its real 13px/14px sizes from the path data read back out of `index.tsx`: the Rust gear-and-R mark renders in the pill's warm tint.

## Limitations

- The section `H2`s and CTA heading were not seen rendered — they sit below the fold and the screenshot tool cannot scroll or clip, so only the hero was captured. Worth a scroll-through.
- At 14px the Rust logo is dense; 16px would read more clearly if it looks tight in the running page.

## Follow-up

- none
