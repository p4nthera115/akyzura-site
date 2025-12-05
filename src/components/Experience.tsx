import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import Character from "./character"
import { folder, useControls } from "leva"
import { Suspense, useRef, type RefObject } from "react"
import BackgroundPlane from "./background-plane"
import * as THREE from "three"
import { useHelper } from "@react-three/drei"

export default function Experience() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  useHelper(cameraRef as RefObject<THREE.PerspectiveCamera>, THREE.CameraHelper)
  const lightRef = useRef<THREE.DirectionalLight>(null)
  useHelper(
    lightRef as RefObject<THREE.DirectionalLight>,
    THREE.DirectionalLightHelper,
    1,
    0x0000ff
  )

  const camera = useControls({
    camera: folder({
      position: {
        value: [0, 0, -5],
        min: -100,
        max: 100,
        step: 0.01,
      },
      rotation: {
        value: [0, 0, 0],
        min: -10,
        max: 10,
        step: 0.01,
      },
    }),
  })

  const light = useControls({
    light: folder({
      position: {
        value: [-1.0299999999999765, 7.230000000000002, 7.759999999999992],
        min: -100,
        max: 100,
        step: 0.01,
      },
      intensity: {
        value: 4.94,
        // value: 4.07,
        // value: 1.15,
        min: 0,
        max: 10,
        step: 0.01,
      },
    }),
  })

  return (
    <Suspense>
      <PerspectiveCamera
        ref={cameraRef}
        position={camera.position}
        rotation={camera.rotation}
      >
        <Character />
        <BackgroundPlane />
        <OrbitControls />
      </PerspectiveCamera>
      <directionalLight
        ref={lightRef}
        position={light.position}
        intensity={light.intensity}
      />
    </Suspense>
  )
}
