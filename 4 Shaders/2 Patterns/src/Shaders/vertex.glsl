// Passing the uv attribute of the plane geometry to the fragment shader
varying vec2 vUv;

uniform float uTime;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float dist = length(position.xy);
    float angle = atan(position.y, position.x);
    
    float wave1 = sin(dist * 15.0 - uTime * 2.0) * 0.15;
    float wave2 = cos(angle * 8.0 + uTime) * 0.1;
    
    modelPosition.z += wave1;
    modelPosition.z += wave2;
    modelPosition.z += sin(position.x * 10.0 + uTime) * 0.1;
    
    float swirl = sin(uTime * 0.5) * 0.2;
    modelPosition.x += cos(angle) * swirl * dist;
    modelPosition.y += sin(angle) * swirl * dist;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    
    // Assigning the uv attribute to the varying variable
    vUv = uv;
}