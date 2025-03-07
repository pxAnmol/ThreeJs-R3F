import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Canvas } from "@react-three/fiber";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Canvas
      shadows="basic"
      performance={{ min: 0.5 }}
      gl={{
        powerPreference: "high-performance",
      }}
      camera={{ fov: 55, position: [-15.5, 11, -15] }}
    >
      <color attach="background" args={["#171720"]} />
      <Suspense>
        <App />
      </Suspense>
    </Canvas>
  </StrictMode>
);
