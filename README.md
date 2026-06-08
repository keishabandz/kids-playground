# Kids Playground

A free, ad-free, mobile-first playground for preschoolers — built so a child can
trace letters and watch them come alive. No accounts, no ads, no tracking, no
data collection.

**Status:** M1 vertical slice — letter **A** tracing, fully playable. The rest of
the alphabet, a "letter zoo," and more activities are on the roadmap.

## What it does (today)

- Tap the big tile to start.
- Trace the dotted letter **A** with a finger (forgiving — there's no way to lose).
- On completion the letter sprouts a face and does a little jig.
- Each letter has its **own ordered set of reward personalities** (googly-dance,
  silly-tongue, star-bounce…) that cycle predictably, so a child can anticipate
  "the A ones."

## Tech

Vite · React · TypeScript · Tailwind · Vitest · installable PWA. Pure client-side;
deploys as static files (Vercel).

## Develop

```bash
npm install
npm run dev            # local dev server
npm run dev -- --host  # also expose on your LAN to test on a phone/tablet
npm test               # unit tests (geometry, trace state, personality cursor)
npm run build          # production build
npm run preview        # serve the production build locally
```

## Project docs

- [Design spec](docs/superpowers/specs/2026-06-08-letter-tracing-design.md)
- [M1 implementation plan](docs/superpowers/plans/2026-06-08-letter-tracing-m1-vertical-slice.md)
- [AI collaboration & diligence statement](docs/DILIGENCE.md)

## A note on how this was built

This project was built collaboratively with AI assistance and reviewed by a
human who takes full responsibility for it. See [docs/DILIGENCE.md](docs/DILIGENCE.md).
