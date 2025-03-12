import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Player = (props) => {
  const player = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const ball = useGLTF("./ball-com.glb");

  const [smoothCameraPos] = useState(() => new THREE.Vector3(0, 2, 6));
  const [smoothCameraTarget] = useState(() => new THREE.Vector3());

  const JUMP_FORCE = 12;
  const MOVE_FORCE = 0.5;
  const CAMERA_LAG = 5;
  const TORQUE_MULTIPLIER = 0.2;
  const MAX_SPEED = 10;

  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (pressed) => {
        if (pressed && player.current) {
          const velocity = player.current.linvel();
          if (Math.abs(velocity.y) < 0.5) {
            player.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 });
          }
        }
      }
    );
  
    return () => unsubscribeJump();
  }, []);
  

  useFrame((state, delta) => {
    if (!player.current) return;
    
    const { forward, backward, left, right } = getKeys();

    // Get current velocity
    const currentVel = player.current.linvel();
    const currentSpeed = Math.sqrt(
      currentVel.x * currentVel.x + currentVel.z * currentVel.z
    );

    // Calculate move direction
    const moveDirection = new THREE.Vector3(0, 0, 0);
    if (forward) moveDirection.z -= 1;
    if (backward) moveDirection.z += 1;
    if (left) moveDirection.x -= 1;
    if (right) moveDirection.x += 1;

    // Normalize movement vector
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
    }

    // Apply speed limit and calculate force
    const speedFactor = Math.max(0, 1 - currentSpeed / MAX_SPEED);
    const force = moveDirection.multiplyScalar(MOVE_FORCE * speedFactor);

    // Apply movement force
    player.current.applyImpulse({
      x: force.x,
      y: 0,
      z: force.z,
    });

    // Apply torque for rotation
    player.current.applyTorqueImpulse({
      x: force.z * TORQUE_MULTIPLIER,
      y: 0,
      z: -force.x * TORQUE_MULTIPLIER,
    });

    // Camera positioning
    const playerPos = player.current.translation();

    const cameraPos = new THREE.Vector3();
    cameraPos.copy(playerPos);
    cameraPos.z += 6;
    cameraPos.y += 3;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(playerPos);
    cameraTarget.y += 0.5;

    const smoothFactor = Math.min(delta * CAMERA_LAG, 1);
    smoothCameraPos.lerp(cameraPos, smoothFactor);
    smoothCameraTarget.lerp(cameraTarget, smoothFactor);

    state.camera.position.copy(smoothCameraPos);
    state.camera.lookAt(smoothCameraTarget);
  });

  return (
    <RigidBody
      ref={player}
      mass={2}
      colliders="hull"
      friction={0.7}
      linearDamping={0.95}
      angularDamping={0.8}
      {...props}
    >
      <primitive object={ball.scene} scale={0.75} />
    </RigidBody>
  );
};

export default Player;
