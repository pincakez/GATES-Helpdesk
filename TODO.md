# GATES-CARE — Project To-Do

> Stack: Vue 3 + Vite + Tailwind v4 (frontend) · Node.js + Fastify (backend — Phase 2) · Gemini API Free Tier · AWS t3.small

---

## ✅ PHASE 0 — Pre-Login Home Page (Complete)

- ✅ Phase 1 intro animation: fake cursor → draws green box → typewriter "GATES TECHNOLOGY" / "AT YOUR SERVICE" with typo correction sequence
- ✅ Phase 2 aluminum plate (`#f0f0f0`) with perspective tilt toward cursor
- ✅ Logo tilt + dynamic diagonal shine + sharp drop shadow (all driven by CSS vars)
- ✅ Feature text, LOG IN / SIGN UP buttons, Trust Every Bit badge
- ✅ Chat with Us button — rotating gradient border (`@property --angle`, `conic-gradient`)
- ✅ `useTilt.js` composable — ±3.5 deg plate, ±6 deg logo, lerp 0.065, leans TOWARD cursor
- ✅ `useTilt.js` — `pauseAndCenter()` lerps plate to 0,0 on modal open; `resume()` resumes cursor tracking

---

## 🔄 PHASE 1 — Frontend Completion (Next Up)

> One step = one session = one commit. Never combine steps.
> Read every file you will touch before writing a single line.

### ✅ AuthModal — `src/components/AuthModal.vue`

5-state morphing glass modal. English for now — Arabic pass in a dedicated later session.

- ✅ **Login state** — identifier + password, "New User?" → register, "Forgot your password?" → forgot
- ✅ **Register state** — full name (English only), WhatsApp number, alt phone (optional), city dropdown (27 EG cities, default Port Said), email (optional). Morphs to Welcome on success.
- ✅ **Forgot state** — EG phone input → Send OTP → 60s resend countdown timer → Verify → Reset
- ✅ **Reset state** — new password + confirm, min 8 characters
- ✅ **Welcome state** — congratulations message, language picker (Arabic default), "Access My Dashboard" button
- ✅ Egyptian phone validation: `010/011/012/015` prefix, 11 digits, normalises `+20` / `0020` prefix
- ✅ Phone carries from login → register/forgot only if valid; email optional but validated if filled
- ✅ No outside-click dismiss — X button only
- ✅ Plate lerps to center on open, resumes following cursor on close
- ✅ Glass effect: `backdrop-filter: blur(22px)`, semi-transparent white, glass border
- ✅ Entrance: slide from left + fade (matches page transition)
- ✅ State morphing: `min-height` transition + directional slide between panels
- ⬜ **Arabic language pass** — translate all strings, flip layout to RTL for Arabic mode

---

### Step 3.5 — Pre-Auth Multi-Page Layout

> ⚠️ Was attempted and rolled back. Must be done one sub-step per session.
> Key lesson: `<Transition>` rejects multi-root components — keep single root `<div>`, use `<Teleport to="body">` for modals.

- ✅ **3.5A** — `src/layouts/PreAuthLayout.vue` created (nav, LOG IN/SIGN UP, Chat with Us, small logo placeholder, AuthModal wired)
- ✅ **3.5B** — Router wired: PreAuthLayout is parent for `/`, PreLoginView is nested child

- ✅ **3.5C** — Duplicate UI removed from PreLoginView. Entrance animations:
  - Stationary layer hidden during intro via provide/inject setStationaryVisible
  - Nav/auth-buttons slide from top, chat slides from bottom (CSS transitions)
  - Taglines slide from top, trust badge slides from bottom (CSS keyframes)
  - Logo rim light: white/silver border glow 2.2s ease-in-out on phase='main'
  - AuthModal tilt events now window custom events (auth-modal-open/close)

- ⬜ **3.5E** — Add placeholder views + routes
  - `WhyGatesView.vue` — tilt plate page, no centered logo, no taglines. Route: `/why-gates`
  - `ContactView.vue` — same as WhyGates. Route: `/contact`
  - Wire nav clicks 1 + 2 (WHY GATES?, CONTACT US) to `router.push()` in PreAuthLayout
  - YOUR WARRANTY AND SUPPORT already wired to AuthModal ✅

