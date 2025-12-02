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
        // value: [-3.6099999999999945, 3.8499999999999805, 0.7699999999999996],
        // value: [-0.9499999999999906, 1.3799999999999815, 0.9899999999999962],
        // value: [-0.3599999999999901, 0.7899999999999809, 1.2199999999999964],
        value: [-1.0299999999999765, 7.230000000000002, 7.759999999999992],
        min: -10,
        max: 10,
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
      {/* <pointLight
        ref={redLightRef}
        position={[-3.8, -0.5, 5]}
        intensity={1}
        color={0xbf4219}
        decay={3}
      /> */}
      {/* <ambientLight intensity={2.7} color={0x0000ff} /> */}
    </Suspense>
  )
}
