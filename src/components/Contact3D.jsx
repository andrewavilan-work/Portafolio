import { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useTheme } from '../context/ThemeContext'

/* Floating orbs — replaces heavy astronaut GLB */
function FloatingOrbs({ isDark }) {
  const count = 35
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i*3]   = (Math.random() - 0.5) * 8
      arr[i*3+1] = (Math.random() - 0.5) * 6
      arr[i*3+2] = (Math.random() - 0.5) * 4
    }
    return arr
  }, [])
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.05
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.03) * 0.1
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color={isDark ? '#A060FF' : '#FF9040'}
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  )
}

export default function Contact3D() {
  const { theme } = useTheme()
  const isDark = theme === 'dark' ||
    (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const [activeScene, setActiveScene] = useState(isDark ? 'dark' : 'light')
  const [overlayVisible, setOverlayVisible] = useState(false)
  const prevDark = useRef(isDark)

  useEffect(() => {
    if (prevDark.current === isDark) return
    prevDark.current = isDark
    setOverlayVisible(true)
    const t1 = setTimeout(() => setActiveScene(isDark ? 'dark' : 'light'), 250)
    const t2 = setTimeout(() => setOverlayVisible(false), 500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isDark])

  const overlayColor = isDark ? '#0D0A18' : '#FAF8FF'
  const dark = activeScene === 'dark'

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'default' }}
        dpr={[1, 1]}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={dark ? 0.4 : 0.8} />
          <pointLight
            position={[4, 4, 3]}
            intensity={dark ? 3 : 2.5}
            color={dark ? '#8040FF' : '#FFD080'}
          />
          <pointLight
            position={[-3, -2, 4]}
            intensity={dark ? 1.2 : 1.0}
            color={dark ? '#40C0FF' : '#FF8040'}
          />
          {dark && <Stars radius={30} depth={15} count={150} factor={2.5} fade speed={0.4} />}
          <FloatingOrbs isDark={dark} />
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
