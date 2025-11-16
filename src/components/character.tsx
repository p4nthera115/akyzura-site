import * as THREE from "three"
import { useGLTF, useAnimations } from "@react-three/drei"
import { useEffect } from "react"
import { folder, useControls } from "leva"
import { useTexture } from "@react-three/drei"

export default function Character() {
  const character = useGLTF("/models/character.glb")
  const animations = useGLTF("/models/animations.glb")
  const { ref, actions } = useAnimations(animations.animations)

  console.log(character)
  const body = character.meshes.body
  const eyes = character.meshes.yeux
  const boots = character.meshes.bottes

  eyes.material.color = new THREE.Color(0xfe514f)

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

  useGLTF.preload("/models/character.glb")
  useGLTF.preload("/models/animations.glb")

  const allTextures = ["/textures/body-base.png", "/textures/boots-base.png"]

  const [bodyBase, bootsBase] = useTexture(allTextures)

  body.material.map = bodyBase
  boots.material.map = bootsBase
  return (
    <primitive
      ref={ref}
      object={character.scene}
      scale={scale}
      rotation={rotation}
      position={position}
      material={new THREE.MeshToonMaterial()}
    ></primitive>
  )
}
