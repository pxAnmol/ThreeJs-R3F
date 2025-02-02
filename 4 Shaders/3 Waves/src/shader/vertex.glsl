precision highp float;

varying vec2 vUv;

uniform float uTime;

uniform float uAmplitude;
uniform float uFrequency;
uniform float uPersistence;
uniform float uLacunarity;
uniform float uIterations;
uniform float uSpeed;

varying float vElevation;
varying vec3 vViewPosition;
varying vec3 vNormal;

// Noises are the code that produces a smooth, continuous random pattern. It is often used in computer graphics and animation to create realistic-looking natural phenomena such as water, fire, and smoke.

// The gist for various types of noise can be found here: 

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

// Simplex 2d Noise code starts -

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float getElevation(float x, float z) {
    vec2 pos = vec2(x, z);
    float elevation = 0.0;
    float amplitude = 1.0;
    float frequency = uFrequency;

    // Spiral wave effect
    float angle = atan(z, x);
    float radius = length(pos);
    elevation += sin(radius * 3.0 - uTime * uSpeed) * 0.2;

    // Vortex effect
    elevation += sin(angle * 3.0 + radius * 2.0 - uTime * uSpeed) * 0.15;

    for(float i = 0.0; i < uIterations; i++) {
        float noiseValue = snoise(pos * frequency + uTime * uSpeed);
        float rotatedNoise = snoise(vec2(
                                    pos.x * cos(uTime * 0.1) - pos.y * sin(uTime * 0.1),
                                    pos.x * sin(uTime * 0.1) + pos.y * cos(uTime * 0.1)
                                    ) * frequency);

        elevation += amplitude * (noiseValue + rotatedNoise) * 0.5;
        amplitude *= uPersistence;
        frequency *= uLacunarity;
    }

    // Add sharp peaks
    elevation = elevation * (1.0 + pow(abs(elevation), 2.0));

    return elevation * uAmplitude;
}

// Simplex 2D noise code ends -

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.);

    // Use getElevation instead of single noise calculation
    float elevation = getElevation(modelPosition.x, modelPosition.z);
    vElevation = elevation;
    modelPosition.y += elevation;

    float delta = 0.0001;
    vec3 p = modelPosition.xyz;
    vec3 px = vec3(p.x + delta, getElevation(p.x + delta, p.z), p.z);
    vec3 pz = vec3(p.x, getElevation(p.x, p.z + delta), p.z + delta);

    vec3 tangent = normalize(px - p);
    vec3 bitangent = normalize(pz - p);
    vNormal = normalize(cross(tangent, bitangent));

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vUv = uv;
    vViewPosition = modelPosition.xyz;
}
