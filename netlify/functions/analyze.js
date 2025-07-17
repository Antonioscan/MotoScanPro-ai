const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const imageBase64 = body.images?.[0];

    if (!imageBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Nessuna immagine fornita" }),
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analizza l'oggetto nella foto. Genera una descrizione sintetica ma professionale. Cerca in rete su qualsiasi fonte disponibile, compresi eBay e Amazon, per identificare marca e modello precisi. Genera una descrizione seguendo questa struttura obbligatoria:

1. Marca e modello (se riconoscibili o deducibili).
2. Caratteristiche principali: molto semplici e corte (es: "leva freno in metallo, lunghezza 20cm").
3. Eventuali usure o danni visibili (es: "leggeri graffi").

Aggiungi anche codice prodotto (se rilevabile) e prezzo medio stimato in euro (basato su fonti online).`,
              },
              {
                type: "image_url",
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data }),
      };
    }

    const aiText = data.choices[0]?.message?.content || '';

    // Estrazioni semplificate
    const matchCode = aiText.match(/(?:codice|code)[:\-]?\s*([A-Z0-9\-]+)/i);
    const matchPrice = aiText.match(/(?:prezzo|price|€)[:\-]?\s*(\d+[.,]?\d*)/i);
    const matchBrand = aiText.match(/(?:marca|brand)[:\-]?\s*([A-Z][a-zA-Z0-9]+)/i);

    return {
      statusCode: 200,
      body: JSON.stringify({
        description: aiText.trim(),
        code: matchCode ? matchCode[1].trim() : '',
        price: matchPrice ? matchPrice[1].replace(',', '.').trim() : '',
        brand: matchBrand ? matchBrand[1].trim() : ''
      }),
    };
  } catch (err) {
    console.error("Errore AI:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore AI interno" }),
    };
  }
};
