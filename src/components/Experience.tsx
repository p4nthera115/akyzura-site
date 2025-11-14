import { OrbitControls } from "@react-three/drei"
import Character from "./character"
import { folder, useControls } from "leva"

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
        value: 1,
        min: 0,
        max: 10,
        step: 0.1,
      },
    }),
  })
  return (
    <>
      <Character />
      <OrbitControls />
      <directionalLight position={position} intensity={intensity} />
    </>
  )
}
