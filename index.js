window.addEventListener("load", function() {
  const buttons = document.querySelectorAll("button");

  for (const button of buttons) {
    button.addEventListener("click", applyVariations);
  }
});

function applyVariations(event) {
  const colorContainer = event.target.closest(".color-picker-container");

  const pickedColor = colorContainer.querySelector("input[type='color']").value;

  paintVariations(pickedColor, colorContainer);
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
