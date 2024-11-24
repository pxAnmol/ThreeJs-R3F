import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import gsap from 'gsap';


const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/*  DEBUG UI

We need to be able to tweak and debug easily that will help us finding the perfect color, speed, quantity etc.

We can use a library called lil-gui to create a debug UI.

*/

// Instantiate the GUI
const gui = new dat.GUI({width: 300});
gui.close();

/*

There are different types of elements we can add to the GUI:

- Range: for numbers with a range
- Color: for colors with various formats
- Text: for text
- Checkbox: for booleans
- Select: for selecting an option from a list
- Button: for executing a function
- Folder: for grouping elements

To add an element to the GUI, we need to call the add method on the GUI instance and pass the element as an argument.

To change the color, we need to call the addColor method on the GUI instance and pass the color as an argument.

The parameters are:
- first parameter: the name of the element or object
- second parameter: the property of the object you want to tweak
- third parameter: the minimum value ( we can also use the min method of the GUI instance to set the minimum value )
- fourth parameter: the maximum value ( we can also use the max method of the GUI instance to set the maximum value )  
- fifth parameter: the step or precision ( we can also use the step method of the GUI instance to set the step )

We can use the name method of the GUI instance to set the name of the element.
*/

const geometry = new THREE.BoxGeometry(1, 1, 1,2 , 2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// DEBUGGING THE MESH

gui.add(mesh.position, 'x', -3, 3, 0.01).name('x position');
gui.add(mesh.position, 'y', -3, 3, 0.01).name('y position');
gui.add(mesh.position, 'z', -3, 3, 0.01).name('z position');

gui.add(mesh, 'visible').name('Visibility');
gui.add(mesh.material, 'wireframe').name('Wireframe');
gui.addColor(mesh.material, 'color').name('Color');

/* Playing around with functions in the GUI -

To trigger a function, we need to store it in an object. We can use the parameters of the function to pass data to the function.

*/

// Create an object to hold our functions
const debugObject = {
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
    }
}

// Add the function to the GUI
gui.add(debugObject, 'spin').name('Spin Mesh');


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100);
camera.position.set(0, 0, 3); 

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

camera.lookAt(mesh.position);

const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
    controls.update();
    window.requestAnimationFrame(tick);
    renderer.render(scene, camera);
}

tick();
