import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { useControls } from "leva";
import { Perf } from "r3f-perf";

const App = () => {
  const cubeRef = useRef();

  /*
  Leva docs - https://github.com/pmndrs/leva?tab=readme-ov-file#documentation

  Tweaking a value via the GUI will result in the component re-rendering because the data value is being changed. We can either use the default way of exporting the variables of the controls or we can use the object way.
  To create folders, pass the name of the folder as the first argument and the controls object as the second argument in the useControls hook and to create multiple folders, we need to reuse the useControls hook.

  We will the Perf component from the r3f-perf library to see the performance of the app and monitor it. It has a position prop to set the position of the performance monitor. Here is the link to the detailed docs for it - https://github.com/utsuboco/r3f-perf?tab=readme-ov-file#r3f-perf
  */

  const { position, color, scale, rotation } = useControls("General", {
    position: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.1,
      joystick: "invertY",
      label: "Position",
    },
    color: { value: "#ff0000", label: "Color" },
    scale: { value: 1, min: 0.1, max: 5, step: 0.1, label: "Scale" },
    rotation: {
      value: 0,
      min: 0,
      max: Math.PI * 2,
      step: 0.01,
      label: "Rotation",
    },
  });

  const { animate, speed } = useControls("Animation", {
    animate: { value: false, label: "Animate" },
    speed: { value: 1, min: 0.1, max: 5, step: 0.1, label: "Speed" },
  });

  useFrame((state, delta) => {
    if (animate) {
      cubeRef.current.rotation.y += delta * speed;
    }
  });

  const { wireframe, metalness, roughness } = useControls("Material", {
    wireframe: { value: false, label: "Wireframe" },
    metalness: { value: 0, min: 0, max: 1, step: 0.1, label: "Metalness" },
    roughness: { value: 1, min: 0, max: 1, step: 0.1, label: "Roughness" },
  });

  const { lightIntensity } = useControls("Lighting", {
    lightIntensity: {
      value: 1,
      min: 0,
      max: 10,
      step: 0.1,
      label: "Intensity",
    },
  });

  return (
    <>
      <mesh
        ref={cubeRef}
        position={[position.x, position.y, position.z]}
        scale={scale}
        rotation-y={rotation}
      >
        <boxGeometry />
        <meshStandardMaterial
          color={color}
          wireframe={wireframe}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>

      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={lightIntensity} />

      <Perf
        position="top-left"
        minimal={false}
        matrixUpdate={true}
        deepAnalyze={true}
      />

      <OrbitControls makeDefault />
    </>
  );
};

export default App;
