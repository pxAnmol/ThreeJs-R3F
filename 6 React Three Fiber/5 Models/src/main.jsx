import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Canvas } from "@react-three/fiber";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Canvas camera={{ position: [0.75, 1, 4], fov: 50 }}>
      <color attach="background" args={["#171720"]} />
      <App />
    </Canvas>
  </StrictMode>
);
