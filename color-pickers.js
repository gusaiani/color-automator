window.addEventListener("load", function() {
  initializeColorPickers();
});

function initializeColorPickers() {
  const pickers = document.querySelectorAll("input[type='color']");

  for (const picker of pickers) {
    picker.addEventListener("change", onColorPick);
  }
}

function onColorPick(event) {
  const picker = event.target;
  const color = picker.value;

  const primaryColorContainer = picker
    .closest("div")
    .querySelector(".primary-color");

  primaryColorContainer.style.backgroundColor = color;
}
