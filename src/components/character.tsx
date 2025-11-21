import * as THREE from "three"
import { useGLTF, useAnimations, useTexture } from "@react-three/drei"
import { useEffect } from "react"
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

export default function Character() {
  const character = useGLTF("/models/character.glb")
  const animations = useGLTF("/models/animations.glb")
  const { ref, actions } = useAnimations(animations.animations)

  const face: THREE.Mesh[] = [
    character.meshes.Plane017,
    character.meshes.Plane017_2,
  ]
  const body = character.meshes.body
  const fingers = character.meshes.Plane011
  const eyes = character.meshes.yeux
  const sclera = character.meshes.Plane017_1
  const boots = character.meshes.bottes
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
      scale: { value: 11.7, min: 1, max: 30, step: 0.1 },
      rotation: {
        value: [-0.11, 0.28, 0.0],
        min: -10,
        max: 10,
        step: 0.01,
      },
      position: { value: [0.5, -4.7, 0], min: -10, max: 10, step: 0.01 },
    }),
  })

  useEffect(() => {
    const idle = actions?.idle
    idle?.play()
  }, [ref, actions])

  useGLTF.preload("/models/character.glb")
  useGLTF.preload("/models/animations.glb")

  // ******************* Textures *******************
  const allTextures = {
    bodyBase: "/textures/body-base.png",
    bootsBase: "/textures/boots-base.png",
    jacketBase: "/textures/coat-base.png",
    skinBase: "/textures/skin-base.png",
    miscBase: "/textures/misc-base.png",
    spineBase: "/textures/weapons-base.png",
    weaponsEmissive: "/textures/weapons-emissive.png",
  }

  // ******************* Load textures *******************
  const {
    bodyBase,
    bootsBase,
    jacketBase,
    skinBase,
    miscBase,
    spineBase,
    weaponsEmissive,
  } = useTexture(allTextures)

  // ******************* Flip textures *******************
  bodyBase.flipY = false
  bootsBase.flipY = false
  jacketBase.flipY = false
  skinBase.flipY = false
  spineBase.flipY = false
  miscBase.flipY = false
  weaponsEmissive.flipY = false

  // ******************* Apply materials *******************
  face.forEach((mesh) => (mesh.material = new THREE.MeshToonMaterial()))
  body.material = new THREE.MeshToonMaterial()
  fingers.material = new THREE.MeshToonMaterial()
  boots.material = new THREE.MeshToonMaterial()
  jacket.material = new THREE.MeshToonMaterial()
  eyes.material = new THREE.MeshToonMaterial()
  sclera.material = new THREE.MeshToonMaterial()
  eyesDetails.material = new THREE.MeshToonMaterial()
  spine.material = new THREE.MeshToonMaterial()
  hairIn.material = new THREE.MeshToonMaterial()
  hairOut.material = new THREE.MeshBasicMaterial()

  miscArray.forEach((mesh) => (mesh.material = new THREE.MeshBasicMaterial()))

  gun.forEach((mesh) => (mesh.material = new THREE.MeshBasicMaterial()))
  knife.forEach((mesh) => (mesh.material = new THREE.MeshBasicMaterial()))
  shirtCollar.forEach((mesh) => (mesh.material = new THREE.MeshToonMaterial()))

  // ******************* Get typed materials *******************
  const eyesMaterial = getColorMapMaterial(eyes.material)
  const bodyMaterial = getColorMapMaterial(body.material)
  const bootsMaterial = getColorMapMaterial(boots.material)
  const jacketMaterial = getColorMapMaterial(jacket.material)
  const eyesDetailsMaterial = getColorMapMaterial(eyesDetails.material)
  const hairOutMaterial = getColorMapMaterial(hairOut.material)
  const hairInMaterial = getColorMapMaterial(hairIn.material)
  const fingersMaterial = getColorMapMaterial(fingers.material)
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
  const beltMaterial = getColorMapMaterial(misc.belt.material)
  const beltBottomMaterial = getColorMapMaterial(misc.beltBottom.material)
  const beltTopMaterial = getColorMapMaterial(misc.beltTop.material)
  const ammoMaterial = getColorMapMaterial(misc.ammo.material)
  const backAmmoMaterial = getColorMapMaterial(misc.backAmmo.material)

  // ******************* Apply textures *******************
  eyesMaterial.map = skinBase
  fingersMaterial.map = skinBase
  faceMaterial.forEach((material) => (material.map = skinBase))

  // ******************* Apply colors *******************
  hairInMaterial.color = new THREE.Color(0x9998c8)
  hairOutMaterial.color = new THREE.Color(0xffffff)
  tieMaterial.color = new THREE.Color(0xbf4219)
  shirtMaterial.color = new THREE.Color(0xbf4219)
  tieClipsMaterial.color = new THREE.Color(0x000000)
  earringsMaterial.color = new THREE.Color(0x000000)
  bodyMaterial.color = new THREE.Color(0x000000)
  bootsMaterial.color = new THREE.Color(0x000000)

  beltMaterial.color = new THREE.Color(0xd1d1eb)
  beltBottomMaterial.color = new THREE.Color(0xd1d1eb)
  beltTopMaterial.color = new THREE.Color(0xd1d1eb)
  ammoMaterial.color = new THREE.Color(0xd1d1eb)
  backAmmoMaterial.color = new THREE.Color(0xd1d1eb)
  gunMaterial.forEach(
    (material) => (material.color = new THREE.Color(0xd1d1eb))
  )
  knifeMaterial.forEach(
    (material) => (material.color = new THREE.Color(0xd1d1eb))
  )

  jacketMaterial.color = new THREE.Color(0x000000)
  shirtCollarMaterial.forEach(
    (material) => (material.color = new THREE.Color(0x9998c8))
  )
  faceMaterial.forEach(
    (material) => (material.color = new THREE.Color(0xd1d1eb))
  )
  eyesDetailsMaterial.color = new THREE.Color(0x000000)

  // ******************* Disable tone mapping *******************
  faceMaterial.forEach((material) => (material.toneMapped = false))
  hairOutMaterial.toneMapped = false
  beltMaterial.toneMapped = false
  beltBottomMaterial.toneMapped = false
  beltTopMaterial.toneMapped = false
  ammoMaterial.toneMapped = false
  backAmmoMaterial.toneMapped = false
  gunMaterial.forEach((material) => (material.toneMapped = false))
  knifeMaterial.forEach((material) => (material.toneMapped = false))

  // TODO faceMaterial.forEach((material) => (material.emissiveMap = weaponsEmissive))
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
