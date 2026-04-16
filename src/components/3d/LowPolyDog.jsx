import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/*
  Pastor Alemán Low-Poly — pose SENTADO
  Proporciones reales, hermoso, cola barriendo suavemente el suelo.
  exploded=true → sale volando con pánico
*/

const BLK  = '#18130D'   // negro manto espalda
const TAN  = '#C4813A'   // tostado fuerte (patas, cara)
const TAN2 = '#E0A84E'   // tostado claro (pecho, cejas)
const CRM  = '#F0D890'   // crema (panza, calcetines)
const NOS  = '#0A0605'
const EYE  = '#06030A'
const PINK = '#C87080'   // interior orejas / lengua

export default function LowPolyDog({ scale = 1, position = [0, 0, 0], exploded = false }) {
  const rootRef = useRef()
  const tailRef = useRef()   // giro cola
  const headRef = useRef()   // movimiento cabeza

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!rootRef.current) return

    if (exploded) {
      // Sale volando y gira
      rootRef.current.position.y += (7 - rootRef.current.position.y) * 0.04
      rootRef.current.rotation.x += 0.07
      rootRef.current.rotation.z += 0.04
    } else {
      rootRef.current.position.y += (0 - rootRef.current.position.y) * 0.07
      rootRef.current.rotation.x += (0 - rootRef.current.rotation.x) * 0.09
      rootRef.current.rotation.z += (0 - rootRef.current.rotation.z) * 0.09
    }

    // Cola barre suavemente de lado a lado
    if (tailRef.current) {
      const speed = exploded ? 12 : 2.8
      const amp   = exploded ? 1.1 : 0.55
      tailRef.current.rotation.y = Math.sin(t * speed) * amp
    }

    // Cabeza mira las estrellas, gira levemente
    if (headRef.current) {
      headRef.current.rotation.x = -0.28 + Math.sin(t * 0.45) * 0.06
      headRef.current.rotation.y = Math.sin(t * 0.33) * (exploded ? 0.5 : 0.12)
    }
  })

  return (
    <group scale={scale} position={position}>
      <group ref={rootRef}>

        {/* ══════════════════════════════
            CUARTOS TRASEROS  (base sentado)
            ══════════════════════════════ */}
        {/* Masa principal de cuartos */}
        <mesh position={[0, -0.10, -0.12]} scale={[0.56, 0.40, 0.68]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={BLK} flatShading />
        </mesh>
        {/* Muslo izquierdo visible */}
        <mesh position={[-0.30, -0.24, -0.05]} rotation={[0.4, 0, 0.25]} scale={[0.20, 0.32, 0.22]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={TAN} flatShading />
        </mesh>
        {/* Muslo derecho visible */}
        <mesh position={[0.30, -0.24, -0.05]} rotation={[0.4, 0, -0.25]} scale={[0.20, 0.32, 0.22]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={TAN} flatShading />
        </mesh>
        {/* Patas traseras (dobladas) */}
        {[-0.28, 0.28].map((x, i) => (
          <group key={i} position={[x, -0.44, 0.15]} rotation={[-0.6, 0, 0]}>
            <mesh scale={[0.12, 0.28, 0.14]}>
              <cylinderGeometry args={[0.8, 1, 1, 4]} />
              <meshStandardMaterial color={TAN} flatShading />
            </mesh>
            {/* Calcetín crema */}
            <mesh position={[0, -0.18, 0.03]} scale={[0.11, 0.10, 0.16]}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={CRM} flatShading />
            </mesh>
          </group>
        ))}

        {/* ══════════════════════════════
            CUERPO / TRONCO
            ══════════════════════════════ */}
        <mesh position={[0, 0.22, 0.05]} scale={[0.50, 0.46, 0.70]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={BLK} flatShading />
        </mesh>
        {/* Silla de montar (negro brillante) */}
        <mesh position={[0, 0.34, -0.05]} scale={[0.44, 0.28, 0.60]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#0E0B08" flatShading />
        </mesh>
        {/* Pecho tostado prominente */}
        <mesh position={[0, 0.08, 0.38]} scale={[0.36, 0.34, 0.28]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={TAN2} flatShading />
        </mesh>
        {/* Panza crema */}
        <mesh position={[0, -0.10, 0.22]} scale={[0.30, 0.20, 0.30]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={CRM} flatShading />
        </mesh>

        {/* ══════════════════════════════
            PATAS DELANTERAS  (rectas)
            ══════════════════════════════ */}
        {[-0.24, 0.24].map((x, i) => (
          <group key={i} position={[x, -0.12, 0.38]}>
            {/* Antebrazo */}
            <mesh scale={[0.12, 0.46, 0.12]}>
              <cylinderGeometry args={[0.9, 1, 1, 4]} />
              <meshStandardMaterial color={TAN} flatShading />
            </mesh>
            {/* Calcetín + pata */}
            <mesh position={[0, -0.28, 0.02]} scale={[0.13, 0.10, 0.18]}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={CRM} flatShading />
            </mesh>
          </group>
        ))}

        {/* ══════════════════════════════
            CUELLO
            ══════════════════════════════ */}
        <mesh position={[0, 0.50, 0.28]} rotation={[0.42, 0, 0]} scale={[0.24, 0.34, 0.24]}>
          <cylinderGeometry args={[0.80, 1, 1, 5]} />
          <meshStandardMaterial color={TAN} flatShading />
        </mesh>
        {/* Melena / pecho alto */}
        <mesh position={[0, 0.48, 0.35]} scale={[0.22, 0.18, 0.16]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={TAN2} flatShading />
        </mesh>

        {/* ══════════════════════════════
            CABEZA — la estrella
            ══════════════════════════════ */}
        <group ref={headRef} position={[0, 0.82, 0.52]} rotation={[-0.28, 0, 0]}>

          {/* Cráneo largo y noble */}
          <mesh scale={[0.30, 0.32, 0.44]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={BLK} flatShading />
          </mesh>

          {/* Mejillas / cara tostada */}
          <mesh position={[0, -0.04, 0.24]} scale={[0.26, 0.24, 0.22]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={TAN2} flatShading />
          </mesh>

          {/* Hocico largo (clave del pastor) */}
          <mesh position={[0, -0.11, 0.50]} scale={[0.16, 0.12, 0.28]}>
            <boxGeometry />
            <meshStandardMaterial color={TAN} flatShading />
          </mesh>
          {/* Punta del hocico */}
          <mesh position={[0, -0.12, 0.64]} scale={[0.14, 0.10, 0.10]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={TAN2} flatShading />
          </mesh>

          {/* Nariz ancha */}
          <mesh position={[0, -0.07, 0.72]} scale={[0.088, 0.055, 0.048]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={NOS} flatShading />
          </mesh>

          {/* Ojos almendrados con brillo */}
          {[-0.155, 0.155].map((x, i) => (
            <group key={i} position={[x, 0.06, 0.38]}>
              <mesh scale={[0.068, 0.054, 0.038]}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={EYE} flatShading />
              </mesh>
              {/* Brillo blanco */}
              <mesh position={[0.018, 0.022, 0.036]} scale={0.016}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#FFFFFF" flatShading />
              </mesh>
            </group>
          ))}

          {/* Cejas tostadas (expresivas!) */}
          {[-0.14, 0.14].map((x, i) => (
            <mesh key={i} position={[x, 0.14, 0.36]}
              rotation={[0, 0, i === 0 ? -0.25 : 0.25]}
              scale={[0.075, 0.022, 0.04]}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={TAN} flatShading />
            </mesh>
          ))}

          {/* OREJAS ERECTAS — marca distintiva del pastor */}
          {[-1, 1].map((side, i) => (
            <group key={i}
              position={[side * 0.22, 0.28, 0.10]}
              rotation={[-0.10, side * -0.14, side * 0.08]}>
              {/* Oreja exterior (negra) */}
              <mesh scale={[0.11, 0.30, 0.08]}>
                <coneGeometry args={[1, 1.6, 3]} />
                <meshStandardMaterial color={BLK} flatShading />
              </mesh>
              {/* Interior rosado */}
              <mesh position={[0, 0.05, 0.025]} scale={[0.065, 0.22, 0.035]}>
                <coneGeometry args={[1, 1.5, 3]} />
                <meshStandardMaterial color={PINK} flatShading />
              </mesh>
            </group>
          ))}

          {/* Lengüita jadeando */}
          <mesh position={[0.04, -0.22, 0.65]}
            rotation={[0.30, 0, 0.06]}
            scale={[0.075, 0.095, 0.028]}>
            <boxGeometry />
            <meshStandardMaterial color={PINK} flatShading transparent opacity={0.92} />
          </mesh>
          {/* Punta redondeada */}
          <mesh position={[0.04, -0.29, 0.67]}
            rotation={[0.3, 0, 0]}
            scale={[0.065, 0.038, 0.025]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={PINK} flatShading transparent opacity={0.85} />
          </mesh>
        </group>

        {/* ══════════════════════════════
            COLA — larga, barriendo el suelo
            ══════════════════════════════ */}
        <group ref={tailRef} position={[0.14, -0.06, -0.72]}>
          {/* Segmento base */}
          <mesh rotation={[-0.65, 0, 0.15]} scale={[0.08, 0.42, 0.08]}>
            <cylinderGeometry args={[0.6, 1, 1, 4]} />
            <meshStandardMaterial color={BLK} flatShading />
          </mesh>
          {/* Segmento medio */}
          <mesh position={[-0.04, -0.26, -0.32]} rotation={[-0.45, 0, 0.1]} scale={[0.068, 0.36, 0.068]}>
            <cylinderGeometry args={[0.4, 0.8, 1, 4]} />
            <meshStandardMaterial color={TAN} flatShading />
          </mesh>
          {/* Punta crema */}
          <mesh position={[-0.06, -0.32, -0.60]} rotation={[-0.30, 0, 0]} scale={[0.052, 0.22, 0.052]}>
            <cylinderGeometry args={[0.2, 0.55, 1, 4]} />
            <meshStandardMaterial color={CRM} flatShading />
          </mesh>
        </group>

      </group>
    </group>
  )
}
