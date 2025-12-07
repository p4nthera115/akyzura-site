// import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
// import Character from "./character"
// import { folder, useControls } from "leva"
// import { Suspense, useEffect, useRef } from "react"
// import BackgroundPlane from "./background-plane"
// import * as THREE from "three"
// import { useHelper } from "@react-three/drei"
// import { useFrame } from "@react-three/fiber"

// export default function Experience() {
//   const cameraRef = useRef<THREE.PerspectiveCamera>(
//     new THREE.PerspectiveCamera()
//   )
//   if (cameraRef.current) {
//     useHelper(cameraRef, THREE.CameraHelper)
//   }

//   const lightRef = useRef<THREE.DirectionalLight>(new THREE.DirectionalLight())
//   if (lightRef.current) {
//     useHelper(lightRef, THREE.DirectionalLightHelper, 1, 0x0000ff)
//   }

//   useFrame(() => {
//     // if (cameraRef.current) {
//     //   cameraRef.current.position.set(0, 0, -5)
//     // }
//   })

//   const camera = useControls({
//     camera: folder({
//       position: {
//         value: [0, 0, -5],
//         min: -100,
//         max: 100,
//         step: 0.01,
//       },
//       rotation: {
//         value: [0, 0, 0],
//         min: -10,
//         max: 10,
//         step: 0.01,
//       },
//     }),
//   })

//   const light = useControls({
//     light: folder({
//       position: {
//         value: [-1.0299999999999765, 7.230000000000002, 7.759999999999992],
//         min: -100,
//         max: 100,
//         step: 0.01,
//       },
//       intensity: {
//         value: 4.94,
//         // value: 4.07,
//         // value: 1.15,
//         min: 0,
//         max: 10,
//         step: 0.01,
//       },
//     }),
//   })

//   return (
//     <Suspense>
//       <PerspectiveCamera
//         ref={cameraRef}
//         position={camera.position}
//         rotation={camera.rotation}
//       >
//         <Character />
//         <BackgroundPlane />
//         <OrbitControls />
//       </PerspectiveCamera>
//       <directionalLight
//         ref={lightRef}
//         position={light.position}
//         intensity={light.intensity}
//       />
//     </Suspense>
//   )
// }

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

  const camera = useControls({
    camera: folder({
      position: {
        value: [0, 0, 30],
        min: -100,
        max: 100,
        step: 1,
      },
      rotation: {
        value: [0, 0, 0],
        min: -10,
        max: 10,
        step: 0.1,
      },
      fov: {
        value: 50,
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

  const light = useControls({
    light: folder({
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
        position={camera.position}
        rotation={camera.rotation}
        fov={camera.fov}
        near={camera.near}
        far={camera.far}
      />

      {/* Scene content */}
      <Suspense>
        <Character />
        <BackgroundPlane />
      </Suspense>

      {/* Light with helper */}
      <directionalLight
        ref={lightRef}
        position={light.position}
        intensity={light.intensity}
        castShadow
      />
    </>
  )
}
