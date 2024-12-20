import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
const canvas = document.querySelector("canvas.webgl");
import { Sky } from "three/addons/objects/Sky.js";

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const scene = new THREE.Scene();

// Textures

const textureLoader = new THREE.TextureLoader();

// Bush
const bushColorTexture = textureLoader.load(
  "assets/bush/forest_leaves_04_1k/forest_leaves_04_diff_1k.webp"
);
const bushNormalTexture = textureLoader.load(
  "assets/bush/forest_leaves_04_1k/forest_leaves_04_nor_gl_1k.webp"
);
const bushARMTexture = textureLoader.load(
  "assets/bush/forest_leaves_04_1k/forest_leaves_04_arm_1k.webp"
);
const bushDisplacementTexture = textureLoader.load(
  "assets/bush/forest_leaves_04_1k/forest_leaves_04_disp_1k.webp"
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

// Floor

const floorColorTexture = textureLoader.load(
  "assets/floor/forest_ground_04_1k/forest_ground_04_diff_1k.webp"
);
const floorAlphaMap = textureLoader.load("assets/circular.webp");
const floorNormalTexture = textureLoader.load(
  "assets/floor/forest_ground_04_1k/forest_ground_04_nor_gl_1k.png"
);
const floorARMTexture = textureLoader.load(
  "assets/floor/forest_ground_04_1k/forest_ground_04_arm_1k.webp"
);
const floorDisplacementTexture = textureLoader.load(
  "assets/floor/forest_ground_04_1k/forest_ground_04_disp_1k.webp"
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(3, 3);
floorNormalTexture.repeat.set(3, 3);
floorARMTexture.repeat.set(3, 3);
floorDisplacementTexture.repeat.set(3, 3);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Wall

const wallColorTexture = textureLoader.load(
  "assets/wall/mossy_brick_1k/mossy_brick_diff_1k.webp"
);
const wallNormalTexture = textureLoader.load(
  "assets/wall/mossy_brick_1k/mossy_brick_nor_gl_1k.webp"
);
const wallARMTexture = textureLoader.load(
  "assets/wall/mossy_brick_1k/mossy_brick_arm_1k.webp"
);
const wallDisplacementTexture = textureLoader.load(
  "assets/wall/mossy_brick_1k/mossy_brick_disp_1k.webp"
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof

const roofColorTexture = textureLoader.load(
  "assets/roof/roof_tiles_14_1k/roof_tiles_14_diff_1k.webp"
);
const roofNormalTexture = textureLoader.load(
  "assets/roof/roof_tiles_14_1k/roof_tiles_14_nor_gl_1k.webp"
);
const roofARMTexture = textureLoader.load(
  "assets/roof/roof_tiles_14_1k/roof_tiles_14_arm_1k.webp"
);
const roofDisplacementTexture = textureLoader.load(
  "assets/roof/roof_tiles_14_1k/roof_tiles_14_disp_1k.webp"
);
const roofBumpTexture = textureLoader.load(
  "assets/roof/roof_tiles_14_1k/roof_tiles_14_nor_gl_1k.webp"
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(1, 1);
roofNormalTexture.repeat.set(1, 1);
roofARMTexture.repeat.set(1, 1);
roofDisplacementTexture.repeat.set(1, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofDisplacementTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;
roofARMTexture.wrapT = THREE.RepeatWrapping;
roofDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Door

const doorColorTexture = textureLoader.load(
  "assets/door/Door_Wood_001_SD/Door_Wood_001_basecolor.webp"
);
const doorNormalTexture = textureLoader.load(
  "assets/door/Door_Wood_001_SD/Door_Wood_001_normal.webp"
);
const doorAmbientOcclusionTexture = textureLoader.load(
  "assets/door/Door_Wood_001_SD/Door_Wood_001_ambientOcclusion.webp"
);
const doorHeightTexture = textureLoader.load(
  "assets/door/Door_Wood_001_SD/Door_Wood_001_height.webp"
);
const doorRoughnessTexture = textureLoader.load(
  "assets/door/Door_Wood_001_SD/Door_Wood_001_roughness.webp"
);
const doorMetalnessTexture = textureLoader.load(
  "assets/door/Door_Wood_001_SD/Door_Wood_001_metallic.webp"
);
const doorAlphaTexture = textureLoader.load(
  "assets/door/Door_Wood_001_SD/Door_Wood_001_opacity.webp"
);

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

// Grave

const graveColorTexture = textureLoader.load(
  "assets/grave/hangar_concrete_floor_1k/hangar_concrete_floor_diff_1k.webp"
);
const graveNormalTexture = textureLoader.load(
  "assets/grave/hangar_concrete_floor_1k/hangar_concrete_floor_nor_gl_1k.webp"
);
const graveARMTexture = textureLoader.load(
  "assets/grave/hangar_concrete_floor_1k/hangar_concrete_floor_arm_1k.webp"
);
const graveDisplacementTexture = textureLoader.load(
  "assets/grave/hangar_concrete_floor_1k/hangar_concrete_floor_disp_1k.webp"
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

// Bench

const benchColorTexture = textureLoader.load(
  "assets/bench/weathered_planks_1k/weathered_planks_diff_1k.webp"
);
const benchNormalTexture = textureLoader.load(
  "assets/bench/weathered_planks_1k/weathered_planks_nor_gl_1k.webp"
);
const benchARMTexture = textureLoader.load(
  "assets/bench/weathered_planks_1k/weathered_planks_arm_1k.webp"
);
const benchDisplacementTexture = textureLoader.load(
  "assets/bench/weathered_planks_1k/weathered_planks_disp_1k.webp"
);

// Floor

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 200, 200),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    alphaMap: floorAlphaMap,
    transparent: true,
    roughnessMap: floorARMTexture,
    aoMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.7,
    displacementBias: -0.25,
  })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const solidGround = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    color: "#000000",
    alphaMap: floorAlphaMap,
    transparent: true,
  })
);
solidGround.rotation.x = -Math.PI / 2;
solidGround.position.y = -0.04;
scene.add(solidGround);

