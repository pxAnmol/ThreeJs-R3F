import { useControls } from "leva";

const DebugControls = () => {
  const { spotLightDebug, monitor, controls, fullLight } = useControls(
    "General",
    {
      fullLight: {
        value: false,
        label: "Lights",
      },
      controls: {
        value: false,
        label: "Controls",
      },
      spotLightDebug: {
        value: false,
        label: "Helper",
      },
      monitor: {
        value: false,
        label: "Monitor",
      },
    },
    { collapsed: true }
  );

  const { text, letterSpacing } = useControls(
    "Text",
    {
      text: {
        value: "Anmol",
        label: "Content",
      },
      letterSpacing: {
        value: 0.05,
        min: 0,
        max: 0.2,
        step: 0.01,
        label: "Spacing",
      },
    },
    { collapsed: true }
  );

  const spotLightProps = useControls(
    "Flash Light",
    {
      intensity: {
        value: 15,
        min: 0,
        max: 30,
        step: 0.1,
        label: "Intensity",
      },
      distance: {
        value: 15,
        min: 10,
        max: 20,
        step: 0.1,
        label: "Distance",
      },
      angle: {
        value: 0.4,
        min: 0,
        max: Math.PI / 2,
        label: "Angle",
      },
      penumbra: {
        value: 0.8,
        min: 0,
        max: 1,
        step: 0.1,
        label: "Penumbra",
      },
      decay: {
        value: 0.5,
        min: 0,
        max: 2,
        step: 0.1,
        label: "Decay",
      },
      color: {
        value: "#ffffff",
        label: "Color",
      },
    },
    { collapsed: true }
  );

  return {
    spotLightDebug,
    monitor,
    text,
    letterSpacing,
    spotLightProps,
    controls,
    fullLight,
  };
};

export default DebugControls;
