import { useRef, useMemo, useLayoutEffect } from 'react'
import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────────────────────────────────
   Espiga de lavanda low-poly con verticilos reales
   Clic → gira y rebota
───────────────────────────────────────────── */

// Colores de floretes variados
const FLORET_COLORS = [
  '#9B7FD4', // lavanda media
  '#C4A8E8', // lavanda clara
  '#7C5FC4', // lavanda oscura
  '#B8A0DC', // lila suave
  '#D4C2F0', // casi blanco lavanda
]

const dummy = new THREE.Object3D()

// Geometría compartida entre instancias
const OCTAHEDRON_GEO = new THREE.OctahedronGeometry(1, 0)

/* ── Spike (corona de floretes) con InstancedMesh ── */
function LavenderSpike({ scale = 1, color1 = '#9B7FD4', color2 = '#C4A8E8' }) {
  const ref1 = useRef()
  const ref2 = useRef()

  // Verticilos: cada uno define { y, count, r, size }
  const whorls = useMemo(() => [
    { y: 0.00, count: 2, r: 0.055, size: 0.052 },
    { y: 0.18, count: 3, r: 0.082, size: 0.062 },
    { y: 0.36, count: 4, r: 0.10,  size: 0.070 },
    { y: 0.52, count: 5, r: 0.105, size: 0.072 },
    { y: 0.68, count: 4, r: 0.095, size: 0.068 },
    { y: 0.82, count: 3, r: 0.075, size: 0.060 },
    { y: 0.94, count: 2, r: 0.050, size: 0.052 },
    { y: 1.04, count: 1, r: 0.000, size: 0.044 },
  ], [])

  // Dividir floretes en dos grupos (color1 par, color2 impar)
  const { group1, group2 } = useMemo(() => {
    const g1 = [], g2 = []
    let idx = 0
    whorls.forEach((w, wi) => {
      for (let i = 0; i < w.count; i++) {
        const angle = (i / w.count) * Math.PI * 2 + wi * 0.45
        const item = {
          x: Math.cos(angle) * w.r,
          y: w.y,
          z: Math.sin(angle) * w.r,
          s: w.size,
        }
        if (idx % 2 === 0) g1.push(item)
        else g2.push(item)
        idx++
      }
    })
    return { group1: g1, group2: g2 }
  }, [whorls])

  useLayoutEffect(() => {
    ;[
      { ref: ref1, items: group1 },
      { ref: ref2, items: group2 },
    ].forEach(({ ref, items }) => {
      if (!ref.current) return
      items.forEach((p, i) => {
        dummy.position.set(p.x, p.y, p.z)
        dummy.scale.setScalar(p.s)
        dummy.updateMatrix()
        ref.current.setMatrixAt(i, dummy.matrix)
      })
      ref.current.instanceMatrix.needsUpdate = true
    })
  }, [group1, group2])

  return (
    <group scale={scale} position={[0, 0.38, 0]}>
      <instancedMesh ref={ref1} args={[OCTAHEDRON_GEO, null, group1.length]}>
        <meshStandardMaterial color={color1} flatShading />
      </instancedMesh>
      <instancedMesh ref={ref2} args={[OCTAHEDRON_GEO, null, group2.length]}>
        <meshStandardMaterial color={color2} flatShading />
      </instancedMesh>
    </group>
  )
}

/* ── Planta completa ── */
function LavenderMesh({ colorIdx = 0, onClicked }) {
  const spikeRef  = useRef()
  const clickedAt = useRef(0)

  const c1 = FLORET_COLORS[colorIdx % FLORET_COLORS.length]
  const c2 = FLORET_COLORS[(colorIdx + 2) % FLORET_COLORS.length]

  useFrame(({ clock }) => {
    if (!spikeRef.current) return
    const elapsed = (Date.now() - clickedAt.current) / 1000
    if (elapsed < 1.4) {
      // Giro rápido que decelera
      spikeRef.current.rotation.y = elapsed * Math.PI * 5 * (1 - elapsed / 1.4)
    } else {
      spikeRef.current.rotation.y = 0
    }
    // Pequeño bamboleo natural permanente
    const t = clock.getElapsedTime()
    spikeRef.current.rotation.z = Math.sin(t * 0.8 + colorIdx) * 0.025
  })

  function handleClick(e) {
    e.stopPropagation()
    clickedAt.current = Date.now()
    onClicked?.()
  }

  return (
    <group onClick={handleClick}>
      {/* Tallo principal — cilindro 4 lados */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.015, 0.022, 1.55, 4]} />
        <meshStandardMaterial color="#5A4870" flatShading />
      </mesh>

      {/* Hojas lanceoladas en pares — parte baja */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.13, -0.78, 0]}
          rotation={[0.15, side * 0.3, side * -0.62]}
        >
          <coneGeometry args={[0.055, 0.32, 3]} />
          <meshStandardMaterial color="#6B5A8C" flatShading />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh
          key={side + 10}
          position={[side * 0.11, -0.52, 0.04]}
          rotation={[0.1, side * 0.2, side * -0.5]}
        >
          <coneGeometry args={[0.042, 0.26, 3]} />
          <meshStandardMaterial color="#7A688A" flatShading />
        </mesh>
      ))}

      {/* Corona de floretes */}
      <group ref={spikeRef}>
        <LavenderSpike color1={c1} color2={c2} />
      </group>
    </group>
  )
}

/* ── Export: acepta mismas props que antes ── */
export default function LowPolyFlower({
  position    = [0, 0, 0],
  rotation    = [0, 0, 0],
  scale       = 1,
  colorIdx    = 0,
  floatSpeed  = 1.4,
  floatIntensity = 0.35,
  rotIntensity   = 0.18,
  onClicked,
}) {
  return (
    <Float speed={floatSpeed} floatIntensity={floatIntensity} rotationIntensity={rotIntensity}>
      <group position={position} rotation={rotation} scale={scale}>
        <LavenderMesh colorIdx={colorIdx} onClicked={onClicked} />
      </group>
    </Float>
  )
}
