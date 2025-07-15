const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const imageBase64 = body.images[0]; // usa la prima immagine per l'analisi

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Analizza l'oggetto nella foto. Genera una descrizione sintetica ma professionale, con codice prodotto se rilevabile e un prezzo medio.` },
            { type: "image_url", image_url: { url: imageBase64 } }
          ],
        }
      ],
      max_tokens: 300
    });

    const aiText = response.choices[0].message.content || '';
    const matchCode = aiText.match(/codice[:\-]?\s?([A-Z0-9\-]+)/i);
    const matchPrice = aiText.match(/(?:prezzo|€)[:\-]?\s?(\d+)/i);

    return {
      statusCode: 200,
      body: JSON.stringify({
        description: aiText,
        code: matchCode ? matchCode[1] : '',
        price: matchPrice ? matchPrice[1] : ''
      })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Errore AI" }) };
  }
};
