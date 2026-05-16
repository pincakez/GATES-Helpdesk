<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  open: Boolean,
  initialState: { type: String, default: 'login' }
})
const emit = defineEmits(['update:open'])

const router = useRouter()

// ── State machine ─────────────────────────────────────────────────────────
const state = ref('login')
const direction = ref('fwd')
const stateOrder = ['login', 'forgot', 'reset', 'register', 'welcome']

function goTo(next) {
  const curr = stateOrder.indexOf(state.value)
  const nextIdx = stateOrder.indexOf(next)
  direction.value = nextIdx >= curr ? 'fwd' : 'back'
  state.value = next
}

// ── Egyptian phone validation ─────────────────────────────────────────────
function normalizeEgPhone(val) {
  let n = (val || '').trim().replace(/[\s\-()]/g, '')
  if (n.startsWith('+20')) n = '0' + n.slice(3)
  else if (n.startsWith('0020')) n = '0' + n.slice(4)
  else if (/^20\d{10}$/.test(n)) n = '0' + n.slice(2)
  return n
}
function isValidEgPhone(val) {
  return /^0(10|11|12|15)\d{8}$/.test(normalizeEgPhone(val))
}
const PHONE_ERR = 'Please enter a valid phone number  (Ex: 01116799909)'

// ── Shared phone (persists when login field has a valid EG number) ─────────
const sharedPhone = ref('')
const sharedPhoneError = ref('')

// ── Login ─────────────────────────────────────────────────────────────────
const loginId = ref('')
const loginPass = ref('')

function goToRegister() {
  sharedPhone.value = isValidEgPhone(loginId.value) ? normalizeEgPhone(loginId.value) : ''
  sharedPhoneError.value = ''
  goTo('register')
}
function goToForgot() {
  sharedPhone.value = isValidEgPhone(loginId.value) ? normalizeEgPhone(loginId.value) : ''
  sharedPhoneError.value = ''
  goTo('forgot')
}
function submitLogin() { close(); router.push('/app') }

// ── Register ──────────────────────────────────────────────────────────────
const regName = ref('')
const regAltPhone = ref('')
const regCity = ref('Port Said')
const regEmail = ref('')
const regNameError = ref('')
const regAltPhoneError = ref('')
const regEmailError = ref('')

const egyptCities = [
  'Port Said','Cairo','Alexandria','Giza','Suez','Ismailia','Damietta',
  'Mansoura','Zagazig','Banha','Kafr El-Sheikh','Tanta','Shibin El-Kom',
  'Damanhur','Mersa Matruh','Arish','El-Tor','Fayyum','Beni Suef',
  'Minya','Asyut','Sohag','Qena','Luxor','Aswan','Hurghada','New Valley'
]

function submitRegister() {
  regNameError.value = ''
  sharedPhoneError.value = ''
  regAltPhoneError.value = ''
  regEmailError.value = ''
  let valid = true

  if (!/^[a-zA-Z\s]+$/.test(regName.value.trim())) {
    regNameError.value = 'Name must be English letters only.'
    valid = false
  }
  if (!isValidEgPhone(sharedPhone.value)) {
    sharedPhoneError.value = PHONE_ERR
    valid = false
  }
  if (regAltPhone.value.trim() && !isValidEgPhone(regAltPhone.value)) {
    regAltPhoneError.value = PHONE_ERR
    valid = false
  }
  if (regEmail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.value.trim())) {
    regEmailError.value = 'Please enter a valid email address.'
    valid = false
  }
  if (!valid) return

  goTo('welcome')
}

// ── Forgot / OTP ──────────────────────────────────────────────────────────
const otpCode = ref('')
const otpSent = ref(false)
const otpTimer = ref(0)
let timerInterval = null

