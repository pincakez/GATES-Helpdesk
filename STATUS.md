# GATES-CARE — Status

## Current state: Phase 0 COMPLETE — Phase 1 frontend in progress

PreLoginView.vue is stable and committed. Two-phase page:
- Phase 1: fake cursor → draws green box → typewriter "GATES TECHNOLOGY" / "AT YOUR SERVICE" (typo sequence) → fade into Phase 2
- Phase 2: aluminum plate (`#f0f0f0`), tilt toward cursor via useTilt.js, logo with dynamic shine + shadow, feature text, LOG IN / SIGN UP buttons, Chat with Us button (rotating gradient border)

useTilt.js: ±3.5deg plate, ±6deg logo, lerp 0.065, leans TOWARD cursor.
New: `pauseAndCenter()` — sets target to 0,0 so plate lerps to center; `resume()` resumes cursor tracking.

Budget approved. Building real product — no demo framing.
AI: Gemini API Free Tier (dev/testing). Server: AWS t3.small (Phase 2).
See TODO.md for full roadmap.

## AuthModal — BUILT ✅ (src/components/AuthModal.vue)

5-state morphing glass modal. English for now — Arabic pass is a future step.

| State | Trigger | Notes |
|-------|---------|-------|
| login | LOG IN / SIGN UP buttons | identifier + password, links to forgot/register |
| register | "New User?" in login | 5 fields, phone validation, email optional, morphs to welcome on success |
| forgot | "Forgot your password?" in login | EG phone → Send OTP → 60s resend timer |
| reset | After OTP verified | new + confirm password, min 8 chars |
| welcome | After register success | language picker (Arabic default), Access My Dashboard |

Key rules baked in:
- Egyptian phone validation: `010/011/012/015` prefix, 11 digits, `+20` prefix normalised
- Phone carries from login → register/forgot only if valid EG number
- Email optional in register; if filled must be valid format
- No outside-click dismiss — X button only
- Plate lerps to center on open, resumes on close

## Next step: Step 3.5B — Wire router

One sub-step per session. Do NOT combine steps.

- ✅ **3.5A** — `src/layouts/PreAuthLayout.vue` created
- ✅ **AuthModal** — 5-state glass modal built, wired into PreLoginView + PreAuthLayout
- ✅ **3.5B** — Router wired. PreAuthLayout is parent, PreLoginView is child.
- **3.5C** ← NEXT — Remove duplicate nav/buttons/chat from PreLoginView (UI is currently doubled)
- **3.5E** — Add WhyGatesView + ContactView placeholder pages + routes, wire nav clicks
- **3.5F** — Page-slide transition (horizontal slide + fade)
- **3.5D** — Small logo (needs routes to exist first)
- **3.5G** — Small logo fade on route change
- **3.5H** — Final visual check

## Known rollback lesson
Step 3.5 was attempted all-at-once and rolled back. Key issue: `<Transition>` rejects multi-root components. Fix: `<Teleport to="body">` must be inside a single root `<div>`, not a sibling root node.

## Design decisions locked this session

**Nav — 4 items (was 5):**
HOME · WHY GATES? · CONTACT US · YOUR WARRANTY AND SUPPORT

**Page designs:**
- WHY GATES? → tilt plate page, no centered logo, no taglines block
- CONTACT US → same as WHY GATES?
- YOUR WARRANTY AND SUPPORT → modal overlay (not a route), triggered from nav

**Page transition:** slide from left + fade, smooth ease-in-out (horizontal, not vertical)

**AuthModal language:** English now, Arabic pass later (all strings to be translated in one dedicated session)
