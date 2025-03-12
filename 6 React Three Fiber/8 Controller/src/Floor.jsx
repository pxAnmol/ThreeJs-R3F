import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";

const Floor = () => {
  return (
    <RigidBody
      type="fixed"
      position={[0, -0.1, 0]}
      restitution={0.7}
      friction={1}
    >
      <mesh receiveShadow name="floor">
        <boxGeometry args={[60, 0.1, 60]} />
        <shaderMaterial
          uniforms={{
            time: { value: 0 },
            neonColor1: { value: new THREE.Color("#ff00ff") },
            neonColor2: { value: new THREE.Color("#00ffff") },
            neonColor3: { value: new THREE.Color("#ff0088") },
            energyColor: { value: new THREE.Color("#ffffff") },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </RigidBody>
  );
};

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec3 displaced = position + normal * (sin(position.x * 5.0) * cos(position.z * 5.0)) * 0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec3 neonColor1;
  uniform vec3 neonColor2;
  uniform vec3 neonColor3;
  uniform vec3 energyColor;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  #define PI 3.14159265359

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  mat2 rotate2D(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    
    vec2 warpedUV = uv;
    warpedUV *= rotate2D(time * 0.2);
    warpedUV += sin(warpedUV.yx * 10.0 + time) * 0.1;
    
    float rift = sin(atan(warpedUV.y, warpedUV.x) * 8.0 + time * 3.0);
    rift *= cos(length(warpedUV) * 10.0 - time * 2.0);
    
    float quantum = 0.0;
    for(float i = 1.0; i < 8.0; i++) {
      quantum += sin(warpedUV.x * 20.0 * i + time) * cos(warpedUV.y * 20.0 * i - time) / i;
      quantum += sin(warpedUV.y * 15.0 * i - time * 1.5) * cos(warpedUV.x * 15.0 * i + time * 0.5) / i;
    }
    
    vec2 grid = abs(fract(warpedUV * 20.0) - 0.5);
    float holo = 1.0 - smoothstep(0.0, 0.05, min(grid.x, grid.y));
    
    float pulse = sin(length(uv) * 20.0 - time * 3.0) * 0.5 + 0.5;
    pulse *= sin(atan(uv.y, uv.x) * 20.0 + time * 4.0) * 0.5 + 0.5;
    
    float plasma = sin(warpedUV.x * 10.0 + time) + sin(warpedUV.y * 10.0) + sin(time);
    plasma += sin(sqrt(warpedUV.x * warpedUV.x + warpedUV.y * warpedUV.y) * 10.0);
    plasma *= sin(time) * 0.5 + 0.5;
    
    float vortex = atan(warpedUV.y, warpedUV.x) / PI;
    vortex = fract(vortex * 8.0 + time);
    vortex = smoothstep(0.0, 0.5, vortex) * smoothstep(1.0, 0.5, vortex);
    
    float glitch = step(0.98, random(vec2(floor(time * 10.0), floor(warpedUV.y * 10.0))));
    
    vec3 color = neonColor1 * quantum * 2.0;
    color += neonColor2 * rift * 1.5;
    color += neonColor3 * plasma * 1.2;
    color += energyColor * (pulse + vortex + holo) * 0.8;
    color *= 1.0 + glitch * 2.0;
    color += pow(length(uv), 8.0) * neonColor1 * 2.0;
    
    color *= 1.0 + 0.5 * sin(time * 2.0);
    color += pow(1.0 - length(uv), 4.0) * energyColor;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default Floor;