const house = new THREE.Group();
scene.add(house);

// Walls

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    normalMap: wallNormalTexture,
    roughnessMap: wallARMTexture,
    aoMap: wallARMTexture,
    displacementMap: wallDisplacementTexture,
    displacementScale: 0.00001,
  })
);
walls.position.y += 1.25;
house.add(walls);

// Roof

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    normalMap: roofNormalTexture,
    roughnessMap: roofARMTexture,
    aoMap: roofARMTexture,
    displacementMap: roofDisplacementTexture,
    bumpMap: roofBumpTexture,
    displacementScale: 0.001,
  })
);
roof.position.y += 2.5 + 0.75;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    normalMap: doorNormalTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
  })
);
door.position.y = 1;
door.position.z = 2 + 0.001;
house.add(door);

// Bushes

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#89c854",
  opacity: 0.5,
  map: bushColorTexture,
  normalMap: bushNormalTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  displacementMap: bushDisplacementTexture,
  displacementScale: 0.5,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(0.8, 0.2, 2.5);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.rotation.x = -Math.PI / 4;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(1.3, 0.1, 2);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.rotation.x = -Math.PI / 4;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-1, 0.2, 2.6);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.rotation.x = -Math.PI / 4;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1.4, 0.05, 3);
bush4.scale.set(0.2, 0.2, 0.2);
bush4.rotation.x = -Math.PI / 4;

scene.add(bush1, bush2, bush3, bush4);

// Bench

const bench = new THREE.Group();

const woodMaterial = new THREE.MeshStandardMaterial({
  color: "#966F33",
  map: benchColorTexture,
  normalMap: benchNormalTexture,
  roughnessMap: benchARMTexture,
  aoMap: benchARMTexture,
  displacementMap: benchDisplacementTexture,
  displacementScale: 0.001,
});

const benchSeat = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 0.1, 0.8),
  woodMaterial
);
benchSeat.position.y = 0.4;

const benchBack = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 0.7, 0.1),
  woodMaterial
);
benchBack.position.y = 0.7;
benchBack.position.z = -0.35;

const legGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.4);

const leg1 = new THREE.Mesh(legGeometry, woodMaterial);
const leg2 = new THREE.Mesh(legGeometry, woodMaterial);
const leg3 = new THREE.Mesh(legGeometry, woodMaterial);
const leg4 = new THREE.Mesh(legGeometry, woodMaterial);

