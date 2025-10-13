# THSE – PDF direto (OFFLINE)
Este pacote gera PDF **sem abrir janela** e **sem URL no rodapé**, usando libs **locais**.

## Passo 1 — Coloque as libs na pasta /vendor
Baixe os arquivos **minificados** e coloque com estes nomes:
- `vendor/html2canvas.min.js`
- `vendor/jspdf.umd.min.js`

(Use as versões estáveis atuais; os nomes **precisam** bater.)

## Passo 2 — Publicar
Envie a **pasta descompactada** para o Netlify (Upload deploy). Não precisa de CSP especial, pois **não há** chamadas a CDN.

## Uso
Preencha os campos → clique **Baixar PDF** → arquivo baixa na hora, rodapé = **Nome | Data**.

Se aparecer alerta “Bibliotecas locais não encontradas”, é porque os arquivos acima não foram colocados na `/vendor`.
