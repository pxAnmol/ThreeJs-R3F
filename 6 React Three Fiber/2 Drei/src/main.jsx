import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Canvas } from "@react-three/fiber";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
      <App />
    </Canvas>
  </StrictMode>
);
