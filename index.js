window.addEventListener("load", function() {
  fillFirstColorRandomly();
  initializeVariationButtons();
  initializeColorPickers();
  initializeFillMissingColors();
});

function fillFirstColorRandomly() {
  const color = chroma.hex("5C2FA0");
  const [firstColorInput] = document.querySelectorAll("input[type=color]");
  const [firstPrimaryColorContainer] = document.querySelectorAll(
    ".primary-color"
  );
  firstColorInput.value = color;
  firstPrimaryColorContainer.style.backgroundColor = color;
}

function initializeVariationButtons() {
  const buttons = document.querySelectorAll(".color-container button");

  for (const button of buttons) {
    button.addEventListener("click", event => applyVariations(event.target));
  }
}

function initializeColorPickers() {
  const pickers = document.querySelectorAll("input[type='color']");

  for (const picker of pickers) {
    picker.addEventListener("change", onColorPick);
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
  const [darkerVariation, lighterVariation] = defineVariations(color);

  const [
    firstVariationContainer,
    secondVariationContainer
  ] = colorContainer.querySelectorAll(".color-variation");

  firstVariationContainer.style.backgroundColor = darkerVariation;
  secondVariationContainer.style.backgroundColor = lighterVariation;
}

function defineVariations(color) {
  const darker = chroma(color)
    .darken(0.5)
    .hex();

  const lighter = chroma(color)
    .brighten(0.5)
    .hex();

  return [darker, lighter];
}

function onColorPick(event) {
  const picker = event.target;
  const color = picker.value;

  const primaryColorContainer = picker
    .closest("div")
    .querySelector(".primary-color");

  primaryColorContainer.style.backgroundColor = color;
}

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
  let newColor = chroma(presetPrimaryColors[0])
    .set("hsl.h", "+" + String(index * 45))
    .set("hsl.l", 0.65)
    .set("hsl.s", 0.71)
    .hex();

  newColor = maybeAvoidSimilarHue(newColor, presetAndAutofilledPrimaryColors);
  newColor = maybeSaturateRedishHues(newColor);
  newColor = maybePushColorWheelForCyanishHues(newColor);

  return newColor;
}

function maybeAvoidSimilarHue(color, existingColors) {
  const hue = getHue(color);
  const existingHues = getHues(existingColors);

  const isHueSimilarToExistingHue = checkIfHueIsSimilarToExistingHues(
    hue,
    existingHues
  );

  return color;
}

function checkIfHueIsSimilarToExistingHues(hue, existingHues) {
  // console.log({ hue, existingHues });
  return false;
}

function getHue(color) {
  return chroma(color).get("hsl.h");
}

function getHues(colors) {
  return colors.map(getHue);
}

function maybeSaturateRedishHues(color) {
  const newHue = getHue(color);

  if (newHue >= 345 && newHue <= 365) {
    return chroma(color).set("hsl.s", 0.55);
  }

  return color;
}

function maybePushColorWheelForCyanishHues(color) {
  const newHue = getHue(color);

  if (newHue >= 120 && newHue <= 135) {
    console.log("🚀", "is Cyanish", color);
    return chroma(color).set("hsl.h", newHue + 15);
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
