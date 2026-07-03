import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { STOPS } from './data.js'
import { toggleMusic } from './audio.js'

const N = STOPS.length

function Caption({ stop, index }) {
  return (
    <div className="caption" key={index}>
      <div className="cap-index">{index + 1} / {N}</div>
      <div className="cap-date">{stop.date}</div>
      <h2 className="cap-title">{stop.title}</h2>
      <p className="cap-msg">{stop.msg}</p>
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [started, setStarted] = useState(false)
  const [active, setActive] = useState(-1)
  const [paused, setPaused] = useState(false)
  const [ended, setEnded] = useState(false)
  const [showEnd, setShowEnd] = useState(false)
  const [muted, setMuted] = useState(true)

  const expRef = useRef(null)
  const progRef = useRef(null)

  // Asegura que el <Canvas> mida su contenedor en cualquier navegador/dispositivo
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'))
    fire()
    const raf = requestAnimationFrame(fire)
    const t = setTimeout(fire, 350)
    return () => { cancelAnimationFrame(raf); clearTimeout(t) }
  }, [])

  const handleActive = useCallback((i) => setActive(i), [])
  const handleComplete = useCallback(() => {
    setEnded(true)
    setTimeout(() => setShowEnd(true), 1500)
  }, [])
  const handleProgress = useCallback((p) => {
    if (progRef.current) progRef.current.style.transform = `scaleX(${p})`
  }, [])

  const begin = () => {
    if (!loaded) return
    setStarted(true)
    setActive(0)
  }
  const togglePause = () => {
    if (!expRef.current) return
    if (paused) { expRef.current.resume(); setPaused(false) }
    else { expRef.current.pause(); setPaused(true) }
  }
  const doRestart = () => {
    setActive(0); setEnded(false); setShowEnd(false); setPaused(false)
    expRef.current && expRef.current.restart()
  }
  const toggleMute = () => {
    const m = !muted
    setMuted(m)
    toggleMusic(!m) // on = reproduciendo = !muted
  }

  return (
    <div className="stage">
      <Canvas
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 55, near: 0.1, far: 600, position: [0, 5, 22] }}
      >
        <Suspense fallback={null}>
          <Experience
            ref={expRef}
            started={started}
            onActive={handleActive}
            onComplete={handleComplete}
            onProgress={handleProgress}
            onReady={() => setLoaded(true)}
          />
        </Suspense>
      </Canvas>

      {/* Degradado inferior para que el texto se lea sobre la foto */}
      {started && !showEnd && <div className="bottom-scrim" />}

      {/* Subtítulo del recuerdo actual */}
      {started && active >= 0 && !showEnd && (
        <Caption stop={STOPS[active]} index={active} />
      )}

      {/* Barra de progreso del viaje */}
      {started && !ended && (
        <div className="progress"><span ref={progRef} /></div>
      )}

      {/* Controles discretos */}
      {started && !showEnd && (
        <div className="controls">
          {!ended && (
            <button className="ctrl" onClick={togglePause} aria-label={paused ? 'Reanudar' : 'Pausar'}>
              {paused ? '►' : 'II'}
            </button>
          )}
          <button className="ctrl" onClick={doRestart} aria-label="Volver a empezar">↺</button>
          <button className="ctrl" onClick={toggleMute} aria-label={muted ? 'Activar música' : 'Silenciar'}>
            {muted ? '♪̸' : '♪'}
          </button>
        </div>
      )}

      {/* Intro */}
      {!started && (
        <div className="intro">
          <div className="intro-inner">
            <div className="intro-kicker">Para Vicky</div>
            <h1 className="intro-title">Nuestro Camino</h1>
            <p className="intro-sub">Un recorrido por nuestra historia, para cuando me extrañes 💙</p>
            {loaded ? (
              <button className="start-btn" onClick={begin}>Toca para comenzar nuestro viaje 💙</button>
            ) : (
              <div className="loading">Preparando los recuerdos…</div>
            )}
          </div>
        </div>
      )}

      {/* Final tranquilo */}
      {showEnd && (
        <div className="ending">
          <div className="ending-inner">
            <div className="ending-star">✦</div>
            <h2 className="ending-title">Nuestro camino apenas empieza</h2>
            <p className="ending-msg">
              Gracias por caminarlo conmigo. Estés donde estés, yo ya te estoy extrañando de vuelta a casa. Te amo. 💙
            </p>
            <div className="ending-btns">
              <button className="start-btn" onClick={doRestart}>Volver a empezar ↺</button>
              <button className="ghost-btn" onClick={() => setShowEnd(false)}>Quedarme un rato 💙</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
