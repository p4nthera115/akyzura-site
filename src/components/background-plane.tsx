import ProjectionMaterial from "../materials/projection-material"

export default function BackgroundPlane() {
  return (
    <mesh
      material={ProjectionMaterial}
      position={[-8, 0, 0]}
      rotation={[0, 0, -0.08]}
    >
      <planeGeometry args={[7, 15]} />
    </mesh>
  )
}
