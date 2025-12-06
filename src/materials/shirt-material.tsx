import * as THREE from "three"

export default function ShirtMaterial() {
  const material = new THREE.MeshStandardMaterial({
    metalness: 0.0,
    roughness: 0.7,
    transparent: true,
    opacity: 1.0,
    toneMapped: false,
  })

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSkinLow = { value: new THREE.Color(0xd4d5ff) }
    shader.uniforms.uSkinHigh = { value: new THREE.Color(0xf0f1ff) }

    shader.fragmentShader =
      "uniform sampler2D uTexture;\nuniform vec3 uSkinLow;\nuniform vec3 uSkinHigh;\n" +
      shader.fragmentShader

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `
      #include <opaque_fragment>

      vec3 litColor = gl_FragColor.rgb;

      float brightness = dot(litColor, vec3(0.2126, 0.7152, 0.0722));
      brightness = clamp(brightness, 0.0, 5.0);

      vec3 finalColor;

      if (brightness < 0.2) {
        finalColor = uSkinHigh; // white
        } else if (brightness < 1.0) {
          finalColor = uSkinLow; // purple
      }

      gl_FragColor = vec4(finalColor, gl_FragColor.a);
      `
    )
  }

  return material
}
