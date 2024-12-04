import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import "./style.css";
import * as lil from "lil-gui";

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Instance to animate the textGeometry
let textMesh;

// Instance to animate the donutGeometry
let donutMesh;

// Instantiating the Debugger
const gui = new lil.GUI({ width: 200 });
gui.close();

// Loading the matcap

const textureLoader = new THREE.TextureLoader();
const matcapTexture1 = textureLoader.load("/matcaps/1.png");
const matcapTexture2 = textureLoader.load("/matcaps/2.png");
const matcapTexture3 = textureLoader.load("/matcaps/3.png");
const matcapTexture4 = textureLoader.load("/matcaps/4.png");
const matcapTexture5 = textureLoader.load("/matcaps/5.png");
const matcapTexture6 = textureLoader.load("/matcaps/6.png");
const matcapTexture7 = textureLoader.load("/matcaps/7.png");
const matcapTexture8 = textureLoader.load("/matcaps/8.png");

// Loading the font

const loader = new FontLoader();

// This loader has a load method that takes a path to a font file and a callback function that will be called when the font is loaded.
// Then we need to create a TextGeometry object that will be used to create the text mesh and add it to the scene.

loader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const minDistanceFromText = 5;

  const parameters = {
    text: "Three.js",
    size: 2,
    depth: 0.4,
    curveSegments: 10,
    bevelEnabled: false,
    wireframe: false,
    textMatcap: 1,
    donutMatcap: 1,
  };

  const matcaps = {
    1: matcapTexture1,
    2: matcapTexture2,
    3: matcapTexture3,
    4: matcapTexture4,
    5: matcapTexture5,
    6: matcapTexture6,
    7: matcapTexture7,
    8: matcapTexture8,
  };

  const updateText = () => {
    text.geometry.dispose();
    text.geometry = new TextGeometry(parameters.text, {
      font: font,
      size: parameters.size,
      depth: parameters.depth,
      curveSegments: parameters.curveSegments,
      bevelEnabled: parameters.bevelEnabled,
    });
    text.geometry.center();
  };

  const textGeometry = new TextGeometry(parameters.text, {
    font: font,
    size: parameters.size,
    depth: parameters.depth,
    curveSegments: parameters.curveSegments,
    bevelEnabled: parameters.bevelEnabled,
  });

  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial();
  textMaterial.matcap = matcapTexture8;
  textMaterial.wireframe = parameters.wireframe;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  
  // Store reference to the textMesh
  textMesh = text;

  const updateTextMatcap = () => {
    textMaterial.matcap = matcaps[parameters.textMatcap];
  };

  scene.add(text);

  gui.add(parameters, "text").onChange(updateText).name("Text");
  gui.add(parameters, "size", 1, 10, 0.1).onChange(updateText).name("Size");
  gui.add(parameters, "depth", 0.1, 3, 0.1).onChange(updateText).name("Depth");
  gui
    .add(parameters, "curveSegments", 1, 20, 1)
    .onChange(updateText)
    .name("Curve Segments");
  gui.add(textMaterial, "wireframe").onChange(updateText).name("Wireframe");

  const donutGeometry = new THREE.TorusGeometry(0.6, 0.4, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial();
  donutMaterial.matcap = matcapTexture1;

  const updateDonutMatcap = () => {
    donutMaterial.matcap = matcaps[parameters.donutMatcap];
  };

  for (let i = 0; i < 350; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);

    let validPosition = false;

    while (!validPosition) {
      const x = (Math.random() - 0.5) * 35;
      const y = (Math.random() - 0.5) * 35;
      const z = (Math.random() - 0.5) * 35;

      // Calculate distance from center (where text is)
      const distance = Math.sqrt(x * x + y * y + z * z);

      if (distance > minDistanceFromText) {
        donut.position.set(x, y, z);
        validPosition = true;
      }
    }
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    scene.add(donut);
  }

  gui
    .add(parameters, "textMatcap", {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
    })
    .onChange(updateTextMatcap)
    .name("Text Matcap");

  gui
    .add(parameters, "donutMatcap", {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
    })
    .onChange(updateDonutMatcap)
    .name("Donut Matcap");
});

// FRUSTUM CULLING

// The frustum is the area of the scene that is visible to the camera. Centering the object will help Three.js know which part of the scene is visible to the camera.

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//  3D Text

// We will use the TextBufferGeometry and a particular font format called typeface.

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

const camera = new THREE.PerspectiveCamera(
  70,
  sizes.width / sizes.height,
  0.01,
  500
);
camera.position.z = 7;

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Point light
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// Clock

const clock = new THREE.Clock();


const tick = () => {

  const elapsedTime = clock.getElapsedTime();

  // Update the text position
  if (textMesh) {
    textMesh.rotation.y = 0.1 * elapsedTime;
  }

  
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
