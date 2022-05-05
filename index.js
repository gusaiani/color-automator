window.addEventListener("load", function() {
  fillFirstColorRandomly();
  initializeVariationButtons();
  initializeColorPickers();
  initializeFillMissingColors();
});

function fillFirstColorRandomly() {
  const color = chroma.random();
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

  if (filledPrimaryColors.length === 1) {
    fillPrimaryColorsFromOnePrimary();
    fillAllVariations();
    fillColorBar();
  } else {
    throw "Number of filled primaries not yet covered";
  }
}

function detectFilledPrimaryColors() {
  const primaryColors = document.querySelectorAll(".primary-color");

  return [...primaryColors]
    .map(primaryColor => primaryColor.style.backgroundColor)
    .filter(_ => _);
}

function fillPrimaryColorsFromOnePrimary() {
  const primaryColorDivs = document.querySelectorAll(".primary-color");

  const newPrimaryColors = [...primaryColorDivs].reduce(
    (acc, primaryColorDiv, index) => {
      const firstColor = primaryColorDivs[0].style.backgroundColor;
      const newColor = setPrimaryColor(firstColor, index);
      acc.push(newColor);

      return acc;
    },
    []
  );

  primaryColorDivs.forEach((primaryColorDiv, index) => {
    primaryColorDiv.style.backgroundColor = newPrimaryColors[index];
  });
}

function setPrimaryColor(firstColor, index) {
  if (index === 0) return firstColor;

  let newColor = chroma(firstColor)
    .set("hsl.h", String(index * -45))
    .set("hsl.l", 0.8)
    .set("hsl.s", 0.4)
    .hex();

  const newHue = chroma(newColor).get("hsl.h");

  // Saturate redish hues
  if (newHue >= 345 && newHue <= 365) {
    console.log("Hue in redish range", newHue);
    newColor = chroma(newColor).set("hsl.s", 0.55);
  }

  // Push color wheel for cyanish hues
  if (newHue >= 120 && newHue <= 135) {
    console.log("Hue in cyanish range", newHue);
    newColor = chroma(newColor).set("hsl.h", newHue + 30);
  }

  return newColor;
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
