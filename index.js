window.addEventListener("load", function() {
  const colorPicker = document.getElementById("colorPicker");

  colorPicker.addEventListener("change", event => {
    console.log("Changed", event.target.value);
  });
});
