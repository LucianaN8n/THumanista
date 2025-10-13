// ===== helpers =====
const $ = (s)=>document.querySelector(s);
const esc = (s)=>String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const pad = (n)=>String(n).padStart(2,'0');

// ===== preset curto =====
const PROTO = {semanas:[
  {titulo:'Semana 1 — Base & sobrevivência',itens:[
    'Awareness corporal diário (2–3 min).',
    'Ativação Comportamental: 2–3 micro-atividades/dia.',
    'Sono: horário fixo + 30 min sem tela.'
  ],indicadores:['PHQ-9 baseline','% AC cumpridas','Horas de sono']},
  {titulo:'Semana 2 — Regulação & contato',itens:[
    'Cadeiras internas (Gestalt).',
    'Hierarquia social (0–100) — 8–10 situações.',
    'Exposições leves sem segurança.'
  ],indicadores:['SUDS 0–10 antes/depois','Previsto × ocorrido','Manter 2 AC/dia']},
  {titulo:'Semana 3 — Habilidade/Exposição (médio) + limites',itens:[
    'Role-play (Gestalt) da situação-alvo.',
    'Pedido/limite assertivos (FAP/Gestalt).',
    'Exposições médias 2–3x/semana.'
  ],indicadores:['Pedido feito?','Tempo total em contato','BADS-SF (comparar S1)']},
  {titulo:'Semana 4 — Consolidação & prevenção',itens:[
    'Exposição alta (65–80): fala em reunião ou encontro marcado.',
    'Revisitar polaridades (Gestalt).',
    'Plano do mês (exposição semanal + AC diária).'
  ],indicadores:['PHQ-9 final + mini-LSAS','% sem segurança','1º passo do mês agendado']},
]};

// ===== render editor =====
const editor = $('#plano-editor');
function renderPlan(semanas = PROTO.semanas){
  editor.innerHTML = '';
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
renderPlan();

// Diretrizes (demo simples)
const GUIDES = [
  {t:'Gestalt — Awareness', d:'Figura–fundo; ação mínima; 2–3 min.'},
  {t:'Cadeiras internas', d:'Crítico × Vulnerável; integração.'},
  {t:'AC (depressão)', d:'Agir antes do humor.'},
  {t:'Exposição social', d:'Hierarquia; remover seguranças.'},
];
(function renderGuides(){
  const box = $('#guides'); box.innerHTML='';
  GUIDES.forEach(g=>{
    const el = document.createElement('div'); el.className='guide';
    el.innerHTML = `<h3>${esc(g.t)}</h3><div>${esc(g.d)}</div>`;
    box.appendChild(el);
  });
})();

$('#btn-carregar')?.addEventListener('click', ()=>renderPlan(PROTO.semanas));

// ===== PDF direto (sem diálogo) =====
$('#btn-pdf-direto')?.addEventListener('click', exportPdfDireto);

async function exportPdfDireto(){
  // monta DOM do print a partir do template
  const tpl = document.getElementById('tpl-print');
  const node = tpl.content.cloneNode(true);
  const root = node.querySelector('#print-root');

  // preenche cabeçalho/rodapé
  const nome = ($('#f-nome').value || 'Paciente').trim();
  const queixa = $('#f-queixa').value || '—';
  const intensidade = $('#f-intensidade').value || '—';
  const gat = $('#f-gatilho').value || '—';
  const fun = $('#f-funcao').value || '—';
  const objetivo = $('#f-objetivo').value || '—';
  const pref = $('#f-preferencias').value || '—';
  const agora = new Date(); const dh = `${pad(agora.getDate())}/${pad(agora.getMonth()+1)}/${agora.getFullYear()} ${pad(agora.getHours())}:${pad(agora.getMinutes())}`;

  root.querySelector('#meta-data').textContent = dh;
  root.querySelector('#p-nome').textContent = nome;
  root.querySelector('#p-queixa').textContent = queixa;
  root.querySelector('#p-objetivo').textContent = objetivo;
  root.querySelector('#p-intensidade').textContent = intensidade;
  root.querySelector('#p-gatilho').textContent = gat;
  root.querySelector('#p-funcao').textContent = fun;
  root.querySelector('#p-pref').textContent = pref;
  root.querySelector('#rodape-nome').textContent = nome;
  root.querySelector('#rodape-data').textContent = dh;

  // semanas do editor
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

  // monta invisível na página para captura
  const mount = document.createElement('div');
  mount.style.position = 'fixed'; mount.style.left = '-10000px';
  mount.appendChild(root);
  document.body.appendChild(mount);

  // captura e gera PDF (multi-página)
  const A4_W = 794, A4_H = 1123; // px em ~96dpi
  const prevW = root.style.width; root.style.width = A4_W + 'px';
  const canvas = await html2canvas(root, {scale:2, backgroundColor:'#fff', useCORS:true});
  const imgW = canvas.width, imgH = canvas.height;

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'pt', 'a4');
  const px2pt = px=>px*0.75; const pageW = px2pt(A4_W), pageH = px2pt(A4_H);
  const pageSlicePx = Math.floor(A4_H * (canvas.width / A4_W));
  const margin = 8;

  let rendered = 0, page = 0;
  while (rendered < imgH){
    const sliceH = Math.min(pageSlicePx, imgH - rendered);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = imgW; pageCanvas.height = sliceH;
    pageCanvas.getContext('2d').drawImage(canvas, 0, rendered, imgW, sliceH, 0, 0, imgW, sliceH);
    const url = pageCanvas.toDataURL('image/jpeg', 0.98);

    if(page>0) pdf.addPage();
    pdf.addImage(url, 'JPEG', px2pt(margin), px2pt(margin), pageW - px2pt(margin*2), pageH - px2pt(margin*2));

    // rodapé
    pdf.setFontSize(9); pdf.setTextColor(68,104,108);
    pdf.text(nome, px2pt(margin), pageH - px2pt(5));
    pdf.text(dh, pageW - px2pt(margin) - pdf.getTextWidth(dh), pageH - px2pt(5));

    rendered += sliceH; page++;
  }

  const nomePaciente = (nome || 'paciente').replace(/\s+/g,'_').toLowerCase();
  pdf.save(`parecer_${nomePaciente}.pdf`);

  root.style.width = prevW; mount.remove();
}