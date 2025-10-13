// ===== helpers =====
const $ = (s)=>document.querySelector(s);
function esc(s){
  return String(s ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// ===== estado =====
const editorEl = $('#plano-editor');
window.estado = { cliente:{}, anamnese:{}, semanas:[] };

// ===== diretrizes =====
const GUIDES = [
  {t:'Gestalt — Awareness', d:'2–3 min no início; nomear figura–fundo; ação mínima.'},
  {t:'Gestalt — Cadeiras', d:'Crítico × Vulnerável → integração → passo possível.'},
  {t:'Linguagem de responsabilidade', d:'“Estou escolhendo…”; custo/benefício explícitos.'},
  {t:'AC (depressão)', d:'2–3 micro-atividades/dia (1 prazer + 1 valor).'},
  {t:'Exposição Social', d:'Hierarquia 0–100; remover seguranças; foco externo.'},
  {t:'FAP — Pedido/limite', d:'Eu + pedido concreto + alternativa; “Agora não/Prefiro…”.'},
  {t:'DBT — STOP/TIPP', d:'STOP 2 min; TIPP (frio nuca, resp 4–6, exercício breve).'},
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

// ===== preset (Protocolo Cirúrgico) =====
const PROTO = {"versao": "cirurgica_assertiva_v1", "titulo": "Protocolo Cirúrgico e Assertivo — Gestalt + AC + Exposição Social (depressão + isolamento social)", "diretrizes": ["Gestalt — Awareness & fronteira de contato: 2–3 min no início da sessão; nomear figura–fundo; traduzir em ação pequena.", "Gestalt — Cadeiras internas: Crítico × Vulnerável; integrar; fechar com eu-apoio e “próximo passo possível”.", "Gestalt — Linguagem de responsabilidade: “estou escolhendo…”; explicitar custo/benefício.", "Ativação Comportamental (depressão): 2–3 micro-atividades/dia (≤10 min), uma de prazer e outra de valor.", "Exposição Social Graduada (fobia/isolamento): hierarquia 0–100; remover seguranças (sem fone/celular, sem script); foco externo.", "FAP — Pedido e limite: “eu + pedido concreto + alternativa / agora não, prefiro ___”.", "DBT — STOP/TIPP (crise): STOP 2 min; TIPP (frio nuca, resp 4–6, exercício curto).", "Segurança: se PHQ-9 item 9 > 0 → avaliação de risco e plano de segurança."], "semanas": [{"titulo": "Semana 1 — Base & sobrevivência (Gestalt + AC)", "itens": ["Awareness corporal diário (2–3 min): pés no chão, respiração 4–6, nomear sensação → emoção → necessidade.", "Linguagem de responsabilidade (Gestalt): trocar “não consigo” por “estou escolhendo ___, e o custo é ___”.", "Ativação Comportamental (AC): executar 2–3 micro-atividades (≤10 min) por dia (1 prazer + 1 valor).", "Higiene do sono: horário fixo + 30 min sem tela antes de dormir."], "indicadores": ["PHQ-9 (baseline).", "% de AC cumpridas.", "Horário de dormir/levantar 5x/semana.", "Exemplo de algo 1% mais fácil (registro)."]}, {"titulo": "Semana 2 — Regulação & contato (Gestalt + exposições leves)", "itens": ["Cadeiras internas (Gestalt): Crítico × Vulnerável → integração; âncora: “Posso ficar comigo e dar um passo pequeno agora”.", "Hierarquia social (0–100) com 8–10 situações.", "Exposições leves (20–40), 2–3x/semana, sem segurança (sem fone, sem script): cumprimentar com contato visual 10–15 s; pergunta rápida em loja; 1 áudio curto em grupo."], "indicadores": ["SUDS 0–10 antes/depois e tempo de recuperação.", "Previsto × ocorrido (corrigir distorções).", "Manter 2 AC/dia."]}, {"titulo": "Semana 3 — Habilidade/Exposição (médio) + contato/limites (Gestalt)", "itens": ["Role-play/monodrama (Gestalt) da situação-alvo (45–60): repetir com postura ereta e voz firme.", "Pedido e limite assertivos (FAP/gestalt): quem/o quê/quando. Script: “Eu + pedido concreto + alternativa”.", "Exposições médias (45–60), 2–3x/semana, sem segurança: manter 30–60 s de conversa; fazer 1 convite; enviar 1 opinião em grupo e não apagar."], "indicadores": ["Pedido feito? (sim/não; com quem).", "Tempo total em contato (min/semana).", "BADS-SF (comparar com S1)."]}, {"titulo": "Semana 4 — Consolidação & prevenção de recaída", "itens": ["Exposição alta (65–80): falar 1x em pequena reunião/grupo OU marcar e comparecer a encontro com 1 pessoa significativa.", "Revisitar polaridades (Gestalt): o que o Crítico aprendeu; como o Vulnerável pede apoio.", "Plano do mês: 1 exposição/semana; 2 AC/dia (1 prazer + 1 valor); lista de 3 sinais de alerta + plano de 3 passos."], "indicadores": ["PHQ-9 final (queda clínica esperada) + mini-LSAS final.", "% exposições sem segurança.", "1º passo do mês definido e agendado."]}]};
function carregarProtocolo(){
  // carregar semanas do preset no editor
  window.estado.semanas = PROTO.semanas.map(s => ({
    titulo: s.titulo,
    itens: [...s.itens],
    indicadores: [...s.indicadores],
  }));
  renderPlan();
  // carregar diretrizes do preset no painel 3 (acrescentar ao padrão)
  if (Array.isArray(PROTO.diretrizes)) {
    const extra = PROTO.diretrizes.map(d=>({t:'Diretriz', d}));
    GUIDES.push(...extra);
    renderGuides();
  }
}

// ===== gerar 4 semanas (automático, se quiser sem preset) =====
$('#btn-gerar')?.addEventListener('click', ()=>{
  const intensidade = +($('#f-intensidade').value||0);
  const objetivo = $('#f-objetivo').value.trim();
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

$('#btn-carregar')?.addEventListener('click', carregarProtocolo);

// ===== editor =====
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

// ===== impressão via iframe com rodapé personalizado =====
document.getElementById('btn-pdf')?.addEventListener('click', ()=>{
  const nome = (window.estado?.cliente?.nome || document.getElementById('f-nome')?.value || '—').trim();
  const queixa = window.estado?.cliente?.queixa || document.getElementById('f-queixa')?.value || '—';
  const objetivo = window.estado?.cliente?.objetivo || document.getElementById('f-objetivo')?.value || '—';
  const fun = window.estado?.anamnese?.funcao || document.getElementById('f-funcao')?.value || '—';
  const gat = window.estado?.anamnese?.gatilho || document.getElementById('f-gatilho')?.value || '—';
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
  .kv b{ white-space:nowrap }
  .footer-print{
    position: fixed; bottom: 6mm; left: 12mm; right: 12mm;
    font-size: 11px; color: #44686c; border-top: 1px solid #e6ecec;
    padding-top: 3mm; display: flex; justify-content: space-between;
  }`;

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
    <div class="footer-print"><span>${esc(nome)}</span><span>${esc(hoje)}</span></div>
  </body></html>`;

  const iframe = document.createElement('iframe');
  iframe.style.position='fixed'; iframe.style.right='0'; iframe.style.bottom='0';
  iframe.style.width='0'; iframe.style.height='0'; iframe.style.border='0';
  document.body.appendChild(iframe);
  iframe.srcdoc = html;
  iframe.onload = () => setTimeout(()=>{ iframe.contentWindow?.print?.(); setTimeout(()=>iframe.remove(), 1000); }, 60);
});

// opcional: preencher estado.cliente ao digitar
['f-nome','f-queixa','f-objetivo','f-intensidade','f-gatilho','f-funcao','f-preferencias'].forEach(id=>{
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', ()=>{
    window.estado.cliente.nome = document.getElementById('f-nome')?.value || '';
    window.estado.cliente.queixa = document.getElementById('f-queixa')?.value || '';
    window.estado.cliente.objetivo = document.getElementById('f-objetivo')?.value || '';
    window.estado.anamnese.intensidade = document.getElementById('f-intensidade')?.value || '';
    window.estado.anamnese.gatilho = document.getElementById('f-gatilho')?.value || '';
    window.estado.anamnese.funcao = document.getElementById('f-funcao')?.value || '';
    window.estado.anamnese.pref = document.getElementById('f-preferencias')?.value || '';
  });
});
