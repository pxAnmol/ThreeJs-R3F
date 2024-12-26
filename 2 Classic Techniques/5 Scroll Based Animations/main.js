import * as THREE from "three";
import { Timer } from "three/addons/misc/Timer.js";

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const sunTexture = textureLoader.load("/2k_sun.jpg");

const earthTexture = textureLoader.load("/2k_earth_nightmap.jpg");
const earthNormal = textureLoader.load("/2k_earth_normal_map.jpg");
const earthSpecular = textureLoader.load("/2k_earth_specular_map.jpg");
const earthClouds = textureLoader.load("/2k_earth_clouds.jpg");
const earthBump = textureLoader.load("/earthbump1k.jpg");

const moonTexture = textureLoader.load("/2k_moon.jpg");

// Set texture color space to SRGB for accurate color reproduction
sunTexture.colorSpace = THREE.SRGBColorSpace;
earthTexture.colorSpace = THREE.SRGBColorSpace;
moonTexture.colorSpace = THREE.SRGBColorSpace;

const sun = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.5, 15),
  new THREE.MeshStandardMaterial({
    color: 0xffff00,
    map: sunTexture,
  })
);

const earth = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.5, 15),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: earthNormal,
    roughnessMap: earthSpecular,
    metalnessMap: earthSpecular,
    bumpMap: earthBump,
    metalness: 0.1,
    roughness: 0.7,
  })
);
// Semi-transparent cloud layer slightly larger than Earth
const cloudsMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.51, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthClouds,
    transparent: true,
    opacity: 0.05,
    depthWrite: false, // Prevents z-fighting with Earth surface
  })
);

// Add clouds as a child of earth
earth.add(cloudsMesh);

// Realistic Earth axis tilt
earth.rotation.z = THREE.MathUtils.degToRad(-23.5);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.45, 48, 48),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    metalness: 0.3,
    roughness: 0.7,
  })
);

scene.add(sun, earth, moon);

sun.position.x = 1.3;
earth.position.x = -1.3;
moon.position.x = 1.3;

// Vertical spacing between celestial objects
const objectDistance = 4;

sun.position.y = -objectDistance * 0;
earth.position.y = -objectDistance * 1;
moon.position.y = -objectDistance * 2;

const objectMeshes = [sun, earth, moon];


// Custom particle system for star field
const particleCount = 3500;
const positions = new Float32Array(particleCount * 3);
const opacities = new Float32Array(particleCount);
const opacityDelays = new Float32Array(particleCount); // For twinkling effect

// Fill the positions array with random positions
for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;

  // Create varying density by adjusting the random range based on y position
  positions[i3] = (Math.random() - 0.5) * 25; // x
  positions[i3 + 1] = (Math.random() - 0.5) * 30 - Math.random() * 10; // y
  positions[i3 + 2] = (Math.random() - 0.5) * 25; // z

  opacities[i] = Math.random();
  opacityDelays[i] = Math.random() * 2 * Math.PI; // Random phase offset
}

// Create the star particles geometry
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

starGeometry.setAttribute("alpha", new THREE.BufferAttribute(opacities, 1));

// Create material with small point size for stars
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  sizeAttenuation: true,
  size: 0.02,
  transparent: true,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
});

// Create the star field
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Adding a group to hold up the camera for the parallax effect issue
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;
cameraGroup.add(camera);

// Moving camera along with the scroll

// We need the scrollY position of the window to move the camera along with the scroll

// We need to store the previous scrollY position to calculate the difference between the current and previous scrollY position

let scrollY = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

//  To fix the issue of the canvas having a constant black background, we need to set the alpha property of the renderer to true.
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);


/*  PARALLAX EFFECT

It is the action if seeing one object through different observation points.  
We can achieve this by moving the camera according to the mouse position.

* Easing the parallax effect *

Now the issue with the parallax effect is that it is too fast. We need to slow it down. It's like the camera just jumps from one position to another. We need to make it look more natural.
To achieve this, we will break the movement into smaller steps.
On each frame, instead of moving the camera straight to the mouse position, we will move it a little bit closer to the mouse position by the 10th of the distance between the camera and the mouse position.
To do this, we need to calculate the distance between the actual position and the destination position of the camera.
*/


