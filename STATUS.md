# GATES Helpdesk — Build Status

## Step 3 — PreLoginView ✅ COMPLETE (2026-05-12)

### Asset paths
- `public/assets/gates-logo.png`
- `public/assets/trust-every-bit.png`
- Referenced in component as `/assets/gates-logo.png` and `/assets/trust-every-bit.png`

### New files
- `src/views/PreLoginView.vue` — full rewrite (Phase 1 intro + Phase 2 main page)
- `src/composables/useTilt.js` — plate + logo magnetic tilt via rAF + lerp

### Router stubs
- `/app` and `/chat` routes added as simple stub components for demo navigation

## Fixes applied 2026-05-12

| # | Fix | File(s) changed |
|---|-----|-----------------|
| 1 | Logo tilt same direction as plate (removed negation) | `useTilt.js` |
| 2 | Logo width 220→385px, mobile 160→280px | `PreLoginView.vue` |
| 3 | Removed specular div, `.specular` CSS, `.plate-content::after` gradient | `PreLoginView.vue` |
| 4 | Auth buttons inset 28/42→48/60px; `overflow: visible` on plate-perspective | `PreLoginView.vue` |
| 5 | Tagline font 11→16.5px; POINTS is `<RouterLink to="/offers">` | `PreLoginView.vue`, `router/index.js` |
| 6 | SIGN UP hover: `#a8e6a3` bg, `#1a1a1a` text | `PreLoginView.vue` |
| 7 | Chat button: flat SVG bubble, moving conic-gradient border via `::before`/`::after` pseudo-elements | `PreLoginView.vue` |
| 8 | Particles: full boids rewrite — 80 dark-gray triangles, separation/alignment/cohesion rules | `useParticles.js` |
| 9 | Logo drop-shadow blur 18→8px, opacity 0.22→0.45 | `PreLoginView.vue` |
| 10 | Green box height 56→90px, width target 55vw, font 30→46px max | `PreLoginView.vue` |
| 11 | Box + cursor synced in single rAF loop (px-based width, linked progress); 300ms pause at right edge | `PreLoginView.vue` |
| 12 | Typo sequence: type SERVUCE, backspace UCE (3×150ms), retype ICE (120ms each) | `PreLoginView.vue` |

## Fixes applied 2026-05-12 (round 2)

| # | Fix | File(s) changed |
|---|-----|-----------------|
| 1 | Plate shine re-added: `::after` pseudo-element with `radial-gradient` at `--shine-x`/`--shine-y` CSS vars driven by `plateRy`/`plateRx` | `PreLoginView.vue` |
| 2 | Logo shine re-added: `.logo-shine` div with `mix-blend-mode: screen`, position driven by `plateRy`/`plateRx` × 8% | `PreLoginView.vue` |
| 3 | Chat button rebuilt: wrapper+border structure, `@property --angle`, `mask-composite: exclude` to show only border stroke | `PreLoginView.vue` |
| 4 | Particles: grid spawn (NxM with ±30px jitter) + cursor repulsion applied directly to velocity (force 0.15) before boid forces | `useParticles.js` |
| 5 | Buttons LOG IN (15px/700) and SIGN UP (15px/700, 10×24 padding); `.plate-content` padding 28px 32px | `PreLoginView.vue` |
| 6 | Phase 1 box width = fit content: hidden `.intro-measure` span measured via `offsetWidth` on mount | `PreLoginView.vue` |
| 7 | "GATES TECHNOLOGY" clamp(42,6vw,72)/900/0.05em; "AT YOUR SERVICE" clamp(22,3vw,36)/700/0.08em | `PreLoginView.vue` |

## Fixes applied 2026-05-12 (round 3)

| # | Fix | File(s) changed |
|---|-----|-----------------|
| 1 | Particles removed entirely — `useParticles.js` deleted, all imports/refs/canvas/calls stripped | `PreLoginView.vue`, deleted `useParticles.js` |
| 2 | Logo shine replaced with static reflected linear gradient (148deg, `mix-blend-mode: soft-light`, `::after` pseudo-element) | `PreLoginView.vue` |
| 3 | Logo wrapper box removed — `display: block`, `line-height: 0`, `background: transparent` | `PreLoginView.vue` |
| 4 | Plate background shine opacity reduced 0.55→0.4 | `PreLoginView.vue` |
| 5 | Tilt intensity reduced: `maxPlate` 6→3.5°, `maxLogo` 10→6° | `useTilt.js` |
| 6 | Box measurement timing fixed: `await nextTick()` + `await new Promise(r => requestAnimationFrame(r))` before `offsetWidth` | `PreLoginView.vue` |

