import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/*
  Husky Siberiano Low-Poly — pose SENTADO
  Paleta completamente blanca/gris, ojos azul vibrante característicos.
  Cola esponjosa curvada sobre el lomo.
  exploded=true → sale volando con pánico
*/

const WHT       = '#F0EFF5'   // blanco principal cuerpo
const GRY       = '#C8C7D4'   // marcas grises espalda / orejas externas
const MSK       = '#E0DFE8'   // gris claro máscara facial alrededor ojos
const PINK      = '#F0B8C0'   // interior orejas / lengua
const NOS       = '#111118'   // nariz oscura
const EYE_OUTER = '#1A90FF'   // azul vivido — ojo husky
const EYE_INNER = '#0A60D0'   // azul más profundo pupila
const EYE_LIGHT = '#FFFFFF'   // reflejo

export default function LowPolyHusky({ scale = 1, position = [0, 0, 0], exploded = false }) {
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

    // Cola esponjosa barre suavemente de lado a lado
    if (tailRef.current) {
      const speed = exploded ? 12 : 2.8
      const amp   = exploded ? 1.1 : 0.55
      tailRef.current.rotation.y = Math.sin(t * speed) * amp
    }

    // Cabeza mira suavemente alrededor
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
        {/* Masa principal de cuartos — blanca */}
        <mesh position={[0, -0.10, -0.12]} scale={[0.56, 0.40, 0.68]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>
        {/* Muslo izquierdo visible */}
        <mesh position={[-0.30, -0.24, -0.05]} rotation={[0.4, 0, 0.25]} scale={[0.20, 0.32, 0.22]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>
        {/* Muslo derecho visible */}
        <mesh position={[0.30, -0.24, -0.05]} rotation={[0.4, 0, -0.25]} scale={[0.20, 0.32, 0.22]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>
        {/* Patas traseras (dobladas) */}
        {[-0.28, 0.28].map((x, i) => (
          <group key={i} position={[x, -0.44, 0.15]} rotation={[-0.6, 0, 0]}>
            <mesh scale={[0.12, 0.28, 0.14]}>
              <cylinderGeometry args={[0.8, 1, 1, 4]} />
              <meshStandardMaterial color={WHT} flatShading />
            </mesh>
            {/* Pata blanca */}
            <mesh position={[0, -0.18, 0.03]} scale={[0.11, 0.10, 0.16]}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={WHT} flatShading />
            </mesh>
          </group>
        ))}

        {/* ══════════════════════════════
            CUERPO / TRONCO
            ══════════════════════════════ */}
        <mesh position={[0, 0.22, 0.05]} scale={[0.50, 0.46, 0.70]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>
        {/* Silla de montar gris — marca del husky en el lomo */}
        <mesh position={[0, 0.34, -0.05]} scale={[0.44, 0.28, 0.60]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={GRY} flatShading />
        </mesh>
        {/* Pecho blanco prominente */}
        <mesh position={[0, 0.08, 0.38]} scale={[0.36, 0.34, 0.28]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>
        {/* Panza blanca */}
        <mesh position={[0, -0.10, 0.22]} scale={[0.30, 0.20, 0.30]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>

        {/* ══════════════════════════════
            PATAS DELANTERAS  (rectas)
            ══════════════════════════════ */}
        {[-0.24, 0.24].map((x, i) => (
          <group key={i} position={[x, -0.12, 0.38]}>
            {/* Antebrazo */}
            <mesh scale={[0.12, 0.46, 0.12]}>
              <cylinderGeometry args={[0.9, 1, 1, 4]} />
              <meshStandardMaterial color={WHT} flatShading />
            </mesh>
            {/* Pata blanca */}
            <mesh position={[0, -0.28, 0.02]} scale={[0.13, 0.10, 0.18]}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={WHT} flatShading />
            </mesh>
          </group>
        ))}

        {/* ══════════════════════════════
            CUELLO
            ══════════════════════════════ */}
        <mesh position={[0, 0.50, 0.28]} rotation={[0.42, 0, 0]} scale={[0.24, 0.34, 0.24]}>
          <cylinderGeometry args={[0.80, 1, 1, 5]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>
        {/* Pecho alto blanco */}
        <mesh position={[0, 0.48, 0.35]} scale={[0.22, 0.18, 0.16]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>

        {/* ══════════════════════════════
            CABEZA — la estrella
            Ligeramente más redonda y ancha que el pastor
            ══════════════════════════════ */}
        <group ref={headRef} position={[0, 0.82, 0.52]} rotation={[-0.28, 0, 0]}>

          {/* Cráneo más redondo y ancho (x mayor, z un poco menor que GSD) */}
          <mesh scale={[0.34, 0.32, 0.40]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={WHT} flatShading />
          </mesh>

          {/* Mejillas / cara blanca */}
          <mesh position={[0, -0.04, 0.22]} scale={[0.28, 0.24, 0.20]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={WHT} flatShading />
          </mesh>

          {/* Máscara facial gris claro alrededor de los ojos — izquierda */}
          <mesh position={[-0.155, 0.06, 0.34]}
            rotation={[0.05, 0.08, 0]}
            scale={[0.095, 0.075, 0.018]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={MSK} flatShading />
          </mesh>
          {/* Máscara facial gris claro alrededor de los ojos — derecha */}
          <mesh position={[0.155, 0.06, 0.34]}
            rotation={[0.05, -0.08, 0]}
            scale={[0.095, 0.075, 0.018]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={MSK} flatShading />
          </mesh>

          {/* Hocico más corto y redondeado que el pastor */}
          <mesh position={[0, -0.11, 0.44]} scale={[0.16, 0.11, 0.20]}>
            <boxGeometry />
            <meshStandardMaterial color={WHT} flatShading />
          </mesh>
          {/* Punta del hocico redondeada */}
          <mesh position={[0, -0.11, 0.56]} scale={[0.14, 0.10, 0.09]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={WHT} flatShading />
          </mesh>

          {/* Nariz oscura */}
          <mesh position={[0, -0.06, 0.63]} scale={[0.088, 0.055, 0.048]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={NOS} flatShading />
          </mesh>

          {/* OJOS AZULES VIBRANTES — el rasgo más distintivo del husky
              Más grandes que en el GSD, tres capas: iris azul + pupila + reflejo */}
          {[-0.155, 0.155].map((x, i) => (
            <group key={i} position={[x, 0.06, 0.36]}>
              {/* Iris azul exterior */}
              <mesh scale={[0.080, 0.068, 0.042]}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={EYE_OUTER} flatShading />
              </mesh>
              {/* Pupila azul profunda (esfera más pequeña encima) */}
              <mesh position={[0, 0, 0.028]} scale={[0.042, 0.042, 0.024]}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={EYE_INNER} flatShading />
              </mesh>
              {/* Reflejo blanco */}
              <mesh position={[0.022, 0.026, 0.050]} scale={0.018}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={EYE_LIGHT} flatShading />
              </mesh>
            </group>
          ))}

          {/* OREJAS ERECTAS — puntas ligeramente más redondeadas, color gris externo */}
          {[-1, 1].map((side, i) => (
            <group key={i}
              position={[side * 0.22, 0.28, 0.08]}
              rotation={[-0.10, side * -0.14, side * 0.08]}>
              {/* Oreja exterior gris */}
              <mesh scale={[0.12, 0.30, 0.09]}>
                <coneGeometry args={[1, 1.5, 4]} />
                <meshStandardMaterial color={GRY} flatShading />
              </mesh>
              {/* Interior rosado */}
              <mesh position={[0, 0.04, 0.028]} scale={[0.070, 0.21, 0.038]}>
                <coneGeometry args={[1, 1.4, 4]} />
                <meshStandardMaterial color={PINK} flatShading />
              </mesh>
            </group>
          ))}

          {/* Lengüita jadeando */}
          <mesh position={[0.04, -0.22, 0.58]}
            rotation={[0.30, 0, 0.06]}
            scale={[0.075, 0.095, 0.028]}>
            <boxGeometry />
            <meshStandardMaterial color={PINK} flatShading transparent opacity={0.92} />
          </mesh>
          {/* Punta redondeada */}
          <mesh position={[0.04, -0.29, 0.60]}
            rotation={[0.3, 0, 0]}
            scale={[0.065, 0.038, 0.025]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={PINK} flatShading transparent opacity={0.85} />
          </mesh>
        </group>

        {/* ══════════════════════════════
            COLA ESPONJOSA — curvada sobre el lomo
            El husky lleva la cola enroscada hacia arriba, segmentos más anchos
            y colores alternando blanco / gris
            ══════════════════════════════ */}
        <group ref={tailRef} position={[0.14, -0.04, -0.74]}>
          {/* Segmento base — ancho, gris, apuntando hacia arriba */}
          <mesh rotation={[-1.20, 0, 0.15]} scale={[0.11, 0.38, 0.11]}>
            <cylinderGeometry args={[0.7, 1, 1, 5]} />
            <meshStandardMaterial color={GRY} flatShading />
          </mesh>
          {/* Segmento medio — blanco, curva más hacia arriba y atrás */}
          <mesh position={[-0.03, -0.10, -0.36]} rotation={[-0.70, 0, 0.10]} scale={[0.095, 0.34, 0.095]}>
            <cylinderGeometry args={[0.5, 0.9, 1, 5]} />
            <meshStandardMaterial color={WHT} flatShading />
          </mesh>
          {/* Segmento superior — gris, arco hacia el lomo */}
          <mesh position={[-0.04, 0.10, -0.58]} rotation={[0.10, 0, 0.08]} scale={[0.080, 0.28, 0.080]}>
            <cylinderGeometry args={[0.3, 0.7, 1, 5]} />
            <meshStandardMaterial color={GRY} flatShading />
          </mesh>
          {/* Punta blanca esponjosa */}
          <mesh position={[-0.04, 0.26, -0.64]} rotation={[0.25, 0, 0]} scale={[0.065, 0.18, 0.065]}>
            <cylinderGeometry args={[0.15, 0.45, 1, 5]} />
            <meshStandardMaterial color={WHT} flatShading />
          </mesh>
        </group>

      </group>
    </group>
  )
}
