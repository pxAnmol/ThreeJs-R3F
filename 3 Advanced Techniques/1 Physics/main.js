import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as lil from "lil-gui";
import { Timer } from "three/addons/misc/Timer.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import "./style.css";

const gui = new lil.GUI();

// Creating a debugObject to store the debug options

const debugObject = {};

const stats = new Stats();
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();

/* THEORY

- Integrating physics with ThreeJs is a bit complex task. We need to use a physics engine. We will use CannonJs.Or specifically cannon-es which is a well maintained fork of cannon.js.
- We need to create a separate scene for the physics simulation known as the physics world.
- Then we need to create objects as we do in normal ThreeJs scene, but then we need to create the same objects in the physics world. And on each frame, we need to update the physics world and then update the ThreeJs scene to match the physics world with the position, rotation and other properties with the physics world.

* Step 1: Create a physics world

* Step 2: Create objects in the physics world
Just like we create meshes in ThreeJs, we will create a "Body" in the physics world. These are the objects that will fall and collide with other bodies.
To create a body, we need to create a shape. The shape can be a sphere, a box, a cylinder, etc.
Then we will create a body with various properties like mass, position, velocity, etc. and add the shape to the body.
Add the body to the physics world via the  addBody method.

* Step 3: Update the physics world
We need to update the physics world on each frame in the tick function. This can  be done via the step method. This will calculate the time difference between the current frame and the previous frame and then update the physics world accordingly.

* Step 4: Update the ThreeJs objects to match the physics world
We need to update the ThreeJs objects to match the physics world. We need to update the position, rotation, scale, etc. of the ThreeJs objects to match the physics world. To update the position, just use the copy method to copy the position, rotation, scale, etc. of the physics body to the ThreeJs mesh. This also needs to be done in the tick function.

** MATERIALS **

We can change the friction and bouncing behavior by setting a Material to the body which is a reference to the shape and we should create one for each type of material like concrete, plastic, jelly, etc.
We need to create a ContactMaterial for each type of material which is a combination of two materials and how they should collide. The parameters are - the two materials and the friction and restitution(bounce).

** FORCES **

We can apply forces to the bodies like gravity, wind, etc. using the following methods:

- applyForce: applies a force to the body at a specific point (can be used to demonstrate a force like a wind)
- applyImpulse: applies an impulse to the body at a specific point which instead of adding to the force, it adds a velocity to the body.
- applyLocalForce: it's similar to applyForce but it applies the force at the coordinates that are local to the body, like the center of the body.
- applyLocalImpulse: it's similar to applyImpulse but it applies the impulse at the coordinates that are local to the body.

** PERFORMANCE OPTIMIZATION **

* Broadphase - This is a way to optimize the physics world by checking which bodies are colliding with each other. When testing the collisions between two bodies, the broadphase algorithm checks if the bounding boxes of the two bodies intersect. There are different algorithms for better performances.

- NaiveBroadphase: This is the simplest algorithm. It checks if the bounding boxes of the two bodies intersect. It checks for every Body against every other body.
- GridBroadphase: This is a more advanced algorithm. It divides the world into grids and only tests for collisions between bodies that are in the same grid.
- SAPBroadphase (Sweep And Prune): This is an even more advanced algorithm. It uses a spatial acceleration structure to optimize the collision detection.

The default broadphase algorithm is NaiveBroadphase and is recommended to switch to SAPBroadphase for better performance. But using it might cause some bugs with bodies moving at high speeds.

* Sleep - This is a way to optimize the physics world by making the bodies sleep when they are not moving. This is useful for objects that are not moving and can be optimized by making them sleep.
We can control the sleep threshold and the minimum sleep energy. The sleep threshold is the amount of energy that a body needs to have to be considered awake. The minimum sleep energy is the amount of energy that a body needs to have to be considered asleep.

** SOUND **

We can listen to the collision events and play sounds when the bodies collide.

*/

// PHYSICAL WORLD

/* Step 1 */ const world = new CANNON.World();

// Setting the SAPBroadphase algorithm for better performance
world.broadphase = new CANNON.SAPBroadphase(world);

// Setting the sleeping of the bodies to true
world.allowSleep = true;

// Set the gravity of the physics world
world.gravity.set(0, -9.82, 0);

// MATERIALS
const defaultMaterial = new CANNON.Material("concrete");

// Contact materials
// It's like what will happen when the concrete and plastic collide
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
// Add the contact material to the world
world.addContactMaterial(defaultContactMaterial);

