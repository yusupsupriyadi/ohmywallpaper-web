# Landing motion pass + gallery marquee directions

## Summary

The gallery marquees now travel outward — top row to the right, bottom row to the left —
and the whole landing page animates with Motion (`motion@13`): a staggered hero entrance,
scroll-triggered reveals per section, parallax on the three screenshots, hover/press
feedback on cards and CTAs, and an animated FAQ accordion.

## Changes

- `package.json`: added `motion@^13.1.0`.
- `src/routes/index.tsx`:
  - `MarqueeRow` takes `direction: "left" | "right"`; the gallery passes `right` to the top
    row and `left` to the bottom row (`marquee-b` / `marquee-a` respectively).
  - Wrapped the page in `<MotionConfig reducedMotion="user">`.
  - `reveal(delay, y)` / `heroRise(delay)` helpers plus `HOVER_LIFT` / `HOVER_PRESS`.
  - New `Screenshot` component: reveal on the image, scroll parallax on a wrapper.
  - Hero staggers logo → badge → h1 → lead → CTAs → note → perf chips on mount.
  - Feature cards, plan rows, FAQ rows and every section intro reveal on scroll.
  - FAQ answers animate height via `AnimatePresence`; the `+` rotates via `animate`.
- `src/styles.css`: dropped the now-unused `rise` keyframe and `.hero-rise` class (Motion
  drives the hero); `mqA`/`mqB`/`breathe` and the reduced-motion block stay.

## Decisions

- `stagger()` is not re-exported from `motion/react` in v13, and `staggerChildren` is gone,
  so group stagger is done with an explicit per-item `delay` instead of parent variants —
  version-proof and one less moving part.
- Parallax lives on a wrapper element and the entrance on the image, so the two never both
  write `y`. Parallax is skipped outright under `useReducedMotion()` because a
  `useTransform` MotionValue is not covered by `MotionConfig`.
- CSS keeps driving the marquees — cheaper than a JS animation for a 24-tile track, and
  already reduced-motion guarded.

## Verification

- `bun run typecheck`: clean
- `bun run build`: built; the routes client chunk is 157 KB raw (Motion included)
- SSR HTML of `/`: top row `marquee-b` (right), bottom row `marquee-a` (left);
  no `hero-rise` left in the output
- Headless render of `/` and `/#gallery` (Playwright, network-idle + 2.5–3 s): hero and
  gallery fully visible, so hydration resolves the `opacity: 0` initial states

## Limitations

- Browser console was not checked — the BrowserOS bridge was unreachable this session, and
  the headless fallback only returns screenshots. `typecheck`/`build` are clean and both
  rendered pages are correct, but a console pass is still owed.
- Motion's `initial` styles are server-rendered, so section content is invisible until
  hydration; with JS disabled the page shows only the marquees and backdrop.
- Motion lands in the shared routes chunk, so `/login` and `/admin` also download it.

## Follow-up

- Confirm the console is clean and the marquee directions read right in the live app.
- If the admin bundle matters, split Motion out with `LazyMotion` + `motion/react-m`.
