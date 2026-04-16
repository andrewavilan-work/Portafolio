import { useRef, useMemo, useCallback, useLayoutEffect, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, useGLTF } from '@react-three/drei'
import { Object3D, AdditiveBlending, BufferGeometry, BufferAttribute, Color } from 'three'
import { useTheme } from '../context/ThemeContext'
import pastoUrl from '../assets/3d/pasto.glb'
import centroOscuroUrl from '../assets/3d/centro_oscuro.glb'
// import florUrl         from '../assets/3d/parte superior flor.glb' // Removed for performance

const isTouch = window.matchMedia('(pointer: coarse)').matches

/* ─── Geometría pájaro (plano XY, cara a cámara) ──────────────── */
const _birdGeo = (() => {
  const g = new BufferGeometry()
  const v = new Float32Array([
    -1.00, 0.30, 0, -1.00, -0.06, 0, -0.20, 0.00, 0, -0.20, -0.16, 0,
    0.20, 0.00, 0, 0.20, -0.16, 0, 1.00, 0.30, 0, 1.00, -0.06, 0,
  ])
  g.setAttribute('position', new BufferAttribute(v, 3))
  g.setIndex(new BufferAttribute(new Uint16Array([0, 2, 1, 1, 2, 3, 2, 4, 3, 3, 4, 5, 4, 6, 5, 5, 6, 7]), 1))
  g.computeVertexNormals()
  return g
})()

function zeroAll(mesh, n, d) {
  d.position.set(0, -999, 0); d.scale.set(0, 0, 0); d.updateMatrix()
  for (let i = 0; i < n; i++) mesh.setMatrixAt(i, d.matrix)
  mesh.instanceMatrix.needsUpdate = true
}

/* ─── Sakura: ramas y copa ────────────────────────────────────── */
const BR = [
  [2.35, 1.12, 1.90, -1, 0.25], [2.50, 1.08, 1.75, 1, -0.22],
  [2.70, 1.20, 1.45, -1, -0.55], [2.80, 1.15, 1.38, 1, 0.50],
  [3.00, 1.32, 1.08, -1, 0.12], [3.10, 1.26, 1.00, 1, -0.15],
  [3.25, 0.88, 0.80, -1, 0.08], [3.28, 0.85, 0.76, 1, -0.08],
]
const CROWN = [
  ...BR.flatMap(([yj, a, len, dir], bi) => {
    const tx = dir * Math.sin(a) * len, ty = yj + Math.cos(a) * len
    return [
      [tx, ty + 0.08, 0, 0.78, '#FFB5CC', 0.93],
      [tx * 0.70, ty + 0.42, 0, 0.60, '#FFC0D5', 0.91],
      [tx * 0.45, ty + 0.72, 0, 0.48, '#FFD0E0', 0.90],
      ...(bi < 4 ? [[tx * 1.18, ty - 0.08, 0, 0.40, '#FF9BB5', 0.88]] : []),
    ]
  }),
  [0, 3.72, 0, 1.00, '#FFB0C8', 0.94], [0, 4.25, 0, 0.82, '#FFC5D8', 0.93],
  [0, 4.68, 0, 0.64, '#FFD0E2', 0.94], [0, 5.00, 0, 0.46, '#FFE0EC', 0.95],
]

/* ─── Pétalos cayendo ──────────────────────────────────────────── */
const FALL_N = 16
const _fall = Array.from({ length: FALL_N }, () => {
  const oy = 2.2 + Math.random() * 3.2, spd = 0.26 + Math.random() * 0.40
  return {
    ox: (Math.random() - .5) * 3.2, oy, oz: (Math.random() - .5) * 2.6,
    speed: spd, dur: oy / spd, ph: Math.random() * 120,
    swx: .18 + Math.random() * .28, swspd: .7 + Math.random() * .9, swph: Math.random() * Math.PI * 2
  }
})

/* ─── Luciérnagas ──────────────────────────────────────────────── */
const FF_N = 24
const _ff = Array.from({ length: FF_N }, () => ({
  bx: (Math.random() - .5) * 26, by: .4 + Math.random() * 2.8, bz: -(Math.random() * 13 + .5),
  sx: .35 + Math.random() * .5, sy: .28 + Math.random() * .4, sz: .30 + Math.random() * .42,
  px: Math.random() * Math.PI * 2, py: Math.random() * Math.PI * 2, pz: Math.random() * Math.PI * 2,
  drift: .010 + Math.random() * .014,
}))

/* ─── Nubes ────────────────────────────────────────────────────── */
const CLOUDS = [
  { x: -14, y: 7.5, z: -22, s: 1.30, spd: .018 }, { x: 6, y: 9.0, z: -30, s: 1.05, spd: .012 },
  { x: -4, y: 6.5, z: -19, s: 0.85, spd: .024 }, { x: 15, y: 8.2, z: -26, s: 1.15, spd: .015 },
  { x: -8, y: 5.8, z: -17, s: 0.72, spd: .028 },
]
const PUFFS = [
  [0, 0, 0, .90], [-.88, -.20, 0, .72], [.88, -.18, 0, .68], [-.36, .33, 0, .62],
  [.42, .28, 0, .58], [1.38, .05, 0, .52], [-1.28, .08, 0, .50], [.05, .57, 0, .42],
]

