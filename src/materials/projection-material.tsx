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
  varying vec4 vScreenPos;

  void main() {
	  vec2 vCoords = vScreenPos.xy;
		vCoords /= vScreenPos.w;
		vCoords = vCoords * 0.5 + 0.5;

  	vec2 uv = fract( vCoords * 20.0 );
    gl_FragColor = vec4( uv, 1.0, 1.0 );
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
