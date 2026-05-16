# GATES-CARE — Status

## Current state: Phase 0 COMPLETE — Phase 1 frontend in progress

PreLoginView.vue is stable and committed. Two-phase page:
- Phase 1: fake cursor → draws green box → typewriter "GATES TECHNOLOGY" / "AT YOUR SERVICE" (typo sequence) → fade into Phase 2
- Phase 2: aluminum plate (`#f0f0f0`), tilt toward cursor via useTilt.js, logo with dynamic shine + shadow, feature text, LOG IN / SIGN UP buttons, modal (Arabic RTL, stubs to `/app`), Chat with Us button (rotating gradient border)

useTilt.js: ±3.5deg plate, ±6deg logo, lerp 0.065, leans TOWARD cursor.

Budget approved. Building real product — no demo framing.
AI: Gemini API Free Tier (dev/testing). Server: AWS t3.small (Phase 2).
See TODO.md for full roadmap.

## Next step: Step 3.5 — Pre-Auth Layout System

One sub-step per session. Do NOT combine steps.

- ✅ **3.5A** — `src/layouts/PreAuthLayout.vue` created. Nav, LOG IN/SIGN UP, Chat with Us, small logo placeholder, modal via Teleport. Not wired to router yet.
- **3.5B** — Update router: PreAuthLayout as parent for `/`, nest PreLoginView under it. Move modal trigger. Commit.
- **3.5C** — Move stationary elements (LOG IN, SIGN UP, Chat with Us, nav) out of PreLoginView into PreAuthLayout. Commit.
- **3.5D** — Add small logo to PreAuthLayout (80px, hidden on `/`). Commit.
- **3.5E** — Add 4 placeholder views (WhyGates, Contact, Support, Warranty) + routes. Commit.
- **3.5F** — Page-slide transition (`<Transition mode="out-in">`). Commit.
- **3.5G** — Small logo fade in/out behavior on route change. Commit.

## Known rollback lesson
Step 3.5 was attempted all-at-once and rolled back. Key issue: `<Transition>` rejects multi-root components. Fix: `<Teleport to="body">` must be inside a single root `<div>`, not a sibling root node.
