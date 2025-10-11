// Estado
const $ = (s)=>document.querySelector(s);
const editorEl = $('#plano-editor');
window.estado = { cliente:{}, anamnese:{}, semanas:[] };

const GUIDES = [
  {t:'DBT – STOP/TIPP', d:'Crise/alta ativação: STOP 2min; TIPP (frio na nuca, resp 4–6, exercício curto).'},
  {t:'CFT – Postura/Voz', d:'Vergonha/rigidez: postura corajosa, âncora “Eu vejo. Eu fico. Próximo passo possível: ___.”'},
  {t:'Gestalt – Cadeiras', d:'Ambivalência: parte Crítica × Vulnerável → integração → 1 passo.'},
  {t:'FAP – Pedido claro', d:'Aqui-agora: modelar pedido direto; reforço; generalizar.'},
  {t:'Exposição graduada', d:'Evitação: 5 passos; executar 1º 5–10min sem neutralizar.'},
];
function renderGuides(){
  const box = $('#guides'); box.innerHTML='';
  GUIDES.forEach(g=>{
    const el = document.createElement('div');
    el.className='guide';
    el.innerHTML=`<h3>${g.t}</h3><div>${g.d}</div>`;
    box.appendChild(el);
  });
}
renderGuides();

// Sempre monta 4 semanas
$('#btn-gerar')?.addEventListener('click', ()=>{
  const nome = $('#f-nome').value.trim();
  const queixa = $('#f-queixa').value.trim();
  const intensidade = +($('#f-intensidade').value||0);
  const gatilho = $('#f-gatilho')?.value?.trim() || '';
  const funcao = $('#f-funcao').value;
  const objetivo = $('#f-objetivo').value.trim();
  const pref = $('#f-preferencias').value.trim();
  window.estado.cliente = { nome, queixa, objetivo };
  window.estado.anamnese = { intensidade, gatilho, funcao, pref };

  const crise = intensidade>=7;
  const focoRelacao = /falar|pedido|limite|relacion|conversa|vínculo|relacao/i.test(objetivo);

  const S1 = ['DBT—STOP diário (2 min).'];
  if(crise) S1.push('DBT—TIPP SOS (frio na nuca + resp 4–6) quando ≥7/10.');
  S1.push('Sono: horário fixo + 30 min sem tela.');

  const S2 = ['CFT—postura corajosa 2x/dia + âncora.','Gestalt—cadeira interna 1x/semana.'];

  const S3 = focoRelacao
    ? ['DEAR MAN: 1 pedido real (treino + execução).','GIVE/FAST para vínculo + autorrespeito.']
    : ['Exposição graduada: executar o 1º passo (5–10 min) sem neutralizar.'];

  const S4 = ['Repetir 2x o que funcionou.','Revisão + próximos passos.'];

  window.estado.semanas = [
    {titulo:'Semana 1 — Base e sobrevivência', itens:S1, indicadores:['SUDS antes/depois (0–10)','Horas de sono','1 micro-ação segura pós-crise']},
    {titulo:'Semana 2 — Regulação e contato', itens:S2, indicadores:['Autocrítica → resposta compassiva','Decisão após cadeira interna']},
    {titulo:'Semana 3 — Habilidade/Exposição', itens:S3, indicadores:['Pedido feito? (sim/não, com quem)','SUDS início/fim; duração']},
    {titulo:'Semana 4 — Consolidação', itens:S4, indicadores:['O que ficou mais fácil e por quê','Plano do mês seguinte (1 foco)']},
  ];
  renderPlan();
});

function renderPlan(){
  const el = editorEl; el.innerHTML='';
  window.estado.semanas.forEach((w,idx)=>{
    const wk = document.createElement('div');
    wk.className='week';
    wk.innerHTML=`<h3>${w.titulo}</h3>
      <ul>${w.itens.map((t,i)=>`<li contenteditable="true" data-w="${idx}" data-i="${i}">${t}</li>`).join('')}</ul>
      <div class="toolbar">
        <button class="btn ghost" data-add="${idx}">+ item</button>
        <button class="btn ghost" data-rem="${idx}">- remover último</button>
      </div>`;
    el.appendChild(wk);
  });
  el.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',e=>{
    const i=+e.currentTarget.getAttribute('data-add');
    window.estado.semanas[i].itens.push('Novo item… (edite)'); renderPlan();
  }));
  el.querySelectorAll('[data-rem]').forEach(b=>b.addEventListener('click',e=>{
    const i=+e.currentTarget.getAttribute('data-rem');
    window.estado.semanas[i].itens.pop(); renderPlan();
  }));
  el.querySelectorAll('li[contenteditable]').forEach(li=>li.addEventListener('input',()=>{
    const w=+li.getAttribute('data-w'); const i=+li.getAttribute('data-i');
    window.estado.semanas[w].itens[i]=li.textContent.trim();
  }));
}

