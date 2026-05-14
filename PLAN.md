# GATES Helpdesk — Full Build Plan
> One step = one session = one commit. Never combine steps.

---

## Phase 0 — Demo (current phase)
Goal: working demo deployed to Vercel. No backend. No real auth.
Success criteria: decision-maker opens URL, chats as guest, sees thinking indicator, gets answer with product image, asks to compare two products, sees table. Approves budget.

---

## PHASE 0 PROGRESS

### Step 3 — Pre-Login Home Page
**Status: 🔄 In Progress**

Done:
- ✅ Phase 1 intro animation (cursor draw, box expand, typewriter, typo sequence)
- ✅ Phase 2 aluminum plate with tilt effect
- ✅ Logo tilt + dynamic shine + sharp shadow
- ✅ Feature text, LOG IN / SIGN UP buttons, Trust Every Bit badge
- ✅ Chat with us button with rotating gradient border
- ✅ Login/Register modal (Arabic RTL, stubs to /app)

Remaining in Step 3:
- ⬜ **3A — Verify tilt direction is TOWARD cursor after rollback**
  - Open browser, move mouse top-right, content should lean top-right
  - If it leans away: flip sign on targetRY in useTilt.js
  - One sign change only. Commit.

- ⬜ **3B — Verify logo shine animates with tilt**
  - Move mouse slowly, diagonal shine on logo should rotate
  - If static: confirm --shine-angle is being updated in rAF loop
  - One fix only. Commit.

- ⬜ **3C — Verify Chat with Us rotating border**
  - Should show a moving color stroke (green→purple→blue→pink)
  - If broken: check @property --angle is in unscoped style block
  - One fix only. Commit.

- ⬜ **3D — Final visual check and Step 3 sign-off**

---

### Step 3.5 — Pre-Login Multi-Page Architecture
**Status: ⬜ Not Started**
**Prerequisite: Step 3 fully closed and committed**

> This was attempted and rolled back. Must be done one sub-step at a time.

- ⬜ **3.5A — Create PreAuthLayout.vue (stationary layer only, no routing changes yet)**
  - Contains: nav menu, LOG IN, SIGN UP, Chat with us, small logo placeholder
  - Does NOT replace PreLoginView.vue yet
  - Does NOT touch router yet
  - Just create the file. Commit.

