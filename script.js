let images = [];
let selectedImageIndex = 0;
let selectedType = '';

const fileInput = document.getElementById('fileInput');
const mainImageContainer = document.getElementById('mainImageContainer');
const thumbnailContainer = document.getElementById('thumbnailContainer');
const addPhotoBtn = document.getElementById('addPhotoBtn');
const analyzeBtn = document.getElementById('analyzeBtn');

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
  mainImageContainer.innerHTML = `<img src="${images[selectedImageIndex]}" style="width:100%; border-radius:16px; margin-top:16px;" />`;

  thumbnailContainer.innerHTML = '';

  images.forEach((img, i) => {
    const thumbDiv = document.createElement('div');
    thumbDiv.style.position = 'relative';
    thumbDiv.style.display = 'inline-block';
    thumbDiv.style.margin = '6px';

    const image = document.createElement('img');
    image.src = img;
    image.style.width = '60px';
    image.style.height = '60px';
    image.style.borderRadius = '10px';
    image.style.border = '2px solid #2196F3';
    image.style.cursor = 'pointer';
    image.onclick = () => {
      selectedImageIndex = i;
      updateImages();
    };

    const removeBtn = document.createElement('button');
    removeBtn.innerText = '❌';
    removeBtn.className = 'remove-btn';
    removeBtn.style.position = 'absolute';
    removeBtn.style.top = '-6px';
    removeBtn.style.right = '-6px';
    removeBtn.style.background = '#fff';
    removeBtn.style.border = '1px solid #ccc';
    removeBtn.style.borderRadius = '50%';
    removeBtn.style.fontSize = '12px';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.width = '20px';
    removeBtn.style.height = '20px';
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

    document.getElementById('description').value = data.description || 'Nessuna descrizione trovata';
    document.getElementById('code').value = data.code || '';
    document.getElementById('price').value = data.price || '';

  } catch (err) {
    alert("Errore di rete: " + err.message);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerText = "Analizza con AI";
  }
};
