# THSE – Build master v3.1 (nítido)
- PDF direto com html2canvas **scale:3** + **PNG** (texto mais nítido) e margem **6pt**.
- Rodapé por página via jsPDF (Nome | Data).

## Coloque as libs em /vendor
- vendor/html2canvas.min.js  (v1.4.x)
- vendor/jspdf.umd.min.js    (v2.5.x)

## Netlify
Incluí `_redirects` para garantir que /vendor/* sirva estático.