- ⬜ **3.5B — Update router to use PreAuthLayout as parent for /**
  - Nest PreLoginView under PreAuthLayout
  - Move modal trigger from PreLoginView to PreAuthLayout
  - Test: home page still works, modal still opens
  - Commit.

- ⬜ **3.5C — Move stationary elements out of PreLoginView into PreAuthLayout**
  - Move: LOG IN, SIGN UP buttons and their modal trigger
  - Move: Chat with us button
  - Move: nav menu (even if only HOME link works for now)
  - Remove duplicates from PreLoginView
  - Test: nothing broken. Commit.

- ⬜ **3.5D — Add small logo to PreAuthLayout**
  - gates-logo.png scaled to 80px, top-left, position absolute
  - Hidden when route.path === '/' (isHome computed)
  - Visible on all other pre-auth routes
  - Commit.

- ⬜ **3.5E — Add 4 placeholder page views**
  - WhyGatesView.vue, ContactView.vue, SupportView.vue, WarrantyView.vue
  - Each: centered heading + "المحتوى قيد الإعداد", transparent background
  - Add routes to router. Test navigation works.
  - Commit.

- ⬜ **3.5F — Add page transition animation**
  - Vue <transition name="page-slide"> wrapping <router-view>
  - Leave: translateY(-40px) + opacity 0, 350ms
  - Enter: translateY(40px→0) + opacity 0→1, 450ms
  - Stationary layer must NOT move during transition
  - Test all 5 routes. Commit.

- ⬜ **3.5G — Small logo transition behavior**
  - When navigating TO /: small logo fades out (it's handing off to large logo)
  - When navigating FROM /: small logo fades in
  - Watch route.path, apply opacity transition
  - Commit.

- ⬜ **3.5H — Final check of full welcome zone**

---

### Step 4 — App Shell Layout (Post-Login)
**Status: ⬜ Not Started**
**Prerequisite: Step 3.5 complete**

Design reference: Claude.ai / Gemini UI — clean, no effects, functional.

- ⬜ **4A — Create AppShellLayout.vue**
  - Fixed sidebar left (240px), fixed topbar (56px), scrollable content area
  - Sidebar and topbar never move on navigation
  - White background, no effects, no tilt
  - Mobile: sidebar hidden by default, hamburger in topbar
  - Commit.

- ⬜ **4B — Add /app route using AppShellLayout**
  - router: /app uses AppShellLayout
  - Test: fake login from modal → router.push('/app') lands in shell
  - Commit.

- ⬜ **4C — Build customer sidebar**
  Items in order:
  - My Tickets (icon + label)
  - Live Chat (icon + label)
  - Personal Inbox (icon + label, mail icon shakes when unread > 0, hardcode unread=1 for demo)
  - Offers
  - My Warranty
  - Loyalty Points
  - My Benefits
  - My Profile
  - Active route highlight in green
  - Footer inside sidebar: customer service phone number
  - Commit.

- ⬜ **4D — Build topbar**
  - Left: page title (changes with route)
  - Right: user name (hardcoded for demo) + avatar placeholder
  - Mobile: hamburger button left
  - Commit.

- ⬜ **4E — Mobile hamburger sidebar**
  - Hamburger toggles slide-in drawer sidebar
  - Overlay backdrop closes sidebar on tap
  - Commit.

---

### Step 5 — Chat UI
**Status: ⬜ Not Started**

- ⬜ **5A — ChatView.vue basic shell**
  - Scrollable message area, input pinned at bottom
  - Send button, enter key sends
  - Commit.

- ⬜ **5B — Chat bubble components**
  - CustomerBubble.vue: right-aligned, charcoal background, white text
  - AiBubble.vue: left-aligned, white background, subtle shadow
  - dir="auto" on all bubble content
  - Commit.

- ⬜ **5C — Sara persona header**
  - Photo (placeholder professional avatar) + name "Sara"
  - Subtitle: "مساعدة GATES الذكية"
  - Fixed at top of chat area
  - Commit.

- ⬜ **5D — Thinking indicator**
  - Shows while waiting for Gemini response
  - Text: "جارٍ التحقق من المخزون..."
  - Animated dots (CSS, no library)
  - Commit.

- ⬜ **5E — Image rendering inside AI bubble**
  - When AI response includes a product image URL, render img inside bubble
  - Rounded corners, max-width: 200px, loads cleanly
  - Commit.

- ⬜ **5F — Comparison table inside AI bubble**
  - When AI returns a comparison, render a styled HTML table inside bubble
  - Clean, readable, not raw HTML dump
  - Commit.

---

### Step 6 — Gemini API Connection
**Status: ⬜ Not Started**

- ⬜ **6A — Create src/services/gemini.js**
  - Single reusable service
  - Reads VITE_GEMINI_API_KEY from env
  - Sends messages to Gemini with system prompt
  - Returns text response
  - Commit.

- ⬜ **6B — System prompt: Sara persona**
  - Name: Sara
  - Role: GATES Technology AI helpdesk assistant
  - Arabic-first responses
  - Knows about GATES products (electronics retailer)
  - Commit.

- ⬜ **6C — Wire Gemini service to ChatView**
  - User sends message → gemini.js → response in bubble
  - Thinking indicator shows during API call
  - Error handling: if API fails, show Arabic error message in bubble
  - Commit.

---

### Step 7 — Product Data + Function Calling
**Status: ⬜ Not Started**

- ⬜ **7A — Create src/data/products.json**
  - 12 products minimum
  - Mix: laptops, mice, keyboards, headsets, monitors, accessories
  - Each product: id, sku, name_ar, name_en, category, brand, price (EGP), 
    stock_status (available/out_of_stock), specs (object), image_url
  - Use real product images (public URLs from manufacturer sites)
  - Commit.

- ⬜ **7B — Implement search_inventory Function Call**
  - Define function schema for Gemini
  - Handler: reads products.json, filters by query terms
  - Returns matched products array to Gemini
  - Gemini formats natural language response with product data
  - Commit.

- ⬜ **7C — Implement compare_products Function Call**
  - Takes two product identifiers
  - Returns structured comparison data
  - Gemini renders as comparison table in bubble
  - Commit.

- ⬜ **7D — Guest chat flow**
  - Chat works without login
  - If guest tries to submit ticket or save: show prompt to register
  - Commit.

---

### Step 8 — Fake Ticket Submission
**Status: ⬜ Not Started**

- ⬜ **8A — TicketsView.vue with form**
  - Fields: subject, category (dropdown), description (textarea)
  - Submit button
  - Commit.

- ⬜ **8B — Success screen**
  - After submit: show ticket number (fake: GT-2024-XXXX random)
  - Arabic confirmation message
  - Back to home button
  - Commit.

---

### Step 9 — System Status Banner
**Status: ⬜ Not Started**

- ⬜ **9A — StatusBanner.vue component**
  - Thin persistent bar at very top of all pages (pre and post login)
  - Hardcoded red message for demo: "نعمل حالياً على تحديث المنظومة"
  - Color variants: red / yellow / info (blue)
  - Commit.

---

### Step 10 — Toast Component
**Status: ⬜ Not Started**

- ⬜ **10A — Toast.vue component**
  - Large centered toast, not corner notification
  - Progress bar showing time remaining
  - Dismiss button
  - Hardcoded demo toast fires 2 seconds after app shell loads
  - Arabic message
  - Dismissed state stored in component (not persisted)
  - Commit.

---

### Step 11 — Polish Pass
**Status: ⬜ Not Started**

- ⬜ Spacing consistency across all pages
- ⬜ Typography hierarchy check
- ⬜ All Arabic text rendering correctly RTL
- ⬜ dir="auto" verified on all content areas
- ⬜ Hover states on all interactive elements
- ⬜ No console errors
- ⬜ No broken images or 404s
- ⬜ Footer with customer service phone number on all pages

---

### Step 12 — Deploy to Vercel
**Status: ⬜ Not Started**

- ⬜ Push project to GitHub repo (if not already)
- ⬜ Connect repo to Vercel
- ⬜ Add VITE_GEMINI_API_KEY in Vercel environment variables
- ⬜ Run deploy, verify live URL
- ⬜ Test on mobile (real device)
- ⬜ Test full demo flow end-to-end

---

### Step 13 — End-to-End Demo Test
**Status: ⬜ Not Started**

The demo approval moment:
1. Decision-maker opens Vercel URL
2. Sees Phase 1 intro animation
3. Phase 2 loads — aluminum plate, logo, tilt effect
4. Clicks "Chat with us" as guest
5. Asks about a laptop in Arabic
6. Sees thinking indicator
7. Gets response with product image in bubble
8. Asks to compare two products
9. Sees comparison table in bubble
10. Clicks LOG IN, fake login, enters helpdesk shell
11. Sees clean professional UI
12. Submits fake ticket, sees success screen
13. Says yes

---

## Phase 1 — Real Build (after approval)

High level only. Each becomes its own sprint with detailed steps.

- [ ] Backend: Node.js + Fastify on EC2
- [ ] PostgreSQL + Prisma — all tables per DB schema in handover
- [ ] JWT auth + refresh token rotation
- [ ] WhatsApp Business API — OTP, all notifications (no email ever)
- [ ] Real registration + login
- [ ] Real ticket system + file attachments
- [ ] Socket.io live chat — AI first, agent takeover
- [ ] Personal inbox — polling (one endpoint: inbox + toasts + banner)
- [ ] WhatsApp bot — same Gemini service, never duplicated
- [ ] Inventory management — Excel import → upsert, JSONB specs
- [ ] Admin panel — full role-based permissions (DB-driven, never hardcoded)
- [ ] WebRTC calls + coturn TURN server
- [ ] Chrome Extension Manifest V3
- [ ] FAQ auto-builder from chat history
- [ ] Loyalty points system
- [ ] Warranty check by serial number
- [ ] Back-in-stock waitlist + WhatsApp push
- [ ] Daily pg_dump → S3 cron backup
- [ ] Nginx + Certbot SSL
- [ ] Docker Compose full stack
- [ ] Load test on t3.small before go-live
- [ ] Mobile responsive pass
- [ ] Security audit
- [ ] Go-live

---

## Pending Design Decisions

- [ ] Content for: Why Gates?, Contact Us, Your Support, Your Warranty pages
- [ ] Sara persona photo — final asset needed
- [ ] Real product images and SKUs for the 12 demo products
- [ ] Customer service phone number for footer
- [ ] Exact GATES logo green hex value (currently using #4CAF50)
- [ ] Whether pre-login secondary pages get the same tilt+aluminum effect as home or a simpler variant
