import { OrbitControls } from "@react-three/drei"
import Character from "./character"
import { folder, useControls } from "leva"
import { Suspense, useRef, type RefObject } from "react"
import BackgroundPlane from "./background-plane"
import * as THREE from "three"
import { useHelper } from "@react-three/drei"

export default function Experience() {
  const redLightRef = useRef<THREE.PointLight>(null)
  useHelper(
    redLightRef as RefObject<THREE.PointLight>,
    THREE.PointLightHelper,
    0.5
  )

  const { position, intensity } = useControls({
    light: folder({
      position: {
        value: [-0.16, -0.05, 1.44],
        min: -10,
        max: 10,
        step: 0.01,
      },
      intensity: {
        value: 3,
        min: 0,
        max: 10,
        step: 0.1,
      },
    }),
  })
  return (
    <Suspense>
      <Character />
      <BackgroundPlane />
      <OrbitControls />
      <directionalLight
        position={position}
        intensity={intensity}
        color={0xaaaaff}
      />
      <pointLight
        ref={redLightRef}
        position={[-3.8, -0.5, 5]}
        intensity={1}
        color={0xbf4219}
        decay={3}
      />
      <ambientLight intensity={2.3} />
    </Suspense>
  )
}
