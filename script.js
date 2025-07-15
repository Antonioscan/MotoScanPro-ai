let selectedType = "";
let imageList = [];
let selectedIndex = 0;

function selectType(type) {
  selectedType = type;
  document.querySelectorAll(".orange-button")[0].style.display = "none";
  document.querySelectorAll(".orange-button")[1].style.display = "none";
  document.getElementById("addPhotoButton").style.display = "inline-block";
}

function handleFiles(files) {
  for (let file of files) {
    if (imageList.length >= 6) break;
    const reader = new FileReader();
    reader.onload = () => {
      imageList.push(reader.result);
      selectedIndex = imageList.length - 1;
      updatePreviews();
    };
    reader.readAsDataURL(file);
  }
}

function updatePreviews() {
  const previewMain = document.getElementById("previewMain");
  const previewThumbs = document.getElementById("previewThumbs");

  previewMain.innerHTML = imageList[selectedIndex] ? `<img src="${imageList[selectedIndex]}" />` : "";
  previewThumbs.innerHTML = imageList.map((src, i) => `
    <div class="thumbnail">
      <img src="${src}" class="${i === selectedIndex ? 'selected' : ''}" onclick="selectImage(${i})" />
      <button class="remove-btn" onclick="removeImage(${i})">×</button>
    </div>
  `).join("");

  document.getElementById("analyzeButton").style.display = imageList.length ? "inline-block" : "none";
}

function selectImage(index) {
  selectedIndex = index;
  updatePreviews();
}

function removeImage(index) {
  imageList.splice(index, 1);
  if (selectedIndex >= imageList.length) selectedIndex = imageList.length - 1;
  updatePreviews();
}

async function analyzeImages() {
  const res = await fetch("/.netlify/functions/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images: imageList })
  });
  const data = await res.json();
  document.getElementById("description").textContent = data.description || "Nessuna descrizione trovata";
  document.getElementById("code").textContent = "Codice: " + (data.code || "non disponibile");
  document.getElementById("price").value = data.price || "";
}
