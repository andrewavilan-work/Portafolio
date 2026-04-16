import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

/*
  Husky Siberiano — retrato de cabeza LOW-POLY con flatShading.

  Anatomía real:
  · Cráneo REDONDO y ANCHO — muy distinto al Pastor
  · Máscara facial clásica del Husky:
      - Casquete gris/negro en la parte alta del cráneo
      - Franja blanca que baja por el centro de la frente
      - Mejillas y hocico completamente blancos
  · Ojos azul HIELO — el rasgo más icónico, deben dominar la cara
  · Hocico más corto y ancho que el Pastor
  · Orejas triangulares, más pequeñas, de punta redondeada

  Truco low-poly: icosahedronGeometry(1,1)+flatShading para facetas claras,
  los ojos tienen emissive propio para que brillen independientemente de la luz.
*/

const WHT   = '#F0EFF8'   // blanco base — cara, mejillas, hocico
const LGR   = '#C8C7D8'   // gris claro — marcas faciales
const DGR   = '#6A6882'   // gris oscuro — casquete superior
const DGRB  = '#484660'   // gris muy oscuro — detalles máscara
const PINK  = '#F0A8BC'   // interior orejas / lengua
const NOS   = '#0E0C18'   // nariz negra
const WSCLR = '#EEEEFF'   // esclerótica (blanco del ojo)
const BLUE  = '#30BBFF'   // iris azul hielo vibrante — ICÓNICO
const DBLU  = '#0875C4'   // pupila azul profundo

