// helpers
const $ = (s)=>document.querySelector(s);
const esc = (s)=>String(s ?? '').replace(/[&<>\"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
const pad = (n)=>String(n).padStart(2,'0');

/* PROTOCOLO MASTER — Gestalt + AC + Exposição + FAP */
const PROTO = {
  semanas: [
    { titulo: "Semana 1 — Base & sobrevivência",
      itens: [
        "Awareness Gestalt (2–3 min): notar 3 sensações do corpo, 3 apoios, 1 emoção; nomear sem mudar.",
        "Figura–fundo: mapear sensação → impulso → ação de alívio; nomear a função (alívio imediato).",
        "Contrato de Ativação Comportamental (AC): 2–3 micro-atividades/dia (5–10 min). Ex.: caminhada 8 min; 1 mensagem para pessoa segura; 10 min de tarefa simples.",
        "Psychoed curta: ciclo evitação → alívio → culpa → isolamento.",
        "Tarefas (casa): AC diária; Sono — horário fixo + 30 min sem tela; Diário STOP (DBT, 2 min) ao surgir impulso de evitar."
      ],
      indicadores: [
        "PHQ-9 (baseline) + BADS-SF (semanal).",
        "% de AC cumpridas/dia.",
        "Horas de sono (média).",
        "Relato: ainda ansiosa, mas fiz X/Y atividades."
      ]},
    { titulo: "Semana 2 — Regulação & contato (Gestalt + exposições leves)",
      itens: [
        "Cadeiras internas (Gestalt) — Crítico × Vulnerável (15–20 min); integrar com Adulto/Apoio. Âncora corporal (mão no esterno + respiração 4–6).",
        "Hierarquia social (0–100): listar 8–10 situações; escolher 2 leves (20–40).",
        "Plano de exposição leve SEM segurança: ex.: perguntar a hora; permanecer 1 min a mais; cumprimentar sem justificar.",
        "Tarefas (casa): 2–3 exposições leves/semana SEM neutralizar; manter 2 AC/dia; registrar SUDS 0–10 antes/depois (≤3 min)."
      ],
      indicadores: [
        "SUDS antes/depois por exposição.",
        "Previsto × Ocorrido (corrigir distorções).",
        "Tempo total em contato (min/semana)."
      ]},
    { titulo: "Semana 3 — Habilidade/Exposição (médio) + limites (Gestalt + FAP)",
      itens: [
        "Role-play/Monodrama (Gestalt) da situação-alvo (45–60 min): treino de postura ereta, voz firme, contato visual 60–70%. Intervenções de figura–fundo durante.",
        "FAP — pedido/limite assertivo (script): “Eu + pedido concreto + alternativa”.",
        "Exposições médias (40–60) 2–3x/semana: ex.: 1 fala em reunião pequena; permanecer em cafeteria 20–30 min sem celular. Sem neutralizar; mínimo de 10–15 min após pico.",
        "Tarefas (casa): 2–3 exposições médias/semana; 1 pedido/limite real (registrar quando/para quem); revisão de desempenho (postura, voz, contato visual)."
      ],
      indicadores: [
        "Pedido feito? (sim/não, com quem).",
        "Tempo total em contato (min/sem).",
        "BADS-SF — comparar com Semana 1."
      ]},
    { titulo: "Semana 4 — Consolidação & prevenção de recaída",
      itens: [
        "Exposição alta (65–80) 1x: falar em reunião/grupo OU marcar e comparecer a encontro com 1 pessoa significativa.",
        "Gestalt — polaridades: o Crítico aprendeu o quê? o Vulnerável pede apoio de quem? Contrato de autocuidado que não vira segurança.",
        "Plano do mês: 1 exposição/semana + 2 AC/dia; 3 sinais de alerta + plano de 3 passos para cada.",
        "Tarefas (casa): repetir 2x o que funcionou; agendar 1 compromisso social/semana."
      ],
      indicadores: [
        "PHQ-9 final (queda clínica esperada) + mini-LSAS (6 itens).",
        "% de exposições sem segurança.",
        "1º passo do mês definido e agendado."
      ]}
  ]
};

/* GUIA RÁPIDO */
const GUIDES = [
  { t:"Gestalt — Awareness", d:"2–3 min no início; notar sensação/impulso/intenções; não corrigir, só nomear." },
  { t:"Figura–Fundo", d:"Trazer figura (ansiedade/auto-crítica) e fundo (solidão/expectativa) → ligar à ação." },
  { t:"Cadeiras Internas", d:"Crítico × Vulnerável + Adulto/Apoio; integrar; âncora corporal (mão no esterno + respiração 4–6)." },
  { t:"AC (Depressão/Apatia)", d:"2–3 micro-atividades/dia (5–10 min). Se travar, aumente o 'prêmio' imediato. BADS-SF semanal." },
  { t:"Exposição Social", d:"Hierarquia 0–100; leve (S2), média (S3), alta (S4). SEM segurança; medir SUDS e tempo." },
  { t:"FAP — Pedido/Limite", d:"Reforçar CRB2 na sessão. Script: “Eu + pedido concreto + alternativa”. 1 pedido real/semana." }
];

function renderPlan(semanas=PROTO.semanas){
  const editor = $('#plano-editor'); editor.innerHTML='';
  semanas.forEach((w)=>{
    const el = document.createElement('div');
    el.className = 'plan week';
    el.innerHTML = `<h3>${esc(w.titulo)}</h3>
      <div class="table-like">
        <div class="cell"><b>Intervenções da semana</b>
          <ul>${w.itens.map(i=>`<li contenteditable="true">${esc(i)}</li>`).join('')}</ul>
        </div>
        <div class="cell"><b>Indicadores & Follow-up</b>
          <ul>${w.indicadores.map(i=>`<li contenteditable="true">${esc(i)}</li>`).join('')}</ul>
        </div>
      </div>`;
    editor.appendChild(el);
  });
}

function renderGuides(){
  const box = $('#guides'); box.innerHTML='';
  GUIDES.forEach(g=>{
    const el = document.createElement('div'); el.className='guide';
    el.innerHTML = `<h3>${esc(g.t)}</h3><div>${esc(g.d)}</div>`;
    box.appendChild(el);
  });
}

renderPlan(); renderGuides();
$('#btn-carregar')?.addEventListener('click', ()=>renderPlan(PROTO.semanas));
$('#btn-pdf-direto')?.addEventListener('click', exportPdfDireto);

// === PDF direto (sem diálogo) — rodapé por página via jsPDF ===
async function exportPdfDireto(){
  if(!(window.html2canvas && window.jspdf)){
    alert('Bibliotecas locais não carregadas. Verifique /vendor/html2canvas.min.js e /vendor/jspdf.umd.min.js.');
    return;
  }
  const tpl = document.getElementById('tpl-print');
  const node = tpl.content.cloneNode(true);
  const root = node.querySelector('#print-root');

  const nome = ($('#f-nome').value || 'Paciente').trim();
  const queixa = $('#f-queixa').value || '—';
  const intensidade = $('#f-intensidade').value || '—';
  const gat = $('#f-gatilho').value || '—';
  const fun = $('#f-funcao').value || '—';
  const objetivo = $('#f-objetivo').value || '—';
  const pref = $('#f-preferencias').value || '—';
  const now = new Date();
  const dh = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  root.querySelector('#meta-data').textContent = dh;
  root.querySelector('#p-nome').textContent = nome;
  root.querySelector('#p-queixa').textContent = queixa;
  root.querySelector('#p-objetivo').textContent = objetivo;
  root.querySelector('#p-intensidade').textContent = intensidade;
  root.querySelector('#p-gatilho').textContent = gat;
  root.querySelector('#p-funcao').textContent = fun;
  root.querySelector('#p-pref').textContent = pref;

  const alvo = root.querySelector('#p-semanas');
  document.querySelectorAll('#plano-editor .week').forEach(w=>{
    const titulo = w.querySelector('h3')?.textContent || '';
    const its = Array.from(w.querySelectorAll('.cell:nth-child(1) li')).map(li=>li.textContent.trim());
    const inds = Array.from(w.querySelectorAll('.cell:nth-child(2) li')).map(li=>li.textContent.trim());
    const block = document.createElement('div'); block.className='block';
    block.innerHTML = `<h3>${esc(titulo)}</h3>
      <div class="table-like">
        <div class="cell"><b>Intervenções da semana</b><ul>${its.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div>
        <div class="cell"><b>Indicadores & Follow-up</b><ul>${inds.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div>
      </div>`;
    alvo.appendChild(block);
  });

  // montar fora da tela
  const mount = document.createElement('div');
  mount.style.position='fixed'; mount.style.left='-10000px'; mount.appendChild(root);
  document.body.appendChild(mount);

  // rasterizar
  const A4_W=794, A4_H=1123;
  const prevW = root.style.width; root.style.width = A4_W + 'px';
  const canvas = await html2canvas(root, {scale:2, backgroundColor:'#fff', useCORS:true});
  const imgW=canvas.width, imgH=canvas.height;

  // PDF
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p','pt','a4');
  const px2pt = px=>px*0.75; const pageW=px2pt(A4_W), pageH=px2pt(A4_H);
  const pageSlicePx = Math.floor(A4_H * (canvas.width / A4_W));
  const margin=8;

  let rendered=0, page=0;
  while(rendered < imgH){
    const sliceH = Math.min(pageSlicePx, imgH - rendered);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width=imgW; pageCanvas.height=sliceH;
    pageCanvas.getContext('2d').drawImage(canvas,0,rendered,imgW,sliceH,0,0,imgW,sliceH);
    const url = pageCanvas.toDataURL('image/jpeg',0.98);
    if(page>0) pdf.addPage();
    pdf.addImage(url,'JPEG',px2pt(margin),px2pt(margin),pageW - px2pt(margin*2),pageH - px2pt(margin*2));

    // rodapé por página
    pdf.setFontSize(9); pdf.setTextColor(68,104,108);
    pdf.text(nome, px2pt(margin), pageH - px2pt(5));
    pdf.text(dh, pageW - px2pt(margin) - pdf.getTextWidth(dh), pageH - px2pt(5));

    rendered += sliceH; page++;
  }
  const nomePaciente = (nome || 'paciente').replace(/\s+/g,'_').toLowerCase();
  pdf.save(`parecer_${nomePaciente}.pdf`);
  root.style.width = prevW; mount.remove();
}
