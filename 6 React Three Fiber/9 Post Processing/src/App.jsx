import { Environment, OrbitControls, Stars } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Bg from "./Components/Bg";
import Character from "./Components/Character";
import Witch from "./Components/Witch";
import Model from "./Components/Model";
import Effects from "./Effects";

const App = () => {
  return (
    <>
      <Stars
        radius={150}
        depth={75}
        count={3000}
        factor={4}
        saturation={1}
        fade
        speed={1}
      />

      <Environment>
        <Bg />
      </Environment>

      <Model rotation-y={-Math.PI / 4} />
      <Character rotation-y={-Math.PI / 4} position={[1.4, -0.9, -2]} />
      <Witch rotation-y={Math.PI / 4} position={[-1.4, -0.9, 2.6]} />

      {/* Post Processing Effects */}
      <Effects />

      <Perf position="top-left" />
      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};

export default App;
