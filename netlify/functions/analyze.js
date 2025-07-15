const { HfInference } = require("@huggingface/inference");
const fetch = require("node-fetch");
const hf = new HfInference(process.env.HF_TOKEN); // Token in ambiente Netlify

exports.handler = async (event) => {
  try {
    const { images } = JSON.parse(event.body);

    if (!images || images.length === 0) {
      return { statusCode: 400, body: "Nessuna immagine ricevuta" };
    }

    // Analisi visiva solo della prima immagine
    const visionResult = await hf.imageToText({
      data: images[0],
      model: "Salesforce/blip-image-captioning-base"
    });

    const description = visionResult.generated_text || "Nessuna descrizione";

    // Prompt testuale per completamento descrizione
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Sei un esperto di ricambi moto. Riceverai una descrizione generica e dovrai scrivere una breve descrizione professionale, stimare il codice prodotto e indicare un prezzo medio di vendita." },
          { role: "user", content: `Descrizione generica: ${description}` }
        ],
        temperature: 0.4
      })
    });

    const aiText = await openaiResponse.json();
    const reply = aiText.choices[0].message.content;

    // Estrazione codice e prezzo
    const matchCode = reply.match(/codice[:\s]*([A-Z0-9\-]+)/i);
    const matchPrice = reply.match(/prezzo.*?(\d+[\.,]?\d*)/i);

    return {
      statusCode: 200,
      body: JSON.stringify({
        description: reply,
        code: matchCode ? matchCode[1] : null,
        price: matchPrice ? matchPrice[1].replace(",", ".") : null
      })
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Errore interno" };
  }
};
