import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";

const Domino = ({ position, rotation = [0, 0, 0], model }) => {
  return (
    <RigidBody position={position} rotation={rotation} mass={1.5}>
      <primitive object={model.clone()} rotation-y={-Math.PI/2} scale={0.5} /> 
    </RigidBody>
  );
};

const Dominos = ({
  startPosition = [0, 1, 0],
  count = 20,
  groupRotation = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const { scene: dominoModel } = useGLTF('./Obstacles/domino-com.glb');

  const dominos = useMemo(() => 
    Array(count)
      .fill(null)
      .map((_, i) => (
        <Domino
          key={i}
          model={dominoModel}
          position={[
            startPosition[0] - i * 1.2,
            startPosition[1],
            startPosition[2],
          ]}
          rotation={rotation}
        />
      )),
    [count, startPosition, dominoModel]
  );

  useGLTF.preload('./Obstacles/domino-com.glb');

  return <group rotation={groupRotation}>{dominos}</group>;
};

export default Dominos;
