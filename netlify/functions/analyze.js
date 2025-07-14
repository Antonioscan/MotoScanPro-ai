const fetch = require('node-fetch');

exports.handler = async function(event) {
  try {
    const { image } = JSON.parse(event.body);
    const response = await fetch('https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {
          image
        }
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Errore nell\'analisi immagine', details: err.message })
    };
  }
};
