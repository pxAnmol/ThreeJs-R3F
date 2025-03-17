import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Canvas camera={{ position: [-1, 0.2, 5], fov: 60 }}>
      <color attach="background" args={["#171720"]} />
      <Suspense>
        <App />
      </Suspense>
    </Canvas>
  </StrictMode>
);
