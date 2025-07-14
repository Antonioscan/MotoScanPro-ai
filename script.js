let tipoRicambio = null;
let immagini = [];
let immagineSelezionata = null;

function selezionaTipo(tipo) {
  tipoRicambio = tipo;
  document.getElementById("sceltaTipo").style.display = "none";
  document.getElementById("uploadContainer").style.display = "block";
}

function caricaFoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    immagini.push(e.target.result);
    immagineSelezionata = immagini.length - 1;
    mostraAnteprima();
    mostraMiniature();
  };
  reader.readAsDataURL(file);
}

function mostraAnteprima() {
  const container = document.getElementById("anteprimaContainer");
  container.innerHTML = `<img src="${immagini[immagineSelezionata]}" alt="Anteprima">`;
}

function mostraMiniature() {
  const container = document.getElementById("miniatureContainer");
  container.innerHTML = "";
  immagini.forEach((imgSrc, index) => {
    const mini = document.createElement("img");
    mini.src = imgSrc;
    mini.classList.toggle("selezionata", index === immagineSelezionata);
    mini.onclick = () => {
      immagineSelezionata = index;
      mostraAnteprima();
      mostraMiniature();
    };
    container.appendChild(mini);
  });
}
