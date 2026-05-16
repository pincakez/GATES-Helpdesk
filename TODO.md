# GATES-CARE — Project To-Do

> **Stack:** Vue 3 + Vite + Tailwind v4 · Node.js + Fastify · PostgreSQL + Prisma
> **AI:** Gemini Free Tier (default) — provider-pluggable (Claude / OpenAI / Local LLM)
> **Server:** AWS t3.small · **Max concurrent:** 50 · **No Redis** (polling-against-Postgres replaces it) · **No SMTP ever** (WhatsApp only)

---

## ✅ PHASE 0 — Pre-Login Home Page (COMPLETE)

- ✅ Phase 1 intro animation: fake cursor → green box → typewriter with typo correction
- ✅ Phase 2: white background, perspective tilt toward cursor, dynamic logo shine, rim light pulse
- ✅ `useTilt.js` — ±3.5° plate, ±6° logo, lerp 0.065, leans toward cursor
- ✅ `pauseAndCenter()` / `resume()` via window custom events
- ✅ Feature taglines, LOG IN / SIGN UP, Trust Every Bit badge, animated chat button

---

## 🔄 PHASE 1 — Customer Frontend (Vue)

### ✅ AuthModal — `src/components/AuthModal.vue`
- ✅ 5-state morphing glass modal: login · register · forgot · reset · welcome
- ✅ Egyptian phone validation (010/011/012/015, +20 normalised)
- ✅ Email optional but validated if filled
- ✅ No outside-click dismiss
- ✅ Plate lerps to center on open, resumes on close
- ✅ "Access My Dashboard" → `/app`
- ⬜ **Arabic language pass** (dedicated session — translate strings, flip RTL)

### ✅ Pre-Auth Multi-Page Layout (Steps 3.5A–3.5E)
- ✅ **3.5A** — `PreAuthLayout.vue` (nav, auth buttons, chat CTA, AuthModal)
- ✅ **3.5B** — Router wired (PreAuthLayout parent, child views)
- ✅ **3.5C** — Duplicate UI removed from PreLoginView; entrance animations; window custom events for tilt
- ✅ **3.5E** — `WhyGatesView.vue` + `ContactView.vue` with tilt plate; routes `/why-gates` + `/contact`; nav wired
- ✅ **KeepAlive** — Home intro does not replay; `onActivated` syncs nav indicator

#### Pending pre-auth polish
- ⬜ **3.5F** — Page-slide transition (horizontal slide + fade between pre-auth routes; stationary layer must NOT move)
- ⬜ **3.5D** — Small logo in PreAuthLayout top-left (80px, hidden on `/`)
- ⬜ **3.5G** — Small logo fade on route change
- ⬜ **3.5H** — Final visual check of pre-auth zone

### ✅ App Shell (Steps 4A–4E)
- ✅ **4A** — `AppShellLayout.vue` built (Inter font, lucide icons, `dir="ltr"` locked)
- ✅ **4B** — `/app` routes with children (stubs for tickets, live-chat, inbox, offers, warranty, loyalty, benefits, profile)
- ✅ **4C** — Left sidebar: collapsible (icons-only at < 1100px, hamburger < 768px), centered nav items, lucide icons
- ✅ **4D** — Topbar: search + My Profile link + Sign Out (confirmation modal) + avatar
- ✅ **4E** — Mobile hamburger drawer + responsive breakpoints
- ✅ Right Sara chat panel: 480px, always visible (essential), left-edge shadow

#### Step 5 — Real Chat UI (replaces stubs)
- ⬜ **5A** — `ChatView.vue` — scrollable messages, pinned input, Enter sends
- ⬜ **5B** — `CustomerBubble.vue` (right, charcoal) + `AiBubble.vue` (left, white shadow), `dir="auto"`
- ⬜ **5C** — Sara header (avatar + Arabic subtitle), fixed at top
- ⬜ **5D** — Thinking indicator: "جارٍ التحقق من المخزون..." + CSS animated dots
- ⬜ **5E** — Product image in AI bubble (`<img>`, rounded, max-width 200px)
- ⬜ **5F** — Comparison table inside AI bubble (styled HTML table)

#### Step 6 — Gemini Service (frontend stub)
- ⬜ **6A** — `src/services/aiClient.js` — provider-aware client; reads provider + key from env, calls correct SDK
- ⬜ **6B** — Sara system prompt (Arabic-first, GATES AI assistant)
- ⬜ **6C** — Wire to ChatView: thinking → call AI → response bubble; Arabic error fallback

#### Step 7 — Product Data + Function Calling
- ⬜ **7A** — `src/data/products.json` — 12+ products (laptops, mice, keyboards, headsets, monitors)
- ⬜ **7B** — `search_inventory` function (filter products.json)
- ⬜ **7C** — `compare_products` function (two IDs → comparison table)
- ⬜ **7D** — Guest chat flow (no login needed; prompt to register for tickets / save)

