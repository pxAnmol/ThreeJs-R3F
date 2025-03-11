import { Stars } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import Player from "./Player";

import Balls from "./components/Balls";
import Bumper from "./components/Bumper";
import Dominos from "./components/Dominos";
import Gravity from "./components/Gravity";
import Stairs from "./components/Stairs";
import Tornado from "./components/Tornado";

const App = () => {
  return (
    <Physics>
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0.6}
        fade
        speed={1.5}
      />

      <Player position={[0, 2, 0]} friction={1} restitution={0.1} />

      {/* Rigid Walls */}

      <RigidBody type="fixed" restitution={0.7} friction={1}>
        {/* Floor */}
        <CuboidCollider args={[30, 0.1, 30]} position={[0, -0.1, 0]} />

        {/* Left and Right Walls */}
        <CuboidCollider args={[0.1, 15, 30]} position={[-30, 15, 0]} />
        <CuboidCollider args={[0.1, 15, 30]} position={[30, 15, 0]} />

        {/* Front and Back Walls */}
        <CuboidCollider args={[30, 15, 0.1]} position={[0, 15, -30]} />
        <CuboidCollider args={[30, 15, 0.1]} position={[0, 15, 30]} />
      </RigidBody>

      <Dominos
        startPosition={[-15, 1, 15]}
        count={15}
        groupRotation={[0, Math.PI / 4, 0]}
      />
      <Dominos startPosition={[5, 1, -20]} count={20} />
      <Dominos startPosition={[-20, 1, 10]} count={12} />
      <Stairs rotation={[0, Math.PI / 4, 0]} />
      <Balls position={[-15, 1, -5]} />

      <Tornado />
      <Gravity />
      {Array(10)
        .fill(null)
        .map((_, i) => (
          <Bumper key={i} position={[Math.sin(i) * 10, 2, Math.cos(i) * 10]} />
        ))}

      <Perf position="top-left" />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
    </Physics>
  );
};

export default App;
