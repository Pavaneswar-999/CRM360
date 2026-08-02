import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line, OrbitControls } from '@react-three/drei'
import type { Group } from 'three'

const nodes: Array<[number, number, number, string]> = [
  [-1.35, 0.65, 0.12, '#4f6fd2'],
  [-0.35, 1.05, -0.15, '#2da486'],
  [0.7, 0.76, 0.08, '#d9a64f'],
  [1.35, 0.1, -0.12, '#4f6fd2'],
  [0.68, -0.82, 0.2, '#2da486'],
  [-0.45, -0.95, -0.1, '#d47786'],
  [-1.3, -0.22, 0.14, '#4f6fd2'],
]

const links: Array<[[number, number, number], [number, number, number]]> = nodes.slice(1).map((node, index) => [nodes[0].slice(0, 3) as [number, number, number], node.slice(0, 3) as [number, number, number]])

function NetworkModel({ reduceMotion }: { reduceMotion: boolean }) {
  const group = useRef<Group>(null)
  useFrame((_, delta) => {
    if (!group.current || reduceMotion) return
    group.current.rotation.y += delta * 0.08
    group.current.rotation.x = Math.sin(Date.now() * 0.00025) * 0.04
  })
  return <group ref={group}>
    <mesh>
      <icosahedronGeometry args={[0.62, 2]} />
      <meshStandardMaterial color="#dbe4ff" emissive="#3c64d8" emissiveIntensity={0.18} roughness={0.36} metalness={0.22} transparent opacity={0.86} />
    </mesh>
    <mesh scale={0.74}>
      <icosahedronGeometry args={[0.62, 2]} />
      <meshBasicMaterial color="#f8fbff" wireframe transparent opacity={0.48} />
    </mesh>
    {links.map(([start, end], index) => <Line key={index} points={[start, end]} color="#91a8df" transparent opacity={0.62} lineWidth={1} />)}
    {nodes.map(([x, y, z, color], index) => <mesh key={index} position={[x, y, z]}>
      <sphereGeometry args={[index === 0 ? 0.13 : 0.095, 18, 18]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} roughness={0.3} />
    </mesh>)}
  </group>
}

function SceneFallback() {
  return <div className="relationship-scene-fallback" aria-hidden="true"><span /><span /><span /><span /><b>CRM360</b></div>
}

export function RelationshipScene() {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const canvas = document.createElement('canvas')
    setSupported(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')))
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduceMotion(media.matches)
    onChange(); media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  if (supported === false) return <SceneFallback />
  return <div className="relationship-scene" role="img" aria-label="A connected CRM360 relationship network visualization">
    {supported === null ? <SceneFallback /> : <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.6], fov: 46 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 3, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-3, -2, 2]} intensity={1.1} color="#8ca4f5" />
      <Suspense fallback={null}><NetworkModel reduceMotion={reduceMotion} /></Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reduceMotion} autoRotateSpeed={0.35} makeDefault />
    </Canvas>}
  </div>
}
