<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ── Nav ───────────────────────────────────────────────────────────────────
const navItems = ['HOME', 'WHY GATES?', 'CONTACT US', 'YOUR SUPPORT', 'YOUR WARRANTY']
const navActiveIndex = ref(0)
const navItemRefs = ref([])
const navIndicatorStyle = ref({ left: '0px', width: '0px' })

function updateNavIndicator(idx) {
  const el = navItemRefs.value[idx]
  if (!el) return
  navIndicatorStyle.value = { left: el.offsetLeft + 'px', width: el.offsetWidth + 'px' }
}
function onNavEnter(i) { updateNavIndicator(i) }
function onNavLeave() { updateNavIndicator(navActiveIndex.value) }
function onNavClick(i) { navActiveIndex.value = i }

onMounted(() => { updateNavIndicator(0) })

// ── Modal ─────────────────────────────────────────────────────────────────
const showModal = ref(false)
const activeTab = ref('login')
const loginPhone = ref('')
const loginPass = ref('')
const regName = ref('')
const regPhone = ref('')

function openModal(tab = 'login') { activeTab.value = tab; showModal.value = true }
function closeModal() { showModal.value = false }
function submitLogin() { closeModal(); router.push('/app') }
function submitRegister() { closeModal(); router.push('/app') }
function goChat() { router.push('/chat') }
</script>

<template>
  <div class="pre-auth-layout" dir="ltr">

    <!-- Page content (router-view added in 3.5B) -->
    <slot />

    <!-- ── Stationary overlay layer ──────────────────────────────────────── -->
    <div class="stationary-layer">

      <!-- Small logo placeholder — image + show/hide wired in 3.5D -->
      <div class="small-logo"></div>

      <!-- Top-center nav -->
      <nav class="nav-menu">
        <div class="nav-indicator" :style="navIndicatorStyle"></div>
        <template v-for="(item, i) in navItems" :key="item">
          <button
            class="nav-item"
            :class="{ 'nav-item--active': navActiveIndex === i }"
            :ref="el => { if (el) navItemRefs[i] = el }"
            @mouseenter="onNavEnter(i)"
            @mouseleave="onNavLeave"
            @click="onNavClick(i)"
          >{{ item }}</button>
          <span v-if="i < navItems.length - 1" class="nav-sep" aria-hidden="true">-</span>
        </template>
      </nav>

      <!-- Top-right auth buttons -->
      <div class="auth-buttons">
        <button class="btn-text" @click="openModal('login')">LOG IN</button>
        <button class="btn-pill" @click="openModal('register')">SIGN UP</button>
      </div>

      <!-- Bottom-right chat button -->
      <div class="chat-cta">
        <div class="chat-btn-wrapper">
          <div class="chat-btn-border"></div>
          <button class="chat-btn" @click="goChat">
            <svg class="chat-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Chat with us
          </button>
        </div>
      </div>

    </div>

    <!-- ── Modal — Teleport keeps this single-root-safe for <Transition> ── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showModal"
          class="modal-backdrop"
          @click.self="closeModal"
          role="dialog"
          aria-modal="true"
        >
          <div class="modal" dir="rtl">
            <button class="modal-close" @click="closeModal" aria-label="إغلاق">✕</button>

            <div class="modal-tabs" role="tablist">
              <button
                role="tab"
                :aria-selected="activeTab === 'login'"
                :class="['modal-tab', activeTab === 'login' && 'modal-tab--active']"
                @click="activeTab = 'login'"
              >تسجيل الدخول</button>
              <button
                role="tab"
                :aria-selected="activeTab === 'register'"
                :class="['modal-tab', activeTab === 'register' && 'modal-tab--active']"
                @click="activeTab = 'register'"
              >إنشاء حساب</button>
            </div>

            <form v-if="activeTab === 'login'" class="modal-form" @submit.prevent="submitLogin">
              <input v-model="loginPhone" type="tel" dir="auto" placeholder="رقم الهاتف أو اسم المستخدم" class="modal-input" autocomplete="tel" />
              <input v-model="loginPass" type="password" dir="auto" placeholder="كلمة المرور" class="modal-input" autocomplete="current-password" />
              <a href="#" class="modal-forgot">نسيت كلمة المرور؟</a>
              <button type="submit" class="modal-btn-primary">تسجيل الدخول</button>
            </form>

            <form v-else class="modal-form" @submit.prevent="submitRegister">
              <input v-model="regName" type="text" dir="auto" placeholder="Full Name" class="modal-input" autocomplete="name" />
              <div class="modal-field">
                <input v-model="regPhone" type="tel" dir="auto" placeholder="رقم الهاتف / واتساب" class="modal-input" autocomplete="tel" />
                <span class="modal-hint">أدخل الرقم المرتبط بحساب واتساب</span>
              </div>
              <button type="submit" class="modal-btn-primary">إنشاء حساب</button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<!-- @property must live in an unscoped block -->
<style>
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes spin-angle {
  to { --angle: 360deg; }
}
</style>

<style scoped>
/* ── Layout shell ────────────────────────────────────────────────────────── */
.pre-auth-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  inset: 0;
  font-family: 'Almarai', sans-serif;
  direction: ltr;
}

