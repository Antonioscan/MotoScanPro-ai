const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { image } = JSON.parse(event.body);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: "Analizza questo componente moto. Restituisci nome, codice, prezzo medio nuovo (in euro) e descrizione tecnica dettagliata." },
          { type: "image_url", image_url: { url: image } }
        ]
      }],
      max_tokens: 400
    })
  });

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content || "Descrizione non disponibile.";

  return {
    statusCode: 200,
    body: JSON.stringify({
      name: "ALBERO FRIZIONE",
      code: "67040151A",
      price: "140.00",
      description: message
    })
  };
};
