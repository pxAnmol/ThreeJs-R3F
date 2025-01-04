import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import "./style.css";

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const alphaTexture = textureLoader.load("/texture/circular.png");

const floorTexture = textureLoader.load("/texture/mud/brown_mud_03_diff_1k.jpg");
const normalTexture = textureLoader.load("/texture/mud/brown_mud_03_nor_gl_1k.png");
const armTexture = textureLoader.load("/texture/mud/brown_mud_03_arm_1k.jpg");
const displacementTexture = textureLoader.load("/texture/mud/brown_mud_03_disp_1k.jpg");
const bumpTexture = textureLoader.load("/texture/mud/brown_mud_03_bump_1k.jpg");

floorTexture.colorSpace = THREE.SRGBColorSpace;

floorTexture.repeat.set(3, 3);
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;

/* Theory

There are various formats to import 3D models into Three.js. This depends on various factors, such as the complexity of the model, the size of the model, and the performance requirements of the application. The most common formats are:

OBJ, FBX. STL, PLY, COLLADA, 3DS, GLTF

The most efficient way to import models is to use the GLTF format. GLTF is a format that is optimized for the web and can be loaded quickly and efficiently. It is also supported by most modern web browsers.
This is made by the Khronos Group, and is the official format for 3D models on the web.
It supports different types of data like geometry, materials, textures, animations, and more.
We don't need to use the GLTF format all the time, it depends on the need of weight of the file, and the performance of the application.

Mow, the GLTF itself has various types of files, like glTF, glTF-Binary, glTF-Draco and glTF-Embedded

* glTF => It is the default format. It is a JSON file that contains all the data needed to render the model but it has no geometries and materials. These are stored in the binary file Then we have a image file which is the texture of the model which is automatically attached to the model with proper UV Unwrapping . When we import the glTF file, then all these files are automatically loaded.
* glTF-Binary => It is a binary file that contains all the data needed to render the model. It is smaller than the glTF file and it is faster to load. It is also supported by most modern web browsers, but we are unable to edit it.
* glTF-Draco => It is similar to the default glTF format, but the buffer data is compressed using the Draco library which makes it much more lighter and faster to load. It is also supported by most modern web browsers.
* glTF-Embedded => It has a single file, which contains all the data needed to render the model. It is the most efficient way to import models, but it is much more on the heavier side.

Now to use the specific format, it depends on the need of the project. Use the binary file if you have only a few models to load, and use the default glTF format if you have many assets to load, while maintaining the performance.

The GLTF models follow the PBR principle, which means that the model is rendered using the PBR (Physically Based Rendering) technique. So, it needs lighting to render the model.

** Loading the model **

We can load the model using the GLTFLoader from the three.js library.

** Draco Compression **

Draco is a library that compresses 3D geometry data. It is used to reduce the size of the model, and it is used to reduce the loading time of the model. It is also used to reduce the bandwidth of the model.
To load the model, we need to use different loader, called the DacroLoader. And then we need to pass the DRACOLoader instance to the GLTFLoader.

** Animations **

We can load the animations from the model using the AnimationMixer from the three.js library. It is used to play the animations of the model. The parameter of the AnimationMixer is the model, and the output is the mixer.
*/


const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);


/* Loading the model */

// gltfLoader.load('/models/Duck/glTF/Duck.gltf',
//   (gltf) => {
//     // Check the console and understand the structure of the model
//     // console.log('success', gltf)

//     // Add the children of the scene of the model to our scene
//     gltf.scene.position.set(0, 0, 0); // Position for the first duck
//     scene.add(gltf.scene.children[0]);
//   },
//   (progress) => {console.log('progress', progress)},
//   (error) => {console.log('error', error)}
// )

gltfLoader.load('/models/camera/Camera_01_1k.gltf',
  (gltf) => {
    gltf.scene.scale.set(17, 17.01, 17);
    gltf.scene.castShadow = true;
    gltf.scene.receiveShadow = true;
    scene.add(gltf.scene);
  })


// gltfLoader.load('/models/CashRegister/CashRegister_01_1k.gltf',
//   (gltf) => {
//     gltf.scene.position.set(-4, 0, 0);
//     gltf.scene.scale.set(3, 3, 3);
//     scene.add(gltf.scene);
//   })

// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf',
//   (gltf) => {
//     // We need to loop to the children of the model until all the children are shifted to our scene
//     while(gltf.scene.children.length > 0) {
//       scene.add(gltf.scene.children[0]);
//     }

//     // Or we can simply add the whole scene to our scene
//     // scene.add(gltf.scene);
//   }
// )

/* Draco Compressed mode */

// gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf',
//   (gltf) => {
//     scene.add(gltf.scene)
//   }
// )


/* ANIMATED MODELS */

let wolfMixer = null;

gltfLoader.load('/models/wolf.gltf',
  (gltf) => {

    // We need to store the animations in separate actions and then play them using the mixer

    wolfMixer = new THREE.AnimationMixer(gltf.scene);
    const action0 = wolfMixer.clipAction(gltf.animations[0]);
    const action2 = wolfMixer.clipAction(gltf.animations[2]);
    
    action0.play();
    action2.play();

    gltf.scene.position.set(4, 0, 0)
    gltf.scene.scale.set(3, 3, 3)
    gltf.scene.castShadow = true;
    gltf.scene.receiveShadow = true;
    scene.add(gltf.scene);

  })


let cartMixer = null;

gltfLoader.load('/models/cart.gltf',
  (gltf) => {

    cartMixer = new THREE.AnimationMixer(gltf.scene);

    const action0 = cartMixer.clipAction(gltf.animations[0]);
    const action1 = cartMixer.clipAction(gltf.animations[1]);
    const action2 = cartMixer.clipAction(gltf.animations[2]);
    const action3 = cartMixer.clipAction(gltf.animations[3]);
    const action4 = cartMixer.clipAction(gltf.animations[4]);
    const action5 = cartMixer.clipAction(gltf.animations[5]);

    const speedMultiplier = 2;
    action0.timeScale = speedMultiplier;
    action1.timeScale = speedMultiplier;
    action2.timeScale = speedMultiplier;
    action3.timeScale = speedMultiplier;
    action4.timeScale = speedMultiplier;
    action5.timeScale = speedMultiplier;

    action0.play();
    action1.play();
    action2.play();
    action3.play();
    action4.play();
    // action5.play();

    gltf.scene.position.set(-4, 0.02, 0)
    gltf.scene.castShadow = true;
    gltf.scene.receiveShadow = true;
    scene.add(gltf.scene);

  })


const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: floorTexture,
    normalMap: normalTexture,
    aoMap: armTexture,
    roughnessMap: armTexture,
    metalnessMap: armTexture,
    displacementMap: displacementTexture,
    displacementScale: 0.05,
    bumpMap: bumpTexture,
    side: THREE.DoubleSide,
    alphaMap: alphaTexture,
    transparent: true,
  })
);
floor.rotation.x = -Math.PI * 0.5;
floor.castShadow = true;
floor.receiveShadow = true;
scene.add(floor);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 3, 6);
scene.add(camera);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 10, 10);
directionalLight.target.position.set(0, 0, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.right = 15;
directionalLight.shadow.camera.bottom = -15;
directionalLight.shadow.normalBias = 0.1; 
scene.add(directionalLight.target);
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 10, 0);
spotLight.target.position.set(0, 0, 0);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.2;
spotLight.castShadow = true;
scene.add(spotLight.target);
scene.add(spotLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 10);
pointLight.position.set(0, 2, 0);
scene.add(pointLight);

// FogExp2

const fog = new THREE.FogExp2(0x000000, 0.1);
scene.fog = fog;


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxDistance = 15;
controls.minDistance = 2;
controls.maxPolarAngle = Math.PI / 2 - 0.1;

let userInteracted = false;

controls.addEventListener('start', () => {
  userInteracted = true;
});


const timer = new Timer();

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();
  const deltaTime = timer.getDelta();
  controls.update();

  // We need to update the mixer to animate the model

  if(wolfMixer) {
    wolfMixer.update(deltaTime);
  }

  if(cartMixer) {
    cartMixer.update(deltaTime);
  }

  if (!userInteracted) {
    const radius = 8; // Distance from the center
    const angle = elapsedTime * 0.5; // Speed of rotation
    camera.position.x = Math.cos(angle) * radius;
    camera.position.z = Math.sin(angle) * radius;
    camera.lookAt(0, 0, 0); // Keep looking at the center
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