// We need to get the mouse position
const mouse = {
  x: 0,
  y: 0,
};

// Divide the mouse position by the window width and height to get the mouse position in the range of -0.5 to 0.5
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / window.innerWidth - 0.5;
  mouse.y = event.clientY / window.innerHeight - 0.5;
});

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  adjustForMobile();
});

// Responsive design adjustments
const adjustForMobile = () => {
  let isMobile = window.innerWidth < 768;
  let isWideScreen = window.innerWidth > 1440;
  // Different camera positions and object scales based on screen size

  if (isWideScreen) {
    camera.position.z = 4;
    camera.fov = 45;
    camera.updateProjectionMatrix();

    sun.scale.set(1.2, 1.2, 1.2);
    earth.scale.set(1.2, 1.2, 1.2);
    moon.scale.set(1.2, 1.2, 1.2);

    sun.position.set(2, -objectDistance * 0, 0);
    earth.position.set(-2, -objectDistance * 1, 0);
    moon.position.set(2, -objectDistance * 2, 0);
  } else if (isMobile) {
    camera.position.z = 6;
    camera.fov = 40;
    camera.updateProjectionMatrix();

    sun.scale.set(1.4, 1.4, 1.4);
    earth.scale.set(1.4, 1.4, 1.4);
    moon.scale.set(1.4, 1.4, 1.4);

    sun.position.set(0, -1, 0);
    earth.position.set(0, -5, 0);
    moon.position.set(0, -9, 0);
  } else {
    camera.position.z = 3;
    camera.fov = 40;
    camera.updateProjectionMatrix();

    sun.scale.set(1, 1, 1);
    earth.scale.set(1, 1, 1);
    moon.scale.set(1, 1, 1);

    sun.position.set(1.3, -objectDistance * 0, 0);
    earth.position.set(-1.3, -objectDistance * 1, 0);
    moon.position.set(1.3, -objectDistance * 2, 0);
  }
};


const timer = new Timer();

// Animation loop with specific features
const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();
  const deltaTime = timer.getDelta();

  // Rotate the objects
  objectMeshes.forEach((object) => {
    object.rotation.y = elapsedTime * 0.01;
  });

  stars.rotation.y = elapsedTime * 0.05;
  stars.rotation.x = elapsedTime * 0.02;

  // Dynamic star twinkling effect
  const colors = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const opacity = 0.3 + Math.sin(elapsedTime * 2 + opacityDelays[i]) * 0.7;
    const i3 = i * 3;
    colors[i3] = opacity;
    colors[i3 + 1] = opacity;
    colors[i3 + 2] = opacity;
  }
  starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  sun.rotation.y = elapsedTime * 0.1;

  earth.rotation.y = elapsedTime * 0.08;

  moon.rotation.y = elapsedTime * 0.05;

  // Animate clouds around Earth
  if (cloudsMesh) {
    cloudsMesh.rotation.y = elapsedTime * 0.1;
    cloudsMesh.rotation.z = elapsedTime * 0.05;
  }

  // Move the camera along with the scroll

  // Invert the scrollY value to move the camera in the opposite direction. We also divide the scrollY value by the window.innerHeight to make the movement smoother and to make the camera move slower.
  camera.position.y = (-scrollY / window.innerHeight) * objectDistance;

  // Parallax effect

  // Store the mouse position in a variable
  const parallaxX = mouse.x * 0.5;
  const parallaxY = mouse.y * 0.5;
  // Instead of moving the camera directly, we will move the cameraGroup for the parallax effect
  // camera.position.x = - parallaxX;
  // camera.position.y = parallaxY;
  
  // Now the problem is that we are updating the camera position twice, one for the scroll and one for the parallax effect. To fix this, we will put the camera inside the group and imagine it like a container (box) holding up the camera. So now, we move the container (group) for parallax effect and the camera inside the container for the scroll.
  
    cameraGroup.position.x +=
      (-parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y +=
      (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
  
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
adjustForMobile();
