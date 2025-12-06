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
    shader.uniforms.uTexture = { value: textureMap }
    shader.uniforms.uSkinLow = { value: new THREE.Color(0x161616) }
    shader.uniforms.uSkinMidLow = { value: new THREE.Color(0xd4d5ff) }
    shader.uniforms.uSkinMidHigh = { value: new THREE.Color(0xf0f1ff) }
    shader.uniforms.uSkinHigh = { value: new THREE.Color(0xfc9e8b) }

    shader.uniforms.uEyesLow = { value: new THREE.Color(0x000000) }
    shader.uniforms.uEyesMidLow = { value: new THREE.Color(0x564b89) }
    shader.uniforms.uEyesMidHigh = { value: new THREE.Color(0xa82e2e) }
    shader.uniforms.uEyesHigh = { value: new THREE.Color(0xff514f) }
    shader.uniforms.uIsSkin = { value: skin ? 1.0 : 0.0 }

    shader.fragmentShader =
      "uniform sampler2D uTexture;\nuniform vec3 uSkinLow;\nuniform vec3 uSkinMidLow;\nuniform vec3 uSkinMidHigh;\nuniform vec3 uSkinHigh;\nuniform vec3 uEyesLow;\nuniform vec3 uEyesMidLow;\nuniform vec3 uEyesMidHigh;\nuniform vec3 uEyesHigh;\nuniform float uIsSkin;\n" +
      shader.fragmentShader

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `
      #include <opaque_fragment>

      vec3 litColor = gl_FragColor.rgb;

      float brightness = dot(litColor, vec3(0.2126, 0.7152, 0.0722));
      brightness = clamp(brightness, 0.0, 5.0);

      vec3 finalColor;

      if (uIsSkin > 0.5) {
        // Skin color ramp
        if (brightness < 0.3) {
          finalColor = uSkinLow; // black
        } else if (brightness < 0.5) {
          finalColor = mix(uSkinLow, uSkinMidLow, smoothstep(0.0, 0.187, brightness)); // purple
        } else if (brightness < 1.45) {
          finalColor = mix(uSkinMidLow, uSkinMidHigh, smoothstep(0.3, 0.75, brightness)); // white
        } else {
          finalColor = uSkinHigh; // red
        }
      } else {
        // Eyes color ramp
        if (brightness < 0.24) {
          finalColor = uEyesLow; // black
        } else if (brightness < 0.276) {
          finalColor = uEyesMidLow; // purple
        } else if (brightness < 0.343) {
          finalColor = uEyesMidHigh; // dark red
        } else {
          finalColor = uEyesHigh; // light red
        }
      }

      gl_FragColor = vec4(finalColor, gl_FragColor.a);
      `
    )
  }

  return material
}
