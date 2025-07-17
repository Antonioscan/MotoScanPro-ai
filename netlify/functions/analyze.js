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

    // 1. ANALISI AI DELL'IMMAGINE
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

    // 2. ESTRAZIONE DATI DAL TESTO AI
    const matchBrand = aiText.match(/(?:marca e modello)\*{2}[:\-]?\s*([^\n]+)/i);
    const matchCode = aiText.match(/(?:codice prodotto)\*{2}[:\-]?\s*([A-Z0-9\- ]+)/i);
    const matchPrice = aiText.match(/(?:prezzo medio stimato)[^\d]*([\d.,]+)/i);

    let code = matchCode ? matchCode[1].trim() : '';
    let price = matchPrice ? matchPrice[1].replace(',', '.').trim() : '';
    let brand = matchBrand ? matchBrand[1].trim() : '';

    // 3. SE NON C'È IL PREZZO → CERCA SU https://www.ricambi-ducati.it (SerpAPI)
    if (!price && code) {
      const serpApiKey = process.env.SERPAPI_API_KEY;

      const serpResponse = await fetch(`https://serpapi.com/search.json?engine=ebay&ebay_domain=ebay.it&q=${encodeURIComponent(code)}&api_key=${serpApiKey}`);
      const serpData = await serpResponse.json();

      const result = serpData.organic_results?.[0];

      if (result?.price) {
        price = result.price.replace(/[^\d.,]/g, '').replace(',', '.').trim();
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        description: aiText.trim(),
        brand,
        code,
        price
      }),
    };
  } catch (err) {
    console.error("Errore AI o SerpAPI:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore AI interno" }),
    };
  }
};