/* ─── Fuegos artificiales — 8 shells, cohete + explosión ─────── */
const FW_SHELLS = 6
const FW_PER = 80
const FW_TOTAL = FW_SHELLS * FW_PER
const ROCKET_DUR = 0.35           // segundos que sube el cohete
const FW_PALETTE = [
  [1.0, 0.10, 0.10], [1.0, 0.80, 0.05], [1.0, 0.25, 0.95], [0.10, 0.88, 1.0],
  [0.72, 0.18, 1.0], [1.0, 0.55, 0.10], [0.20, 1.0, 0.55], [1.0, 1.0, 0.75],
]
const _shells = Array.from({ length: FW_SHELLS }, (_, i) => ({
  delay: (i + 1) * 0.30,                                       // 0.30 → 2.40 s
  px: (i - 2.5) * 3.2 + (Math.random() - .5) * 1.5,
  py: 4.0 + Math.random() * 2.8,
  pz: -5 - Math.random() * 5,
  col: FW_PALETTE[i],
  particles: Array.from({ length: FW_PER }, () => {
    const phi = Math.random() * Math.PI * 2, theta = Math.acos(2 * Math.random() - 1)
    const spd = 3.2 + Math.random() * 3.8
    return {
      vx: Math.sin(theta) * Math.cos(phi) * spd,
      vy: Math.abs(Math.cos(theta)) * spd + 1.0,
      vz: Math.sin(theta) * Math.sin(phi) * spd * 0.40,
    }
  }),
}))

/* ─── Estrellas fugaces — 5 estrellas con glow doble ──────────── */
const TRAIL_N = 12
const STAR_COUNT = 10
const STAR_TOTAL = STAR_COUNT * TRAIL_N
const _starDefs = Array.from({ length: STAR_COUNT }, (_, i) => {
  const spd = 32 + Math.random() * 18
  return {
    delay: i * 0.40,
    sx: -30 + i * 1.5,
    sy: 7 + Math.random() * 6,
    sz: -20 - Math.random() * 12,
    vx: spd,
    vy: spd * -(0.08 + Math.random() * 0.16),
    trail: 5.0 + Math.random() * 2.0,
  }
})


/* ─── Lightweight Procedural Flowers ────────────────────────── */
const FL_COUNT = isTouch ? 20 : 45
const FL_PALETTE = ['#FFB5CC', '#FFD0E0', '#FF9BB5', '#FEFEF2', '#EAC8F4']
const _flowerData = Array.from({ length: FL_COUNT }, () => {
  const z = 2 - Math.random() * 12, dist = 9 - z
  return {
    x: (Math.random() - 0.5) * (12 + dist * 1.1),
    z,
    h: 0.35 + Math.random() * 0.45,
    ph: Math.random() * Math.PI * 2,
    sp: 0.35 + Math.random() * 0.5,
    yr: Math.random() * Math.PI * 2,
    ci: Math.floor(Math.random() * FL_PALETTE.length)
  }
})

/* ─── Montañas ─────────────────────────────────────────────────── */
const MTNS = [
  [-48, -34, 12, 7], [-28, -38, 16, 8], [-12, -35, 13, 7],
  [8, -37, 14, 7], [28, -40, 18, 9], [48, -34, 12, 7],
  [-65, -30, 9, 5], [64, -30, 10, 5],
  [-38, -46, 16, 9], [16, -44, 14, 8], [36, -50, 19, 10],
  [-18, -52, 15, 8], [-54, -47, 13, 7], [52, -49, 12, 7],
]

