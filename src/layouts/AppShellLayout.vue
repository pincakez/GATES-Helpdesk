<script setup>
import { ref, nextTick } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  Ticket, MessageCircle, Mail, Tag, Shield, Star, Gift,
  LogOut, Search, ChevronsLeft, ChevronsRight, User,
} from 'lucide-vue-next'

const route  = useRoute()
const router = useRouter()

// ── Left sidebar collapse ─────────────────────────────────────────────────
const sidebarCollapsed = ref(false)

// ── Nav (My Profile removed — lives in topbar) ────────────────────────────
const navItems = [
  { to: '/app/tickets',   label: 'My Tickets',     icon: Ticket        },
  { to: '/app/live-chat', label: 'Live Chat',       icon: MessageCircle },
  { to: '/app/inbox',     label: 'Personal Inbox',  icon: Mail, unread:1},
  { to: '/app/offers',    label: 'Offers',          icon: Tag           },
  { to: '/app/warranty',  label: 'My Warranty',     icon: Shield        },
  { to: '/app/loyalty',   label: 'Loyalty Points',  icon: Star          },
  { to: '/app/benefits',  label: 'My Benefits',     icon: Gift          },
]

// ── Mobile sidebar ────────────────────────────────────────────────────────
const mobileOpen = ref(false)

// ── Sign-out confirmation modal ───────────────────────────────────────────
const showSignOutModal = ref(false)
function confirmSignOut() { showSignOutModal.value = false; router.push('/') }

// ── Sara chat ─────────────────────────────────────────────────────────────
const chatMessages = ref([
  { id: 1, type: 'ai', text: 'أهلاً! أنا سارة، مساعدتك الذكية من GATES 😊 كيف أقدر أساعدك؟', time: '10:30 ص' },
])
const chatInput    = ref('')
const chatThinking = ref(false)
const chatEndRef   = ref(null)

const aiReplies = [
  'سؤال كويس! خليني أشوف الموضوع ده وأرجعلك بأحسن إجابة 😊',
  'تمام، فاهمك. عندنا أكتر من حل — هقولك على الأنسب ليك.',
  'أيوه! ده موجود عندنا. عايزني أبعتلك المواصفات الكاملة؟',
  'والله سؤالك وقّع في مكانه! في تفاصيل مهمة لازم تعرفها قبل ما تاخد القرار ده.',
]

function sendChat() {
  const text = chatInput.value.trim()
  if (!text || chatThinking.value) return
  chatMessages.value.push({ id: Date.now(), type: 'user', text, time: nowStr() })
  chatInput.value = ''
  chatThinking.value = true
  scrollBottom()
  setTimeout(() => {
    chatThinking.value = false
    chatMessages.value.push({
      id: Date.now() + 1, type: 'ai',
      text: aiReplies[Math.floor(Math.random() * aiReplies.length)],
      time: nowStr(),
    })
    scrollBottom()
  }, 1800)
}

function onChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() }
}

function nowStr() {
  return new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
}

function scrollBottom() {
  nextTick(() => chatEndRef.value?.scrollIntoView({ behavior: 'smooth' }))
}
</script>

