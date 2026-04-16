import { useMemo, useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, useGLTF, Float, useAnimations } from '@react-three/drei'
import { Color, Box3, Vector3 } from 'three'
import { useTheme } from '../context/ThemeContext'
import wolfUrl from '../assets/3d/wolf.glb'

const isTouch = window.matchMedia('(pointer: coarse)').matches

/* Auto-fits camera to the wolf's bounding box */
function AutoCamera({ wolfRef }) {
  const { camera } = useThree()
  useEffect(() => {
    const fit = () => {
      if (!wolfRef.current) return
      const box = new Box3().setFromObject(wolfRef.current)
      const center = box.getCenter(new Vector3())
      const size   = box.getSize(new Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const fovRad = (camera.fov * Math.PI) / 180
      const dist   = (maxDim / 2 / Math.tan(fovRad / 2)) * 1.65
      camera.position.set(center.x * 0.1, center.y, Math.max(dist, 4.0))
      camera.lookAt(center.x, center.y, 0)
      camera.updateProjectionMatrix()
    }
    const id = setTimeout(fit, 100)
    return () => clearTimeout(id)
  }, [camera, wolfRef])
  return null
}

/* Wolf model with optional night tint */
function WolfModel({ nightTint = false, wolfRef }) {
  const { scene, animations } = useGLTF(wolfUrl)
  const obj = useMemo(() => {
    const clone = scene.clone(true)
    if (nightTint) {
      clone.traverse(child => {
        if (!child.isMesh || !child.material) return
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        const tinted = mats.map(m => {
          const mat = m.clone()
          mat.emissive          = new Color('#080828')
          mat.emissiveIntensity = 0.12
          mat.needsUpdate       = true
          return mat
        })
        child.material = Array.isArray(child.material) ? tinted : tinted[0]
      })
    }
    return clone
  }, [scene, nightTint])

  const ref = useRef()
  const { actions } = useAnimations(animations, ref)

  useEffect(() => {
    const preferred = ['Idle', 'Walk', 'idle', 'walk', 'Run', 'run']
    const pick = preferred.find(n => actions[n]) || Object.keys(actions)[0]
    const anim = actions[pick]
    if (anim) { anim.reset(); anim.play() }
  }, [actions])

  useEffect(() => { if (wolfRef) wolfRef.current = ref.current })

  return (
    <Float speed={0.5} floatIntensity={0.08} rotationIntensity={0.02}>
      <primitive ref={ref} object={obj} scale={1.9} position={[0, 0, 0]} rotation={[0, 0.3, 0]} />
    </Float>
  )
}
useGLTF.preload(wolfUrl)

/* ── DAY DECORATIONS ─────────────────────────────────────────────── */

/* Sun */
function Sun() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 0.8) * 0.02)
  })
  return (
    <group position={[8, 5.5, -20]}>
      <mesh>
        <sphereGeometry args={[1.4, 10, 8]} />
        <meshBasicMaterial color="#FFE880" transparent opacity={0.12} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.80, 14, 10]} />
        <meshBasicMaterial color="#FFE840" />
      </mesh>
    </group>
  )
}

/* Cloud — 2D billboard circles, flat, no lighting */
function Cloud({ position, scale = 1 }) {
  const ref  = useRef()
  const baseX = position[0]
  useFrame(({ clock }) => {
    if (ref.current)
      ref.current.position.x = baseX + Math.sin(clock.getElapsedTime() * 0.04 + position[2]) * 0.5
  })
  const mat = <meshBasicMaterial color="#FFFFFF" transparent opacity={0.84} depthWrite={false} />
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, -0.22, 0]}>
        <planeGeometry args={[1.30, 0.38]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.80} depthWrite={false} />
      </mesh>
      <mesh position={[ 0.00,  0.00, 0.01]}><circleGeometry args={[0.52, 14]} />{mat}</mesh>
      <mesh position={[-0.48, -0.08, 0.01]}><circleGeometry args={[0.36, 12]} />{mat}</mesh>
      <mesh position={[ 0.48, -0.06, 0.01]}><circleGeometry args={[0.38, 12]} />{mat}</mesh>
      <mesh position={[-0.20,  0.26, 0.01]}><circleGeometry args={[0.28, 11]} />{mat}</mesh>
      <mesh position={[ 0.22,  0.24, 0.01]}><circleGeometry args={[0.26, 11]} />{mat}</mesh>
    </group>
  )
}

