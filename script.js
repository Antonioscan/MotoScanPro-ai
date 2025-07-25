let images = [];
let selectedImageIndex = 0;
let selectedType = '';

const fileInput = document.getElementById('fileInput');
const mainImageContainer = document.getElementById('mainImageContainer');
const thumbnailContainer = document.getElementById('thumbnailContainer');
const addPhotoBtn = document.getElementById('addPhotoBtn');
const analyzeBtn = document.getElementById('analyzeBtn');

// Nuovi campi AI
const descriptionField = document.getElementById('description');
const brandField = document.getElementById('brand');
const codeField = document.getElementById('code');
const priceField = document.getElementById('price');

document.getElementById('newPartBtn').onclick = () => {
  selectedType = 'nuovo';
  document.getElementById('newPartBtn').style.display = 'none';
  document.getElementById('usedPartBtn').style.display = 'none';
  addPhotoBtn.style.display = 'inline-block';
};

document.getElementById('usedPartBtn').onclick = () => {
  selectedType = 'usato';
  document.getElementById('newPartBtn').style.display = 'none';
  document.getElementById('usedPartBtn').style.display = 'none';
  addPhotoBtn.style.display = 'inline-block';
};

// ✅ Fotocamera diretta su mobile
addPhotoBtn.onclick = () => {
  fileInput.setAttribute("accept", "image/*");
  fileInput.setAttribute("capture", "environment");
  if (images.length < 5) fileInput.click();
};

fileInput.onchange = (e) => {
  const files = Array.from(e.target.files);
  if (files.length + images.length > 5) return;

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      images.push(reader.result);
      updateImages();
    };
    reader.readAsDataURL(file);
  });
};

function updateImages() {
  // ✅ Mostra immagine principale
  mainImageContainer.innerHTML = `<img src="${images[selectedImageIndex]}" />`;

  // ✅ Svuota e popola miniature
  thumbnailContainer.innerHTML = '';

  images.forEach((img, i) => {
    const thumbDiv = document.createElement('div');
    thumbDiv.className = 'thumbnail';

    const image = document.createElement('img');
    image.src = img;
    image.onclick = () => {
      selectedImageIndex = i;
      updateImages();
    };

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerText = '❌';
    removeBtn.onclick = () => {
      images.splice(i, 1);
      if (selectedImageIndex >= images.length) selectedImageIndex = 0;
      updateImages();
      if (images.length === 0) {
        addPhotoBtn.style.display = 'inline-block';
        analyzeBtn.style.display = 'none';
      }
    };

    thumbDiv.appendChild(image);
    thumbDiv.appendChild(removeBtn);
    thumbnailContainer.appendChild(thumbDiv);
  });

  if (images.length > 0) {
    analyzeBtn.style.display = 'inline-block';
    addPhotoBtn.disabled = images.length >= 5;
  }
}

analyzeBtn.onclick = async () => {
  if (images.length === 0) {
    alert("Carica almeno una foto.");
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.innerText = "Analisi in corso...";

  try {
    const res = await fetch('/.netlify/functions/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images, type: selectedType })
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Errore AI: " + (data.error?.message || JSON.stringify(data.error)));
      return;
    }

    // ✅ Mostra descrizione AI, marca, codice e prezzo
    descriptionField.value = data.description || 'Nessuna descrizione trovata';
    brandField.value = data.brand || '';
    codeField.value = data.code || '';
    priceField.value = data.price || '';

    // ✅ Adattamento automatico altezza descrizione
    descriptionField.style.height = "auto";
    descriptionField.style.height = (descriptionField.scrollHeight + 10) + "px";

  } catch (err) {
    alert("Errore di rete: " + err.message);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerText = "Analizza con AI";
  }
};

// ✅ Adattamento anche se l’utente modifica manualmente il testo
descriptionField.addEventListener("input", () => {
  descriptionField.style.height = "auto";
  descriptionField.style.height = (descriptionField.scrollHeight + 10) + "px";
});
