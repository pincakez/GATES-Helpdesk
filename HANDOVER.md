# GATES Helpdesk — Claude Code Handover
> Read this fully before touching any file. This is your only source of truth.

---

## 1. What This Project Is

An AI-powered helpdesk SPA for **GATES Technology** — a tech product retailer in Port Said, Egypt (laptops, peripherals, accessories).

**Two zones, one codebase:**
- **Welcome Zone** — pre-login marketing pages with visual effects
- **Helpdesk Zone** — post-login support interface (clean, functional, like Claude.ai or Gemini UI)

**Current phase: Phase 0 — Demo only.**
No backend. No real auth. No database. Frontend only.
Goal: impress a decision-maker enough to approve budget for Phase 1 (real build).
Demo is deployed to Vercel. Gemini API key is the only real external dependency.

**Owner:** Yakot — R&D Freelancer at GATES Technology. Vibe coder. Does not write code manually.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | Vue 3 + Vite | Vue 3.x, Vite 5.x |
| Styling | Tailwind CSS | v4 |
| Routing | Vue Router | v4 |
| State | Pinia | (installed, minimal use in demo) |
| Font | Almarai (Google Fonts) | loaded globally |
| AI | Gemini API + Function Calling | free tier |
| Deployment | Vercel | free tier |

**Non-negotiable stack rules (do not violate):**
- No Redis. Ever.
- No email/SMTP. Ever.
- No MCP. Gemini Function Calling handles all AI tool use.
- One codebase for customer site and admin panel.
- No new npm packages without explicit instruction.

---

## 3. Project Location

```
D:\GATESGCARE\gates-helpdesk\
```

Run with: `npm run dev` → `localhost:5173`

---

## 4. Current File Structure

```
gates-helpdesk/
├── public/
│   └── assets/
│       ├── gates-logo.png        ← transparent PNG, GATES Technology logo
│       └── trust-every-bit.png   ← "TRUST EVERY BIT." lockup image
├── src/
│   ├── assets/
│   │   └── main.css              ← global styles, Tailwind import, Almarai font
│   ├── composables/
│   │   └── useTilt.js            ← tilt effect logic (see Section 6)
│   ├── views/
│   │   └── PreLoginView.vue      ← the entire welcome home page (Phase 1 + Phase 2)
│   ├── router/
│   │   └── index.js              ← single route: / → PreLoginView.vue
│   ├── App.vue
│   └── main.js
├── STATUS.md                     ← always update after each session
├── HANDOVER.md                   ← this file
├── PLAN.md                       ← roadmap
├── vite.config.js
├── package.json
└── tailwind.config.js
```

---

## 5. What Is Built and Working

### PreLoginView.vue — Two-phase pre-login page

**Phase 1 — Intro animation sequence (plays on mount):**
1. Fake macOS-style cursor div enters from bottom-center of viewport
2. Cursor moves to top-left corner of future green box (eased, ~600ms)
3. Cursor switches to crosshair shape
4. Green box expands left-to-right — cursor tracks right edge in sync (ONE rAF loop drives both)
5. Four Figma-style transform handles appear at corners, then fade out slowly (800ms)
6. Cursor exits screen
7. Typewriter: "GATES TECHNOLOGY" types out (~80ms/char) with blinking cursor
8. Typewriter line 2 inside green box: types "AT YOUR SERVUCE" (intentional typo)
9. Pauses 800ms, backspaces U+C+E (150ms each), retypes "ICE"
10. Blinking cursor blinks 3 times, stops
11. 800ms pause
12. Fade out (400ms) + zoom scale 0.95→1.0 into Phase 2

