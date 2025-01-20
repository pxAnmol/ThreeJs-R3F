uniform sampler2D uTexture;
uniform sampler2D uNextTexture;
uniform float uTransition;

// Receiving the varying uv attribute of the geometry
varying vec2 vUv;

void main() {
    vec4 currentTexture = texture2D(uTexture, vUv);
    vec4 nextTexture = texture2D(uNextTexture, vUv);
    
    gl_FragColor = mix(currentTexture, nextTexture, uTransition);
}
