<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useTilt } from '../composables/useTilt.js'

const router = useRouter()

// ── Phase state ───────────────────────────────────────────────────────────
// phase: 'intro' | 'transition' | 'main'
const phase = ref('intro')

// ── Phase 1 typewriter state ──────────────────────────────────────────────
const line1Text = ref('')
const line2Text = ref('')
const showLine1Cursor = ref(false)
const showLine2Cursor = ref(false)
const line1CursorBlink = ref(false)
const line2CursorBlink = ref(false)
const boxWidth = ref(0)        // px
const introMeasureRef = ref(null)
const boxVisible = ref(false)
const handlesVisible = ref(true)
const handlesOpacity = ref(0)

// Fake cursor
const fakeCursorX = ref(0)
const fakeCursorY = ref(0)
const fakeCursorVisible = ref(false)
const fakeCursorMode = ref('arrow') // 'arrow' | 'crosshair'

// ── Phase 2 tilt system ───────────────────────────────────────────────────
const plateTiltRef = ref(null)
const logoTiltRef = ref(null)
const shineElRef = ref(null)
let tilt = null

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

// ── Modal ─────────────────────────────────────────────────────────────────
const showModal = ref(false)
const activeTab = ref('login')
const loginPhone = ref('')
const loginPass = ref('')
const regName = ref('')
const regPhone = ref('')

function openModal(tab = 'login') {
  activeTab.value = tab
  showModal.value = true
}
function closeModal() { showModal.value = false }

function submitLogin() { router.push('/app') }
function submitRegister() { router.push('/app') }
function goChat() { router.push('/chat') }

// ── Sleep helper ──────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ── Phase 1 animation sequence ────────────────────────────────────────────
async function runIntro() {
  await sleep(300)

  // 1. Fake cursor enters from bottom-center
  fakeCursorX.value = window.innerWidth / 2
  fakeCursorY.value = window.innerHeight - 60
  fakeCursorVisible.value = true
  fakeCursorMode.value = 'arrow'

  // Animate cursor toward left edge of where box will be
  const boxLeft = window.innerWidth * 0.12 + 8
  const boxCursorY = window.innerHeight * 0.5 - 8
  await animateCursor(fakeCursorX.value, fakeCursorY.value, boxLeft, boxCursorY, 600)

  // 2. Cursor → crosshair
  fakeCursorMode.value = 'crosshair'
  await sleep(200)

  // 3. Box and cursor draw together in one rAF loop
  boxVisible.value = true
  handlesVisible.value = true
  handlesOpacity.value = 1
  await nextTick()
  await new Promise(resolve => requestAnimationFrame(resolve))
  const targetBoxWidthPx = introMeasureRef.value
    ? introMeasureRef.value.offsetWidth
    : Math.round(window.innerWidth * 0.55)
  await animateBoxDraw(boxLeft, boxCursorY, targetBoxWidthPx, 600)

  // Cursor pauses at right edge before releasing
  await sleep(300)

  // 4. Cursor releases and exits
  fakeCursorMode.value = 'arrow'
  await animateCursor(fakeCursorX.value, fakeCursorY.value, window.innerWidth + 80, fakeCursorY.value - 40, 400)
  fakeCursorVisible.value = false

  // 5. Handles fade out (slow)
  fadeOutHandles()

  // 6. Typewriter line 1
  showLine1Cursor.value = true
  await typeText(line1Text, 'GATES TECHNOLOGY', 80)
  line1CursorBlink.value = true
  await sleep(300)
  line1CursorBlink.value = false
  showLine1Cursor.value = false
  await sleep(100)

  // 7. Typewriter line 2 — typo SERVUCE, backspace UCE, retype ICE
  showLine2Cursor.value = true
  await typeText(line2Text, 'AT YOUR SERVUCE', 80)
  line2CursorBlink.value = true
  await sleep(800)
  line2CursorBlink.value = false
  await backspace(line2Text, 3, 150)   // delete E, C, U
  await sleep(400)
  await typeText(line2Text, 'ICE', 120)
  line2CursorBlink.value = true
  await sleep(1500)                    // ~3 visible blinks
  line2CursorBlink.value = false
  showLine2Cursor.value = false
  await sleep(800)

  // 8. Phase transition
  phase.value = 'transition'
  await sleep(500)
  phase.value = 'main'
}

async function typeText(textRef, str, delay) {
  for (const ch of str) {
    textRef.value += ch
    await sleep(delay)
  }
}

async function backspace(textRef, count, delay) {
  for (let i = 0; i < count; i++) {
    textRef.value = textRef.value.slice(0, -1)
    await sleep(delay)
  }
}

