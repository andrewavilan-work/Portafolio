import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/*
  Astronauta estilo Principito — creativo, expresivo.
  Cabeza grande y redonda con burbuja de casco, cuerpo compacto,
  brazo derecho señalando la galaxia con asombro.
  click → saludo / explosión (controlado desde padre)
*/

export default function LowPolyAstronaut({ scale = 1, position = [0, 0, 0], exploded = false }) {
  const armRRef  = useRef()  // brazo derecho — señala galaxia
  const headRef  = useRef()
  const capeRef  = useRef()
  const bodyRef  = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Cabeza: leve giro contemplativo hacia la galaxia
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.22) * 0.14 + 0.18
      headRef.current.rotation.x = -0.28 + Math.sin(t * 0.31) * 0.05
    }

    // Brazo derecho: señala arriba con suave balanceo
    if (armRRef.current) {
      if (exploded) {
        // Pose pánico — brazos extendidos
        armRRef.current.rotation.z = -Math.PI * 0.7 + Math.sin(t * 8) * 0.3
      } else {
        armRRef.current.rotation.z = -1.20 + Math.sin(t * 0.9) * 0.12
        armRRef.current.rotation.x =  0.30 + Math.sin(t * 0.7) * 0.08
      }
    }

    // Capa / scarf flotante
    if (capeRef.current) {
      capeRef.current.rotation.x = Math.sin(t * 1.1) * 0.18
      capeRef.current.rotation.z = Math.sin(t * 0.8) * 0.12
    }

    // Cuerpo: micro breathing
    if (bodyRef.current) {
      const scale = 1 + Math.sin(t * 0.9) * 0.012
      bodyRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group scale={scale} position={position}>

      {/* ─── CABEZA — burbuja grande, estilo cartoon ─── */}
      <group ref={headRef} position={[0, 1.30, 0]}>
        {/* Casco esférico grande */}
        <mesh>
          <icosahedronGeometry args={[0.58, 1]} />
          <meshStandardMaterial color="#EAE2FF" flatShading transparent opacity={0.88} />
        </mesh>
        {/* Aro inferior del casco */}
        <mesh position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.36, 0.38, 0.10, 6]} />
          <meshStandardMaterial color="#8C75C0" flatShading />
        </mesh>
        {/* Visera dorada — cara interior oscura = reflejo galaxia */}
        <mesh position={[0.06, 0.04, 0.42]} scale={[0.42, 0.38, 0.16]} rotation={[0.22, 0, 0]}>
          <sphereGeometry args={[1, 6, 5]} />
          <meshStandardMaterial color="#B8660A" flatShading transparent opacity={0.78} />
        </mesh>
        {/* Galaxia visible dentro del visor */}
        <mesh position={[0.06, 0.04, 0.50]} scale={[0.26, 0.24, 0.04]}>
          <sphereGeometry args={[1, 5, 4]} />
          <meshStandardMaterial color="#4B2090" flatShading transparent opacity={0.65} />
        </mesh>
        {/* Brillo visor */}
        <mesh position={[0.16, 0.16, 0.56]} scale={[0.09, 0.07, 0.02]}>
          <sphereGeometry args={[1, 3, 2]} />
          <meshStandardMaterial color="#FFF4D0" flatShading transparent opacity={0.55} />
        </mesh>
        {/* Antena pequeña */}
        <mesh position={[0.22, 0.52, 0]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.010, 0.007, 0.44, 3]} />
          <meshStandardMaterial color="#9B87C0" flatShading />
        </mesh>
        <mesh position={[0.38, 0.72, 0]} scale={0.045}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#E8956A" flatShading />
        </mesh>
      </group>

      {/* ─── CUELLO / CONECTOR ─── */}
      <mesh position={[0, 0.80, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.18, 5]} />
        <meshStandardMaterial color="#C4B4E8" flatShading />
      </mesh>

      {/* ─── CUERPO — compacto y cute ─── */}
      <group ref={bodyRef} position={[0, 0.22, 0]}>
        {/* Torso */}
        <mesh scale={[0.68, 0.72, 0.54]}>
          <boxGeometry />
          <meshStandardMaterial color="#F0ECFF" flatShading />
        </mesh>
        {/* Panel pecho */}
        <mesh position={[0, 0.12, 0.28]} scale={[0.30, 0.26, 0.06]}>
          <boxGeometry />
          <meshStandardMaterial color="#6B4EC0" flatShading />
        </mesh>
        {/* Luces panel */}
        {[[-0.08, 0.18, 0.295], [0, 0.18, 0.295], [0.08, 0.18, 0.295]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <octahedronGeometry args={[0.032, 0]} />
            <meshStandardMaterial
              color={['#E8956A', '#70E8C0', '#A07EE8'][i]}
              flatShading
            />
          </mesh>
        ))}
        {/* Mochila propulsora */}
        <mesh position={[0, 0, -0.36]} scale={[0.44, 0.52, 0.14]}>
          <boxGeometry />
          <meshStandardMaterial color="#9B87C0" flatShading />
        </mesh>
        {/* Boquillas */}
        {[-0.13, 0.13].map((x, i) => (
          <mesh key={i} position={[x, -0.14, -0.43]}>
            <cylinderGeometry args={[0.042, 0.055, 0.10, 5]} />
            <meshStandardMaterial color="#3A2870" flatShading />
          </mesh>
        ))}
      </group>

      {/* ─── CAPA / SCARF flotante ─── */}
      <group ref={capeRef} position={[0, 0.30, -0.28]}>
        <mesh scale={[0.5, 0.7, 0.04]}>
          <boxGeometry />
          <meshStandardMaterial color="#7C5FC4" flatShading transparent opacity={0.80} />
        </mesh>
        {/* Punta de la capa */}
        <mesh position={[0, -0.42, 0]} scale={[0.5, 0.22, 0.04]}>
          <coneGeometry args={[1, 1, 4]} />
          <meshStandardMaterial color="#5C3E9E" flatShading transparent opacity={0.75} />
        </mesh>
      </group>

      {/* ─── HOMBROS ─── */}
      {[-0.50, 0.50].map((x, i) => (
        <mesh key={i} position={[x, 0.52, 0]} scale={0.145}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#C4B4E8" flatShading />
        </mesh>
      ))}

      {/* ─── BRAZO DERECHO — señala la galaxia ─── */}
      <group ref={armRRef} position={[0.50, 0.48, 0]} rotation={[0.30, -0.15, -1.20]}>
        <mesh position={[0, -0.26, 0]} scale={[0.145, 0.46, 0.145]}>
          <cylinderGeometry args={[1, 0.88, 1, 5]} />
          <meshStandardMaterial color="#F0ECFF" flatShading />
        </mesh>
        <mesh position={[0, -0.54, 0]} scale={0.155}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#7C5FC4" flatShading />
        </mesh>
      </group>

      {/* ─── BRAZO IZQUIERDO — relajado a un lado ─── */}
      <group position={[-0.50, 0.44, 0]} rotation={[-0.10, 0.10, 0.32]}>
        <mesh position={[0, -0.26, 0]} scale={[0.145, 0.46, 0.145]}>
          <cylinderGeometry args={[0.88, 1, 1, 5]} />
          <meshStandardMaterial color="#F0ECFF" flatShading />
        </mesh>
        <mesh position={[0, -0.54, 0]} scale={0.155}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#7C5FC4" flatShading />
        </mesh>
      </group>

      {/* ─── CADERA ─── */}
      <mesh position={[0, -0.24, 0]} scale={[0.56, 0.16, 0.44]}>
        <boxGeometry />
        <meshStandardMaterial color="#C4B4E8" flatShading />
      </mesh>

      {/* ─── PIERNAS — ligeramente separadas, plantadas en el planeta ─── */}
      {[-0.20, 0.20].map((x, i) => (
        <group key={i} position={[x, -0.62, 0]}>
          <mesh scale={[0.185, 0.46, 0.185]}>
            <cylinderGeometry args={[i === 0 ? 1 : 0.9, i === 0 ? 0.9 : 1, 1, 5]} />
            <meshStandardMaterial color="#F0ECFF" flatShading />
          </mesh>
          <mesh position={[0, -0.30, 0.06]} scale={[0.21, 0.11, 0.30]}>
            <boxGeometry />
            <meshStandardMaterial color="#5C3E9E" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  )
}