export default function HuskyHead() {
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
            CRÁNEO — redondo y ancho
            (más esférico que el Pastor)
            ══════════════════════════ */}
        {/* Base blanca del cráneo */}
        <mesh position={[0, 0.26, 0.00]} scale={[1.12, 0.86, 1.00]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>

        {/* Casquete gris oscuro — parte superior del cráneo */}
        <mesh position={[0, 0.56, -0.06]} scale={[0.98, 0.44, 0.90]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={DGR} flatShading />
        </mesh>

        {/* ══════════════════════════
            MÁSCARA FACIAL DEL HUSKY
            Patrón: gris en los lados de la frente,
            franja blanca central, mejillas blancas
            ══════════════════════════ */}
        {/* Banda gris izquierda (desde la oreja hasta encima del ojo) */}
        <mesh position={[-0.42, 0.32, 0.52]}
          rotation={[0, 0.18, 0.08]}
          scale={[0.28, 0.32, 0.20]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={LGR} flatShading />
        </mesh>
        {/* Banda gris derecha */}
        <mesh position={[ 0.42, 0.32, 0.52]}
          rotation={[0, -0.18, -0.08]}
          scale={[0.28, 0.32, 0.20]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={LGR} flatShading />
        </mesh>

        {/* Franja blanca central en la frente (entre los dos grises) */}
        <mesh position={[0, 0.40, 0.60]} scale={[0.22, 0.36, 0.16]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>

        {/* Cara central baja — blanca */}
        <mesh position={[0, 0.02, 0.56]} scale={[0.70, 0.58, 0.46]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>

        {/* Mejilla izquierda blanca */}
        <mesh position={[-0.56, -0.02, 0.38]} scale={[0.30, 0.46, 0.36]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>
        {/* Mejilla derecha blanca */}
        <mesh position={[ 0.56, -0.02, 0.38]} scale={[0.30, 0.46, 0.36]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>

        {/* ══════════════════════════
            HOCICO — más corto y cuadrado que el Pastor
            ══════════════════════════ */}
        {/* Cuerpo del hocico */}
        <mesh position={[0, -0.18, 0.96]} scale={[0.46, 0.28, 0.54]}>
          <boxGeometry args={[1, 1, 1, 1, 1, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>
        {/* Punta redondeada */}
        <mesh position={[0, -0.19, 1.44]} scale={[0.38, 0.24, 0.22]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>
        {/* Línea de la boca */}
        <mesh position={[0, -0.28, 1.22]} scale={[0.32, 0.028, 0.44]}>
          <boxGeometry />
          <meshStandardMaterial color={DGRB} flatShading />
        </mesh>

        {/* NARIZ */}
        <mesh position={[0, -0.08, 1.58]} scale={[0.17, 0.11, 0.10]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={NOS} flatShading />
        </mesh>
        <mesh position={[0, -0.08, 1.66]} scale={[0.09, 0.038, 0.036]}>
          <boxGeometry />
          <meshStandardMaterial color="#040310" />
        </mesh>

        {/* ══════════════════════════
            OJOS — AZUL HIELO, el rasgo más icónico
            Deben ser grandes y brillar
            ══════════════════════════ */}
        {[-1, 1].map((side, i) => (
          <group key={i} position={[side * 0.44, 0.20, 0.86]}>
            {/* Anillo exterior oscuro (da profundidad) */}
            <mesh scale={[0.148, 0.115, 0.072]}>
              <icosahedronGeometry args={[0.72, 1]} />
              <meshStandardMaterial color={DGRB} flatShading />
            </mesh>
            {/* Esclerótica */}
            <mesh position={[0, 0, 0.024]} scale={[0.118, 0.095, 0.055]}>
              <icosahedronGeometry args={[0.72, 1]} />
              <meshStandardMaterial color={WSCLR} flatShading />
            </mesh>
            {/* Iris AZUL HIELO — grande, emissive para brillo propio */}
            <mesh position={[0, 0, 0.050]} scale={[0.092, 0.082, 0.040]}>
              <icosahedronGeometry args={[0.72, 1]} />
              <meshStandardMaterial
                color={BLUE}
                emissive={BLUE}
                emissiveIntensity={0.55}
                flatShading />
            </mesh>
            {/* Pupila azul profundo */}
            <mesh position={[0, 0, 0.074]} scale={[0.040, 0.040, 0.020]}>
              <icosahedronGeometry args={[0.72, 0]} />
              <meshStandardMaterial color={DBLU} flatShading />
            </mesh>
            {/* Centro pupila */}
            <mesh position={[0, 0, 0.086]} scale={[0.018, 0.018, 0.010]}>
              <icosahedronGeometry args={[0.72, 0]} />
              <meshStandardMaterial color="#020210" />
            </mesh>
            {/* Brillo principal */}
            <mesh position={[side * -0.026, 0.025, 0.098]} scale={0.016}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#FFFFFF"
                emissive="#FFFFFF" emissiveIntensity={3.5} />
            </mesh>
            {/* Brillo secundario (hace el ojo más realista) */}
            <mesh position={[side * 0.012, -0.016, 0.094]} scale={0.009}>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#FFFFFF"
                emissive="#FFFFFF" emissiveIntensity={2.0} />
            </mesh>
          </group>
        ))}

        {/* ══════════════════════════
            OREJAS — triangulares, 4 lados,
            ligeramente más pequeñas que el Pastor
            ══════════════════════════ */}
        {[-1, 1].map((side, i) => (
          <group key={i}
            position={[side * 0.52, 0.86, -0.16]}
            rotation={[0.08, side * -0.18, side * 0.06]}>
            {/* Exterior gris */}
            <mesh scale={[0.24, 0.60, 0.18]}>
              <coneGeometry args={[1, 1.5, 4]} />
              <meshStandardMaterial color={DGR} flatShading />
            </mesh>
            {/* Interior rosado */}
            <mesh position={[0, 0.05, 0.040]} scale={[0.13, 0.42, 0.068]}>
              <coneGeometry args={[1, 1.4, 4]} />
              <meshStandardMaterial color={PINK} flatShading />
            </mesh>
          </group>
        ))}

        {/* ══════════════════════════
            LENGUA
            ══════════════════════════ */}
        <mesh position={[0.02, -0.42, 1.38]}
          rotation={[0.22, 0, 0.04]}
          scale={[0.094, 0.135, 0.040]}>
          <boxGeometry />
          <meshStandardMaterial color={PINK} flatShading transparent opacity={0.92} />
        </mesh>
        <mesh position={[0.02, -0.54, 1.41]}
          rotation={[0.18, 0, 0]}
          scale={[0.082, 0.060, 0.032]}>
          <icosahedronGeometry args={[0.72, 0]} />
          <meshStandardMaterial color={PINK} flatShading transparent opacity={0.85} />
        </mesh>

        {/* ══════════════════════════
            CUELLO / BUSTO
            ══════════════════════════ */}
        <mesh position={[0, -0.62, 0.12]} scale={[0.70, 0.42, 0.56]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>
        <mesh position={[0, -0.70, 0.44]} scale={[0.46, 0.28, 0.28]}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial color={WHT} flatShading />
        </mesh>

      </group>
    </Float>
  )
}
