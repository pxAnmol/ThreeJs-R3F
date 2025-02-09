import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {Timer} from 'three/addons/misc/Timer.js'
import Stats from "stats.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {Pane} from 'tweakpane';
import './style.css'

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const gui = new Pane();

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
    '/0/px.jpg',
    '/0/nx.jpg',
    '/0/py.jpg',
    '/0/ny.jpg',
    '/0/pz.jpg',
    '/0/nz.jpg'
]);
environmentMapTexture.encoding = THREE.sRGBEncoding

// Set the environment map to the scene
scene.environment = environmentMapTexture;
scene.background = environmentMapTexture;

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 1
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

// We load a color texture and a normal texture, create a MeshStandardMaterial using those textures, and then loads a 3D model from a GLB file, apply the material to the model, and updates all materials in the scene.

const mapTexture = textureLoader.load('/LeePerrySmith/color.jpg')
mapTexture.encoding = THREE.sRGBEncoding;

const normalTexture = textureLoader.load('/LeePerrySmith/normal.jpg')

const material = new THREE.MeshStandardMaterial({
    map: mapTexture,
    normalMap: normalTexture
})
/*

When we use a ShaderMaterial then we had to re-do the entire pipeline of the renderer. Like we have to manually set and handle the properties like size attenuation in case of particles.
To overcome this, we need to merge the properties of the ShaderMaterial and the MeshStandardMaterial. To do this, we will inject our own custom code within the MeshStandardMaterial using Three.Js hooks which allow us to alter the properties of the material.

Now we can hook the material compilation using the onBeforeCompile hook. This hook is called before the material is compiled. We can use this hook to modify the material's properties or add custom properties.
We will inject our code with native JavaScript with replace(...) method.

Refer to this meshphysical or meshStandardMaterial shader code for more details - https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderLib/meshphysical.glsl.js. This can also be found in the /node_modules/three/src/renderers/shaders/shaderLib

*/
const myUniforms = {
    uTime: {value: 0}
}

/*
 Now we need to alter the MeshDepthMaterial too which is associated with shadows and make the shadows work and case accordingly with the model. The access to the MeshDepthMaterial is quite complicated, but we can override it with the "customDepthMaterial" property.

And then we do the same process of hooking the dpeth material compilation using the onBeforeCompile hook and inject our own code with replace(...) method.
 */

const myDepthMaterial = new THREE.MeshDepthMaterial({
    // The RGBADepthPacking is a hack or way to store more accurate data about the material through the RGBA channels.
    depthPacking: THREE.RGBADepthPacking
});

material.onBeforeCompile = (shader) => {

    // Adding a time uniform to the shader
    shader.uniforms.uTime = myUniforms.uTime

    // Replacing the #include <common> and incorporating our own code with it as it holds the common code for the shader like the defines, uniforms, etc.
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>
            
            // Passing the time uniform to the vertex shader
            
            uniform float uTime;
                            
            // We will add a function here just like we add it before main function in the shader code.
            
            mat2 get2dRotateMatrix(float angle) {
                return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            }
        `
    )

    // Now we need to fix the core shadow issue of the model. It is because the model is not casting the shadow correctly on itself as the normals are not rotating along with the vertex which is associated to case the shadow and work with lights, reflections etc. To fix this, we need to rotate the normals along with the vertex.

    shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
            #include <beginnormal_vertex>
            
            // The normal transformation is associated with the "objectNormal" variable, so we will change it accordingly to the vertex.
            
            float angle = sin(position.y + uTime) * 0.3;
            
            // We will use the get2dRotateMatrix function to rotate the vertex position.
            mat2 rotatedMatrix = get2dRotateMatrix(angle);
            objectNormal.xz = rotatedMatrix * objectNormal.xz;
        `
    )

    // Replacing the #include <begin_vertex> and incorporating our own code with it.
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>
            
            // The transformed is a variable that holds the position of individual vertex, you can use it to modify the vertex position. Behind the scene, it works like this - "vec3 transformed = vec3( position );"
            
            // We will use the rotatedMatrix to rotate the vertex position.
            transformed.xz = rotatedMatrix * transformed.xz;
        `)

}

// Move the vertex of the depth material as same as the vertex of the material to match the position of the shadow cast by the model. This should fix the drop shadow issue.

myDepthMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = myUniforms.uTime

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>
            uniform float uTime;
            
            mat2 get2dRotateMatrix(float angle) {
                return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            }
        `
    )

    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>
            
            float angle = sin(position.y + uTime) * 0.3;
            
            mat2 rotatedMatrix = get2dRotateMatrix(angle);
            transformed.xz = rotatedMatrix * transformed.xz;
        `)
}

gltfLoader.load(
    '/LeePerrySmith/LeePerrySmith.glb',
    (gltf) => {
        const mesh = gltf.scene.children[0]
        mesh.rotation.y = Math.PI * 0.5
        mesh.material = material;
        // Using our own custom depth material to make the shadows work.
        mesh.customDepthMaterial = myDepthMaterial;
        scene.add(mesh)
        updateAllMaterials()
    }
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(25, 25),
    new THREE.MeshStandardMaterial({
        color: '#ffffff',
        side: THREE.DoubleSide
    })
)
plane.rotation.x = -Math.PI;
plane.position.set(0, -5, 5);
scene.add(plane);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 0.8, 0);
scene.add(camera);

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, -2.25)
scene.add(directionalLight)

const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('canvas.webgl'), antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const timer = new Timer();

const tick = () => {
    controls.update();
    const elapsedTime = timer.getElapsed();
    timer.update();

    // Updating the time uniform of the material
    myUniforms.uTime.value = elapsedTime;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);

    stats.update();
}

tick();