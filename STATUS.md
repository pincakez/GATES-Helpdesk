# GATES-CARE — Status

**Last updated: 2026-05-16**

---

## Current state: Phase 1 frontend — App Shell built, pre-auth routes stable

---

## Pre-login (Phase 0 — COMPLETE ✅)

- Phase 1 intro: fake cursor → green box → typewriter with typo correction
- Phase 2: white background, logo with dynamic shine + drop shadow, perspective tilt toward cursor
- `useTilt.js`: ±3.5° plate, ±6° logo, lerp 0.065, leans TOWARD cursor
- `pauseAndCenter()` / `resume()` wired to AuthModal open/close via window custom events

**Committed:** `stable v3` (d90b022), `stable v4` (ce8b6ad)

---

## Pre-auth layout (Steps 3.5A–3.5E — COMPLETE ✅)

- `PreAuthLayout.vue` — stationary overlay (nav + auth buttons + chat CTA) shown on non-home routes
- Router: PreAuthLayout parent, PreLoginView / WhyGatesView / ContactView as children
- `<KeepAlive include="PreLoginView">` — home intro does not replay on back-navigation
- Entrance animations: nav/buttons slide from top, taglines/trust badge slide from bottom
- `WhyGatesView` + `ContactView`: tilt plate pages, nav wired to `router.push()`
- Active nav indicator syncs on `onActivated` (KeepAlive hook)

**Still pending in pre-auth:**
- ⬜ 3.5F — Page-slide transition (horizontal slide + fade on `<router-view>`)
- ⬜ 3.5D — Small logo in PreAuthLayout top-left (hidden on `/`, visible on other routes)
- ⬜ 3.5G — Small logo fade on route change
- ⬜ 3.5H — Final visual check

---

## AuthModal (COMPLETE ✅)

5-state glass modal: login → register → forgot → reset → welcome.
English strings. Arabic pass is a future dedicated session.
"Access My Dashboard" → `router.push('/app')`.

---

## App Shell (Steps 4A–4E — COMPLETE ✅)

`src/layouts/AppShellLayout.vue`

**Topbar:**
- Search bar (left)
- My Profile link with User icon + label (right)
- Sign Out button with confirmation modal
- User avatar initials (right)

**Left sidebar:**
- Lucide icons: Ticket, MessageCircle, Mail, Tag, Shield, Star, Gift
- Centered nav items (justify-content: center)
- Collapses to 62px icons-only: toggle at bottom with ChevronsLeft / ChevronsRight
- "G" mini placeholder shown when collapsed (real asset pending)
- Auto-collapses at < 1100px via CSS, hidden at < 768px (hamburger drawer)
- My Profile removed from sidebar — lives in topbar
- No hover color change on active item

**Right Sara chat panel (480px):**
- Sara header: gradient avatar, online dot, name + Arabic subtitle
- Chat messages: Arabic AI bubbles (left) + user bubbles (right, green)
- Thinking indicator: animated CSS dots
- Input: Arabic placeholder, dir="auto", Enter to send
- Always visible — not hidden at any breakpoint (essential feature)
- Box shadow on left edge separates from main content

**Font:** Inter (app shell UI) · Almarai (chat bubbles, Arabic text)
**Icons:** `lucide-vue-next`

**Routes under `/app`:**
tickets · live-chat · inbox · offers · warranty · loyalty · benefits · profile
All currently show stub views (page name centered). Real views = Step 5+.

---

## Next steps (in order)

1. ⬜ Admin panel concept review (concept uploaded, pending audit for Redis/infra requirements)
2. ⬜ 3.5F — Pre-auth page-slide transition
3. ⬜ 3.5D/G — Small logo in PreAuthLayout with fade on route change
4. ⬜ Arabic language pass — AuthModal full RTL translation
5. ⬜ Step 5 — Chat UI (real views: ChatView, bubbles, Sara header, comparison tables)
6. ⬜ Step 6 — Gemini API integration
7. ⬜ Step 7 — Product data + function calling
8. ⬜ Step 8 — Ticket submission
9. ⬜ Step 9 — System status banner
10. ⬜ Step 10 — Toast component
11. ⬜ Step 11 — Arabic language pass (all views)
12. ⬜ Step 12 — Polish pass

---

## Known pending design assets

- Mini GATES logo PNG for collapsed sidebar
- Sara persona photo (professional avatar)
- Real product images + SKUs (12+ products)
- Confirmed brand green hex (`#4CAF50` pre-login vs `#166534` app shell — needs decision)
- Customer service phone number
- WHY GATES? and CONTACT US page content
- Admin panel concept — under review before adding to roadmap

---

## Rollback notes

- Step 3.5 was once attempted all-at-once and rolled back. Key lesson: `<Transition>` rejects multi-root components. Fix: single root `<div>` with `<Teleport to="body">` for modals.
- Logo overlay `mix-blend-mode: soft-light` + parent `filter:drop-shadow` = compositing conflict. Fix: rim light on separate `<img>` element placed before shine-wrap in DOM.
