import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './style.css'

// Loading Textures
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// Loading Matcaps
const matcapTexture1 = textureLoader.load('/textures/matcaps/1.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/2.png')
const matcapTexture3 = textureLoader.load('/textures/matcaps/3.png')
const matcapTexture4 = textureLoader.load('/textures/matcaps/4.png')
const matcapTexture5 = textureLoader.load('/textures/matcaps/5.png')
const matcapTexture6 = textureLoader.load('/textures/matcaps/6.png')
const matcapTexture7 = textureLoader.load('/textures/matcaps/7.png')
const matcapTexture8 = textureLoader.load('/textures/matcaps/8.png')

const gradientMap = textureLoader.load('/textures/gradients/3.jpg')


// Loading Cube Textures
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/2/px.jpg',
    '/textures/environmentMaps/2/nx.jpg',
    '/textures/environmentMaps/2/py.jpg',
    '/textures/environmentMaps/2/ny.jpg',
    '/textures/environmentMaps/2/pz.jpg',
    '/textures/environmentMaps/2/nz.jpg',
])



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

/*  MATERIALS

Materials are used to put color on each visible pixel of the geometries. The algorithms are written in programs called the shaders. We don't need to write the shaders by hand, we can use the ones that are already written for us.

*/


// MESH BASIC MATERIAL

// const material = new THREE.MeshBasicMaterial({map: doorColorTexture});
// material.color.set('red');
// material.side = THREE.DoubleSide;
// material.wireframe = true;
// material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;


// MESH NORMAL MATERIAL

// Normal are used for lighting, reflection and refraction.

// A special property in this material is 'flatShading'. It is used to make the normals of the geometry flat. It is useful when we want to create a 3D object from a 2D image.

// const material = new THREE.MeshNormalMaterial()
// material.side = THREE.DoubleSide;
// material.flatShading = true;


// MESH MATCAP MATERIAL

// MeshMatcapMaterial will display the color by using the normals as the reference for the color.

// const material = new THREE.MeshMatcapMaterial({
//     matcap: matcapTexture2
// });


// MESH LAMBERT MATERIAL

// This material is used for lighting. It is used to create a more realistic lighting effect.

// const material = new THREE.MeshLambertMaterial();


// MESH PHONG MATERIAL

// It's kinda similar to MeshLambertMaterial but it is more expensive to calculate.

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100;

// MESH TOON MATERIAL

// This material is used to create a cartoon-like effect.

// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientMap;

// MESH STANDARD MATERIAL

// This material is used to create a more realistic lighting effect.

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.75;
// material.roughness = 1
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.side = THREE.DoubleSide;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;


// MESH PHYSICAL MATERIAL

// This is as same as MeshStandardMaterial but with support of clear coat effect.

// MESH POINT MATERIAL

// This material is used to create a point cloud effect.

// MESH SHADER MATERIAL

// This material is used to create a custom shader.



/*  ENVIRONMENT MAP

The environment map is the image of surrounding of the scene. It can be used for reflection or refraction but also for general lighting. Environment maps are supported by multiple materials but it's more relevant for MeshStandardMaterial.

To implement environment map, we first set the MeshStandardMaterial.

ThreeJs only supports cube texture as environment map.
To load the environment map, we need to use the CubeTextureLoader.

The environment map creates a reflection of the scene on the surface of the object.

*/

const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 0;
material.side = THREE.DoubleSide;
material.envMap = environmentMapTexture;



const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 64, 64),
    material
);
sphere.position.x = -1.5;
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    material
);
plane.position.x = 1.5;
// const torus = new THREE.Mesh(
//     new THREE.TorusGeometry(0.4, 0.2, 16, 32),
//     material
// );
// torus.position.x = 1.5;

scene.add(sphere, plane);


// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 10);
const pointLight = new THREE.PointLight(0xffffff, 7);
pointLight.position.set(1, 1, 3);
scene.add(ambientLight, pointLight);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100);
camera.position.set(0, 0, 3); 

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

// camera.lookAt(mesh.position);

const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {

    const elapsedTime = 0.3 * clock.getElapsedTime();
    // sphere.rotation.y = elapsedTime;
    plane.rotation.y = elapsedTime;
    // torus.rotation.y = elapsedTime;

    controls.update();
    window.requestAnimationFrame(tick);
    renderer.render(scene, camera);
}

tick();
