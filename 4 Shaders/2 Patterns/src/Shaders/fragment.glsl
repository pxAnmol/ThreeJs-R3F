// Receiving the uv attribute from the vertex shader
varying vec2 vUv;
uniform float uTime;

// "define" is a keyword in GLSL that allows us to define a function or variable at the top level of a shader, outside of any function or block.
#define PI 3.14159265359

// There is no Math.random() function in GLSL, so we need to create our own random function. It is a standard random function used that just creates a random number between 0 and 1 for each invocation.
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 coord = vUv * 2.0 - 1.0;
    float time = uTime * 0.5;
    
    // Getting the distance from the center of the screen
    float dist = length(coord);
    float angle = atan(coord.y, coord.x);
    
    float grid = abs(fract(coord.x * 10.0) - 0.5) + abs(fract(coord.y * 10.0) - 0.5);
    grid = step(0.1 + 0.1 * sin(time + dist * 5.0), grid);
    
    // Energy pulses
    float energy = abs(sin(angle * 10.0 + dist * 20.0 - time * 3.0));
    energy *= abs(sin(dist * 10.0 - time));
    
    // Vortex rings
    float rings = abs(sin(dist * 20.0 - time * 2.0)) * abs(sin(angle * 8.0 + time));
    
    // Dynamic color palette
    vec3 color1 = vec3(sin(time) * 0.5 + 0.5, cos(time * 0.7) * 0.5 + 0.5, sin(time * 1.3) * 0.5 + 0.5);
    vec3 color2 = vec3(cos(time * 0.8) * 0.5 + 0.5, sin(time * 1.1) * 0.5 + 0.5, cos(time * 0.9) * 0.5 + 0.5);
    
    vec3 color = vec3(0.0);
    color += color1 * energy;
    color += color2 * rings;
    color *= 1.0 - grid * 0.5;
    color *= 1.0 + sin(time + dist * 5.0) * 0.2;
    
    // Add subtle color variations based on position
    color += vec3(random(coord + time)) * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
}