/* ================================================================
   MONTAÑAS
================================================================ */
function Mountains({ isDark }) {
  return (
    <group>
      {MTNS.map(([x, z, h, r], i) => {
        const haze = Math.min(1, (Math.abs(z) - 48) / 30)
        return (
          <mesh key={i} position={[x, h * .5 - 1, z]}>
            <coneGeometry args={[r, h, 7]} />
            <meshStandardMaterial
              color={isDark ? (i < 8 ? '#141B2E' : '#171F33') : (i < 8 ? '#6878A0' : '#8898C0')}
              roughness={1} transparent opacity={isDark ? 0.92 : 0.55 + haze * 0.30}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* ================================================================
   SUELO
================================================================ */
function Ground({ isDark }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[160, 100]} />
      <meshStandardMaterial color={isDark ? '#0B1505' : '#213A08'} roughness={1} />
    </mesh>
  )
}

/* ================================================================
   PASTO — throttle cada 2 frames
================================================================ */
const GRASS_N = isTouch ? 180 : 420
const _grass = Array.from({ length: GRASS_N }, () => {
  const u = Math.random()
  const z = u < .12 ? 6.5 - Math.random() * 1.0 : u < .30 ? 5.5 - Math.random() * 3.0
    : u < .58 ? 2.5 - Math.random() * 4.5 : u < .80 ? -2.0 - Math.random() * 5.0
      : -7.0 - Math.random() * 8.0
  const dist = 8 - z
  return {
    x: (Math.random() - .5) * (16 + dist * 1.4), z,
    h: 0.04 + Math.random() * 0.22,
    yr: Math.random() * Math.PI * 2,
    phase: Math.random() * Math.PI * 2,
    spd: 0.40 + Math.random() * 0.65,
  }
})

function Grass({ isDark }) {
  const { scene: pastoScene } = useGLTF(pastoUrl)
  const geo = useMemo(() => {
    let g = null
    pastoScene.traverse(c => { if (c.isMesh && !g) g = c.geometry })
    return g
  }, [pastoScene])

  const ref = useRef()
  const dummy = useMemo(() => new Object3D(), [])
  const frame = useRef(0)

  useLayoutEffect(() => {
    if (ref.current) ref.current.geometry = geo ?? ref.current.geometry
    if (ref.current) zeroAll(ref.current, GRASS_N, dummy)
  }, [geo, dummy])

  useFrame(({ clock }) => {
    if (!ref.current) return
    frame.current++
    if (frame.current % 2 !== 0) return
    const t = clock.getElapsedTime()
    _grass.forEach((g, i) => {
      const wind = Math.sin(t * g.spd + g.phase) * 0.09
      dummy.position.set(g.x + Math.sin(wind) * g.h * .5, Math.cos(Math.abs(wind)) * g.h * .5, g.z)
      dummy.rotation.set(0, g.yr, wind)
      /* pasto.glb: 0.127u ancho × 0.110u alto × 0.024u prof → normalizar al tamaño original */
      dummy.scale.set(0.016 / 0.127, g.h / 0.110, 0.016 / 0.024)
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[null, null, GRASS_N]} frustumCulled={false}>
      {!geo && <cylinderGeometry args={[0.3, 1, 1, 3]} />}
      <meshStandardMaterial color={isDark ? '#182F06' : '#2A5209'} roughness={.95} />
    </instancedMesh>
  )
}

/* ================================================================
   CAMPO DE LAVANDA — tallos anclados al suelo, throttle stalks lejanos
================================================================ */
function LavenderField({ isDark }) {
  const stemRef = useRef(), flwRef1 = useRef(), flwRef2 = useRef()
  const dummy = useMemo(() => new Object3D(), [])
  const count = isTouch ? 150 : 320
  const frame = useRef(0)

  const stalks = useMemo(() => Array.from({ length: count }, (_, i) => {
    const u = Math.random()
    const z = u < .10 ? 6.0 - Math.random() * 1.0 : u < .28 ? 5.0 - Math.random() * 3.0
      : u < .55 ? 2.0 - Math.random() * 4.0 : u < .78 ? -2.0 - Math.random() * 4.0
        : -6.0 - Math.random() * 8.0
    const dist = 8 - z
    return {
      x: (Math.random() - .5) * (14 + dist * 1.2), z,
      height: 0.68 + Math.random() * 0.60,
      phase: Math.random() * Math.PI * 2,
      speed: 0.60 + Math.random() * 0.75,
      lean: (Math.random() - .5) * 0.07,
      fw: 0.070 + Math.random() * 0.028,
      grp: i % 3, far: z < -4,
    }
  }), [count])

  useLayoutEffect(() => {
    if (!stemRef.current || !flwRef1.current || !flwRef2.current) return
    zeroAll(stemRef.current, count, dummy)
    zeroAll(flwRef1.current, count, dummy)
    zeroAll(flwRef2.current, count, dummy)
  }, [count, dummy])

  useFrame(({ clock }) => {
    if (!stemRef.current || !flwRef1.current || !flwRef2.current) return
    frame.current++
    const odd = frame.current % 2 !== 0
    const t = clock.getElapsedTime()

    stalks.forEach((s, i) => {
      if (s.far && odd) return      // stalks lejanos: 1 de cada 2 frames

      const wind = Math.sin(t * s.speed + s.phase) * 0.085 + Math.cos(t * 0.32 + s.phase * 0.6) * 0.028
      const b = wind + s.lean

      /* BASE fija en (s.x, 0, s.z) — pivote en suelo */
      dummy.position.set(s.x - Math.sin(b) * s.height * .5, Math.cos(Math.abs(b)) * s.height * .5, s.z)
      dummy.rotation.set(0, 0, b)
      dummy.scale.set(0.026, s.height, 0.026)
      dummy.updateMatrix(); stemRef.current.setMatrixAt(i, dummy.matrix)

      /* Espiga conectada al tope del tallo */
      dummy.position.set(s.x - Math.sin(b) * s.height * 1.16, Math.cos(Math.abs(b)) * s.height * 1.16, s.z)
      dummy.rotation.set(b * .18, 0, b)
      dummy.scale.set(s.fw, s.height * .32, s.fw * .80)
      dummy.updateMatrix()
      if (s.grp < 2) flwRef1.current.setMatrixAt(i, dummy.matrix)
      else flwRef2.current.setMatrixAt(i, dummy.matrix)
    })
    stemRef.current.instanceMatrix.needsUpdate = true
    flwRef1.current.instanceMatrix.needsUpdate = true
    flwRef2.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={stemRef} args={[null, null, count]} frustumCulled={false}>
        <cylinderGeometry args={[1, 1.4, 1, 3]} />
        <meshStandardMaterial color={isDark ? '#263614' : '#38501C'} roughness={.92} />
      </instancedMesh>
      <instancedMesh ref={flwRef1} args={[null, null, count]} frustumCulled={false}>
        <cylinderGeometry args={[.42, .72, 1, 8]} />
        <meshStandardMaterial color={isDark ? '#7A3AB8' : '#8E4ACE'} roughness={.68}
          emissive={isDark ? '#30108A' : '#150030'} emissiveIntensity={isDark ? .52 : .10} />
      </instancedMesh>
      <instancedMesh ref={flwRef2} args={[null, null, count]} frustumCulled={false}>
        <cylinderGeometry args={[.42, .72, 1, 8]} />
        <meshStandardMaterial color={isDark ? '#5018A0' : '#6A28B0'} roughness={.68}
          emissive={isDark ? '#1A0860' : '#0A0020'} emissiveIntensity={isDark ? .42 : .08} />
      </instancedMesh>
    </group>
  )
}

/* ================================================================
   SAKURA — árbol clásico (modo claro)
================================================================ */
function SakuraTree() {
  const treeRef = useRef(), fallRef = useRef()
  const fallPos = useMemo(() => {
    const a = new Float32Array(FALL_N * 3)
    _fall.forEach((p, i) => { a[i * 3] = p.ox; a[i * 3 + 1] = p.oy; a[i * 3 + 2] = p.oz })
    return a
  }, [])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (treeRef.current) treeRef.current.rotation.z = Math.sin(t * .40) * .020
    if (fallRef.current) {
      const pos = fallRef.current.geometry.attributes.position.array
      _fall.forEach((p, i) => {
        const phase = (t + p.ph) % p.dur
        pos[i * 3] = p.ox + Math.sin(t * p.swspd + p.swph) * p.swx
        pos[i * 3 + 1] = p.oy - p.speed * phase
        pos[i * 3 + 2] = p.oz + Math.cos(t * p.swspd * .7 + p.swph) * .14
      })
      fallRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  return (
    <group position={[0.5, 0, -4.5]}>
      <group ref={treeRef}>
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[.14, .26, 1.90, 7]} /><meshStandardMaterial color="#4A2810" roughness={.95} />
        </mesh>
        <mesh position={[0, 2.30, 0]}>
          <cylinderGeometry args={[.09, .14, 0.90, 6]} /><meshStandardMaterial color="#4A2810" roughness={.95} />
        </mesh>
        {[[-0.28, .08, 0, 0, 0, .58], [0.26, .06, .12, 0, 0, -.60], [.04, .05, -.24, .48, 0, 0]].map(([x, y, z, rx, ry, rz], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[rx, ry, rz]}>
            <cylinderGeometry args={[.035, .095, .32, 5]} /><meshStandardMaterial color="#3A2010" roughness={.98} />
          </mesh>
        ))}
        {BR.map(([yj, a, len, dir, yr], i) => {
          const extLen = len + 0.18, hL = extLen * .5
          const px = dir * Math.sin(a) * (hL - 0.09), py = yj + Math.cos(a) * (hL - 0.09)
          const thick = .040 + (1 - i / BR.length) * .038
          return (
            <mesh key={i} position={[px, py, 0]} rotation={[0, yr, -dir * a]}>
              <cylinderGeometry args={[thick * .65, thick, extLen, 5]} />
              <meshStandardMaterial color={i < 4 ? '#4A2810' : '#5A3218'} roughness={.95} />
            </mesh>
          )
        })}
        {CROWN.map(([x, y, z, r, c, op], i) => (
          <mesh key={i} position={[x, y, z]}>
            <icosahedronGeometry args={[r, 1]} />
            <meshStandardMaterial color={c} roughness={.72} transparent opacity={op} flatShading />
          </mesh>
        ))}
        <points ref={fallRef}>
          <bufferGeometry>
            <bufferAttribute args={[fallPos, 3]} attach="attributes-position" />
          </bufferGeometry>
          <pointsMaterial color="#FFB8CC" size={.076} transparent opacity={.76} sizeAttenuation depthWrite={false} />
        </points>
      </group>
    </group>
  )
}

/* ================================================================
   CENTRO GLB — reemplaza el árbol solo en modo OSCURO
================================================================ */
function CentroModel() {
  const { scene } = useGLTF(centroOscuroUrl)
  const obj = useMemo(() => scene.clone(true), [scene])
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.08
  })
  /* centro_oscuro: 0.58u alto, queremos ~3u de presencia visual → scale 5 */
  return <primitive ref={ref} object={obj} position={[0.5, 0, -4.5]} scale={5} />
}

/* ================================================================
   FUEGOS ARTIFICIALES — cohetes que suben + explosiones
================================================================ */
function Fireworks({ burstRef }) {
  const bRef = useRef()           // partículas de explosión
  const rRef = useRef()           // puntos de cohete subiendo
  const posArr = useMemo(() => { const a = new Float32Array(FW_TOTAL * 3); for(let i=1;i<a.length;i+=3) a[i]=-999; return a }, [])
  const colArr = useMemo(() => new Float32Array(FW_TOTAL * 3), [])
  const rPos   = useMemo(() => { const a = new Float32Array(FW_SHELLS * 3); for(let i=1;i<a.length;i+=3) a[i]=-999; return a }, [])
  const rCol   = useMemo(() => new Float32Array(FW_SHELLS * 3), [])

  useFrame(() => {
    if (!bRef.current || !rRef.current) return
    const el = burstRef.current > 0 ? (Date.now() - burstRef.current) / 1000 : -1
    const maxT = _shells[FW_SHELLS - 1].delay + 4.5
    if (el < 0 || el > maxT + 0.5) { bRef.current.visible = false; rRef.current.visible = false; return }
    bRef.current.visible = true; rRef.current.visible = true

    for (let si = 0; si < FW_SHELLS; si++) {
      const sh = _shells[si]
      const t = el - sh.delay
      const bBase = si * FW_PER

      /* Cohete: sube durante ROCKET_DUR s antes de explotar */
      const rT = el - (sh.delay - ROCKET_DUR)
      if (rT > 0 && rT < ROCKET_DUR) {
        const prog = rT / ROCKET_DUR
        rPos[si * 3] = sh.px; rPos[si * 3 + 1] = sh.py * prog; rPos[si * 3 + 2] = sh.pz
        const rb = Math.min(1, prog * 1.5)
        rCol[si * 3] = rb; rCol[si * 3 + 1] = rb * .70; rCol[si * 3 + 2] = rb * .25
      } else {
        rCol[si * 3] = rCol[si * 3 + 1] = rCol[si * 3 + 2] = 0
        rPos[si * 3 + 1] = -999 // Hide rocket when not in flight
      }

      /* Explosión */
      if (t < 0 || t > 4.5) {
        for (let j = 0; j < FW_PER; j++) {
          const idx = (bBase + j) * 3
          colArr[idx] = colArr[idx + 1] = colArr[idx + 2] = 0
          posArr[idx + 1] = -999
        }
      } else {
        const fade = Math.max(0, 1 - t / 2.6)
        for (let j = 0; j < FW_PER; j++) {
          const p = sh.particles[j]
          const idx = (bBase + j) * 3
          posArr[idx] = sh.px + p.vx * t
          posArr[idx + 1] = sh.py + p.vy * t - 0.5 * 5.0 * t * t
          posArr[idx + 2] = sh.pz + p.vz * t
          colArr[idx] = sh.col[0] * fade
          colArr[idx + 1] = sh.col[1] * fade
          colArr[idx + 2] = sh.col[2] * fade
        }
      }
    }

    bRef.current.geometry.attributes.position.needsUpdate = true
    bRef.current.geometry.attributes.color.needsUpdate = true
    rRef.current.geometry.attributes.position.needsUpdate = true
    rRef.current.geometry.attributes.color.needsUpdate = true
  })

  return (<>
    <points ref={bRef} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute args={[posArr, 3]} attach="attributes-position" />
        <bufferAttribute args={[colArr, 3]} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial size={isTouch ? .28 : .22} vertexColors blending={AdditiveBlending} transparent opacity={1} depthWrite={false} sizeAttenuation />
    </points>
    <points ref={rRef} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute args={[rPos, 3]} attach="attributes-position" />
        <bufferAttribute args={[rCol, 3]} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial size={isTouch ? .45 : .36} vertexColors blending={AdditiveBlending} transparent opacity={1} depthWrite={false} sizeAttenuation />
    </points>
  </>)
}

/* ================================================================
   ESTRELLAS FUGACES — core brillante + capa glow
================================================================ */
function ShootingStars({ burstRef }) {
  const cRef = useRef(), gRef = useRef()
  const posArr = useMemo(() => { const a = new Float32Array(STAR_TOTAL * 3); for(let i=1;i<a.length;i+=3) a[i]=-999; return a }, [])
  const colArr = useMemo(() => new Float32Array(STAR_TOTAL * 3), [])
  const glowCol = useMemo(() => new Float32Array(STAR_TOTAL * 3), [])
  const glowPos = useMemo(() => { const a = new Float32Array(STAR_TOTAL * 3); for(let i=1;i<a.length;i+=3) a[i]=-999; return a }, [])

  useFrame(() => {
    if (!cRef.current || !gRef.current) return
    const el = burstRef.current > 0 ? (Date.now() - burstRef.current) / 1000 : -1
    const maxT = _starDefs[STAR_COUNT - 1].delay + 2.2
    if (el < 0 || el > maxT + 0.3) { cRef.current.visible = false; gRef.current.visible = false; return }
    cRef.current.visible = true; gRef.current.visible = true

    for (let si = 0; si < STAR_COUNT; si++) {
      const s = _starDefs[si]
      const t = el - s.delay
      const base = si * TRAIL_N
      if (t < 0 || t > 2.2) {
        for (let j = 0; j < TRAIL_N; j++) {
          const idx = (base + j) * 3
          colArr[idx] = colArr[idx + 1] = colArr[idx + 2] = 0
          posArr[idx + 1] = -999
        }
      } else {
        const hx = s.sx + s.vx * t, hy = s.sy + s.vy * t
        const mag = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
        const nx = s.vx / mag, ny = s.vy / mag
        const fade = Math.max(0, 1 - t / 1.8)

        for (let j = 0; j < TRAIL_N; j++) {
          const frac = j / (TRAIL_N - 1), dist = frac * s.trail
          const idx = (base + j) * 3
          posArr[idx] = hx - nx * dist; posArr[idx + 1] = hy - ny * dist; posArr[idx + 2] = s.sz
          const bright = (1 - frac * .92) * fade
          colArr[idx] = bright; colArr[idx + 1] = bright * .95; colArr[idx + 2] = bright * .80
        }
      }
    }

    /* Glow = mismas posiciones, colores al 30% */
    for (let k = 0; k < STAR_TOTAL * 3; k++) { glowPos[k] = posArr[k]; glowCol[k] = colArr[k] * .30 }

    cRef.current.geometry.attributes.position.needsUpdate = true
    cRef.current.geometry.attributes.color.needsUpdate = true
    gRef.current.geometry.attributes.position.needsUpdate = true
    gRef.current.geometry.attributes.color.needsUpdate = true
  })

  return (<>
    <points ref={cRef} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute args={[posArr, 3]} attach="attributes-position" />
        <bufferAttribute args={[colArr, 3]} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial size={isTouch ? .32 : .24} vertexColors blending={AdditiveBlending} transparent opacity={1} depthWrite={false} sizeAttenuation />
    </points>
    <points ref={gRef} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute args={[glowPos, 3]} attach="attributes-position" />
        <bufferAttribute args={[glowCol, 3]} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial size={isTouch ? 1.0 : .80} vertexColors blending={AdditiveBlending} transparent opacity={1} depthWrite={false} sizeAttenuation />
    </points>
  </>)
}

/* ================================================================
   SOL
================================================================ */
function SunDay() {
  const ref = useRef()
  useFrame(({ clock }) => { if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * .35) * .018) })
  return (
    <group ref={ref} position={[10, 13, -30]}>
      <mesh scale={3.5}><sphereGeometry args={[1, 7, 5]} /><meshBasicMaterial color="#FFE090" transparent opacity={.06} depthWrite={false} /></mesh>
      <mesh scale={1.9}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#FFF0B0" transparent opacity={.16} depthWrite={false} /></mesh>
      <mesh><sphereGeometry args={[1.20, 14, 10]} /><meshBasicMaterial color="#FFFCE0" /></mesh>
    </group>
  )
}

/* ================================================================
   NUBES
================================================================ */
function Clouds() {
  const r0 = useRef(), r1 = useRef(), r2 = useRef(), r3 = useRef(), r4 = useRef()
  const refs = [r0, r1, r2, r3, r4]
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    refs.forEach((r, i) => { if (r.current) r.current.position.x = CLOUDS[i].x + Math.sin(t * CLOUDS[i].spd) * 4 })
  })
  return (<>
    {CLOUDS.map((c, ci) => (
      <group key={ci} ref={refs[ci]} position={[c.x, c.y, c.z]} scale={c.s}>
        {PUFFS.map(([px, py, pz, r], pi) => (
          <mesh key={pi} position={[px, py, pz]}><sphereGeometry args={[r, 7, 5]} />
            <meshBasicMaterial color="#F8FCFF" transparent opacity={.88} depthWrite={false} /></mesh>
        ))}
      </group>
    ))}
  </>)
}