/* Butterfly with two animating wings */
function Butterfly({ x, y, z, col, sp, ph }) {
  const group = useRef()
  const left  = useRef()
  const right = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * sp + ph
    if (group.current) {
      group.current.position.x = x + Math.sin(t * 0.44) * 0.9
      group.current.position.y = y + Math.sin(t * 0.66) * 0.45
      group.current.rotation.y = Math.sin(t * 0.7) * 0.45
    }
    const flap = Math.sin(t * 5) * 0.72
    if (left.current)  left.current.rotation.z  =  0.25 + flap
    if (right.current) right.current.rotation.z = -0.25 - flap
  })
  return (
    <group ref={group} position={[x, y, z]}>
      <mesh>
        <cylinderGeometry args={[0.016, 0.010, 0.15, 5]} />
        <meshBasicMaterial color="#4A2A18" />
      </mesh>
      <mesh ref={left}  position={[-0.15, 0.01, 0]} rotation={[0, 0,  0.25]}>
        <planeGeometry args={[0.30, 0.20]} />
        <meshBasicMaterial color={col} side={2} transparent opacity={0.90} />
      </mesh>
      <mesh ref={right} position={[ 0.15, 0.01, 0]} rotation={[0, 0, -0.25]}>
        <planeGeometry args={[0.30, 0.20]} />
        <meshBasicMaterial color={col} side={2} transparent opacity={0.90} />
      </mesh>
    </group>
  )
}

function Butterflies() {
  const items = useMemo(() => [
    /* esquinas y bordes — cubren top/bottom/left/right */
    { x: -6.5, y: -1.5, z: -1.5, col: '#FF80C0', sp: 1.1,  ph: 0.0 }, // bajo izq
    { x:  6.0, y: -1.0, z: -1.8, col: '#C0FF80', sp: 1.15, ph: 2.8 }, // bajo der
    { x: -5.5, y:  5.5, z: -2.5, col: '#FFC080', sp: 0.85, ph: 4.2 }, // alto izq
    { x:  5.5, y:  5.0, z: -2.0, col: '#90F0FF', sp: 0.75, ph: 1.8 }, // alto der
    /* centro disperso */
    { x: -3.5, y:  1.5, z: -1.2, col: '#80CFFF', sp: 0.9,  ph: 1.2 },
    { x: -1.0, y:  3.5, z: -1.5, col: '#FFDE60', sp: 1.3,  ph: 2.4 },
    { x:  1.5, y:  0.2, z: -1.8, col: '#AEFF90', sp: 0.8,  ph: 0.7 },
    { x:  3.5, y:  3.8, z: -2.5, col: '#FFB0F0', sp: 1.0,  ph: 3.1 },
    { x: -2.0, y: -0.8, z: -2.0, col: '#FFE080', sp: 0.95, ph: 5.0 }, // extra bajo
    { x:  2.0, y:  6.2, z: -3.0, col: '#FF90D0', sp: 0.70, ph: 3.8 }, // extra alto
  ], [])
  return <>{items.map((b, i) => <Butterfly key={i} {...b} />)}</>
}

