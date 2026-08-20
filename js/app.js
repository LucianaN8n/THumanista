const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const pad = (n) => String(n).padStart(2, '0');
const round2 = (v) => Math.round(v * 100) / 100;

/* =========================================================================
   1) BASE DE CONHECIMENTO — 10 abordagens do curso "Terapeuta Humanista e
   Saúde Emocional". Cada protocolo tem objetivo, 3 fases (abertura, miolo,
   fechamento), tarefa de casa, indicadores de acompanhamento e cuidados
   clínicos. Nada de frase de preenchimento genérico — cada linha é uma
   intervenção concreta.
   ========================================================================= */
const TECH_PROTOCOLS = {
  GESTALT: {
    label: 'Gestalt-terapia',
    objetivo: 'Ampliar a consciência (awareness) no aqui-e-agora, restaurar o contato autêntico e devolver responsabilidade pela escolha.',
    abertura: [
      'Aterrissagem corporal: pés no chão, 3 respirações 4-6, nomear 3 sensações e 1 emoção presente, sem tentar mudá-las.',
      'Contrato de sessão breve: "o que você quer levar daqui hoje?".',
      'Mapear figura–fundo: o que está em primeiro plano (sintoma) e o que está no fundo (necessidade não dita).'
    ],
    miolo: [
      'Cadeira vazia / diálogo de polaridades: colocar em cena as duas partes em conflito (ex.: Crítico × Vulnerável, Controlador × Espontâneo) e alternar entre elas.',
      'Amplificação: pedir para repetir a frase ou o gesto que escapou, aumentando o volume/intensidade para acessar o conteúdo emocional.',
      'Linguagem de responsabilidade: substituir "não consigo" por "estou escolhendo ___, e o custo disso é ___".',
      'Experimento no aqui-e-agora com o vínculo terapêutico: "o que está acontecendo entre nós agora?" quando pertinente.'
    ],
    fechamento: [
      'Fechar o ciclo de contato: nomear o que ficou resolvido e o que ficou em aberto para a próxima sessão.',
      'Definir 1 ajuste criativo concreto para a semana (uma ação pequena e viável, não uma intenção vaga).',
      'Checar o corpo antes de encerrar (tensão residual, respiração).'
    ],
    tarefa: 'Diário de awareness diário (3–5 min): sensação → emoção → necessidade → micro-ação tentada.',
    indicadores: 'Frequência de frases de responsabilização ("eu escolho" vs. "eu não consigo"); nível de contato ocular e presença relatada; redução de interrupções de contato (retroflexão, projeção, confluência) identificadas em sessão.',
    cuidados: 'Respeitar a janela de tolerância — não empurrar para o afeto além do que a pessoa suporta integrar na sessão.'
  },

  FAP: {
    label: 'Psicoterapia Analítica Funcional (FAP)',
    objetivo: 'Usar a relação terapêutica em tempo real como laboratório: reforçar naturalmente os Comportamentos Clinicamente Relevantes de melhora (CRB2) enquanto ocorrem na sessão.',
    abertura: [
      'Mapear com o paciente 1–2 padrões-problema que aparecem tanto na vida quanto na relação terapêutica (ex.: evitar discordar, antecipar rejeição).',
      'Explicar a lógica da FAP em linguagem simples: "coisas que acontecem entre nós aqui também acontecem lá fora — vamos usar isso".',
      'Definir com o paciente o que seria um CRB2 (comportamento de melhora) observável dentro da sessão.'
    ],
    miolo: [
      'Presença plena do terapeuta: reagir de forma genuína e imediata (não roteirizada) quando o CRB2 aparece — reforço natural, não elogio vazio.',
      'Provocar terapeuticamente pequenas oportunidades de risco relacional dentro da sessão (discordar do terapeuta, pedir algo, expressar desconforto).',
      'Nomear o padrão no momento em que ele acontece: "percebo que você está fazendo X agora, comigo — é o que também acontece com [pessoa da vida real]?".',
      'Generalização: conectar explicitamente o que ocorreu na sessão com uma situação real da semana.'
    ],
    fechamento: [
      'Revisar juntos: o que foi um CRB1 (problema) e o que foi um CRB2 (melhora) na sessão de hoje.',
      'Combinar 1 pedido ou limite real para praticar fora da sessão, usando o script: "Eu + pedido concreto + alternativa".',
      'Reforçar verbalmente o risco relacional tomado dentro da sessão.'
    ],
    tarefa: '1 pedido ou limite real por semana, registrando com quem, o que foi dito e o que aconteceu.',
    indicadores: 'Frequência de CRB2 em sessão; qualidade do vínculo relatada; pedidos/limites efetivamente realizados fora da sessão.',
    cuidados: 'A intervenção depende de reação genuína do terapeuta — evitar reforço mecânico ou fórmulas decoradas.'
  },

  CFT: {
    label: 'Terapia Focada na Compaixão (CFT)',
    objetivo: 'Regular o sistema de ameaça e ativar o sistema de cuidado/afiliação, reduzindo vergonha e autocrítica.',
    abertura: [
      'Psicoeducação breve dos três sistemas de regulação emocional (ameaça, impulso/busca, contentamento/cuidado).',
      'Respiração calmante ritmada 4-4-6, 3 ciclos, com foco no ritmo mais do que na profundidade.',
      'Explorar o tom de voz e a postura da autocrítica habitual — sem julgá-la, só descrevê-la.'
    ],
    miolo: [
      'Construção do eu compassivo: características, tom de voz, postura corporal, e uma imagem ou figura que represente sabedoria e força gentil.',
      'Reescrever um diálogo interno crítico recente, respondendo a partir do eu compassivo — não é ignorar o problema, é abordá-lo com força e cuidado.',
      'Trabalhar vergonha: distinguir vergonha externa (o que os outros pensam) de vergonha interna (autoavaliação) e de culpa (o que fiz).',
      'Prática de imaginação compassiva dirigida ao eu do passado em um momento difícil.'
    ],
    fechamento: [
      'Definir um ritual breve de compaixão (2x/dia, 2–3 min) para a semana.',
      'Nomear 1 situação da semana em que a autocrítica provavelmente vai aparecer, e como o eu compassivo responderia.'
    ],
    tarefa: 'Diário de compaixão, 5 min/dia: 1 momento difícil + resposta escrita a partir do eu compassivo.',
    indicadores: 'Frequência e intensidade da autocrítica (escala 0–10 diária); engajamento em atividades evitadas por vergonha; tom de voz interno relatado.',
    cuidados: 'Pode emergir tristeza intensa ao acessar o cuidado (medo de compaixão) — conduzir com ritmo gentil e validar a reação.'
  },

  DBT: {
    label: 'Terapia Comportamental Dialética (DBT)',
    objetivo: 'Aumentar tolerância à angústia, regulação emocional e efetividade interpessoal, reduzindo comportamentos impulsivos.',
    abertura: [
      'Mindfulness breve (3 min): observar e descrever sem julgar.',
      'Psicoeducação sobre a função da emoção (toda emoção comunica algo, mesmo quando é desproporcional).',
      'Mapear vulnerabilidades recentes: sono, alimentação, substâncias, sobrecarga.'
    ],
    miolo: [
      'Tolerância à aflição: apresentar e praticar 1–2 habilidades TIPP (Temperatura fria, exercício intenso breve, respiração pausada, relaxamento muscular) ou ACCEPTS.',
      'Ação oposta: identificar a emoção, a ação que ela empurra, e a ação oposta funcional (ex.: medo evitativo → aproximação gradual).',
      'DEAR MAN (efetividade interpessoal): role-play de um pedido ou recusa real, com atenção a tom, postura e negociação.',
      'Se houver risco: construir ou revisar plano de crise por escrito, com passos e contatos.'
    ],
    fechamento: [
      'Escolher 1 habilidade para praticar preventivamente (não só em crise) até a próxima sessão.',
      'Reforçar o que funcionou na sessão, nomeando especificamente a habilidade usada.'
    ],
    tarefa: '2 práticas por dia (1 mindfulness + 1 habilidade de tolerância ou interpessoal), registradas em diário de habilidades.',
    indicadores: 'Frequência e intensidade de picos emocionais (0–10); número de rupturas de vínculo/impulsividade na semana; habilidades usadas espontaneamente.',
    cuidados: 'Monitorar risco de forma direta e regular; ter rede de apoio e plano de crise sempre atualizados quando houver histórico de crise.'
  },

  EXPOSICAO: {
    label: 'Terapia de Exposição Gradual',
    objetivo: 'Reduzir evitação e medo condicionado através de exposição sistemática, sem comportamentos de segurança.',
    abertura: [
      'Psicoeducação sobre habituação: o medo sobe, platô, e desce sozinho se a pessoa permanecer em contato.',
      'Construir hierarquia de exposição (0–100) com 8–10 situações evitadas, da mais leve à mais intensa.',
      'Identificar comportamentos de segurança usados atualmente (celular, fone, script pronto, companhia) — serão retirados nas exposições.'
    ],
    miolo: [
      'Selecionar 1–2 itens leves (20–40) da hierarquia para a exposição da semana.',
      'Durante a exposição: registrar SUDS (0–10) a cada poucos minutos; permanecer até queda perceptível, nunca sair no pico.',
      'Comparar previsão catastrófica × o que de fato ocorreu, corrigindo distorções específicas.',
      'Progredir na hierarquia apenas quando o item atual já não gera SUDS alto — sem pressa artificial.'
    ],
    fechamento: [
      'Registrar tempo total em contato com a situação e SUDS inicial/final.',
      'Agendar a próxima exposição (dia, hora, situação específica) antes de sair da sessão.'
    ],
    tarefa: '2–3 exposições por semana, sem comportamentos de segurança, com registro de SUDS antes/depois.',
    indicadores: 'Queda de SUDS ao longo das repetições; redução de comportamentos de segurança; ampliação do raio de situações toleradas.',
    cuidados: 'Nunca expor além da capacidade de recuperação da pessoa; suspender e reavaliar se houver dissociação significativa.'
  },

  CASAIS: {
    label: 'Terapia de Casais',
    objetivo: 'Interromper padrões de interação desadaptativos, tornar visíveis as emoções ocultas por trás do conflito e reconstruir intimidade e confiança.',
    abertura: [
      'Avaliação do casal: história do relacionamento, ciclo de conflito típico (quem persegue, quem se afasta), e o que cada um busca proteger.',
      'Nomear o padrão de interação como o "inimigo comum" do casal, e não a culpa de uma pessoa.',
      'Regras básicas de sessão: falar por si (eu-mensagens), sem interromper.'
    ],
    miolo: [
      'Trazer à tona a emoção oculta por trás da emoção reativa (ex.: raiva escondendo medo de abandono) — validação recíproca guiada.',
      'Intervenção comportamental direta: pedir para o casal reencenar um conflito recente, mais devagar, nomeando o que sentem no corpo em cada momento.',
      'Tolerância ativa: diferenciar o que pode ser aceito como diferença de personalidade do que precisa de mudança real.',
      'Se houver mágoa/traição: nomear o evento, o impacto, e iniciar o processo de reparação — sem apressar o perdão.'
    ],
    fechamento: [
      'Cada pessoa nomeia 1 necessidade específica que gostaria que o outro atendesse essa semana (pedido concreto, não queixa).',
      'Combinar 1 momento de conexão programado (não espontâneo) até o próximo encontro.'
    ],
    tarefa: 'Registrar 1 episódio de conflito na semana identificando: gatilho → emoção reativa → emoção oculta → o que foi pedido.',
    indicadores: 'Frequência e intensidade dos episódios de conflito; tempo de recuperação após conflito; momentos de conexão positiva relatados.',
    cuidados: 'Rastrear sinais de violência doméstica ou dinâmica de poder abusiva — nesses casos a terapia de casal conjunta pode não ser indicada; avaliar atendimento individual e encaminhamento.'
  },

  FAMILIA: {
    label: 'Terapia Familiar',
    objetivo: 'Reorganizar padrões relacionais disfuncionais no sistema familiar, respeitando o ciclo de vida e a hierarquia saudável entre gerações.',
    abertura: [
      'Genograma ou mapa rápido da estrutura familiar e do momento do ciclo vital (nascimento de filho, adolescência, ninho vazio, luto).',
      'Identificar quem participa da sessão e o papel de cada um na queixa apresentada.',
      'Nomear a regra da casa: todos falam, ninguém é "o problema" sozinho.'
    ],
    miolo: [
      'Intervenção estrutural: observar e ajustar hierarquias e fronteiras entre subsistemas (casal, pais-filhos, irmãos) que estejam confusas ou rígidas demais.',
      'Terapia narrativa: externalizar o problema ("o problema é o problema, não a pessoa") para reduzir culpabilização.',
      'Intervenção estratégica pontual: propor uma tarefa que quebre o padrão repetitivo identificado (ex.: trocar quem medeia um conflito).',
      'Psicoeducação parental quando pertinente: expectativas por idade, consequências lógicas versus punição.'
    ],
    fechamento: [
      'Cada membro nomeia 1 mudança pequena e observável que gostaria de ver até o próximo encontro.',
      'Definir 1 ritual familiar (refeição, conversa semanal) como espaço protegido de conexão.'
    ],
    tarefa: 'Diário familiar breve: 1 situação da semana em que o padrão antigo apareceu e o que foi tentado de diferente.',
    indicadores: 'Frequência de conflitos abertos; clareza de papéis e limites relatada; adesão ao ritual familiar combinado.',
    cuidados: 'Avaliar histórico de violência ou negligência antes de sessões conjuntas; garantir que nenhum membro seja exposto a retaliação por falar.'
  },

  LUTO: {
    label: 'Terapia em Lutos e Perdas',
    objetivo: 'Acompanhar as tarefas do processo de luto sem patologizar a dor, identificando quando o luto se torna prolongado e precisa de intervenção ativa.',
    abertura: [
      'Acolher a narrativa da perda sem pressa — história de quem/o que foi perdido, e como foi a despedida (ou a ausência dela).',
      'Psicoeducação sobre fases não lineares do luto e sobre a diferença entre tristeza saudável e luto prolongado/complicado.',
      'Avaliar sinais de risco: ideação de morte, isolamento total, uso de substâncias como fuga.'
    ],
    miolo: [
      'Trabalhar as tarefas do luto: aceitar a realidade da perda, processar a dor, adaptar-se a um mundo sem quem partiu, encontrar uma forma de manter conexão simbólica.',
      'Identificar distorções cognitivas associadas ao luto (culpa excessiva, "eu deveria ter...", crenças de que sentir alívio é traição).',
      'Técnicas expressivas: carta não enviada, cadeira vazia para diálogo simbólico, ritual de despedida construído junto.',
      'Se luto prolongado: trabalhar especificamente a evitação de lembranças e a reconstrução de rotina e vínculos.'
    ],
    fechamento: [
      'Nomear 1 forma de honrar a memória que não seja evitativa nem paralisante.',
      'Verificar rede de apoio disponível para os próximos dias.'
    ],
    tarefa: 'Diário de luto: registrar momentos de lembrança (dolorosos ou reconfortantes) sem tentar afastá-los.',
    indicadores: 'Presença/ausência de ideação de morte; funcionamento diário básico (sono, alimentação, trabalho); capacidade de acessar memórias sem colapso total.',
    cuidados: 'Luto com ideação suicida ativa ou funcionamento gravemente comprometido exige avaliação de risco imediata e articulação com rede de saúde mental.'
  },

  TCC: {
    label: 'Terapia Cognitivo-Comportamental (TCC)',
    objetivo: 'Identificar e reestruturar cognições disfuncionais que sustentam o sofrimento, testando-as contra a realidade.',
    abertura: [
      'Conceitualização cognitiva breve: situação → pensamento automático → emoção → comportamento.',
      'Psicoeducação sobre a relação entre pensamento, emoção e comportamento usando um exemplo recente do próprio paciente.',
      'Definir a queixa-alvo da sessão em termos comportamentais observáveis.'
    ],
    miolo: [
      'Identificação de cognições disfuncionais: registrar pensamentos automáticos ligados à situação-alvo e nomear a distorção (catastrofização, leitura mental, tudo-ou-nada, etc.).',
      'Reestruturação cognitiva: questionar evidências a favor/contra, buscar interpretação alternativa mais equilibrada.',
      'Escolher e aplicar 1 técnica cognitivo-comportamental específica ao caso (registro de pensamentos, experimento comportamental, seta descendente).',
      'Testar a nova interpretação com um pequeno experimento comportamental combinado para a semana.'
    ],
    fechamento: [
      'Resumir a distorção identificada e a interpretação alternativa em uma frase curta e memorável.',
      'Definir a tarefa de casa vinculada diretamente ao experimento combinado.'
    ],
    tarefa: 'Registro de pensamentos disfuncionais (situação, pensamento, emoção 0–10, pensamento alternativo, reavaliação da emoção).',
    indicadores: 'Frequência de distorções identificadas de forma autônoma; intensidade emocional antes/depois da reestruturação; adesão ao experimento comportamental.',
    cuidados: 'Reestruturação não é convencer a pessoa de que está errada — é testar a interpretação junto com ela, com genuína curiosidade.'
  },

  PSICANALISE: {
    label: 'Psicanálise Humanista',
    objetivo: 'Favorecer autoconhecimento e autodeterminação a partir de uma escuta não diretiva, integrando necessidades de desenvolvimento não atendidas.',
    abertura: [
      'Escuta livre inicial: convidar a pessoa a trazer o que estiver mais presente, sem pauta fixa do terapeuta.',
      'Observar (sem interpretar ainda) padrões relacionais que se repetem na fala — com figuras de autoridade, pares, parceiros.',
      'Situar a queixa atual dentro da hierarquia de necessidades da pessoa (o que está insatisfeito: segurança, pertencimento, estima, autorrealização).'
    ],
    miolo: [
      'Terapia centrada no cliente: refletir de volta o conteúdo emocional com empatia genuína e aceitação incondicional, sem corrigir ou aconselhar precocemente.',
      'Apontar gentilmente repetições de padrão quando aparecem entre sessões (o mesmo tipo de vínculo, o mesmo desfecho).',
      'Explorar a origem do padrão no desenvolvimento da pessoa, sem forçar interpretação — seguir o ritmo de quem fala.',
      'Nomear a transferência quando ela aparecer de forma útil para a compreensão do padrão (como a pessoa se relaciona com o próprio terapeuta).'
    ],
    fechamento: [
      'Devolver, em linguagem simples, o padrão observado na sessão, perguntando se ele reconhece isso em si.',
      'Deixar o fechamento em aberto quando necessário — nem toda sessão precisa de tarefa fechada.'
    ],
    tarefa: 'Observação livre entre sessões: notar 1 momento em que o padrão relacional identificado apareceu, sem precisar mudá-lo ainda.',
    indicadores: 'Grau de autoconhecimento verbalizado; reconhecimento espontâneo de padrões repetidos; qualidade do vínculo terapêutico como espaço seguro.',
    cuidados: 'Evitar interpretações prematuras ou impostas — o ritmo de elaboração é do paciente, não do terapeuta.'
  }
};

