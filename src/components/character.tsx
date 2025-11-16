import * as THREE from "three"
import { useGLTF, useAnimations } from "@react-three/drei"
import { useEffect } from "react"
import { folder, useControls } from "leva"
import { useTexture } from "@react-three/drei"

// Reusable material type for materials that support `color` and `map`
type ColorMapMaterial =
  | THREE.MeshStandardMaterial
  | THREE.MeshPhysicalMaterial
  | THREE.MeshPhongMaterial
  | THREE.MeshToonMaterial

// Helper to safely get a single material with `color` / `map` from a mesh
function getColorMapMaterial(
  material: THREE.Material | THREE.Material[]
): ColorMapMaterial {
  const singleMaterial = Array.isArray(material) ? material[0] : material
  return singleMaterial as ColorMapMaterial
}

export default function Character() {
  const character = useGLTF("/models/character.glb")
  const animations = useGLTF("/models/animations.glb")
  const { ref, actions } = useAnimations(animations.animations)

  console.log(character)
  const body = character.meshes.body
  const eyes = character.meshes.yeux
  const boots = character.meshes.bottes

  // Use strongly-typed material helper so we can access `color`
  const eyeMaterial = getColorMapMaterial(eyes.material)
  eyeMaterial.color = new THREE.Color(0xfe514f)

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

  const bodyMaterial = getColorMapMaterial(body.material)
  const bootsMaterial = getColorMapMaterial(boots.material)

  bodyMaterial.map = bodyBase
  bootsMaterial.map = bootsBase

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
