import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {Pane} from 'tweakpane';
import { Timer } from "three/addons/misc/Timer.js";
import Stats from 'stats.js';
import "./style.css";

import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";

const scene = new THREE.Scene();

const stats = Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );

const gui = new Pane();

const colorObject = {
  depthColor: '#65b4df',
  surfaceColor: '#9bd8ff',
}

const planeSettings = {
  size: 10
}

const LODSettings = {
  level: 3 // default to level 3 (256*256)
}

// Map LOD levels to segment counts
const LODLevels = {
  1: 64,
  2: 128,
  3: 256,
  4: 512,
  5: 1024
}

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(planeSettings.size, planeSettings.size, 512, 512),
  new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uWaveElevation: { value: 0.4 },
      uWaveFrequency: { value: new THREE.Vector2(4.0, 1.5) },
      uWaveSpeed: { value: 0.5 },

      uDepthColor: { value: new THREE.Color(colorObject.depthColor) },
      uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor) },
      uColorOffset: { value: 0.01 },
      uColorMultiplier: { value: 5 },
    }
  })
);
plane.rotation.x = -Math.PI * 0.5;
scene.add(plane);

gui.addBinding(planeSettings, 'size', {
  min: 2.0,
  max: 20,
  step: 1.0,
  label: "Plane Size"
}).on('change', (ev) => {
  plane.geometry = new THREE.PlaneGeometry(ev.value, planeSettings.size, 512, 512);
});
gui.addBinding(LODSettings, 'level', {
  options: {
    'Level 1 (64x64)': 1,
    'Level 2 (128x128)': 2,
    'Level 3 (256x256)': 3, 
    'Level 4 (512x512)': 4,
    'Level 5 (1024x1024)': 5
  },
  label: "Detail Level"
}).on('change', (ev) => {
  const segments = LODLevels[ev.value];
  plane.geometry = new THREE.PlaneGeometry(
    planeSettings.size, 
    planeSettings.size, 
    segments,
    segments
  );
});
gui.addBinding(plane.material.uniforms.uWaveElevation, 'value', {
  min: 0.1,
  max: 0.5,
  step: 0.01,
  label: "Wave Elevation",
});
gui.addBinding(plane.material.uniforms.uWaveFrequency, 'value', {
  min: 0.1,
  max: 10,
  step: 0.01,
  label: "Wave Frequency",
});
gui.addBinding(plane.material.uniforms.uWaveSpeed, 'value', {
  min: 0.1,
  max: 1.5,
  step: 0.01,
  label: "Wave Speed",
});
gui.addBinding(colorObject, 'depthColor', {
  view: 'color',
  label: 'Depth Color'
}).on('change', (ev) => {
  plane.material.uniforms.uDepthColor.value.set(ev.value);
});
gui.addBinding(colorObject, 'surfaceColor', {
  view: 'color',
  label: 'Surface Color'
}).on('change', (ev) => {
  plane.material.uniforms.uSurfaceColor.value.set(ev.value);
});
gui.addBinding(plane.material.uniforms.uColorOffset, 'value', {
  min: 0.01,
  max: 0.5,
  step: 0.01,
  label: "Color Offset",
});
gui.addBinding(plane.material.uniforms.uColorMultiplier, 'value', {
  min: 1,
  max: 10,
  step: 0.01,
  label: "Color Multiplier",
});

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2,3,5);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.45;
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
