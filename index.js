window.addEventListener("load", function() {
  const colorPicker = document.getElementById("colorPicker");

  colorPicker.addEventListener("change", event => {
    const color = event.target.value;
    const transformedColor = chroma(color)
      .darken()
      .hex();

    const firstDiv = document.querySelectorAll("#palette div")[0];
    firstDiv.style.backgroundColor = transformedColor;
  });
});
