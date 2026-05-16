<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  open: Boolean,
  initialState: { type: String, default: 'login' }
})
const emit = defineEmits(['update:open', 'tilt-pause', 'tilt-resume'])

const router = useRouter()

// ── State machine ─────────────────────────────────────────────────────────
const state = ref('login')
const direction = ref('fwd')

const stateOrder = ['login', 'forgot', 'reset', 'register']

function goTo(next) {
  const curr = stateOrder.indexOf(state.value)
  const nextIdx = stateOrder.indexOf(next)
  direction.value = nextIdx >= curr ? 'fwd' : 'back'
  state.value = next
}

// ── Shared phone (persists across login → register / forgot) ──────────────
const sharedPhone = ref('')

// ── Login ─────────────────────────────────────────────────────────────────
const loginId = ref('')
const loginPass = ref('')

function goToRegister() {
  sharedPhone.value = loginId.value
  goTo('register')
}

function goToForgot() {
  sharedPhone.value = loginId.value
  goTo('forgot')
}

function submitLogin() {
  close()
  router.push('/app')
}

// ── Register ──────────────────────────────────────────────────────────────
const regName = ref('')
const regAltPhone = ref('')
const regCity = ref('Port Said')
const regEmail = ref('')
const regNameError = ref('')

const egyptCities = [
  'Port Said','Cairo','Alexandria','Giza','Suez','Ismailia','Damietta',
  'Mansoura','Zagazig','Banha','Kafr El-Sheikh','Tanta','Shibin El-Kom',
  'Damanhur','Mersa Matruh','Arish','El-Tor','Fayyum','Beni Suef',
  'Minya','Asyut','Sohag','Qena','Luxor','Aswan','Hurghada','New Valley'
]

function submitRegister() {
  if (!/^[a-zA-Z\s]+$/.test(regName.value.trim())) {
    regNameError.value = 'Name must be English letters only.'
    return
  }
  regNameError.value = ''
  close()
  router.push('/app')
}

// ── Forgot / OTP ──────────────────────────────────────────────────────────
const otpCode = ref('')
const otpSent = ref(false)
const otpTimer = ref(0)
let timerInterval = null

function sendOtp() {
  otpSent.value = true
  startTimer()
}

function startTimer() {
  clearInterval(timerInterval)
  otpTimer.value = 60
  timerInterval = setInterval(() => {
    otpTimer.value--
    if (otpTimer.value <= 0) clearInterval(timerInterval)
  }, 1000)
}

function submitOtp() { goTo('reset') }

// ── Reset password ────────────────────────────────────────────────────────
const newPass = ref('')
const confirmPass = ref('')
const resetError = ref('')

function submitReset() {
  resetError.value = ''
  if (newPass.value.length < 8) { resetError.value = 'Password must be at least 8 characters.'; return }
  if (newPass.value !== confirmPass.value) { resetError.value = 'Passwords do not match.'; return }
  close()
  router.push('/app')
}

// ── Open / close ──────────────────────────────────────────────────────────
watch(() => props.open, (val) => {
  if (val) {
    state.value = props.initialState
    emit('tilt-pause')
  } else {
    otpSent.value = false
    otpTimer.value = 0
    clearInterval(timerInterval)
    resetError.value = ''
    regNameError.value = ''
    emit('tilt-resume')
  }
})

function close() { emit('update:open', false) }

