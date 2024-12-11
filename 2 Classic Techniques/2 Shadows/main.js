import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as lil from "lil-gui";
import "./style.css";

const canvas = document.querySelector("canvas.webgl");
const gui = new lil.GUI();

const scene = new THREE.Scene();

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
material.side = THREE.DoubleSide;
gui.add(material, "metalness").min(0).max(1).step(0.001).name("Material Metalness");
gui.add(material, "roughness").min(0).max(1).step(0.001).name("Material Roughness");

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
scene.add(sphere, plane);


/*  SHADOWS

The dark shadow in the back of the objects are called core shadows. We need drop shadows.

Shadows has always been challenging to implement. We can use a 3D software like Blender to create shadows. The main problem is to render the shadows in real-time and at reasonable frame rates.
ThreeJs has a built-in shadow system. It's not perfect, but it's good enough for most cases.

When we do one render of the scene, then the ThreeJs engine will render the scene from the point of view of the camera. Then it will render the shadows from the point of view of the light. During this second render, it will render the shadows of the objects and the material is internally changed to MeshDepthMaterial.

The light renders are stored in the shadow map. The shadow map is a texture that contains the depth of the objects in the scene. The shadow map is rendered in the shadow map texture.


ENABLING SHADOWS

To enable the shadows, enable the shadowMap property of the renderer.
Now, check for the objects in the scene, whether they are cast shadows or receive shadows by tweaking the castShadow and receiveShadow properties of the objects.

Only the following types of lights can cast shadows:

- DirectionalLight
- SpotLight
- PointLight


OPTIMIZING SHADOWS

We can tweak the mapSize, which is a Vector2. The default value is 512. We can increase the size of the shadow map to improve the quality of the shadows. It is the light property. Use the value in the power of 2 for the mipmapping.
We can control the near and far values of the shadow map by tweaking the shadow.camera.near and shadow.camera.far properties.
We can control how far the each side of the shadow from the light can see with the top, bottom, left, and right properties.

BLUR

We can control the shadow blur of the with the radius property of the shadow.mapSize. But this method is not recommended since it is not optimized.

The better way to do is to use the shadowMap algorithm. The shadowMap algorithm is a technique that uses a blur filter to smooth the edges of the shadows. It can be changed via the renderer.shadowMap.type property.
There are different types of shadowMap algorithms:
- PCFShadowMap: This is the default algorithm. It uses a blur filter to smooth the edges of the shadows.
- PCFSoftShadowMap: This is the same as PCFShadowMap, but it uses a soft blur filter to smooth the edges of the shadows.
- BasicShadowMap: This is the fastest algorithm, but it is not as good as the other algorithms.
-VSMShadowMap: This is the most accurate algorithm, but it is also the slowest algorithm.

*/

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001).name("Ambient Light Intensity");

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 12;

directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.bottom = -1;
directionalLight.shadow.camera.left = -1;
directionalLight.shadow.camera.right = 1;

directionalLight.shadow.radius = 20;

directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001).name("Directional Light Intensity");
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001).name("Directional Light X");
gui.add(directionalLight.position, "y").min(0.5).max(5).step(0.001).name("Directional Light Y");
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001).name("Directional Light Z");
scene.add(directionalLight);

// This is a helper to visualize the shadow map of the directional light
const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightHelper);
directionalLightHelper.visible = false;
gui.add(directionalLightHelper, "visible").name("Directional Light Helper");

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(1, 1, 2);
scene.add(camera);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
  controls.update();
};

tick();
