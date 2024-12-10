import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as lil from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

const gui = new lil.GUI({ width: 200 });

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* LIGHTS

// Lights are used to illuminate the scene. They are used to create shadows and to create a sense of depth. It is instantiated by the Light class and can be used to create different types of lights.
Since it is a Vector3, so we can use the set() and lookAt() methods.

AmbientLight applies a omnidirectional light. The light is emitted from all directions. The props are color and intensity.

DirectionalLight is a light that is emitted from a single direction. The light is emitted from a single direction and is used to create shadows. The props are color, intensity and position.
The distance of the light doesn't matter for now.

HemisphereLight is similar to the AmbientLight but it is used to create a skybox. The props are skyColor and groundColor. 
The skyColor is the color which is emitted from the top of the skybox and the groundColor is the color which is emitted from the bottom of the skybox.

PointLight is a light that is emitted from a single point. It is used to create shadows. The props are color, intensity, fadeDistance and decay.

RectAreaLight is a light that is emitted from a rectangle. It is used to create shadows. The props are color, intensity, width, height and position.
RectAreaLight only works with MeshStandardMaterial and MeshPhysicalMaterial.

SpotLight is like flashlights. It is used to create shadows. The props are color, intensity, distance, angle, penumbra and decay.
To rotate the spotLight, we need to add it's target to the scene and then move it.
*/

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
gui.addColor(ambientLight, "color").name("Ambient Light Color");
gui.add(ambientLight, "intensity", 0.5, 5, 0.1).name("Ambient Light Intensity");

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionalLight);
directionalLight.position.set(1, 0.25, 0);
gui.addColor(directionalLight, "color").name("Directional Light Color");
gui
  .add(directionalLight, "intensity", 0, 2, 0.1)
  .name("Directional Light Intensity");

const HemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(HemisphereLight);
gui.addColor(HemisphereLight, "color").name("Hemisphere Light Color");
gui
  .add(HemisphereLight, "intensity", 0, 5, 0.1)
  .name("Hemisphere Light Intensity");

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
scene.add(pointLight);
pointLight.position.set(-1, 0, 1);
gui.addColor(pointLight, "color").name("Point Light Color");
gui.add(pointLight, "intensity", 0, 5, 0.1).name("Point Light Intensity");

const RectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
scene.add(RectAreaLight);
RectAreaLight.position.set(0, 0, 3);
RectAreaLight.lookAt(new THREE.Vector3(0, 2, 0));
gui.addColor(RectAreaLight, "color").name("Rect Area Light Color");
gui
  .add(RectAreaLight, "intensity", 0, 5, 0.1)
  .name("Rect Area Light Intensity");

const SpotLight = new THREE.SpotLight(
  0x78ff00,
  0.9,
  6,
  Math.PI * 0.1,
  0.5,
  0.2
);
scene.add(SpotLight);
SpotLight.position.set(1, 2, 3);
SpotLight.target.position.set(1, 0, 1);
scene.add(SpotLight.target);
gui.addColor(SpotLight, "color").name("Spot Light Color");
gui.add(SpotLight, "intensity", 0, 5, 0.1).name("Spot Light Intensity");

/* Impact on performance

Lights cost a lot of performance. So, we need to be careful when using them. Try to use as few lights as possible and use them wisely.
Minimal costs are of AmbientLight and HemisphereLight.
Moderate costs are of DirectionalLight and PointLight.
High costs are of RectAreaLight and SpotLight.

*/

/* BAKING

The idea is to bake the lights into the scene. This is done by rendering the scene with the lights and then baking the lights into the scene.
The drawback is that the lights are baked into the scene and cannot be changed anymore and we have to load huge textures.

*/

/*  HELPERS

Helpers are used to assist with positioning the light, they are - 

- DirectionalLightHelper
- HemisphereLightHelper
- PointLightHelper
- RectAreaLightHelper
- SpotLightHelper

The RectAreaLightHelper needs to be imported from three.js-examples.

*/

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);

const hemisphereLightHelper = new THREE.HemisphereLightHelper(HemisphereLight, 0.2);

const pointLightHelper = new THREE.PointLightHelper(pointLight);

const rectAreaLightHelper = new RectAreaLightHelper(RectAreaLight);

const spotLightHelper = new THREE.SpotLightHelper(SpotLight);

// Toggling the lights via the Debug UI

