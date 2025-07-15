const fileInput = document.getElementById('fileInput');
const newPartBtn = document.getElementById('newPartBtn');
const usedPartBtn = document.getElementById('usedPartBtn');
const previewContainer = document.getElementById('previewContainer');
const mainPreview = document.getElementById('mainPreview');
const thumbnails = document.getElementById('thumbnails');
const analyzeBtn = document.getElementById('analyzeBtn');
const description = document.getElementById('description');
const code = document.getElementById('code');
const resultBox = document.getElementById('resultBox');

let selectedImageIndex = 0;
let base64Images = [];

function resetUI() {
  thumbnails.innerHTML = '';
  mainPreview.src = '';
  mainPreview.style.display = 'none';
  resultBox.style.display = 'none';
  analyzeBtn.style.display = 'none';
}

function showMainImage(index) {
  selectedImageIndex = index;
  mainPreview.src = base64Images[index];
  mainPreview.style.display = 'block';

  Array.from(thumbnails.children).forEach((thumb, i) => {
    thumb.classList.toggle('selected', i === index);
  });
}

function updateThumbnails() {
  thumbnails.innerHTML = '';
  base64Images.forEach((data, i) => {
    const thumb = document.createElement('img');
    thumb.src = data;
    thumb.classList.toggle('selected', i === selectedImageIndex);
    thumb.addEventListener('click', () => showMainImage(i));
    thumbnails.appendChild(thumb);
  });
}

function handleFiles(files) {
  resetUI();
  base64Images = [];

  const promises = Array.from(files).map(file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        base64Images.push(e.target.result);
        resolve();
      };
      reader.readAsDataURL(file);
    });
  });

  Promise.all(promises).then(() => {
    updateThumbnails();
    showMainImage(0);
    analyzeBtn.style.display = 'inline-block';
  });
}

newPartBtn.addEventListener('click', () => fileInput.click());
usedPartBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    handleFiles(fileInput.files);
  }
});

analyzeBtn.addEventListener('click', async () => {
  const imageBase64 = base64Images[selectedImageIndex];
  const result = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    body: JSON.stringify({ image: imageBase64 }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

  description.textContent = result.description || 'Nessuna descrizione trovata';
  code.textContent = result.code ? `Codice: ${result.code}` : 'Codice: non disponibile';
  resultBox.style.display = 'block';
});
