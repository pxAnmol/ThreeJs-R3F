import { StrictMode, useState, useEffect, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Canvas } from "@react-three/fiber";
import UI from "./UI.jsx";
import { KeyboardControls } from "@react-three/drei";

const MobileBlocker = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "#1e1e1e",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      textAlign: "center",
      zIndex: 1000,
    }}
  >
    <h2>Please use a desktop device to experience this content</h2>
  </div>
);

const Experience = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (isMobile) {
    return <MobileBlocker />;
  }

  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "left", keys: ["ArrowLeft", "KeyA"] },
        { name: "right", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
      ]}
    >
      <Canvas camera={{ fov: 55, position: [2, 3, 5] }}>
        <color attach="background" args={["#1e1e1e"]} />
        <Suspense>
          <App />
        </Suspense>
      </Canvas>
      <UI />
    </KeyboardControls>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Experience />
  </StrictMode>
);
