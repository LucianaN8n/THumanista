import { checklistSection } from '/js/main.js';
export function mount(root){
  root.innerHTML = '';
  const card = document.createElement('section');
  card.className = 'card';
  card.innerHTML = `<h2>Gestalt — sessão prática</h2>
    <p>Experimentos: consciência no aqui-agora, contato autêntico e ação responsável.</p>`;
  const sec1 = checklistSection('Abertura (awareness)', [
    'Aterrisagem corporal (respiração 4–6)',
    'Nomear sensação/emoção no presente',
    'Contrato terapêutico breve (o que buscar hoje)'
  ]);
  const sec2 = checklistSection('Miolo (experimentos)', [
    'Cadeira interna (parte crítica ↔ parte vulnerável)',
    'Falar na 1ª pessoa e no presente',
    'Amplificar gesto/fala para acessar conteúdo'
  ]);
  const sec3 = checklistSection('Fechamento', [
    'Pedir/definir 1 próximo passo concreto (5–10 min)',
    'Registrar aprendizado em 1 frase',
    'Combinar micro-tarefa da semana'
  ]);
  root.appendChild(card); root.appendChild(sec1); root.appendChild(sec2); root.appendChild(sec3);
}
