import { Stars, Environment } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import Player from "./Player";
import { useFrame } from "@react-three/fiber";

import Floor from "./Floor";
import Ramp from "./Obstacles/Ramp";
import Dominos from "./Obstacles/Dominos";
import Stairs from "./Obstacles/Stairs";
import Tornado from "./Obstacles/Tornado";
import Balls from "./Obstacles/Balls";
import TallStair from "./Obstacles/TallStairs";

const App = () => {
  useFrame((state) => {
    const floor = state.scene.getObjectByName("floor");
    if (floor) {
      floor.material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <>
      <Physics>
        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <Player position={[0, 3, 0]} friction={1} restitution={0.1} />

        {/* Floor */}
        <Floor />

        <RigidBody type="fixed" restitution={0.7} friction={1}>
          {/* Left and Right Walls */}
          <CuboidCollider args={[0.1, 15, 30]} position={[-30, 15, 0]} />
          <CuboidCollider args={[0.1, 15, 30]} position={[30, 15, 0]} />
          {/* Front and Back Walls */}
          <CuboidCollider args={[30, 15, 0.1]} position={[0, 15, -30]} />
          <CuboidCollider args={[30, 15, 0.1]} position={[0, 15, 30]} />
        </RigidBody>

        <Dominos startPosition={[-15, 0.5, 3]} groupRotation={[0, Math.PI * 1.25, 0]} rotation={[0, Math.PI, 0]} count={20} />

        <Tornado position={[10, 0, 15]} />
        <Stairs position={[15, 0.5, 20]} rotation={[0, -Math.PI * 1.25, 0]} />

        <Ramp position={[-7, 0, -7]} />

        <TallStair
          scale={1.25}
          position={[-12, 0, 12]}
          rotation={[0, -Math.PI / 1.5, 0]}
        />

        <Balls />

        <Perf position="top-left" />
        <Environment preset="dawn" resolution={256} blur={0.8} />
      </Physics>
    </>
  );
};

export default App;