const lightParams = {
  ambientLightEnabled: true,
  pointLightEnabled: true,
  directionalLightEnabled: true,
  hemisphereLightEnabled: true,
  rectAreaLightEnabled: true,
  spotLightEnabled: true,
};

const helperParams = {
  directionalLightHelperEnabled: false,
  hemisphereLightHelperEnabled: false,
  pointLightHelperEnabled: false,
  rectAreaLightHelperEnabled: false,
  spotLightHelperEnabled: false,
};

gui
  .add(lightParams, "ambientLightEnabled")
  .name("Ambient Light")
  .onChange(() => {
    if (lightParams.ambientLightEnabled) {
      scene.add(ambientLight);
    } else {
      scene.remove(ambientLight);
    }
  });

gui
  .add(lightParams, "directionalLightEnabled")
  .name("Directional Light")
  .onChange(() => {
    if (lightParams.directionalLightEnabled) {
      scene.add(directionalLight);
    } else {
      scene.remove(directionalLight);
    }
  });

gui
  .add(lightParams, "hemisphereLightEnabled")
  .name("Hemisphere Light")
  .onChange(() => {
    if (lightParams.hemisphereLightEnabled) {
      scene.add(HemisphereLight);
    } else {
      scene.remove(HemisphereLight);
    }
  });

gui
  .add(lightParams, "pointLightEnabled")
  .name("Point Light")
  .onChange(() => {
    if (lightParams.pointLightEnabled) {
      scene.add(pointLight);
    } else {
      scene.remove(pointLight);
    }
  });

gui
  .add(lightParams, "rectAreaLightEnabled")
  .name("Rect Area Light")
  .onChange(() => {
    if (lightParams.rectAreaLightEnabled) {
      scene.add(RectAreaLight);
    } else {
      scene.remove(RectAreaLight);
    }
  });

gui
  .add(lightParams, "spotLightEnabled")
  .name("Spot Light")
  .onChange(() => {
    if (lightParams.spotLightEnabled) {
      scene.add(SpotLight);
    } else {
      scene.remove(SpotLight);
    }
  });

gui
  .add(helperParams, "directionalLightHelperEnabled")
  .name("Directional Light Helper")
  .onChange(() => {
    if (helperParams.directionalLightHelperEnabled) {
      scene.add(directionalLightHelper);
    } else {
      scene.remove(directionalLightHelper);
    }
  });

gui
  .add(helperParams, "hemisphereLightHelperEnabled")
  .name("Hemisphere Light Helper")
  .onChange(() => {
    if (helperParams.hemisphereLightHelperEnabled) {
      scene.add(hemisphereLightHelper);
    } else {
      scene.remove(hemisphereLightHelper);
    }
  });

gui
  .add(helperParams, "pointLightHelperEnabled")
  .name("Point Light Helper")
  .onChange(() => {
    if (helperParams.pointLightHelperEnabled) {
      scene.add(pointLightHelper);
    } else {
      scene.remove(pointLightHelper);
    }
  });

gui
  .add(helperParams, "rectAreaLightHelperEnabled")
  .name("Rect Area Light Helper")
  .onChange(() => {
    if (helperParams.rectAreaLightHelperEnabled) {
      scene.add(rectAreaLightHelper);
    } else {
      scene.remove(rectAreaLightHelper);
    }
  });

gui
  .add(helperParams, "spotLightHelperEnabled")
  .name("Spot Light Helper")
  .onChange(() => {
    if (helperParams.spotLightHelperEnabled) {
      scene.add(spotLightHelper);
    } else {
      scene.remove(spotLightHelper);
    }
  });

const material = new THREE.MeshStandardMaterial();
material.side = THREE.DoubleSide;
material.roughness = 0.4;
material.metalness = 0.7;

const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
scene.add(box);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), material);
scene.add(sphere);
sphere.position.set(-2, 0, 0);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.2, 32, 64),
  material
);
scene.add(torus);
torus.position.set(2, 0, 0);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
scene.add(plane);
plane.position.set(0, -1, 0);
plane.scale.set(7, 7, 7);
plane.rotation.set(-Math.PI / 2, 0, 0);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight
);
camera.position.set(1, 2, 7);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.x = 0.15 * elapsedTime;
  box.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  sphere.rotation.y = 0.1 * elapsedTime;
  box.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
