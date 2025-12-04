import * as THREE from "three"
import { useGLTF, useAnimations, useTexture, Outlines } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import { folder, useControls } from "leva"
import ProjectionMaterial from "../materials/projection-material"
import ToonMaterial from "../materials/toon-material"
import { useFrame } from "@react-three/fiber"

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
  // ******************* Load models *******************
  const character = useGLTF("/models/character.glb")
  const animations = useGLTF("/models/animations.glb")
  const { ref, actions } = useAnimations(animations.animations)

  // ******************* Define meshes *******************
  const face: THREE.SkinnedMesh[] = [
    character.meshes.Plane017,
    character.meshes.Plane017_2,
  ] as THREE.SkinnedMesh[]
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
  const shirt = [character.meshes.Plane016, character.meshes.Plane016_1]

  const misc: Record<string, THREE.Mesh> = {
    tie: character.meshes.cravate,
    tieKnot: character.meshes.chemise001,
    tieClips: character.meshes.cravate_clips,
    earrings: character.meshes.earings,
    belt: character.meshes.belt,
    beltBottom: character.meshes.belt001,
    beltTop: character.meshes.Cylinder004,
    ammo: character.meshes.Cylinder004_1,
    backAmmo: character.meshes.ammo_2,
  }

  const tongue = character.meshes.tongue_1

  const miscArray = Object.values(misc)

  // ******************* Play animations *******************
  useEffect(() => {
    const idle = actions?.idle
    idle?.play()
  }, [ref, actions])

  // ******************* Preload models *******************
  useGLTF.preload("/models/character.glb")
  useGLTF.preload("/models/animations.glb")

  // ******************* Textures *******************
  const allTextures = {
    skinBase: "/textures/skin-base.png",
  }

  // ******************* Load textures *******************
  const { skinBase } = useTexture(allTextures)

  // ******************* Flip textures *******************
  skinBase.flipY = false

  // ******************* Apply materials *******************
  sclera.material = new THREE.MeshToonMaterial()
  spine.material = new THREE.MeshToonMaterial()
  hairIn.material = new THREE.MeshToonMaterial()
  hairOut.material = new THREE.MeshBasicMaterial()

  miscArray.forEach((mesh) => (mesh.material = new THREE.MeshBasicMaterial()))

  gun.forEach((mesh) => (mesh.material = new THREE.MeshBasicMaterial()))
  knife.forEach((mesh) => (mesh.material = new THREE.MeshBasicMaterial()))
  shirt.forEach((mesh) => (mesh.material = new THREE.MeshToonMaterial()))

  jacket.material = ProjectionMaterial
  boots.material = ProjectionMaterial
  body.material = ProjectionMaterial

  ProjectionMaterial.uniforms.uColor.value.set(0.365, 0.337, 0.58)

  face.forEach((mesh) => (mesh.material = ToonMaterial(true, skinBase)))
  eyes.material = ToonMaterial(false, skinBase)
  fingers.material = ToonMaterial(false, skinBase)
  eyesDetails.material = ToonMaterial(false, skinBase)

  // ******************* Get typed materials *******************
  const eyesMaterial = getColorMapMaterial(eyes.material)
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
  const tieKnotMaterial = getColorMapMaterial(misc.tieKnot.material)
  const shirtMaterial = shirt.map((mesh) => getColorMapMaterial(mesh.material))
  const beltMaterial = getColorMapMaterial(misc.belt.material)
  const beltBottomMaterial = getColorMapMaterial(misc.beltBottom.material)
  const beltTopMaterial = getColorMapMaterial(misc.beltTop.material)
  const ammoMaterial = getColorMapMaterial(misc.ammo.material)
  const backAmmoMaterial = getColorMapMaterial(misc.backAmmo.material)
  const tongueMaterial = getColorMapMaterial(tongue.material)
  const scleraMaterial = getColorMapMaterial(sclera.material)

  // ******************* Apply textures *******************
  eyesMaterial.map = skinBase
  fingersMaterial.map = skinBase
  faceMaterial.forEach((material) => {
    material.map = skinBase
  })

  // ******************* Apply colors *******************

  //* Head
  eyesDetailsMaterial.color = new THREE.Color(0x000000)
  scleraMaterial.color = new THREE.Color(0xf0f1ff)
  tongueMaterial.color = new THREE.Color(0x000000)
  hairInMaterial.color = new THREE.Color(0x8f95f7)
  hairOutMaterial.color = new THREE.Color(0xffffff)
  earringsMaterial.color = new THREE.Color(0x000000)

  //* Belt
  beltMaterial.color = new THREE.Color(0x9298fc)
  beltBottomMaterial.color = new THREE.Color(0x9298fc)
  beltTopMaterial.color = new THREE.Color(0x9298fc)
  ammoMaterial.color = new THREE.Color(0x9298fc)
  backAmmoMaterial.color = new THREE.Color(0x9298fc)
  gunMaterial.forEach(
    (material) => (material.color = new THREE.Color(0x9298fc))
  )
  knifeMaterial.forEach(
    (material) => (material.color = new THREE.Color(0x9298fc))
  )

  //* Shirt
  shirtMaterial.forEach(
    (material) => (material.color = new THREE.Color(0x7d84f5))
  )

  //* Tie
  tieKnotMaterial.color = new THREE.Color(0xbf4219)
  tieMaterial.color = new THREE.Color(0xbf4219)
  tieClipsMaterial.color = new THREE.Color(0x000000)

  // ******************* Disable tone mapping *******************
  faceMaterial.forEach((material) => (material.toneMapped = false))
  hairOutMaterial.toneMapped = false

  // ******************* Color Management *******************
  const currentColor = useRef(new THREE.Vector3(0.365, 0.337, 0.58))
  const [activeColor, setActiveColor] = useState(false)

  const activeColorVec = new THREE.Vector3(1.0, 0.0, 0.0)
  const inactiveColorVec = new THREE.Vector3(0.365, 0.337, 0.58)

  // ******************* Update uniforms *******************
  useFrame((state, delta) => {
    ProjectionMaterial.uniforms.uTime.value = state.clock.elapsedTime

    const targetColor = activeColor ? activeColorVec : inactiveColorVec
    currentColor.current.lerp(targetColor, delta * 10)

    ProjectionMaterial.uniforms.uColor.value.copy(currentColor.current)
  })

  // ******************* Controls *******************
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

  return (
    <group>
      <primitive
        onClick={() => {
          setActiveColor(!activeColor)
        }}
        ref={ref}
        object={character.scene}
        scale={scale}
        rotation={rotation}
        position={position}
      ></primitive>
      <skinnedMesh
        geometry={face[0].geometry}
        skeleton={face[0].skeleton}
        material={new THREE.MeshToonMaterial({ visible: false })}
      >
        <Outlines color={0x000000} thickness={3} angle={0} />
      </skinnedMesh>
    </group>
  )
}
