import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import * as lil from "lil-gui";
import "./style.css";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const gui = new lil.GUI();

// Loading images

const coca_cola = textureLoader.load("coca_cola.jpg");
const cornflakes = textureLoader.load("cornflakes.jpg");
const perfume = textureLoader.load("perfume.jpg");
const poppies = textureLoader.load("poppies.jpg");
const watch = textureLoader.load("watch.jpg");
const nature = textureLoader.load("nature.jpg");
const nature1 = textureLoader.load("nature_1.jpg");
const shoes = textureLoader.load("shoes.jpg");

const images = [
  cornflakes,
  coca_cola,
  perfume,
  nature1,
  poppies,
  watch,
  nature,
  shoes,
];
let currentIndex = 0;
let nextIndex = 1;
let isTransitioning = false;
/*

There are two types of shaders -

1. Vertex Shader: It is a shader that is executed once per vertex. It is used to position each vertex of the geometry. The same vertex shader is used for all vertices of the geometry and the vertex position will be different for each vertex, these types of data are called "attributes". Some data like the position of the mesh will be same, which is called "uniforms".
Once all the vertices are placed in the scene, the GPU will get to know the position of each vertex and then it will connect the vertices with lines to create the geometry. Now it will proceed to color the pixels of the geometry using the fragment shader.

2. Fragment Shader: It is a shader that is executed once per pixel. It is used to color the pixels of the geometry. Fragment is nothing but the pixel. The same fragment shader is used for all pixels of the geometry. With this fragment shader, we send the data to the GPU and it will color the pixels of the geometry.


There are two different types of creating a custom shader.

* ShaderMaterial - This is the most common way to create a custom shader. It is a material that can be used to create a custom shader. It has some code automatically added to the shader codes
* RawShaderMaterial - This is the most basic way to create a custom shader. It is a material that can be used to create a custom shader. It has no code automatically added to the shader codes.

To start with the basics, we will replace the MeshBasicMaterial or the MeshStandardMaterial with a ShaderMaterial and then provide custom codes of the vertex and fragment shaders.

In the shaderMaterial or the RawShaderMaterial, we can use the normal properties like wireframe, side or transparent etc, but it is not possible to use the properties like map, opacity, color etc.
*/

/* GLSL - OpenGL Shading Language */

/* 

* We cannot do console logs or any print statements in the shader code.
* The semicolon is mandatory at the end of the line as it will be treated as a statement.

- Variables

* float - It is a floating point number. It can be a decimal number or an integer. We must need to provide the decimal point in the number. We can do mathematic operations on the float variable such as +, -, *, /.
* int - It is an integer number. It can be a positive or negative number. We can also do mathematic operations on the int variable.
* bool - It is a boolean variable. It can be true or false.
* vec2 - It is a vector of 2 float numbers. It can be used to store the position of a vertex. It cannot be empty. The properties of the vec2 are x and y and can be changed after initialization. Doing operations on a vec2 variable will change the x and y properties of the vec2 variable.
* vec3 - It is mostly same as vec2 but it has 3 float numbers. We can use the x,y and z notation but we will use the r,g,b notation to access the values stored in the vec3 variable which is more adequate to store the colors. It can be partially created using vec2 and a float number.

    Swizzle - It is a way to access the values stored in the vec3 variable and to create a vec2 variable. It's order can be different. For example => vec3 color1 = vec3(1.0, 2.0, 3.0) and creating a vec2 by => vec2 color2 = color1.xy using the x and y values of the vec3 variable or vec color3 = color1.xz using the x and z values of the vec3 variable.



* vec4 - It is mostly same as vec3 but it has 4 float numbers. It's 4th alias is generally termed as 'w' or 'a' and it can used to store the alpha value of the color.

Similarly there are concepts for mat2, mat3, mat4, ivec2, ivec3, ivec4, bvec2, bvec3, bvec4, uvec2, uvec3, uvec4, etc.

We can also create functions in GLSL but it must have a return type.
*/

/* Basics of Vertex Shader */

