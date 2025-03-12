import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useState, useRef } from "react";

const BALL_CONFIGS = {
  baseball: { scale: 1, mass: 0.8 },
  beachBall: { scale: 0.7, mass: 0.1 },
  cricketBall: { scale: 1.25, mass: 0.8 },
  ribbonBall: { scale: 0.05, mass: 0.3 },
  tennisBall: { scale: 6, mass: 0.4 },
};

const BALLS_PER_TYPE = 5;

const Balls = () => {
  const [balls, setBalls] = useState([]);
  const models = useRef({
    baseball: useGLTF("./Obstacles/baseball-com.glb"),
    beachBall: useGLTF("./Obstacles/beach_ball-com.glb"),
    cricketBall: useGLTF("./Obstacles/cricket_ball-com.glb"),
    ribbonBall: useGLTF("./Obstacles/ribbon_ball-com.glb"),
    tennisBall: useGLTF("./Obstacles/tennis_ball-com.glb"),
  }).current;

  useEffect(() => {
    const initialBalls = Object.keys(BALL_CONFIGS).flatMap((ballType) =>
      Array.from({ length: BALLS_PER_TYPE }, (_, index) => ({
        id: `${ballType}-${index}`,
        type: ballType,
        position: [
          (index - 2) * 8,
          10 + Math.floor(index / 5) * 2,
          (Object.keys(BALL_CONFIGS).indexOf(ballType) - 2) * 8,
        ],
      }))
    );

    setBalls(initialBalls);
  }, []);

  return balls.map((ball) => (
    <RigidBody
      key={ball.id}
      type="dynamic"
      colliders="hull"
      position={ball.position}
      mass={BALL_CONFIGS[ball.type].mass}
      restitution={0.3}
      friction={0.5}
    >
      <primitive
        object={models[ball.type].scene.clone()}
        scale={BALL_CONFIGS[ball.type].scale}
      />
    </RigidBody>
  ));
};

export default Balls;

useGLTF.preload([
  "./Obstacles/baseball-com.glb",
  "./Obstacles/beach_ball-com.glb",
  "./Obstacles/cricket_ball-com.glb",
  "./Obstacles/ribbon_ball-com.glb",
  "./Obstacles/tennis_ball-com.glb",
]);
