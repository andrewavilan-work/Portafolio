import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/* Tech Atom — glowing sphere + orbiting ring, coloured by technology */
function TechAtom({ position, color, orbitColor, size, speed, phase, tilt = 0 }) {
  const group = useRef()
  const ring  = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(t * speed * 0.6 + phase) * 0.28
      group.current.rotation.y = t * speed * 0.25
    }
    if (ring.current) {
      ring.current.rotation.z = t * speed * 1.1
    }
  })

  return (
    <group ref={group} position={position}>
      {/* Glowing core */}
      <mesh>
        <sphereGeometry args={[size, 12, 9]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.25}
          metalness={0.55}
        />
      </mesh>
      {/* Electron orbit ring */}
      <mesh ref={ring} rotation={[Math.PI / 2 + tilt, 0, 0]}>
        <torusGeometry args={[size * 2.6, size * 0.11, 4, 40]} />
        <meshStandardMaterial
          color={orbitColor}
          roughness={0.35}
          metalness={0.65}
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  )
}

/* Background particle constellation */
function Constellation() {
  const count = isTouch ? 40 : 70
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 26
      arr[i * 3 + 1] = (Math.random() - 0.5) * 13
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return arr
  }, [])
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.007
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#A07EE8" transparent opacity={0.45} sizeAttenuation />
    </points>
  )
}

/*
  Each atom uses the official brand color of its technology.
  React → cyan,  JS → yellow,  Python → blue,  Git → red,
  Vite  → purple-magenta,  Framer → blue,  GSAP → green, accent → orange
*/
const ATOMS = [
  { pos: [-6.5,  1.5,  0], c: '#61DAFB', oc: '#3BBDDE', s: 0.22, sp: 0.40, ph: 0.0, tilt: 0.3 }, // React
  { pos: [ 6.2, -1.0,  0], c: '#F7DF1E', oc: '#C4B010', s: 0.20, sp: 0.55, ph: 1.0, tilt: 0.5 }, // JavaScript
  { pos: [-4.0, -2.5,  0], c: '#D4845A', oc: '#B06038', s: 0.16, sp: 0.45, ph: 2.0, tilt: 0.8 }, // accent / Python
  { pos: [ 4.8,  2.5,  0], c: '#BD34FE', oc: '#9010D0', s: 0.18, sp: 0.30, ph: 3.0, tilt: 0.2 }, // Vite purple
  { pos: [ 0.5,  3.4, -1], c: '#0AE448', oc: '#08B838', s: 0.15, sp: 0.50, ph: 1.5, tilt: 1.0 }, // GSAP green
  { pos: [-2.5, -3.5,  0], c: '#7C3AED', oc: '#5C2EBD', s: 0.14, sp: 0.40, ph: 2.5, tilt: 0.6 }, // purple brand
]

export default function SkillsCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 65 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'default' }}
      dpr={[1, 1]}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5,  6,  5]} intensity={2.5} color="#C8B0FF" distance={22} decay={1.5} />
      <pointLight position={[-4, -3, 3]} intensity={1.2} color="#FF9060" distance={16} decay={2}   />

      {ATOMS.map((a, i) => (
        <TechAtom
          key={i}
          position={a.pos}
          color={a.c}
          orbitColor={a.oc}
          size={a.s}
          speed={a.sp}
          phase={a.ph}
          tilt={a.tilt}
        />
      ))}

      <Constellation />
    </Canvas>
  )
}
