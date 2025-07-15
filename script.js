let selectedType = null;
let images = [];

const nuoviBtn = document.getElementById("nuoviBtn");
const usatiBtn = document.getElementById("usatiBtn");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const photoInput = document.getElementById("photoInput");
const previewContainer = document.getElementById("previewContainer");
const analyzeBtn = document.getElementById("analyzeBtn");
const aiResult = document.getElementById("aiResult");
const aiDescription = document.getElementById("aiDescription");
const aiCode = document.getElementById("aiCode");
const priceInput = document.getElementById("priceInput");

function updateUI() {
  addPhotoBtn.style.display = images.length < 5 ? "inline-block" : "none";
  analyzeBtn.style.display = images.length > 0 ? "inline-block" : "none";
  aiResult.style.display = "none";
  renderPreview();
}

function renderPreview() {
  previewContainer.innerHTML = "";
  images.forEach((img, index) => {
    const container = document.createElement("div");
    container.className = "preview-thumb";

    const imageEl = document.createElement("img");
    imageEl.src = img;

    const delBtn = document.createElement("button");
    delBtn.innerText = "×";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => {
      images.splice(index, 1);
      updateUI();
      if (images.length === 0) {
        addPhotoBtn.style.display = "none";
        nuoviBtn.style.display = "inline-block";
        usatiBtn.style.display = "inline-block";
      }
    };

    container.appendChild(imageEl);
    container.appendChild(delBtn);
    previewContainer.appendChild(container);
  });
}

nuoviBtn.onclick = () => {
  selectedType = "nuovi";
  nuoviBtn.style.display = "none";
  usatiBtn.style.display = "none";
  addPhotoBtn.style.display = "inline-block";
};

usatiBtn.onclick = () => {
  selectedType = "usati";
  nuoviBtn.style.display = "none";
  usatiBtn.style.display = "none";
  addPhotoBtn.style.display = "inline-block";
};

addPhotoBtn.onclick = () => {
  photoInput.click();
};

photoInput.onchange = async (event) => {
  const files = Array.from(event.target.files);
  for (const file of files) {
    if (images.length >= 5) break;
    const reader = new FileReader();
    reader.onload = (e) => {
      images.push(e.target.result);
      updateUI();
    };
    reader.readAsDataURL(file);
  }
  photoInput.value = "";
};

analyzeBtn.onclick = async () => {
  aiResult.style.display = "block";
  aiDescription.innerText = "Analisi in corso...";
  aiCode.innerText = "";
  priceInput.value = "";

  try {
    const response = await fetch("/.netlify/functions/analyze", {
      method: "POST",
      body: JSON.stringify({ images }),
    });
    const data = await response.json();
    aiDescription.innerText = data.description || "Nessuna descrizione trovata";
    aiCode.innerText = "Codice: " + (data.code || "non disponibile");
    priceInput.value = data.price || "";
  } catch (err) {
    aiDescription.innerText = "Errore durante l’analisi AI.";
    aiCode.innerText = "";
  }
};
