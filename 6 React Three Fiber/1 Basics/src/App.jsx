/* eslint-disable */

import * as THREE from "three";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/* 
React Three Fiber is a React renderer for Three.js. It is a lightweight library that provides a React-like API for creating 3D graphics.
The App component is within the Canvas tag and is being rendered within the canvas.
React Three Fiber simplifies canvas setup and scene rendering with predefined properties like Camera and Renderer. It eliminates the need for manual configuration and makes it straightforward to create meshes, geometries, materials etc.
Though there are predefined setting for each component, we can always override them with our own settings using props like position, rotation, scale, etc.
In case of geometry, remember to not update these values too frequently or animate them, as it will cause to rebuilt the whole geometry eventually causing performance issues
*/

const App = () => {
  const boxRef = useRef();
  const groupRef = useRef();

  /* ANIMATION */

  /* The scene is being already drawn frame by frame. We now just need to animate the mesh. For this, useFrame hook is used, this can only be called from a component that is inside the <Canvas> tag, and since our App component is inside the <Canvas> tag, we can use it here. To do this, we need to make the use of useRef hook to create a reference to the mesh.
  To maintain consistent frame rates across the devices we have access to the delta time, which is the time between the current frame and the previous frame as the second parameter of the useFrame hook. 
  */
  useFrame((state, delta) => {
    // The "state" object contains various properties which we can use to alter the scene like we can animate the camera movements using the "camera" and "clock". Check for all the properties by uncommenting the following line, be careful, it will be logged every frame -

    // console.log(state);

    // We need to use the "current" property of the ref to access the mesh.
    boxRef.current.rotation.y += delta * 2;
    groupRef.current.rotation.y += delta;
  });

  return (
    <>
      {/* Using the OrbitControls from drei library to control the camera. Will explore this in detail later. */}
      <OrbitControls />

      {/* We can play with the scale, position or rotation on the mesh easily. The order of the props does not matter. */}

      {/* Group */}
      <group ref={groupRef}>
        {/* Box */}
        <mesh
          ref={boxRef}
          position={[2, 0, 0]}
          scale={1.5}
          rotation={[0, 0, 0]}
        >
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
        {/* Sphere */}
        <mesh position-x={-2} scale={1}>
          <sphereGeometry />
          <meshStandardMaterial color="cyan" />
        </mesh>
      </group>
      {/* Plane/Floor */}
      <mesh scale={8} rotation-x={-Math.PI / 2} position-y={-1}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" side={THREE.DoubleSide} />
      </mesh>

      {/* Lighting */}
      {/* By default, the light is placed just above the center of the scene and is looking at the center of the scene. */}

      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
    </>
  );
};

export default App;
