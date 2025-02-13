import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import Stats from "stats.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Pane} from 'tweakpane';
import './style.css'

// Importing post processing stuff
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// Importing the passes
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';


const scene = new THREE.Scene();

const gui = new Pane();

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/*
Post-processing is all about adding effects on the final image, and we usually use it for filmmaking, but we can do it in WebGL too. It can be subtle to improve the image slightly or to create huge effects like Motion Blur, Bloom, Depth of Field, etc.
Now, it's a bit complicated process, with step-wise procedure to achieve the desired result.
The process is that we render the canvas in a "render target" instead of the usual WebGL renderer. Then we apply post-processing effects which is termed as "passes", on that render target.
There can be multiple passes, and each pass has its own render target. Consider render target as a plane with a shader attached to it, in which the scene captured from the camera is rendered. Now we can tweak this shader to apply any effect we want. And finally we render the final image (canvas) in which we write(or draw) on the screen using the final render target.

For this whole process, we have a Three.Js class called "EffectComposer" which helps us to do all these things. It has a bunch of methods to create passes, and we can also create our own passes using the basic shader code.

Before going all in, remember and note that these post-processing effects are highly performance intensive. So, use it wisely as it uses separate render targets to achieve the desired result. Try to mix effects with the least amount of passes as each pass adds to the performance cost.
*/

const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMap = cubeTextureLoader.load([
  '/textures/0/px.jpg',
  '/textures/0/nx.jpg',
  '/textures/0/py.jpg',
  '/textures/0/ny.jpg',
  '/textures/0/pz.jpg',
  '/textures/0/nz.jpg',
]);
environmentMap.encoding = THREE.sRGBEncoding;

scene.background = environmentMap;
scene.environment = environmentMap;


const updateAllMaterials = () =>
{
  scene.traverse((child) =>
  {
    if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
    {
      child.material.envMapIntensity = 2.5
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

let model = null;

const adjustModelSize = () => {
  if (!model) return;
  
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    model.scale.set(0.9, 0.9, 0.9);
  } else {
    model.scale.set(2, 2, 2);
  }
}

gltfLoader.load('drakefire_pistol.glb', (gltf) => {
  model = gltf.scene
  adjustModelSize(); 
  model.rotation.y = Math.PI * 0.35;
  scene.add(model);

  updateAllMaterials();
})

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 1, - 4);
scene.add(camera);

const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, - 2.25);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('canvas.webgl'), antialias: true});
renderer.powerPreference = "high-performance";
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* Now the post processing stuff is done is at the end since we need the renderer to be created first */


/* This is a after part, now there is the issue of antialias as the effect composer doesn't natively support it. By default it is using WebGLRenderTarget which doesn't support antialias. So we need to create a custom render target and use it instead.*/
const myRenderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  {
    // Samples is the property that handles the antialias. This higher the value, the more the antialias and the more it will cost in performance. Recommended value is generally less than 5.
    samples: 3,

    // There can be much more properties to be added here, but we are not going to use them here like depth buffer, stencil buffer, min filter, mag filter, etc.
  }
);

const effectComposer = new EffectComposer(renderer, myRenderTarget);
// Defining essential properties of the composer
effectComposer.setSize(window.innerWidth, window.innerHeight);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* We need to handle the resize of the effect composer too as it's not handled by the composer itself */
window.addEventListener('resize', () => {
  effectComposer.setSize(window.innerWidth, window.innerHeight);
  adjustModelSize();
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})


// Render Pass is the basic pass which renders the scene to the render target.
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// Dot Screen Pass
const dotScreenPass = new DotScreenPass();
dotScreenPass.angle = Math.PI / 4;
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

// Glitch Pass
const glitchPass = new GlitchPass();
glitchPass.enabled = false;
glitchPass.goWild = false;
effectComposer.addPass(glitchPass);

// RGB Shift Pass
// It's a quite different from the other passes because it's a shader pass. We use a ShaderPass instead of a regular Pass.
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.002;
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass);

// Film Pass
const filmPass = new FilmPass(0.35, 0.1, 648, false);
filmPass.enabled = false;
effectComposer.addPass(filmPass);

