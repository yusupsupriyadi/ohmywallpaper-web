# Brand logo/favicon from logo.png

## Summary

Replaced the placeholder gradient-star mark with the supplied `logo.png` on the marketing/admin site,
so web and desktop app share one brand mark.

## Changes

- `public/logo.png`: 256px downscale of the source logo (repo root `logo.png`).
- `public/favicon.png`: 64px downscale; `public/favicon.svg` deleted (old placeholder mark).
- `src/components/Logo.tsx`: inline SVG badge replaced by `<img src="/logo.png">` sized by the
  existing `size` prop; `Wordmark` unchanged.
- `src/routes/__root.tsx`: favicon link switched to `/favicon.png`, added `apple-touch-icon`.

## Decisions

- Kept the `Logo`/`Wordmark` API identical so all 7 call sites (landing, login, admin shell) need
  no change.

## Verification

- `bun run build`: client + SSR bundles built, no errors.
- `grep favicon.svg`: no remaining references.

## Limitations

- Not opened in a browser; rendering verified only via a successful build and the identical component API.

## Follow-up

- none