**Phase 2 — Main pre-login page:**
- Aluminum plate feel: `background: #f0f0f0`, perspective tilt via useTilt.js
- Tilt: content leans TOWARD cursor (not away) — ±3.5deg max, lerp 0.065
- Logo: gates-logo.png centered, ~385px wide, tilts with plate ±6deg same direction
- Logo shine: animated diagonal reflected gradient (148deg base, rotates with tilt via --shine-angle CSS var)
- Logo shadow: CSS drop-shadow, dynamic offset from tilt vars, sharp (8px blur, 0.45 opacity)
- Logo overlay div uses mask-image: url('/assets/gates-logo.png') so shine follows PNG transparency — no visible rectangle
- Top-left: feature text (3 lines, uppercase, small, "POINTS" is green)
- Top-right: LOG IN (text button) + SIGN UP (black pill button)
- Bottom-left: trust-every-bit.png
- Bottom-right: "Chat with us" button with animated rotating gradient border (conic-gradient, @property --angle)
- Modal: opens on LOG IN / SIGN UP click, Arabic RTL, Almarai font, two tabs (login/register), both stub to router.push('/app') for demo

**useTilt.js:**
- Tracks mousemove → updates targetRX, targetRY
- rAF loop lerps currentRX/RY toward target (factor 0.065)
- Sets CSS vars: --rx, --ry on plate wrapper
- Sets --logo-rx, --logo-ry on logo wrapper (same direction as plate)
- Sets --logo-shadow-x, --logo-shadow-y (calculated from tilt)
- Sets --shine-angle = 148 + (currentRY * 12) - (currentRX * 12)
- Cleans up on unmount: cancelAnimationFrame, removeEventListener

---

## 6. Brand Constants

```css
--gates-green: #4CAF50
--charcoal: #2d2d2d
--black: #1a1a1a
--white: #ffffff
--plate-bg: #f0f0f0
```

- Font: Almarai everywhere on customer-facing pages
- Customer site: Arabic RTL by default
- Admin panel: English LTR
- `dir="auto"` on ALL user content containers — never hardcode `dir="rtl"`

---

## 7. What Was Attempted and Rolled Back

### Attempt 1 — OGL WebGL barrel distortion background
**What:** Replaced the aluminum plate with a circuit-board PNG (`circuit-bg.png`) distorted by a WebGL fragment shader using OGL library. Mouse moved a gravity-well distortion across the image.
**Why rolled back:** The distortion looked "wobbly" and unstable — not the polished effect intended. Visual result was poor.
**Lesson:** OGL/WebGL is available as an option but needs very careful shader tuning. Not worth the risk for the demo phase.

### Attempt 2 — PreAuthLayout.vue refactor with multi-page routing
**What:** Tried to extract stationary elements (nav, buttons) into a PreAuthLayout.vue wrapper, add 4 new pre-login pages (Why Gates, Contact, Support, Warranty), add page slide transitions, and wire small logo show/hide logic.
**Why rolled back:** Too many things changed simultaneously. Multiple bugs appeared — routing broke, tilt stopped working, modal lost its trigger context. 
**Lesson:** This refactor is the right direction but must be done one file at a time, one commit per change. Do not attempt in a single session.

---

## 8. Critical Rules for Claude Code

1. **One logical change per session. Commit before moving to the next.**
2. **Read every file you will touch before writing a single line.**
3. **No new npm packages** unless PLAN.md explicitly lists one for that step.
4. **All animation loops use requestAnimationFrame only.** No setInterval. No raw mousemove DOM updates.
5. **mousemove updates JS variables only.** rAF loop reads them and updates DOM.
6. **Lerp pattern:** `val += (target - val) * 0.065` per frame.
7. **On unmount:** cancel all rAF loops, remove all event listeners.
8. **Vue SFC pattern:** `<script setup>`, composables for logic >60 lines.
9. **@property CSS rules** do not work in `<style scoped>`. Put them in a global CSS file or an unscoped `<style>` block.
10. **Never hardcode `dir="rtl"`** on content containers. Always `dir="auto"`.
11. **Logo PNG is transparent.** Do not add background-color to its wrapper. Use mask-image technique for overlays.
12. **Always update STATUS.md after every session.**
13. **Never ask for confirmation mid-task.** Complete the full scoped task then stop.
