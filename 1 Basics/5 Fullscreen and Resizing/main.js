import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene();

// To get the viewport size, we can use the window object
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/*  PIXEL RATIO

We might see a blurry render or a stair like effect because of the pixel ratio.
The pixel ratio corresponds to how many physical pixel we have on our screen for one pixel unit on the software part.

A pixel ratio of 2 means that we have 4 times more pixels to render, similarly a pixel ratio of 3 means that we have 9 times more pixels to render.

Highest pixel ratio are usually on weakest devices like phones.

*/

//  Handle resizing
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    // We need to set the pixel ratio according to the device pixel ratio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Handle fullscreen
window.addEventListener('keydown', (event) => {
    if(event.key === 'f') {
        if(!document.fullscreenElement) {
            canvas.requestFullscreen()
        }
        else {
            document.exitFullscreen()
        }
    }
})

const aspectRatio = sizes.width / sizes.height

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const AxesHelper = new THREE.AxesHelper(2) 
// scene.add(AxesHelper)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100);
camera.position.set(0, 0, 3); 

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

camera.lookAt(mesh.position);

const renderer = new THREE.WebGLRenderer({canvas})

renderer.setSize(sizes.width, sizes.height);

// Set the pixel ratio (for mobile devices)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();
    
    window.requestAnimationFrame(tick);
    renderer.render(scene, camera);
}

tick();
