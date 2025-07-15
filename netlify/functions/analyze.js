const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { images, selectedType } = JSON.parse(event.body);
  const prompt = `Descrivi questo componente per moto in massimo 5 righe, includi codice articolo, compatibilità e prezzo medio per ${selectedType}.`;

  const image = images[0];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 400,
    }),
  });

  const result = await response.json();
  const content = result.choices[0].message.content;

  const match = content.match(/codice[:\s]*([A-Z0-9]+)/i);
  const price = content.match(/€ ?([\d,.]+)/) || ["", "120,00"];
  const code = match ? match[1] : "ND";

  return {
    statusCode: 200,
    body: JSON.stringify({
      description: content,
      code,
      price: price[1],
    }),
  };
};