#### Step 8 — Ticket Submission
- ⬜ **8A** — `TicketsView.vue` — subject, category, description, submit
- ⬜ **8B** — Success: fake ticket number GT-2024-XXXX, Arabic confirmation

#### Step 9 — System Status Banner
- ⬜ **9A** — `StatusBanner.vue` — thin top bar, red/yellow/blue variants, Arabic default

#### Step 10 — Toast Component
- ⬜ **10A** — `Toast.vue` — large centered toast, progress bar, fires 2s after app load

#### Step 11 — Arabic Language Pass (whole customer site)
- ⬜ AuthModal full RTL translation
- ⬜ Pre-auth pages in Arabic
- ⬜ `selectedLang` from Welcome state → Pinia store / localStorage
- ⬜ App shell + all views in Arabic

#### Step 12 — Polish Pass
- ⬜ Spacing consistency · typography hierarchy · `dir="auto"` everywhere
- ⬜ Hover states · no console errors / 404s
- ⬜ Footer with customer service phone

---

## ⬜ PHASE 2 — Admin Panel Frontend (Vue, separate `/admin` URL, dark theme, English LTR)

> Separate auth flow (email + password + 2FA later). Dark theme — serious control-panel feel.
> All real-time features use **polling against Postgres**, not Redis pub/sub.

### Step A1 — Admin Shell
- ⬜ `AdminShellLayout.vue` — dark theme (`#0a0a0a` bg, emerald accents), grouped sidebar nav, top header, content area
- ⬜ Admin login page at `/admin/login` (email + password, 2FA-ready scaffold)
- ⬜ Sidebar groups: Core · Extended · AI Agents · Integrations · Settings
- ⬜ Footer: WebRTC node status indicator (after Phase 4) + admin user identity

### Step A2 — Dashboard
- ⬜ Stat cards: total tickets · open urgent · avg resolution · active agents
- ⬜ Charts: ticket volume vs resolved (line) · customer satisfaction (bar)
- ⬜ Data refresh: poll every 30s

### Step A3 — Client Control
- ⬜ Searchable client list
- ⬜ Per-client tabs: **Profile** · **Chat History** (filterable by status/agent) · **Warranty & Devices**
- ⬜ Tier change (Premium / Silver / Standard)
- ⬜ Block account modal (reason + duration: hours / days / indefinite)
- ⬜ Trigger password reset (sends WhatsApp template, not email)

### Step A4 — Messages Control
- ⬜ Broadcast composer with:
  - **Target:** all clients · specific client
  - **Channel:** in-app inbox · WhatsApp (template picker) · live toast
- ⬜ **WhatsApp channel uses pre-approved template picker** (NOT free text — Meta requires this outside 24h window)
- ⬜ Template list pulled from DB: variables auto-filled where possible (`{{name}}`, `{{device}}`), admin fills rest
- ⬜ Template categories shown: utility / marketing / authentication (cost + approval-difficulty badges)
- ⬜ Toast channel: documented as polling-based ("appears to active online users via polling")
- ⬜ Message history log

### Step A5 — Role Management
- ⬜ Admin user list with expand-to-edit
- ⬜ Granular privilege picker (dual-list: Active ↔ Inactive)
- ⬜ Per-user alert routing preferences:
  - In-app · personal WhatsApp · ~~personal Facebook~~ (dropped — fragile)
- ⬜ Per-event alert routing: new tickets · AI intervention required · system errors

### Step A6 — AI Alerts (live human-intervention feed)
- ⬜ List of AI conversations that triggered a rule (profanity / escalation request / price complaint / low confidence)
- ⬜ Live view of conversation, admin can **whisper** (hint AI) or **takeover** (replace AI with human)
- ⬜ Polling: alerts list refreshes every 5s, active conversation refreshes every 2s

### Step A7 — AI Rules Engine
- ⬜ **Multi-provider picker** with auto-refreshing model list:
  - Providers: **Gemini** (default) · Claude · OpenAI · **Local LLM** (placeholder card, disabled, fields for endpoint + model name — reserved for future GATES-server deployment)
  - Daily cron pulls each provider's `list-models` endpoint into `ai_models` table
  - Filter junk (embeddings, deprecated, audio-only)
  - Capability badges per model: vision · function calling · reasoning · long-context
  - Rough cost tier badges ($ / $$ / $$$)
- ⬜ Global system prompt editor (Arabic-first, persona, tone, escalation rules)
- ⬜ Function call toggles (per function, on/off):
  - `check_warranty` · `create_ticket` · `check_inventory` · `escalate_to_human`
  - `issue_refund` — **permanently disabled** (refunds require admin click)
  - Custom functions addable later
