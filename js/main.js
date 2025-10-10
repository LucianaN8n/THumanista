// App Mentor Humanista — JS principal (defer)
export const formState = {
  cliente: { nome: '', queixa: '' },
  checklist: {}
};

window.addEventListener('DOMContentLoaded', () => {
  const nome = document.getElementById('cliente-nome');
  const queixa = document.getElementById('cliente-queixa');
  function save(){ formState.cliente.nome = nome.value; formState.cliente.queixa = queixa.value; }
  nome?.addEventListener('input', save);
  queixa?.addEventListener('input', save);
});

const router = document.getElementById('router');
document.querySelectorAll('[data-page]').forEach(btn=>{
  btn.addEventListener('click', async (e)=>{
    const page = e.currentTarget.getAttribute('data-page');
    if(page === 'gestalt'){
      const mod = await import('/pages/gestalt.js'); mod.mount(router);
    } else if(page === 'dbt'){
      const mod = await import('/pages/dbt.js'); mod.mount(router);
    } else if(page === 'cft'){
      const mod = await import('/pages/cft.js'); mod.mount(router);
    }
  });
});

const btnPDF = document.getElementById('btn-baixar-pdf');
btnPDF?.addEventListener('click', gerarPDF);

async function gerarPDF(){
  const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.es.min.js');
  const doc = new jsPDF({unit:'pt', format:'a4'});

  const margem = 40;
  const larg = 595.28 - margem*2;
  const hoje = new Date().toLocaleDateString('pt-BR');
  const nome = (formState.cliente.nome || 'Cliente').trim();
  const queixa = (formState.cliente.queixa || '—').trim();

  doc.setFontSize(16);
  doc.text('Parecer + Plano de 30 dias — Mentor Humanista', margem, 60);
  doc.setFontSize(11);
  doc.text(`Nome: ${nome}   •   Data: ${hoje}`, margem, 80);
  doc.text(`Queixa principal: ${queixa}`, margem, 96);

  const itens = Object.entries(formState.checklist).filter(([,v])=>v===true).map(([k])=>`• ${k}`);
  const texto = itens.length ? itens.join('\n') : '—';

  doc.setFontSize(12);
  doc.text('Intervenções e marcos da sessão:', margem, 122);
  doc.setFontSize(11);
  const split = doc.splitTextToSize(texto, larg);
  doc.text(split, margem, 138);

  const plano = [
    'S1: psicoeducação + micro-ação 1x/dia',
    'S2: habilidade escolhida 3x/semana',
    'S3: conversa necessária (roteiro)',
    'S4: revisão e reforço do que funcionou'
  ];
  doc.setFontSize(12);
  doc.text('Plano de 30 dias (modelo):', margem, 430);
  doc.setFontSize(11);
  doc.text(plano.map((l,i)=>`Semana ${i+1}: ${l}`), margem, 446);

  const fileName = `Protocolo_${nome.replace(/\s+/g,'_')}_${hoje}.pdf`;
  doc.save(fileName);
}

export function checklistSection(titulo, itens){
  const section = document.createElement('section');
  section.className = 'card';
  section.innerHTML = `<h3 class="section-title">${titulo}</h3>`;
  itens.forEach(txt=>{
    const id = 'chk_' + btoa(txt).replace(/=/g,'');
    const row = document.createElement('label');
    row.className = 'check';
    row.innerHTML = `<input type="checkbox" id="${id}"><span>${txt}</span>`;
    const input = row.querySelector('input');
    input.addEventListener('change', e=>{
      formState.checklist[txt] = input.checked;
    });
    section.appendChild(row);
  });
  return section;
}
