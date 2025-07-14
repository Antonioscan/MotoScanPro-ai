let selectedType = '';
let images = [];
let mainPreview = null;

function selectType(type) {
  selectedType = type;
  document.getElementById('nuoviBtn').style.display = 'none';
  document.getElementById('usatiBtn').style.display = 'none';
  document.getElementById('addPhotoBtn').style.display = 'inline-block';
  document.getElementById('addPhotoInput').click();
}

function openFileDialog() {
  if (images.length < 6) {
    document.getElementById('addPhotoInput').click();
  } else {
    alert("Hai raggiunto il numero massimo di 6 foto.");
  }
}

function handleImageUpload(event) {
  const files = event.target.files;
  if (!files.length) return;

  for (let i = 0; i < files.length && images.length < 6; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      images.push(imageData);
      updatePreview();
    };
    reader.readAsDataURL(file);
  }
}

function updatePreview() {
  const preview = document.getElementById('preview');
  const thumbnails = document.getElementById('thumbnails');
  const analyzeBtn = document.getElementById('analyzeBtn');

  preview.innerHTML = '';
  thumbnails.innerHTML = '';

  if (images.length > 0) {
    mainPreview = images[images.length - 1];
    const mainImg = document.createElement('img');
    mainImg.id = 'main-preview';
    mainImg.src = mainPreview;
    preview.appendChild(mainImg);
    analyzeBtn.style.display = 'inline-block';
  } else {
    document.getElementById('addPhotoBtn').style.display = 'none';
    document.getElementById('nuoviBtn').style.display = 'inline-block';
    document.getElementById('usatiBtn').style.display = 'inline-block';
    analyzeBtn.style.display = 'none';
  }

  images.forEach((img, index) => {
    const container = document.createElement('div');
    container.className = 'thumbnail-container';

    const thumb = document.createElement('img');
    thumb.src = img;
    thumb.className = 'thumbnail';
    if (img === mainPreview) thumb.classList.add('selected');
    thumb.onclick = () => {
      mainPreview = img;
      updatePreview();
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '×';
    delBtn.onclick = () => {
      images.splice(index, 1);
      updatePreview();
    };

    container.appendChild(thumb);
    container.appendChild(delBtn);
    thumbnails.appendChild(container);
  });
}

async function analyzeImages() {
  const response = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images }),
  });
  const result = await response.json();
  alert(`Descrizione: ${result.description}\nCodice: ${result.code}\nPrezzo medio: €${result.price}`);
}
