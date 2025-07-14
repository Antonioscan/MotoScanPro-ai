const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function (event) {
  try {
    const { images } = JSON.parse(event.body);
    const base64Images = images.map((img, index) => ({
      type: "image_url",
      image_url: { url: img, detail: "low" },
    }));

    const chat = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content:
            "Sei un esperto ricambista per moto. Analizza le immagini, identifica il componente, descrivilo in modo tecnico, cerca il codice ricambio originale o compatibile e stima un prezzo medio di vendita. Rispondi solo con i 3 campi: descrizione, codice e prezzo.",
        },
        {
          role: "user",
          content: [
            ...base64Images,
            {
              type: "text",
              text: "Analizza le foto e genera descrizione, codice prodotto e prezzo.",
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const reply = chat.choices[0].message.content;
    const [descrizione, codice, prezzo] = reply.split("\n").map((r) => r.split(":")[1].trim());

    return {
      statusCode: 200,
      body: JSON.stringify({
        description: descrizione,
        code: codice,
        price: prezzo,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore durante l'analisi AI", details: error.message }),
    };
  }
};
