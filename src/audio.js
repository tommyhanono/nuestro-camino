// Música de fondo: la canción "New Recording 14" (elegida por Tommy).
// Reproduce en loop, con fade suave. Se controla en sincronía con el viaje.
const SRC = `${import.meta.env.BASE_URL}assets/song.mp3`
const SRC_FALLBACK = `${import.meta.env.BASE_URL}assets/song.m4a`
const VOL = 0.85

let el = null
let fadeTimer = null

function ensure() {
  if (el) return el
  el = new Audio()
  // elige el formato que el navegador pueda reproducir
  el.src = el.canPlayType('audio/mpeg') ? SRC : SRC_FALLBACK
  el.loop = true
  el.preload = 'auto'
  el.volume = 0
  return el
}

function fadeTo(target, ms = 800) {
  const a = ensure()
  if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null }
  const start = a.volume
  const t0 = performance.now()
  fadeTimer = setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / ms)
    a.volume = start + (target - start) * k
    if (k >= 1) { clearInterval(fadeTimer); fadeTimer = null }
  }, 40)
}

// Empezar/continuar la reproducción (debe llamarse desde un gesto del usuario)
export function musicPlay() {
  const a = ensure()
  const p = a.play()
  if (p && p.catch) p.catch(() => {})
}

// Pausar (congela la posición para mantener la sincronía con el viaje)
export function musicPause() {
  if (el) el.pause()
}

// Silenciar / activar sin cortar (mantiene la posición sincronizada)
export function musicSetMuted(muted) {
  ensure()
  fadeTo(muted ? 0 : VOL, 700)
}

// Volver al principio de la canción
export function musicRestart() {
  if (el) { try { el.currentTime = 0 } catch (e) {} }
}
