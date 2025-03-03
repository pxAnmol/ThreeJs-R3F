import * as THREE from "three";
import { Perf } from "r3f-perf";
import { OrbitControls, Center, Text3D, useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import DebugControls from "./Debug";

const App = () => {
  const textRef = useRef();
  const spotLightRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (materialRef.current?.uniforms?.mousePos?.value) {
      materialRef.current.uniforms.time.value = time;
      materialRef.current.uniforms.mousePos.value.set(
        -state.pointer.x,
        state.pointer.y
      );
    }
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(time * 0.25) * 0.1;
    }

    if (spotLightRef.current && textRef.current) {
      textRef.current.geometry.computeBoundingBox();
      const bbox = textRef.current.geometry.boundingBox;

      const center = new THREE.Vector3();
      bbox.getCenter(center);
      textRef.current.localToWorld(center);
      spotLightRef.current.target.position.copy(center);
      spotLightRef.current.target.updateMatrixWorld();
      // Set the spotlight's position based on mouse position
      const pointer = state.pointer;
      spotLightRef.current.position.set(pointer.x * 10, pointer.y * 10, 8);
    }
  });

  /* Debug GUI */

  const {
    spotLightDebug,
    monitor,
    text,
    letterSpacing,
    spotLightProps,
    controls,
    fullLight,
  } = DebugControls();

  useHelper(spotLightDebug && spotLightRef, THREE.SpotLightHelper, "red");

  return (
    <>
      <Center position={[0, 0, 0]}>
        <Text3D
          ref={textRef}
          font={"/Moon Dance_Regular.json"}
          curveSegments={32}
          bevelEnabled
          bevelSegments={4}
          bevelSize={0.04}
          bevelThickness={0.02}
          height={0.2}
          letterSpacing={letterSpacing}
          size={1.5}
        >
          {text}
          <primitive
            object={
              new THREE.MeshStandardMaterial({
                color: "#1a1a1a",
                metalness: 0.7,
                roughness: 0.2,
                emissive: "#220033",
                emissiveIntensity: 0.3,
                envMapIntensity: 1.5,
                onBeforeCompile: (shader) => {
                  shader.uniforms.time = { value: 0 };
                  shader.vertexShader = `
            uniform float time;
            ${shader.vertexShader}
          `.replace(
                    "#include <begin_vertex>",
                    `
              #include <begin_vertex>
              float wave = sin(position.x * 1.5 + time) * 0.03;
              transformed.y += wave;
              transformed.z += sin(position.x * 2.0 + time * 1.2) * 0.02;
              transformed.x += cos(position.y * 2.0 + time * 0.8) * 0.015;
            `
                  );
                  materialRef.current = shader;
                },
              })
            }
          />
        </Text3D>
      </Center>

      {controls && (
        <OrbitControls
          enablePan={false}
          enableRotate={true}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          minDistance={1}
          maxDistance={20}
        />
      )}
      {monitor && <Perf position="top-left" />}

      <ambientLight intensity={fullLight ? 5 : 0.1} />

      {fullLight && (
        <>
          <directionalLight position={[0, 0, 5]} intensity={100} castShadow />
          <directionalLight position={[0, 0, -5]} intensity={100} castShadow />
        </>
      )}

      {!fullLight && (
        <spotLight ref={spotLightRef} {...spotLightProps} castShadow />
      )}
    </>
  );
};

export default App;