/* Birds gliding across the full sky */
function Bird({ startX, y, z, speed, phase }) {
  const group = useRef()
  const lw = useRef()
  const rw = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const drift = ((startX + t * speed * 0.8 + 16) % 32) - 16
    if (group.current) {
      group.current.position.x = drift
      group.current.position.y = y + Math.sin(t * speed * 2 + phase) * 0.1
    }
    const flap = Math.sin(t * speed * 5 + phase) * 0.5
    if (lw.current) lw.current.rotation.z =  flap + 0.2
    if (rw.current) rw.current.rotation.z = -flap - 0.2
  })
  return (
    <group ref={group} position={[startX, y, z]}>
      <mesh ref={lw} position={[-0.09, 0, 0]} rotation={[0, 0,  0.2]}>
        <planeGeometry args={[0.16, 0.055]} />
        <meshBasicMaterial color="#2A2820" side={2} transparent opacity={0.65} />
      </mesh>
      <mesh ref={rw} position={[ 0.09, 0, 0]} rotation={[0, 0, -0.2]}>
        <planeGeometry args={[0.16, 0.055]} />
        <meshBasicMaterial color="#2A2820" side={2} transparent opacity={0.65} />
      </mesh>
    </group>
  )
}

function Birds() {
  const birds = useMemo(() => [
    { startX: -12, y: 5.8, z: -8,  speed: 0.50, phase: 0.0 }, // alto
    { startX: -10, y: 6.2, z: -8,  speed: 0.48, phase: 0.5 }, // alto
    { startX: -11, y: 5.5, z: -9,  speed: 0.45, phase: 1.0 }, // alto
    { startX:  -2, y: 6.5, z: -12, speed: 0.42, phase: 2.0 }, // muy alto
    { startX:   2, y: 6.0, z: -12, speed: 0.38, phase: 2.5 }, // muy alto
    { startX:   8, y: 5.2, z: -10, speed: 0.55, phase: 3.2 }, // alto
  ], [])
  return <>{birds.map((b, i) => <Bird key={i} {...b} />)}</>
}

/* Pollen */
function Pollen() {
  const count = 80
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i*3]   = (Math.random() - 0.5) * 24  // x amplio
      arr[i*3+1] = Math.random() * 10 - 2       // y: -2 a +8 (cubre top a bottom)
      arr[i*3+2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [])
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.022
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.042} color="#FFE580" transparent opacity={0.55} sizeAttenuation />
    </points>
  )
}

/* ── NIGHT DECORATIONS ───────────────────────────────────────────── */
function Moon() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.04
  })
  return (
    <mesh ref={ref} position={[-5, 4.0, -13]}>
      <sphereGeometry args={[0.62, 20, 14]} />
      <meshStandardMaterial color="#DDD5C0" roughness={0.95} emissive="#C0B898" emissiveIntensity={0.18} />
    </mesh>
  )
}

function Planet() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.09
  })
  return (
    <group ref={ref} position={[5.8, 3.2, -17]}>
      <mesh>
        <sphereGeometry args={[0.38, 16, 12]} />
        <meshStandardMaterial color="#A055FF" roughness={0.45} metalness={0.15} emissive="#3010A0" emissiveIntensity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI * 0.24, 0.4, 0]}>
        <torusGeometry args={[0.65, 0.065, 4, 38]} />
        <meshStandardMaterial color="#7030BB" roughness={0.6} transparent opacity={0.72} />
      </mesh>
    </group>
  )
}

function Nebula() {
  const count = 90
  const pos1 = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = 4 + Math.random() * 9
      arr[i*3]   = Math.cos(theta) * r
      arr[i*3+1] = (Math.random() - 0.5) * 7
      arr[i*3+2] = Math.sin(theta) * r * 0.5 - 5
    }
    return arr
  }, [])
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.012
  })
  return (
    <>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={pos1} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.09} color="#7030FF" transparent opacity={0.25} sizeAttenuation depthWrite={false} />
      </points>
      <points rotation={[0.2, 1.1, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={pos1} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.07} color="#FF30B0" transparent opacity={0.18} sizeAttenuation depthWrite={false} />
      </points>
    </>
  )
}

