window.addEventListener("load", function() {
  initializeVariationButtons();
  initializeColorPickers();
});

function initializeVariationButtons() {
  const buttons = document.querySelectorAll(".color-container button");

  for (const button of buttons) {
    button.addEventListener("click", applyVariations);
  }
}

function initializeColorPickers() {
  const pickers = document.querySelectorAll("input[type='color']");

  for (const picker of pickers) {
    picker.addEventListener("change", onColorPick);
  }
}

function applyVariations(event) {
  const colorContainer = event.target.closest(".color-picker-container");

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