function sendOtp() {
  sharedPhoneError.value = ''
  if (!isValidEgPhone(sharedPhone.value)) {
    sharedPhoneError.value = PHONE_ERR
    return
  }
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

// ── Welcome ───────────────────────────────────────────────────────────────
const selectedLang = ref('ar')
function accessDashboard() { close(); router.push('/app') }

// ── Open / close ──────────────────────────────────────────────────────────
watch(() => props.open, (val) => {
  if (val) {
    state.value = props.initialState
    window.dispatchEvent(new CustomEvent('auth-modal-open'))
  } else {
    otpSent.value = false
    otpTimer.value = 0
    clearInterval(timerInterval)
    resetError.value = ''
    regNameError.value = ''
    sharedPhoneError.value = ''
    regAltPhoneError.value = ''
    regEmailError.value = ''
    window.dispatchEvent(new CustomEvent('auth-modal-close'))
  }
})

function close() { emit('update:open', false) }
onUnmounted(() => clearInterval(timerInterval))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-enter">
      <div v-if="open" class="m-backdrop">
        <div class="m-box" :class="`m-box--${state}`" dir="ltr">

          <!-- Close — only way to dismiss -->
          <button class="m-close" @click="close" aria-label="Close">✕</button>

          <!-- Icon: lock for auth states, checkmark for welcome -->
          <div class="m-lock" :class="{ 'm-lock--success': state === 'welcome' }">
            <svg v-if="state !== 'welcome'" width="26" height="28" viewBox="0 0 26 28" fill="none" aria-hidden="true">
              <rect x="4" y="12" width="18" height="14" rx="3" stroke="#4CAF50" stroke-width="2"/>
              <path d="M8 12V8a5 5 0 0 1 10 0v4" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
              <circle cx="13" cy="19" r="2" fill="#4CAF50"/>
            </svg>
            <svg v-else width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M5 14L11 20L23 8" stroke="#4CAF50" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <!-- ── State panels ── -->
          <Transition :name="`slide-${direction}`" mode="out-in">

            <!-- LOGIN ──────────────────────────────────────────────────── -->
            <div v-if="state === 'login'" key="login" class="m-panel">
              <div class="m-field">
                <label class="m-label">WhatsApp number or Username or Email</label>
                <input v-model="loginId" type="text" dir="ltr" class="m-input" placeholder="john@mycrm.com" autocomplete="username" />
              </div>
              <div class="m-field">
                <label class="m-label">Password</label>
                <input v-model="loginPass" type="password" dir="ltr" class="m-input" placeholder="••••••••" autocomplete="current-password" />
              </div>
              <div class="m-row-links">
                <button class="m-link-green" @click="goToRegister">New User?</button>
                <button class="m-link-warn" @click="goToForgot">Forgot your password?</button>
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
                <input v-model="regName" type="text" dir="ltr" class="m-input" :class="{ 'm-input--err': regNameError }" placeholder="Mohamed Salah" autocomplete="name" />
                <span v-if="regNameError" class="m-err">{{ regNameError }}</span>
                <span v-else class="m-hint">English letters only</span>
              </div>
              <div class="m-field">
                <label class="m-label">Your WhatsApp Number</label>
                <input v-model="sharedPhone" type="tel" dir="ltr" class="m-input" :class="{ 'm-input--err': sharedPhoneError }" placeholder="01116799909" autocomplete="tel" />
                <span v-if="sharedPhoneError" class="m-err">{{ sharedPhoneError }}</span>
              </div>
              <div class="m-field">
                <label class="m-label">Your Phone Number</label>
                <input v-model="regAltPhone" type="tel" dir="ltr" class="m-input" :class="{ 'm-input--err': regAltPhoneError }" placeholder="Leave empty if same as WhatsApp" autocomplete="tel" />
                <span v-if="regAltPhoneError" class="m-err">{{ regAltPhoneError }}</span>
              </div>
              <div class="m-field">
                <label class="m-label">Your City</label>
                <select v-model="regCity" class="m-input m-select">
                  <option v-for="city in egyptCities" :key="city" :value="city">{{ city }}</option>
                </select>
              </div>
              <div class="m-field">
                <label class="m-label">Your Email Address <span class="m-optional">(optional)</span></label>
                <input v-model="regEmail" type="email" dir="ltr" class="m-input" :class="{ 'm-input--err': regEmailError }" placeholder="example@gmail.com" autocomplete="email" />
                <span v-if="regEmailError" class="m-err">{{ regEmailError }}</span>
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
                <input v-model="sharedPhone" type="tel" dir="ltr" class="m-input" :class="{ 'm-input--err': sharedPhoneError }" placeholder="01116799909" autocomplete="tel" :disabled="otpSent" />
                <span v-if="sharedPhoneError" class="m-err">{{ sharedPhoneError }}</span>
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
                  <input v-model="otpCode" type="text" dir="ltr" class="m-input m-input--center" placeholder="_ _ _ _ _ _" maxlength="6" autocomplete="one-time-code" />
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
            <div v-else-if="state === 'reset'" key="reset" class="m-panel">
              <p class="m-desc">Choose a new password for your account.</p>
              <div class="m-field">
                <label class="m-label">New Password</label>
                <input v-model="newPass" type="password" dir="ltr" class="m-input" placeholder="Minimum 8 characters" autocomplete="new-password" />
              </div>
              <div class="m-field">
                <label class="m-label">Confirm Password</label>
                <input v-model="confirmPass" type="password" dir="ltr" class="m-input" placeholder="Repeat your password" autocomplete="new-password" />
              </div>
              <p v-if="resetError" class="m-err m-err--block">{{ resetError }}</p>
              <p class="m-hint m-hint--rule">Minimum 8 characters — letters, numbers, or both.</p>
              <div class="m-row-btns">
                <button class="m-btn-outline" @click="goTo('forgot')">Back</button>
                <button class="m-btn-primary" @click="submitReset">Confirm</button>
              </div>
            </div>

            <!-- WELCOME ────────────────────────────────────────────────── -->
            <div v-else key="welcome" class="m-panel">
              <h2 class="m-welcome-title">Welcome to GATES TECHNOLOGY!</h2>
              <p class="m-welcome-body">
                You're officially part of the family now.<br><br>
                Your account is ready, giving you instant access to exclusive offers,
                warranty tracking, and our specialized G-Care support.<br><br>
                Head over to your dashboard right now to explore everything available to you.
              </p>

              <div class="m-lang-section">
                <p class="m-label">Choose your default language</p>
                <div class="m-lang-options">
                  <label class="m-lang-opt">
                    <input type="radio" v-model="selectedLang" value="ar" />
                    <span>العربية (Arabic)</span>
                  </label>
                  <label class="m-lang-opt">
                    <input type="radio" v-model="selectedLang" value="en" />
                    <span>English</span>
                  </label>
                </div>
                <p class="m-hint">You can change this anytime from your profile settings.</p>
              </div>

              <button class="m-btn-primary m-btn-full" @click="accessDashboard">
                Access My Dashboard
              </button>
            </div>

          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Backdrop ────────────────────────────────────────────────────────────── */
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
  box-shadow: 0 8px 40px rgba(0,0,0,0.16), 0 1px 0 rgba(255,255,255,0.8) inset;
  font-family: 'Almarai', sans-serif;
  direction: ltr;
  min-height: 420px;
  transition: min-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}
