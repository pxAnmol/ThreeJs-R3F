import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as lil from "lil-gui";
import { Timer } from "three/addons/misc/Timer.js";
import "./style.css";

const scene = new THREE.Scene();

// Loading texture for particles

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("/particles/9.png");

/*  PARTICLES

  Particles can be used to create effects like rain, fire, smoke, etc. Each particle is composed of a plane ( two triangles ) that is always facing the camera.

  To create particles, we need to create a geometry and a material. The geometry is a plane and the material is a shader material that will be used to render the particles.

  We will use pointsMaterial to render the particles. The pointsMaterial is a material that renders points as small squares. We can use the size property to set the size of the squares.

*/

// Creating particles

// Geometry
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

// ( Creating custom geometries using Buffer Geometry )
const customParticlesGeometry = new THREE.BufferGeometry();

const count = 15000;

// ( We need to specify the vertex position to create a custom geometry, we will specify in a special array of Float32Array )
const positions = new Float32Array(count * 3);

// ( Adding another attribute to provide different color to each particle )
const colors = new Float32Array(count * 3);

// ( We need to now position the particles in the scene, we will do it randomly )
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

// ( We need to create a buffer attribute to store the positions )

customParticlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// ( We need to create a buffer attribute to store the colors )

customParticlesGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3)
);

// Material

// We can change the color, size, alpha, etc of the particles using the pointsMaterial

// We can also use the map property to put a texture on these particles. Use alphaMap instead of map to use the alpha channel of the texture as the alpha of the particle and make the transparent property true.

// Use the alphaTest property to set the alpha threshold to filter out the particles that are not transparent enough.

// Use the depthTest property to disable the depth test for the particles. The depth of what being drawn is stored in what we call a "depth buffer". Instead of not testing the depth, we can tell the WebGL not to write particles in the depth buffer.

// Blending - We can use the blending property to set the blending mode of the particles. The blending mode is used to blend the color of the particles with the color of the background. We can use the THREE.AdditiveBlending mode to add the color of the particles to the color of the background.

const particlesMaterial = new THREE.PointsMaterial({
  sizeAttenuation: true,
  color: 0xffffff,
  size: 0.25,
  alphaMap: particlesTexture,
  alphaTest: 0.001,
  transparent: true,
  depthTest: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

// Points

// const particles = new THREE.Points(particlesGeometry, particlesMaterial);

const particles = new THREE.Points(customParticlesGeometry, particlesMaterial);
scene.add(particles);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 13;
scene.add(camera);

// Renderer

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Controls

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const timer = new Timer();

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Access position and color arrays from particle geometry attributes
  const positions = particles.geometry.attributes.position.array;
  const colors = particles.geometry.attributes.color.array;

  // Loop through each particle's position (x,y,z coordinates) in steps of 3
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    // Apply sinusoidal animations to create wave-like movement for each axis
    positions[i] += Math.sin(z + elapsedTime) * 0.01;
    positions[i + 1] += Math.cos(x + elapsedTime) * 0.01;
    positions[i + 2] += Math.sin(y + elapsedTime) * 0.01;

    // Calculate distance of particle from origin for boundary checking
    const distance = Math.sqrt(x * x + y * y + z * z);
    // Scale back particles that exceed boundary radius of 8 units
    if (distance > 8) {
      positions[i] *= 0.95;
      positions[i + 1] *= 0.95;
      positions[i + 2] *= 0.95;
    }

    //Update particle colors based on distance and time for dynamic color effects
    colors[i] = Math.sin(distance + elapsedTime) * 0.5 + 0.5;
    colors[i + 1] = Math.cos(distance - elapsedTime * 0.5) * 0.5 + 0.5;
    colors[i + 2] = Math.sin(elapsedTime * 0.2) * 0.5 + 0.5;
  }

  // Set flags to tell Three.js that position and color attributes need updating
  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.color.needsUpdate = true;

  particles.rotation.y = elapsedTime * 0.5;

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
