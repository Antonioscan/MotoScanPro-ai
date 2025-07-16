// script.js
const btnNuovi = document.getElementById("btnNuovi");
const btnUsati = document.getElementById("btnUsati");
const cameraInput = document.getElementById("cameraInput");
const mainPreview = document.getElementById("mainPreview");
const miniatureContainer = document.getElementById("miniatureContainer");
const confirmBtn = document.getElementById("confirmPhotos");
const addMoreBtn = document.getElementById("addMoreBtn");
const aiDescription = document.getElementById("aiDescription");

let selectedType = "";
let images = [];

function updateMiniatures() {
  miniatureContainer.innerHTML = "";
  images.forEach((src, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("miniature-wrapper");

    const img = document.createElement("img");
    img.src = src;
    img.classList.add("miniature");
    img.onclick = () => setMainImage(src);

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.innerHTML = '<img src="https://img.icons8.com/ios-glyphs/30/ffffff/trash.png" alt="Elimina">';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      images.splice(index, 1);
      if (images.length === 0) {
        mainPreview.style.display = "none";
        btnNuovi.style.display = "block";
        btnUsati.style.display = "block";
        confirmBtn.style.display = "none";
        addMoreBtn.style.display = "none";
        aiDescription.style.display = "none";
        aiDescription.innerHTML = "";
        selectedType = "";
      } else if (mainPreview.src === src) {
        setMainImage(images[0]);
      }
      updateMiniatures();
    };

    wrapper.appendChild(img);
    wrapper.appendChild(delBtn);
    miniatureContainer.appendChild(wrapper);
  });

  confirmBtn.style.display = images.length > 0 ? "block" : "none";
  addMoreBtn.style.display = (images.length > 0 && images.length < 5) ? "block" : "none";
}

function setMainImage(src) {
  mainPreview.src = src;
  mainPreview.style.display = "block";
}

function handlePhotoInput(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const imgSrc = e.target.result;
    if (images.length === 0) {
      setMainImage(imgSrc);
    }
    if (images.length < 5) {
      images.push(imgSrc);
      updateMiniatures();
    }
  };
  reader.readAsDataURL(file);
}

btnNuovi.onclick = () => {
  selectedType = "RICAMBI NUOVI";
  btnUsati.style.display = "none";
  cameraInput.click();
};

btnUsati.onclick = () => {
  selectedType = "RICAMBI USATI";
  btnNuovi.style.display = "none";
  cameraInput.click();
};

addMoreBtn.onclick = () => {
  cameraInput.click();
};

cameraInput.onchange = handlePhotoInput;

confirmBtn.onclick = () => {
  let descrizione = `<strong>Tipo:</strong> ${selectedType}<br>`;
  descrizione += `<strong>Quantità foto:</strong> ${images.length}<br><br>`;
  descrizione += `🔍 <strong>Analisi AI:</strong><br>`;
  descrizione += `Parte identificata come possibile componente frizione o trasmissione. <br>`;
  descrizione += `Presenza di graffi, ossidazione superficiale e residui di utilizzo. <br>`;
  descrizione += `Suggerita verifica compatibilità con modello Ducati Monster.`;

  aiDescription.innerHTML = descrizione;
  aiDescription.style.display = "block";
};
