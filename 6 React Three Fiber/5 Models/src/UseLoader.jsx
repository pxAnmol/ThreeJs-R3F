import { useRef } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { useFrame, useLoader } from "@react-three/fiber";

const UseLoader = () => {
  const ref = useRef();

  // R3F provides a useLoader hook that helps to load models. It takes a loader as an argument and returns the loaded model. We need to specify the type of loader that we want to use. To access the instantiated loader, we pass a function as the third argument to the useLoader hook. It can be used to set the DracoLoader to the loader.

  const model = useLoader(
    GLTFLoader,
    "./models/pony_cartoon/scene.gltf",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);
    }
  );

  // After loading the model, to place it inside the canvas, we need to use the "primitive", which is a holder for what we put in it. It's a container supported by R3F that will handle and display what we put inside it. We just need to pass the model.scene to the object attribute.

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.3;
  });

  return (
    <>
      <primitive ref={ref} object={model.scene} position-y={-0.8} />
    </>
  );
};

export default UseLoader;
