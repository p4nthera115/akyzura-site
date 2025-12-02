// import * as THREE from "three"

// const vertexShader = `
//   #include <skinning_pars_vertex>

//   varying vec2 vUv;
//   varying vec4 vClipPos;
//   varying vec3 vNormal;

//   void main() {
//     #include <skinbase_vertex>
//     #include <begin_vertex>
//     #include <beginnormal_vertex>
//     #include <defaultnormal_vertex>
//     #include <skinning_vertex>
//     #include <project_vertex>

//     gl_Position = projectionMatrix * mvPosition;

//     vUv = uv;
//     vNormal = normalize(normalMatrix * normal);
//   }
// `

// const skinFragmentShader = `
//   #include <common>
//   #include <lights_pars_begin>

//   varying vec2 vUv;
//   varying vec4 vClipPos;
//   varying vec3 vNormal;
//   uniform sampler2D uTexture;
//   uniform vec3 uSkinLow;
//   uniform vec3 uSkinMidLow;
//   uniform vec3 uSkinMidHigh;
//   uniform vec3 uSkinHigh;

//   void main() {
//     #include <dithering_fragment>

//     vec4 texColor = texture2D(uTexture, vUv);
//     float brightness = dot(texColor.rgb, vec3(0.2126, 0.7152, 0.0722)); // grayscale conversion

//     vec3 finalColor;

//     if (brightness < 0.2) {
//       finalColor = uSkinLow;
//     } else if (brightness < 0.367) {
//       finalColor = uSkinMidLow;
//     } else if (brightness < 0.897) {
//       finalColor = uSkinMidHigh;
//     } else {
//       finalColor = uSkinHigh;
//     }

//     float NdotL = dot(vNormal, directionalLights[0].direction);
//     float lightIntensity = smoothstep(0.0, 0.01, NdotL);
//     vec3 directionalLight = directionalLights[0].color * lightIntensity * finalColor;

//     gl_FragColor = vec4(finalColor * directionalLight, texColor.a);
//   }
// `

// const eyesFragmentShader = `
//   #include <common>
//   #include <lights_pars_begin>

//   varying vec2 vUv;
//   varying vec4 vClipPos;
//   uniform sampler2D uTexture;
//   uniform vec3 uEyesLow;
//   uniform vec3 uEyesMidLow;
//   uniform vec3 uEyesMidHigh;
//   uniform vec3 uEyesHigh;
//   varying vec3 vNormal;

//   void main() {
//     vec4 texColor = texture2D(uTexture, vUv);
//     float brightness = dot(texColor.rgb, vec3(0.2126, 0.7152, 0.0722)); // grayscale conversion

//     vec3 finalColor;

//     if (brightness < 0.177) {
//       finalColor = uEyesLow;
//     } else if (brightness < 0.367) {
//       finalColor = uEyesMidLow;
//     } else if (brightness < 0.897) {
//       finalColor = uEyesMidHigh;
//     } else {
//       finalColor = uEyesHigh;
//     }

//     float NdotL = dot(vNormal, directionalLights[0].direction);
//     float lightIntensity = smoothstep(0.0, 0.01, NdotL);

//     vec3 lightContribution = directionalLights[0].color * lightIntensity;

//     vec3 outgoingLight = finalColor * lightContribution;

//     gl_FragColor = vec4(outgoingLight, texColor.a);
//   }
// `

// export default function ToonMaterial(skin: boolean, texture: THREE.Texture) {
//   return new THREE.ShaderMaterial({
//     uniforms: THREE.UniformsUtils.merge([
//       THREE.UniformsLib.lights,
//       {
//         uTexture: {
//           value: texture,
//         },
//         uSkinLow: { value: new THREE.Color(0xff5b48) },
//         uSkinMidLow: { value: new THREE.Color(0x161616) },
//         uSkinMidHigh: { value: new THREE.Color(0xa490ff) },
//         uSkinHigh: { value: new THREE.Color(0xffffff) },
//         uEyesLow: { value: new THREE.Color(0x161616) },
//         uEyesMidLow: { value: new THREE.Color(0x564b89) },
//         uEyesMidHigh: { value: new THREE.Color(0xa82e2e) },
//         uEyesHigh: { value: new THREE.Color(0xff514f) },
//       },
//     ]),
//     vertexShader,
//     fragmentShader: skin ? skinFragmentShader : eyesFragmentShader,
//     lights: true,
//   })
// }

