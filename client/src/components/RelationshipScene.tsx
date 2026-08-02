import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import type { Group } from 'three'

const cards: Array<{ position: [number, number, number]; rotation: [number, number, number]; size: [number, number, number]; color: string }> = [
  { position: [-1.28, 0.56, 0.1], rotation: [0.1, -0.28, -0.08], size: [1.12, 0.68, 0.08], color: '#e9e3d6' },
  { position: [0.12, 0.1, -0.14], rotation: [-0.07, 0.16, 0.08], size: [1.36, 0.78, 0.09], color: '#a5b832' },
  { position: [1.28, -0.58, 0.08], rotation: [0.1, 0.28, -0.1], size: [1.04, 0.62, 0.08], color: '#536154' },
]

const threads: Array<Array<[number, number, number]>> = [
  [[-1.75, 0.82, 0], [-0.52, 0.53, 0.04], [0.2, 0.14, 0], [1.72, -0.48, 0.03]],
  [[-1.62, -0.1, 0.02], [-0.62, -0.34, 0.04], [0.38, -0.04, 0.02], [1.65, 0.42, 0]],
  [[-0.95, 1.02, -0.05], [0.02, 0.5, 0.03], [1.28, 0.96, 0]],
]

function ThreadPlanes({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null)

  useFrame((_state, delta) => {
    if (!group.current || reducedMotion) return
    group.current.rotation.y += delta * 0.035
    group.current.position.y = Math.sin(performance.now() * 0.00038) * 0.045
  })

  return <group ref={group}>
    {threads.map((points, index) => <Line key={index} points={points} color={index === 0 ? '#a5b832' : '#b7b0a2'} transparent opacity={index === 0 ? 0.9 : 0.48} lineWidth={1} />)}
    {cards.map((card, index) => <mesh key={index} position={card.position} rotation={card.rotation}>
      <boxGeometry args={card.size} />
      <meshStandardMaterial color={card.color} roughness={0.78} metalness={0.03} />
    </mesh>)}
  </group>
}

function SceneFallback() {
  return <div className="relationship-scene-fallback" aria-hidden="true"><span /><span /><span /><i /><i /><i /></div>
}

export function RelationshipScene() {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    setSupported(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')))
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(media.matches)
    updateMotion()
    media.addEventListener('change', updateMotion)
    return () => media.removeEventListener('change', updateMotion)
  }, [])

  if (supported === false || reducedMotion) return <SceneFallback />

  return <div className="relationship-scene" role="img" aria-label="Abstract connected record planes">
    {supported === null ? <SceneFallback /> : <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.9], fov: 44 }}>
      <ambientLight intensity={1.35} />
      <directionalLight position={[2, 3, 4]} intensity={1.35} color="#fffdf6" />
      <Suspense fallback={null}><ThreadPlanes reducedMotion={reducedMotion} /></Suspense>
    </Canvas>}
  </div>
}