/* =========================================================================
   2) MOTOR DE RECOMENDAÇÃO — soma pontos por técnica a partir de sintomas,
   padrões, preferências do paciente e contexto do caso (individual, casal,
   família, luto recente). O contexto tem peso decisivo: casal/família/luto
   são disparados pelo contexto, não inferidos de sintomas soltos.
   ========================================================================= */
function scoreTechs({ sintomas = [], padroes = [], prefs = [], contexto = 'individual' }) {
  const sc = { GESTALT:0, FAP:0, CFT:0, DBT:0, EXPOSICAO:0, CASAIS:0, FAMILIA:0, LUTO:0, TCC:0, PSICANALISE:0 };
  const has = (arr, v) => arr.includes(v);

  if (has(sintomas, 'ansiedade'))                 { sc.DBT += 2; sc.EXPOSICAO += 3; sc.GESTALT += 1; }
  if (has(sintomas, 'depressao_apatia'))          { sc.CFT += 2; sc.DBT += 1; sc.TCC += 2; sc.GESTALT += 1; }
  if (has(sintomas, 'autocritica_vergonha'))      { sc.CFT += 3; }
  if (has(sintomas, 'impulsividade_labilidade'))  { sc.DBT += 3; }
  if (has(sintomas, 'isolamento_evitacao'))       { sc.EXPOSICAO += 3; sc.GESTALT += 1; }
  if (has(sintomas, 'pensamentos_disfuncionais')) { sc.TCC += 3; }
  if (has(sintomas, 'desconexao_presente'))       { sc.GESTALT += 3; }
  if (has(sintomas, 'baixa_autoestima'))          { sc.CFT += 2; sc.PSICANALISE += 1; }

  if (has(padroes, 'evitacao'))                   { sc.EXPOSICAO += 3; }
  if (has(padroes, 'autocritica'))                { sc.CFT += 3; }
  if (has(padroes, 'impulsividade'))              { sc.DBT += 3; }
  if (has(padroes, 'rigidez_controle'))           { sc.GESTALT += 2; sc.PSICANALISE += 1; }
  if (has(padroes, 'dificuldade_limites'))        { sc.FAP += 3; }
  if (has(padroes, 'ruptura_vinculo'))            { sc.PSICANALISE += 2; sc.CASAIS += 1; sc.FAMILIA += 1; }
  if (has(padroes, 'ruminacao_distorcao'))        { sc.TCC += 3; }
  if (has(padroes, 'padrao_relacional_repetitivo')) { sc.PSICANALISE += 3; }

  if (has(prefs, 'experiencial'))                 { sc.GESTALT += 2; }
  if (has(prefs, 'cognitivo'))                    { sc.TCC += 2; }
  if (has(prefs, 'corporal_regulacao'))           { sc.DBT += 1; sc.CFT += 1; }
  if (has(prefs, 'historico_desenvolvimento'))    { sc.PSICANALISE += 2; }
  if (has(prefs, 'sistemico_vinculo'))            { sc.CASAIS += 1; sc.FAMILIA += 1; }

  if (contexto === 'casal')  sc.CASAIS  += 6;
  if (contexto === 'familia') sc.FAMILIA += 6;
  if (contexto === 'luto')    sc.LUTO    += 8;

  return sc;
}