/* ================================================================
   PÁJAROS
================================================================ */
const BIRD_N = 16
const _birds = Array.from({ length: BIRD_N }, (_, i) => {
  const flock = Math.floor(i / 9)
  return {
    sx: -42 + (Math.random() - .5) * 10,
    y: 4.8 + flock * 1.2 + (Math.random() - .5) * 0.7,
    z: -14 - flock * 3.0 + (Math.random() - .5) * 2,
    spd: 1.5 + Math.random() * 0.5,
    fspd: 2.8 + Math.random() * 2.0,
    fph: Math.random() * Math.PI * 2,
  }
})

function Birds() {
  const ref = useRef(), dummy = useMemo(() => new Object3D(), [])
  useLayoutEffect(() => { if (ref.current) zeroAll(ref.current, BIRD_N, dummy) }, [dummy])
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    _birds.forEach((b, i) => {
      const x = ((b.sx + t * b.spd + 46) % 92) - 46
      const flap = Math.sin(t * b.fspd + b.fph)
      dummy.position.set(x, b.y + Math.abs(flap) * .14, b.z)
      dummy.rotation.set(flap * .35, 0, 0)
      dummy.scale.setScalar(0.18)
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[_birdGeo, null, BIRD_N]} frustumCulled={false}>
      <meshBasicMaterial color="#0E1520" side={2} />
    </instancedMesh>
  )
}

