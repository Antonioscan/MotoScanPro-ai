let selectedType = '';
let images = [];
let selectedImageIndex = 0;

document.getElementById('newPartsBtn').addEventListener('click', () => handleSelection('nuovi'));
document.getElementById('usedPartsBtn').addEventListener('click', () => handleSelection('usati'));
document.getElementById('addPhotoBtn').addEventListener('click', () => document.getElementById('imageInput').click());
document.getElementById('imageInput').addEventListener('change', handleImageUpload);
document.getElementById('analyzeBtn').addEventListener('click', analyzeImagesWithAI);

function handleSelection(type) {
  selectedType = type;
  document.getElementById('newPartsBtn').style.display = 'none';
  document.getElementById('usedPartsBtn').style.display = 'none';
  document.getElementById('addPhotoBtn').classList.remove('hidden');
}

function handleImageUpload(event) {
  const files = Array.from(event.target.files);
  if ((images.length + files.length) > 6) return alert('Massimo 6 foto');

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      images.push(e.target.result);
      selectedImageIndex = images.length - 1;
      renderImages();
    };
    reader.readAsDataURL(file);
  });
}

function renderImages() {
  const mainContainer = document.getElementById('mainImageContainer');
  const thumbs = document.getElementById('thumbnailsContainer');

  mainContainer.innerHTML = '';
  thumbs.innerHTML = '';

  if (images.length > 0) {
    const img = document.createElement('img');
    img.src = images[selectedImageIndex];
    mainContainer.appendChild(img);
    document.getElementById('analyzeBtn').classList.remove('hidden');
  } else {
    document.getElementById('addPhotoBtn').classList.add('hidden');
    document.getElementById('newPartsBtn').style.display = 'inline-block';
    document.getElementById('usedPartsBtn').style.display = 'inline-block';
    document.getElementById('analyzeBtn').classList.add('hidden');
  }

  images.forEach((src, index) => {
    const container = document.createElement('div');
    container.className = 'thumbnail-container';

    const thumb = document.createElement('img');
    thumb.src = src;
    thumb.className = 'thumbnail';
    if (index === selectedImageIndex) thumb.classList.add('selected');
    thumb.onclick = () => {
      selectedImageIndex = index;
      renderImages();
    };

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.onclick = () => {
      images.splice(index, 1);
      if (selectedImageIndex >= images.length) selectedImageIndex = images.length - 1;
      renderImages();
    };

    container.appendChild(thumb);
    container.appendChild(removeBtn);
    thumbs.appendChild(container);
  });
}

async function analyzeImagesWithAI() {
  const response = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images })
  });
  const data = await response.json();

  document.getElementById('aiResult').classList.remove('hidden');
  document.getElementById('description').textContent = data.description || 'Nessuna descrizione trovata';
  document.getElementById('code').textContent = 'Codice: ' + (data.code || 'non disponibile');
}
