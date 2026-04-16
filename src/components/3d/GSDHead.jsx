import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

/*
  Pastor Alemán — retrato de cabeza LOW-POLY con flatShading.

  Anatomía real:
  · Cráneo : hocico = 50 : 50 en longitud (cabeza en cuña)
  · Ojos almendrados, color ámbar oscuro, ligeramente oblicuos
  · Orejas GRANDES, triangulares, perfectamente erectas
  · Hocico LARGO como caja rectangular — rasgo más distintivo
  · Negro : tostado : crema — distribución clásica del pastor

  Truco low-poly: icosahedronGeometry(1,1)+flatShading = facetas cristalinas,
  boxGeometry para el hocico = perfil anguloso canino, sin efecto globo.
*/

const BLK   = '#18120A'   // negro cráneo / orejas / lomo
const DTAN  = '#B87028'   // tostado oscuro cara exterior
const TAN   = '#D09038'   // tostado medio hocico / mejillas
const TAN2  = '#E8A850'   // tostado claro punta hocico
const CRM   = '#F4DC80'   // crema cejas / pecho
const NOS   = '#060402'   // nariz
const EYE   = '#280E04'   // iris exterior marrón oscuro
const IRIS  = '#7A4010'   // iris ámbar cálido
const PINK  = '#D07888'   // interior orejas / lengua

