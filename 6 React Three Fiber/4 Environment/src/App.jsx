import * as THREE from "three";

import {
  BakeShadows,
  OrbitControls,
  Sky,
  Environment,
  SoftShadows,
  useHelper,
  Float,
} from "@react-three/drei";
import { useRef } from "react";
import { Perf } from "r3f-perf";
import { useFrame } from "@react-three/fiber";

/* There are much more things to explore in drei, such as Stage which is another helper from Drei that provided a pre-defined scenario to quickly setup the scene, as comes with shadows, lighting and other things already configured, we can though tweak it afterwards, more info here - https://github.com/pmndrs/drei/blob/aa0f742e1a52d4f6565cfcb9503f4729841af475/docs/staging/stage.mdx#L4  */

/* Shadows */

/* The core concept of the shadow remains the same as of THREE.Js, the rendering and the performance is affected with increase in the complexity of shadows. By default, the shadow map resolution of the renderer is low in order to maintain performance. To alter the shadow map resolution, we change the "shadow-mapSize" property of the light to a different value.
We can control the near, far, top, bottom, left, and right properties of the shadow map by the "shadow-camera-{property}" property of the corresponding light. This is useful to manage the performance cost of shadows.

There are other types of shadows such as Contact Shadows and Accumulative Shadows. These are a bit complex to implement and do cost more performance in order to create much better shadows.

Soft Shadows - The default shadow map is hard, but we can make it soft by using a technique called Percent Closer Soft Shadows (PCSS). This technique is used to soften the shadows by blurring the edges of the shadows by blurring the shadow according to the distance of the shadow map texture with the distance from the surface casting the shadow. For this, we have a SoftShadows helper from drei. This works just as another component and we pass the parameters to tweak it.

*/

const App = () => {
  const boxRef = useRef();
  const dirLightRef = useRef();

  /* Helper using useHelper from drei  */

  // useHelper is not always for the lights, it could be used for other helpers too like cameraHelper. The first parameter in the useHelper is the reference to the object that you want to create a helper for and the second parameter is the type of helper you want to create. In this case, it's a DirectionalLightHelper imported from the three.js library. The third parameter is the size of the helper.

  useHelper(dirLightRef, THREE.DirectionalLightHelper, 1);

  useFrame((state, delta) => {
    boxRef.current.rotation.y += delta;
  });

  return (
    <>
      <Float
        speed={5}
        rotationIntensity={1}
        floatIntensity={2}
        position={[0, 1, 0]}
      >
        <mesh ref={boxRef} castShadow>
          <boxGeometry />
          <meshStandardMaterial color="deeppink" />
        </mesh>
      </Float>

      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.51, 0]}
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color="#a3a3a3"
          side={THREE.DoubleSide}
          metalness={0}
          roughness={0.8}
        />
      </mesh>

      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        shadow-mapSize={[1024, 1024]}
        ref={dirLightRef}
        position={[2, 2, 2]}
        intensity={1.5}
        color="white"
      />

      {/* Baking shadows

      If the scene is static, but we need to calculate shadows for it, we can use the BakeShadows helper from drei. This helper is used to bake the shadows for the whole scene. This will render shadows only one time and then it will be used for all the frames. This is useful for static objects that don't need to be updated every frame.
      Enable the below BakeShadows helper component to bake the shadows for the whole scene on the first frame and then use it for all the frames.

      */}

      {/* <BakeShadows /> */}

      {/* <SoftShadows
        focus={1}
        samples={17}
        rings={11}
        distance={15}
        angle={0.3}
      /> */}

      {/* Environment Maps */}

      {/* Drei provides a Environment helper component which helps to set either the Cube Textures or the HDRI as the environment background and also as the light source. Enable the background property of the Environment component to display the HDRI as the background on the scene.
      For the cube textures, we need to pass the path to the cube texture files to the files property of the Environment component in the form of an array. And for HDRIs, we need to just pass the path to the HDRI file to the files property.
      When we are using environment maps, we get a feel like the objects are floating in space. This is because the environment map is a light source and the objects are being lit by the environment map. We can break this illusion by adding the "ground" attribute to the Environment component and setting it to true. This will make the environment map a ground and the objects will be placed on the ground. We further need to play with the height, radius or scale properties of the ground to position the objects properly. There will be some issues with the map in order to create the ground, but can be controlled to some extent using the properties of the ground attribute.
      Drei provides some out of the box presets for the Environment component. We can use the preset property of the Environment component to use one of the presets. We don't need to download the corresponding HDRIs for these presets, they are internally handled by Drei itself. They are as follows:

      apartment: 'lebombo_1k.hdr'
      city: 'potsdamer_platz_1k.hdr'
      dawn: 'kiara_1_dawn_1k.hdr'
      forest: 'forest_slope_1k.hdr'
      lobby: 'st_fagans_interior_1k.hdr'
      night: 'dikhololo_night_1k.hdr'
      park: 'rooitou_park_1k.hdr'
      studio: 'studio_small_03_1k.hdr'
      sunset: 'venice_sunset_1k.hdr'
      warehouse: 'empty_warehouse_01_1k.hdr'

      More info about the Environment is here - https://github.com/pmndrs/drei/blob/aa0f742e1a52d4f6565cfcb9503f4729841af475/docs/staging/environment.mdx#L29

      */}

      {/* <Environment background files={"sky.hdr"} /> */}
      <Environment background preset="dawn" />

      {/* SKY - Making sky in R3F is pretty simple and easy as compared to Three.Js. We can use the Sky component from drei to create a sky. This component is used to create a skybox.
      This is physically based and we can control the sky by passing the parameters to the Sky component such as turbidity, rayleigh, mieCoefficient, azimuth, distance, sunPosition, inclination etc.
      */}

      {/* <Sky /> */}

      <Perf position="top-left" gl={true} />
      <OrbitControls />
    </>
  );
};

export default App;
