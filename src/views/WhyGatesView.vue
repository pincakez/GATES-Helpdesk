<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTilt } from '../composables/useTilt.js'

const plateTiltRef = ref(null)
const noRef = ref(null)
let tilt = null

onMounted(() => {
  tilt = useTilt({ plateEl: plateTiltRef, logoEl: noRef, shineEl: noRef })
  tilt.start()
})
onUnmounted(() => tilt?.stop())
</script>

<template>
  <div class="page-wrap">
    <div class="plate-perspective">
      <div class="plate-content" ref="plateTiltRef">
        <div class="page-title">WHY GATES?</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
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
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-title {
  font-family: 'Almarai', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: #2d2d2d;
  letter-spacing: 0.08em;
  animation: slide-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes slide-in {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
