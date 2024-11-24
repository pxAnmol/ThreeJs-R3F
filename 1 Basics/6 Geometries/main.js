import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

/*  GEOMETRY

A geometry is composed of vertices (points) and faces that connect the vertices. It can be used to create meshes.
It can store data like position, color, normal, uv, etc.

All the geometries inherit from the BufferGeometry class.

There are many types of geometries:

- BoxGeometry (https://threejs.org/docs/#api/en/geometries/BoxGeometry)
- SphereGeometry (https://threejs.org/docs/#api/en/geometries/SphereGeometry)
- PlaneGeometry (https://threejs.org/docs/#api/en/geometries/PlaneGeometry)
- CylinderGeometry (https://threejs.org/docs/#api/en/geometries/CylinderGeometry)
- ConeGeometry (https://threejs.org/docs/#api/en/geometries/ConeGeometry)
- CircleGeometry (https://threejs.org/docs/#api/en/geometries/CircleGeometry)
- RingGeometry (https://threejs.org/docs/#api/en/geometries/RingGeometry)
- TorusGeometry (https://threejs.org/docs/#api/en/geometries/TorusGeometry)
- TorusKnotGeometry (https://threejs.org/docs/#api/en/geometries/TorusKnotGeometry)
- DoodecahedronGeometry (https://threejs.org/docs/#api/en/geometries/DodecahedronGeometry)
- TextGeometry (https://threejs.org/docs/#api/en/geometries/TextGeometry)- and many more...

*/


/*
Now we will focus on BoxGeometry.

The parameters of the BoxGeometry are:
- width: width of the box
- height: height of the box
- depth: depth of the box
- widthSegments: number of segments in the width
- heightSegments: number of segments in the height
- depthSegments: number of segments in the depth

*/
const geometry = new THREE.BoxGeometry(1, 1, 1,2 , 2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
