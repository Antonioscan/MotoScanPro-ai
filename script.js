let tipoRicambio = null;

function selezionaTipo(tipo) {
  tipoRicambio = tipo;
  localStorage.setItem('tipoRicambio', tipo);
  document.getElementById('aggiungiFoto').style.display = 'block';
  document.getElementById('schedaProdotto').style.display = 'none';
  document.getElementById('ebayButton').style.display = 'none';
}

function handleFileUpload() {
  const input = document.getElementById('fileInput');
  const files = input.files;

  if (files.length === 0) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64Image = reader.result;

    // Mostra anteprima
    const preview = document.getElementById('previewContainer');
    preview.innerHTML = `<img src="${base64Image}" alt="Preview Ricambio" />`;

    // Chiamata alla funzione AI
    fetch('/.netlify/functions/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById('schedaProdotto').style.display = 'block';
      document.getElementById('schedaProdotto').innerHTML = `
        <h2>${data.name}</h2>
        <p><strong>Codice:</strong> ${data.code}</p>
        <p><strong>Prezzo medio nuovo:</strong> €${data.price}</p>
        <p>${data.description}</p>
        <p><strong>Tipo selezionato:</strong> ${tipoRicambio}</p>
      `;
      document.getElementById('ebayButton').style.display = 'block';
    });
  };

  reader.readAsDataURL(files[0]);
}

function creaInserzione() {
  alert("Inserzione eBay generata (simulazione). Tipo: " + tipoRicambio);
}
