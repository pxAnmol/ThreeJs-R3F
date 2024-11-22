import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene();

const sizes = {
    width: 800,
    height: 600
}

const aspectRatio = sizes.width / sizes.height

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/*  CONTROLS

Three.js has a built-in controls that allows us to move the camera around the scene.

1. DeviceOrientationControls - It uses the device orientation to move the camera. It is used in mobile devices. Useful to create immersive universes or VR experiences.

2. FlyControls - It enable moving the camera around the scene using the keyboard or mouse, like you are on a spaceship. We can rotate on all 3 axes and move forward, backward, left, right, up and down.

3. FirstPersonControls - It is more like FlyControls but with a fixes up axis. It doesn't work like in "FPS" games.

4. PointerLockControls - It locks the mouse cursor to the center of the screen and allows us to move the camera around the scene using the keyboard or mouse.

5. OrbitControls - It allows us to rotate the camera around the scene using the mouse. It is the most used control.

6. TrackballControls - It is similar to OrbitControls but it allows us to move the camera around the scene using the keyboard or mouse.

7. TransformControls - It allows us to move the camera around the scene using the keyboard or mouse. It is used to move objects around the scene. It has nothing to do with camera.

8. DragControls - It allows us to move the camera around the scene using the keyboard or mouse. It is used to move objects around the scene. It has nothing to do with camera.

*/

const AxesHelper = new THREE.AxesHelper(2) 
scene.add(AxesHelper)

/* CAMERA

Camera is a abstract class, we are not supposed to use it directly.

1. ArrayCamera - It render the scene from multiple cameras on specific areas of the render.

2. StereoCamera - It render the scene through two cameras that mimic the eyes to create a parallax effect. It is used in VR headsets.

3. CubeCamera - It renders the scene from the 6 sides, each one having different direction. It can render the surrounding for things like environment map, reflection, etc.

*/

/*

4. PERSPECTIVE CAMERA -

It renders the scene with perspective. It is used for 3D games or scenes.

The first parameter is the field of view (in degrees). It is the angle between the top and bottom of the view.

The second parameter is the aspect ratio. It is the width divided by the height.

The third and fourth parameters are called near and far, corresponding to how close and far the camera can see. Any object or part of the object closer than near or further than far will not show up.

Note: Don't use the near and far values on extremes like 0.0001 and 99999999, since it may cause precision issues like z-fighting.

*/

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100);
camera.position.set(0, 0, 3); 

/*

5. ORTHOGRAPHIC CAMERA -

It renders the scene without perspective. It is used for 2D games.

The difference between perspective and orthographic is that the orthographic camera renders the scene without perspective. Objects has the same size regardless of the distance from the camera.

Parameters: Instead of field of view, it uses the size of the camera of how far the camera can see in each direction ( left, right, top, bottom ).

*/

// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRatio,
//     1 * aspectRatio,
//     -1,
//     1,
//     0.1,
//     100
// );
// camera.position.set(2, 2, 2);

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

camera.lookAt(mesh.position);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // mesh.rotation.x = elapsedTime;
    // mesh.rotation.y = elapsedTime;

    // Update controls
    controls.update();
    
    window.requestAnimationFrame(tick);
    renderer.render(scene, camera);
}

tick();
