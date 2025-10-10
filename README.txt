# THSE – Mentor Humanista – v5 (Local jsPDF + Auto-resize)
- Carrega jsPDF **local** em `/vendor/jspdf.umd.min.js`.
- Se o arquivo local não existir, **fallback** automático para CDN (jsDelivr).
- **Auto-resize**: app envia a altura por `postMessage` (`type: 'thse-resize'`).

## Como ativar jsPDF local
1. Baixe o arquivo oficial `jspdf.umd.min.js` (v2.5.1 ou superior) do repositório jsPDF.
2. Coloque-o em: `/vendor/jspdf.umd.min.js` (mesmo nível de `index.html`).

## Hotmart: auto-resize do iframe
No bloco HTML onde você embute o app, use:
```html
<div id="wrap-thse" style="max-width:1100px;margin:0 auto">
  <iframe id="thse-app" src="https://SEU-SITE.netlify.app/?embed=hotmart"
          style="width:100%;height:1600px;border:0;overflow:hidden;border-radius:12px"
          loading="lazy"></iframe>
</div>
<script>
  (function(){
    var iframe = document.getElementById('thse-app');
    window.addEventListener('message', function(ev){
      if(!ev || !ev.data) return;
      if(ev.data.type === 'thse-resize'){
        var h = Math.max(1200, Number(ev.data.height||0));
        iframe.style.height = h + 'px';
      }
    });
  })();
</script>
```

## Dica
Se a Hotmart limitar scripts no bloco, use um **bloco HTML** dedicado ao iframe + script.
