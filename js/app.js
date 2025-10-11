// Estado
const $ = (s)=>document.querySelector(s);
const editorEl = $('#plano-editor');
window.estado = { cliente:{}, anamnese:{}, plano:[] };

// Guias clínicas
const GUIDES = [
 {key:'dbt', title:'DBT – STOP + TIPP (Crise/alta ativação)', when:'Intensidade ≥7/10; impulso alto.', steps:[
  'Nomeie a crise e a meta: baixar para ≤4/10.',
  'Postura neutra (pés firmes, ombros soltos, mandíbula solta).',
  'Respiração 4–6 (5 ciclos).',
  'Temperatura fria na nuca/mãos por 20–30s.',
  'Exercício intenso e curto (45–60s).',
  'Checagem e ancoragem (ação segura de 10 min).'
 ], script:'“Eu guio. Entre 4, saia 6… frio na nuca… Você consegue passar 2 minutos sem piorar a crise.”'},
 {key:'cft', title:'CFT – Postura/voz compassiva', when:'Vergonha, rigidez, “tenho que”.', steps:[
  'Postura corajosa (peito 5% aberto).',
  'Respiração 4–6 por 3 ciclos.',
  'Crítico diz __ → Resposta compassiva __.',
  'Âncora: “Eu vejo. Eu fico. Próximo passo possível: ___.”',
  'Micro-ação de 5–10 min.'
 ], script:'“Repita num tom 15% mais lento: Eu vejo. Eu fico. O próximo passo possível é ___.”'},
 {key:'gestalt', title:'Gestalt – Cadeira interna', when:'Ambivalência/evitação relacional.', steps:[
  'Nomear partes (Crítico × Vulnerável; Controlador × Espontâneo).',
  'Troca de cadeiras: 2–3 falas por parte.',
  'Integração: o que cada parte precisa para 1 passo?',
  'Ação final: pedido/limite/experimento.'
 ], script:'“Da cadeira do Crítico: ‘Se eu te protejo, ganho o quê?’… Troca… ‘Hoje, o passo é ___.’”'},
 {key:'fap', title:'FAP – Coragem relacional no aqui-agora', when:'Dificuldade em pedir/discordar.', steps:[
  'Evocar comportamento na sessão (“como diria não para mim?”).',
  'Notar topografia/função.',
  'Modelar 2 frases de pedido direto.',
  'Reforçar natural.',
  'Generalizar para 1 pessoa da vida real.'
 ], script:'“Diga agora: Eu preciso de ___. Como foi no corpo?”'},
 {key:'abc', title:'Análise Comportamental – Exposição graduada', when:'Medo mantido por fuga/rituais.', steps:[
  'Listar 5 passos (fácil→difícil).',
  'Executar o 1º passo (5–10 min) com STOP antes.',
  'Sem neutralizar (sem checar/garantias).',
  'Reforço imediato.',
  'Revisar dados (0–10, duração, aprendizado).'
 ], script:'“Faremos só o passo 1 por 5–10 minutos; nada de neutralizar. Depois reforço e revisão.”'}
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

// Gerar protocolo
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

  const plano=[];
  const s1={semana:1,titulo:'Semana 1 — Base e sobrevivência',itens:[]};
  if(score.crise>0){ s1.itens.push('DBT—STOP diário (2 min).','DBT—TIPP SOS (frio na nuca + respiração 4–6) quando ≥7/10.');}
  s1.itens.push('Sono: horário fixo + 30 min sem tela.','Psicoeducação: nomear queixa e objetivo em 1 frase.');
  plano.push(s1);

  const s2={semana:2,titulo:'Semana 2 — Regulação e contato',itens:[]};
  if(score.compaixao>0){ s2.itens.push('CFT—postura corajosa 2x/dia.','CFT—âncora: “Eu vejo. Eu fico. Próximo passo possível: ___.”'); }
  s2.itens.push('Gestalt—cadeira interna 1x/semana (parte crítica × vulnerável).');
  plano.push(s2);

  const s3={semana:3,titulo:'Semana 3 — Habilidade/Exposição',itens:[]};
  if(score.habilidades>0){ s3.itens.push('DEAR MAN: 1 pedido real (treino + execução).','GIVE/FAST para vínculo + autorrespeito.');}
  if(score.exposicao>0){ s3.itens.push('Exposição graduada: executar o 1º passo (5–10 min) sem neutralizar.');}
  plano.push(s3);

  const s4={semana:4,titulo:'Semana 4 — Consolidação',itens:['Repetir 2x o que funcionou.','Auto-feedback: o que ficou mais fácil e por quê.']};
  plano.push(s4);

  window.estado.plano=plano;
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

// ===== PDF compacto com overlap =====
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

  const wrap = document.createElement('div');
  wrap.className = 'print-wrap';
  wrap.innerHTML = `
    <h2>Parecer Clínico – Mentor Humanista</h2>
    <div class="meta">Nome: <b>${esc(nome)}</b> • Data: ${hoje}<br>
      Queixa: ${esc(queixa)}<br>Objetivo: ${esc(objetivo)}</div>
    <div class="block"><h3>Formulação breve</h3>
      <ul>
        <li>Função predominante: ${esc(fun)}.</li>
        <li>Gatilhos principais: ${esc(gat)}.</li>
        <li>Recursos presentes: (preencher).</li>
        <li>Hipóteses de manutenção: (preencher).</li>
      </ul>
    </div>
    <div class="block"><h3>Metas operacionais (4 semanas)</h3>
      <ul>
        <li>Semana 1: sobreviver a crises + sono mínimo.</li>
        <li>Semana 2: regulação/contato (CFT/experimentos).</li>
        <li>Semana 3: habilidade relacional ou exposição.</li>
        <li>Semana 4: consolidação e revisão.</li>
      </ul>
    </div>
    ${renderSemanas(window.estado?.plano || [])}
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
    const overlapPx = 6 * (canvas.width / imgW); // ~6pt
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
  function renderSemanas(plano){
    return (plano||[]).map(sem=>`
      <div class="block"><h3>${esc(sem.titulo||'Semana')}</h3>
        <ul>${(sem.itens||[]).map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
      </div>`).join('');
  }
}