<template>
  <div class="shell" dir="ltr">

    <!-- ── Topbar ──────────────────────────────────────────────────────── -->
    <header class="topbar">
      <button class="hamburger" @click="mobileOpen = true" aria-label="Open menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6"  x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div class="search-wrap">
        <Search :size="14" class="search-icon" />
        <input class="search-input" placeholder="Search tickets, products, orders..." />
      </div>

      <div class="topbar-actions">
        <RouterLink to="/app/profile" class="profile-link">
          <User :size="16" />
          <span class="profile-label">My Profile</span>
        </RouterLink>
        <button class="signout-btn" @click="showSignOutModal = true">
          <LogOut :size="14" />
          Sign Out
        </button>
        <div class="user-avatar">AA</div>
      </div>
    </header>

    <!-- ── Body ───────────────────────────────────────────────────────── -->
    <div class="body">

      <!-- Left sidebar -->
      <aside class="sidebar" :class="{ 'sidebar--collapsed': sidebarCollapsed }">

        <!-- Brand / mini logo -->
        <div class="sidebar-brand">
          <template v-if="!sidebarCollapsed">
            <span class="brand-gates">GATES</span>
            <span class="brand-sub">Help Desk</span>
          </template>
          <div v-else class="brand-mini">G</div>
        </div>

        <!-- Nav -->
        <nav class="sidebar-nav">
          <RouterLink
            v-for="item in navItems" :key="item.to"
            :to="item.to"
            class="nav-item"
            :class="{ 'nav-item--active': route.path.startsWith(item.to) }"
            :title="sidebarCollapsed ? item.label : undefined"
          >
            <component :is="item.icon" :size="17" class="nav-icon" />
            <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
            <span v-if="item.unread && !sidebarCollapsed" class="unread-dot">{{ item.unread }}</span>
            <span v-if="item.unread && sidebarCollapsed" class="unread-pip" />
          </RouterLink>
        </nav>

        <!-- Collapse toggle at bottom -->
        <button class="collapse-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
          <ChevronsLeft v-if="!sidebarCollapsed" :size="18" />
          <ChevronsRight v-else                  :size="18" />
          <span v-if="!sidebarCollapsed" class="collapse-label">Collapse</span>
        </button>
      </aside>

      <!-- Mobile sidebar overlay -->
      <Teleport to="body">
        <Transition name="fade-overlay">
          <div v-if="mobileOpen" class="mobile-overlay" @click="mobileOpen = false" />
        </Transition>
        <Transition name="slide-drawer">
          <aside v-if="mobileOpen" class="mobile-sidebar">
            <div class="mobile-head">
              <div>
                <span class="brand-gates">GATES</span>
                <span class="brand-sub">Help Desk</span>
              </div>
              <button class="close-btn" @click="mobileOpen = false">✕</button>
            </div>
            <nav class="sidebar-nav sidebar-nav--mobile">
              <RouterLink
                v-for="item in navItems" :key="item.to"
                :to="item.to"
                class="nav-item"
                :class="{ 'nav-item--active': route.path.startsWith(item.to) }"
                @click="mobileOpen = false"
              >
                <component :is="item.icon" :size="17" class="nav-icon" />
                <span class="nav-label">{{ item.label }}</span>
                <span v-if="item.unread" class="unread-dot">{{ item.unread }}</span>
              </RouterLink>
            </nav>
          </aside>
        </Transition>
      </Teleport>

      <!-- Main content -->
      <main class="main-content">
        <router-view />
      </main>

      <!-- Right Sara chat panel (always visible) -->
      <aside class="chat-panel">

        <div class="sara-header">
          <div class="sara-avatar-wrap">
            <div class="sara-avatar">S</div>
            <span class="sara-online" />
          </div>
          <div class="sara-info">
            <div class="sara-name">Sara</div>
            <div class="sara-sub" dir="rtl">مساعدة GATES الذكية</div>
          </div>
        </div>

        <div class="chat-messages">
          <template v-for="msg in chatMessages" :key="msg.id">
            <div :class="msg.type === 'user' ? 'msg-row msg-row--user' : 'msg-row msg-row--ai'">
              <div :class="msg.type === 'user' ? 'bubble bubble--user' : 'bubble bubble--ai'" dir="auto">{{ msg.text }}</div>
              <div class="msg-time">{{ msg.time }}</div>
            </div>
          </template>
          <div v-if="chatThinking" class="msg-row msg-row--ai">
            <div class="bubble bubble--ai bubble--thinking">
              <span class="dot" /><span class="dot" /><span class="dot" />
            </div>
          </div>
          <div ref="chatEndRef" />
        </div>

        <div class="chat-input-row">
          <input
            v-model="chatInput"
            class="chat-input"
            placeholder="اكتب رسالتك هنا..."
            dir="auto"
            @keydown="onChatKey"
          />
          <button class="send-btn" :disabled="!chatInput.trim() || chatThinking" @click="sendChat">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/>
            </svg>
          </button>
        </div>

      </aside>
    </div>

    <!-- ── Sign-out confirmation modal ─────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showSignOutModal" class="modal-backdrop" @click.self="showSignOutModal = false">
          <div class="modal">
            <div class="modal-icon">
              <LogOut :size="28" />
            </div>
            <h3 class="modal-title">Sign Out?</h3>
            <p class="modal-desc">You'll be returned to the home page. Any unsaved changes will be lost.</p>
            <div class="modal-actions">
              <button class="modal-cancel" @click="showSignOutModal = false">Cancel</button>
              <button class="modal-confirm" @click="confirmSignOut">Yes, Sign Out</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
