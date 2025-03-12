import { RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";

const Ramp = ({ position = [0, 10, 0] }) => {
  const ramp = useGLTF("./Obstacles/hill_obstacle.glb");

  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="trimesh" rotation={[0, -Math.PI * 1.2, 0]}>
        <primitive object={ramp.scene} />
      </RigidBody>
    </group>
  );
};

useGLTF.preload("./Obstacles/hill_obstacle.glb");

export default Ramp;
