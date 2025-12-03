import * as THREE from "three"

const vertexShader = `
  #include <skinning_pars_vertex>
  
  varying vec4 vScreenPos;

	void main() {
    #include <skinbase_vertex>
    #include <begin_vertex>
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <skinning_vertex>
    #include <project_vertex>

    gl_Position = projectionMatrix * mvPosition;
    vScreenPos = gl_Position;
	}
`

const fragmentShader = `
  #define PI 3.1415926535897932384626433832795
  varying vec4 vScreenPos;

  uniform float uTime;

  // 2D Random
  float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

  // 2D Noise based on Morgan McGuire @morgan3d
  // https://www.shadertoy.com/view/4dS3Wd
  float noise (in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      // Four corners in 2D of a tile
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      // Smooth Interpolation

      // Cubic Hermine Curve.  Same as SmoothStep()
      vec2 u = f*f*(3.0-2.0*f);
      // u = smoothstep(0.,1.,f);

      // Mix 4 coorners percentages
      return mix(a, b, u.x) +
              (c - a)* u.y * (1.0 - u.x) +
              (d - b) * u.x * u.y;
  }

  mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
  }
                  #define NUM_OCTAVES 5

  float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}


  float fbm1(in vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 0.0;

      for (int i = 0; i < 10; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }

  float lines(in vec2 pos){
      float scale = 8.0; // line frequency
      float lineThickness = 0.01;
      
      pos *= scale;
      
      float smoothLine = smoothstep(0., .5 + lineThickness * 0.5, (sin(pos.x * PI) + lineThickness * 2.0) * .5);
      float line = smoothstep(0.9, 1.0, smoothLine);
      // float line = step(0.9, smoothLine);
      
      // line += fbm1(pos);

      return line;
  }


  void main() {
    // Get screen position
	  vec2 vCoords = vScreenPos.xy;
		vCoords /= vScreenPos.w;
		// vCoords = vCoords * 0.5 + 0.5; // normalize

    vec2 pos = vCoords.yx*vec2(5.,5.);

    float pattern = pos.x / 2.0;
    float frequency = 0.07;
    float amplitude = 1.;
    float t = uTime * frequency;
    t = abs(cos(t));

    pos = rotate2d(noise(pos)) * pos * cos(t) * amplitude;

    pattern = lines(pos);

    vec3 backgroundColor = vec3(0.);
    vec3 lineColor = vec3(0.439, 0.392, 0.561);
    gl_FragColor = vec4(mix(backgroundColor, lineColor, pattern), 1.0);
  }
`

const ProjectionMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
})

export default ProjectionMaterial
