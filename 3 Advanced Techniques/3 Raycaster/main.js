import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import "./style.css";

const scene = new THREE.Scene();

/* THEORY 

Raycaster is a class that allows you to cast a ray from a point in space and check if it intersects with any objects in the scene. It can be used to create interactions such as picking objects in a scene or detecting collisions between objects. The raycaster takes in a start point and an end point, and then checks for intersections with all objects in the scene. If an intersection is found, it returns the object that was intersected.

We first need to instantiate a raycaster using Raycaster(origin, direction).

To cast a ray, we have two options:

- intersectObject(object): This method checks if the ray intersects with the given single object.
- intersectObjects(objects): This method checks if the ray intersects with any of the given objects.

The object which it will return will have very useful information about it like the distance from the ray origin to the intersection point, the face index of the intersection point, the object that was intersected, and the UV coordinates of the intersection point and more.

We will intersect the ray on each frame and check if there is an intersection.

Note: If we pass a complex object or group having multiple meshes, then the raycaster will check for the full hierarchy of the whole object. We can manually deactivate this property by disabling the recursive property of the raycaster.

*/

const geometry = new THREE.BoxGeometry(1, 1, 1);

for (let x = -10 / 2; x <= 10 / 2; x++) {
  for (let y = -10 / 2; y <= 10 / 2; y++) {
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(1.05 * x, 1.05 * y, 0);
    cube.userData = { x, y };
    scene.add(cube);
  }
}

// Instantiate the raycaster
const raycaster = new THREE.Raycaster();

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 12);
scene.add(camera);

const mouse = new THREE.Vector2();

window.addEventListener("mousedown", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Implementing raycaster to cast the ray from the camera to the mouse position
  // The setFromCamera is a method that takes in a vector2 and a camera and sets the origin and direction of the raycaster based on the mouse position and the camera.
  raycaster.setFromCamera(mouse, camera);

  // Then we need to get the intersections between the ray and the objects in the scene.
  const intersects = raycaster.intersectObjects(scene.children);

  // If there is an intersection, change the color of the first intersected object
  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    selectedObject.material.color.set(activeColor); // Use the active color
    console.log(
      `setting color of cube at (x: ${selectedObject.userData.x}, y: ${selectedObject.userData.y}) to ${activeColor}`
    );
  }
});


const colorDisplay = document.getElementById("colorDisplay");
const colorWheel = document.getElementById("colorWheel");
let activeColor = "#ffffff";

// Define colors for the wheel
const colors = [
  "#ffffff",
  "#000000",
  "#ff0000",
  "#ff8000",
  "#ffff00",
  "#00ff00",
  "#0000ff",
  "#8000ff",
  "#ff00ff",
];

// Generate color swatches in a circular layout
colors.forEach((color, index) => {
  const swatch = document.createElement("div");
  swatch.className = "color-swatch";
  swatch.style.backgroundColor = color;

  // Calculate the angle for circular positioning
  const angle = (index / colors.length) * (Math.PI * 2);
  const radius = 80;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  // Position the swatch
  swatch.style.transform = `translate(${x}px, ${y}px)`;

  swatch.addEventListener("click", (event) => {
    // Remove 'selected' class from all swatches
    document
      .querySelectorAll(".color-swatch")
      .forEach((s) => s.classList.remove("selected"));

    // Set the active color and highlight the selected swatch
    activeColor = color;
    colorDisplay.style.backgroundColor = activeColor;
    swatch.classList.add("selected");
  });

  colorWheel.appendChild(swatch); // Add swatch to the color wheel
});

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222230);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0, 5);
scene.add(directionalLight);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 2;
controls.maxDistance = 17;
controls.minDistance = 10;

const timer = new Timer();

let rotationSpeed = 0.1;

const tick = () => {
  const elapsedTime = timer.getElapsed();
  timer.update();
  controls.update();

  // Rotate the color wheel
  colorWheel.style.transform = `rotate(${
    elapsedTime * rotationSpeed * 100
  }deg)`;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