- ⬜ **3.5F** — Page-slide transition
  - Transition: slide from left + fade, smooth ease-in-out (horizontal)
  - `<Transition name="page-slide">` wrapping `<router-view>` in PreAuthLayout
  - Stationary layer (nav, buttons, chat) must NOT move during transition

- ⬜ **3.5D** — Small logo in PreAuthLayout (after routes exist)
  - `gates-logo.png` at 80px, top-left, absolute position
  - Hidden when `route.path === '/'`, visible on all other pre-auth routes

- ⬜ **3.5G** — Small logo fade on route change
  - Navigating TO `/`: small logo fades out (handing off to large plate logo)
  - Navigating FROM `/`: small logo fades in

- ⬜ **3.5H** — Final visual check of full welcome zone

---

### Step 4 — App Shell (Post-Login)

Design reference: Claude.ai / Gemini UI — clean, no effects, functional.

- ⬜ **4A** — `AppShellLayout.vue`
  - Fixed sidebar (240px left), fixed topbar (56px), scrollable content area
  - White background, no tilt, no animations
  - Mobile: sidebar hidden by default

- ⬜ **4B** — `/app` route using AppShellLayout
  - Fake login from modal → `router.push('/app')` lands in shell

- ⬜ **4C** — Customer sidebar items (in order)
  - My Tickets · Live Chat · Personal Inbox (mail icon shakes when unread > 0, hardcode unread=1)
  - Offers · My Warranty · Loyalty Points · My Benefits · My Profile
  - Active route: green highlight
  - Footer inside sidebar: customer service phone number

- ⬜ **4D** — Topbar
  - Left: page title (changes with route)
  - Right: user name (hardcoded) + avatar placeholder
  - Mobile: hamburger button left

- ⬜ **4E** — Mobile hamburger sidebar
  - Slide-in drawer + overlay backdrop closes on tap

---

### Step 5 — Chat UI

- ⬜ **5A** — `ChatView.vue` basic shell
  - Scrollable message area, input pinned at bottom, send button, Enter key sends

- ⬜ **5B** — Bubble components
  - `CustomerBubble.vue`: right-aligned, charcoal bg, white text
  - `AiBubble.vue`: left-aligned, white bg, subtle shadow
  - `dir="auto"` on all bubble content

- ⬜ **5C** — Sara persona header
  - Photo placeholder + name "Sara" + subtitle "مساعدة GATES الذكية"
  - Fixed at top of chat area

- ⬜ **5D** — Thinking indicator
  - Text: "جارٍ التحقق من المخزون..." + animated CSS dots (no library)

- ⬜ **5E** — Image in AI bubble
  - Product image URL in response → `<img>` inside bubble, rounded, max-width 200px

- ⬜ **5F** — Comparison table in AI bubble
  - Styled HTML table inside bubble, clean and readable

---

### Step 6 — Gemini API (Free Tier)

- ⬜ **6A** — `src/services/gemini.js`
  - Reads `VITE_GEMINI_API_KEY` from env
  - Single reusable send function, returns text response

- ⬜ **6B** — Sara system prompt
  - Arabic-first, GATES Technology AI assistant, knows about products
  - Name: Sara

- ⬜ **6C** — Wire to ChatView
  - User sends → thinking indicator → Gemini → response bubble
  - Error: Arabic error message inside bubble

---

### Step 7 — Product Data + Function Calling

- ⬜ **7A** — `src/data/products.json`
  - 12+ products: laptops, mice, keyboards, headsets, monitors, accessories
  - Fields: id, sku, name_ar, name_en, category, brand, price (EGP), stock_status, specs (object), image_url

- ⬜ **7B** — `search_inventory` Function Call
  - Gemini function schema + handler that filters products.json
  - Returns matched products; Gemini formats natural language response

