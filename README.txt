# THSE – v6 (sem PRINT, jsPDF local + fallback, auto-resize)
- Removi botões de impressão para evitar URL no PDF.
- Botões de PDF sempre visíveis (formulário, toolbar e FAB após gerar).
- jsPDF local em `/vendor/jspdf.umd.min.js`, com fallback automático.
- Auto-resize do iframe via postMessage.

Coloque o `jspdf.umd.min.js` em `/vendor/` após o deploy no Netlify.
