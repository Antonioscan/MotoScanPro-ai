const openai = require("openai");
openai.apiKey = process.env.OPENAI_API_KEY;

exports.handler = async (event) => {
  try {
    const { images } = JSON.parse(event.body);

    if (!images || images.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Nessuna immagine fornita." }),
      };
    }

    const prompt = `
Se stai osservando uno o più componenti per moto da queste foto, fornisci una breve descrizione professionale del componente identificato, un codice compatibile (se visibile o deducibile), e una stima realistica del prezzo di vendita.
Formatta il risultato in JSON come:
{
  "description": "...",
  "code": "...",
  "price": "..."
}
Se le immagini non sono chiare o non mostrano oggetti validi, scrivi: descrizione assente.
`;

    const base64images = images.map((base64) => ({
      type: "image_url",
      image_url: { url: base64 }
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...base64images
          ],
        },
      ],
      max_tokens: 500,
    });

    const textResponse = completion.choices[0].message.content;

    // Prova a estrarre descrizione e codice via regex JSON
    let parsed = {};
    try {
      parsed = JSON.parse(textResponse);
    } catch {
      parsed.description = textResponse.trim();
      parsed.code = "non disponibile";
      parsed.price = "";
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        description: parsed.description || "Nessuna descrizione trovata",
        code: parsed.code || "non disponibile",
        price: parsed.price || ""
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore analisi AI: " + error.message }),
    };
  }
};
