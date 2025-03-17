import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const Bg = () => {
  const map = useTexture(
    "/anime.webp"
  );
  return (
    <>
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial side={THREE.BackSide} map={map} toneMapped={false} />
      </mesh>
    </>
  );
};

useTexture.preload("/anime.webp");

export default Bg;
