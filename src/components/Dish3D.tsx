import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, ContactShadows } from '@react-three/drei'
import { Thali } from './Hero3D'

/** Mini 3D dish view for signature dishes. Drag to rotate, scroll/pinch to zoom.
 *  Stylised thali composition — not a photoreal scan of the actual dish. */
export default function Dish3D() {
  return (
    <Canvas camera={{ position: [0, 3.2, 4.2], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'low-power' }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} />
      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Thali scale={0.85} />
        </Float>
        <ContactShadows position={[0, -0.6, 0]} opacity={0.35} scale={8} blur={2.5} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={7} autoRotate autoRotateSpeed={0.8} />
      </Suspense>
    </Canvas>
  )
}
