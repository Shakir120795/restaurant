import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, ContactShadows, Sparkles } from '@react-three/drei'
import type { Group } from 'three'

/** Lightweight procedural thali — no external model download, so it never blocks the menu.
 *  It is a stylised composition, NOT a photoreal 3D scan of a real dish. */
export function Thali(props: { position?: [number, number, number]; scale?: number }) {
  const g = useRef<Group>(null)
  useFrame((s, dt) => {
    if (!g.current) return
    // Slow idle sway + gentle pointer parallax (lerped, transform-only motion).
    const targetY = Math.sin(s.clock.elapsedTime * 0.25) * 0.35 + s.pointer.x * 0.25
    const targetX = s.pointer.y * -0.12
    g.current.rotation.y += (targetY - g.current.rotation.y) * Math.min(1, dt * 3)
    g.current.rotation.x += (targetX - g.current.rotation.x) * Math.min(1, dt * 3)
  })
  return (
    <group ref={g} {...props} scale={props.scale ?? 1}>
      {/* plate */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2.4, 0, 0]}>
        <cylinderGeometry args={[2.1, 1.8, 0.18, 48]} />
        <meshStandardMaterial color="#f3e2c2" metalness={0.15} roughness={0.35} />
      </mesh>
      {/* dosa roll */}
      <mesh position={[-0.7, 0.35, 0.3]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.32, 0.32, 2.1, 24]} />
        <meshStandardMaterial color="#e8a83c" roughness={0.6} />
      </mesh>
      {/* small bowls: chutney / sambar / paneer */}
      {[
        { p: [0.9, 0.3, -0.6] as const, c: '#2f7d4f' },
        { p: [1.15, 0.3, 0.5] as const, c: '#e8721c' },
        { p: [0.1, 0.3, -1.0] as const, c: '#fff3d6' },
      ].map((b, i) => (
        <mesh key={i} position={[b.p[0], b.p[1], b.p[2]]}>
          <sphereGeometry args={[0.42, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={b.c} roughness={0.4} />
        </mesh>
      ))}
      {/* bedai / kachori discs */}
      {[-0.3, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.22, 0.95]} rotation={[-Math.PI / 2.4, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.16, 24]} />
          <meshStandardMaterial color="#c97b2d" roughness={0.55} />
        </mesh>
      ))}
      {/* floating garnish: coriander + chilli, orbiting slowly with the group */}
      <mesh position={[1.8, 1.1, 0.4]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#2f7d4f" roughness={0.5} />
      </mesh>
      <mesh position={[-1.9, 0.9, -0.5]} rotation={[0, 0, 0.6]}>
        <capsuleGeometry args={[0.09, 0.35, 4, 12]} />
        <meshStandardMaterial color="#c1272d" roughness={0.5} />
      </mesh>
    </group>
  )
}

function CameraRig() {
  useFrame((s, dt) => {
    const tx = s.pointer.x * 0.5
    const ty = 3.4 + s.pointer.y * -0.3
    s.camera.position.x += (tx - s.camera.position.x) * Math.min(1, dt * 2)
    s.camera.position.y += (ty - s.camera.position.y) * Math.min(1, dt * 2)
    s.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 3.4, 4.6], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: 'low-power' }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} />
      <pointLight position={[-3, 2, 2]} intensity={8} color="#ffb066" />
      <Suspense fallback={null}>
        <CameraRig />
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7}>
          <Thali />
        </Float>
        <Sparkles count={28} scale={[6, 3, 4]} size={2.2} speed={0.25} color="#e8721c" opacity={0.45} />
        <ContactShadows position={[0, -0.6, 0]} opacity={0.35} scale={8} blur={2.5} />
      </Suspense>
    </Canvas>
  )
}
