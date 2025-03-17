import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

export default function Character(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("./Character.gltf");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const animationName = Object.keys(actions)[23];
    if (animationName && actions[animationName]) {
      actions[animationName].play();
    }
    
    // console.log("Medieval animations:", Object.keys(actions));

  }, [actions]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="CharacterArmature">
          <primitive object={nodes.Root} />
          <group name="Medieval_Body">
            <skinnedMesh
              name="Cube043"
              geometry={nodes.Cube043.geometry}
              material={materials.Skin}
              skeleton={nodes.Cube043.skeleton}
            />
            <skinnedMesh
              name="Cube043_1"
              geometry={nodes.Cube043_1.geometry}
              material={materials.DarkBrown}
              skeleton={nodes.Cube043_1.skeleton}
            />
            <skinnedMesh
              name="Cube043_2"
              geometry={nodes.Cube043_2.geometry}
              material={materials.Gold}
              skeleton={nodes.Cube043_2.skeleton}
            />
            <skinnedMesh
              name="Cube043_3"
              geometry={nodes.Cube043_3.geometry}
              material={materials.LightBrown}
              skeleton={nodes.Cube043_3.skeleton}
            />
            <skinnedMesh
              name="Cube043_4"
              geometry={nodes.Cube043_4.geometry}
              material={materials.Black}
              skeleton={nodes.Cube043_4.skeleton}
            />
            <skinnedMesh
              name="Cube043_5"
              geometry={nodes.Cube043_5.geometry}
              material={materials.Metal}
              skeleton={nodes.Cube043_5.skeleton}
            />
          </group>
          <group name="Medieval_Feet">
            <skinnedMesh
              name="Cube007"
              geometry={nodes.Cube007.geometry}
              material={materials.DarkBrown}
              skeleton={nodes.Cube007.skeleton}
            />
            <skinnedMesh
              name="Cube007_1"
              geometry={nodes.Cube007_1.geometry}
              material={materials.LightBrown}
              skeleton={nodes.Cube007_1.skeleton}
            />
          </group>
          <group name="Medieval_Head">
            <skinnedMesh
              name="Cube024"
              geometry={nodes.Cube024.geometry}
              material={materials.Skin}
              skeleton={nodes.Cube024.skeleton}
            />
            <skinnedMesh
              name="Cube024_1"
              geometry={nodes.Cube024_1.geometry}
              material={materials.White}
              skeleton={nodes.Cube024_1.skeleton}
            />
            <skinnedMesh
              name="Cube024_2"
              geometry={nodes.Cube024_2.geometry}
              material={materials.Brown}
              skeleton={nodes.Cube024_2.skeleton}
            />
            <skinnedMesh
              name="Cube024_3"
              geometry={nodes.Cube024_3.geometry}
              material={materials.DarkBrown}
              skeleton={nodes.Cube024_3.skeleton}
            />
            <skinnedMesh
              name="Cube024_4"
              geometry={nodes.Cube024_4.geometry}
              material={materials.Black}
              skeleton={nodes.Cube024_4.skeleton}
            />
          </group>
          <skinnedMesh
            name="Medieval_Legs"
            geometry={nodes.Medieval_Legs.geometry}
            material={materials.Black}
            skeleton={nodes.Medieval_Legs.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("./Character.gltf");
