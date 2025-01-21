import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as lil from "lil-gui";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {Timer} from 'three/addons/misc/Timer.js';
import "./style.css";

import vertexShader from './Shaders/vertex.glsl'
import fragmentShader from './Shaders/fragment.glsl';

const scene = new THREE.Scene();

// const gui = new lil.GUI();
const gltfLoader = new GLTFLoader();

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5, 256, 256),
  new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: { value: 0 }
  }
  })
);
scene.add(plane);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.set(0, 0, 7);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

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
};
tick();

