import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"

const TORNADO_COUNT = 20
const RADIUS = 5
const BASE_HEIGHT = 5

const Tornado = () => {
  const objects = new Array(TORNADO_COUNT)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    objects.forEach((obj, i) => {
      if (!obj) return
      
      const angle = time * 2 + i
      const height = BASE_HEIGHT + Math.sin(time + i) * 10
      
      obj.setNextKinematicTranslation({
        x: Math.cos(angle) * RADIUS,
        y: height,
        z: Math.sin(angle) * RADIUS
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
      <mesh>
        <tetrahedronGeometry args={[1]} />
        <meshNormalMaterial wireframe />
      </mesh>
    </RigidBody>
  ))
}

export default Tornado