/* ================================================================
   LUNA
================================================================ */
function MoonNight() {
  const ref = useRef()
  useFrame(({ clock }) => { if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * .26) * .014) })
  return (
    <group ref={ref} position={[-11, 13, -30]}>
      {/* halos de brillo */}
      <mesh scale={3.8}><sphereGeometry args={[1, 7, 5]} /><meshBasicMaterial color="#8090C0" transparent opacity={.05} depthWrite={false} /></mesh>
      <mesh scale={2.1}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#B0C0E8" transparent opacity={.12} depthWrite={false} /></mesh>
      {/* disco lunar */}
      <mesh><sphereGeometry args={[1.10, 20, 16]} /><meshBasicMaterial color="#EEF6FF" /></mesh>
      {/* sombra menguante — esfera oscura desplazada crea el arco */}
      <mesh position={[0.72, 0.10, 0.18]}>
        <sphereGeometry args={[0.98, 20, 16]} />
        <meshBasicMaterial color="#06091A" />
      </mesh>
    </group>
  )
}

/* ================================================================
   LUCIÉRNAGAS
================================================================ */
function Fireflies() {
  const cRef = useRef(), gRef = useRef()
  /* Arrays estables — nunca cambian de referencia entre renders */
  const cPos = useMemo(() => { const a = new Float32Array(FF_N * 3); _ff.forEach((f, i) => { a[i * 3] = f.bx; a[i * 3 + 1] = f.by; a[i * 3 + 2] = f.bz }); return a }, [])
  const gPos = useMemo(() => { const a = new Float32Array(FF_N * 3); _ff.forEach((f, i) => { a[i * 3] = f.bx; a[i * 3 + 1] = f.by; a[i * 3 + 2] = f.bz }); return a }, [])
  useFrame(({ clock }) => {
    if (!cRef.current || !gRef.current) return
    const t = clock.getElapsedTime()
    _ff.forEach((f, i) => {
      let y = f.by + ((t * f.drift) % 3.8) + Math.sin(t * f.sy + f.py) * .55
      if (y > 4.5) y -= 3.8
      const x = f.bx + Math.sin(t * f.sx + f.px) * 1.4, z = f.bz + Math.cos(t * f.sz + f.pz) * .80
      cPos[i * 3] = x; cPos[i * 3 + 1] = y; cPos[i * 3 + 2] = z
      gPos[i * 3] = x; gPos[i * 3 + 1] = y; gPos[i * 3 + 2] = z
    })
    cRef.current.geometry.attributes.position.needsUpdate = true
    gRef.current.geometry.attributes.position.needsUpdate = true
    const bk = .72 + Math.sin(t * 2.1) * .20 + Math.sin(t * 4.6 + .9) * .10
    cRef.current.material.opacity = Math.max(.50, Math.min(1.0, bk))
    gRef.current.material.opacity = Math.max(.12, Math.min(.38, bk * .34))
  })
  return (<>
    <points ref={cRef}>
      <bufferGeometry><bufferAttribute args={[cPos, 3]} attach="attributes-position" /></bufferGeometry>
      <pointsMaterial color="#FFEE40" size={isTouch ? .14 : .11} transparent opacity={.90} blending={AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
    <points ref={gRef}>
      <bufferGeometry><bufferAttribute args={[gPos, 3]} attach="attributes-position" /></bufferGeometry>
      <pointsMaterial color="#FFD020" size={isTouch ? .44 : .38} transparent opacity={.22} blending={AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  </>)
}

/* ================================================================
   PARTÍCULAS ATMOSFÉRICAS
================================================================ */
function Atmo({ isDark }) {
  const ref = useRef()
  const pos = useMemo(() => {
    const n = isTouch ? 40 : 80, a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) { a[i * 3] = (Math.random() - .5) * 36; a[i * 3 + 1] = Math.random() * 5 + .5; a[i * 3 + 2] = -(Math.random() * 24 + 3) }
    return a
  }, [])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * .005 })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute args={[pos, 3]} attach="attributes-position" /></bufferGeometry>
      <pointsMaterial color={isDark ? '#6050A8' : '#C8E8FF'} size={.055} transparent opacity={isDark ? .09 : .20} sizeAttenuation depthWrite={false} />
    </points>
  )
}


