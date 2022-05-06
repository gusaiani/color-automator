const MINIMUM_LIGHTNESS = 0.3;
const MAXIMUM_LIGHTNESS = 0.7;
const HUE_SIMILARITY_THRESHOLD = 20;

window.addEventListener("load", function() {
  initializeFillMissingColors();
});

function initializeFillMissingColors() {
  const button = document.querySelector(".fill-missing-colors");
  button.addEventListener("click", onClickFillMissingColors);
}

function onClickFillMissingColors(event) {
  const filledPrimaryColors = detectFilledPrimaryColors();

  fillPrimaryColors();
  fillAllVariations();
  fillColorBar();
}

function detectFilledPrimaryColors() {
  const primaryColors = document.querySelectorAll(".primary-color");

  return [...primaryColors]
    .map(primaryColor => primaryColor.style.backgroundColor)
    .filter(_ => _);
}

function fillPrimaryColors() {
  const primaryColorDivs = document.querySelectorAll(".primary-color");

  const presetPrimaryColors = [...primaryColorDivs]
    .map(primaryColorDiv => {
      return primaryColorDiv.style.backgroundColor;
    })
    .filter(_ => _);

  const presetAndAutofilledPrimaryColors = [...presetPrimaryColors];

  const numberOfPrimariesToAutofill =
    primaryColorDivs.length - presetPrimaryColors.length;

  for (let i = 0; i < numberOfPrimariesToAutofill; i++) {
    const newColor = setPrimaryColor(
      presetPrimaryColors,
      presetAndAutofilledPrimaryColors,
      i + 1
    );
    presetAndAutofilledPrimaryColors.push(newColor);
  }

  primaryColorDivs.forEach((primaryColorDiv, index) => {
    primaryColorDiv.style.backgroundColor =
      presetAndAutofilledPrimaryColors[index];
  });
}

function setPrimaryColor(
  presetPrimaryColors,
  presetAndAutofilledPrimaryColors,
  index
) {
  let newColor = chroma(
    presetPrimaryColors[(index - 1) % presetPrimaryColors.length]
  )
    .set(
      "hsl.h",
      "+" +
        String(Math.floor((index - 1) / presetPrimaryColors.length + 1) * 45)
    )
    .set("hsl.s", 0.71)
    .hex();

  newColor = constrainLightness(newColor);
  newColor = avoidSimilarHue(newColor, presetAndAutofilledPrimaryColors);
  newColor = maybeSaturateYellowishHues(newColor);
  newColor = maybePushColorWheelForCyanishHues(newColor);

  return newColor;
}

function constrainLightness(color) {
  let lightness = chroma(color).get("hsl.l");

  if (lightness > MAXIMUM_LIGHTNESS) {
    lightness = MAXIMUM_LIGHTNESS;
  } else if (lightness < MINIMUM_LIGHTNESS) {
    lightness = MINIMUM_LIGHTNESS;
  }

  return chroma(color).set("hsl.l", lightness);
}

function avoidSimilarHue(color, existingColors) {
  let hue = getHue(color);
  const existingHues = getHues(existingColors);

  let isHueSimilarToExistingHue = checkIfHueIsSimilarToExistingHues(
    hue,
    existingHues
  );

  while (isHueSimilarToExistingHue) {
    hue += 45;

    isHueSimilarToExistingHue = checkIfHueIsSimilarToExistingHues(
      hue,
      existingHues
    );
  }

  return chroma(color).set("hsl.h", hue);
}

function checkIfHueIsSimilarToExistingHues(hue, existingHues) {
  return existingHues.some(
    existingHue => Math.abs(existingHue - hue) < HUE_SIMILARITY_THRESHOLD
  );
}

function getHue(color) {
  return chroma(color).get("hsl.h");
}

function getHues(colors) {
  return colors.map(getHue);
}

function maybeSaturateYellowishHues(color) {
  const newHue = getHue(color);

  if (newHue >= 30 && newHue <= 45) {
    return chroma(color).set("hsl.s", 0.71);
  }

  return color;
}

function maybePushColorWheelForCyanishHues(color) {
  const newHue = getHue(color);

  if (newHue >= 120 && newHue <= 135) {
    return chroma(color).set("hsl.h", newHue + 10);
  }

  return color;
}

function fillAllVariations() {
  const buttons = document.querySelectorAll(".color-container button");

  for (const button of buttons) {
    applyVariations(button);
  }
}

function fillColorBar() {
  const allSetColors = getAllSetColors();
  const colorBar = document.querySelector("#color-bar");

  colorBar.replaceChildren();

  allSetColors.forEach(color => {
    const div = document.createElement("div");
    div.style.backgroundColor = color;
    colorBar.appendChild(div);
  });
}

function getAllSetColors() {
  const colorPickerContainers = document.querySelectorAll(
    ".color-picker-container"
  );

  return [...colorPickerContainers].map(getPrimaryAndVariations).flat();
}

function getPrimaryAndVariations(colorPickerContainer) {
  const primaryColor = colorPickerContainer.querySelector(".primary-color")
    .style.backgroundColor;
  const [variationDiv1, variationDiv2] = colorPickerContainer.querySelectorAll(
    ".color-variation"
  );

  const variation1 = variationDiv1.style.backgroundColor;
  const variation2 = variationDiv2.style.backgroundColor;

  return [variation1, primaryColor, variation2];
}
