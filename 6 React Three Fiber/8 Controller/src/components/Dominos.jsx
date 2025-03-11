import { RigidBody } from "@react-three/rapier"

const Domino = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <RigidBody position={position} rotation={rotation} mass={1.5}>
      <mesh>
        <boxGeometry args={[0.2, 2, 1]} />
        <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 50%)`} />
      </mesh>
    </RigidBody>
  )
}

const Dominos = ({ startPosition = [0, 1, 0], count = 20, groupRotation = [0, 0, 0] }) => {
  const dominos = Array(count).fill(null).map((_, i) => (
    <Domino 
      key={i} 
      position={[startPosition[0] + i * 1.2, startPosition[1], startPosition[2]]}
    />
  ))
  
  return <group rotation={groupRotation}>{dominos}</group>
}

export default Dominos
