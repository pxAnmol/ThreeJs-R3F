import { DoubleSide } from "three";

import {
  OrbitControls,
  TransformControls,
  PivotControls,
  Html,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { useRef } from "react";

/* DREI

Drei is a collection of useful helpers and abstractions for R3F. This makes some complex tasks easier to accomplish like adding controls to the scene. We just need to import it and add it to the scene.

OrbitControls - By default, the damping, panning and zooming are enabled, we can disable them by setting the corresponding properties to false.

TransformControls - This is a component that allows us to transform objects in the scene. We can use it to move, rotate and scale objects. It adds a gizmo to the scene that allows us to interact with the object. Now there are two issues with it at first, the first is the position, it is spawned at the center of the scene, we need to place is according to the position of the mesh, for this, we will link this with the mesh via Ref and attaching the ref with the "object" parameter of the controls, and the second issue is that the OrbitControls also moves as we interact with the TransformControls. To fix this, we make the "makeDefault" property of the controls to true, this will make the controls the default controls of the scene and automatically resolve the conflict.
We can tweak the mode property of the TransformControls by changing it to rotation or scale. By default, it is in "translate" mode.

PivotControls - This is a component that allows us to control the pivot point of the object. It is much similar to the TransformControls, but it has a better interface for controlling the pivot point. We can also customize it by our own, like changing the color or changing the size or altering the position relative to the object or changing the thickness of the lines of the gizmo.
We need to set the anchor attribute of the PivotControls accordingly relative to the object to position the gizmo. Generally, the [0, 0, 0] is the center of the object, but we can change it according to our needs. We also need to set the depthTest  property to false, this will make the gizmo visible even when the object is behind other objects. I don't know whether it's intentional or a bug, lol.

Html - Allows us to tie HTML content to any object of your scene. It will be projected to the objects whereabouts automatically. The html content rendered via Drei is in 3D space relative to the mesh, so we can position it accordingly and play around with it.
We use this inside a mesh to attach it to the mesh and the tweak the position attribute of the Html component to position it accordingly relative to the mesh. We can attach a basic class to it using the wrapperClass attribute. It can be hidden behind a geometry using the occlude attribute and passing the refs of the meshes as an array that occlude it.

-MeshReflectorMaterial - This is a material that allows us to create a reflective surface. It is a bit different from the standard material, it has a few properties that we can tweak to get the desired result. We can easily add reflections and blur with it. We can tweak the roughness, metalness, color, and other properties of the material to get the desired result.

*/

const App = () => {
  const boxRef = useRef();

  return (
    <>
      {/* TransformControls */}
      <TransformControls object={boxRef} />
      <mesh ref={boxRef} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      <mesh position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="lightgreen" />
        {/* Html */}
        <Html position={[0, 1, 0]} wrapperClass="label" center occlude={[boxRef]} >
          <p>pxAnmol</p>
        </Html>
      </mesh>
      {/* PivotControls */}
      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        scale={75}
        fixed={true}
      >
        <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={8}>
          <planeGeometry />
          <MeshReflectorMaterial
            color="skyblue"
            side={DoubleSide}
            blur={[0, 0]}
            mixBlur={0.5}
            resolution={1024}
            mirror={0.5}
            reflectorOffset={0.2}
          />
        </mesh>
      </PivotControls>

      {/* OrbitControls */}
      <OrbitControls makeDefault />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />
    </>
  );
};

export default App;
