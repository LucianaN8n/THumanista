import { checklistSection } from '/js/main.js';
export function mount(root){
  root.innerHTML = '';
  const card = document.createElement('section');
  card.className = 'card';
  card.innerHTML = `<h2>DBT — sessão prática</h2>
    <p>Habilidades para emoção intensa: STOP, TIPP, opposite action, DEAR MAN.</p>`;
  const sec1 = checklistSection('Crise (tolerância à angústia)', [
    'STOP (pare, postura, respiração)',
    'TIPP (Temperatura fria, exercício rápido, respiração 4–6, relaxamento)',
    'Grounding 5-4-3-2-1'
  ]);
  const sec2 = checklistSection('Regulação & ação oposta', [
    'Nomear emoção + função',
    'Escolher ação oposta mínima (5 min)',
    'Plano de higiene do sono'
  ]);
  const sec3 = checklistSection('Relações (DEAR MAN)', [
    'Escrever o pedido claro (Descrever/Expressar/Afirmar)',
    'Praticar Mindful + Appear confident',
    'Negociar alternativas (MAN)'
  ]);
  root.appendChild(card); root.appendChild(sec1); root.appendChild(sec2); root.appendChild(sec3);
}
