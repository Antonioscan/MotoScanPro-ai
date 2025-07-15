let selectedType = '';
let images = [];

document.getElementById("newPartsBtn").onclick = () => selectType("nuovi");
document.getElementById("usedPartsBtn").onclick = () => selectType("usati");
document.getElementById("uploadBtn").onclick = () => {
  if (images.length < 6) document.getElementById("fileInput").click();
};
document.getElementById("fileInput").onchange = handleImageUpload;
document.getElementById("analyzeBtn").onclick = analyzeImages;

function selectType(type) {
  selectedType = type;
  document.getElementById("buttons").style.display = "none";
  document.getElementById("uploadSection").style.display = "block";
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file || images.length >= 6) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    images.push(e.target.result);
    updatePreview();
    if (images.length > 0) {
      document.getElementById("analyzeBtn").style.display = "inline-block";
    }
  };
  reader.readAsDataURL(file);
}

function updatePreview() {
  const preview = document.getElementById("previewContainer");
  const thumbs = document.getElementById("thumbnailContainer");
  preview.innerHTML = "";
  thumbs.innerHTML = "";

  if (images.length > 0) {
    const mainImg = document.createElement("img");
    mainImg.src = images[images.length - 1];
    mainImg.className = "preview";
    preview.appendChild(mainImg);
  }

  images.forEach((img, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "thumbnail-wrapper";

    const thumbnail = document.createElement("img");
    thumbnail.src = img;
    thumbnail.className = "thumbnail";
    thumbnail.onclick = () => {
      const mainImg = document.querySelector(".preview");
      mainImg.src = img;
      document.querySelectorAll(".thumbnail").forEach(t => t.classList.remove("selected"));
      thumbnail.classList.add("selected");
    };

    const del = document.createElement("div");
    del.className = "delete-icon";
    del.innerHTML = "&times;";
    del.onclick = () => {
      images.splice(index, 1);
      if (images.length === 0) {
        document.getElementById("buttons").style.display = "block";
        document.getElementById("uploadSection").style.display = "none";
        document.getElementById("analyzeBtn").style.display = "none";
      }
      updatePreview();
    };

    wrapper.appendChild(thumbnail);
    wrapper.appendChild(del);
    thumbs.appendChild(wrapper);
  });
}

async function analyzeImages() {
  const response = await fetch("/.netlify/functions/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images, selectedType })
  });
  const data = await response.json();
  const result = document.getElementById("resultContainer");
  result.innerHTML = `
    <h3>Descrizione AI</h3>
    <p>${data.description}</p>
    <p>Codice: ${data.code}</p>
    <p>Prezzo suggerito: € <input type="number" value="${data.price}" style="width:100px;" /></p>
  `;
}
