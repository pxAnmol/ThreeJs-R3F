import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Player = (props) => {
  const player = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const [smoothCameraPos] = useState(() => new THREE.Vector3(0, 2, 6));
  const [smoothCameraTarget] = useState(() => new THREE.Vector3());

  const JUMP_FORCE = 6;
  const MOVE_FORCE = 15;
  const CAMERA_LAG = 5;

  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (pressed) => {
        if (pressed) {
          const velocity = player.current.linvel();
          if (Math.abs(velocity.y) < 0.05) {
            player.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 });
          }
        }
      }
    );

    return () => unsubscribeJump();
  }, []);

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const moveSpeed = MOVE_FORCE * delta;

    if (forward) impulse.z = -moveSpeed;
    if (backward) impulse.z = moveSpeed;
    if (left) impulse.x = -moveSpeed;
    if (right) impulse.x = moveSpeed;

    // Normalize diagonal movement
    if ((forward || backward) && (left || right)) {
      impulse.x *= 0.707; // 1/√2
      impulse.z *= 0.707;
    }

    player.current.applyImpulse(impulse);

    // Camera positioning
    const playerPos = player.current.translation();

    const cameraPos = new THREE.Vector3();
    cameraPos.copy(playerPos);
    // For better viewing
    cameraPos.z += 5;
    cameraPos.y += 2;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(playerPos);
    cameraTarget.y += 0.5;

    const velocity = player.current.linvel();
    const speed = new THREE.Vector3(
      velocity.x,
      velocity.y,
      velocity.z
    ).length();
    const smoothFactor = Math.min(delta * CAMERA_LAG, 1);

    smoothCameraPos.lerp(cameraPos, smoothFactor + speed * 0.02);
    smoothCameraTarget.lerp(cameraTarget, smoothFactor + speed * 0.01);

    state.camera.position.copy(smoothCameraPos);
    state.camera.lookAt(smoothCameraTarget);
  });

  return (
    <RigidBody
      ref={player}
      mass={2}
      friction={0.8}
      linearDamping={0.5}
      angularDamping={0.5}
      {...props}
    >
      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </RigidBody>
  );
};

export default Player;
