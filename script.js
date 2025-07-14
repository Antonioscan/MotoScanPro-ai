let currentChoice = null;
let images = [];

function setChoice(choice) {
  currentChoice = choice;
  localStorage.setItem('selectedChoice', choice);
  document.getElementById('choiceButtons').style.display = 'none';
  document.getElementById('uploadSection').style.display = 'block';
}

function triggerFileInput() {
  if (images.length < 5) {
    document.getElementById('fileInput').click();
  }
}

function handleFile(event) {
  const file = event.target.files[0];
  if (!file || images.length >= 5) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64 = e.target.result;
    images.push(base64);
    updatePreview();
  };
  reader.readAsDataURL(file);
}

function updatePreview() {
  const mainPreview = document.getElementById('mainPreview');
  const thumbnails = document.getElementById('thumbnails');
  const addPhotoBtn = document.getElementById('addPhotoBtn');

  if (images.length > 0) {
    mainPreview.src = images[images.length - 1];
    mainPreview.style.display = 'block';
    addPhotoBtn.style.display = images.length < 5 ? 'inline-block' : 'none';
  } else {
    mainPreview.style.display = 'none';
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('choiceButtons').style.display = 'flex';
    localStorage.removeItem('selectedChoice');
  }

  thumbnails.innerHTML = '';
  images.forEach((img, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'thumbnail-wrapper';

    const thumbnail = document.createElement('img');
    thumbnail.src = img;
    thumbnail.className = 'thumbnail';
    thumbnail.onclick = () => {
      mainPreview.src = img;
      document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('selected'));
      thumbnail.classList.add('selected');
    };

    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'delete-icon';
    deleteBtn.innerText = '×';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      images.splice(index, 1);
      updatePreview();
    };

    wrapper.appendChild(thumbnail);
    wrapper.appendChild(deleteBtn);
    thumbnails.appendChild(wrapper);
  });
}

// On load: restore choice
window.onload = () => {
  const savedChoice = localStorage.getItem('selectedChoice');
  if (savedChoice) {
    currentChoice = savedChoice;
    document.getElementById('choiceButtons').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'block';
  }
};
