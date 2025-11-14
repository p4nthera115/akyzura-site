import { useGLTF, useAnimations } from "@react-three/drei"
import { useEffect } from "react"
import { folder, useControls } from "leva"

export default function Character() {
  const character = useGLTF("/models/character.glb")
  const animations = useGLTF("/models/animations.glb")
  const { ref, actions } = useAnimations(animations.animations)

  const { scale, rotation, position } = useControls({
    character: folder({
      scale: { value: 11.2, min: 1, max: 30, step: 0.1 },
      rotation: {
        value: [-0.04, 0.32, -0.06],
        min: -10,
        max: 10,
        step: 0.01,
      },
      position: { value: [0.2, -4.5, 0], min: -10, max: 10 },
    }),
  })

  useEffect(() => {
    const idle = actions?.idle
    idle?.play()
  }, [ref, actions])

  return (
    <primitive
      ref={ref}
      object={character.scene}
      scale={scale}
      rotation={rotation}
      position={position}
    />
  )
}
