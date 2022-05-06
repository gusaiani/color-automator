window.addEventListener("load", function() {
  fillFirstColors();
});

function fillFirstColors() {
  const firstColor = chroma.hex("5C2FA0");
  const secondColor = chroma.hex("FFF700");

  const [firstColorInput, secondColorInput] = document.querySelectorAll(
    "input[type=color]"
  );
  const [
    firstPrimaryColorContainer,
    secondPrimaryColorContainer
  ] = document.querySelectorAll(".primary-color");

  firstColorInput.value = firstColor;
  firstPrimaryColorContainer.style.backgroundColor = firstColor;

  secondColorInput.value = secondColor;
  secondPrimaryColorContainer.style.backgroundColor = secondColor;
}