- ⬜ **7C** — `compare_products` Function Call
  - Takes two product IDs, returns structured comparison
  - Gemini renders as comparison table in bubble

- ⬜ **7D** — Guest chat flow
  - Chat works without login
  - If guest tries to submit ticket or save → prompt to register

---

### Step 8 — Ticket Submission

- ⬜ **8A** — `TicketsView.vue`
  - Fields: subject, category (dropdown), description (textarea), submit button

- ⬜ **8B** — Success screen
  - Fake ticket number: GT-2024-XXXX (random on submit)
  - Arabic confirmation message + back to home button

---

### Step 9 — System Status Banner

- ⬜ **9A** — `StatusBanner.vue`
  - Thin persistent bar at very top of all pages (pre and post login)
  - Color variants: red / yellow / blue
  - Default message: "نعمل حالياً على تحديث المنظومة" (red)

---

### Step 10 — Toast Component

- ⬜ **10A** — `Toast.vue`
  - Large centered toast (not corner), progress bar, dismiss button
  - Fires 2 seconds after app shell loads
  - Arabic message

---

### Step 11 — Arabic Language Pass

- ⬜ Translate all AuthModal strings to Arabic
- ⬜ Flip AuthModal layout to RTL when Arabic is selected
- ⬜ Wire `selectedLang` from Welcome state to a Pinia store / localStorage
- ⬜ All other pre-auth pages: Arabic text content

---

### Step 12 — Polish Pass

- ⬜ Spacing consistency across all pages
- ⬜ Typography hierarchy check
- ⬜ All Arabic text rendering RTL correctly
- ⬜ `dir="auto"` verified on all content areas
- ⬜ Hover states on all interactive elements
- ⬜ No console errors
- ⬜ No broken images / 404s
- ⬜ Footer with customer service phone number on all pages

---

## ⬜ PHASE 2 — Real Backend

> Server: AWS t3.small · AI: Gemini API Free Tier (dev/testing) · No Redis · No email/SMTP ever · WhatsApp Business API for all notifications

### Infrastructure
- ⬜ Node.js + Fastify on EC2 t3.small
- ⬜ PostgreSQL + Prisma (all tables per handover DB schema)
- ⬜ Nginx + Certbot SSL
- ⬜ Docker Compose full stack
- ⬜ Daily `pg_dump` → S3 cron backup

### Auth
- ⬜ JWT auth + refresh token rotation
- ⬜ WhatsApp Business API OTP (no email ever)
- ⬜ Real registration + login
- ⬜ Role-based permissions — DB-driven, never hardcoded

### Core Features
- ⬜ Real ticket system + file attachments
- ⬜ Socket.io live chat — Sara (AI) first, human agent takeover
- ⬜ Personal inbox — single polling endpoint (inbox + toasts + banner)
- ⬜ WhatsApp bot — same Gemini service, not duplicated
- ⬜ Inventory management — Excel import → DB upsert, JSONB specs

### Admin Panel
- ⬜ Full admin panel (English LTR)
- ⬜ Role management UI
- ⬜ Ticket management dashboard
- ⬜ Inventory management UI
- ⬜ Analytics / reporting views

### Extended Features
- ⬜ WebRTC calls + coturn TURN server
- ⬜ Chrome Extension Manifest V3
- ⬜ FAQ auto-builder from chat history
- ⬜ Loyalty points system
- ⬜ Warranty check by serial number
- ⬜ Back-in-stock waitlist + WhatsApp push

### Go-Live Checklist
- ⬜ Load test on t3.small before go-live
- ⬜ Mobile responsive pass (real device)
- ⬜ Security audit
- ⬜ Go-live

---

## Pending Design Decisions

- [ ] Content for: WHY GATES? and CONTACT US pages (text, structure)
- [ ] Content for: YOUR WARRANTY AND SUPPORT modal (fields, flow)
- [ ] Sara persona photo — professional avatar asset needed
- [ ] Real product images and SKUs for the 12+ products
- [ ] Customer service phone number for sidebar/footer
- [ ] Exact GATES green hex (currently `#4CAF50` — confirm with brand)