- ⬜ **Per-tier configuration** (Premium / Silver / Standard):
  - Model assignment (from picker)
  - **Max input tokens** + **Max output tokens** (per tier)
  - Reasoning depth (low / medium / high — only on models that support it)
  - Vision DPI (low / auto / high — on vision-capable models)
  - **Allowed media types** (text · images · voice · video · documents) — per tier
  - Max file/attachment size per tier
  - Escalation priority (1 / 2 / 3)
- ⬜ AI Agent Thoughts panel: suggestions from last N conversations ("add `get_store_hours()` — frequently asked"); admin clicks to implement

### Step A8 — Social Inbox (unified messaging)
- ⬜ Threads list (WhatsApp / Facebook / Web), filter by channel + AI-handled status
- ⬜ Conversation view with channel badge, AI-handled indicator (polling-driven)
- ⬜ Admin can intervene (pauses AI) or let AI continue
- ⬜ "AI is handling this conversation" pill, refreshed by polling `assigned_to_ai` flag
- ⬜ AI agents handle BOTH WhatsApp + Facebook incoming messages

### Step A9 — Tickets Management (admin variant)
- ⬜ All tickets list with status / priority / assignment filters
- ⬜ Assign to agent · change status · close · escalate
- ⬜ View full conversation thread + attachments
- ⬜ Bulk actions (close many, assign many)

### Step A10 — Inventory Management
- ⬜ Searchable / filterable table (brand, model, CPU, RAM, GPU, monitor, price, qty, status)
- ⬜ Per-item **AI-active toggle** (whether AI should suggest/recommend this item)
- ⬜ Add / edit / delete / archive items
- ⬜ Excel import → DB upsert (Phase 3 backend)
- ⬜ JSONB specs column for flexible attributes

### Step A11 — Offers Management
- ⬜ Create / edit / pause / end campaign offers
- ⬜ Target audience picker (all / tier-based / specific)
- ⬜ Auto-expiry, auto-trigger WhatsApp utility-template announcement

### Step A12 — Loyalty Points (admin view)
- ⬜ Points balance per client
- ⬜ Manual adjustment (with reason log)
- ⬜ Tier auto-upgrade thresholds config

### Step A13 — Warranty Management
- ⬜ Serial-number lookup
- ⬜ Add / edit warranty records (purchase date, expiry, terms)
- ⬜ Bulk import warranties from supplier sheets

### Step A14 — Waitlist (back-in-stock)
- ⬜ List of SKU + customer waiting counts
- ⬜ When stock returns → "Send Notifications" button fires WhatsApp utility template

### Step A15 — FAQ Builder
- ⬜ AI analyzes resolved tickets → suggests draft FAQ articles (with confidence + source-ticket count)
- ⬜ Admin reviews → publish to public FAQ
- ⬜ On-demand "Run Deep Analysis Now" button

### Step A16 — Integrations (Settings)
- ⬜ **WhatsApp Settings** — Phone Number ID, WABA ID, System User Access Token, template library viewer
- ⬜ **Facebook Settings** — Page ID, Page Access Token, webhook verify token
- ⬜ Connection status indicators

### Step A17 — Global Settings
- ⬜ Delivery endpoints: developer WhatsApp, sales team WhatsApp group
- ⬜ Alert routing matrix (event × channel)
- ⬜ Branding (logo, brand color)
- ⬜ Operating hours (used by AI for escalation logic)

### Step A18 — WebRTC Calls Settings (frontend page)
- ⬜ TURN server config (coturn endpoint, credentials)
- ⬜ Server status indicators (coturn / signaling)
- ⬜ Live session list (populated after Phase 4)

---

## ⬜ PHASE 3 — Backend (Node.js + Fastify on AWS t3.small)

### Infrastructure
- ⬜ Node.js + Fastify on EC2 t3.small
- ⬜ PostgreSQL + Prisma (single DB for everything — sessions, queues, presence, cache)
- ⬜ Nginx + Certbot SSL (admin behind separate subdomain + IP allowlist later)
- ⬜ Docker Compose full stack
- ⬜ Daily `pg_dump` → S3 cron backup
- ⬜ pino logging to file + log rotation

### Auth
- ⬜ Customer: phone + WhatsApp OTP, JWT + refresh tokens (Postgres-backed, no Redis)
- ⬜ Admin: email + password + 2FA (TOTP), separate token issuance
- ⬜ Role-based permissions resolved from DB on every request (cached in-process)
- ⬜ Block-account enforcement on login attempt

