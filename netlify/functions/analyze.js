const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const { imageBase64 } = JSON.parse(event.body);

    const response = await fetch("https://api-inference.huggingface.co/models/google/vit-base-patch16-224", {
      method: "POST",
      headers: {
        Authorization: `Bearer YOUR_HUGGINGFACE_TOKEN`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          image: imageBase64,
        },
      }),
    });

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore durante l'elaborazione AI" }),
    };
  }
};
