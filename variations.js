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
