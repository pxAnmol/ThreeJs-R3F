import { RigidBody } from "@react-three/rapier"

const Balls = ({ position = [0, 10, 0] }) => {
  return (
    <group position={position}>
      <RigidBody type="fixed" rotation={[0.25, -Math.PI/8, 0]}>
        <mesh>
          <boxGeometry args={[8, 0.2, 12]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      </RigidBody>
      
      {Array(10).fill(null).map((_, i) => (
        <RigidBody restitution={1} colliders="ball" key={i} position={[0, 2 + i * 0.5, 5]}>
          <mesh>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial color={`hsl(${i * 36}, 100%, 50%)`} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  )
}

export default Balls