// ===== helpers =====
const $ = (s)=>document.querySelector(s);
function esc(s){
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
const pad = (n)=>String(n).padStart(2,'0');

// ===== preset (resumo) =====
const PROTO = {
  semanas: [
    {titulo:'Semana 1 — Base & sobrevivência', itens:[
      'Awareness corporal diário (2–3 min): pés no chão, respiração 4–6, nomear sensação → emoção → necessidade.',
      'Ativação Comportamental (AC): 2–3 micro-atividades/dia (1 prazer + 1 valor).',
      'Sono: horário fixo + 30 min sem tela.'
    ], indicadores:['PHQ-9 baseline','% AC cumpridas','Horas de sono']},
    {titulo:'Semana 2 — Regulação & contato (Gestalt + exposições leves)', itens:[
      'Cadeiras internas (Gestalt): Crítico × Vulnerável → integração; âncora: “Posso ficar comigo e dar um passo pequeno agora”.',
      'Hierarquia social (0–100) com 8–10 situações.',
      'Exposições leves sem segurança (cumprimento, pergunta em loja, áudio curto no grupo).'
    ], indicadores:['SUDS 0–10 antes/depois','Previsto × ocorrido','Manter 2 AC/dia']},
    {titulo:'Semana 3 — Habilidade/Exposição (médio) + contato/limites', itens:[
      'Role-play/monodrama (Gestalt) da situação-alvo (45–60).',
      'Pedido/limite assertivos (FAP/gestalt): quem/o quê/quando.',
      'Exposições médias 2–3x/semana: 30–60 s de conversa; 1 convite; 1 opinião em grupo (sem apagar).'
    ], indicadores:['Pedido feito? (sim/não, com quem)','Tempo total em contato (min/semana)','BADS-SF (comparar com S1)']},
    {titulo:'Semana 4 — Consolidação & prevenção de recaída', itens:[
      'Exposição alta (65–80): falar 1x em reunião/grupo OU marcar e comparecer a encontro.',
      'Revisitar polaridades (Gestalt): aprendizagens do Crítico e pedidos do Vulnerável.',
      'Plano do mês: 1 exposição/semana; 2 AC/dia; sinais de alerta + plano de 3 passos.'
    ], indicadores:['PHQ-9 final + mini-LSAS','% exposições sem segurança','1º passo do mês agendado']},
  ]
};

// ===== render editor =====
const editorEl = $('#plano-editor');
function renderPlan(semanas=PROTO.semanas){
  editorEl.innerHTML = '';
  semanas.forEach((w,idx)=>{
    const wk = document.createElement('div');
    wk.className='plan week';
    wk.innerHTML = `<h3>${esc(w.titulo)}</h3>
      <div class="table-like">
        <div class="cell"><b>Intervenções da semana</b><ul>${w.itens.map(i=>`<li contenteditable="true" data-w="${idx}" data-type="it">${esc(i)}</li>`).join('')}</ul></div>
        <div class="cell"><b>Indicadores & Follow-up</b><ul>${w.indicadores.map(i=>`<li contenteditable="true" data-w="${idx}" data-type="in">${esc(i)}</li>`).join('')}</ul></div>
      </div>`;
    editorEl.appendChild(wk);
  });
}
renderPlan();

// ===== Diretrizes (mock curto) =====
const GUIDES = [
  {t:'Gestalt — Awareness', d:'2–3 min; figura–fundo; ação mínima.'},
  {t:'Cadeiras internas', d:'Crítico × Vulnerável; integrar; eu-apoio.'},
  {t:'AC (depressão)', d:'Agir antes do humor; prazer + valor.'},
  {t:'Exposição social', d:'Hierarquia 0–100; sem segurança; foco externo.'},
];
function renderGuides(){
  const box = $('#guides'); box.innerHTML='';
  GUIDES.forEach(g=>{
    const el = document.createElement('div'); el.className='guide';
    el.innerHTML = `<h3>${esc(g.t)}</h3><div>${esc(g.d)}</div>`;
    box.appendChild(el);
  });
}
renderGuides();

// ===== Carregar preset =====
$('#btn-carregar')?.addEventListener('click', ()=> renderPlan(PROTO.semanas));

// ===== PDF direto =====
$('#btn-pdf-direto')?.addEventListener('click', exportPdfDireto);

async function exportPdfDireto(){
  // monta DOM da impressão a partir do template
  const tpl = document.getElementById('tpl-print');
  const node = tpl.content.cloneNode(true);
  const root = node.querySelector('#print-root');

  // preencher dados básicos
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

  // semanas do editor (captura do DOM atual)
  const editorWeeks = Array.from(document.querySelectorAll('#plano-editor .plan'));
  const alvo = root.querySelector('#p-semanas');
  editorWeeks.forEach(w=>{
    const titulo = w.querySelector('h3')?.textContent || '';
    const its = Array.from(w.querySelectorAll('.cell:nth-child(1) li')).map(li=>li.textContent);
    const inds = Array.from(w.querySelectorAll('.cell:nth-child(2) li')).map(li=>li.textContent);
    const block = document.createElement('div');
    block.className='block';
    block.innerHTML = `<h3>${esc(titulo)}</h3>
      <div class="table-like">
        <div class="cell"><b>Intervenções da semana</b><ul>${its.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div>
        <div class="cell"><b>Indicadores & Follow-up</b><ul>${inds.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div>
      </div>`;
    alvo.appendChild(block);
  });

  // insere no body para render do html2canvas
  const mount = document.createElement('div');
  mount.style.position='fixed'; mount.style.left='-10000px'; // fora de tela
  mount.appendChild(root);
  document.body.appendChild(mount);

  // captura e gera PDF (multi-página) sem diálogo
  const A4_W = 794, A4_H = 1123; // px em ~96dpi
  const prevW = root.style.width; root.style.width = A4_W + 'px';
  const canvas = await html2canvas(root, {scale: 2, backgroundColor: '#ffffff', useCORS: true});
  const imgW = canvas.width, imgH = canvas.height;

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'pt', 'a4');
  const px2pt = px => px*0.75; const pageW = px2pt(A4_W), pageH = px2pt(A4_H);
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

    // rodapé por página
    pdf.setFontSize(9); pdf.setTextColor(68,104,108);
    pdf.text(nome, px2pt(margin), pageH - px2pt(5));
    pdf.text(dh, pageW - px2pt(margin) - pdf.getTextWidth(dh), pageH - px2pt(5));

    rendered += sliceH; page++;
  }

  const nomePaciente = (nome || 'paciente').replace(/\s+/g,'_').toLowerCase();
  pdf.save(`parecer_${nomePaciente}.pdf`);

  // limpa
  root.style.width = prevW;
  mount.remove();
}