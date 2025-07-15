let selectedType = null;
let photos = [];

document.getElementById("nuoviBtn").addEventListener("click", () => selectType("nuovi"));
document.getElementById("usatiBtn").addEventListener("click", () => selectType("usati"));
document.getElementById("addPhotoBtn").addEventListener("click", () => {
  if (photos.length < 5) {
    document.getElementById("photoInput").click();
  }
});

document.getElementById("photoInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const imageUrl = reader.result;
    photos.push(imageUrl);
    updatePreview();
  };
  reader.readAsDataURL(file);
});

document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const response = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    body: JSON.stringify({ images: photos }),
    headers: { 'Content-Type': 'application/json' },
  });

  const result = await response.json();
  document.getElementById("aiOutput").classList.remove("hidden");
  document.getElementById("description").textContent = result.description || "Nessuna descrizione trovata";
  document.getElementById("code").textContent = "Codice: " + (result.code || "non disponibile");
});

function selectType(type) {
  selectedType = type;
  document.getElementById("nuoviBtn").classList.add("hidden");
  document.getElementById("usatiBtn").classList.add("hidden");
  document.getElementById("addPhotoBtn").classList.remove("hidden");
}

function updatePreview() {
  const container = document.getElementById("previewContainer");
  container.innerHTML = "";

  photos.forEach((src, index) => {
    const div = document.createElement("div");
    div.style.position = "relative";
    div.innerHTML = `<img src="${src}" class="preview-image" /><button class="delete-button" onclick="removePhoto(${index})">x</button>`;
    container.appendChild(div);
  });

  document.getElementById("analyzeBtn").classList.toggle("hidden", photos.length === 0);
  if (photos.length === 0) {
    document.getElementById("nuoviBtn").classList.remove("hidden");
    document.getElementById("usatiBtn").classList.remove("hidden");
    document.getElementById("addPhotoBtn").classList.add("hidden");
    document.getElementById("aiOutput").classList.add("hidden");
  }
}

window.removePhoto = function(index) {
  photos.splice(index, 1);
  updatePreview();
};
