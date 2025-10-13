# THSE – Build master v3.2 (nítido ++)
Ajustes para nitidez no final das páginas:
- Overlap de 4px entre fatias para evitar antialias diferente na última linha.
- Posições e tamanhos arredondados para 2 casas (evita subpixels).
- Respeita DPR do dispositivo sem inflar muito o arquivo.
- PNG + scale alto.

## Coloque as libs em /vendor
- vendor/html2canvas.min.js  (v1.4.x)
- vendor/jspdf.umd.min.js    (v2.5.x)