let cursorRafId = null
function animateCursor(x0, y0, x1, y1, duration) {
  return new Promise(resolve => {
    const start = performance.now()
    function step(now) {
      const t = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const e = 1 - Math.pow(1 - t, 3)
      fakeCursorX.value = x0 + (x1 - x0) * e
      fakeCursorY.value = y0 + (y1 - y0) * e
      if (t < 1) { cursorRafId = requestAnimationFrame(step) }
      else resolve()
    }
    cursorRafId = requestAnimationFrame(step)
  })
}

let boxRafId = null
function animateBoxDraw(boxStartX, cursorY, targetWidthPx, duration) {
  return new Promise(resolve => {
    const start = performance.now()
    function step(now) {
      const t = Math.min((now - start) / duration, 1)
      const e = 1 - Math.pow(1 - t, 3)
      boxWidth.value = Math.round(e * targetWidthPx)
      fakeCursorX.value = boxStartX + boxWidth.value
      fakeCursorY.value = cursorY
      if (t < 1) { boxRafId = requestAnimationFrame(step) }
      else resolve()
    }
    boxRafId = requestAnimationFrame(step)
  })
}

let handlesRafId = null
function fadeOutHandles() {
  const start = performance.now()
  const duration = 800
  function step(now) {
    const t = Math.min((now - start) / duration, 1)
    handlesOpacity.value = 1 - t
    if (t < 1) { handlesRafId = requestAnimationFrame(step) }
    else { handlesVisible.value = false }
  }
  handlesRafId = requestAnimationFrame(step)
}

onMounted(async () => {
  await nextTick()
  tilt = useTilt({ plateEl: plateTiltRef, logoEl: logoTiltRef, shineEl: shineElRef })
  tilt.start()
  updateNavIndicator(0)
  runIntro()
})

onUnmounted(() => {
  if (cursorRafId) cancelAnimationFrame(cursorRafId)
  if (boxRafId) cancelAnimationFrame(boxRafId)
  if (handlesRafId) cancelAnimationFrame(handlesRafId)
  tilt?.stop()
})
</script>

