import * as THREE from 'three'
import { RigidBody } from "@react-three/rapier"
import { useMemo } from 'react'


const Stairs = ({ rotation = [0, 0, 0], position = [0, 0, 0] }) => {
  const stairGeometry = useMemo(() => new THREE.BoxGeometry(2.5, 0.5, 2.5), [])
  const steps = 8
  const stairs = Array(steps).fill(null).map((_, i) => (
    <RigidBody key={i} type="fixed" position={[i * 2, i * 1, 0]}>
      <mesh>
      <boxGeometry args={[stairGeometry.parameters.width, stairGeometry.parameters.height, stairGeometry.parameters.depth]} />
        <meshStandardMaterial color={`hsl(${i * 30}, 70%, 50%)`} />
      </mesh>
    </RigidBody>
  ))
  
  return <group position={position} rotation={rotation}>{stairs}</group>
}

export default Stairs