function topN(sc, n = 3) {
  return Object.entries(sc)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

/* =========================================================================
   3) PLANO DE 4 SEMANAS — construído a partir das técnicas top-2 (a 3ª
   entra como técnica complementar, sem semana própria, para não diluir
   o plano). Cada semana puxa itens reais dos protocolos, não texto genérico.
   ========================================================================= */
function buildPlan(top3) {
  const [t1, t2] = top3;
  const p1 = TECH_PROTOCOLS[t1];
  const p2 = t2 ? TECH_PROTOCOLS[t2] : null;

  const semanas = [];

  semanas.push({
    titulo: `Semana 1 — Base & abertura (${p1.label}${p2 ? ' + ' + p2.label : ''})`,
    itens: [
      ...p1.abertura,
      ...(p2 ? [p2.abertura[0]] : [])
    ],
    indicadores: [p1.indicadores, ...(p2 ? [p2.indicadores] : [])]
  });

  semanas.push({
    titulo: `Semana 2 — Aprofundamento (${p1.label})`,
    itens: p1.miolo,
    indicadores: [p1.indicadores]
  });

  semanas.push({
    titulo: `Semana 3 — Integração${p2 ? ' (' + p2.label + ')' : ''}`,
    itens: p2 ? p2.miolo : p1.miolo.slice().reverse(),
    indicadores: p2 ? [p2.indicadores] : [p1.indicadores]
  });

  semanas.push({
    titulo: 'Semana 4 — Consolidação & prevenção de recaída',
    itens: [
      ...p1.fechamento,
      ...(p2 ? p2.fechamento : []),
      'Revisar com o paciente: o que funcionou nas últimas 4 semanas e deve continuar sendo praticado sozinho.'
    ],
    indicadores: ['Comparar indicadores da Semana 1 com os atuais (queda/estabilização esperada).', '1º passo do próximo mês definido e agendado.']
  });

  return semanas;
}

/* =========================================================================
   4) ESTADO & RENDER DO FORMULÁRIO
   ========================================================================= */
const SINTOMAS = [
  ['ansiedade', 'Ansiedade'],
  ['depressao_apatia', 'Depressão / apatia'],
  ['autocritica_vergonha', 'Autocrítica / vergonha intensa'],
  ['impulsividade_labilidade', 'Impulsividade / labilidade emocional'],
  ['isolamento_evitacao', 'Isolamento / evitação social'],
  ['pensamentos_disfuncionais', 'Pensamentos disfuncionais recorrentes'],
  ['desconexao_presente', 'Desconexão do momento presente'],
  ['baixa_autoestima', 'Baixa autoestima']
];
const PADROES = [
  ['evitacao', 'Evitação de situações/sentimentos'],
  ['autocritica', 'Autocrítica severa'],
  ['impulsividade', 'Impulsividade'],
  ['rigidez_controle', 'Rigidez / necessidade de controle'],
  ['dificuldade_limites', 'Dificuldade de colocar limites'],
  ['ruptura_vinculo', 'Ruptura ou instabilidade de vínculos'],
  ['ruminacao_distorcao', 'Ruminação / distorções cognitivas'],
  ['padrao_relacional_repetitivo', 'Padrão relacional que se repete']
];
const PREFS = [
  ['experiencial', 'Prefere abordagem experiencial/corporal'],
  ['cognitivo', 'Prefere abordagem cognitiva/estruturada'],
  ['corporal_regulacao', 'Prefere foco em regulação corporal'],
  ['historico_desenvolvimento', 'Prefere explorar história de desenvolvimento'],
  ['sistemico_vinculo', 'Prefere foco no sistema de vínculos']
];

function renderChecklist(container, items, groupClass) {
  container.innerHTML = items.map(([v, label]) => `
    <label class="check">
      <input type="checkbox" class="${groupClass}" value="${v}">
      <span>${esc(label)}</span>
    </label>`).join('');
}

function getSelections() {
  return {
    sintomas: $$('.sym:checked').map(c => c.value),
    padroes: $$('.pat:checked').map(c => c.value),
    prefs: $$('.pref:checked').map(c => c.value),
    contexto: ($('input[name="contexto"]:checked') || {}).value || 'individual'
  };
}

function renderProtocolo(key) {
  const p = TECH_PROTOCOLS[key];
  return `
    <div class="protocolo">
      <h4>${esc(p.label)}</h4>
      <p class="objetivo">${esc(p.objetivo)}</p>
      <div class="fase"><b>Abertura</b><ul>${p.abertura.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
      <div class="fase"><b>Miolo</b><ul>${p.miolo.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
      <div class="fase"><b>Fechamento</b><ul>${p.fechamento.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
      <div class="meta-row">
        <div><b>Tarefa de casa</b>${esc(p.tarefa)}</div>
        <div><b>Indicadores</b>${esc(p.indicadores)}</div>
      </div>
      <div class="meta-row"><div><b>Cuidados clínicos</b>${esc(p.cuidados)}</div></div>
    </div>`;
}

function renderPlanEditor(semanas) {
  const editor = $('#plano-editor');
  editor.innerHTML = semanas.map(w => `
    <div class="plan week">
      <h3>${esc(w.titulo)}</h3>
      <div class="table-like">
        <div class="cell"><b>Intervenções da semana</b>
          <ul>${w.itens.map(i => `<li contenteditable="true">${esc(i)}</li>`).join('')}</ul>
        </div>
        <div class="cell"><b>Indicadores & follow-up</b>
          <ul>${w.indicadores.map(i => `<li contenteditable="true">${esc(i)}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`).join('');
}

let ultimoResultado = null; // { top3, semanas } — usado pela exportação em PDF

function gerarParecer() {
  const sel = getSelections();
  const nomeEl = $('#f-nome');
  if (!nomeEl.value.trim()) {
    nomeEl.focus();
    nomeEl.reportValidity && nomeEl.reportValidity();
  }

  const sc = scoreTechs(sel);
  const t3 = topN(sc, 3);

  const alertBox = $('#alerta-vazio');
  if (t3.length === 0) {
    alertBox.style.display = 'block';
    $('#resultado').style.display = 'none';
    return;
  }
  alertBox.style.display = 'none';

  $('#techs-picked').innerHTML = t3.map(k => `<span class="tag">${esc(TECH_PROTOCOLS[k].label)}</span>`).join('');
  $('#protocolos').innerHTML = t3.map(renderProtocolo).join('');

  const semanas = buildPlan(t3);
  renderPlanEditor(semanas);

  ultimoResultado = { top3: t3, semanas };
  $('#resultado').style.display = 'block';
  $('#resultado').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function limparFormulario() {
  ['f-nome','f-idade','f-queixa','f-objetivo','f-riscos','f-obs'].forEach(id => { const el = $('#'+id); if (el) el.value=''; });
  $$('.sym, .pat, .pref').forEach(c => c.checked = false);
  const ind = $('input[name="contexto"][value="individual"]'); if (ind) ind.checked = true;
  $('#resultado').style.display = 'none';
  $('#alerta-vazio').style.display = 'none';
  ultimoResultado = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =========================================================================
   5) EXPORTAÇÃO EM PDF — mesma técnica de fatiamento em alta nitidez já
   usada no app (html2canvas + jsPDF, libs locais em /vendor).
   ========================================================================= */
async function exportPdf() {
  if (!ultimoResultado) { alert('Gere o parecer antes de baixar o PDF.'); return; }
  if (!(window.html2canvas && window.jspdf)) {
    alert('Bibliotecas locais não carregadas. Verifique /vendor/html2canvas.min.js e /vendor/jspdf.umd.min.js.');
    return;
  }

  const nome = ($('#f-nome').value || 'Paciente').trim();
  const idade = $('#f-idade').value || '—';
  const queixa = $('#f-queixa').value || '—';
  const objetivo = $('#f-objetivo').value || '—';
  const riscos = $('#f-riscos').value || '—';
  const obs = $('#f-obs').value || '—';
  const now = new Date();
  const dh = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const root = document.createElement('div');
  root.className = 'print-wrap';
  root.innerHTML = `
    <h2>Parecer Clínico &amp; Plano de 4 Semanas — Mentor Humanista</h2>
    <div class="meta">Data: <b>${esc(dh)}</b></div>
    <div class="block">
      <h3>Dados do paciente</h3>
      <div class="kv"><b>Nome:</b> ${esc(nome)}</div>
      <div class="kv"><b>Idade:</b> ${esc(idade)}</div>
      <div class="kv"><b>Queixa principal:</b> ${esc(queixa)}</div>
      <div class="kv"><b>Objetivo terapêutico:</b> ${esc(objetivo)}</div>
      <div class="kv"><b>Riscos/atenção:</b> ${esc(riscos)}</div>
      <div class="kv"><b>Observações do terapeuta:</b> ${esc(obs)}</div>
    </div>
    <div class="block">
      <h3>Abordagens recomendadas para este caso</h3>
      ${ultimoResultado.top3.map(k => {
        const p = TECH_PROTOCOLS[k];
        return `<h4>${esc(p.label)}</h4>
          <div class="objetivo">${esc(p.objetivo)}</div>
          <div class="kv"><b>Abertura:</b></div><ul>${p.abertura.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
          <div class="kv"><b>Miolo:</b></div><ul>${p.miolo.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
          <div class="kv"><b>Fechamento:</b></div><ul>${p.fechamento.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
          <div class="kv"><b>Tarefa de casa:</b> ${esc(p.tarefa)}</div>
          <div class="kv"><b>Cuidados clínicos:</b> ${esc(p.cuidados)}</div>`;
      }).join('<div class="block"></div>')}
    </div>
    <div class="block">
      <h3>Plano de 4 semanas</h3>
      ${$$('#plano-editor .week').map(w => {
        const titulo = w.querySelector('h3')?.textContent || '';
        const its = Array.from(w.querySelectorAll('.cell:nth-child(1) li')).map(li => li.textContent.trim());
        const inds = Array.from(w.querySelectorAll('.cell:nth-child(2) li')).map(li => li.textContent.trim());
        return `<h4>${esc(titulo)}</h4>
          <div class="kv"><b>Intervenções:</b></div><ul>${its.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>
          <div class="kv"><b>Indicadores &amp; follow-up:</b></div><ul>${inds.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`;
      }).join('')}
    </div>
    <div class="block"><h3>Observações e combinações</h3><ul><li>(preencher em sessão)</li></ul></div>`;

  const mount = document.createElement('div');
  mount.style.position = 'fixed'; mount.style.left = '-10000px'; mount.appendChild(root);
  document.body.appendChild(mount);

  const A4_W = 794, A4_H = 1123;
  root.style.width = A4_W + 'px';

  const device = Math.max(2, Math.ceil(window.devicePixelRatio || 1));
  const canvas = await html2canvas(root, {
    scale: 3 * device / 3,
    backgroundColor: '#fff', useCORS: true, foreignObjectRendering: false, willReadFrequently: true
  });
  const imgW = canvas.width, imgH = canvas.height;

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'pt', 'a4');
  const px2pt = px => px * 0.75;
  const pageW = px2pt(A4_W), pageH = px2pt(A4_H);
  const pageSlicePx = Math.floor(A4_H * (canvas.width / A4_W));
  const margin = 6, overlap = 4;

  let rendered = 0, page = 0;
  while (rendered < imgH) {
    let sliceH = Math.min(pageSlicePx, imgH - rendered);
    if (rendered + sliceH < imgH) sliceH += overlap;

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = imgW; pageCanvas.height = sliceH;
    pageCanvas.getContext('2d').drawImage(canvas, 0, rendered, imgW, sliceH, 0, 0, imgW, sliceH);
    const url = pageCanvas.toDataURL('image/png');

    if (page > 0) pdf.addPage();
    const x = round2(px2pt(margin)), y = round2(px2pt(margin));
    const w = round2(pageW - px2pt(margin * 2));
    const h = round2(pageH - px2pt(margin * 2));
    pdf.addImage(url, 'PNG', x, y, w, h);

    pdf.setFontSize(9); pdf.setTextColor(68, 104, 108);
    pdf.text(nome, x, pageH - px2pt(5));
    const tw = pdf.getTextWidth(dh);
    pdf.text(dh, pageW - x - tw, pageH - px2pt(5));

    rendered += pageSlicePx;
    page++;
  }

  const nomeArq = (nome || 'paciente').replace(/\s+/g, '_').toLowerCase();
  pdf.save(`parecer_${nomeArq}.pdf`);
  mount.remove();
}

/* =========================================================================
   6) INIT
   ========================================================================= */
function postHeight() {
  const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  try { parent.postMessage({ type: 'thse-resize', height: h }, '*'); } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  renderChecklist($('#check-sintomas'), SINTOMAS, 'sym');
  renderChecklist($('#check-padroes'), PADROES, 'pat');
  renderChecklist($('#check-prefs'), PREFS, 'pref');

  $('#btn-gerar').addEventListener('click', gerarParecer);
  $('#btn-limpar').addEventListener('click', limparFormulario);
  $('#btn-pdf').addEventListener('click', exportPdf);

  const ro = new ResizeObserver(() => postHeight());
  ro.observe(document.body);
  window.addEventListener('load', postHeight);
  window.addEventListener('resize', postHeight);
});
