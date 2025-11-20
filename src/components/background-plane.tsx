export default function BackgroundPlane() {
  return (
    <mesh position={[-8, 0, 0]}>
      <planeGeometry args={[7, 15]} />
      <meshBasicMaterial color="black" />
    </mesh>
  )
}
