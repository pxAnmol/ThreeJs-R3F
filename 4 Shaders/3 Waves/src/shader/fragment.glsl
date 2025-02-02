precision highp float;


uniform float uTime;
uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform vec3 uPeakColor;
uniform float uOpacity;

uniform float uTroughThreshold;
uniform float uPeakThreshold;
uniform float uTroughTransition;
uniform float uPeakTransition;

uniform float uFresnelScale;
uniform float uFresnelPower;

uniform samplerCube uEnvironmentMap;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    float trough2surface = smoothstep(uTroughThreshold - uTroughTransition, uTroughThreshold + uTroughTransition, vElevation);

    float surface2peak = smoothstep(uPeakThreshold - uPeakTransition, uPeakThreshold + uPeakTransition,vElevation);

//    Fresnel effect (reflects the angle of the surface)
    vec3 viewDirection = normalize(vViewPosition - cameraPosition);
    vec3 reflectedVector = reflect(viewDirection, vNormal);
    reflectedVector.x *= -1.0;

    vec4 refletionColor = textureCube(uEnvironmentMap, reflectedVector);

    float fresnel = uFresnelScale * pow(1.0 - clamp(dot(viewDirection, vNormal), 0.0, 1.0), uFresnelPower);

    vec3 mix1 = mix(uDepthColor, uSurfaceColor, trough2surface);
    vec3 mix2 = mix(mix1, uPeakColor, surface2peak);
    vec3 mix3 = mix(mix2, refletionColor.rgb, fresnel);

    // Adding color shift
    mix3 += vec3(
    sin(vUv.x * 15.0 + uTime) * 0.15,
    cos(vUv.y * 12.0 + uTime * 0.7) * 0.15,
    sin((vUv.x + vUv.y) * 10.0 + uTime * 0.5) * 0.15
    ) * (1.0 - fresnel);

    gl_FragColor = vec4(mix3, uOpacity);
}
