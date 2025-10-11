// Estado
const $ = (s)=>document.querySelector(s);
const editorEl = $('#plano-editor');
window.estado = { cliente:{}, anamnese:{}, plano:[] };

// Guias clínicas (mesmo conteúdo de antes, abreviado aqui)
const GUIDES = [
 {key:'dbt', title:'DBT – STOP + TIPP (Crise/alta ativação)', when:'Intensidade ≥7/10; impulso alto.', steps:[
  'Meta: baixar para ≤4/10. Postura neutra.',
  'Respiração 4–6 (5 ciclos). Frio na nuca 20–30s.',
  'Exercício 45–60s. Checagem e ancoragem.'
 ], script:'“Entre 4, saia 6… Vamos passar 2 minutos sem piorar a crise.”'},
 {key:'cft', title:'CFT – Postura/voz compassiva', when:'Vergonha/rigidez.', steps:[
  'Postura corajosa + respiração 3 ciclos.',
  'Crítico → resposta compassiva.',
  'Âncora: “Eu vejo. Eu fico. Próximo passo possível: ___.”'
 ], script:'“Repita mais lento: Eu vejo. Eu fico. Próximo passo possível é ___.”'},
 {key:'gestalt', title:'Gestalt – Cadeira interna', when:'Ambivalência relacional.', steps:[
  'Nomear partes e trocar cadeiras.',
  'Integração e ação final (pedido/limite).'
 ], script:'“Da cadeira do Crítico… Hoje, o passo é ___. ”'},
 {key:'fap', title:'FAP – Coragem relacional', when:'Pedir/discordar.', steps:[
  'Evocar aqui-agora. Modelar pedido direto. Reforço. Generalizar.'
 ], script:'“Diga agora: Eu preciso de ___. Como foi no corpo?”'},
 {key:'abc', title:'Exposição graduada', when:'Evitação/medo.', steps:[
  'Lista 5 passos. Executar 1º por 5–10 min sem neutralizar.'
 ], script:'“Faremos só o passo 1 por 5–10 min; sem neutralizar.”'}
];

function renderGuides() {
  const box = $('#guides'); box.innerHTML = '';
  GUIDES.forEach(g=>{
    const el = document.createElement('div');
    el.className = 'guide';
    el.innerHTML = `<h3>${g.title}</h3>
      <div class="mut">Quando usar: ${g.when}</div>
      <ol>${g.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
      <div class="mut" style="margin-top:6px"><b>Script breve:</b> ${g.script}</div>`;
    box.appendChild(el);
  });
}
renderGuides();

// Gerar protocolo com plano de ação semanal
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

  const score = { crise:0, regulacao:0, compaixao:0, experimento:0, habilidades:0, exposicao:0 };
  if (intensidade>=7) score.crise+=2;
  if (/noite|sono|sempre/i.test(gatilho)) score.regulacao+=1;
  if (funcao==='alivio') score.regulacao+=1;
  if (funcao==='evitacao') score.exposicao+=2;
  if (funcao==='aprovacao') score.habilidades+=2;
  if (funcao==='controle') score.compaixao+=1;
  if (/falar|pedido|limite|relacion|conversa|energia/i.test(objetivo)) score.habilidades+=1;
  if (/respira|corpo|postura|compaix/i.test(pref)) score.compaixao+=1;

  // Plano de ação semanal (cada semana tem Intervenções + Indicadores/Follow-up)
  const plano=[];

  const s1={semana:1,titulo:'Semana 1 — Base e sobrevivência',
    interv:[ 'DBT—STOP diário (2 min).', (score.crise>0?'DBT—TIPP SOS quando ≥7/10.':null), 'Sono: horário fixo + 30 min sem tela.' ].filter(Boolean),
    indic:['SUDS antes/depois (0–10).','Horas de sono; hora de deitar.','1 micro-ação segura pós-crise.']
  };
  plano.push(s1);

  const s2={semana:2,titulo:'Semana 2 — Regulação e contato',
    interv:[ (score.compaixao>0?'CFT—postura corajosa 2x/dia + âncora.':null), 'Gestalt—cadeira interna 1x/semana.' ].filter(Boolean),
    indic:['Relato de autocrítica → resposta compassiva.','Decisão tomada após cadeira interna.']
  };
  plano.push(s2);

  const s3={semana:3,titulo:'Semana 3 — Habilidade/Exposição',
    interv:[ (score.habilidades>0?'DEAR MAN: 1 pedido real (treino + execução).':null), (score.exposicao>0?'Exposição: executar 1º passo (5–10 min) sem neutralizar.':null) ].filter(Boolean),
    indic:['Pedido feito? (sim/não, com quem)','SUDS início/fim da exposição; duração.']
  };
  plano.push(s3);

  const s4={semana:4,titulo:'Semana 4 — Consolidação',
    interv:['Repetir 2x o que funcionou.','Revisão + próximos passos.'],
    indic:['O que ficou mais fácil e por quê','Plano para o mês seguinte (1 foco)']
  };
  plano.push(s4);

  // Para o editor na tela (lista simples)
  window.estado.plano = plano.map(w=>({ semana:w.semana, titulo:w.titulo, itens:[...w.interv] }));
  renderPlan();
});