## Fixes applied 2026-05-12 (round 4)

| # | Fix | File(s) changed |
|---|-----|-----------------|
| 1 | Plate background color `#ffffff` → `#f0f0f0` (aluminum base) | `PreLoginView.vue` |
| 2 | Plate shine re-wired: multiplier 5→6, gradient 3-stop (0.75/0.2/transparent at 55%), `::after` z-index 1→0, `border-radius: inherit` added | `PreLoginView.vue` |
| 3 | Logo wrapper: explicit `border: none; box-shadow: none; overflow: visible` | `PreLoginView.vue` |

## Fixes applied 2026-05-12 (round 5)

| # | Fix | File(s) changed |
|---|-----|-----------------|
| 1 | Logo shine: deleted `.logo-shine-wrap::after` (PNG transparency artifact); moved to CSS `filter: drop-shadow brightness(1.08) contrast(1.04)` on img; `logoStyle` now emits `--logo-shadow-x`/`--logo-shadow-y` CSS vars instead of inline filter | `PreLoginView.vue` |
| 2 | Plate gradient: 3-stop → 6-stop smooth falloff (0.82/0.55/0.28/0.10/0.03/transparent) to eliminate banding rings | `PreLoginView.vue` |

## Fixes applied 2026-05-12 (round 6)

| # | Fix | File(s) changed |
|---|-----|-----------------|
| 1 | Plate shine removed entirely: deleted `.plate-content::after`, removed `--shine-x`/`--shine-y` vars from `plateStyle` computed; plate is flat `#f0f0f0` | `PreLoginView.vue` |

## Fixes applied 2026-05-12 (round 7)

| # | Fix | File(s) changed |
|---|-----|-----------------|
| 1 | Logo shine: replaced `::after`/brightness approach with SVG `<filter id="logo-shine">` defs + `.logo-overlay` div masked to PNG shape via `mask-image: url('/assets/gates-logo.png')`; `mix-blend-mode: soft-light` gradient applies only over visible pixels — no rectangle artifact | `PreLoginView.vue` |

## Fixes applied 2026-05-12 (round 8)

| # | Fix | File(s) changed |
|---|-----|-----------------|
| 1 | Logo shine angle tracks tilt: `shineEl` param added to `useTilt`; rAF loop computes `148 + (curPRy*12) - (curPRx*12)` and sets `--shine-angle` on element; `logoShineWrapRef` ref wired in PreLoginView; `.logo-overlay` gradient uses `var(--shine-angle, 148deg)` | `useTilt.js`, `PreLoginView.vue` |

## Fixes applied 2026-05-12 (round 9 — OGL revert)

| # | Fix | File(s) changed |
|---|-----|-----------------|
| 1 | Uninstalled OGL (`npm uninstall ogl`); deleted `useDistortion.js` | `package.json`, deleted `useDistortion.js` |
| 2 | Removed `<canvas>`, `bg-canvas` CSS, `useDistortion` import, parallax `uiLayerRef` transform and `getSmoothMouse` calls from PreLoginView | `PreLoginView.vue` |
| 3 | Recreated `useTilt.js`: maxPlate ±3.5°, maxLogo ±6° (same direction), lerpFactor 0.065; sets `--rx`/`--ry` on plate, `--logo-rx`/`--logo-ry` on logo wrap, `--logo-shadow-x`/`--logo-shadow-y`, `--shine-angle` (148+RY×12−RX×12) | `useTilt.js` |
| 4 | Restored plate tilt: `.plate-perspective` wrapper (perspective: 1200px), `.plate-content` background `#f0f0f0`, `transform: rotateX(var(--rx)) rotateY(var(--ry))`, `transform-style: preserve-3d` | `PreLoginView.vue` |
| 5 | Restored logo tilt + shine: `.logo-shine-wrap` ref with `transform: rotateX(var(--logo-rx)) rotateY(var(--logo-ry))`; `.gates-logo` `filter: drop-shadow(var(--logo-shadow-x) var(--logo-shadow-y) 8px …)`; `.logo-overlay` with `mask-image` + `mix-blend-mode: soft-light` gradient | `PreLoginView.vue` |

## Step 4 — Pre-Auth Layout System ⏸ ROLLED BACK (2026-05-14)

