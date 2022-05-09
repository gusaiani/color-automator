const MINIMUM_LIGHTNESS_FOR_VARIATION = 0.3;
const MAXIMUM_LIGHTNESS_FOR_VARIATION = 0.8;

window.addEventListener("load", function() {
  initializeVariationButtons();
});

function initializeVariationButtons() {
  const buttons = document.querySelectorAll(".color-container button");

  for (const button of buttons) {
    button.addEventListener("click", event => applyVariations(event.target));
  }
}

function applyVariations(primaryColor) {
  const colorContainer = primaryColor.closest(".color-picker-container");

  const pickedColor = colorContainer.querySelector(".primary-color").style
    .backgroundColor;

  if (pickedColor) {
    paintVariations(pickedColor, colorContainer);
  }
}

function paintVariations(color, colorContainer) {
  const [firstVariation, secondVariation] = defineVariations(color);

  const [
    firstVariationContainer,
    secondVariationContainer
  ] = colorContainer.querySelectorAll(".color-variation");

  firstVariationContainer.style.backgroundColor = firstVariation;
  secondVariationContainer.style.backgroundColor = secondVariation;
}

function defineVariations(color) {
  const [
    isColorOutsideLightnessRange,
    tooLightOrTooDark
  ] = checkIfColorIsOutsideLightnessRange(color);

  if (isColorOutsideLightnessRange) {
    return customizeVariationsForLightnessRange(color, tooLightOrTooDark);
  }

  const darker = chroma(color)
    .darken(0.5)
    .hex();

  const lighter = chroma(color)
    .brighten(0.5)
    .hex();

  return [darker, lighter];
}

function checkIfColorIsOutsideLightnessRange(color) {
  const isColorTooLight =
    checkIfYellowAndLightish(color) ||
    checkIfCyanAndLightish(color) ||
    checkIfColorIsTooLight(color);

  if (isColorTooLight) {
    return [true, "light"];
  }

  const isColorTooDark = checkIfColorIsTooDark(color);

  if (isColorTooDark) {
    return [true, "dark"];
  }

  return [false, null];
}

function checkIfYellowAndLightish(color) {
  const hue = getHue(color);
  const lightness = getLightness(color);

  if (hue >= 40 && hue <= 60 && lightness > 0.4) {
    return true;
  }

  return false;
}

function checkIfCyanAndLightish(color) {
  const hue = getHue(color);
  const lightness = getLightness(color);

  if (hue >= 165 && hue <= 180 && lightness > 0.4) {
    return true;
  }

  return false;
}

function checkIfColorIsTooLight(color) {
  let lightness = chroma(color).get("hsl.l");
  return lightness > MAXIMUM_LIGHTNESS_FOR_VARIATION;
}

function checkIfColorIsTooDark(color) {
  let lightness = chroma(color).get("hsl.l");
  return lightness < MINIMUM_LIGHTNESS_FOR_VARIATION;
}

function customizeVariationsForLightnessRange(color, tooLightOrTooDark) {
  if (tooLightOrTooDark === "light") {
    return [
      chroma(color)
        .darken(0.6)
        .hex(),
      chroma(color)
        .darken(0.9)
        .hex()
    ];
  } else {
    console.log("Here");
    return [
      chroma(color)
        .brighten(0.6)
        .hex(),
      chroma(color)
        .brighten(0.9)
        .hex()
    ];
  }
}
