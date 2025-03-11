import { RigidBody } from "@react-three/rapier";

const Gravity = () => {
  const CUBE_COUNT = 15;

  return (
    <group>
      {Array(CUBE_COUNT)
        .fill(null)
        .map((_, i) => (
          <RigidBody
            key={i}
            position={[
              Math.random() * 40 - 20,
              Math.random() * 20 + 10,
              Math.random() * 40 - 20,
            ]}
            colliders="hull"
          >
            <mesh>
              <octahedronGeometry args={[Math.random() + 0.2]} />
              <meshPhongMaterial
                color={`hsl(${Math.random() * 360}, 100%, 50%)`}
                shininess={100}
              />
            </mesh>
          </RigidBody>
        ))}
    </group>
  );
};

export default Gravity;
