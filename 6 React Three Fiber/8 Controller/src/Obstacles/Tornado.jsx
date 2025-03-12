import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"

const TORNADO_COUNT = 20
const RADIUS = 3
const BASE_HEIGHT = 5

const tetrahedronGeometry = new THREE.TetrahedronGeometry(1)

const Tornado = ({ position = [0, 0, 0] }) => {
  const objects = new Array(TORNADO_COUNT)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    objects.forEach((obj, i) => {
      if (!obj) return
      
      const angle = time * 2 + i
      const height = BASE_HEIGHT + Math.sin(time + i) * 10
      
      obj.setNextKinematicTranslation({
        x: Math.cos(angle) * RADIUS + position[0],
        y: height + position[1],
        z: Math.sin(angle) * RADIUS + position[2]
      })
      
      obj.setNextKinematicRotation({
        x: time * 2,
        y: time * 3,
        z: time * 4
      })
    })
  })

  return [...Array(TORNADO_COUNT)].map((_, i) => (
    <RigidBody
      key={i}
      ref={el => objects[i] = el}
      type="kinematicPosition"
    >
      <mesh geometry={tetrahedronGeometry}>
        <meshNormalMaterial wireframe />
      </mesh>
    </RigidBody>
  ))
}

export default Tornado
