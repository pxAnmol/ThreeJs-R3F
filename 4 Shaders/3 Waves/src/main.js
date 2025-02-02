import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {Pane} from 'tweakpane';
import { Timer } from "three/addons/misc/Timer.js";
import Stats from 'stats.js';
import { RGBELoader} from "three/addons";
import "./style.css";

import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";

const scene = new THREE.Scene();

const rgbeLoader = new RGBELoader();

const stats = Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );

const gui = new Pane();

const colorObject = {
  depthColor: '#186691',
  surfaceColor: '#9bd8c0',
  peakColor: '#bbd8e0'
}
const planeSettings = {
  size: 10
}
const LODSettings = {
  level: 3
}

// Map LOD levels to segment counts
const LODLevels = {
  1: 32,
  2: 64,
  3: 128,
  4: 256,
  5: 512,
  6: 1024
}

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(planeSettings.size, planeSettings.size, 512, 512),
  new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },

      uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor) },
      uDepthColor: { value: new THREE.Color(colorObject.depthColor) },
      uPeakColor: { value: new THREE.Color(colorObject.peakColor)},
      uOpacity: { value: 1.0 },

      uTurbulence: { value: 0.3 },
      uNoiseScale: { value: 2.0 },
      uTimeScale: { value: 0.5 },

      uAmplitude: { value: 0.15},
      uFrequency: { value: 1.0},
      uPersistence: { value: 0.3 },
      uLacunarity: { value: 2.0 },
      uIterations: { value: 4 },
      uSpeed: { value: 0.5 },

      uTroughThreshold: { value: -0.05 },
      uPeakThreshold: { value: 0.05 },
      uTroughTransition: { value: 0.1 },
      uPeakTransition: { value: 0.1 },

      uFresnelPower: { value: 1.0 },
      uFresnelScale: { value: 0.5 },

      uEnvironmentMap: { value: null },
    }
  })
);
plane.rotation.x = -Math.PI * 0.5;
scene.add(plane);

// Load and configure HDRI
rgbeLoader.load('/kloofendal_48d_partly_cloudy_puresky_2k.hdr', (texture) => {
  const envMap = texture.clone();

  texture.mapping = THREE.EquirectangularReflectionMapping;
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = texture;
  scene.environment = envMap;
  plane.material.uniforms.uEnvironmentMap.value = envMap;
});

// GUI folders
const water = gui.addFolder({title: 'Water'})
const floor = water.addFolder({title: 'General'})
const waves = water.addFolder({ title: 'Waves'})
const color = water.addFolder({title: 'Color'})
const reflection = water.addFolder({title: 'Reflection'})

// GUI tweaking
floor.addBinding(planeSettings, 'size', {min: 2.0, max: 20, step: 1.0, label: "Plane Size"}).on('change', (ev) => {plane.geometry = new THREE.PlaneGeometry(ev.value, planeSettings.size, 512, 512);});
floor.addBinding(LODSettings, 'level', {options: {
    'Level 1 (32x32)': 1,
    'Level 2 (64x64)': 2,
    'Level 3 (128x128)': 3,
    'Level 4 (256x256)': 4,
    'Level 5 (512x512)': 5,
    'Level 6 (1024x1024)': 6
  },
  label: "Detail Level"
}).on('change', (ev) => {const segments = LODLevels[ev.value];plane.geometry = new THREE.PlaneGeometry(planeSettings.size, planeSettings.size, segments, segments);});

waves.addBinding(plane.material.uniforms.uAmplitude, 'value', {min: 0.05, max: 0.5, label: 'Amplitude'})
waves.addBinding(plane.material.uniforms.uFrequency, 'value', { min: 0.5, max: 5.0, step: 0.01, label: 'Frequency'});
waves.addBinding(plane.material.uniforms.uPersistence, 'value', { min: 0.0, max: 0.5, step: 0.01, label: 'Persistence'});
waves.addBinding(plane.material.uniforms.uLacunarity, 'value', { min: 0.0, max: 5.0, label: 'Lacunarity' });
waves.addBinding(plane.material.uniforms.uIterations, 'value', { min: 1, max: 10, step: 1.0, label: 'Iterations'});
waves.addBinding(plane.material.uniforms.uSpeed, 'value', { min: 0.0, max: 2.0, step: 0.01, label: 'Speed'});

color.addBinding(colorObject, 'depthColor', {label: 'Depth Color'}).on('change', (ev) => {plane.material.uniforms.uDepthColor.value = new THREE.Color(ev.value);});
color.addBinding(colorObject, 'surfaceColor', {label: 'Surface Color'}).on('change', (ev) => {plane.material.uniforms.uSurfaceColor.value = new THREE.Color(ev.value);});
color.addBinding(colorObject, 'peakColor', {label: 'Peak Color'}).on('change', (ev) => {plane.material.uniforms.uPeakColor.value = new THREE.Color(ev.value);});
color.addBinding(plane.material.uniforms.uTroughThreshold, 'value', { min: -0.05, max: 0.5, step: 0.01, label: 'Trough Threshold'});
color.addBinding(plane.material.uniforms.uTroughTransition, 'value', { min: 0.0, max: 1.0, step: 0.01, label: 'Trough Transition'});
color.addBinding(plane.material.uniforms.uPeakThreshold, 'value', { min: 0.0, max: 1.0, step: 0.01, label: 'Peak Threshold'});
color.addBinding(plane.material.uniforms.uPeakTransition, 'value', { min: 0.0, max: 1.0, step: 0.01, label: 'Peak Transition'});

reflection.addBinding(plane.material.uniforms.uFresnelScale, 'value', {min: 0.0, max: 1.0, step: 0.01, label: 'Strength'});
reflection.addBinding(plane.material.uniforms.uFresnelPower, 'value', {min: 0.0, max: 2.0, step: 0.01, label: 'Power'});

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(3.5, 1, -4);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.maxPolarAngle = Math.PI * 0.45;
controls.maxDistance = 25;
controls.minDistance = 2

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const timer = new Timer();

const tick = () => {
  controls.update();
  const elapsedTime = timer.getElapsed();
  timer.update();

  plane.material.uniforms.uTime.value = elapsedTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);

  stats.update();
};

tick();
