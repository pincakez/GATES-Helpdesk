# GATES-CARE — Project To-Do

> Stack: Vue 3 + Vite + Tailwind v4 (frontend) · Node.js + Fastify (backend — Phase 2) · Gemini API Free Tier · AWS t3.small

---

## ✅ PHASE 0 — Pre-Login Home Page (Complete)

- ✅ Phase 1 intro animation: fake cursor → draws green box → typewriter "GATES TECHNOLOGY" / "AT YOUR SERVICE" with typo correction
- ✅ Phase 2: white background, perspective tilt toward cursor, logo with dynamic shine overlay
- ✅ Logo rim light pulse on entry (grey glow visible on white background)
- ✅ Feature text, LOG IN / SIGN UP buttons, Trust Every Bit badge
- ✅ Chat with Us button — rotating gradient border (`@property --angle`, `conic-gradient`)
- ✅ `useTilt.js` — ±3.5° plate, ±6° logo, lerp 0.065, leans TOWARD cursor
- ✅ `useTilt.js` — `pauseAndCenter()` / `resume()` via window custom events

---

## 🔄 PHASE 1 — Frontend Completion (In Progress)

> One step = one session = one commit. Never combine steps.
> Read every file you will touch before writing a single line.

### ✅ AuthModal — `src/components/AuthModal.vue`

5-state morphing glass modal. English for now.

- ✅ Login · Register · Forgot · Reset · Welcome states
- ✅ Egyptian phone validation (010/011/012/015, 11 digits, +20 normalised)
- ✅ Email optional but validated if filled
- ✅ No outside-click dismiss
- ✅ Plate lerps to center on open, resumes on close
- ✅ "Access My Dashboard" → `/app`
- ⬜ **Arabic language pass** — translate all strings, flip layout to RTL

---

### ✅ Steps 3.5A–3.5E — Pre-Auth Multi-Page Layout

- ✅ **3.5A** — `PreAuthLayout.vue` (nav, LOG IN/SIGN UP, Chat with Us, AuthModal)
- ✅ **3.5B** — Router wired (PreAuthLayout parent, PreLoginView child)
- ✅ **3.5C** — Duplicate UI removed from PreLoginView. Entrance animations. Window custom events for tilt.
- ✅ **3.5E** — `WhyGatesView.vue` + `ContactView.vue` with tilt plate. Routes `/why-gates` + `/contact`. Nav wired.
- ✅ **KeepAlive** — Home intro does not replay on back-navigation. `onActivated` resets nav indicator.

- ⬜ **3.5F** — Page-slide transition
  - Horizontal slide + fade between pre-auth routes
  - `<Transition name="page-slide">` wrapping `<router-view>` in PreAuthLayout
  - Stationary layer must NOT move during transition

- ⬜ **3.5D** — Small logo in PreAuthLayout (top-left, 80px)
  - Hidden when `route.path === '/'`, visible on all other pre-auth routes
  - Asset: `gates-logo.png` (pending correct small version)

- ⬜ **3.5G** — Small logo fade on route change
  - TO `/`: fade out (large plate logo takes over)
  - FROM `/`: fade in

- ⬜ **3.5H** — Final visual check of full pre-auth zone

---

### ✅ Steps 4A–4E — App Shell (Post-Login)

- ✅ **4A** — `AppShellLayout.vue`
  - Topbar: search + My Profile link + Sign Out (confirmation modal) + avatar
  - Left sidebar: collapsible (icons at < 1100px, hamburger drawer at < 768px)
  - Right Sara chat panel: 480px, always visible
  - Font: Inter (shell) · Almarai (Arabic chat content)

- ✅ **4B** — `/app` routes with children (tickets, live-chat, inbox, offers, warranty, loyalty, benefits, profile) → stub views

- ✅ **4C** — Sidebar: Lucide icons, centered items, unread badge on Inbox, collapse toggle (ChevronsLeft/Right)

- ✅ **4D** — Topbar: search, My Profile, Sign Out modal, avatar

- ✅ **4E** — Mobile hamburger drawer, responsive breakpoints

---

### Step 5 — Chat UI

- ⬜ **5A** — `ChatView.vue` — scrollable messages, pinned input, Enter sends
- ⬜ **5B** — `CustomerBubble.vue` (right, charcoal) · `AiBubble.vue` (left, white shadow)
- ⬜ **5C** — Sara header (avatar placeholder + name + Arabic subtitle)
- ⬜ **5D** — Thinking indicator: "جارٍ التحقق من المخزون..." + animated dots
- ⬜ **5E** — Product image in AI bubble (`<img>` rounded, max-width 200px)
- ⬜ **5F** — Comparison table in AI bubble (styled HTML table)

