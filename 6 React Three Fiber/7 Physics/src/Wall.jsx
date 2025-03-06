import React, { useEffect, useMemo, useRef } from "react";
import { InstancedRigidBodies } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function BoxModel({ scale = 1 }) {
  const { nodes, materials } = useGLTF("./models/box-com.glb");
  return {
    geometry: nodes.defaultMaterial.geometry,
    material: materials.None,
    scale: [0.5 * scale, 0.5 * scale, 0.5 * scale],
  };
}

export default function Wall({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  rows = 4,
  columns = 4,
  maxHeight = 10,
}) {
  const boxData = BoxModel({ scale });

  const rigidBodiesRef = useRef();
  const instancesCount = rows * columns * maxHeight;

  const instances = useMemo(() => {
    const result = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        for (let height = 0; height < maxHeight; height++) {
          const randomRotationX = (Math.random() - 0.5) * 0.3;
          const randomRotationY = (Math.random() - 0.5) * 0.3;
          const randomRotationZ = (Math.random() - 0.5) * 0.3;
          result.push({
            key: `box-${row}-${col}-${height}`,
            position: [
              position[0] + row * 1.2 - (rows * 1.2) / 2,
              position[1] + (height * 1.2 + 0.8),
              position[2] + col * 1.2 - (columns * 1.2) / 2,
            ],
            rotation: [
              rotation[0] + randomRotationX,
              rotation[1] + randomRotationY,
              rotation[2] + randomRotationZ,
            ],
            scale: boxData.scale,
          });
        }
      }
    }
    return result;
  }, [position, rotation, rows, columns, maxHeight, boxData.scale]);

  const instancedMeshRef = useRef();
  useEffect(() => {
    const mesh = instancedMeshRef.current;
    if (!mesh) return;

    mesh.count = instancesCount;
    const dummy = new THREE.Object3D();

    instances.forEach((instance, index) => {
      dummy.position.set(...instance.position);
      dummy.rotation.set(...instance.rotation);
      dummy.scale.set(...instance.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  }, [instances, instancesCount]);

  return (
    <>
      {/* InstancedRigidBodies for physics */}
      <InstancedRigidBodies
        ref={rigidBodiesRef}
        instances={instances}
        restitution={0.2}
        friction={0.7}
        colliders="hull"
      >
        {/* InstancedMesh for rendering */}
        <instancedMesh
          ref={instancedMeshRef}
          args={[boxData.geometry, boxData.material, instancesCount]}
          // castShadow
          // receiveShadow
        />
      </InstancedRigidBodies>
    </>
  );
}

useGLTF.preload("./models/box-com.glb");
