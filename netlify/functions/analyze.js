const openai = require("openai");
openai.apiKey = process.env.OPENAI_API_KEY;

exports.handler = async (event) => {
  try {
    const { images } = JSON.parse(event.body);
    const base64Images = images.join("\n");

    const prompt = `
Analizza le seguenti immagini e descrivi cosa rappresentano. Se possibile:
- Trova un nome identificativo per l’oggetto (es. "pinza freno Brembo").
- Indica un codice prodotto generico.
- Fornisci un prezzo medio di vendita.

Immagini codificate (base64):
${base64Images}

Rispondi in JSON come:
{
  "description": "...",
  "code": "...",
  "price": "..."
}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const output = completion.choices[0].message.content;
    const result = JSON.parse(output);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore analisi AI: " + err.message }),
    };
  }
};