/* ── Shell ───────────────────────────────────────────────────────────────── */
.shell {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Topbar ──────────────────────────────────────────────────────────────── */
.topbar {
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
  z-index: 30;
}

.hamburger {
  display: none;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
}

.search-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fb;
  border: 1px solid #e9ebef;
  border-radius: 10px;
  padding: 0 12px;
  height: 36px;
  max-width: 480px;
}

.search-icon { color: #9ca3af; flex-shrink: 0; }

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13.5px;
  color: #374151;
}
.search-input::placeholder { color: #9ca3af; }

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #374151;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
}
.profile-link:hover { background: #f3f4f6; color: #166534; }
.profile-label { font-family: 'Inter', system-ui, sans-serif; }

.signout-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 12px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.signout-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #166534;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.04em;
  font-family: 'Inter', system-ui, sans-serif;
}

/* ── Body ────────────────────────────────────────────────────────────────── */
.body { flex: 1; display: flex; overflow: hidden; }

/* ── Left sidebar ────────────────────────────────────────────────────────── */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #f0f0f0;
  background: #ffffff;
  overflow: hidden;
  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar--collapsed { width: 62px; }

.sidebar-brand {
  padding: 18px 16px 14px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 68px;
  justify-content: center;
}

.brand-gates {
  font-size: 11px;
  font-weight: 700;
  color: #166534;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  display: block;
  white-space: nowrap;
  font-family: 'Inter', system-ui, sans-serif;
}

.brand-sub {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  display: block;
  margin-top: 2px;
  white-space: nowrap;
  font-family: 'Inter', system-ui, sans-serif;
}

.brand-mini {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #166534;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', system-ui, sans-serif;
  letter-spacing: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  font-family: 'Inter', system-ui, sans-serif;
  position: relative;
}

/* No hover color shift when already active */
.nav-item:not(.nav-item--active):hover { background: #f3f4f6; color: #111827; }
.nav-item--active { background: #166534; color: #ffffff; }

.nav-icon { flex-shrink: 0; }
.nav-label { flex: none; overflow: hidden; }

.unread-dot {
  min-width: 17px;
  height: 17px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 9.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
.nav-item--active .unread-dot { background: #ffffff; color: #166534; }

.unread-pip {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ef4444;
  border: 1.5px solid #ffffff;
}

/* Collapse toggle button at bottom of sidebar */
.collapse-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 6px 6px 10px;
  padding: 9px 10px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: none;
  color: #6b7280;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  white-space: nowrap;
  overflow: hidden;
}
.collapse-toggle:hover { background: #f3f4f6; color: #111827; border-color: #d1d5db; }
.collapse-label { overflow: hidden; }

/* ── Main content ────────────────────────────────────────────────────────── */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: #f8f9fb;
}

/* ── Sara chat panel — always visible ────────────────────────────────────── */
.chat-panel {
  width: 480px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #ebebeb;
  background: #ffffff;
  box-shadow: -6px 0 24px rgba(0, 0, 0, 0.06);
}

.sara-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.sara-info { flex: 1; min-width: 0; }
.sara-avatar-wrap { position: relative; flex-shrink: 0; }

.sara-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #166534, #4ade80);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', system-ui, sans-serif;
  flex-shrink: 0;
}

.sara-online {
  position: absolute;
  bottom: 0; right: 0;
  width: 10px; height: 10px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

.sara-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #111827;
  font-family: 'Inter', system-ui, sans-serif;
}

.sara-sub {
  font-size: 11px;
  color: #6b7280;
  margin-top: 1px;
  font-family: 'Almarai', sans-serif;
}

/* ── Messages ────────────────────────────────────────────────────────────── */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8f9fb;
}

.msg-row { display: flex; flex-direction: column; gap: 3px; }
.msg-row--user { align-items: flex-end; }
.msg-row--ai   { align-items: flex-start; }

.bubble {
  font-size: 13.5px;
  line-height: 1.55;
  padding: 9px 13px;
  border-radius: 16px;
  max-width: 88%;
  word-break: break-word;
  font-family: 'Almarai', sans-serif;
}

.bubble--user {
  background: #166534;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.bubble--ai {
  background: #ffffff;
  color: #1f2937;
  border: 1px solid #e9ebef;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  border-bottom-left-radius: 4px;
}

.bubble--thinking {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
}

.dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  display: inline-block;
  animation: dot-bounce 1.2s ease-in-out infinite;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-5px); }
}

