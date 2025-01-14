import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";
import { Timer } from "three/addons/misc/Timer.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import * as lil from "lil-gui";

const scene = new THREE.Scene();

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const objLoader = new OBJLoader();

const gui = new lil.GUI();

/* Environment Maps 

* CubeTextureLoader: It is a loader for cube texture format. In this format, we can store 6 images in a single texture as px, py, pz, nx, ny, nz.
* RBGELoader: It is a loader for HDR image format.
* OBJLoader: It is a loader for obj format.
* GLTFLoader: It is a loader for gltf format.

** Loading LDR image: The LDR map is a low dynamic range image. It is a image that has a low range of brightness and is imported as a texture using the TextureLoader.

*/

scene.environmentIntensity = 1;
gui.add(scene, 'environmentIntensity').min(1).max(2).step(0.1).name('Environment Intensity');
scene.backgroundIntensity = 1;
gui.add(scene, 'backgroundIntensity').min(1).max(2).step(0.1).name('Background Intensity');
scene.backgroundBlurriness = 0;
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.1).name('Background Blurriness');
scene.backgroundRotation.x = 0;
gui.add(scene.backgroundRotation, 'x').min(0).max(Math.PI * 2).step(0.01).name('Background Rotation X');
scene.backgroundRotation.y = 0;
gui.add(scene.backgroundRotation, 'y').min(0).max(Math.PI * 2).step(0.01).name('Background Rotation Y');
scene.backgroundRotation.z = 0;
gui.add(scene.backgroundRotation, 'z').min(0).max(Math.PI * 2).step(0.01).name('Background Rotation Z');


rgbeLoader.load('play-room.hdr', (envMap) => {
  envMap.mapping = THREE. EquirectangularReflectionMapping;
  envMap.colorSpace = THREE.SRGBColorSpace;

  // Set the environment map on the scene as the background and environment map.
  scene.background = envMap;
  scene.environment = envMap;


});

// const torusKnot = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16),
//   new THREE.MeshStandardMaterial()
// )
// torusKnot.material.roughness = 0.15;
// torusKnot.material.metalness = 0.8;
// torusKnot.position.set(-3, 0, 0);
// scene.add(torusKnot);

let visionModel = null;

gltfLoader.load('/apple-vision-pro/scene.gltf', (gltf) => {
  visionModel = gltf.scene;
  console.log(visionModel)
  visionModel.rotation.set(0, -Math.PI/4, 0);
  visionModel.scale.set(4, 4, 4);
  visionModel.position.set(-2, 0, 0);
  scene.add(visionModel);
});

let gModel = null;

gltfLoader.load('letter-g-balloon/source/Picture12.glb', (gltf) => {
  gModel = gltf.scene;
  console.log(gModel)
  gModel.scale.set(15, 15, 15);
  gModel.position.set(2, -0.5, 0);
  scene.add(gModel);
});

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 2, 5);
scene.add(camera);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const timer = new Timer();

const tick = () => {
  controls.update();
  timer.update();
  const elapsedTime = timer.getElapsed();

  // torusKnot.rotation.y = elapsedTime * 0.2;
  // torusKnot.rotation.x = elapsedTime * 0.2;

  if(visionModel){
    visionModel.rotation.y = elapsedTime * 0.5;
  }

  if(gModel){
    gModel.rotation.y = elapsedTime * 0.2;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
