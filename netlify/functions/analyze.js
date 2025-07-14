const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { image } = JSON.parse(event.body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analizza questa immagine di un ricambio moto. Restituisci nome componente, codice identificativo, prezzo medio nuovo in euro e una descrizione tecnica." },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 400
      })
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "Analisi non disponibile.";

    return {
      statusCode: 200,
      body: JSON.stringify({ descrizione: output })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ errore: "Errore durante l'analisi AI", dettagli: error.message })
    };
  }
};
