<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthModal from '../components/AuthModal.vue'

// ── Stationary layer hidden on home (PreLoginView owns its own nav/buttons) ─
const route = useRoute()
const stationaryVisible = ref(route.path !== '/')

// ── Nav ───────────────────────────────────────────────────────────────────
const navItems = ['HOME', 'WHY GATES?', 'CONTACT US', 'YOUR WARRANTY AND SUPPORT']
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
function onNavClick(i) {
  if (i === navItems.length - 1) { openModal('login'); return }
  navActiveIndex.value = i
}

onMounted(() => { updateNavIndicator(0) })

// ── Modal ─────────────────────────────────────────────────────────────────
const showModal = ref(false)
const modalInitialState = ref('login')

function openModal(tab = 'login') { modalInitialState.value = tab; showModal.value = true }
function goChat() { window.location.href = '/chat' }
</script>

<template>
  <div class="pre-auth-layout" dir="ltr">

    <!-- Page content -->
    <router-view />

    <!-- ── Stationary overlay layer ──────────────────────────────────────── -->
    <div class="stationary-layer" :class="{ 'stationary-layer--hidden': !stationaryVisible }">

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

    <!-- ── Auth modal ────────────────────────────────────────────────────── -->
    <AuthModal
      v-model:open="showModal"
      :initial-state="modalInitialState"
    />

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
  transform: translateX(-50%) translateY(0);
  display: flex;
  align-items: center;
  padding-bottom: 6px;
  white-space: nowrap;
  pointer-events: auto;
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.stationary-layer--hidden .nav-menu {
  opacity: 0;
  transform: translateX(-50%) translateY(-22px);
  pointer-events: none;
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
  transition: opacity 0.45s ease 0.08s, transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.08s;
}

.stationary-layer--hidden .auth-buttons {
  opacity: 0;
  transform: translateY(-22px);
  pointer-events: none;
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
  transition: opacity 0.45s ease 0.14s, transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.14s;
}

.stationary-layer--hidden .chat-cta {
  opacity: 0;
  transform: translateY(22px);
  pointer-events: none;
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


/* ── Mobile ──────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .nav-menu { top: 32px; }
  .auth-buttons { top: 32px; right: 24px; }
  .chat-cta { bottom: 32px; right: 24px; }
}
</style>
