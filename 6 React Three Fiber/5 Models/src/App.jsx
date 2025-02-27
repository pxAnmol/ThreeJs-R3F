import React, { Suspense } from "react";

import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";

import UseLoader from "./UseLoader";
import UseGLTF from "./UseGLTF";
import GltfComponent from "./GltfComponent";

import { Perf } from "r3f-perf";

/* Loading a model */

/* To load a model, there are generally two basic ways:

1. Using the useLoader hook - This is one of the way to load a model. It takes a loader as an argument and returns the loaded model. We need to specify the type of loader that we want to use. To access the instantiated loader, we pass a function as the third argument to the useLoader hook. It can be used to set the DracoLoader to the loader.

2. Using the useGLTF helper - This is the most effective basic way provided from drei to import the model. We just need to pass the path to the model in this helper and it will load the model for us. For the Draco Loader part, it is already configured in the helper to load it. We don't actually need to do extra work to setup it.

You can switch between the two methods by commenting and uncommenting the respective components below in this component.
*/

/* GLTF -> Component */

// Poimandres provides a GLTF to component converter. It is a tool that converts a GLTF model to a React component. Just upload the GLTF model and it will generate a component for you, now copy it and use it as another JSX component in R3F. This is very useful when we need to inspect the model to see how it is structured and tweak it to our needs.

/* Loading issue */

// When we load a heavy model in the scene, then the performance of the application drops. This is because the model is loaded asynchronously and the main thread is blocked until the model is loaded. To avoid this, we will use the "Suspense" component to load the model asynchronously. The Suspense component is a new feature which allows us to render a fallback UI while we wait for a component to load and display the loaded component when it has finished loading. We can also pass another component as a fallback UI, it can be any 3D geometry or any other model or anything.
// Since it acts on the whole component tree, so we need to wrap our model in a separate component and then wrap that component in the Suspense component.

const App = () => {
  return (
    <>
      {/* Using the useLoader hook */}

      {/* <Suspense fallback={null}>
        <UseLoader />
      </Suspense> */}

      {/* Using the useGLTF helper */}

      <Suspense fallback={null}>
        <UseGLTF />
      </Suspense>

      {/* GLTF -> Component */}

      {/* <Suspense fallback={null}>
        <GltfComponent position-y={-0.8} />
      </Suspense> */}

      <Environment preset="dawn" />

      <OrbitControls
        makeDefault
        minPolarAngle={0}
        minDistance={1}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />

      <Perf position="top-left" />
    </>
  );
};

export default App;
