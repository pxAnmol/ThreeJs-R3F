import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Canvas } from "@react-three/fiber";

/* ATTACH attribute */

//  The "attach" property is used to bind objects to their parent, ensuring that if the attached object is unmounted, it will be removed from its parent automatically. It's like assigning a specific child to a parent in a tree structure. This is being used here to attach the color to the "background" property of the canvas. The <color> component is a way to create a "new THREE.Color" object, which is a color representation in the THREE.js library.

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* To enable shadows across the entire scene, you need to enable the shadows in the renderer. This is done by setting the "shadows" property to true in the renderer options within the Canvas component. */}
    <Canvas shadows camera={{ position: [-10, 4, -2] , fov: 55}}>
      <color attach="background" args={["#111317"]} />
      <App />
    </Canvas>
  </StrictMode>
);
