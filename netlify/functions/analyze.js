const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  const { image } = JSON.parse(event.body);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Riconosci questo oggetto e crea una descrizione professionale, riassuntiva e accurata. Includi codice articolo se visibile e un prezzo stimato se possibile." },
            { type: "image_url", image_url: { url: image } }
          ]
        }
      ],
      max_tokens: 300
    });

    const aiText = response.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({
        description: aiText,
        code: null
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore AI", details: err.message })
    };
  }
};
