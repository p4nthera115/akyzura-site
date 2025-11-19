import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import {
  useGLTF,
  useAnimations,
  MeshPortalMaterial,
  useTexture,
} from "@react-three/drei"
import { Suspense, useEffect } from "react"
import { folder, useControls } from "leva"

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

const toonMaterial = new THREE.ShaderMaterial({
  vertexShader: `
  void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 clipPosition = projectionMatrix * viewPosition;

  gl_Position = clipPosition;
}`,
  fragmentShader: `
  void main() {
  gl_FragColor = vec4(vec3(0.39, 0.58, 0.93), 1.0);
}`,
})

export default function Character() {
  const character = useGLTF("/models/character.glb")
  const animations = useGLTF("/models/animations.glb")
  const { ref, actions } = useAnimations(animations.animations)

  const face: THREE.Mesh[] = [
    character.meshes.Plane017,
    character.meshes.Plane017_2,
  ]
  const body: THREE.Mesh = character.meshes.body
  const fingers = character.meshes.Plane011
  const eyes: THREE.Mesh = character.meshes.yeux
  const sclera: THREE.Mesh = character.meshes.Plane017_1
  const boots: THREE.Mesh = character.meshes.bottes
  const jacket = character.meshes.veste
  const eyesDetails = character.meshes.eye_details
  const spine = character.meshes.spine
  const hairOut = character.meshes.NurbsPath008
  const hairIn = character.meshes.NurbsPath008_1

  const gun = [character.meshes.Cube008, character.meshes.Cube008_1]
  const knife = [character.meshes.Cylinder002, character.meshes.Cylinder002_1]
  const shirtCollar = [character.meshes.Plane016, character.meshes.Plane016_1]

  const misc: Record<string, THREE.Mesh> = {
    shirt: character.meshes.chemise001,
    tie: character.meshes.cravate,
    tieClips: character.meshes.cravate_clips,
    earrings: character.meshes.earings,
    belt: character.meshes.belt,
    beltBottom: character.meshes.belt001,
    beltTop: character.meshes.Cylinder004,
    ammo: character.meshes.Cylinder004_1,
    backAmmo: character.meshes.ammo_2,
  }

  const miscArray = Object.values(misc)

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

  // Textures
  const allTextures = {
    bodyBase: "/textures/body-base.png",
    bootsBase: "/textures/boots-base.png",
    jacketBase: "/textures/coat-base.png",
    skinBase: "/textures/skin-base.png",
    miscBase: "/textures/misc-base.png",
    spineBase: "/textures/weapons-base.png",
  }

  // Load textures
  const { bodyBase, bootsBase, jacketBase, skinBase, miscBase, spineBase } =
    useTexture(allTextures)

  // Flip textures
  bodyBase.flipY = false
  bootsBase.flipY = false
  jacketBase.flipY = false
  skinBase.flipY = false
  spineBase.flipY = false
  miscBase.flipY = false

  // Apply materials
  face.forEach((mesh) => (mesh.material = new THREE.MeshToonMaterial()))
  body.material = new THREE.MeshToonMaterial()
  fingers.material = new THREE.MeshToonMaterial()
  boots.material = new THREE.MeshToonMaterial()
  jacket.material = new THREE.MeshToonMaterial()
  eyes.material = new THREE.MeshToonMaterial()
  sclera.material = new THREE.MeshToonMaterial()
  eyesDetails.material = new THREE.MeshToonMaterial()
  spine.material = new THREE.MeshToonMaterial()
  hairOut.material = new THREE.MeshToonMaterial()
  hairIn.material = new THREE.MeshToonMaterial()

  miscArray.forEach((mesh) => (mesh.material = new THREE.MeshToonMaterial()))

  gun.forEach((mesh) => (mesh.material = new THREE.MeshToonMaterial()))
  knife.forEach((mesh) => (mesh.material = new THREE.MeshToonMaterial()))
  shirtCollar.forEach((mesh) => (mesh.material = new THREE.MeshToonMaterial()))

  // Get typed materials
  const eyesMaterial = getColorMapMaterial(eyes.material)
  const bodyMaterial = getColorMapMaterial(body.material)
  const bootsMaterial = getColorMapMaterial(boots.material)
  const jacketMaterial = getColorMapMaterial(jacket.material)
  const eyesDetailsMaterial = getColorMapMaterial(eyesDetails.material)
  const spineMaterial = getColorMapMaterial(spine.material)
  const hairOutMaterial = getColorMapMaterial(hairOut.material)
  const hairInMaterial = getColorMapMaterial(hairIn.material)
  const miscMaterial = miscArray.map((mesh) =>
    getColorMapMaterial(mesh.material)
  )
  const earringsMaterial = getColorMapMaterial(misc.earrings.material)
  const faceMaterial = face.map((mesh) => getColorMapMaterial(mesh.material))
  const tieMaterial = getColorMapMaterial(misc.tie.material)
  const tieClipsMaterial = getColorMapMaterial(misc.tieClips.material)
  const gunMaterial = gun.map((mesh) => getColorMapMaterial(mesh.material))
  const knifeMaterial = knife.map((mesh) => getColorMapMaterial(mesh.material))
  const shirtMaterial = getColorMapMaterial(misc.shirt.material)
  const shirtCollarMaterial = shirtCollar.map((mesh) =>
    getColorMapMaterial(mesh.material)
  )

  // Apply textures
  eyesMaterial.map = skinBase
  faceMaterial.forEach((material) => (material.map = skinBase))

  // Apply colors
  hairInMaterial.color = new THREE.Color(0x9998c8)
  tieMaterial.color = new THREE.Color(0xa82e2e)
  shirtMaterial.color = new THREE.Color(0xa82e2e)
  tieClipsMaterial.color = new THREE.Color(0x000000)
  earringsMaterial.color = new THREE.Color(0x000000)
  shirtCollarMaterial.forEach(
    (material) => (material.color = new THREE.Color(0x9998c8))
  )
  faceMaterial.forEach(
    (material) => (material.color = new THREE.Color(0xd1d1eb))
  )
  eyesDetailsMaterial.color = new THREE.Color(0x000000)

  console.log(character.meshes)
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
