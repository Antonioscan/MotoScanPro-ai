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
Analizza accuratamente l'immagine per creare una descrizione professionale pronta per essere pubblicata su eBay. Segui esattamente questo schema:

1. **Marca e modello**: (es. "Dell'Orto PHBG 21", "Showa Mono 46", ecc.). Se non visibile, scrivi "Non disponibile".
2. **Descrizione tecnica**: componenti, dimensioni, compatibilità, specifiche tecniche.
3. **Condizioni visive**: graffi, usura, rotture, oppure "in ottime condizioni".
4. **Utilizzo consigliato**: per quali veicoli, motori, situazioni è adatto.
5. **Codice prodotto**: se identificabile da foto o inciso.
6. **Prezzo medio stimato €**: solo se deducibile da prodotti simili.
y
Usa uno stile diretto, senza frasi introduttive, senza disclaimer e senza formule vaghe. Il testo deve essere perfettamente strutturato e pronto per la vendita.
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

    // Espressioni regolari per estrazione dati
    const matchBrand = aiText.match(/(?:marca e modello)\*{2}[:\-]?\s*([^\n]+)/i);
    const matchCode = aiText.match(/(?:codice prodotto)\*{2}[:\-]?\s*([A-Z0-9\-]+)/i);
    const matchPrice = aiText.match(/(?:prezzo medio stimato)[^\d]*([\d.,]+)/i);

    return {
      statusCode: 200,
      body: JSON.stringify({
        description: aiText.trim(),
        brand: matchBrand ? matchBrand[1].trim() : '',
        code: matchCode ? matchCode[1].trim() : '',
        price: matchPrice ? matchPrice[1].replace(',', '.').trim() : ''
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