/* ── Stationary overlay — sits above page content, below modal ───────────── */
.stationary-layer {
  position: fixed;
  inset: 0;
  z-index: 20;
  pointer-events: none;
}

/* ── Small logo placeholder (populated and shown/hidden in 3.5D) ─────────── */
.small-logo {
  position: absolute;
  top: 24px;
  left: 32px;
  width: 80px;
  height: 80px;
  display: none;
}

/* ── Top-center nav ──────────────────────────────────────────────────────── */
.nav-menu {
  position: absolute;
  top: 72px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding-bottom: 6px;
  white-space: nowrap;
  pointer-events: auto;
}

.nav-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #4CAF50;
  transition: left 0.22s ease, width 0.22s ease;
  pointer-events: none;
}

.nav-item {
  background: none;
  border: none;
  font-family: 'Almarai', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #2d2d2d;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  padding: 2px 6px;
  transition: color 0.15s;
}
.nav-item:hover,
.nav-item--active { color: #1a1a1a; }

.nav-sep {
  color: #2d2d2d;
  opacity: 0.4;
  font-size: 15px;
  padding: 0 2px;
  pointer-events: none;
  user-select: none;
}

/* ── Top-right auth buttons ──────────────────────────────────────────────── */
.auth-buttons {
  position: absolute;
  top: 72px;
  right: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: auto;
}

.btn-text {
  background: none;
  border: none;
  font-family: 'Almarai', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #2d2d2d;
  letter-spacing: 0.06em;
  cursor: pointer;
  padding: 8px 4px;
  text-transform: uppercase;
  transition: color 0.2s;
  text-shadow: 0px 1px 4px rgba(0,0,0,0.15);
}
.btn-text:hover { color: #4CAF50; }

.btn-pill {
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  padding: 10px 24px;
  font-family: 'Almarai', sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 0.2s, color 0.2s, transform 0.1s;
  box-shadow: 0px 2px 12px rgba(0,0,0,0.18);
}
.btn-pill:hover { background: #a8e6a3; color: #1a1a1a; }
.btn-pill:active { transform: scale(0.97); }

/* ── Bottom-right chat button ────────────────────────────────────────────── */
.chat-cta {
  position: absolute;
  bottom: 64px;
  right: 64px;
  pointer-events: auto;
}

.chat-btn-wrapper {
  position: relative;
  padding: 2px;
  border-radius: 999px;
  display: inline-block;
  filter: drop-shadow(0px 2px 6px rgba(0,0,0,0.10));
}

.chat-btn-border {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  padding: 2px;
  background: conic-gradient(from var(--angle), #4CAF50, #7B68EE, #00BFFF, #FF69B4, #4CAF50);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  animation: spin-angle 3s linear infinite;
}

.chat-btn {
  position: relative;
  z-index: 1;
  background: transparent;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  color: #4CAF50;
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s, color 0.2s;
}
.chat-btn:hover { background: #4CAF50; color: #ffffff; }
.chat-icon { flex-shrink: 0; }

/* ── Modal ───────────────────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
  padding: 32px 28px 28px;
  position: relative;
  box-sizing: border-box;
  font-family: 'Almarai', sans-serif;
}

.modal-close {
  position: absolute;
  top: 16px;
  left: 16px;
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  transition: color 0.2s;
}
.modal-close:hover { color: #333; }

.modal-tabs {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 24px;
}

.modal-tab {
  flex: 1;
  padding: 12px 8px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #aaa;
  cursor: pointer;
  margin-bottom: -1px;
  transition: color 0.2s, border-color 0.2s;
}
.modal-tab--active { color: #2d2d2d; border-bottom-color: #4CAF50; }

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.modal-input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px 16px;
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  color: #2d2d2d;
  outline: none;
  background: #fafafa;
  transition: border-color 0.2s;
  text-align: right;
}
.modal-input:focus { border-color: #4CAF50; background: #fff; }
.modal-input::placeholder { color: #bbb; }

.modal-field { display: flex; flex-direction: column; gap: 5px; }

.modal-hint { font-size: 11.5px; color: #aaa; padding-right: 4px; }

.modal-forgot {
  display: block;
  text-align: right;
  color: #4CAF50;
  font-size: 13px;
  font-family: 'Almarai', sans-serif;
  text-decoration: none;
  margin-top: -4px;
  transition: color 0.2s;
}
.modal-forgot:hover { color: #388E3C; }

.modal-btn-primary {
  width: 100%;
  padding: 13px;
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: 'Almarai', sans-serif;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  margin-top: 4px;
}
.modal-btn-primary:hover { background: #43A047; }
.modal-btn-primary:active { transform: scale(0.98); }

.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal,
.modal-fade-leave-active .modal { transition: transform 0.25s ease; }
.modal-fade-enter-from .modal { transform: translateY(16px) scale(0.97); }
.modal-fade-leave-to .modal { transform: translateY(8px) scale(0.98); }

/* ── Mobile ──────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .nav-menu { top: 32px; }
  .auth-buttons { top: 32px; right: 24px; }
  .chat-cta { bottom: 32px; right: 24px; }
}
</style>
