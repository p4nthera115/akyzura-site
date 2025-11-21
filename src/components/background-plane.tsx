export default function BackgroundPlane() {
  return (
    <mesh position={[-8, 0, 0]} rotation={[0, 0, -0.08]}>
      <planeGeometry args={[7, 15]} />
      <meshBasicMaterial color="black" />
    </mesh>
  )
}
