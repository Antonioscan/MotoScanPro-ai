function triggerPhoto() {
  document.getElementById('fileInput').click();
}

function handleFiles(event) {
  const files = event.target.files;
  const preview = document.getElementById("preview");
  const results = document.getElementById("results");
  preview.innerHTML = '';
  results.innerHTML = '';

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = document.createElement("img");
      img.src = reader.result;
      preview.appendChild(img);

      fetch("/.netlify/functions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: reader.result })
      })
      .then(res => res.json())
      .then(data => {
        results.innerHTML += `
          <div class="card">
            <h2>${data.name}</h2>
            <p><strong>Codice:</strong> ${data.code} <span style="float:right;"><strong>Prezzo medio nuovo:</strong> €${data.price}</span></p>
            <p>${data.description}</p>
            <button class="ebay-button">Crea inserzione eBay</button>
          </div>
        `;
      });
    };
    reader.readAsDataURL(file);
  });
}
