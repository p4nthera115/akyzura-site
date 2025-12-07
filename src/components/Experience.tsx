import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei"
import Character from "./character"
import { folder, useControls } from "leva"
import { Suspense, useEffect, useRef, type RefObject } from "react"
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

  useEffect(() => {
    console.log(cameraHelper, lightHelper)
    if (useProdCamera && perspectiveCameraRef.current) {
      set({ camera: perspectiveCameraRef.current })
    }
  }, [
    cameraHelper,
    lightHelper,
    perspectiveCameraRef.current,
    lightRef.current,
  ])

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
        step: 1,
      },
      rotation: {
        value: [-0.1, 0.1, 0],
        min: -10,
        max: 10,
        step: 0.1,
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
    // <Suspense>
    <>
      {/* Development camera with OrbitControls - this is the default */}
      {!useProdCamera && <OrbitControls />}

      {/* Production perspective camera - visible as helper in dev mode */}
      <PerspectiveCamera
        ref={perspectiveCameraRef}
        makeDefault={useProdCamera}
        position={cameraControls.position}
        rotation={cameraControls.rotation}
        fov={cameraControls.fov}
        near={cameraControls.near}
        far={cameraControls.far}
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
