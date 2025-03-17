import { EffectComposer } from "@react-three/postprocessing";

import { BlendFunction } from "postprocessing";

import { GlitchMode } from "postprocessing";

// Effects
import {
  Bloom,
  Autofocus,
  ChromaticAberration,
  DepthOfField,
  Noise,
  Vignette,
  Glitch,
  BrightnessContrast,
  DotScreen,
  Grid,
  Pixelation,
  Scanline,
  Sepia,
} from "@react-three/postprocessing";

import {
  useBloomControls,
  useGlitchControls,
  useNoiseControls,
  useVignetteControls,
  useChromaticAberrationControls,
  useDepthOfFieldControls,
  useBrightnessContrastControls,
  useDotScreenControls,
  useGridControls,
  usePixelationControls,
  useScanlineControls,
  useSepiaControls,
  useAutofocusControls,
} from "./Debug";

/* Adding post processing "effects" to the scene got streamlined, but yet a bit complicated, for this, we need another R3F specific library for post processing - "@react-three/postprocessing". This takes care of all the things we need to do to add post processing to our scene.

First, we need to import the EffectComposer from the "@react-three/postprocessing" library. This EffectComposer is a bit different from the native three.js EffectComposer, it's a React component that takes care of all the things we need to do to add post processing to our scene. It has already setup the render pass, the GammaCorrection Pass and the FilmPass.

Blending - The blendFunction is an attribute that is available on almost every effect of the EffectComposer. It controls how the effect is blended with the previous effect. The default blending mode is "normal", which means that the effect is blended with the previous effect using the alpha channel of the previous effect. The other blending modes are "ADD", "ALPHA", "AVERAGE", "COLOR", "COLOR_BURN", "COLOR_DODGE", "DARKEN", "DIFFERENCE", "DIVIDE", "DST", "EXCLUSION", "HARD_LIGHT", "HARD_MIX", "HUE", "INVERT", "INVERT_RGB", "LIGHTEN", "LINEAR_BURN", "LINEAR_DODGE", "LINEAR_LIGHT", "LUMINOSITY", "MULTIPLY", "NEGATION", "NORMAL", "OVERLAY", "PIN_LIGHT", "REFLECT", "SATURATION", "SCREEN", "SET", "SKIP", "SOFT_LIGHT", "SRC", "SUBTRACT", "VIVID_LIGHT".

*/

const Effects = () => {
  const bloom = useBloomControls();
  const glitch = useGlitchControls();
  const noise = useNoiseControls();
  const vignette = useVignetteControls();
  const autofocus = useAutofocusControls();
  const chromaticAberration = useChromaticAberrationControls();
  const depthOfField = useDepthOfFieldControls();
  const brightnessContrast = useBrightnessContrastControls();
  const dotScreen = useDotScreenControls();
  const grid = useGridControls();
  const pixelation = usePixelationControls();
  const scanline = useScanlineControls();
  const sepia = useSepiaControls();

  const processProps = (props, type) => {
    const newProps = { ...props };

    if (newProps.blendFunction) {
      newProps.blendFunction = BlendFunction[newProps.blendFunction];
    }

    if (type === "glitch" && newProps.mode) {
      newProps.mode = GlitchMode[newProps.mode];
    }

    return newProps;
  };

  return (
    <EffectComposer>
      {glitch.enabled && <Glitch {...processProps(glitch.props, "glitch")} />}

      {noise.enabled && <Noise {...processProps(noise.props)} />}

      {vignette.enabled && <Vignette {...vignette.props} />}

      {/* Bloom Effect - This has a bit of work to do. First, it only works with the RGB channels that have a value above 1, so we need to individually set the color channels of the meshes on which we want the Bloom Effect. Check the Models.jsx file to see how to set the color channels for a specific material. Now we also need to disable the tone mapping of the respective material as it will limit the RGB channel values from going beyond 1. To create a Bloom Effect and the environment to react to it, we need to set the mipmapBlur attribute to true. */}

      {bloom.enabled && <Bloom {...bloom.props} />}

      {autofocus.enabled && <Autofocus {...autofocus.props} />}

      {brightnessContrast.enabled && (
        <BrightnessContrast {...brightnessContrast.props} />
      )}

      {chromaticAberration.enabled && (
        <ChromaticAberration {...processProps(chromaticAberration.props)} />
      )}

      {depthOfField.enabled && <DepthOfField {...depthOfField.props} />}

      {dotScreen.enabled && <DotScreen {...processProps(dotScreen.props)} />}

      {grid.enabled && <Grid {...processProps(grid.props)} />}

      {pixelation.enabled && <Pixelation {...pixelation.props} />}

      {scanline.enabled && <Scanline {...processProps(scanline.props)} />}

      {sepia.enabled && <Sepia {...processProps(sepia.props)} />}
    </EffectComposer>
  );
};

export default Effects;