/* ── DARK SCENE ──────────────────────────────────────────────────── */
function DarkScene({ wolfRef }) {
  return (
    <>
      <color attach="background" args={['#04020E']} />
      <ambientLight intensity={1.2} color="#6050C0" />
      <pointLight position={[2,  5, 4]}  intensity={6.0} color="#C0B0FF" distance={20} decay={1.4} />
      <pointLight position={[-4, 2, 3]}  intensity={3.5} color="#FF80D0" distance={16} decay={2} />
      <pointLight position={[0,  3, -4]} intensity={2.0} color="#5090FF" distance={18} decay={2} />
      <Stars radius={55} depth={30} count={450} factor={3.5} saturation={0.9} fade speed={0.15} />
      <Nebula />
      <Moon />
      <Planet />
      <fog attach="fog" args={['#06021A', 11, 30]} />
      <WolfModel nightTint wolfRef={wolfRef} />
      <AutoCamera wolfRef={wolfRef} />
    </>
  )
}

/* ── LIGHT SCENE ─────────────────────────────────────────────────── */
function LightScene({ wolfRef }) {
  return (
    <>
      <color attach="background" args={['#6AB8EA']} />
      <ambientLight intensity={1.5} color="#D0EEFF" />
      <directionalLight position={[6, 8, 4]} intensity={2.8} color="#FFF8E0" />
      <pointLight position={[-3, 2, 5]} intensity={0.9} color="#D8F4FF" distance={18} decay={2} />
      <Sun />

      {/* Clouds — spread top to bottom, left to right */}
      <Cloud position={[-8.0, -1.0, -10]} scale={0.65} />
      <Cloud position={[ 7.5, -0.5, -11]} scale={0.70} />
      <Cloud position={[-6.0,  1.5, -14]} scale={0.90} />
      <Cloud position={[ 5.5,  2.0, -13]} scale={0.85} />
      <Cloud position={[-2.0,  3.5, -17]} scale={1.10} />
      <Cloud position={[ 2.5,  4.5, -16]} scale={1.00} />
      <Cloud position={[-7.5,  5.0, -20]} scale={1.30} />
      <Cloud position={[ 6.0,  5.8, -22]} scale={1.40} />
      <Cloud position={[ 0.0,  6.5, -25]} scale={1.70} />
      <Cloud position={[-4.0,  7.0, -23]} scale={1.20} />
      <Cloud position={[ 8.0,  3.5, -18]} scale={0.95} />
      <Cloud position={[-9.0,  3.0, -12]} scale={0.80} />

      <Butterflies />
      <Birds />
      <Pollen />
      <fog attach="fog" args={['#A8D8F0', 16, 35]} />
      <WolfModel wolfRef={wolfRef} />
      <AutoCamera wolfRef={wolfRef} />
    </>
  )
}

/* ── MAIN COMPONENT ──────────────────────────────────────────────── */
export default function About3D() {
  const { theme } = useTheme()
  const isDark = theme === 'dark' ||
    (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const [activeScene, setActiveScene] = useState(isDark ? 'dark' : 'light')
  const [overlayVisible, setOverlayVisible] = useState(false)
  const prevDark = useRef(isDark)
  const wolfRef  = useRef(null)

  useEffect(() => {
    if (prevDark.current === isDark) return
    prevDark.current = isDark
    setOverlayVisible(true)
    const t1 = setTimeout(() => setActiveScene(isDark ? 'dark' : 'light'), 250)
    const t2 = setTimeout(() => setOverlayVisible(false), 500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isDark])

  const overlayColor = isDark ? '#04020E' : '#6AB8EA'

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 70 }}
        gl={{ antialias: !isTouch, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1]}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          {activeScene === 'dark'
            ? <DarkScene wolfRef={wolfRef} />
            : <LightScene wolfRef={wolfRef} />}
        </Suspense>
      </Canvas>
      <div style={{
        position: 'absolute', inset: 0,
        background: overlayColor,
        opacity: overlayVisible ? 1 : 0,
        transition: 'opacity 0.25s ease',
        pointerEvents: 'none',
        borderRadius: 'inherit',
      }} />
    </div>
  )
}
