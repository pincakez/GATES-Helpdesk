# GATES-CARE — Status

**Last updated: 2026-05-16**

---

## Current state

**Phase 1 — Customer frontend** is in active development. Pre-login + app shell complete. Real chat UI + Gemini integration + admin panel still ahead.

The admin panel concept (uploaded in `/admin`) has been audited. All features approved with edits — folded into the remastered TODO.md.

---

## ✅ Completed

### Phase 0 — Pre-Login Page
- Two-phase intro animation (typewriter + tilt)
- `useTilt.js` plate + logo tilt with pause/resume

### Phase 1 — Customer Frontend (partial)
- AuthModal (5-state glass modal, English)
- PreAuthLayout + WhyGatesView + ContactView (Steps 3.5A–3.5E)
- AppShellLayout (Steps 4A–4E): sidebar (collapsible, lucide icons) + topbar (search + profile + sign-out modal) + Sara chat panel (480px, always visible)
- KeepAlive so home intro doesn't replay
- Inter font for shell, Almarai for Arabic chat content
- `lucide-vue-next` integrated

**Committed:** `stable v5` (b19ffee)

---

## 🔄 In Progress / Up Next

1. **Pre-auth polish** — 3.5F (page-slide transition), 3.5D/G (small logo)
2. **Step 5** — Real chat UI (ChatView, bubbles, Sara header, thinking indicator, comparison table)
3. **Step 6** — Gemini service via `aiClient.js` (provider-aware: Gemini default, Claude/OpenAI/Local LLM swappable)
4. **Step 7** — Product data + function calling
5. **Step 8** — Ticket submission
6. **Steps 9–12** — Status banner · toast · Arabic pass · polish
7. **Phase 2** — Admin panel frontend (18 sub-steps, dark theme, separate /admin URL)

See TODO.md for the full remastered roadmap.

---

## Admin Panel Audit — Key Decisions Made

- **Auth:** separate `/admin` URL (email + password + 2FA), not the customer login
- **Theme:** dark, serious control-panel feel
- **AI provider:** Gemini default, but UI supports pluggable Claude / OpenAI / Local LLM with auto-refreshing model lists (daily cron pulls each provider's list-models endpoint)
- **Per-tier AI configs:** Premium / Silver / Standard each get: model, max input/output tokens, allowed media types (text/images/voice/video/docs), file size limit, reasoning depth, escalation priority
- **Local LLM placeholder:** dormant card in AI Rules UI (endpoint + model name fields), reserved for future GATES-server deployment
- **WhatsApp broadcasting:** template picker only (NOT free text), pre-approved templates required outside 24h customer-service window
- **Facebook integration:** AI agents DO handle inbound FB Messenger messages. FB removed only as a destination for admin alerts (use WhatsApp + in-app)
- **WebRTC remote (Chrome ext):** approved with explicit first-run consent splash, consent record persisted server-side with audit trail
- **`issue_refund` function:** permanently disabled — refunds require admin click, never AI
- **No Redis:** all real-time features replaced with polling against Postgres (alerts every 5s, inbox every 10s, presence via `users.last_seen`)
- **Capacity:** sized for 50 concurrent users on AWS t3.small

---

## Pending Design Assets

- Mini GATES logo PNG (collapsed sidebar)
- Sara persona photo
- Product images + SKUs (12+ items)
- Customer service phone number
- Brand green decision: unify `#4CAF50` and `#166534`?
- WhatsApp utility templates (8–10 needed; copywriting pending)
- WHY GATES? / CONTACT US page content
- Per-tier token-limit defaults

---

## Rollback notes

- Step 3.5 once attempted all-at-once and rolled back. `<Transition>` rejects multi-root components. Fix: single root `<div>` + `<Teleport to="body">` for modals.
- Logo `mix-blend-mode: soft-light` + parent `filter:drop-shadow` = compositing conflict. Fix: rim light on separate `<img>` placed before shine-wrap in DOM.
