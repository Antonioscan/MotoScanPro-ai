const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  const { images } = JSON.parse(event.body);

  try {
    const base64 = images[0].split(',')[1];

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Riconosci il componente, fai una descrizione professionale, un codice prodotto e suggerisci un prezzo medio." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64}` } }
          ]
        }
      ],
      max_tokens: 300
    });

    const text = response.choices[0]?.message?.content || "Nessuna descrizione trovata.";
    const lines = text.split('\n');
    const description = lines[0] || text;
    const codeLine = lines.find(l => l.toLowerCase().includes('codice')) || '';
    const code = codeLine.split(':')[1]?.trim() || '';

    return {
      statusCode: 200,
      body: JSON.stringify({ description, code })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
