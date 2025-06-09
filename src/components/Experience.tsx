import { useGLTF, OrbitControls } from "@react-three/drei"

export default function Experience() {
  const scene = useGLTF("/models/scene.glb")

  console.log(scene)
  return (
    <>
      <OrbitControls />
    </>
  )
}
