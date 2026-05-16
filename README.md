# GATES Helpdesk

Vue 3 + Vite + Tailwind v4 · Frontend SPA · Phase 1 in progress

## Run

```
npm install
npm run dev
```

Opens at **http://localhost:5173/**

## Stack

- Vue 3 (`<script setup>`), Vue Router 4, Pinia (minimal use)
- Tailwind v4, Inter (app shell), Almarai (customer-facing / Arabic)
- `lucide-vue-next` for icons
- No backend yet — Phase 2 (Node.js + Fastify on AWS t3.small)

## Source structure

```
src/
  layouts/
    PreAuthLayout.vue     — wrapper for /, /why-gates, /contact (nav + auth buttons + chat CTA)
    AppShellLayout.vue    — post-login shell: sidebar + topbar + Sara chat panel
  views/
    PreLoginView.vue      — two-phase pre-login page (intro animation + tilt plate)
    WhyGatesView.vue      — placeholder, tilt plate
    ContactView.vue       — placeholder, tilt plate
  components/
    AuthModal.vue         — 5-state glass modal (login / register / forgot / reset / welcome)
  composables/
    useTilt.js            — rAF lerp tilt: plate ±3.5°, logo ±6°, shine angle
  router/
    index.js              — all routes
  style.css               — Tailwind + Almarai font vars

public/assets/
  gates-logo.png
  trust-every-bit.png
```

## Routes

| Path | Layout | View |
|------|--------|------|
| `/` | PreAuthLayout | PreLoginView |
| `/why-gates` | PreAuthLayout | WhyGatesView |
| `/contact` | PreAuthLayout | ContactView |
| `/app/*` | AppShellLayout | stub views (tickets, live-chat, inbox, offers, warranty, loyalty, benefits, profile) |

## Pre-login page (Phase 0 — complete)

**Phase 1 — Intro animation**
- Fake cursor → draws green box → typewriter "GATES TECHNOLOGY" / "AT YOUR SERVICE" with typo correction

**Phase 2 — Main page**
- White background, GATES logo centered with dynamic shine overlay + drop shadow
- Plate + logo tilt toward cursor via `useTilt.js` (perspective 1200px, lerp 0.065)
- Logo rim light pulse on entry
- Top-center nav · top-left taglines · top-right LOG IN / SIGN UP · bottom-left trust badge · bottom-right chat button

## AuthModal (complete)

5-state morphing glass modal. English strings (Arabic pass is a future step).

| State | Notes |
|-------|-------|
| login | identifier + password, links to forgot / register |
| register | full name, WhatsApp, alt phone, city (27 EG cities), email optional |
| forgot | EG phone → OTP → 60s resend timer |
| reset | new + confirm password, min 8 chars |
| welcome | language picker (Arabic default), Access My Dashboard → `/app` |

- Egyptian phone validation: `010/011/012/015`, 11 digits, `+20`/`0020` normalised
- No outside-click dismiss. Plate lerps to center on open.

## App shell (Phase 1 — in progress)

- Fixed topbar: search bar + My Profile link + Sign Out (confirmation modal) + avatar
- Left sidebar: collapsible (icons-only at < 1100px, hidden at < 768px). Lucide icons per nav item.
- Right Sara chat panel: 480px, always visible, Arabic AI chat with typing indicator
- Font: Inter for shell UI, Almarai for Arabic chat content

## Pending design decisions

- Mini GATES logo asset for collapsed sidebar state
- Content for WHY GATES? and CONTACT US pages
- Sara persona photo (professional avatar)
- Real product images and SKUs
- Confirmed brand green hex (currently `#4CAF50` pre-login, `#166534` app shell)
- Customer service phone number
- Admin panel design (concept under review)
