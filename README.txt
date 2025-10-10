# THSE – Mentor Humanista (Gestalt + Comportamental)

App pronto para Netlify (HTML/CSS/JS).
- Abra o zip e suba a pasta **thse_mentor_app** no Netlify (Deploy folder).
- Arquivos: `index.html`, `styles.css`, `app.js`
- Geração de PDF usa **jsPDF via CDN** (sem eval). Se estiver bloqueado, o app sugere imprimir como PDF.

## Como usar
1. Preencha os campos do paciente e a anamnese.
2. Clique em **Gerar protocolo** para ver o parecer detalhado (seleção automática de até 3 técnicas + roteiro de 3 sessões).
3. Clique em **Baixar PDF** para salvar o protocolo com nome do paciente e data.
4. **Limpar** para reiniciar o formulário.

> Dica: Para embutir no Wix/Hotmart, publique no Netlify e use um iframe:
> `<iframe src="https://SEU-SITE.netlify.app" style="width:100%;height:1600px;border:0;"></iframe>`
