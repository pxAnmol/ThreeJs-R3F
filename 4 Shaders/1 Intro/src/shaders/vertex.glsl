// void main() {
// gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
// }

/* Let's separate each part of the matrix multiplication */

// Receiving the uniforms that are passed from the ShaderMaterial code. Make sure that the name of the property matches in both the code.
uniform vec2 uFrequency;
uniform float uTime;
uniform float uWaveSpeed;

// We need to assign the UV attribute to a varying so that it can be passed to the fragment shader.
varying vec2 vUv;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - (uTime * uWaveSpeed)) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - (uTime * uWaveSpeed)) * 0.1;
    
    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}