<script setup>
import { ref, inject, onMounted, onUnmounted, nextTick } from 'vue'
import { useTilt } from '../composables/useTilt.js'

// ── Phase state ───────────────────────────────────────────────────────────
const phase = ref('intro')

// ── Phase 1 typewriter state ──────────────────────────────────────────────
const line1Text = ref('')
const line2Text = ref('')
const showLine1Cursor = ref(false)
const showLine2Cursor = ref(false)
const line1CursorBlink = ref(false)
const line2CursorBlink = ref(false)
const boxWidth = ref(0)
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

// ── Stationary layer control (PreAuthLayout) ──────────────────────────────
const setStationaryVisible = inject('setStationaryVisible', null)
setStationaryVisible?.(false) // hide nav/buttons/chat during intro

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

  const boxLeft = window.innerWidth * 0.12 + 8
  const boxCursorY = window.innerHeight * 0.5 - 8
  await animateCursor(fakeCursorX.value, fakeCursorY.value, boxLeft, boxCursorY, 600)

  fakeCursorMode.value = 'crosshair'
  await sleep(200)

  boxVisible.value = true
  handlesVisible.value = true
  handlesOpacity.value = 1
  await nextTick()
  await new Promise(resolve => requestAnimationFrame(resolve))
  const targetBoxWidthPx = introMeasureRef.value
    ? introMeasureRef.value.offsetWidth
    : Math.round(window.innerWidth * 0.55)
  await animateBoxDraw(boxLeft, boxCursorY, targetBoxWidthPx, 600)

  await sleep(300)

  fakeCursorMode.value = 'arrow'
  await animateCursor(fakeCursorX.value, fakeCursorY.value, window.innerWidth + 80, fakeCursorY.value - 40, 400)
  fakeCursorVisible.value = false

  fadeOutHandles()

  showLine1Cursor.value = true
  await typeText(line1Text, 'GATES TECHNOLOGY', 80)
  line1CursorBlink.value = true
  await sleep(300)
  line1CursorBlink.value = false
  showLine1Cursor.value = false
  await sleep(100)

  showLine2Cursor.value = true
  await typeText(line2Text, 'AT YOUR SERVUCE', 80)
  line2CursorBlink.value = true
  await sleep(800)
  line2CursorBlink.value = false
  await backspace(line2Text, 3, 150)
  await sleep(400)
  await typeText(line2Text, 'ICE', 120)
  line2CursorBlink.value = true
  await sleep(1500)
  line2CursorBlink.value = false
  showLine2Cursor.value = false
  await sleep(800)

  phase.value = 'transition'
  await sleep(500)
  phase.value = 'main'
  setStationaryVisible?.(true) // trigger entrance animation for nav/buttons/chat
}

async function typeText(textRef, str, delay) {
  for (const ch of str) { textRef.value += ch; await sleep(delay) }
}
async function backspace(textRef, count, delay) {
  for (let i = 0; i < count; i++) { textRef.value = textRef.value.slice(0, -1); await sleep(delay) }
}

