import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Canvas } from "@react-three/fiber";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Canvas camera={{ fov: 50 }} shadows>
      <color attach="background" args={["black"]} />
      <App />
    </Canvas>
  </StrictMode>
);
