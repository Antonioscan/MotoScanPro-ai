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
                text: `
Crea una descrizione professionale e sintetica per una futura vendita su eBay, basata sull'immagine allegata.

Segui questo formato:

1. **Marca e modello**: se identificabili o ipotizzabili.
2. **Descrizione tecnica**: componenti, dimensioni, compatibilità, specifiche.
3. **Condizioni visive**: usura, graffi, stato (es. "in buone condizioni", "usato con segni di ruggine", ecc.).
4. **Utilizzo consigliato**: per quali veicoli o situazioni è adatto.
5. **Codice prodotto (se presente)**.
6. **Prezzo medio stimato (se deducibile da prodotti simili)**.

Usa uno stile chiaro e professionale, pronto per essere pubblicato su eBay. Non aggiungere disclaimer o frasi inutili.

Non scrivere frasi generiche, non scrivere che non puoi analizzare, non dare spiegazioni. Rispondi sempre nel formato richiesto, anche in caso di informazioni parziali.
                `.trim(),
              },
              {
                type: "image_url",
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
        max_tokens: 500,
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

    // Estrazioni dai contenuti AI
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