---

### Step 6 — Gemini API

- ⬜ **6A** — `src/services/gemini.js` — reads `VITE_GEMINI_API_KEY`, single send function
- ⬜ **6B** — Sara system prompt (Arabic-first, GATES AI assistant)
- ⬜ **6C** — Wire to ChatView: thinking indicator → Gemini → response bubble

---

### Step 7 — Product Data + Function Calling

- ⬜ **7A** — `src/data/products.json` — 12+ products (laptops, mice, keyboards, headsets, monitors)
- ⬜ **7B** — `search_inventory` function call (filter products.json)
- ⬜ **7C** — `compare_products` function call (two IDs → comparison table)
- ⬜ **7D** — Guest chat flow (no login needed; prompt to register for tickets/save)

---

### Step 8 — Ticket Submission

- ⬜ **8A** — `TicketsView.vue` — subject, category, description, submit
- ⬜ **8B** — Success screen: fake ticket number GT-2024-XXXX, Arabic confirmation

---

### Step 9 — System Status Banner

- ⬜ **9A** — `StatusBanner.vue` — thin top bar, red/yellow/blue variants, Arabic default message

---

### Step 10 — Toast Component

- ⬜ **10A** — `Toast.vue` — large centered toast, progress bar, fires 2s after app load

---

### Step 11 — Arabic Language Pass

- ⬜ AuthModal full RTL translation
- ⬜ All pre-auth pages in Arabic
- ⬜ `selectedLang` from Welcome state → Pinia store / localStorage
- ⬜ All other views

---

### Step 12 — Polish Pass

- ⬜ Spacing consistency
- ⬜ Typography hierarchy
- ⬜ `dir="auto"` verified on all content
- ⬜ Hover states on all interactive elements
- ⬜ No console errors / 404s
- ⬜ Footer with customer service phone

---

### Admin Panel (Pending Review)

> Concept uploaded — needs audit before being added to roadmap.
> Review criteria: no Redis, no email/SMTP, must fit AWS t3.small.

- ⬜ Audit admin panel concept for infra requirements
- ⬜ Add approved features to roadmap
- ⬜ Build admin panel (separate layout, English LTR)

---

## ⬜ PHASE 2 — Real Backend

> Server: AWS t3.small · AI: Gemini API Free Tier · No Redis · No email/SMTP ever · WhatsApp Business API

### Infrastructure
- ⬜ Node.js + Fastify on EC2 t3.small
- ⬜ PostgreSQL + Prisma
- ⬜ Nginx + Certbot SSL
- ⬜ Docker Compose full stack
- ⬜ Daily `pg_dump` → S3 cron backup

### Auth
- ⬜ JWT + refresh token rotation
- ⬜ WhatsApp Business API OTP
- ⬜ Real registration + login
- ⬜ Role-based permissions (DB-driven, never hardcoded)

### Core Features
- ⬜ Real ticket system + file attachments
- ⬜ Socket.io live chat — Sara (AI) first, human agent takeover
- ⬜ Personal inbox — single polling endpoint
- ⬜ WhatsApp bot — same Gemini service
- ⬜ Inventory management — Excel import → DB upsert, JSONB specs

### Admin Panel
- ⬜ Full admin panel (English LTR)
- ⬜ Role management UI
- ⬜ Ticket management dashboard
- ⬜ Inventory management UI
- ⬜ Analytics / reporting

### Extended Features
- ⬜ WebRTC calls + coturn TURN server
- ⬜ Chrome Extension Manifest V3
- ⬜ FAQ auto-builder from chat history
- ⬜ Loyalty points system
- ⬜ Warranty check by serial number
- ⬜ Back-in-stock waitlist + WhatsApp push

### Go-Live Checklist
- ⬜ Load test on t3.small
- ⬜ Mobile responsive pass (real device)
- ⬜ Security audit
- ⬜ Go-live

---

## Pending Design Decisions

- [ ] Mini GATES logo PNG for collapsed sidebar state
- [ ] Content for: WHY GATES? and CONTACT US pages
- [ ] Sara persona photo (professional avatar)
- [ ] Real product images and SKUs (12+ products)
- [ ] Customer service phone number
- [ ] Confirmed brand green: `#4CAF50` (pre-login) vs `#166534` (app shell) — unify?
- [ ] Admin panel feature scope (pending concept review)