### Core API
- ⬜ Tickets CRUD + attachments (S3 or local disk)
- ⬜ Chat sessions + messages (one record per message, polling endpoint reads since-cursor)
- ⬜ Single inbox polling endpoint (returns: unread messages + toasts + status banner state)
- ⬜ Presence: `users.last_seen` updated on each authenticated request; "online" = updated < 60s
- ⬜ Job queue: Postgres-backed (pg-boss or hand-rolled `jobs` table with `FOR UPDATE SKIP LOCKED`)
- ⬜ Rate limiting: Postgres-backed sliding window per IP / per user

### AI Service Layer
- ⬜ `aiClient.js` provider abstraction (Gemini / Claude / OpenAI / Local LLM endpoint)
- ⬜ Daily cron: refresh `ai_models` from each provider's list-models API
- ⬜ Per-tier config resolver: looks up `tier_config` row, applies token limits + media rules + model assignment
- ⬜ Function call dispatcher (whitelist check from `enabled_functions` table)
- ⬜ Conversation logging for FAQ Builder + AI Alerts analytics

### WhatsApp Integration
- ⬜ Meta Graph API client
- ⬜ Template management (sync approved templates from Meta into local DB)
- ⬜ Template variable filler (named slot substitution)
- ⬜ 24h-window state tracker per conversation (free-form vs template-only)
- ⬜ Inbound webhook → conversation thread → AI dispatch (per Social Inbox)

### Facebook Integration
- ⬜ Meta Graph / Messenger Platform client
- ⬜ Page inbox webhook → conversation thread
- ⬜ AI handles inbound FB Messenger messages (same pipeline as WhatsApp)

### Polling Endpoints (replacing Redis pub/sub)
- ⬜ `GET /admin/alerts/active` — 5s polling, returns triggered AI alerts
- ⬜ `GET /admin/social-inbox/threads` — 10s polling
- ⬜ `GET /customer/inbox` — 10s polling, single endpoint for inbox + toasts + banner
- ⬜ `GET /admin/presence` — derived from `users.last_seen`

---

## ⬜ PHASE 4 — Extended Features

### Chrome Extension + WebRTC Remote
- ⬜ Chrome Web Store extension (Manifest V3)
- ⬜ First-run splash with **explicit consent** for remote access (terms + agreement)
- ⬜ Consent record persisted server-side with timestamp + IP + user agent (audit trail)
- ⬜ coturn TURN server setup
- ⬜ WebRTC signaling server (Fastify endpoint, Postgres-backed offer/answer relay)
- ⬜ DOM tree streaming over data channel
- ⬜ Remote console (admin sends JS payloads, executed only with active consent)
- ⬜ Live support chat over same WebRTC data channel
- ⬜ Force disconnect + extension restart commands

### WebRTC Calls
- ⬜ Audio/video calls between admin and customer
- ⬜ Initiate from a ticket
- ⬜ Session recording (optional, with consent)

### Loyalty System
- ⬜ Points accrual rules (per purchase, per resolved ticket, per referral)
- ⬜ Auto-tier upgrade
- ⬜ Customer-side "My Points" view + history

### Warranty Check by Serial
- ⬜ Customer-side lookup form
- ⬜ AI function call `check_warranty(serial)` to same backend

### Back-in-Stock Waitlist + WhatsApp Push
- ⬜ Customer joins waitlist (button in inventory view when out of stock)
- ⬜ Stock-restock event → batch fire WhatsApp utility template to waitlist

### FAQ Auto-Builder
- ⬜ Nightly job runs against resolved tickets
- ⬜ Clusters questions, drafts answers, scores confidence
- ⬜ Admin review queue

---

## ⬜ PHASE 5 — Go-Live Checklist

- ⬜ Load test t3.small at 50 concurrent (k6 or autocannon scripts)
- ⬜ Mobile responsive pass (real device — both customer + admin)
- ⬜ Security audit (SQL injection, XSS, CSRF, auth bypass, file upload, rate limits)
- ⬜ Admin panel locked behind nginx IP allowlist or VPN
- ⬜ All WhatsApp templates pre-approved by Meta
- ⬜ Backup restore drill (simulate failure → restore from S3)
- ⬜ Monitoring + alerts (pino logs → CloudWatch or self-hosted)
- ⬜ Go-live

---

## Pending Design Decisions

- [ ] Mini GATES logo PNG for collapsed sidebar state (customer + admin)
- [ ] Sara persona photo (professional avatar)
- [ ] Real product images and SKUs (12+ products)
- [ ] Customer service phone number for footer
- [ ] Confirmed brand green: `#4CAF50` (pre-login) vs `#166534` (app shell) — unify?
- [ ] WhatsApp template wording (8–10 utility templates needed for repair / order / OTP / offers / back-in-stock / warranty expiry / appointment / ticket update)
- [ ] WHY GATES? + CONTACT US page content
- [ ] AI Rules: exact token-limit defaults per tier (Premium / Silver / Standard)
- [ ] Admin email + 2FA recovery flow design