function renderPlan(){
  const el = editorEl; el.innerHTML='';
  window.estado.plano.forEach(sem=>{
    const wk = document.createElement('div');
    wk.className='week';
    wk.innerHTML=`<h3>${sem.titulo}</h3>
      <ul>${sem.itens.map((t,i)=>`<li contenteditable="true" data-s="${sem.semana}" data-i="${i}">${t}</li>`).join('')}</ul>
      <div class="toolbar">
        <button class="btn ghost" data-add="${sem.semana}">+ item</button>
        <button class="btn ghost" data-rem="${sem.semana}">- remover último</button>
      </div>`;
    el.appendChild(wk);
  });
  el.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',e=>{
    const s=+e.currentTarget.getAttribute('data-add');
    const sem = window.estado.plano.find(x=>x.semana===s);
    sem.itens.push('Novo item… (edite)'); renderPlan();
  }));
  el.querySelectorAll('[data-rem]').forEach(b=>b.addEventListener('click',e=>{
    const s=+e.currentTarget.getAttribute('data-rem');
    const sem = window.estado.plano.find(x=>x.semana===s);
    sem.itens.pop(); renderPlan();
  }));
  el.querySelectorAll('li[contenteditable]').forEach(li=>li.addEventListener('input',()=>{
    const s=+li.getAttribute('data-s'); const i=+li.getAttribute('data-i');
    const sem = window.estado.plano.find(x=>x.semana===s);
    sem.itens[i]=li.textContent.trim();
  }));
}

// ===== PDF com layout DUAS COLUNAS =====
document.getElementById('btn-pdf')?.addEventListener('click', gerarPDF);
async function gerarPDF(){
  const html2canvas = (await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js')).default;
  const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');

  const nome = (window.estado?.cliente?.nome || 'Cliente').trim();
  const queixa = window.estado?.cliente?.queixa || '—';
  const objetivo = window.estado?.cliente?.objetivo || '—';
  const fun = window.estado?.anamnese?.funcao || '—';
  const gat = window.estado?.anamnese?.gatilho || '—';
  const hoje = new Date().toLocaleDateString('pt-BR');

  // construir tabela semanal com duas colunas (Intervenções | Indicadores/Follow-up)
  const weekly = buildWeeklyTable();

  const wrap = document.createElement('div');
  wrap.className = 'print-wrap';
  wrap.innerHTML = `
    <h2>Parecer Clínico – Mentor Humanista</h2>
    <div class="meta">Nome: <b>${esc(nome)}</b> • Data: ${hoje}<br>
      Queixa: ${esc(queixa)}<br>Objetivo: ${esc(objetivo)}</div>

    <div class="block cols-2">
      <div>
        <h3>Formulação breve</h3>
        <ul>
          <li>Função predominante: ${esc(fun)}.</li>
          <li>Gatilhos principais: ${esc(gat)}.</li>
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

    ${weekly}

    <div class="block"><h3>Observações e combinações</h3><ul><li>(preencher)</li></ul></div>
  `;
  document.body.appendChild(wrap);

  const canvas = await html2canvas(wrap, { backgroundColor:'#fff', scale:2, useCORS:true });
  const pdf = new jsPDF({ unit:'pt', format:'a4' });
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
      part.width = canvas.width;
      part.height = sliceH;
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

  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function buildWeeklyTable(){
    // reconstruir estrutura semanal com campos 'interv' e 'indic'
    const weeks = [];
    for(let w of window.estado.plano){
      // se não tiver os campos riccos (por clique direto), derivar
      weeks.push({
        title: w.titulo || 'Semana',
        interv: (w.interv || w.itens || []),
        indic:  (w.indic || ['Progresso percebido (0–10)','Anotações do que funcionou'])
      });
    }
    return weeks.map((w,i)=>`<div class="block">
      <h3>${w.title}</h3>
      <div class="table-like">
        <div class="cell">
          <b>Intervenções da semana</b>
          <ul>${w.interv.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
        </div>
        <div class="cell">
          <b>Indicadores & Follow‑up</b>
          <ul>${w.indic.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`).join('');
  }
}
