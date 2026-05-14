# GATES Helpdesk — Pre-Login UI

Vue 3 + Vite project. Currently implements the pre-login landing page with a two-phase intro animation.

## How to run

```
npm install
npm run dev
```

Opens at **http://localhost:5173/**

## Current state (2026-05-14)

Single route `/` → `PreLoginView.vue`. The page runs a two-phase sequence:

**Phase 1 — Intro animation**
- Fake cursor enters from bottom-center
- Draws a green box left-to-right with handle anchors
- Typewriter writes "GATES TECHNOLOGY" then "AT YOUR SERVICE" (with deliberate typo + backspace correction)
- Fades out into Phase 2

**Phase 2 — Main page**
- Tilt plate (`#f0f0f0` aluminum background) tracks cursor with ±3.5° lerp at 0.065 factor
- GATES logo centered with extra tilt (±6°) and dynamic shine overlay
- Top-left: feature taglines
- Top-right: LOG IN / SIGN UP buttons → modal with login + register forms
- Bottom-left: trust-every-bit badge
- Bottom-right: animated conic-gradient chat button

## Assets
- `public/assets/gates-logo.png`
- `public/assets/trust-every-bit.png`

## Source structure

```
src/
  composables/
    useTilt.js          — rAF + lerp tilt for plate, logo, shine
  views/
    PreLoginView.vue    — Phase 1 + Phase 2, modal
  router/
    index.js            — / → PreLoginView, /app /chat /offers stubs
  App.vue               — <RouterView /> only
  main.js
  style.css             — Tailwind + Almarai font vars
```

## Stub routes
- `/app` — placeholder (post-login shell, not implemented)
- `/chat` — placeholder
- `/offers` — placeholder

## Next step
Init git, then implement `PreAuthLayout.vue` refactor step-by-step.
See `STATUS.md` for the full rollback notes and step-by-step plan.