/* 

* main function - It is the entry point of the shader. It is the first function that is executed. It is the main function of the shader. It is the function that is executed once per vertex and does not have a return type.
* gl_Position - It is a built-in variable that is used to store the position of the vertex. It is a vec4 variable. It is the position of the vertex in the world space. This will return the vec4 of the position of the vertex in the world space.
* position attribute - It is a built-in variable that is used to store the position of the vertex. It is a vec3 variable. It is the position of the vertex in the local space.
* modelMatrix - It is a built-in variable that is used to store the model matrix. It is a mat4 variable. It is the model matrix of the object. It is the transformation matrix of the object relative to the mesh. It is used to transform the object from the local space to the world space.
* viewMatrix - It is used to apply transformations relative to the camera position.
* projectionMatrix - It transforms the geometry from the world space to the clip space. Clip space is a 3D space where the geometry is projected onto a 2D plane.
* modelViewMatrix - It is the combination of the modelMatrix and the viewMatrix. It is used to transform the object from the local space to the world space and then from the world space.

- Uniforms - It is a built-in variable that is used to store the uniform values. It is a vec4 variable. We can use the same uniform value and can be tweaked for each vertex. It is used to store the values that are constant for all the vertices, can be animated and used in both the vertex and fragment shader.
We need to provide the uniform values from the rawShaderMaterial properties as uniforms and specify each uniform value within a object. By this way, we can control the values of the uniforms from the outside of the shader via the javascript code.
*/

/* Basics of Raw Fragment Shader */

/* 

* main function - It is same as the main function of the vertex shader.
* Precision - It is used to specify the precision of the shader and how precise the float value will be. It can be of type lowp, mediump, highp and it is mandatory to specify the precision of the shader.
-highp - It is the highest precision and it is the default precision. It is used for the most precise calculations and is not recommended to use it for performance reasons.
-mediump - It is the medium precision and it is used for most of the calculations. It is recommended to use it for performance reasons.
-lowp - It is the lowest precision and it is used for the least precise calculations. It is not recommended to use it as it can create bugs due to lack in precision.
* gl_FragColor - It is a built-in variable that is used to store the color of the fragment. It is a vec4 variable and is the color of the fragment storing the RGBA values.
*/

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 3, 32, 32),
  new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    // Passing the uniforms to the shader. Add the 'u' in the name of the property to distinguish it in the shader code.
    uniforms: {
      // Controlling the waves in both x and y directions.
      uFrequency: { value: new THREE.Vector2(10, 5) },
      // Passing the constantly updating time value in the tick function
      uTime: { value: 0 },
      // Controlling the speed of the wave
      uWaveSpeed: { value: 1 },
      // Managing the texture
      uTexture: { value: images[currentIndex] },
      uNextTexture: { value: images[nextIndex] },
      uTransition: { value: 0 },
    },
  })
);
// plane.rotation.x = -Math.PI * 0.15;
scene.add(plane);

gui
  .add(plane.material.uniforms.uFrequency.value, "x")
  .min(1)
  .max(20)
  .step(0.1)
  .name("Wave Frequency X");
gui
  .add(plane.material.uniforms.uFrequency.value, "y")
  .min(1)
  .max(20)
  .step(0.1)
  .name("Wave Frequency Y");
  gui
  .add(plane.material.uniforms.uWaveSpeed, 'value')
  .min(0.5)
  .max(5)
  .step(0.1)
  .name('Wave Speed');

const camera = new THREE.PerspectiveCamera(
  32,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 7;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxDistance = 10;
controls.minDistance = 2;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const timer = new Timer();

const tick = () => {
  const elapsedTime = timer.getElapsed();
  controls.update();
  timer.update();

  // Image transition logic
  const transitionDuration = 1;
  const totalDuration = 5;
  const cycleTime = elapsedTime % totalDuration;

  if (cycleTime < transitionDuration) {
    if (!isTransitioning) {
      nextIndex = (currentIndex + 1) % images.length;
      plane.material.uniforms.uNextTexture.value = images[nextIndex];
      isTransitioning = true;
    }
    plane.material.uniforms.uTransition.value = cycleTime / transitionDuration;
  } else {
    if (isTransitioning) {
      currentIndex = nextIndex;
      plane.material.uniforms.uTexture.value = images[currentIndex];
      plane.material.uniforms.uTransition.value = 0;
      isTransitioning = false;
    }
  }

  // Updating the uniform time value.
  plane.material.uniforms.uTime.value = elapsedTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
