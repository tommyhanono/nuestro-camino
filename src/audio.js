// Música de fondo suave, generada con Web Audio (sin archivos, sin licencias).
// Un pad cálido y soñador. Apagado por defecto; se enciende con un gesto del usuario.
let ctx = null
let master = null
let nodes = []
let started = false

// Acorde suave (Re mayor add9): D2, A2, D3, F#3, E4
const CHORD = [73.42, 110.0, 146.83, 185.0, 329.63]

function ensure() {
  if (ctx) return
  const AC = window.AudioContext || window.webkitAudioContext
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.0001
  master.connect(ctx.destination)

  // Filtro cálido general
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 900
  lp.Q.value = 0.4
  lp.connect(master)

  // LFO lento que "respira" sobre el filtro
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.06
  lfoGain.gain.value = 260
  lfo.connect(lfoGain)
  lfoGain.connect(lp.frequency)
  lfo.start()
  nodes.push(lfo)

  CHORD.forEach((f, i) => {
    const osc = ctx.createOscillator()
    osc.type = i === 0 ? 'sine' : 'triangle'
    osc.frequency.value = f
    osc.detune.value = (i - 2) * 4 // leve desafinación para calidez

    const g = ctx.createGain()
    g.gain.value = i === 0 ? 0.5 : 0.28 / (i + 1)

    // vibrato de amplitud muy sutil, distinto por voz
    const amp = ctx.createOscillator()
    const ampGain = ctx.createGain()
    amp.frequency.value = 0.05 + i * 0.017
    ampGain.gain.value = g.gain.value * 0.35
    amp.connect(ampGain)
    ampGain.connect(g.gain)
    amp.start()

    osc.connect(g)
    g.connect(lp)
    osc.start()
    nodes.push(osc, amp)
  })
}

export function toggleMusic(on) {
  ensure()
  if (ctx.state === 'suspended') ctx.resume()
  started = true
  const now = ctx.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now)
  // fade in/out suave de 1.6s
  master.gain.exponentialRampToValueAtTime(on ? 0.14 : 0.0001, now + 1.6)
}

export function isAudioStarted() {
  return started
}
