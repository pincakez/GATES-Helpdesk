# GATES Helpdesk

Vue 3 + Vite + Tailwind v4. No backend. Demo-only SPA.
Run: `npm run dev` → localhost:5173

## Stack
- Vue 3 (`<script setup>`), Vue Router 4, Pinia (minimal)
- No new npm packages unless the task explicitly says so

## Files that matter
```
src/views/PreLoginView.vue    — entire pre-login page (Phase 1 intro + Phase 2 tilt)
src/composables/useTilt.js    — rAF lerp tilt effect
src/router/index.js           — routes
src/style.css                 — global styles, Tailwind import, Almarai font
public/assets/gates-logo.png  — transparent PNG logo
public/assets/trust-every-bit.png
```

## Animation rules
- All animation: `requestAnimationFrame` only. No `setInterval`.
- `mousemove` → update JS vars only. rAF loop reads them, updates DOM.
- Lerp: `val += (target - val) * 0.065` per frame.
- On unmount: `cancelAnimationFrame` + `removeEventListener`.

## CSS rules
- `@property` rules → unscoped `<style>` block (not `<style scoped>`).
- Never `dir="rtl"` — always `dir="auto"` on content containers.
- Logo PNG is transparent — never add `background` to its wrapper. Use `mask-image` for overlays.

## Brand
- Gates green: `#4CAF50` · Charcoal: `#2d2d2d` · Plate bg: `#f0f0f0`
- Font: Almarai everywhere (customer-facing). Customer site: Arabic RTL. Admin: English LTR.

## useTilt.js behaviour
- Tilt: content leans TOWARD cursor. ±3.5deg plate, ±6deg logo.
- Sets `--rx`/`--ry` on plate, `--logo-rx`/`--logo-ry` on logo wrap.
- Sets `--logo-shadow-x`/`--logo-shadow-y` and `--shine-angle` (148 + RY×12 − RX×12).

## Workflow rules
- One logical change per session. Commit before moving to the next.
- Read every file you will touch before writing a single line.
- See STATUS.md for current state and next step.
- Full history and roadmap: docs/HANDOVER.md, docs/PLAN.md
