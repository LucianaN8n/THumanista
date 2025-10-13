// helpers
const $ = (s)=>document.querySelector(s);
function esc(s){
  return String(s ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// estado
const editorEl = $('#plano-editor');
window.estado = { cliente:{}, anamnese:{}, semanas:[] };

// diretrizes
const GUIDES = [
  {t:'DBT – STOP/TIPP', d:'Crise/alta ativação: STOP 2 min; TIPP (frio na nuca, resp 4–6, exercício curto).'},
  {t:'CFT – Postura/Voz', d:'Vergonha/rigidez: postura corajosa + âncora "Eu vejo. Eu fico. Próximo passo possível: ___."'},
  {t:'Gestalt – Cadeiras', d:'Ambivalência: parte Crítica × Vulnerável → integração → 1 passo.'},
  {t:'FAP – Pedido claro', d:'Aqui-agora: modelar pedido direto; reforço; generalizar.'},
  {t:'Exposição graduada', d:'Evitação: 5 passos; executar o 1º (5–10 min) sem neutralizar.'},
];
function renderGuides(){
  const box = $('#guides'); if(!box) return;
  box.innerHTML='';
  GUIDES.forEach(g=>{
    const el = document.createElement('div');
    el.className='guide';
    el.innerHTML=`<h3>${esc(g.t)}</h3><div>${esc(g.d)}</div>`;
    box.appendChild(el);
  });
}
renderGuides();

// gerar 4 semanas
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
  const focoRelacao = /falar|pedido|limite|relacion|conversa|v.nculo|relacao/i.test(objetivo);

  const S1 = ['DBT—STOP diário (2 min).'];
  if(crise) S1.push('DBT—TIPP SOS (frio na nuca + resp 4–6) quando >=7/10.');
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
  const el = editorEl; if(!el) return;
  el.innerHTML='';
  window.estado.semanas.forEach((w,idx)=>{
    const wk = document.createElement('div');
    wk.className='week';
    wk.innerHTML=`<h3>${esc(w.titulo)}</h3>
      <ul>${w.itens.map((t,i)=>`<li contenteditable="true" data-w="${idx}" data-i="${i}">${esc(t)}</li>`).join('')}</ul>
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

// imprimir via iframe — corrigido: (A ?? B) || '—'
document.getElementById('btn-pdf')?.addEventListener('click', ()=>{
  const nome = (window.estado?.cliente?.nome || '—').trim();
  const queixa = window.estado?.cliente?.queixa || '—';
  const objetivo = window.estado?.cliente?.objetivo || '—';
  const fun = window.estado?.anamnese?.funcao || '—';
  const gat = window.estado?.anamnese?.gatilho || '—';
  const pref = window.estado?.anamnese?.pref || document.getElementById('f-preferencias')?.value || '—';
  const intensidade = (window.estado?.anamnese?.intensidade ?? document.getElementById('f-intensidade')?.value) || '—';
  const hoje = new Date().toLocaleDateString('pt-BR');

  const PRINT_CSS = `
  @page{ size:A4; margin:14mm 12mm; }
  @media print{body{background:#fff}.no-print{display:none!important}}
  .print-wrap{ width:794px; padding:0 6px; background:#fff; color:#0e2b2f;
    font: 13.4px/1.38 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;}
  .print-wrap h2{ margin:0 0 6px; font-size:16px; font-weight:800 }
  .print-wrap h3{ margin:10px 0 6px; font-size:14px; font-weight:800; page-break-after:avoid }
  .print-wrap .meta{ font-size:11.5px; margin:0 0 8px; color:#355c60 }
  .print-wrap ul{ margin:4px 0 0 16px; padding:0 }
  .print-wrap li{ margin:3px 0 }
  .block{ margin:10px 0 8px; padding-bottom:4px; border-bottom:1px solid #e6ecec; page-break-inside:avoid }
  .cols-2{ display:grid; grid-template-columns:1fr 1fr; gap:12px }
  .table-like{ display:grid; grid-template-columns:1.1fr .9fr; gap:10px }
  .table-like .cell{ border:1px solid #e6ecec; border-radius:8px; padding:8px }
  .kv{ display:grid; grid-template-columns:auto 1fr; gap:6px 10px; margin:6px 0 4px }
  .kv b{ white-space:nowrap }`;

  const semanas = (window.estado?.semanas||[]).map(w=>`
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

  const html = `<!doctype html><html><head><meta charset="utf-8">
    <title>Parecer – ${esc(nome)}</title>
    <style>${PRINT_CSS}</style>
  </head><body>
    <div class="print-wrap">
      <h2>Parecer Clínico – Mentor Humanista</h2>
      <div class="meta">Data: ${hoje}</div>

      <div class="block"><h3>Dados do paciente</h3>
        <div class="kv"><b>Nome:</b> <span>${esc(nome)}</span></div>
        <div class="kv"><b>Queixa:</b> <span>${esc(queixa)}</span></div>
        <div class="kv"><b>Objetivo:</b> <span>${esc(objetivo)}</span></div>
        <div class="kv"><b>Intensidade (0–10):</b> <span>${esc(intensidade)}</span></div>
        <div class="kv"><b>Quando piora?</b> <span>${esc(gat)}</span></div>
        <div class="kv"><b>Função do padrão:</b> <span>${esc(fun)}</span></div>
        <div class="kv"><b>Preferências/limites:</b> <span>${esc(pref)}</span></div>
      </div>

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

      ${semanas}

      <div class="block"><h3>Observações e combinações</h3><ul><li>(preencher)</li></ul></div>
    </div>
  </body></html>`;

  const iframe = document.createElement('iframe');
  iframe.style.position='fixed'; iframe.style.right='0'; iframe.style.bottom='0';
  iframe.style.width='0'; iframe.style.height='0'; iframe.style.border='0';
  document.body.appendChild(iframe);
  iframe.srcdoc = html;
  iframe.onload = () => setTimeout(()=>{ iframe.contentWindow?.print?.(); setTimeout(()=>iframe.remove(), 1000); }, 60);
});
