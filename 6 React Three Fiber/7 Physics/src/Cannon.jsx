import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

export default function Cannon(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("./models/cannon-com.glb");
  const { actions } = useAnimations(animations, group);

  return (
    <RigidBody colliders="hull" position={[0, 2, 0]}>
      <group
        ref={group}
        {...props}
        scale={[0.003, 0.003, 0.003]}
        dispose={null}
      >
        <group name="cannon">
          <primitive object={nodes._rootJoint} />
          <skinnedMesh
            name="Object_22"
            geometry={nodes.Object_22.geometry}
            material={materials["Scene_-_Root"]}
            skeleton={nodes.Object_22.skeleton}
            scale={100}
            // castShadow
            // receiveShadow
          />
        </group>
      </group>
    </RigidBody>
  );
}

useGLTF.preload("./models/cannon-com.glb");
