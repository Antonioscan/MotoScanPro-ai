# MotoScanPro-AI

Sistema AI per il riconoscimento intelligente di componenti moto da fotografie reali, utile per la pubblicazione di annunci online (es. eBay, Subito, ecc.).

## Funzionalità
- Caricamento fino a 6 foto per ciascun ricambio
- Riconoscimento visivo con AI Hugging Face
- Generazione descrizione professionale tramite OpenAI
- Estrazione codice prodotto (se disponibile)
- Stima prezzo medio di vendita (modificabile)
- Ottimizzato per dispositivi mobili

## Tecnologie
- HTML, CSS, JS puro
- Netlify Functions (serverless)
- Hugging Face (BLIP image captioning)
- OpenAI Chat GPT-4

## Hosting
Il progetto è live su:  
🔗 https://motoscanpro-ai.netlify.app

## Variabili d’ambiente
Configura nel pannello Netlify:
- `HF_TOKEN` = token Hugging Face
- `OPENAI_API_KEY` = API key di OpenAI

## Avvio locale
```bash
npm install
netlify dev
