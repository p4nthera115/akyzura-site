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
        value: [-1.0299999999999765, 7.230000000000002, 7.759999999999992],
        min: -100,
        max: 100,
        step: 0.01,
      },
      intensity: {
        value: 4.94,
        // value: 4.07,
        // value: 1.15,
        min: 0,
        max: 10,
        step: 0.01,
      },
    }),
  })

  return (
    <Suspense>
      <Character />
      <BackgroundPlane />
      <OrbitControls />
      <directionalLight position={position} intensity={intensity} />
    </Suspense>
  )
}
