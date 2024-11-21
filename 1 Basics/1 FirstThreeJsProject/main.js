import * as THREE from 'three';

const canvas = document.querySelector('.webgl')
/*
We need 4 elements to create a minimal scene --
- A scene that will contain all the objects
- Some objects
- A camera
- A renderer
*/

// Scene
const scene = new THREE.Scene();

// Mesh
// A mesh is a combination of a geometry and a material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const mesh = new THREE.Mesh(geometry, material);

// Add the mesh to the scene
scene.add(mesh);

/*
Camera
The first parameter is the field of view (in degrees)
The second parameter is the aspect ratio (width / height)
*/

// Sizes which will be used to set the camera's aspect ratio
const sizes = {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// Move the camera back from the origin
camera.position.z = 2;

// Add the camera to the scene
scene.add(camera);


/*
Renderer
The renderer will take the scene and the camera and render the scene from the camera's point of view.
The result is drawn into a canvas, which is a HTML element in which you can draw graphics.
ThreeJs will use WebGL to draw the render inside the canvas, under the hood.
*/


const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

// Resize the renderer to fit the canvas
renderer.setSize(sizes.width, sizes.height);

// First render
// The renderer will render the scene from the camera's point of view

renderer.render(scene, camera);