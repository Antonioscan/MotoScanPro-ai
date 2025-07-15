# MotoScanPro AI

Demo web per il riconoscimento e la descrizione di componenti moto tramite AI visiva.

## Funzionalità

- Scatto o caricamento foto da mobile (Android/iPhone)
- Pulsanti "RICAMBI NUOVI" e "RICAMBI USATI"
- Caricamento massimo 5 immagini
- Riconoscimento AI (GPT-4 Vision)
- Output: Descrizione tecnica, Codice prodotto, Prezzo modificabile
- Reset automatico interfaccia se immagini eliminate

## Hosting

Deployato automaticamente su **Netlify**.

## API

Usa `openai.chat.completions.create` con modello `gpt-4-vision-preview` via funzione serverless `analyze.js`.

## Comandi

```bash
npm install
netlify dev
