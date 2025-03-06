import { useGLTF } from "@react-three/drei";

// This component will just extract geometry and material
export function BoxModel({ scale = 1 }) {
  const { nodes, materials } = useGLTF("./models/box-com.glb");

  return {
    geometry: nodes.defaultMaterial.geometry,
    material: materials.None,
    scale: [1 * scale, 1 * scale, 1 * scale],
  };
}

useGLTF.preload("./models/box-com.glb");
