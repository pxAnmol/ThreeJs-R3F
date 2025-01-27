varying vec2 vUv;
varying float vElevation;

uniform float uTime;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

void main() {
    float t = uTime * 0.5;
    
    // Dynamic color mixing with edge detection
    float edge = length(vUv - 0.5) * 2.0;
    vec3 color = mix(uDepthColor, uSurfaceColor, 
                    (vElevation + uColorOffset + edge * sin(t)) * uColorMultiplier);
    
    // Color intensity modulation
    color *= 1.0 + vElevation * 0.5;
    
    gl_FragColor = vec4(color, 1.0);
}