// Setting the default contact materia as defaultContactMaterial
world.defaultContactMaterial = defaultContactMaterial;

/* Step 2 */

// Add a floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0, // 0 means static
  shape: floorShape,
});
// CannonJs just follows the quaternion convention. The setFromAxisAngle method is used to set the rotation of the body. The first argument is the axis of rotation and the second argument is the angle of rotation in radians.
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

// THREE.JS WORLD

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#2a5674",
    metalness: 0.6,
    roughness: 0.2,
    envMapIntensity: 0.9,
    side: THREE.DoubleSide,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Creating multiple objects integrating both the physics world and the ThreeJs world with creating an array of objects to store the objects that needs to be updated on each frame and then updating them in the tick function.

const objectsToUpdate = [];

/* Creating a function to create walls around the floor */

const createWall = (width, height, depth, position, color) => {
  // Three.js wall
  const wallGeometry = new THREE.BoxGeometry(width, height, depth);
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.6,
    roughness: 0.2,
  });
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.copy(position);
  scene.add(wall);
  wall.receiveShadow = true;
  wall.castShadow = true;

  // Physics world wall
  const wallBody = new CANNON.Body({
    mass: 0, // Walls are static
    shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)),
    material: defaultMaterial,
  });
  wallBody.position.copy(position);
  world.addBody(wallBody);

};

const createWallsAroundFloor = (floorSize) => {
  if (typeof floorSize !== "number" || floorSize <= 0) {
    console.error("Error: floorSize must be a positive number.");
    return;
  }

  const wallDepth = 0.2;
  const offset = 0.01;
  const heightVariation = 0.001; // Small variation in wall height

  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];

  // Create walls with slight height variations
  createWall(
    floorSize + 2 * wallDepth,
    2 + heightVariation,
    wallDepth,
    new THREE.Vector3(
      0,
      1 + heightVariation / 2,
      floorSize / 2 + wallDepth / 2 + offset
    ),
    colors[0]
  ); // North wall (red)
  createWall(
    floorSize + 2 * wallDepth,
    2 - heightVariation,
    wallDepth,
    new THREE.Vector3(
      0,
      1 - heightVariation / 2,
      -floorSize / 2 - wallDepth / 2 - offset
    ),
    colors[1]
  ); // South wall (green)
  createWall(
    wallDepth,
    2 + heightVariation,
    floorSize + 2 * wallDepth,
    new THREE.Vector3(
      floorSize / 2 + wallDepth / 2 + offset,
      1 + heightVariation / 2,
      0
    ),
    colors[2]
  ); // East wall (blue)
  createWall(
    wallDepth,
    2 - heightVariation,
    floorSize + 2 * wallDepth,
    new THREE.Vector3(
      -floorSize / 2 - wallDepth / 2 - offset,
      1 - heightVariation / 2,
      0
    ),
    colors[3]
  ); // West wall (yellow)
};

const floorSize = 10;
createWallsAroundFloor(floorSize);

/* Creating a function to create a sphere */

// Sphere geometry and material
const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
});

const createSphere = (radius, position) => {
  // Three Js sphere
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
  sphere.scale.set(radius, radius, radius);

  sphere.castShadow = true;
  sphere.position.copy(position);
  scene.add(sphere);

  // Generate random color using 0-255 range and normalize
  const r = Math.random();
  const g = Math.random();
  const b = Math.random();
  const randomColor = new THREE.Color(r, g, b);
  sphere.material.color.copy(randomColor);

  // Physics world sphere

  const sphereBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(radius * 0.5),
    material: defaultMaterial,
  });
  sphereBody.position.copy(position);
  world.addBody(sphereBody);

  // Integrating the hit sound with the createSphere function

  sphereBody.addEventListener("collide", (event) => {
    playHitSound(event);
  })

  // Adding the sphere to the objects to update array
  objectsToUpdate.push({
    threeJsObject: sphere,
    physicsObject: sphereBody,
  });
};

// Integrating the createSphere function with the debugger

debugObject.createSphere = () => {
  // Adding randomness to the position and radius of the sphere
  const radius = Math.random() + 0.3;
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 9,
    radius * 2 + 1,
    (Math.random() - 0.5) * 9
  );
  createSphere(radius, position);
};
gui.add(debugObject, "createSphere").name("Generate Sphere");


/* Creating a function to create a cube */

// Cube Geometry and material
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: "#ff0000",
  metalness: 0.6,
  roughness: 0.2,
});