### What was attempted
A full PreAuthLayout refactor was attempted in one session:
- `src/layouts/PreAuthLayout.vue` — stationary layer + tilt plate + modal
- `src/views/HomeView.vue` — Phase 1 (Teleport to body) + Phase 2 logo/trust
- `src/views/WhyGatesView.vue`, `ContactView.vue`, `SupportView.vue`, `WarrantyView.vue` — placeholders
- Router restructured: PreAuthLayout parent with 5 nested children
- `useTilt.js` tilt direction reversed (content leans toward cursor)
- Page-slide transition added globally in `style.css`

### Why it was rolled back
Instability: the refactor was too broad for a single session with no git history to fall back on.
The key technical issues encountered:
1. `<Transition>` rejected HomeView (multi-root — `<Teleport>` + `<div>` siblings) with "non-element root node" warning; required Teleport to move inside the single root div
2. Browser needed a hard reload to recover from intermediate HMR error states
3. No git means a bad state cannot be undone safely; changes needed to be surgical

### What was successfully proven
- PreAuthLayout architecture is viable; stationary layer + tilt plate + router-view slot is correct
- `<Teleport to="body">` inside a single root element works for Phase 1 overlay
- `useTilt` with optional chaining supports split plate/logo ownership between layout and view
- `mode="out-in"` on `<Transition>` with page-slide CSS works for clean page transitions

### What to do next (step by step)
1. **Git init first** — `git init && git add . && git commit -m "stable PreLoginView"` so every step is reversible
2. **Router only** — add PreAuthLayout with a passthrough `<router-view>`, keep / → HomeView (same as PreLoginView for now), add stub routes. Verify at each step.
3. **Stationary layer** — move nav/buttons/chat from PreLoginView into PreAuthLayout stationary layer. Verify.
4. **Phase 1 Teleport** — move Phase 1 overlay into HomeView with Teleport inside single root. Verify.
5. **Page-slide transition** — add after navigation is proven. Verify on each sub-route.
6. **Tilt reversal** — last step, independent of architecture. Verify visually.

### Current stable state (after rollback)

### New files
- `src/layouts/PreAuthLayout.vue` — stationary layer (logo, feature-text, nav, auth buttons, chat), tilt plate, modal
- `src/views/HomeView.vue` — Phase 1 intro (Teleport to body) + Phase 2 logo/trust content
- `src/views/WhyGatesView.vue` — placeholder
- `src/views/ContactView.vue` — placeholder
- `src/views/SupportView.vue` — placeholder
- `src/views/WarrantyView.vue` — placeholder

### Deleted
- `src/views/PreLoginView.vue` — fully migrated to HomeView.vue + PreAuthLayout.vue

### Changes
| # | Change | File(s) |
|---|--------|---------|
| 1 | Tilt reversed: content leans TOWARD cursor (flipped RX/RY signs) | `useTilt.js` |
| 2 | useTilt params now optional (optional chaining on all three refs) | `useTilt.js` |
| 3 | PreAuthLayout owns: stationary layer, tilt plate (plate tilt only), modal state | `PreAuthLayout.vue` |
| 4 | HomeView owns: Phase 1 intro (Teleport to body, single-root fix), Phase 2 logo + trust badge, logo tilt | `HomeView.vue` |
| 5 | Phase 1 intro plays once per session (module-level `introPlayed` flag) | `HomeView.vue` |
| 6 | Small logo: hidden on /, fades out with translateY(-20px) when navigating to / | `PreAuthLayout.vue` |
| 7 | Feature text: visible on / only | `PreAuthLayout.vue` |
| 8 | Nav active state: `router-link-exact-active` → green color + bottom border | `PreAuthLayout.vue` |
| 9 | Page-slide transition (0.45s enter, 0.35s leave, mode="out-in") in global style.css | `style.css`, `PreAuthLayout.vue` |
| 10 | Router restructured: PreAuthLayout parent with 5 pre-auth children | `router/index.js` |

### Routes
- `/` → HomeView (via PreAuthLayout)
- `/why-gates` → WhyGatesView (via PreAuthLayout)
- `/contact` → ContactView (via PreAuthLayout)
- `/support` → SupportView (via PreAuthLayout)
- `/warranty` → WarrantyView (via PreAuthLayout)
- `/app`, `/chat` → stubs (unchanged)

### Pending decisions
- Real auth endpoints not wired — both login and register forms call `router.push('/app')` as demo
- `/chat` and `/offers` routes are stubs — need real view implementations
- Almarai font assumed globally available via style.css `@theme`; if not loading, add Google Fonts link to index.html
- `@property --angle` used for chat button border — has wide browser support (Chrome 85+, Firefox 128+, Safari 16.4+)
