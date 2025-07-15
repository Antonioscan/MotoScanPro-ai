# MotoScanPro AI

Web app per il riconoscimento di oggetti da foto tramite OpenAI Vision.

## Funzionalità

- Caricamento fino a 6 immagini
- Selezione immagine principale
- Analisi AI per descrizione professionale, codice e prezzo

## Hosting

Deploy automatico su Netlify:
[https://motoscanpro-ai.netlify.app](https://motoscanpro-ai.netlify.app)

## Backend

La funzione serverless in `/netlify/functions/analyze.js` utilizza `gpt-4-vision-preview` per l'elaborazione.

## API

È necessario impostare la variabile `OPENAI_API_KEY` su Netlify.
