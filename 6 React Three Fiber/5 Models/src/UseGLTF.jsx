import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";

const UseGLTF = () => {

  // The useGLTF helper is a helper provided by drei to import the model. We just need to pass the path to the model in this helper and it will load the model for us. For the Draco Loader part, it is already configured in the helper to load it. We don't actually need to do extra work to setup it.

  const model = useGLTF("./models/medieval_fantasy_book/scene.gltf");

  /* Animation of the model */

  /* With the use of another drei helper "useAnimations", we can animate the model. It takes the animations and the scene as arguments and returns an object with the AnimationAction already setup. We can use this object to play the animation. This helper will take care of the animation setup and running it on every frame, we don't need to do anything else. */
  const animation = useAnimations(model.animations, model.scene);

  // Now we play the animation when the model is loaded. For this, we use the useEffect hook, which will run when the model is loaded. We can use the useEffect hook to play the animation when the model is loaded.

  useEffect(() => {
    const action = animation.actions["The Life"];
    if (action) {
      action.play();
      return () => action.stop();
    }
  }, [animation]);

  // We can use the preload attribute to preload the model. It will load the model before the scene is rendered. It is useful when we have a lot of models to load and want to immediately place the model in the scene.

  return (
    <>
      <primitive object={model.scene} scale={0.05} dispose={null} />
    </>
  );
};

useGLTF.preload("./models/medieval_fantasy_book/scene.gltf");

export default UseGLTF;