.m-box--register { min-height: 600px; }
.m-box--forgot   { min-height: 360px; }
.m-box--reset    { min-height: 400px; }
.m-box--welcome  { min-height: 540px; }

/* ── Close ───────────────────────────────────────────────────────────────── */
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

/* ── Icons ───────────────────────────────────────────────────────────────── */
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
.m-lock--success {
  background: rgba(76, 175, 80, 0.14);
  box-shadow: 0 0 0 8px rgba(76, 175, 80, 0.08);
}

/* ── Panel ───────────────────────────────────────────────────────────────── */
.m-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── Fields ──────────────────────────────────────────────────────────────── */
.m-field { display: flex; flex-direction: column; gap: 5px; }

.m-label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
  letter-spacing: 0.01em;
}

.m-optional { font-weight: 400; color: #aaa; font-size: 12px; }

.m-input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 14px;
  border: 1.5px solid rgba(0,0,0,0.12);
  border-radius: 10px;
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  color: #2d2d2d;
  background: rgba(255,255,255,0.65);
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  direction: ltr;
}
.m-input:focus { border-color: #4CAF50; background: rgba(255,255,255,0.9); }
.m-input::placeholder { color: #bbb; }
.m-input:disabled { opacity: 0.55; cursor: not-allowed; }
.m-input--err { border-color: #e53935 !important; }
.m-input--center { text-align: center; letter-spacing: 0.25em; font-size: 16px; }
.m-select { cursor: pointer; }

/* ── Text helpers ────────────────────────────────────────────────────────── */
.m-hint { font-size: 11.5px; color: #aaa; padding-left: 2px; }
.m-hint--rule { color: #888; margin-top: -4px; }
.m-err { font-size: 11.5px; color: #e53935; padding-left: 2px; }
.m-err--block { text-align: center; margin-top: -4px; }
.m-desc { font-size: 13.5px; color: #555; margin: 0 0 4px; line-height: 1.5; text-align: center; }

/* ── Link buttons ────────────────────────────────────────────────────────── */
.m-link-green {
  background: none; border: none;
  font-family: 'Almarai', sans-serif; font-size: 13px; font-weight: 600;
  color: #4CAF50; cursor: pointer; padding: 0;
  transition: color 0.2s, opacity 0.2s;
}
.m-link-green:hover { color: #388E3C; }
.m-link-green:disabled { opacity: 0.45; cursor: not-allowed; }
.m-link-center { text-align: center; }

.m-link-warn {
  background: none; border: none;
  font-family: 'Almarai', sans-serif; font-size: 13px; font-weight: 600;
  color: #bf360c; cursor: pointer; padding: 0;
  transition: color 0.2s;
}
.m-link-warn:hover { color: #e64a19; }

/* ── Button rows ─────────────────────────────────────────────────────────── */
.m-row-links {
  display: flex; justify-content: space-between; align-items: center; margin-top: -2px;
}
.m-otp-row { display: flex; justify-content: flex-end; margin-top: -6px; }
.m-row-btns { display: flex; gap: 10px; margin-top: 4px; }
.m-row-btns--stack { flex-direction: column; align-items: stretch; }

.m-btn-outline {
  flex: 1; padding: 11px 16px;
  background: transparent; border: 1.5px solid rgba(0,0,0,0.18); border-radius: 50px;
  font-family: 'Almarai', sans-serif; font-size: 14px; font-weight: 700; color: #2d2d2d;
  cursor: pointer; transition: border-color 0.2s, background 0.2s;
}
.m-btn-outline:hover { border-color: #4CAF50; background: rgba(76,175,80,0.06); }

.m-btn-primary {
  flex: 1; padding: 11px 16px;
  background: #4CAF50; border: none; border-radius: 50px;
  font-family: 'Almarai', sans-serif; font-size: 14px; font-weight: 700; color: #fff;
  cursor: pointer; transition: background 0.2s, transform 0.1s;
  box-shadow: 0 2px 12px rgba(76,175,80,0.28);
}
.m-btn-primary:hover { background: #43A047; }
.m-btn-primary:active { transform: scale(0.97); }
.m-btn-full { flex: none; width: 100%; padding: 13px; font-size: 15px; }

/* ── Welcome state ───────────────────────────────────────────────────────── */
.m-welcome-title {
  font-size: 17px; font-weight: 800; color: #2d2d2d;
  text-align: center; margin: 0 0 2px; line-height: 1.3;
}
.m-welcome-body {
  font-size: 13.5px; color: #555; line-height: 1.65;
  text-align: center; margin: 0;
}
.m-lang-section { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
.m-lang-options { display: flex; gap: 24px; }
.m-lang-opt {
  display: flex; align-items: center; gap: 7px;
  font-size: 14px; font-weight: 600; color: #333; cursor: pointer;
}
.m-lang-opt input[type="radio"] { accent-color: #4CAF50; width: 16px; height: 16px; cursor: pointer; }

/* ── Modal entrance ──────────────────────────────────────────────────────── */
.modal-enter-enter-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.modal-enter-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.modal-enter-enter-from { opacity: 0; transform: translateX(-44px); }
.modal-enter-leave-to   { opacity: 0; transform: translateX(20px); }

/* ── State panel transitions ─────────────────────────────────────────────── */
.slide-fwd-leave-active, .slide-back-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
  position: absolute; width: 100%;
}
.slide-fwd-enter-active, .slide-back-enter-active {
  transition: opacity 0.28s ease 0.08s, transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.08s;
}
.slide-fwd-leave-to   { opacity: 0; transform: translateX(-28px); }
.slide-fwd-enter-from { opacity: 0; transform: translateX(28px); }
.slide-back-leave-to  { opacity: 0; transform: translateX(28px); }
.slide-back-enter-from { opacity: 0; transform: translateX(-28px); }

/* ── Mobile ──────────────────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .m-box { padding: 28px 20px 24px; }
  .m-box--register { min-height: 640px; }
  .m-box--welcome  { min-height: 580px; }
}
</style>
