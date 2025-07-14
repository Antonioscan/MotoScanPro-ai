let tipoRicambio = null;

function selectType(tipo) {
  tipoRicambio = tipo;

  document.getElementById("btn-nuovi").style.display = "none";
  document.getElementById("btn-usati").style.display = "none";

  const fileInput = document.getElementById("fileInput");
  fileInput.click();
}

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const previewContainer = document.getElementById("previewContainer");
    previewContainer.innerHTML = '';

    const img = document.createElement("img");
    img.src = e.target.result;
    img.alt = "Anteprima";
    previewContainer.appendChild(img);
  };
  reader.readAsDataURL(file);

  console.log("Tipo selezionato:", tipoRicambio);
}
