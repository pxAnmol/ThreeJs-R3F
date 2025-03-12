import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export default function TallStair(props) {
  const { nodes, materials } = useGLTF("./Obstacles/stairs-com.glb");
  return (
    <RigidBody type="fixed" {...props}  colliders="trimesh">
      <group dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Material2.geometry}
          material={materials.Color_C08}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.001}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Material2_1.geometry}
          material={materials.Color_B05}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.001}
        />
      </group>
    </RigidBody>
  );
}

useGLTF.preload("./Obstacles/stairs-com.glb");
