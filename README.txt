# THSE – Build master (Gestalt + AC + Exposição + FAP)
- “Carregar Protocolo master” injeta 4 semanas detalhadas (cirúrgico).
- “Baixar PDF” baixa direto (sem diálogo) e desenha rodapé por página via jsPDF (Nome | Data). Não há rodapé estático no HTML.

## Coloque as libs em /vendor
- vendor/html2canvas.min.js  (v1.4.x)
- vendor/jspdf.umd.min.js    (v2.5.x)

## Netlify
Incluí `_redirects` para evitar que a SPA capture arquivos JS da pasta vendor.
