import * as THREE from 'three';
import gsap from 'gsap';

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene();

const sizes = {
    width: 800,
    height: 600
}
/*

Animating in Three.js is like doing stop motion -->

- Move the object
- Take a picture
- Move the object again
- Take another picture
- Repeat

Most screens run at 60 frames per second, but not always.
Your animation must look the same regardless of the frame rate.

We need to update object ad do a render on each frame.
We are going to do that in a function and call it every frame.
The function is called an "animation loop", and it is done using the window.requestAnimationFrame() method.


The purpose of requestAnimationFrame is to call the function provided on the next frame. We will call the same function on each new frame.
*/


const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


const AxesHelper = new THREE.AxesHelper(2)
// scene.add(AxesHelper)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(1, 1, 3);
scene.add(camera);

camera.lookAt(mesh.position);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height);
// Now move the rendered to the tick function so it will be called on each frame.
// renderer.render(scene, camera);


// ANIMATIONS

/*

Clock

We can use the Clock class that will help us to track time.
Clock is a built-in class in Three.js.
It starts when we create it and we can access the elapsed time.

*/

const clock = new THREE.Clock();

const tick = () => {

    // Get the elapsed time
    const elapsedTime = clock.getElapsedTime();

    // Update objects to animate them
    mesh.position.x = Math.cos(elapsedTime);
    mesh.rotation.x = elapsedTime;
    mesh.position.y = Math.sin(elapsedTime);
    mesh.rotation.y = elapsedTime;
    
    // Call the function on each frame
    window.requestAnimationFrame(tick);

    // Render the scene
    renderer.render(scene, camera);

}


// Call the function once to start the animation loop.
tick();