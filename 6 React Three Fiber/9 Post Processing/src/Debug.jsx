import { useControls, folder } from "leva";

// Bloom controls
export const useBloomControls = () => {
  const config = useControls({
    Bloom: folder({
      enabled: { value: false, label: "Enabled" },
      intensity: {
        value: 1.25,
        min: 0,
        max: 10,
        step: 0.01,
        label: "Intensity",
      },
      mipmapBlur: {
        value: true,
        label: "Mipmap Blur",
      },
      luminanceThreshold: {
        value: 1,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Luminance Threshold",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...bloomProps } = config;
  return { enabled, props: bloomProps };
};

// Glitch controls
export const useGlitchControls = () => {
  const config = useControls({
    Glitch: folder({
      enabled: { value: false, label: "Enabled" },
      strength: {
        value: [0.3, 1],
        label: "Strength",
      },
      mode: {
        value: "SPORADIC",
        options: ["SPORADIC", "CONSTANT", "DISABLED"],
        label: "Mode",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...glitchProps } = config;
  return { enabled, props: glitchProps };
};

// Autofocus controls
export const useAutofocusControls = () => {
    const config = useControls({
      Autofocus: folder({
        enabled: { value: false, label: "Enabled" },
        mouse: { value: true, label: "Follow Mouse" },
        focusRange: {
          value: 0.001,
          min: 0.0001,
          max: 0.01,
          step: 0.0001,
          label: "Focus Range",
        },
        bokehScale: {
          value: 8,
          min: 0,
          max: 20,
          step: 0.1,
          label: "Bokeh Scale",
        },
        focalLength: {
          value: 0.8,
          min: 0.1,
          max: 2,
          step: 0.01,
          label: "Focal Length",
        },
        smoothTime: {
          value: 0.5,
          min: 0.1,
          max: 2,
          step: 0.1,
          label: "Smooth Time",
        },
      }, { collapsed: true }),
    });
    
    const { enabled, ...autofocusProps } = config;
    return { enabled, props: autofocusProps };
  };  

// Noise controls
export const useNoiseControls = () => {
  const config = useControls({
    Noise: folder({
      enabled: { value: false, label: "Enabled" },
      opacity: {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Opacity",
      },
      blendFunction: {
        value: "MULTIPLY",
        options: ["NORMAL", "ADD", "MULTIPLY", "SCREEN", "OVERLAY"],
        label: "Blend",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...noiseProps } = config;
  return { enabled, props: noiseProps };
};

// Vignette controls
export const useVignetteControls = () => {
  const config = useControls({
    Vignette: folder({
      enabled: { value: false, label: "Enabled" },
      eskil: {
        value: false,
        label: "Eskil",
      },
      offset: {
        value: 0.1,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Offset",
      },
      darkness: {
        value: 1.1,
        min: 0,
        max: 2,
        step: 0.01,
        label: "Darkness",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...vignetteProps } = config;
  return { enabled, props: vignetteProps };
};

// ChromaticAberration controls
export const useChromaticAberrationControls = () => {
  const config = useControls({
    ChromaticAberration: folder({
      enabled: { value: false, label: "Enabled" },
      offset: {
        value: [0.02, 0.002],
        label: "Offset",
      },
      blendFunction: {
        value: "NORMAL",
        options: ["NORMAL", "ADD", "MULTIPLY", "SCREEN", "OVERLAY"],
        label: "Blend",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...chromaticAberrationProps } = config;
  return { enabled, props: chromaticAberrationProps };
};

// DepthOfField controls
export const useDepthOfFieldControls = () => {
  const config = useControls({
    DepthOfField: folder({
      enabled: { value: false, label: "Enabled" },
      focusDistance: {
        value: 0.001,
        min: 0.0001,
        max: 1,
        step: 0.001,
        label: "Focus Distance",
      },
      focalLength: {
        value: 0.01,
        min: 0.0001,
        max: 1,
        step: 0.001,
        label: "Focal Length",
      },
      bokehScale: {
        value: 6,
        min: 0,
        max: 20,
        step: 0.1,
        label: "Bokeh Scale",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...depthOfFieldProps } = config;
  return { enabled, props: depthOfFieldProps };
};

// BrightnessContrast controls
export const useBrightnessContrastControls = () => {
  const config = useControls({
    BrightnessContrast: folder({
      enabled: { value: false, label: "Enabled" },
      brightness: {
        value: 0.1,
        min: -1,
        max: 1,
        step: 0.01,
        label: "Brightness",
      },
      contrast: {
        value: 0.1,
        min: -1,
        max: 1,
        step: 0.01,
        label: "Contrast",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...brightnessContrastProps } = config;
  return { enabled, props: brightnessContrastProps };
};

// DotScreen controls
export const useDotScreenControls = () => {
  const config = useControls({
    DotScreen: folder({
      enabled: { value: false, label: "Enabled" },
      angle: {
        value: Math.PI * 0.5,
        min: 0,
        max: Math.PI * 2,
        step: 0.01,
        label: "Angle",
      },
      scale: {
        value: 1.0,
        min: 0.1,
        max: 10,
        step: 0.1,
        label: "Scale",
      },
      blendFunction: {
        value: "MULTIPLY",
        options: ["NORMAL", "ADD", "MULTIPLY", "SCREEN", "OVERLAY"],
        label: "Blend",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...dotScreenProps } = config;
  return { enabled, props: dotScreenProps };
};

// Grid controls
export const useGridControls = () => {
  const config = useControls({
    Grid: folder({
      enabled: { value: false, label: "Enabled" },
      scale: {
        value: 1.0,
        min: 0.1,
        max: 10,
        step: 0.1,
        label: "Scale",
      },
      lineWidth: {
        value: 0.0,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Line Width",
      },
      blendFunction: {
        value: "OVERLAY",
        options: ["NORMAL", "ADD", "MULTIPLY", "SCREEN", "OVERLAY"],
        label: "Blend",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...gridProps } = config;
  return { enabled, props: gridProps };
};

// Pixelation controls
export const usePixelationControls = () => {
  const config = useControls({
    Pixelation: folder({
      enabled: { value: false, label: "Enabled" },
      granularity: {
        value: 6,
        min: 1,
        max: 20,
        step: 1,
        label: "Granularity",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...pixelationProps } = config;
  return { enabled, props: pixelationProps };
};

// Scanline controls
export const useScanlineControls = () => {
  const config = useControls({
    Scanline: folder({
      enabled: { value: false, label: "Enabled" },
      density: {
        value: 1.25,
        min: 0.1,
        max: 5,
        step: 0.01,
        label: "Density",
      },
      blendFunction: {
        value: "OVERLAY",
        options: ["NORMAL", "ADD", "MULTIPLY", "SCREEN", "OVERLAY"],
        label: "Blend",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...scanlineProps } = config;
  return { enabled, props: scanlineProps };
};

// Sepia controls
export const useSepiaControls = () => {
  const config = useControls({
    Sepia: folder({
      enabled: { value: false, label: "Enabled" },
      intensity: {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Intensity",
      },
      blendFunction: {
        value: "NORMAL",
        options: ["NORMAL", "ADD", "MULTIPLY", "SCREEN", "OVERLAY"],
        label: "Blend",
      },
    }, { collapsed: true }),
  });
  
  const { enabled, ...sepiaProps } = config;
  return { enabled, props: sepiaProps };
};
