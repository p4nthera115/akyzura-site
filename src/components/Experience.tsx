import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei"
import Character from "./character"
import { folder, useControls } from "leva"
import { Suspense, useRef, type RefObject } from "react"
import BackgroundPlane from "./background-plane"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"

export default function Experience() {
  const { set } = useThree()

  // Refs for helpers
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera>(null)
  const lightRef = useRef<THREE.DirectionalLight>(null)

  const cameraHelper = useHelper(
    perspectiveCameraRef as RefObject<THREE.PerspectiveCamera>,
    THREE.CameraHelper
  )
  const lightHelper = useHelper(
    lightRef as RefObject<THREE.DirectionalLight>,
    THREE.DirectionalLightHelper,
    1,
    "blue"
  )

  const { useProdCamera } = useControls({
    useProdCamera: {
      value: false,
      label: "Use Prod Camera",
    },
  })

  const cameraControls = useControls({
    camera: folder({
      visible: {
        value: true,
      },
      position: {
        value: [0, 0, 12],
        min: -100,
        max: 100,
        step: 0.1,
      },
      rotation: {
        value: [-0.1, 0.1, 0],
        min: -10,
        max: 10,
        step: 0.01,
      },
      zoom: {
        value: 1,
        min: 0.1,
        max: 10,
        step: 0.01,
      },
      fov: {
        value: 42,
        min: 10,
        max: 120,
        step: 1,
      },
      near: {
        value: 0.1,
        min: 0.1,
        max: 100,
        step: 0.01,
      },
      far: {
        value: 50,
        min: 0,
        max: 100,
        step: 1,
      },
    }),
  })

  const lightControls = useControls({
    light: folder({
      visible: {
        value: true,
      },
      position: {
        value: [-1.03, 7.23, 7.76],
        min: -100,
        max: 100,
        step: 0.01,
      },
      intensity: {
        value: 4.94,
        min: 0,
        max: 10,
        step: 0.01,
      },
    }),
  })

  // Update the active camera based on toggle
  useFrame(() => {
    if (useProdCamera && perspectiveCameraRef.current) {
      set({ camera: perspectiveCameraRef.current })
    }

    if (lightHelper.current) {
      lightHelper.current.visible = lightControls.visible
    }
    if (cameraHelper.current) {
      cameraHelper.current.visible = cameraControls.visible
    }
  })
  return (
    <>
      {/* Development camera with OrbitControls */}
      <OrbitControls enabled={!useProdCamera} />

      {/* Production perspective camera */}
      <PerspectiveCamera
        ref={perspectiveCameraRef}
        makeDefault={useProdCamera}
        position={cameraControls.position}
        rotation={cameraControls.rotation}
        fov={cameraControls.fov}
        near={cameraControls.near}
        far={cameraControls.far}
        zoom={cameraControls.zoom}
      />

      {/* Scene content */}
      <Suspense>
        <Character />
        <BackgroundPlane />
      </Suspense>

      {/* Light with helper */}
      <directionalLight
        ref={lightRef}
        position={lightControls.position}
        intensity={lightControls.intensity}
        castShadow
      />
    </>
  )
}
