export function useTilt({ plateEl, logoEl, shineEl }) {
  const maxPlate = 3.5
  const maxLogo = 6
  const lerpFactor = 0.065

  let mouse = { x: 0.5, y: 0.5 }
  let curPRx = 0, curPRy = 0
  let animId = null

  function onMouse(e) {
    mouse.x = e.clientX / window.innerWidth
    mouse.y = e.clientY / window.innerHeight
  }

  function loop() {
    const targetRy = -(mouse.x - 0.5) * 2 * maxPlate
    const targetRx = -(mouse.y - 0.5) * 2 * maxPlate

    curPRy += (targetRy - curPRy) * lerpFactor
    curPRx += (targetRx - curPRx) * lerpFactor

    if (plateEl.value) {
      plateEl.value.style.setProperty('--rx', curPRx.toFixed(3) + 'deg')
      plateEl.value.style.setProperty('--ry', curPRy.toFixed(3) + 'deg')
    }

    if (logoEl.value) {
      const logoRy = curPRy * (maxLogo / maxPlate)
      const logoRx = curPRx * (maxLogo / maxPlate)
      logoEl.value.style.setProperty('--logo-rx', logoRx.toFixed(3) + 'deg')
      logoEl.value.style.setProperty('--logo-ry', logoRy.toFixed(3) + 'deg')

      const shadowX = (curPRy / maxPlate * 6).toFixed(2)
      const shadowY = (-curPRx / maxPlate * 6).toFixed(2)
      logoEl.value.style.setProperty('--logo-shadow-x', shadowX + 'px')
      logoEl.value.style.setProperty('--logo-shadow-y', shadowY + 'px')
    }

    if (shineEl.value) {
      const shineAngle = 148 + (curPRy * 12) - (curPRx * 12)
      shineEl.value.style.setProperty('--shine-angle', shineAngle.toFixed(1) + 'deg')
    }

    animId = requestAnimationFrame(loop)
  }

  function start() {
    document.addEventListener('mousemove', onMouse)
    animId = requestAnimationFrame(loop)
  }

  function stop() {
    cancelAnimationFrame(animId)
    document.removeEventListener('mousemove', onMouse)
  }

  return { start, stop }
}