onUnmounted(() => clearInterval(timerInterval))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-enter">
      <div v-if="open" class="m-backdrop">
        <div class="m-box" :class="`m-box--${state}`">

          <!-- Close -->
          <button class="m-close" @click="close" aria-label="Close">✕</button>

          <!-- Lock icon -->
          <div class="m-lock">
            <svg width="26" height="28" viewBox="0 0 26 28" fill="none" aria-hidden="true">
              <rect x="4" y="12" width="18" height="14" rx="3" stroke="#4CAF50" stroke-width="2"/>
              <path d="M8 12V8a5 5 0 0 1 10 0v4" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
              <circle cx="13" cy="19" r="2" fill="#4CAF50"/>
            </svg>
          </div>

          <!-- ── State panels ── -->
          <Transition :name="`slide-${direction}`" mode="out-in">

            <!-- LOGIN ──────────────────────────────────────────────────── -->
            <div v-if="state === 'login'" key="login" class="m-panel">
              <div class="m-field">
                <label class="m-label">WhatsApp number or Username or Email</label>
                <input v-model="loginId" type="text" dir="auto" class="m-input" placeholder="john@mycrm.com" autocomplete="username" />
              </div>
              <div class="m-field">
                <label class="m-label">Password</label>
                <input v-model="loginPass" type="password" dir="auto" class="m-input" placeholder="••••••••" autocomplete="current-password" />
              </div>
              <div class="m-row-links">
                <button class="m-link-green" @click="goToRegister">New User?</button>
                <button class="m-link-green" @click="goToForgot">Forgot password</button>
              </div>
              <div class="m-row-btns">
                <button class="m-btn-outline" @click="close">Cancel</button>
                <button class="m-btn-primary" @click="submitLogin">Login</button>
              </div>
            </div>

            <!-- REGISTER ───────────────────────────────────────────────── -->
            <div v-else-if="state === 'register'" key="register" class="m-panel">
              <div class="m-field">
                <label class="m-label">Your Full Name</label>
                <input v-model="regName" type="text" dir="auto" class="m-input" :class="{ 'm-input--err': regNameError }" placeholder="Mohamed Salah" autocomplete="name" />
                <span v-if="regNameError" class="m-err">{{ regNameError }}</span>
                <span v-else class="m-hint">English letters only</span>
              </div>
              <div class="m-field">
                <label class="m-label">Your WhatsApp Number</label>
                <input v-model="sharedPhone" type="tel" dir="auto" class="m-input" placeholder="01116799909" autocomplete="tel" />
              </div>
              <div class="m-field">
                <label class="m-label">Your Phone Number</label>
                <input v-model="regAltPhone" type="tel" dir="auto" class="m-input" placeholder="Leave empty if same as WhatsApp" autocomplete="tel" />
              </div>
              <div class="m-field">
                <label class="m-label">Your City</label>
                <select v-model="regCity" class="m-input m-select">
                  <option v-for="city in egyptCities" :key="city" :value="city">{{ city }}</option>
                </select>
              </div>
              <div class="m-field">
                <label class="m-label">Your Email Address</label>
                <input v-model="regEmail" type="email" dir="auto" class="m-input" placeholder="example@gmail.com" autocomplete="email" />
              </div>
              <div class="m-row-btns m-row-btns--stack">
                <button class="m-btn-primary" @click="submitRegister">Register Now</button>
                <button class="m-link-green m-link-center" @click="goTo('login')">Already have an account?</button>
              </div>
            </div>

            <!-- FORGOT ─────────────────────────────────────────────────── -->
            <div v-else-if="state === 'forgot'" key="forgot" class="m-panel">
              <p class="m-desc">Enter your WhatsApp number to receive a password reset OTP.</p>
              <div class="m-field">
                <label class="m-label">WhatsApp Number</label>
                <input v-model="sharedPhone" type="tel" dir="auto" class="m-input" placeholder="01116799909" autocomplete="tel" :disabled="otpSent" />
              </div>

              <template v-if="!otpSent">
                <div class="m-row-btns">
                  <button class="m-btn-outline" @click="goTo('login')">Back</button>
                  <button class="m-btn-primary" @click="sendOtp">Send OTP</button>
                </div>
              </template>

              <template v-else>
                <div class="m-field">
                  <label class="m-label">Enter OTP</label>
                  <input v-model="otpCode" type="text" dir="auto" class="m-input m-input--center" placeholder="_ _ _ _ _ _" maxlength="6" autocomplete="one-time-code" />
                </div>
                <div class="m-otp-row">
                  <button class="m-link-green" :disabled="otpTimer > 0" @click="startTimer">
                    Resend<span v-if="otpTimer > 0"> ({{ otpTimer }}s)</span>
                  </button>
                </div>
                <div class="m-row-btns">
                  <button class="m-btn-outline" @click="goTo('login')">Back</button>
                  <button class="m-btn-primary" @click="submitOtp">Verify</button>
                </div>
              </template>
            </div>

            <!-- RESET ──────────────────────────────────────────────────── -->
            <div v-else key="reset" class="m-panel">
              <p class="m-desc">Choose a new password for your account.</p>
              <div class="m-field">
                <label class="m-label">New Password</label>
                <input v-model="newPass" type="password" dir="auto" class="m-input" placeholder="Minimum 8 characters" autocomplete="new-password" />
              </div>
              <div class="m-field">
                <label class="m-label">Confirm Password</label>
                <input v-model="confirmPass" type="password" dir="auto" class="m-input" placeholder="Repeat your password" autocomplete="new-password" />
              </div>
              <p v-if="resetError" class="m-err m-err--block">{{ resetError }}</p>
              <p class="m-hint m-hint--rule">Minimum 8 characters — letters, numbers, or both.</p>
              <div class="m-row-btns">
                <button class="m-btn-outline" @click="goTo('forgot')">Back</button>
                <button class="m-btn-primary" @click="submitReset">Confirm</button>
              </div>
            </div>

          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Backdrop — no click-to-close ────────────────────────────────────────── */
