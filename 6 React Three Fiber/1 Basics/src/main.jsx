/* eslint-disable */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import "./index.css";
import App from "./App.jsx";

import * as THREE from "three";

createRoot(document.getElementById("root")).render(
  <StrictMode>

    {/* Importing the Canvas component from the "@react-three/fiber" library and wrapping the App component with it. We can alter all the settings of the canvas from here. By default, for example, the pixel ratio is automatically handled by R3F, the camera is set to perspective, the antialias is on, output encoding to sRGBEncoding and the tone mapping is set to ACESFilmicToneMapping. We can tweak all of them like set the camera type to orthographic, set the antialias to false, change the output encoding to Linear or set the tone mapping to NoToneMapping. */}

    <Canvas
      // gl={{antialias: false, toneMapping: THREE.NoToneMapping, outputEncoding: THREE.LinearEncoding}}
      camera={{ fov: 55, near: 0.1, far: 1000, position: [3, 3, 6] }}
    >
      <App />
    </Canvas>
  </StrictMode>
);
