import { RigidBody } from "@react-three/rapier";

const Bumper = ({ position }) => {
  return (
    <RigidBody position={position} colliders="cuboid">
      <mesh>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshStandardMaterial
          color="#4b9cd3"
          emissive="#4b9cd3"
          emissiveIntensity={2}
        />
      </mesh>
    </RigidBody>
  );
};

export default Bumper;