.msg-time {
  font-size: 10px;
  color: #9ca3af;
  padding: 0 2px;
  font-family: 'Inter', system-ui, sans-serif;
}

/* ── Chat input ──────────────────────────────────────────────────────────── */
.chat-input-row {
  flex-shrink: 0;
  padding: 10px 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
}

.chat-input {
  flex: 1;
  background: #f8f9fb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  font-family: 'Almarai', sans-serif;
  font-size: 13.5px;
  color: #1f2937;
  outline: none;
  transition: border-color 0.15s;
}
.chat-input:focus { border-color: #166534; }
.chat-input::placeholder { color: #9ca3af; }

.send-btn {
  width: 32px; height: 32px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #166534;
  border: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}
.send-btn:hover:not(:disabled) { background: #14532d; }
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Sign-out modal ──────────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 28px 24px;
  width: 360px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.modal-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.modal-title {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
}

.modal-desc {
  font-size: 13.5px;
  color: #6b7280;
  line-height: 1.55;
  margin: 0 0 8px;
  font-family: 'Inter', system-ui, sans-serif;
}

.modal-actions {
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 4px;
}

.modal-cancel {
  flex: 1;
  padding: 10px;
  border-radius: 9px;
  border: 1.5px solid #e5e7eb;
  background: none;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}
.modal-cancel:hover { background: #f3f4f6; }

.modal-confirm {
  flex: 1;
  padding: 10px;
  border-radius: 9px;
  border: none;
  background: #dc2626;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s;
}
.modal-confirm:hover { background: #b91c1c; }

/* Transitions */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ── Mobile overlay / drawer ─────────────────────────────────────────────── */
.mobile-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 40;
}

.mobile-sidebar {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: 220px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: 4px 0 24px rgba(0,0,0,0.12);
}

.mobile-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-nav--mobile { padding: 8px 10px; }

.close-btn {
  background: none; border: none;
  font-size: 16px; color: #9ca3af;
  cursor: pointer; padding: 4px; line-height: 1;
}
.close-btn:hover { color: #374151; }

.fade-overlay-enter-active, .fade-overlay-leave-active { transition: opacity 0.2s ease; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }

.slide-drawer-enter-active, .slide-drawer-leave-active {
  transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-drawer-enter-from, .slide-drawer-leave-to { transform: translateX(-100%); }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 1100px) {
  .sidebar { width: 62px; }
  .sidebar .brand-gates,
  .sidebar .brand-sub,
  .sidebar .nav-label,
  .sidebar .unread-dot,
  .sidebar .collapse-label { display: none; }
  .sidebar .brand-mini { display: flex; }
}

@media (max-width: 768px) {
  .sidebar   { display: none; }
  .hamburger { display: flex; }
  .chat-panel { width: 300px; }
}
</style>