// Half Tone Pass
const halftonePass = new HalftonePass(
  window.innerWidth,
  window.innerHeight,
  {
      radius: 1.5,
      shape: 1,
      scatter: 0,
      blending: 1
  }
);
halftonePass.enabled = false;
effectComposer.addPass(halftonePass);

// Bokeh Pass
const bokehPass = new BokehPass(scene, camera, {
  focus: 3.0,
  aperture: 0.01,
  maxblur: 0.01,
  width: window.innerWidth,
  height: window.innerHeight
});
bokehPass.enabled = false;
effectComposer.addPass(bokehPass);

// Unreal Bloom Pass
const unrealBloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
);
unrealBloomPass.threshold = 0.4;
unrealBloomPass.strength = 1.5;
unrealBloomPass.radius = 0.1;
unrealBloomPass.enabled = false;
effectComposer.addPass(unrealBloomPass);

// Creating custom passes

// Tint Pass
const TintShader = {
  uniforms: {
    // tDiffuse is the predefined uniform in THREE.js that is used to pass the texture from the last render target that is changed to the shader.
    tDiffuse: {value: null},
    uColor: {value: null},
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vUv = uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      texel.rgb = mix(texel.rgb, uColor, 0.5);
      gl_FragColor = texel;
    }
  `,
}
const tintPass = new ShaderPass(TintShader);
tintPass.uniforms['uColor'].value = new THREE.Color('#4b6674');
tintPass.enabled = false;
effectComposer.addPass(tintPass);

// Cyber Pass
const CyberShader = {
  uniforms: {
      tDiffuse: { value: null },
      uIntensity: { value: 0.5 }
  },
  vertexShader: `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
  `,
  fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float uIntensity;
      varying vec2 vUv;

      void main() {
          vec2 uv = vUv;
          
          float scanLine = sin(uv.y * 200.0) * 0.04 * uIntensity;
          
          // Adding some horizontal displacement
          float displacement = sin(uv.y * 50.0) * 0.003 * uIntensity;
          uv.x += displacement;

          vec4 color = texture2D(tDiffuse, uv);
          
          // RGB splitting based on displacement
          vec4 colorR = texture2D(tDiffuse, uv + vec2(0.01, 0.0) * uIntensity);
          vec4 colorB = texture2D(tDiffuse, uv - vec2(0.01, 0.0) * uIntensity);
          
          gl_FragColor = vec4(colorR.r, color.g, colorB.b, 1.0) + scanLine;
      }
  `
};

const cyberPass = new ShaderPass(CyberShader);
cyberPass.enabled = false;
effectComposer.addPass(cyberPass);

// Vignette Pass