import * as THREE from "three"

export default function ToonMaterial(skin: boolean, textureMap: THREE.Texture) {
  const material = new THREE.MeshStandardMaterial({
    map: textureMap,
    metalness: 0.0,
    roughness: 0.7,
    transparent: true,
    opacity: 1.0,
    toneMapped: false,
  })

  material.onBeforeCompile = (shader) => {
    // Add custom uniforms
    shader.uniforms.uTexture = { value: textureMap }
    shader.uniforms.uSkinLow = { value: new THREE.Color(0x161616) }
    shader.uniforms.uSkinMidLow = { value: new THREE.Color(0xdcd4ff) }
    shader.uniforms.uSkinMidHigh = { value: new THREE.Color(0xffffff) }
    shader.uniforms.uSkinHigh = { value: new THREE.Color(0xff5b48) }

    shader.uniforms.uEyesLow = { value: new THREE.Color(0x000000) }
    shader.uniforms.uEyesMidLow = { value: new THREE.Color(0x564b89) }
    shader.uniforms.uEyesMidHigh = { value: new THREE.Color(0xa82e2e) }
    shader.uniforms.uEyesHigh = { value: new THREE.Color(0xff514f) }
    shader.uniforms.uIsSkin = { value: skin ? 1.0 : 0.0 }

    // Inject color ramp logic after all lighting calculations
    shader.fragmentShader =
      "uniform sampler2D uTexture;\nuniform vec3 uSkinLow;\nuniform vec3 uSkinMidLow;\nuniform vec3 uSkinMidHigh;\nuniform vec3 uSkinHigh;\nuniform vec3 uEyesLow;\nuniform vec3 uEyesMidLow;\nuniform vec3 uEyesMidHigh;\nuniform vec3 uEyesHigh;\nuniform float uIsSkin;\n" +
      shader.fragmentShader

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `
      #include <opaque_fragment>

      vec3 litColor = gl_FragColor.rgb;

      float brightness = dot(litColor, vec3(0.2126, 0.7152, 0.0722));
      brightness = clamp(brightness, 0.0, 1.0);
      float normalizedBrightness = normalize(brightness);

      vec3 finalColor;

      if (uIsSkin > 0.5) {
        // Skin color ramp
        if (brightness < 0.3) {
          finalColor = uSkinLow; // black
        } else if (brightness < 0.5) {
          finalColor = mix(uSkinLow, uSkinMidLow, smoothstep(0.0, 0.187, brightness)); // purple
        } else if (brightness <= 1.0) {
          finalColor = mix(uSkinMidLow, uSkinMidHigh, smoothstep(0.18, 0.2, brightness)); // white
        } else {
          finalColor = uSkinHigh; // red
        }
      // if (uIsSkin > 0.5) {
      //   // Skin color ramp
      //   if (brightness < 0.1) {
      //     finalColor = uSkinLow; // black
      //   } else if (brightness < 0.187) {
      //     finalColor = mix(uSkinLow, uSkinMidLow, smoothstep(0.0, 0.187, brightness)); // purple
      //   } else if (brightness < 0.32) {
      //     finalColor = mix(uSkinMidLow, uSkinMidHigh, smoothstep(0.18, 0.2, brightness)); // white
      //   } else {
      //     finalColor = uSkinHigh; // red
      //   }
      } else {
        // Eyes color ramp
        if (brightness < 0.125) {
          finalColor = uEyesLow;
        } else if (brightness < 0.206) {
          finalColor = uEyesMidLow;
        } else if (brightness < 0.503) {
          finalColor = uEyesMidHigh;
        } else {
          finalColor = uEyesHigh;
        }
      }

      gl_FragColor = vec4(finalColor, gl_FragColor.a);
      `
    )
  }

  return material
}
