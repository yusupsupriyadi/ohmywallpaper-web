# Landing download CTAs link the real installer

## Summary

All four "Download" CTAs were placeholder anchors (#download / #top) — nothing
was ever downloadable. They now point at the published 0.1.1 NSIS installer on R2.

## Changes

- `src/routes/index.tsx`: added `DOWNLOAD_URL` constant
  (https://pub-2ed10c13accd4b438e42f7672ea46d01.r2.dev/releases/ohmywallpaper_0.1.1_x64-setup.exe),
  wired nav, hero, pricing-card and final CTA to it; hero copy "42 MB installer" -> "2 MB installer"

## Decisions

- Direct R2 public URL (same host the wallpapers already use) instead of an app
  domain proxy route — keeps it simple; revisit if download counting is wanted.
- New releases need a new `releases/<version>` object + DOWNLOAD_URL bump (the
  object is cached immutable, so the URL must change per version).

## Verification

- `bun run typecheck` + `bun run build`: pass
- Production HTML contains 4 links to the installer; HEAD on the URL: 200,
  application/octet-stream, attachment disposition, 2110806 bytes

## Limitations

- Click-through not tested in a real browser; verified via HTML + HTTP headers.

## Follow-up

- none
