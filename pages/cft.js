import { checklistSection } from '/js/main.js';
export function mount(root){
  root.innerHTML = '';
  const card = document.createElement('section');
  card.className = 'card';
  card.innerHTML = `<h2>CFT — sessão prática</h2>
    <p>Compaixão corajosa: postura, respiração e linguagem que direciona.</p>`;
  const sec1 = checklistSection('Regular o corpo', [
    'Postura corajosa (peito 5% aberto, mandíbula solta)',
    'Respiração compassiva 4–6 (3 ciclos)',
    'Nomear a emoção sem julgamento'
  ]);
  const sec2 = checklistSection('Linguagem compassiva', [
    'Frase-âncora: "Eu vejo. Eu fico. Próximo passo possível: ___."',
    'Transformar autocrítica em cuidado orientado',
    'Definir pedido/limite com respeito'
  ]);
  const sec3 = checklistSection('Plano 30 dias', [
    'Micro-ação diária (2–5 min)',
    'Revisão semanal do que funcionou',
    'Reforço do comportamento útil'
  ]);
  root.appendChild(card); root.appendChild(sec1); root.appendChild(sec2); root.appendChild(sec3);
}
