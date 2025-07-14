let selectedCategory = null;
let imageFiles = [];
let currentPreviewIndex = 0;

const nuovoBtn = document.getElementById('nuovo-btn');
const usatoBtn = document.getElementById('usato-btn');
const addPhotoBtn = document.getElementById('add-photo-btn');
const uploadInput = document.getElementById('upload-input');
const mainPreview = document.getElementById('main-preview');
const thumbnailsContainer = document.getElementById('thumbnails');

nuovoBtn.onclick = () => selectCategory('nuovo');
usatoBtn.onclick = () => selectCategory('usato');

addPhotoBtn.onclick = () => {
  uploadInput.click();
};

uploadInput.onchange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    imageFiles.push(e.target.result);
    currentPreviewIndex = imageFiles.length - 1;
    updatePreviews();
  };
  reader.readAsDataURL(file);
};

function selectCategory(category) {
  selectedCategory = category;
  nuovoBtn.style.display = 'none';
  usatoBtn.style.display = 'none';
  addPhotoBtn.style.display = 'inline-block';
}

function updatePreviews() {
  if (imageFiles.length === 0) {
    mainPreview.style.display = 'none';
    mainPreview.src = '';
    thumbnailsContainer.innerHTML = '';
    return;
  }

  mainPreview.src = imageFiles[currentPreviewIndex];
  mainPreview.style.display = 'block';

  thumbnailsContainer.innerHTML = '';
  imageFiles.forEach((img, index) => {
    const container = document.createElement('div');
    container.classList.add('thumbnail-container');

    const thumb = document.createElement('img');
    thumb.src = img;
    thumb.classList.add('thumbnail');
    if (index === currentPreviewIndex) thumb.classList.add('selected');
    thumb.onclick = () => {
      currentPreviewIndex = index;
      updatePreviews();
    };

    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('delete-icon');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.onclick = () => {
      imageFiles.splice(index, 1);
      if (currentPreviewIndex >= imageFiles.length) currentPreviewIndex = imageFiles.length - 1;
      updatePreviews();
    };

    container.appendChild(thumb);
    container.appendChild(deleteBtn);
    thumbnailsContainer.appendChild(container);
  });
}
