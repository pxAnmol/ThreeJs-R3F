import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";

createRoot(document.getElementById("root")).render(
  <StrictMode>

    {/* We will import the Leva component from the leva library and wrap it around the canvas component as the content inside the Canvas is for R3F things only. This Leva component also provides many options to customize the GUI. */}
    
    <Leva collapsed={false} />
    <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
      <App />
    </Canvas>
  </StrictMode>
);