const VignetteShader = {
  uniforms: {
      tDiffuse: { value: null },
      offset: { value: 0.5 },
      darkness: { value: 2.5 }
  },
  vertexShader: `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
  `,
  fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float offset;
      uniform float darkness;
      varying vec2 vUv;
      void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec2 uv = (vUv - 0.5) * 2.0;
          float vignet = 1.0 - dot(uv, uv) * offset;
          vignet = pow(vignet, darkness);
          gl_FragColor = vec4(texel.rgb * vignet, texel.a);
      }
  `
};

const vignettePass = new ShaderPass(VignetteShader);
vignettePass.enabled = false;
effectComposer.addPass(vignettePass);


/* Now there is a issue of output encoding but the EffectComposer doesn't support the sRGB encoding. So we need to change the encoding of the composer.
This can be done with the help of another pass called the GammaCorrectionPass, it will convert the linear encoding to sRGB encoding.
But we always had to attach this pass as the last pass of the composer as it will make the conversion based on the last and final render target of the composer.
*/
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);

// Toggling the passes using the GUI

const guiFolder = gui.addFolder({title: 'Post Processing'});


const glitchPassFolder = guiFolder.addFolder({title: 'Glitch', expanded: false});
glitchPassFolder.addBinding(glitchPass, 'enabled', {label: 'Activate'});
glitchPassFolder.addBinding(glitchPass, 'goWild', {label: 'Go Wild'});

const rgbShiftPassFolder = guiFolder.addFolder({title: 'RGB Shift', expanded: false});
rgbShiftPassFolder.addBinding(rgbShiftPass, 'enabled', {label: 'Activate'});
rgbShiftPassFolder.addBinding(rgbShiftPass.uniforms.amount, 'value', { label: 'Shift Amount',min: 0.001,max: 0.01,step: 0.0001});

const dotScreenFolder = guiFolder.addFolder({title: 'Dot Screen', expanded: false});
dotScreenFolder.addBinding(dotScreenPass, 'enabled', {label: 'Activate'});

const filmPassFolder = guiFolder.addFolder({title: 'Film', expanded: false});
filmPassFolder.addBinding(filmPass, 'enabled', {label: 'Activate'});
filmPassFolder.addBinding(filmPass.uniforms.intensity, 'value', { label: 'Noise',min: 0,max: 1});
filmPassFolder.addBinding(filmPass.uniforms.intensity, 'value', { label: 'Scanlines',min: 0,max: 2.5});

const bokehFolder = guiFolder.addFolder({title: 'Depth of Field', expanded: false});
bokehFolder.addBinding(bokehPass, 'enabled', {label: 'Activate'});
bokehFolder.addBinding(bokehPass.uniforms.focus, 'value', { label: 'Focus',min: 0,max: 10,step: 0.1});
bokehFolder.addBinding(bokehPass.uniforms.aperture, 'value', {label: 'Aperture',min: 0.0001,max: 0.1,step: 0.0001});
bokehFolder.addBinding(bokehPass.uniforms.maxblur, 'value', {label: 'Max Blur',min: 0.001,max: 0.02,step: 0.001});

const halftoneFolder = guiFolder.addFolder({title: 'Halftone', expanded: false});
halftoneFolder.addBinding(halftonePass, 'enabled', {label: 'Activate'});
halftoneFolder.addBinding(halftonePass.uniforms.radius, 'value', { label: 'Radius',min: 1,max: 5});

const unrealBloomPassFolder = guiFolder.addFolder({title: 'Unreal Bloom', expanded: false});
unrealBloomPassFolder.addBinding(unrealBloomPass, 'enabled', {label: 'Activate'});
unrealBloomPassFolder.addBinding(unrealBloomPass, 'strength', {label: 'Strength', min: 0, max: 2.5, step: 0.01});
unrealBloomPassFolder.addBinding(unrealBloomPass, 'radius', {label: 'Radius', min: 0.1, max: 1.5, step: 0.01});
unrealBloomPassFolder.addBinding(unrealBloomPass, 'threshold', {label: 'Threshold', min: 0, max: 1, step: 0.01});

const customPasses = guiFolder.addFolder({title: 'Custom Effects'});

const tintPassFolder = customPasses.addFolder({title: 'Tint', expanded: false});
tintPassFolder.addBinding(tintPass, 'enabled', {label: 'Activate'});
const colorParams = { tintColor: '#4b6674' };
tintPassFolder.addBinding(colorParams, 'tintColor', {label: 'Tint Color', view: 'color'}).on('change', (ev) => {
  const color = new THREE.Color(ev.value);
  tintPass.uniforms.uColor.value.copy(color);
});

const cyberPassFolder = customPasses.addFolder({title: 'Cyber', expanded: false});
cyberPassFolder.addBinding(cyberPass, 'enabled', {label: 'Activate'});
cyberPassFolder.addBinding(cyberPass.uniforms.uIntensity, 'value', {label: 'Intensity',min: 0.1,max: 1,step: 0.01});

const vignetteFolder = customPasses.addFolder({title: 'Vignette', expanded: false});
vignetteFolder.addBinding(vignettePass, 'enabled');
vignetteFolder.addBinding(vignettePass.uniforms.offset, 'value', { label: 'Offset',min: 0,max: 2});
vignetteFolder.addBinding(vignettePass.uniforms.darkness, 'value', { label: 'Darkness',min: 0,max: 5});


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 4;
controls.maxDistance = 10;

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const timer = new Timer();

const tick = () => {
  controls.update();
  const elapsedTime = timer.getElapsed();
  timer.update();

  if(model) {
    model.rotation.y += 0.01;
}

  // Now we will render the scene using the composer

  // renderer.render(scene, camera);
  effectComposer.render();

  window.requestAnimationFrame(tick);
  stats.update();
}

tick();