/* ================================================================
   CÁMARA — apunta hacia el árbol y el horizonte al montar
================================================================ */
function CameraSetup() {
  const { camera } = useThree()
  useEffect(() => { camera.lookAt(0, 2.2, -6) }, [camera])
  return null
}

/* ================================================================
   SUBTLE SCENE ROTATION — very slow sinusoidal Y-axis swing
   Amplitude 0.18 rad (~10°), period ~42 s, imperceptible day-to-day
   but gives a gentle parallax that conveys 3-D depth.
================================================================ */
/* ================================================================
   SIMPLE FLOWERS — Optimization: No GLB, using low-poly primitives
================================================================ */
function SimpleFlowers({ isDark }) {
  const stemRef = useRef(), headRef = useRef()
  const dummy = useMemo(() => new Object3D(), [])

  useLayoutEffect(() => {
    if (!stemRef.current || !headRef.current) return
    zeroAll(stemRef.current, FL_COUNT, dummy)
    zeroAll(headRef.current, FL_COUNT, dummy)

    _flowerData.forEach((f, i) => {
      headRef.current.setColorAt(i, new Color(FL_PALETTE[f.ci]))
    })
    if (headRef.current.instanceColor) headRef.current.instanceColor.needsUpdate = true
  }, [dummy])

  useFrame(({ clock }) => {
    if (!stemRef.current || !headRef.current) return
    const t = clock.getElapsedTime()
    _flowerData.forEach((f, i) => {
      const w = Math.sin(t * f.sp + f.ph) * 0.05
      // Stem
      dummy.position.set(f.x - Math.sin(w) * f.h * 0.5, Math.cos(Math.abs(w)) * f.h * 0.5, f.z)
      dummy.rotation.set(0, f.yr, w)
      dummy.scale.set(0.012, f.h, 0.012)
      dummy.updateMatrix()
      stemRef.current.setMatrixAt(i, dummy.matrix)
      // Head
      dummy.position.set(f.x - Math.sin(w) * f.h * 1.05, Math.cos(Math.abs(w)) * f.h * 1.05, f.z)
      dummy.rotation.set(w * 0.2, f.yr, w)
      dummy.scale.set(0.08, 0.08, 0.08)
      dummy.updateMatrix()
      headRef.current.setMatrixAt(i, dummy.matrix)
    })
    stemRef.current.instanceMatrix.needsUpdate = true
    headRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={stemRef} args={[null, null, FL_COUNT]}>
        <cylinderGeometry args={[1, 1, 1, 3]} />
        <meshStandardMaterial color={isDark ? '#182F06' : '#2A5209'} roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={headRef} args={[null, null, FL_COUNT]}>
        <sphereGeometry args={[1, 6, 4]} />
        <meshStandardMaterial roughness={0.6} emissive={isDark ? '#120E04' : '#000'} emissiveIntensity={0.2} />
      </instancedMesh>
    </group>
  )
}

function SceneRotation({ children }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.18
    }
  })
  return <group ref={ref}>{children}</group>
}