<template>
  <div class="viewport" dir="ltr">

    <!-- ══ PHASE 1 — INTRO ══════════════════════════════════════════════ -->
    <div
      class="phase1"
      :class="{
        'phase1--visible': phase === 'intro',
        'phase1--out': phase === 'transition' || phase === 'main',
      }"
      aria-hidden="true"
    >
      <div class="intro-content">
        <!-- Line 1: GATES TECHNOLOGY -->
        <div class="intro-line1">
          {{ line1Text }}<span v-if="showLine1Cursor" class="tw-cursor" :class="{ blink: line1CursorBlink }">|</span>
        </div>

        <!-- Hidden span to measure natural text width before box animation -->
        <span ref="introMeasureRef" class="intro-measure" aria-hidden="true">AT YOUR SERVICE</span>

        <!-- Line 2: green box with AT YOUR SERVICE -->
        <div
          class="intro-box-wrap"
          :style="{ opacity: boxVisible ? 1 : 0 }"
        >
          <div class="intro-box" :style="{ width: boxWidth + 'px' }">
            <span class="intro-box-text">
              {{ line2Text }}<span v-if="showLine2Cursor" class="tw-cursor" :class="{ blink: line2CursorBlink }">|</span>
            </span>

            <!-- Transform handles -->
            <template v-if="handlesVisible">
              <span class="handle handle-tl" :style="{ opacity: handlesOpacity }" />
              <span class="handle handle-tr" :style="{ opacity: handlesOpacity }" />
              <span class="handle handle-bl" :style="{ opacity: handlesOpacity }" />
              <span class="handle handle-br" :style="{ opacity: handlesOpacity }" />
            </template>
          </div>
        </div>
      </div>

      <!-- Fake cursor -->
      <div
        v-if="fakeCursorVisible"
        class="fake-cursor"
        :class="'fake-cursor--' + fakeCursorMode"
        :style="{ left: fakeCursorX + 'px', top: fakeCursorY + 'px' }"
      >
        <template v-if="fakeCursorMode === 'arrow'">
          <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
            <path d="M2 2 L2 22 L7 17 L11 24 L14 23 L10 16 L17 16 Z" fill="#1a1a1a" stroke="white" stroke-width="1.2"/>
          </svg>
        </template>
        <template v-else>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <line x1="11" y1="1" x2="11" y2="21" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
            <line x1="1" y1="11" x2="21" y2="11" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </template>
      </div>
    </div>

    <!-- ══ PHASE 2 — MAIN PAGE ══════════════════════════════════════════ -->
    <div
      class="phase2"
      :class="{
        'phase2--in': phase === 'transition',
        'phase2--visible': phase === 'main',
      }"
    >
      <div class="plate-perspective">
      <div class="plate-content" ref="plateTiltRef">

        <!-- Center logo with tilt and shine -->
        <div class="logo-center">
          <div class="logo-shine-wrap" ref="logoTiltRef">
            <img src="/assets/gates-logo.png" alt="GATES Technology" class="gates-logo" />
            <div class="logo-overlay" ref="shineElRef"></div>
          </div>
        </div>

        <!-- UI layer -->
        <div class="ui-layer">

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

          <!-- Top-left taglines -->
          <div class="taglines">
            <p class="tagline-line">|GET FREE LIVE TECHNICAL SUPPORT</p>
            <p class="tagline-line">FOLLOW UP YOUR WARRANTY</p>
            <p class="tagline-line">EARN <RouterLink to="/offers" class="tagline-green tagline-link">[POINTS]</RouterLink> EVERY DAY</p>
          </div>

          <!-- Top-right auth buttons -->
          <div class="auth-buttons">
            <button class="btn-text" @click="openModal('login')">LOG IN</button>
            <button class="btn-pill" @click="openModal('register')">SIGN UP</button>
          </div>

          <!-- Bottom-left trust badge -->
          <div class="trust-badge">
            <img src="/assets/trust-every-bit.png" alt="Trust Every Bit" class="trust-img" />
          </div>

          <!-- Bottom chat button -->
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
      </div>
      </div>
    </div>

    <!-- ══ MODAL ════════════════════════════════════════════════════════ -->
    <Transition name="modal-fade">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal" role="dialog" aria-modal="true">
        <div class="modal" dir="rtl">
          <button class="modal-close" @click="closeModal" aria-label="إغلاق">✕</button>

          <!-- Tabs -->
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

          <!-- Login form -->
          <form v-if="activeTab === 'login'" class="modal-form" @submit.prevent="submitLogin">
            <input
              v-model="loginPhone"
              type="tel" dir="auto"
              placeholder="رقم الهاتف أو اسم المستخدم"
              class="modal-input"
              autocomplete="tel"
            />
            <input
              v-model="loginPass"
              type="password" dir="auto"
              placeholder="كلمة المرور"
              class="modal-input"
              autocomplete="current-password"
            />
            <a href="#" class="modal-forgot">نسيت كلمة المرور؟</a>
            <button type="submit" class="modal-btn-primary">تسجيل الدخول</button>
          </form>

          <!-- Register form -->
          <form v-else class="modal-form" @submit.prevent="submitRegister">
            <input
              v-model="regName"
              type="text" dir="auto"
              placeholder="Full Name"
              class="modal-input"
              autocomplete="name"
            />
            <div class="modal-field">
              <input
                v-model="regPhone"
                type="tel" dir="auto"
                placeholder="رقم الهاتف / واتساب"
                class="modal-input"
                autocomplete="tel"
              />
              <span class="modal-hint">أدخل الرقم المرتبط بحساب واتساب</span>
            </div>
            <button type="submit" class="modal-btn-primary">إنشاء حساب</button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ── Brand vars ──────────────────────────────────────────────────────────── */
:root {
  --gates-green: #4CAF50;
  --charcoal: #2d2d2d;
  --black: #1a1a1a;
  --white: #ffffff;
}

/* ── Viewport lock ───────────────────────────────────────────────────────── */
.viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  inset: 0;
  font-family: 'Almarai', sans-serif;
  background: #ffffff;
  direction: ltr;
}

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 1
══════════════════════════════════════════════════════════════════════════ */
.phase1 {
  position: absolute;
  inset: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10%;
  z-index: 10;
  opacity: 1;
  transition: opacity 0.4s ease;
  pointer-events: none;
}
.phase1--visible { opacity: 1; }
.phase1--out { opacity: 0; }

.intro-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  transform: translateY(-8%);
}

.intro-line1 {
  font-size: clamp(42px, 6vw, 72px);
  font-weight: 900;
  color: #2d2d2d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
  min-height: 1.2em;
}

.intro-measure {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  font-family: 'Almarai', sans-serif;
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0 24px;
  white-space: nowrap;
}

.intro-box-wrap {
  transition: opacity 0.15s;
}