let cursorRafId = null
function animateCursor(x0, y0, x1, y1, duration) {
  return new Promise(resolve => {
    const start = performance.now()
    function step(now) {
      const t = Math.min((now - start) / duration, 1)
      const e = 1 - Math.pow(1 - t, 3)
      fakeCursorX.value = x0 + (x1 - x0) * e
      fakeCursorY.value = y0 + (y1 - y0) * e
      if (t < 1) { cursorRafId = requestAnimationFrame(step) } else resolve()
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
      if (t < 1) { boxRafId = requestAnimationFrame(step) } else resolve()
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

// ── Tilt pause/resume via window events (fired by AuthModal) ──────────────
const onTiltPause = () => tilt?.pauseAndCenter()
const onTiltResume = () => tilt?.resume()

onMounted(async () => {
  await nextTick()
  tilt = useTilt({ plateEl: plateTiltRef, logoEl: logoTiltRef, shineEl: shineElRef })
  tilt.start()
  window.addEventListener('auth-modal-open', onTiltPause)
  window.addEventListener('auth-modal-close', onTiltResume)
  runIntro()
})

onUnmounted(() => {
  if (cursorRafId) cancelAnimationFrame(cursorRafId)
  if (boxRafId) cancelAnimationFrame(boxRafId)
  if (handlesRafId) cancelAnimationFrame(handlesRafId)
  tilt?.stop()
  window.removeEventListener('auth-modal-open', onTiltPause)
  window.removeEventListener('auth-modal-close', onTiltResume)
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
        <div class="intro-box-wrap" :style="{ opacity: boxVisible ? 1 : 0 }">
          <div class="intro-box" :style="{ width: boxWidth + 'px' }">
            <span class="intro-box-text">
              {{ line2Text }}<span v-if="showLine2Cursor" class="tw-cursor" :class="{ blink: line2CursorBlink }">|</span>
            </span>
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

          <!-- Top-left taglines -->
          <div class="taglines">
            <p class="tagline-line">|GET FREE LIVE TECHNICAL SUPPORT</p>
            <p class="tagline-line">FOLLOW UP YOUR WARRANTY</p>
            <p class="tagline-line">EARN <RouterLink to="/offers" class="tagline-green tagline-link">[POINTS]</RouterLink> EVERY DAY</p>
          </div>

          <!-- Bottom-left trust badge -->
          <div class="trust-badge">
            <img src="/assets/trust-every-bit.png" alt="Trust Every Bit" class="trust-img" />
          </div>

        </div>
      </div>
      </div>
    </div>

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

.intro-box-wrap { transition: opacity 0.15s; }

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
.tw-cursor { font-weight: 300; animation: none; opacity: 1; }
.tw-cursor.blink { animation: blink-anim 0.5s step-end infinite; }
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
.fake-cursor--crosshair { transform: translate(-11px, -11px); }

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
.phase2--in  { opacity: 1; transform: scale(1); pointer-events: auto; }
.phase2--visible { opacity: 1; transform: scale(1); pointer-events: auto; }

.plate-perspective { width: 100%; height: 100%; perspective: 1200px; }

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
.ui-layer { position: absolute; inset: 0; z-index: 2; }

/* ── Top-left taglines (hidden until phase2--visible entrance) ───────────── */
.taglines {
  position: absolute;
  top: 72px;
  left: 64px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 5px;
  filter: drop-shadow(0px 2px 8px rgba(0,0,0,0.12));
  opacity: 0;
}

.phase2--visible .taglines {
  animation: plv-slide-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.08s both;
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
.tagline-link { color: #4CAF50; text-decoration: none; transition: opacity 0.2s; }
.tagline-link:hover { opacity: 0.75; }

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

/* Rim light: white/silver border glow sweeps in then fades when phase becomes visible */
.phase2--visible .logo-shine-wrap {
  animation: logo-rim-light 2.2s ease-in-out forwards;
}

@keyframes logo-rim-light {
  0%   { filter: drop-shadow(0 0 0px rgba(255,255,255,0)); }
  42%  { filter: drop-shadow(0 0 14px rgba(255,255,255,0.95)) drop-shadow(0 0 6px rgba(190,215,210,0.65)); }
  100% { filter: drop-shadow(0 0 0px rgba(255,255,255,0)); }
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

/* ── Bottom-left trust badge (hidden until phase2--visible entrance) ─────── */
.trust-badge {
  position: absolute;
  bottom: 64px;
  left: 64px;
  z-index: 5;
  opacity: 0;
}

.phase2--visible .trust-badge {
  animation: plv-slide-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.14s both;
}

.trust-img {
  width: 280px;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0px 2px 8px rgba(0,0,0,0.12));
}

/* ── Per-element entrance keyframes ──────────────────────────────────────── */
@keyframes plv-slide-top {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes plv-slide-bottom {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ══════════════════════════════════════════════════════════════════════════
   MOBILE
══════════════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .plate-content { background: transparent; }
  .taglines { top: 32px; left: 24px; }
  .trust-badge { bottom: 32px; left: 24px; }
  .trust-img { width: 180px; }
  .gates-logo { width: 280px; }
  .intro-line1 { font-size: 28px; }
  .intro-box { height: 60px; }
  .intro-box-text { font-size: 22px; }
}
</style>