.m-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.35);
}

/* ── Glass modal box ─────────────────────────────────────────────────────── */
.m-box {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 36px 32px 32px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.16), 0 1px 0 rgba(255,255,255,0.8) inset;
  font-family: 'Almarai', sans-serif;
  min-height: 420px;
  transition: min-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}
.m-box--register  { min-height: 580px; }
.m-box--forgot    { min-height: 360px; }
.m-box--reset     { min-height: 400px; }

/* ── Close button ────────────────────────────────────────────────────────── */
.m-close {
  position: absolute;
  top: 16px;
  right: 18px;
  background: none;
  border: none;
  font-size: 17px;
  color: #888;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  transition: color 0.2s;
}
.m-close:hover { color: #333; }

/* ── Lock icon ───────────────────────────────────────────────────────────── */
.m-lock {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(76, 175, 80, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 0 0 8px rgba(76, 175, 80, 0.06);
}

/* ── State panel wrapper ─────────────────────────────────────────────────── */
.m-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── Form elements ───────────────────────────────────────────────────────── */
.m-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.m-label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
  letter-spacing: 0.01em;
}

.m-input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 14px;
  border: 1.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  color: #2d2d2d;
  background: rgba(255, 255, 255, 0.65);
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.m-input:focus { border-color: #4CAF50; background: rgba(255,255,255,0.9); }
.m-input::placeholder { color: #bbb; }
.m-input:disabled { opacity: 0.55; cursor: not-allowed; }
.m-input--err { border-color: #e53935; }
.m-input--center { text-align: center; letter-spacing: 0.25em; font-size: 16px; }

.m-select { cursor: pointer; appearance: auto; }

/* ── Hints and errors ────────────────────────────────────────────────────── */
.m-hint {
  font-size: 11.5px;
  color: #aaa;
  padding-left: 2px;
}
.m-hint--rule { color: #888; margin-top: -4px; }

.m-err { font-size: 11.5px; color: #e53935; padding-left: 2px; }
.m-err--block { text-align: center; margin-top: -4px; }

.m-desc {
  font-size: 13.5px;
  color: #555;
  margin: 0 0 4px;
  line-height: 1.5;
  text-align: center;
}

/* ── Link buttons ────────────────────────────────────────────────────────── */
.m-link-green {
  background: none;
  border: none;
  font-family: 'Almarai', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #4CAF50;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s, opacity 0.2s;
}
.m-link-green:hover { color: #388E3C; }
.m-link-green:disabled { opacity: 0.45; cursor: not-allowed; }
.m-link-center { text-align: center; }

/* ── Button rows ─────────────────────────────────────────────────────────── */
.m-row-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -2px;
}

.m-otp-row {
  display: flex;
  justify-content: flex-end;
  margin-top: -6px;
}

.m-row-btns {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.m-row-btns--stack {
  flex-direction: column;
  align-items: stretch;
}

.m-btn-outline {
  flex: 1;
  padding: 11px 16px;
  background: transparent;
  border: 1.5px solid rgba(0,0,0,0.18);
  border-radius: 50px;
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #2d2d2d;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.m-btn-outline:hover { border-color: #4CAF50; background: rgba(76,175,80,0.06); }

.m-btn-primary {
  flex: 1;
  padding: 11px 16px;
  background: #4CAF50;
  border: none;
  border-radius: 50px;
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  box-shadow: 0 2px 12px rgba(76,175,80,0.28);
}
.m-btn-primary:hover { background: #43A047; }
.m-btn-primary:active { transform: scale(0.97); }

/* ── Modal entrance (slide from left + fade) ─────────────────────────────── */
.modal-enter-enter-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.modal-enter-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.modal-enter-enter-from { opacity: 0; transform: translateX(-44px); }
.modal-enter-leave-to   { opacity: 0; transform: translateX(20px); }

/* ── State panel transitions ─────────────────────────────────────────────── */
.slide-fwd-leave-active,
.slide-back-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
  position: absolute;
  width: 100%;
}
.slide-fwd-enter-active,
.slide-back-enter-active {
  transition: opacity 0.28s ease 0.08s, transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.08s;
}

/* Forward: old → left, new ← right */
.slide-fwd-leave-to   { opacity: 0; transform: translateX(-28px); }
.slide-fwd-enter-from { opacity: 0; transform: translateX(28px); }

/* Back: old → right, new ← left */
.slide-back-leave-to   { opacity: 0; transform: translateX(28px); }
.slide-back-enter-from { opacity: 0; transform: translateX(-28px); }

/* ── Mobile ──────────────────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .m-box { padding: 28px 20px 24px; }
  .m-box--register { min-height: 620px; }
}
</style>