const createCube = (width, height, depth, position) => {
  // Three Js cube
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial.clone());
  cube.scale.set(width, height, depth);
  cube.position.copy(position);
  scene.add(cube);

  const r = Math.random();
  const g = Math.random();
  const b = Math.random();
  const randomColor = new THREE.Color(r, g, b);
  cube.material.color.copy(randomColor);

  // Physics world cube

  // There is a special thing to note while creating boxes in cannon.js which is half-extents. This is the length between the center of the box and the edge of the box. So, while creating a box, we need to set the width, height and depth to be half of the actual width, height and depth of the three.js box.

  const cubeBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)),
    material: defaultMaterial,
  });
  cubeBody.position.copy(position);
  world.addBody(cubeBody);

  // Integrating the hit sound with the createCube function
  cubeBody.addEventListener("collide", (event) => {
    playPlasticHitSound(event);
  })

  // Adding the cube to the objects to update array
  objectsToUpdate.push({
    threeJsObject: cube,
    physicsObject: cubeBody,
  });
};

// Integrating the createCube function with the debugger
debugObject.createCube = () => {
  // Adding randomness to the position and size of the cube
  const width = Math.random() + 0.3;
  const height = Math.random() + 0.3;
  const depth = Math.random() + 0.3;
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 9,
    height * 2 + 1,
    (Math.random() - 0.5) * 9
  );
  createCube(width, height, depth, position);
};
gui.add(debugObject, "createCube").name("Generate Cube");

/* Sound */

const hitSound = new Audio("./sounds/hit.mp3");
const plasticHitSound = new Audio("./sounds/plastic-hit.mp3");

let lastSoundTime = 0;
const soundCooldown = 100; // milliseconds

const playHitSound = (collision) => {
  const collisionStrength = collision.contact.getImpactVelocityAlongNormal();
  const currentTime = Date.now();

  if (currentTime - lastSoundTime > soundCooldown && collisionStrength > 1.5) {
    lastSoundTime = currentTime;
    hitSound.currentTime = 0;
    hitSound.volume = Math.min(1, (Math.random() * collisionStrength / 50) * 10); 
    hitSound.play();
  }
};

const playPlasticHitSound = (collision) => { // New function
  const collisionStrength = collision.contact.getImpactVelocityAlongNormal();
  const currentTime = Date.now();

  if (currentTime - lastSoundTime > soundCooldown && collisionStrength > 1.5) {
    lastSoundTime = currentTime;
    plasticHitSound.currentTime = 0;
    plasticHitSound.volume = Math.min(1, (Math.random() * collisionStrength / 50) * 10);
    plasticHitSound.play();
  }
};


/* Removing the objects */

debugObject.reset = () => {
  for (const object of objectsToUpdate) {
    object.threeJsObject.parent.remove(object.threeJsObject);
    world.removeBody(object.physicsObject);
    object.physicsObject.removeEventListener("collide", playHitSound);
    object.physicsObject.removeEventListener("collide", playPlasticHitSound);

    // Remove the mesh
    scene.remove(object.threeJsObject);
  }
  objectsToUpdate.length = 0;
};
gui.add(debugObject, "reset").name("Reset");



const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(-4, 4, 10);
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Instantiate the Cannon Debugger to visualize the physics world
const cannonDebugger = new CannonDebugger(scene, world, {
  color: 0x00ff00,
  scale: 1,
});

const timer = new Timer();

const tick = () => {
  timer.update();
  stats.update();
  const elapsedTime = timer.getElapsed();
  const deltaTime = timer.getDelta();

  /* Step 3 - Updating the physical world

    In this method, we need to pass three arguments:
    1. A fixed time step which is the time difference between the current frame and the previous frame. This value is set to be 1/60 (60 frames per second)
    2. A delta time (the time difference between the current frame and the previous frame)
    3. How many iterations to catch up the potential delay between the physics world and the ThreeJs world. Generally, this value is set to be 3.
    */

  world.step(1 / 120, deltaTime, 10);

  /* Step 4 */
  // Updating the objects to update array

  objectsToUpdate.forEach((object) => {
    // Updating the position of the ThreeJs object
    object.threeJsObject.position.copy(object.physicsObject.position);
    // Updating the rotation of the ThreeJs object
    object.threeJsObject.quaternion.copy(object.physicsObject.quaternion);
  });

  // Uncomment the following line to visualize the physics world
  // cannonDebugger.update();

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();