export default function GSDHead() {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(t * 0.40) * 0.20
    groupRef.current.rotation.x = Math.sin(t * 0.28) * 0.07 - 0.04
  })

  return (
    <Float speed={0.65} floatIntensity={0.14} rotationIntensity={0.03}>
      <group ref={groupRef} scale={1.28}>

        {/* ══════════════════════════
            CRÁNEO — negro, cuña ancha
            ══════════════════════════ */}
        {/* Masa principal del cráneo */}
        <mesh position={[0, 0.30, -0.08]} scale={[1.08, 0.80, 1.00]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={BLK} flatShading />
        </mesh>

        {/* Frente negra — techo del hocico */}
        <mesh position={[0, 0.12, 0.52]} scale={[0.72, 0.38, 0.42]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={BLK} flatShading />
        </mesh>

        {/* ══════════════════════════
            CARA — tostada, mejillas anchas
            ══════════════════════════ */}
        {/* Área central de la cara */}
        <mesh position={[0, 0.04, 0.54]} scale={[0.64, 0.56, 0.44]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={DTAN} flatShading />
        </mesh>

        {/* Mejilla izquierda */}
        <mesh position={[-0.54, 0.00, 0.40]} scale={[0.28, 0.44, 0.38]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={TAN} flatShading />
        </mesh>
        {/* Mejilla derecha */}
        <mesh position={[ 0.54, 0.00, 0.40]} scale={[0.28, 0.44, 0.38]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={TAN} flatShading />
        </mesh>

        {/* ══════════════════════════
            HOCICO — el rasgo más icónico del Pastor:
            largo, rectangular, tipo caja
            ══════════════════════════ */}
        {/* Cuerpo principal del hocico — box alargado */}
        <mesh position={[0, -0.20, 1.08]} scale={[0.42, 0.26, 0.88]}>
          <boxGeometry args={[1, 1, 1, 1, 1, 2]} />
          <meshStandardMaterial color={TAN} flatShading />
        </mesh>

        {/* Punta del hocico — ligeramente más estrecha */}
        <mesh position={[0, -0.22, 1.88]} scale={[0.36, 0.22, 0.24]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={TAN2} flatShading />
        </mesh>

        {/* Labio superior negro (borde cráneo ↔ hocico) */}
        <mesh position={[0, -0.09, 1.14]} scale={[0.38, 0.10, 0.78]}>
          <boxGeometry />
          <meshStandardMaterial color={BLK} flatShading />
        </mesh>

        {/* Línea de la boca — fina ranura oscura */}
        <mesh position={[0, -0.28, 1.58]} scale={[0.30, 0.030, 0.48]}>
          <boxGeometry />
          <meshStandardMaterial color={BLK} flatShading />
        </mesh>

        {/* NARIZ */}
        <mesh position={[0, -0.10, 2.01]} scale={[0.18, 0.11, 0.10]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={NOS} flatShading />
        </mesh>
        {/* Ranura nasal */}
        <mesh position={[0, -0.10, 2.09]} scale={[0.09, 0.040, 0.038]}>
          <boxGeometry />
          <meshStandardMaterial color="#020101" />
        </mesh>

        {/* ══════════════════════════
            OJOS — almendrados, ámbar oscuro
            ══════════════════════════ */}
        {[-1, 1].map((side, i) => (
          <group key={i} position={[side * 0.44, 0.18, 0.82]}>
            {/* Cuenca — sombra negra alrededor del ojo */}
            <mesh scale={[0.135, 0.100, 0.065]}>
              <icosahedronGeometry args={[0.72, 1]} />
              <meshStandardMaterial color={BLK} flatShading />
            </mesh>
            {/* Ojo exterior marrón oscuro */}
            <mesh position={[0, 0, 0.022]} scale={[0.105, 0.080, 0.048]}>
              <icosahedronGeometry args={[0.72, 1]} />
              <meshStandardMaterial color={EYE} flatShading />
            </mesh>
            {/* Iris ámbar */}
            <mesh position={[0, 0, 0.050]} scale={[0.065, 0.055, 0.028]}>
              <icosahedronGeometry args={[0.72, 1]} />
              <meshStandardMaterial color={IRIS} flatShading />
            </mesh>
            {/* Pupila */}
            <mesh position={[0, 0, 0.068]} scale={[0.030, 0.030, 0.016]}>
              <icosahedronGeometry args={[0.72, 0]} />
              <meshStandardMaterial color="#030202" />
            </mesh>
            {/* Brillo */}
            <mesh position={[side * -0.024, 0.022, 0.082]} scale={0.013}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#FFFFFF"
                emissive="#FFFFFF" emissiveIntensity={2.5} />
            </mesh>
          </group>
        ))}

        {/* MANCHAS DE CEJA — crema / tostado claro (muy expresivas en el Pastor) */}
        {[-1, 1].map((side, i) => (
          <mesh key={i}
            position={[side * 0.41, 0.33, 0.76]}
            rotation={[0, 0, side * 0.30]}
            scale={[0.120, 0.042, 0.060]}>
            <icosahedronGeometry args={[0.72, 0]} />
            <meshStandardMaterial color={CRM} flatShading />
          </mesh>
        ))}

        {/* ══════════════════════════
            OREJAS — lo más distintivo del Pastor:
            pirámides de 4 lados, GRANDES y ERECTAS
            ══════════════════════════ */}
        {[-1, 1].map((side, i) => (
          <group key={i}
            position={[side * 0.50, 0.96, -0.14]}
            rotation={[0.10, side * -0.20, side * 0.08]}>
            {/* Oreja exterior — negra, 4 lados */}
            <mesh scale={[0.26, 0.76, 0.20]}>
              <coneGeometry args={[1, 1.5, 4]} />
              <meshStandardMaterial color={BLK} flatShading />
            </mesh>
            {/* Interior rosado */}
            <mesh position={[0, 0.06, 0.048]} scale={[0.15, 0.56, 0.082]}>
              <coneGeometry args={[1, 1.4, 4]} />
              <meshStandardMaterial color={PINK} flatShading />
            </mesh>
          </group>
        ))}

        {/* ══════════════════════════
            LENGUA
            ══════════════════════════ */}
        <mesh position={[0.02, -0.43, 1.78]}
          rotation={[0.20, 0, 0.04]}
          scale={[0.092, 0.140, 0.042]}>
          <boxGeometry />
          <meshStandardMaterial color={PINK} flatShading transparent opacity={0.92} />
        </mesh>
        <mesh position={[0.02, -0.56, 1.82]}
          rotation={[0.16, 0, 0]}
          scale={[0.080, 0.065, 0.034]}>
          <icosahedronGeometry args={[0.72, 0]} />
          <meshStandardMaterial color={PINK} flatShading transparent opacity={0.85} />
        </mesh>

        {/* ══════════════════════════
            CUELLO / BUSTO
            ══════════════════════════ */}
        {/* Cuello negro */}
        <mesh position={[0, -0.60, 0.10]} scale={[0.68, 0.42, 0.56]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={BLK} flatShading />
        </mesh>
        {/* Pecho tostado */}
        <mesh position={[0, -0.68, 0.46]} scale={[0.44, 0.28, 0.30]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={DTAN} flatShading />
        </mesh>
        {/* Crema pecho bajo */}
        <mesh position={[0, -0.74, 0.58]} scale={[0.30, 0.17, 0.18]}>
          <icosahedronGeometry args={[0.72, 0]} />
          <meshStandardMaterial color={CRM} flatShading />
        </mesh>

      </group>
    </Float>
  )
}
