import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as lil from "lil-gui";
import { Timer } from "three/addons/misc/Timer.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import "./style.css";
import Stats from "stats.js";
import { rendererReference } from "three/src/nodes/TSL.js";

const scene = new THREE.Scene();
const rgbeLoader = new RGBELoader();
const gltfLoader = new GLTFLoader();

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const gui = new lil.GUI();

/* Theory */
/* 

* Tone Mapping: It is a technique used to map the wide range of intensities in an image to a smaller range of intensities that can be displayed on a screen. It basically intends to convert the HDR (High Dynamic Range) image to LDR (Low Dynamic Range) image.

We need to update the tone mapping in the renderer.

There are many types of tone mapping algorithms -
- NoToneMapping: It is the default tone mapping algorithm. It does not perform any tone mapping.
- LinearToneMapping: It maps the HDR image to a linear range of intensities.
- ReinhardToneMapping: It is a tone mapping algorithm that is based on the Reinhard's paper.
- CineonToneMapping: It is a tone mapping algorithm that is based on the Cineon's paper.
- ACESFilmicToneMapping: It is a tone mapping algorithm that is based on the ACES's paper.

* Anti Aliasing: It is a technique used to reduce the aliasing effect in the image. It is used to reduce the jagged edges in the image. Just set the antialias property to true in the renderer.




*/

/* Environment Tweaking */

scene.environmentIntensity = 1;
gui
  .add(scene, "environmentIntensity")
  .min(0)
  .max(2)
  .step(0.01)
  .name("Environment Intensity");
scene.backgroundBlurriness = 0;
gui
  .add(scene, "backgroundBlurriness", 0, 1)
  .min(0)
  .max(1)
  .step(0.01)
  .name("Background Blurriness");

/* HDR Environment Maps */

const hdriOptions = {
  "Beach Balcony": "illovo_beach_balcony_2k.hdr",
  "Meadow": "meadow_2k.hdr",
  "Warehouse": "hangar_interior_2k.hdr",
  "House Interior": "kiara_interior_2k.hdr",
  "Glass Passage": "glass_passage_2k.hdr",
  "Paul Lobe Haus": "paul_lobe_haus_2k.hdr",
  "Pine Attic": "pine_attic_1k.hdr",
  "Restaurant": "warm_restaurant_night_2k.hdr",
};

const environmentSettings = {
  currentHDRI: "Beach Balcony",
};

const loadHDRI = (value) => {
  rgbeLoader.load(hdriOptions[value], (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });
};

gui
  .add(environmentSettings, "currentHDRI", Object.keys(hdriOptions))
  .name("HDRI Environment")
  .onChange(loadHDRI);

loadHDRI(environmentSettings.currentHDRI);

const modelSettings = {
  currentModel: "Camera",
};

const models = {
  Camera: null,
  Car: null,
  Apple_Vision_Pro: null,
};

const hideAllModels = () => {
  Object.values(models).forEach((model) => {
    if (model) model.visible = false;
  });
};

const switchModel = (modelName) => {
  hideAllModels();
  if (models[modelName]) {
    models[modelName].visible = true;
  }
};

gui
  .add(modelSettings, "currentModel", [
    "Camera",
    "Car",
    "Apple_Vision_Pro"
  ])
  .name("Select Model")
  .onChange(switchModel);

// Camera Model
gltfLoader.load("camera/Camera_01_1k.gltf", (gltf) => {
  models.Camera = gltf.scene;
  const cameraStrap = models.Camera.children.find(
    (child) => child.name === "Camera_01_strap"
  );
  if (cameraStrap) {
    cameraStrap.visible = false;
  }
  models.Camera.scale.set(13, 13, 13);
  models.Camera.position.set(0, -0.5, 0);
  scene.add(models.Camera);
});

// Car Model
gltfLoader.load("mercedes_benz/scene.gltf", (gltf) => {
  models.Car = gltf.scene;
  models.Car.scale.set(0.5, 0.5, 0.5);
  models.Car.position.set(-0.2, -0.5, 0);
  models.Car.visible = false;
  scene.add(models.Car);
});

// Apple Vision Pro Model
gltfLoader.load('apple-vision-pro/scene.gltf', (gltf) => {
  models.Apple_Vision_Pro = gltf.scene;
  console.log(models.Apple_Vision_Pro);
  models.Apple_Vision_Pro.scale.set(2.5, 2.5, 2.5);
  models.Apple_Vision_Pro.position.set(0, 0, 0);
  models.Apple_Vision_Pro.visible = false;
  scene.add(models.Apple_Vision_Pro);
});

const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0.3, 3);
camera.position.z = window.innerWidth < 768 ? 5 : 3;
scene.add(camera);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Tone Mapping
renderer.toneMapping = THREE.NoToneMapping;
// Adding tone mapping to the gui with all the tone mappings -
gui
  .add(renderer, "toneMapping", {
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .name("Tone Mapping");
// Tone Mapping Exposures
renderer.toneMappingExposure = 1.5;
gui
  .add(renderer, "toneMappingExposure")
  .min(1)
  .max(10)
  .step(0.01)
  .name("Tone Mapping Exposure");

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 10;

const timer = new Timer();

const tick = () => {
  stats.begin();
  controls.update();
  const elapsedTime = timer.getElapsed();
  timer.update();

  // Handle Camera rotation
  if (models.Camera && models.Camera.visible) {
    models.Camera.rotation.y = elapsedTime * 0.5;
    models.Camera.rotation.x = Math.sin(elapsedTime * 2.0) * 0.1;
  }

  // Handle Car rotation
  if (models.Car && models.Car.visible) {
    models.Car.rotation.y = elapsedTime * 0.5;
  }

  // Handle Apple Vision Pro rotation
  if (models.Apple_Vision_Pro && models.Apple_Vision_Pro.visible) {
    models.Apple_Vision_Pro.rotation.y = elapsedTime * 0.5;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
  stats.end();
};
tick();