/* ================================================================
   ESCENA
================================================================ */
function Scene({ burstRef, isDark }) {
  return (<>
    <CameraSetup />
    {isDark && <Stars radius={75} depth={50} count={isTouch ? 200 : 500} factor={3.5} saturation={.25} fade speed={.15} />}
    <SceneRotation>
      <Mountains isDark={isDark} />
      <Ground isDark={isDark} />
      {isDark ? <MoonNight /> : <SunDay />}
      {!isDark && <Clouds />}
      {!isDark && <Birds />}
      {isDark && <Fireflies />}
      <Atmo isDark={isDark} />
      {/* <Flowers isDark={isDark}/> */}
      <SimpleFlowers isDark={isDark} />
      <Grass isDark={isDark} />
      {isDark ? <CentroModel /> : <SakuraTree />}
      <LavenderField isDark={isDark} />
      {isDark
        ? <ShootingStars burstRef={burstRef} />
        : <Fireworks burstRef={burstRef} />
      }
    </SceneRotation>
  </>)
}

/* ================================================================
   EXPORT
================================================================ */
export default function Hero3D() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const burstRef = useRef(0)

  const onClick = useCallback(() => {
    const elapsed = (Date.now() - burstRef.current) / 1000
    if (burstRef.current > 0 && elapsed < _shells[FW_SHELLS - 1].delay + 4.0) return
    burstRef.current = Date.now()
  }, [])

  return (
    <div className="hero-canvas" onClick={onClick} style={{ cursor: 'pointer' }}>
      <Canvas
        camera={{ position: [0, 2.2, 8.0], fov: 60 }}
        gl={{ antialias: !isTouch, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1]}
      >
        {isDark ? (<>
          <ambientLight intensity={.58} color="#3848C8" />
          <directionalLight position={[-11, 13, -30]} intensity={.80} color="#C8D8FF" />
          <hemisphereLight skyColor="#121830" groundColor="#0C1408" intensity={.65} />
          <pointLight position={[0, 5, 3]} intensity={.85} color="#E8F0FF" distance={42} decay={1.5} />
          <pointLight position={[4, 5, -10]} intensity={.48} color="#9098E8" distance={36} decay={2} />
          <pointLight position={[-6, 2, 5]} intensity={.38} color="#B0C0FF" distance={28} decay={2} />
        </>) : (<>
          <ambientLight intensity={1.15} color="#F0F8FF" />
          <directionalLight position={[10, 13, -30]} intensity={3.2} color="#FFF8E8" castShadow />
          <hemisphereLight skyColor="#87CEEB" groundColor="#3A5820" intensity={.85} />
          <pointLight position={[0, -.5, 2]} intensity={.22} color="#B8D870" distance={18} decay={2} />
        </>)}
        <Scene burstRef={burstRef} isDark={isDark} />
      </Canvas>
    </div>
  )
}

useGLTF.preload(pastoUrl)
useGLTF.preload(centroOscuroUrl)
// useGLTF.preload(florUrl)