// ===== PDF com fallback CSP-safe =====
document.getElementById('btn-pdf')?.addEventListener('click', gerarPDF);
async function gerarPDF(){
  let html2canvasMod, jsPDFMod;
  try{
    html2canvasMod = (await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js')).default;
    jsPDFMod = (await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js')).jsPDF;
  }catch(e){
    console.warn('CDN bloqueada por CSP. Usando fallback de impressão.', e);
    return fallbackPrint();
  }

  const nome = (window.estado?.cliente?.nome || 'Cliente').trim();
  const queixa = window.estado?.cliente?.queixa || '—';
  const objetivo = window.estado?.cliente?.objetivo || '—';
  const fun = window.estado?.anamnese?.funcao || '—';
  const gat = window.estado?.anamnese?.gatilho || '—';
  const hoje = new Date().toLocaleDateString('pt-BR');

  const wrap = buildPrintDom(nome, queixa, objetivo, fun, gat, hoje);
  document.body.appendChild(wrap);

  const canvas = await html2canvasMod(wrap, { backgroundColor:'#fff', scale:2, useCORS:true });
  const pdf = new jsPDFMod({ unit:'pt', format:'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 22;
  const imgW = pageW - margin*2;
  const ratio = canvas.width / canvas.height;
  const imgH = imgW / ratio;

  if (imgH <= pageH - margin*2) {
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, imgW, imgH, '', 'FAST');
  } else {
    let srcY = 0;
    const usablePt = pageH - margin*2;
    const usablePx = usablePt * (canvas.width / imgW);
    const overlapPx = 6 * (canvas.width / imgW);
    while (srcY < canvas.height) {
      const sliceH = Math.min(usablePx, canvas.height - srcY);
      const part = document.createElement('canvas');
      part.width = canvas.width; part.height = sliceH;
      part.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
      const partData = part.toDataURL('image/png');
      const partHpt = (sliceH / canvas.width) * imgW;
      pdf.addImage(partData, 'PNG', margin, margin, imgW, partHpt, '', 'FAST');
      srcY += sliceH - overlapPx;
      if (srcY < canvas.height) pdf.addPage();
    }
  }
  pdf.save(`Protocolo_${nome.replace(/\s+/g,'_')}_${hoje}.pdf`);
  wrap.remove();

  function buildPrintDom(nome, queixa, objetivo, fun, gat, hoje){
    const wrap = document.createElement('div');
    wrap.className='print-wrap';
    wrap.innerHTML = `
      <h2>Parecer Clínico – Mentor Humanista</h2>
      <div class="meta">Nome: <b>${esc(nome)}</b> • Data: ${hoje}<br>
        Queixa: ${esc(queixa)}<br>Objetivo: ${esc(objetivo)}</div>
      <div class="block cols-2">
        <div>
          <h3>Formulação breve</h3>
          <ul>
            <li>Função predominante: ${esc(fun)}.</li>
            <li>Gatilhos: ${esc(gat)}.</li>
            <li>Recursos: (preencher).</li>
            <li>Hipóteses: (preencher).</li>
          </ul>
        </div>
        <div>
          <h3>Metas operacionais</h3>
          <ul>
            <li>S1: crise/sono.</li>
            <li>S2: regulação/contato.</li>
            <li>S3: habilidade/exposição.</li>
            <li>S4: consolidação.</li>
          </ul>
        </div>
      </div>
      ${renderSemanas(window.estado.semanas || [])}
      <div class="block"><h3>Observações e combinações</h3><ul><li>(preencher)</li></ul></div>`;
    return wrap;
  }
  function renderSemanas(list){
    return (list||[]).map(w=>`
      <div class="block">
        <h3>${esc(w.titulo)}</h3>
        <div class="table-like">
          <div class="cell"><b>Intervenções da semana</b>
            <ul>${(w.itens||[]).map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
          </div>
          <div class="cell"><b>Indicadores & Follow-up</b>
            <ul>${(w.indicadores||[]).map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
          </div>
        </div>
      </div>`).join('');
  }
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
}

// Fallback: abrir janela de impressão (Salvar como PDF) se CDN bloqueada por CSP
function fallbackPrint(){
  const nome = (window.estado?.cliente?.nome || 'Cliente').trim();
  const queixa = window.estado?.cliente?.queixa || '—';
  const objetivo = window.estado?.cliente?.objetivo || '—';
  const fun = window.estado?.anamnese?.funcao || '—';
  const gat = window.estado?.anamnese?.gatilho || '—';
  const hoje = new Date().toLocaleDateString('pt-BR');

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Parecer – ${nome}</title>
    <style>${document.querySelector('style')?.textContent || ''}</style>
  </head><body>
    <div class="print-wrap">
      <h2>Parecer Clínico – Mentor Humanista</h2>
      <div class="meta">Nome: <b>${nome}</b> • Data: ${hoje}<br>
        Queixa: ${queixa}<br>Objetivo: ${objetivo}</div>
      <div class="block cols-2">
        <div>
          <h3>Formulação breve</h3>
          <ul>
            <li>Função predominante: ${fun}.</li>
            <li>Gatilhos: ${gat}.</li>
            <li>Recursos: (preencher).</li>
            <li>Hipóteses: (preencher).</li>
          </ul>
        </div>
        <div>
          <h3>Metas operacionais</h3>
          <ul>
            <li>S1: crise/sono.</li>
            <li>S2: regulação/contato.</li>
            <li>S3: habilidade/exposição.</li>
            <li>S4: consolidação.</li>
          </ul>
        </div>
      </div>
      ${ (window.estado?.semanas||[]).map(w=>`
        <div class="block">
          <h3>${w.titulo}</h3>
          <div class="table-like">
            <div class="cell"><b>Intervenções da semana</b><ul>${(w.itens||[]).map(i=>`<li>${i}</li>`).join('')}</ul></div>
            <div class="cell"><b>Indicadores & Follow-up</b><ul>${(w.indicadores||[]).map(i=>`<li>${i}</li>`).join('')}</ul></div>
          </div>
        </div>`).join('') }
    </div>
    <script>setTimeout(()=>window.print(),300);</script>
  </body></html>`;

  const w = window.open('', '_blank');
  if(w){ w.document.open(); w.document.write(html); w.document.close(); }
}