leg1.position.set(0.6, 0.2, 0.15);
leg2.position.set(-0.6, 0.2, 0.15);
leg3.position.set(0.6, 0.2, -0.15);
leg4.position.set(-0.6, 0.2, -0.15);

bench.add(benchSeat, benchBack, leg1, leg2, leg3, leg4);

bench.position.set(-3.3, 0, 3);
bench.rotation.y = Math.PI * 0.25;

scene.add(bench);

// Grave

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  normalMap: graveNormalTexture,
  roughnessMap: graveARMTexture,
  aoMap: graveARMTexture,
  displacementMap: graveDisplacementTexture,
  displacementScale: 0.00001,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.castShadow = true;
  grave.receiveShadow = true;
  const angle = Math.random() * Math.PI * 2;

  const radius = 4 + Math.random() * 5.8;

  const xPosition = Math.sin(angle) * radius;
  const zPosition = Math.cos(angle) * radius;

  grave.position.x = xPosition;
  grave.position.y = Math.random() * 0.3;
  grave.position.z = zPosition;

  grave.rotation.x = (Math.random() - 0.5) * 0.5;
  grave.rotation.y = (Math.random() - 0.5) * 0.5;
  grave.rotation.z = (Math.random() - 0.5) * 0.5;

  graves.add(grave);
}

// Ambient Light

const ambientLight = new THREE.AmbientLight(0x86cdff, 0.5);
scene.add(ambientLight);

// Directional Light

const moonLight = new THREE.DirectionalLight(0x86cdff, 1);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 15;
moonLight.position.set(3, 2, -8);
scene.add(moonLight);

// Bulb above door

const redBulb = new THREE.PointLight(0xff7d46, 25);
redBulb.position.set(0, 2.45, 2.3);
house.add(redBulb);

// Camera

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(4.5, 3.7, 6);
scene.add(camera);

// Renderer

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// Shadow

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
roof.receiveShadow = true;
bench.castShadow = true;
bench.receiveShadow = true;
floor.castShadow = true;
floor.receiveShadow = true;
redBulb.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
bush1.receiveShadow = true;
bush2.receiveShadow = true;
bush3.receiveShadow = true;
bush4.receiveShadow = true;

// Optimizing/Mapping the shadow

renderer.physicallyCorrectLights = true;
moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.top = 10;
moonLight.shadow.camera.bottom = -10;
moonLight.shadow.camera.left = -10;
moonLight.shadow.camera.right = 10;
moonLight.shadow.camera.far = 15;
moonLight.shadow.camera.near = 1;

// Sky

const sky = new Sky();

sky.scale.set(100, 100, 100);
sky.material.uniforms.turbidity.value = 10;
sky.material.uniforms.rayleigh.value = 2;
sky.material.uniforms.mieCoefficient.value = 0.1;
sky.material.uniforms.mieDirectionalG.value = 0.95;
sky.material.uniforms.sunPosition.value.set(0.3, -0.038, -0.95);

scene.add(sky);

// Fog

const fog = new THREE.FogExp2(0x02343f, 0.1);
scene.fog = fog;

// Controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI * 0.47;
controls.minDistance = 3.5;
controls.maxDistance = 20;

let autoRotate = true;
const rotationRadius = 10; // Distance from center
const rotationSpeed = 0.2; // Speed of rotation

controls.addEventListener("start", () => {
  autoRotate = false;
});

const timer = new Timer();

const tick = () => {
  timer.update();
  controls.update();

  if (autoRotate) {
    const angle = timer.getElapsed() * rotationSpeed;
    camera.position.x = Math.cos(angle) * rotationRadius;
    camera.position.z = Math.sin(angle) * rotationRadius;
    camera.lookAt(house.position);
  }

  const flickerSpeed = 0.1;
  const minIntensity = 15;
  const maxIntensity = 35;
  const noise =
    Math.sin(timer.getElapsed() * flickerSpeed * Math.PI) * Math.random();
  redBulb.intensity = minIntensity + noise * (maxIntensity - minIntensity);

  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};

tick();