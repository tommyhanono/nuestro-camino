import { forwardRef, useImperativeHandle, useMemo, useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useTexture, Sparkles, Stars, Float, RoundedBox } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'
import { STOPS, SPACING, SIDE_X, PHOTO_Y, readTime } from './data.js'

const BASE = import.meta.env.BASE_URL
const urls = STOPS.map((s) => `${BASE}assets/${s.img}.jpg`)

// posición de cada foto a lo largo del camino, alternando lados
function stopPos(i) {
  const x = (i % 2 === 0 ? -1 : 1) * SIDE_X
  const z = -i * SPACING
  return { x, y: PHOTO_Y, z }
}

// keyframe de cámara para "llegar" a la foto i y quedar mirándola
function camKey(i) {
  const p = stopPos(i)
  return {
    px: p.x * 0.28,
    py: 2.95,
    pz: p.z + 9.5,
    tx: p.x * 0.82,
    ty: 2.15,
    tz: p.z - 0.6,
  }
}

const N = STOPS.length
const CENTER_Z = -((N - 1) * SPACING) / 2
const INTRO = { px: 0.4, py: 5.6, pz: 22, tx: -SIDE_X * 0.8, ty: 2.2, tz: 0 }
const OVERVIEW = { px: 0, py: 15, pz: CENTER_Z + 78, tx: 0, ty: 0.5, tz: CENTER_Z + 6 }

function Photo({ tex, i }) {
  const p = stopPos(i)
  const rotY = (i % 2 === 0 ? 1 : -1) * 0.5
  const { w, h } = useMemo(() => {
    const img = tex.image
    const aspect = img && img.width ? img.width / img.height : 0.75
    const height = 5.1
    let width = Math.min(height * aspect, 8.2)
    return { w: width, h: height }
  }, [tex])

  return (
    <group position={[p.x, p.y, p.z]} rotation={[0, rotY, 0]}>
      <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.28} floatingRange={[-0.12, 0.12]}>
        {/* marco dorado que brilla (con bloom) */}
        <RoundedBox args={[w + 0.42, h + 0.42, 0.22]} radius={0.16} smoothness={4} position={[0, 0, -0.13]}>
          <meshStandardMaterial color="#120c04" emissive="#e6c893" emissiveIntensity={1.15} roughness={0.35} metalness={0.6} />
        </RoundedBox>
        {/* borde interior fino */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[w + 0.12, h + 0.12]} />
          <meshBasicMaterial color="#0a1226" />
        </mesh>
        {/* la foto */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
        <Sparkles count={10} scale={[w + 1.4, h + 1.4, 1]} size={2.2} speed={0.3} color="#f0d9a8" opacity={0.7} />
      </Float>
    </group>
  )
}

function GlowPath() {
  // línea central que brilla y se pierde en la niebla
  const len = (N - 0.2) * SPACING + 30
  return (
    <group position={[0, 0.02, CENTER_Z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, len]} />
        <meshBasicMaterial color="#e6c893" toneMapped={false} transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[3.4, len]} />
        <meshBasicMaterial color="#6f5a2e" toneMapped={false} transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

const Experience = forwardRef(function Experience(
  { started, onActive, onComplete, onProgress, onReady },
  ref
) {
  const textures = useTexture(urls)
  const { camera } = useThree()

  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
      t.needsUpdate = true
    })
  }, [textures])

  // Este effect corre sólo cuando la escena ya montó = texturas cargadas
  useEffect(() => {
    onReady && onReady()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cam = useRef({ ...INTRO })
  const tlRef = useRef(null)
  const outroDone = useRef(false)
  const startedRef = useRef(false)

  // API para los controles (pausar / reanudar / reiniciar)
  useImperativeHandle(ref, () => ({
    pause() {
      tlRef.current && tlRef.current.pause()
    },
    resume() {
      tlRef.current && tlRef.current.resume()
    },
    restart() {
      outroDone.current = false
      gsap.killTweensOf(cam.current)
      Object.assign(cam.current, INTRO)
      if (tlRef.current) tlRef.current.restart()
    },
  }))

  // construir el viaje una vez que arranca
  useEffect(() => {
    if (!started || tlRef.current) return
    startedRef.current = true
    const tl = gsap.timeline({
      onComplete: () => {
        // final tranquilo: alejarse suave para ver todo el camino
        gsap.to(cam.current, {
          ...OVERVIEW,
          duration: 7,
          ease: 'power1.inOut',
          onComplete: () => {
            outroDone.current = true
          },
        })
        onComplete && onComplete()
      },
    })
    STOPS.forEach((s, i) => {
      tl.to(cam.current, {
        px: camKey(i).px, py: camKey(i).py, pz: camKey(i).pz,
        tx: camKey(i).tx, ty: camKey(i).ty, tz: camKey(i).tz,
        duration: i === 0 ? 3.4 : 3.7,
        ease: 'power2.inOut',
        onStart: () => onActive && onActive(i),
      })
      tl.to({}, { duration: readTime(s.msg) }) // pausa para leer con calma
    })
    tlRef.current = tl
    if (import.meta.env.DEV) window.__tl = tl // sólo para verificación en dev
    return () => {
      tl.kill()
    }
  }, [started, onActive, onComplete])

  useFrame((state) => {
    const c = cam.current
    let ox = 0, oy = 0, oz = 0
    const t = state.clock.elapsedTime
    if (!startedRef.current) {
      // leve deriva en la intro
      ox = Math.sin(t * 0.25) * 0.5
      oy = Math.sin(t * 0.2) * 0.25
    } else if (outroDone.current) {
      // órbita lenta y soñadora en el final
      ox = Math.sin(t * 0.13) * 4.5
      oy = Math.sin(t * 0.1) * 1.2
      oz = Math.cos(t * 0.11) * 3.0
    }
    state.camera.position.set(c.px + ox, c.py + oy, c.pz + oz)
    state.camera.lookAt(c.tx, c.ty, c.tz)

    if (onProgress && tlRef.current) onProgress(tlRef.current.progress())
  })

  return (
    <>
      <color attach="background" args={['#070f22']} />
      <fog attach="fog" args={['#0a1730', 16, 165]} />

      <ambientLight intensity={0.65} />
      <pointLight position={[0, 10, 12]} intensity={40} color="#ffe6b0" distance={80} decay={1.6} />
      <pointLight position={[0, 6, CENTER_Z]} intensity={30} color="#5b7cc0" distance={120} decay={1.4} />

      <Stars radius={120} depth={80} count={2600} factor={4} saturation={0} fade speed={0.6} />
      <Sparkles count={90} scale={[46, 22, (N + 2) * SPACING]} position={[0, 6, CENTER_Z]} size={2.6} speed={0.25} color="#e9cf9c" opacity={0.55} />
      <GlowPath />

      {textures.map((tex, i) => (
        <Photo key={i} tex={tex} i={i} />
      ))}

      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom intensity={1.15} luminanceThreshold={0.18} luminanceSmoothing={0.9} mipmapBlur radius={0.72} />
        <Vignette eskil={false} offset={0.28} darkness={0.72} />
      </EffectComposer>
    </>
  )
})

export default Experience
