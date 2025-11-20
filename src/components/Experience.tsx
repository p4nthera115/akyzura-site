import { OrbitControls } from "@react-three/drei"
import Character from "./character"
import { folder, useControls } from "leva"
import { Suspense } from "react"
import BackgroundPlane from "./background-plane"

export default function Experience() {
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
      <ambientLight intensity={3.5} />
    </Suspense>
  )
}
