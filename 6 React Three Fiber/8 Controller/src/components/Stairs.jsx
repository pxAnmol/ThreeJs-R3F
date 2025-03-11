import { RigidBody } from "@react-three/rapier"

const Stairs = ({ rotation = [0, 0, 0] }) => {
  const steps = 8
  const stairs = Array(steps).fill(null).map((_, i) => (
    <RigidBody key={i} type="fixed" position={[i * 2, i * 1, 0]}>
      <mesh>
        <boxGeometry args={[2, 0.5, 2]} />
        <meshStandardMaterial color={`hsl(${i * 30}, 70%, 50%)`} />
      </mesh>
    </RigidBody>
  ))
  
  return <group rotation={rotation}>{stairs}</group>
}

export default Stairs