.intro-box {
  position: relative;
  background: #2d7a2d;
  overflow: hidden;
  height: 90px;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.intro-box-text {
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0 24px;
  white-space: nowrap;
}

/* Selection handles */
.handle {
  position: absolute;
  width: 7px;
  height: 7px;
  background: #fff;
  border: 1.5px solid #333;
  z-index: 2;
}
.handle-tl { top: -4px; left: -4px; }
.handle-tr { top: -4px; right: -4px; }
.handle-bl { bottom: -4px; left: -4px; }
.handle-br { bottom: -4px; right: -4px; }

/* Typewriter cursor */
.tw-cursor {
  font-weight: 300;
  animation: none;
  opacity: 1;
}
.tw-cursor.blink {
  animation: blink-anim 0.5s step-end infinite;
}
@keyframes blink-anim {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Fake cursor */
.fake-cursor {
  position: fixed;
  z-index: 100;
  pointer-events: none;
  transform: translate(-2px, -2px);
}
.fake-cursor--crosshair {
  transform: translate(-11px, -11px);
}

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 2
══════════════════════════════════════════════════════════════════════════ */
.phase2 {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
  background: transparent;
}
.phase2--in {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
.phase2--visible {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

.plate-perspective {
  width: 100%;
  height: 100%;
  perspective: 1200px;
}

.plate-content {
  width: 100%;
  height: 100%;
  position: relative;
  background: transparent;
  padding: 28px 32px;
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transform-style: preserve-3d;
}

/* ── UI layer (parallax group) ───────────────────────────────────────────── */
.ui-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
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
  z-index: 5;
  white-space: nowrap;
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

/* ── Top-left taglines ───────────────────────────────────────────────────── */
.taglines {
  position: absolute;
  top: 72px;
  left: 64px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 5px;
  filter: drop-shadow(0px 2px 8px rgba(0,0,0,0.12));
}

.tagline-line {
  font-size: 16.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #2d2d2d;
  margin: 0;
  line-height: 1.4;
}

.tagline-green { color: #4CAF50; }

.tagline-link {
  color: #4CAF50;
  text-decoration: none;
  transition: opacity 0.2s;
}
.tagline-link:hover { opacity: 0.75; }

/* ── Top-right auth buttons ──────────────────────────────────────────────── */
.auth-buttons {
  position: absolute;
  top: 72px;
  right: 64px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 12px;
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

/* ── Center logo with tilt ───────────────────────────────────────────────── */
.logo-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
}

.logo-shine-wrap {
  position: relative;
  display: inline-block;
  line-height: 0;
  border: none;
  box-shadow: none;
  overflow: visible;
  transform: rotateX(var(--logo-rx, 0deg)) rotateY(var(--logo-ry, 0deg));
  transform-style: preserve-3d;
}

.gates-logo {
  width: 385px;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(var(--logo-shadow-x, 0px) var(--logo-shadow-y, 8px) 8px rgba(0,0,0,0.45));
}

.logo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    var(--shine-angle, 148deg),
    rgba(0,0,0,0.20) 0%,
    rgba(0,0,0,0.05) 30%,
    rgba(255,255,255,0.80) 50%,
    rgba(0,0,0,0.05) 70%,
    rgba(0,0,0,0.20) 100%
  );
  -webkit-mask-image: url('/assets/gates-logo.png');
  mask-image: url('/assets/gates-logo.png');
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  mix-blend-mode: soft-light;
  pointer-events: none;
}

/* ── Bottom-left trust badge ─────────────────────────────────────────────── */
.trust-badge {
  position: absolute;
  bottom: 64px;
  left: 64px;
  z-index: 5;
}

.trust-img {
  width: 280px;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0px 2px 8px rgba(0,0,0,0.12));
}

/* ── Bottom chat button ──────────────────────────────────────────────────── */
.chat-cta {
  position: absolute;
  bottom: 64px;
  right: 64px;
  z-index: 5;
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes spin-angle {
  to { --angle: 360deg; }
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

.chat-btn:hover {
  background: #4CAF50;
  color: #ffffff;
}

.chat-icon { flex-shrink: 0; }

/* ══════════════════════════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════════════════════════ */
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
  gap: 0;
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

.modal-tab--active {
  color: #2d2d2d;
  border-bottom-color: #4CAF50;
}

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

.modal-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.modal-hint {
  font-size: 11.5px;
  color: #aaa;
  padding-right: 4px;
}

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

/* Modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal,
.modal-fade-leave-active .modal {
  transition: transform 0.25s ease;
}
.modal-fade-enter-from .modal {
  transform: translateY(16px) scale(0.97);
}
.modal-fade-leave-to .modal {
  transform: translateY(8px) scale(0.98);
}

/* ══════════════════════════════════════════════════════════════════════════
   MOBILE
══════════════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .plate-content { background: transparent; }

  .taglines { top: 32px; left: 24px; }
  .auth-buttons { top: 32px; right: 24px; }
  .trust-badge { bottom: 32px; left: 24px; }
  .chat-cta { bottom: 32px; right: 24px; }

  .trust-img { width: 180px; }
  .gates-logo { width: 280px; }

  .intro-line1 { font-size: 28px; }
  .intro-box { height: 60px; }
  .intro-box-text { font-size: 22px; }
}
</style>
