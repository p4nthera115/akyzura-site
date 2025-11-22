import { useEffect, useMemo } from "react"
import * as THREE from "three"
import CSM from "three-custom-shader-material/vanilla"

export type Stop = {
  color: string
  pos: number
}

const generateRampTexture = (stops: Stop[]) => {
  const width = 256
  const data = new Uint8Array(width * 4)
  const color = new THREE.Color()

  const sorted = [...stops].sort((a, b) => a.pos - b.pos)

  for (let i = 0; i < width; i++) {
    const normalizedPos = i / width

    let activeStop = sorted[0]
    for (let j = 0; j < sorted.length; j++) {
      if (sorted[j].pos <= normalizedPos) {
        activeStop = sorted[j]
      }
    }

    color.set(activeStop.color)

    const stride = i * 4
    data[stride] = Math.floor(color.r * 255)
    data[stride + 1] = Math.floor(color.g * 255)
    data[stride + 2] = Math.floor(color.b * 255)
    data[stride + 3] = 255

    const texture = new THREE.DataTexture(data, width, 1)
    texture.needsUpdate = true

    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter

    return texture
  }
}

export function useToonMaterial(rampStops: Stop[]) {
  const material = useMemo(() => {
    return new CSM({
      baseMaterial: THREE.MeshToonMaterial,
      uniforms: {
        uRamp: { value: null },
      },
      fragmentShader: /* glsl */ `
          uniform sampler2D uRamp;

          float luma(vec3 color) {
            return dot(color, vec3(0.299,0.587,0.114));
          }

          vec3 getToonColor(vec3 incomingLight) {
            float brightness = luma(incomingLight);
            brightness = clamp(brightness, 0.0, 0.99);
            return texture2D(uRamp, vec2(brightness, 0.5)).rgb;
          }
        `,
      patchMap: {
        "*": {
          "#include <output_fragment>": /* glsl */ `
              #include <output_fragment>

              vec3 rampColor = getToonColor(outgoingLight);
              vec3 finalColor = rampColor * diffuseColor.rgb;

              gl_FragColor = vec4(finalColor, diffuseColor.a);          
            `,
        },
      },
    })
  }, [])

  useEffect(() => {
    const newTexture = generateRampTexture(rampStops)
    material.uniforms.uRamp.value = newTexture

    return () => {
      newTexture?.dispose()
    }
  }, [material, rampStops])

  return material
}
