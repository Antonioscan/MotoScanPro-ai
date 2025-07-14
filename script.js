let tipoSelezionato = null;

document.getElementById("newPartsBtn").addEventListener("click", () => {
  tipoSelezionato = "nuovo";
  localStorage.setItem("tipoRicambio", tipoSelezionato);
  mostraInputFoto();
});

document.getElementById("usedPartsBtn").addEventListener("click", () => {
  tipoSelezionato = "usato";
  localStorage.setItem("tipoRicambio", tipoSelezionato);
  mostraInputFoto();
});

function mostraInputFoto() {
  document.getElementById("newPartsBtn").style.display = "none";
  document.getElementById("usedPartsBtn").style.display = "none";
  document.getElementById("photoSection").style.display = "block";
  document.getElementById("photoInput").click(); // apre direttamente la fotocamera
}
