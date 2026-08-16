# Hide the testimonials section on the landing page

## Summary

The reviews/testimonials section on `/` is hidden for now. Its quotes are still the
placeholder copy carried over from the design file, so it is gated behind a flag rather
than deleted — the markup stays intact and comes back by flipping one boolean once real
quotes exist.

## Changes

- `src/routes/index.tsx`: added `SHOW_REVIEWS = false` next to the marquee constants and
  wrapped the `#reviews` section in it.

## Decisions

- Flag instead of deletion: the follow-up in the landing-page redesign report is to swap
  in real quotes, so throwing away the marquee, glass cards and speed tuning would just
  mean rebuilding them later.
- No spacing fix needed: the section carried its own `pt-[130px]` and the FAQ that follows
  has the same, so the pricing → FAQ gap is unchanged.
- Nav and footer never linked to `#reviews`, so no dead anchors were left behind.

## Verification

- `bun run typecheck`: clean
- `bun run build`: built, no new warnings
- Built bundles grepped for "What people are saying": 0 hits (the section is dead-code
  eliminated); "Questions? Answered." still present, so the FAQ below it survived

## Limitations

- Not seen in a browser — the dev server on port 3001 was not running at the time.

## Follow-up

- Set `SHOW_REVIEWS` back to `true` once real reviews replace the `QUOTES` placeholders.
