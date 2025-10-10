/* THSE – Mentor Humanista (Gestalt + Comportamental)
   Regras:
   - Seleciona até 3 técnicas com base na anamnese (sintomas, padrões, preferências).
   - Gera roteiro detalhado (Sessões 1–3), tarefas, indicadores e cuidados.
   - PDF via jsPDF quando disponível; fallback: cópia textual + instrução.
*/
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const today = new Date();
  $("#today").textContent = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(today);

  const fields = {
    nome: $("#nome"),
    idade: $("#idade"),
    queixa: $("#queixa"),
    objetivo: $("#objetivo"),
    sintomas: $$(".sym"),
    padroes: $$(".pat"),
    prefs: $$(".pref"),
    severidade: $("#severidade"),
    riscos: $("#riscos"),
    obs: $("#obs"),
    parecer: $("#parecer"),
    gerar: $("#gerar"),
    pdf: $("#pdf"),
    limpar: $("#limpar"),
  };

  const TECHS = {
    "CFT": { nome:"Terapia Focada na Compaixão (CFT)"},
    "FAP": { nome:"Psicoterapia Analítica Funcional (FAP)"},
    "DBT": { nome:"Terapia Comportamental Dialética (DBT)"},
    "GESTALT": { nome:"Terapia Gestalt"},
    "HUMAN_DESIGN": { nome:"Desenho Humano"},
    "EXPOSICAO": { nome:"Terapia de exposição gradual"},
    "DEP_ANS_FIS": { nome:"Depressão, ansiedade e doenças físicas"},
    "SAUDE_MENTAL": { nome:"Saúde mental"},
    "EMOCOES_INCERTEZA": { nome:"Gerenciando Emoções em Tempos de Incerteza e Estresse"},
    "FAMILIAR_CASAL": { nome:"Terapia familiar e de casal"},
    "LUTO": { nome:"Terapia em Lutos e perdas"},
    "PARENTAL": { nome:"Educação parental"},
    "AMADURECIMENTO": { nome:"Amadurecimento Pessoal"},
    "FAMILIAR_ESTRATEGICA": { nome:"Terapia familiar estratégica"},
    "FAMILIAR_ESTRUTURAL": { nome:"Terapia estrutural familiar"},
    "TRANSGERACIONAL": { nome:"Terapia Transgeracional"},
    "IMAGO": { nome:"Terapia do Imago (casal)"},
    "IBCT": { nome:"Terapia Comportamental Integrativa de Casais (IBCT)"},
    "AC_ANALITICA": { nome:"Terapia em análise comportamental"},
    "POSPARTO": { nome:"Depressão pós parto"},
    "ABA": { nome:"Análise do Comportamento Aplicada (ABA)"},
    "TOXICOS": { nome:"Relacionamentos tóxicos"},
    "SUBSTANCIAS": { nome:"Transtorno por uso de substâncias"},
    "BURNOUT": { nome:"Transtorno de Burnout"},
    "MEMORIA": { nome:"Reabilitação de memória"},
    "CENTRADO_PESSOA": { nome:"Método clínico centrado na pessoa"},
    "DESENV_GLOBAL": { nome:"Transtornos globais de desenvolvimento"},
    "PSICANALISE_HUM": { nome:"Psicanálise humanista"},
    "BONUS_NR1": { nome:"BÔNUS NR‑1 – Prevenção à Saúde Mental nas Empresas"},
    "BONUS_AUTO": { nome:"BÔNUS – Terapeuta em Terapia (autopsicanálise)"},
    "BONUS_INICIO": { nome:"BÔNUS – Primeiros passos para começar na área"},
  };

  function getSelections(){
    const sintomas = $$(".sym:checked").map(c=>c.value);
    const padroes = $$(".pat:checked").map(c=>c.value);
    const prefs = $$(".pref:checked").map(c=>c.value);
    return {sintomas, padroes, prefs};
  }

  // Scoring rules for techniques
  function scoreTechs(state){
    const {sintomas, padroes, prefs} = state;
    const score = Object.fromEntries(Object.keys(TECHS).map(k=>[k,0]));

    const has = v => sintomas.includes(v);
    const pat = v => padroes.includes(v);
    const pref = v => prefs.includes(v);

    // Core mappings
    if (has("ansiedade")) { score.DBT+=3; score.EXPOSICAO+=3; score.GESTALT+=2; score.CFT+=2; score.SAUDE_MENTAL+=1; }
    if (has("depressao")) { score.CFT+=3; score.SAUDE_MENTAL+=2; score.DBT+=2; score.DEP_ANS_FIS+=2; score.GESTALT+=1; }
    if (has("trauma")) { score.EXPOSICAO+=3; score.DBT+=2; score.GESTALT+=2; score.CFT+=2; }
    if (has("luto")) { score.LUTO+=4; score.GESTALT+=2; score.CFT+=2; }
    if (has("casal")) { score.IMAGO+=4; score.IBCT+=4; score.GESTALT+=2; score.FAMILIAR_CASAL+=2; }
    if (has("parentalidade")) { score.PARENTAL+=4; score.FAMILIAR_ESTRATEGICA+=2; score.FAMILIAR_ESTRUTURAL+=2; }
    if (has("toxicos")) { score.TOXICOS+=3; score.GESTALT+=2; score.CFT+=2; score.FAP+=2; }
    if (has("substancias")) { score.SUBSTANCIAS+=4; score.FAP+=3; score.DBT+=2; }
    if (has("burnout")) { score.BURNOUT+=4; score.DBT+=2; score.CFT+=2; score.AMADURECIMENTO+=1; }
    if (has("posparto")) { score.POSPARTO+=4; score.CFT+=2; score.SAUDE_MENTAL+=2; }
    if (has("memoria")) { score.MEMORIA+=4; score.SAUDE_MENTAL+=1; }
    if (has("desenvolvimento")) { score.ABA+=4; score.PARENTAL+=2; score.DESENV_GLOBAL+=2; }
    if (has("psicossomatico")) { score.DEP_ANS_FIS+=3; score.GESTALT+=2; score.CENTRADO_PESSOA+=2; }

    // Patterns
    if (pat("evitacao")) { score.EXPOSICAO+=3; score.DBT+=1; }
    if (pat("autocritica")) { score.CFT+=4; }
    if (pat("impulsividade")) { score.DBT+=3; score.FAP+=2; }
    if (pat("ruminacao")) { score.CFT+=2; score.GESTALT+=2; }
    if (pat("conflito_relacional")) { score.IMAGO+=3; score.IBCT+=3; score.GESTALT+=1; }
    if (pat("hipervigilancia")) { score.EXPOSICAO+=2; score.DBT+=1; }
    if (pat("apatia")) { score.CFT+=2; score.SAUDE_MENTAL+=2; }
    if (pat("procrastinacao")) { score.CFT+=1; score.CENTRADO_PESSOA+=1; }

    // Preferences
    if (pref("diretivo")) { score.DBT+=1; score.EXPOSICAO+=1; score.IBCT+=1; score.PARENTAL+=1; }
    if (pref("experiencial")) { score.GESTALT+=2; score.IMAGO+=1; }
    if (pref("espiritual")) { score.HUMAN_DESIGN+=2; }
    if (pref("ritmo_suave")) { score.CFT+=2; score.CENTRADO_PESSOA+=1; }

    // Couple/family specific combos fine-tuning
    if (sintomas.includes("casal")) { score.FAMILIAR_CASAL+=1; }
    if (sintomas.includes("parentalidade")) { score.FAMILIAR_ESTRATEGICA+=1; score.FAMILIAR_ESTRUTURAL+=1; }
    if (sintomas.includes("desenvolvimento")) { score.AC_ANALITICA+=1; }

    return score;
  }

  // Build a rich protocol text for each technique
  function protocolFor(techKey, ctx){
    const t = (h) => `\n${h}\n`;
    const wrap = (s)=>s; // keep pre-wrap; manual bullets

    const base = {
      header: `▶ ${TECHS[techKey].nome}`,
      objetivo: "",
      quando: "",
      sessao1: "",
      sessao2: "",
      sessao3: "",
      tarefa: "",
      indicadores: "",
      cuidados: ""
    };

    const nome = ctx.nome || "Paciente";
    const foco = ctx.foco || "queixa atual";

    switch(techKey){
      case "GESTALT":
        base.objetivo = "Aumentar awareness (consciência fenomenológica) no aqui‑e‑agora, restaurar contato e responsabilidade pelas escolhas.";
        base.quando = "Indicado quando há confusão, ruminação ou padrões repetitivos sem clareza de necessidades; útil em conflitos relacionais e autorregulação.";
        base.sessao1 = "• Acordo de setting; escuta ativa.\n• Mapa do ciclo do contato atual (sensação → awareness → mobilização → ação → contato → retraimento).\n• Experimento breve: cadeira vazia (parte crítica × parte vulnerável).";
        base.sessao2 = "• Explorar polaridades (ex.: “controlar” × “ceder”).\n• Trabalho corporal suave (respiração/grounding) para ancorar awareness.\n• Ensaios de diálogo genuíno (eu‑mensagens).";
        base.sessao3 = "• Consolidar novos ajustes criativos.\n• Identificar gatilhos e micro‑escolhas no cotidiano.\n• Plano de prática de presença em 7 dias (3 momentos por dia).";
        base.tarefa = "Diário de awareness (3×/dia): O que sinto no corpo? O que preciso? Qual micro‑ação farei?";
        base.indicadores = "Menos fusão com pensamentos, mais linguagem de responsabilidade (“eu escolho…”), redução de conflitos reativos.";
        base.cuidados = "Evitar forçar experimentos; respeitar janela de tolerância. Adiar confrontos quando o paciente estiver desregulado.";
        break;

      case "DBT":
        base.objetivo = "Aumentar tolerância ao desconforto e regulação emocional via habilidades (mindfulness, tolerância à aflição, regulação, efetividade interpessoal).";
        base.quando = "Impulsividade, oscilações intensas, autolesão ideativa, conflitos recorrentes.";
        base.sessao1 = "• Psicoeducação breve sobre emoções e habilidades DBT.\n• Mindfulness de 3 minutos (foco na respiração).\n• Introduzir Tolerância à Aflição: TIP/ACCEPTS.";
        base.sessao2 = "• Regulação Emocional: identificar vulnerabilidades (sono, alimentação, estresse) + opostos à emoção.\n• Treino de Efetividade Interpessoal (DEAR MAN).";
        base.sessao3 = "• Plano de crise pessoal (passos + contatos).\n• Ensaios comportamentais de pedidos/limites.";
        base.tarefa = "Cartão de habilidades: 2 práticas/dia (mindfulness 3’ + DEAR MAN ou ACCEPTS).";
        base.indicadores = "Redução de picos de intensidade, menos rupturas, maior assertividade.";
        base.cuidados = "Monitorar risco; reforçar rede de suporte. Encaminhar se autolesão aumentar.";
        break;

      case "CFT":
        base.objetivo = "Reduzir autocrítica e vergonha; cultivar sistema de afiliação/segurança através de compaixão treinada.";
        base.quando = "Ruminação com autocrítica; vergonha, depressão, ansiedade social.";
        base.sessao1 = "• Psicoeducação: 3 sistemas (ameaça, impulso, cuidado).\n• Treino de respiração calmante (4‑4‑6).\n• Descobrir tom compassivo (voz, postura).";
        base.sessao2 = "• Imagem do self compassivo (caraterísticas, gestos, frases).\n• Reescrever o diálogo interno crítico.";
        base.sessao3 = "• Prática de compaixão ao outro e ao eu do passado.\n• Plano de rituais breves diários (2×/dia).";
        base.tarefa = "Diário de compaixão: 5’/dia (o que eu diria a um amigo?)";
        base.indicadores = "Menos autocrítica, mais engajamento em tarefas significativas.";
        base.cuidados = "Pode emergir tristeza ao reduzir autocrítica; conduzir com ritmo suave.";
        break;

      case "EXPOSICAO":
        base.objetivo = "Reduzir evitação e medo condicionado via exposição gradual (interoceptiva/situacional) com segurança.";
        base.quando = "Ansiedade, pânico, TEPT leve/moderado, fobias; presença de evitação significativa.";
        base.sessao1 = "• Hierarquia de exposições (0–100).\n• Exposição interoceptiva leve (ex.: girar 30s) + recuperação com respiração 4‑4‑6.\n• Psicoeducação sobre habituação/inibição do medo.";
        base.sessao2 = "• Exposição situacional passo 1 (curta, segura) + registro SUDS.\n• Prevenção de respostas de segurança (reduzir checagem/reasseguramento).";
        base.sessao3 = "• Avançar 1–2 níveis na hierarquia.\n• Treino de pós-exposição: significados aprendidos.";
        base.tarefa = "2 exposições curtas/dia + registro SUDS.";
        base.indicadores = "Queda progressiva de SUDS e evitação; maior aproximação de metas.";
        base.cuidados = "Respeitar janela de tolerância; não expor se risco alto/sem suporte.";
        break;

      case "IMAGO":
        base.objetivo = "Melhorar empatia e conexão do casal via diálogo estruturado (espelho, validação, empatia).";
        base.quando = "Conflitos de casal, escaladas, sensação de não ser ouvido.";
        base.sessao1 = "• Ensinar o Diálogo Imago: falar 1×, ouvir 2× (espelhar, validar, empatizar).\n• Definir tema de baixa carga para treino.";
        base.sessao2 = "• Praticar com tema real. Introduzir pedidos claros e positivos.";
        base.sessao3 = "• Revisar gatilhos infantis reativados; planejar rituais de conexão.";
        base.tarefa = "Ritual 10’/dia: 5’ de fala + 5’ de escuta espelhada.";
        base.indicadores = "Menos escaladas, mais validação espontânea.";
        base.cuidados = "Suspender se houver violência; priorizar segurança.";
        break;

      case "IBCT":
        base.objetivo = "Aumentar aceitação e flexibilidade do casal; reduzir padrões coercitivos e evitar soluções ineficazes.";
        base.quando = "Casais em impasse com padrão de crítica/defesa/evitação.";
        base.sessao1 = "• Formulação: tema do impasse e tentativas fracassadas.\n• Introduzir aceitação empática e união diante do problema.";
        base.sessao2 = "• Treino de reatividade mínima e tolerância ao desconforto.\n• Experimentos de reconciliação com pequenas concessões.";
        base.sessao3 = "• Plano de manutenção com acordos explícitos.";
        base.tarefa = "Experimentos semanais de aceitação + acordos escritos.";
        base.indicadores = "Redução de brigas, maior senso de time.";
        base.cuidados = "Encaminhar se houver abuso/risco.";
        break;

      case "PARENTAL":
        base.objetivo = "Fortalecer repertório parental e consistência de limites/afeto.";
        base.quando = "Dificuldades educativas, comportamentos desafiadores em filhos.";
        base.sessao1 = "• Mapear regras claras, reforço positivo, economia de fichas.\n• Combinar 1 mudança simples para a semana.";
        base.sessao2 = "• Treino de instruções eficazes (curtas, específicas, consistentes).";
        base.sessao3 = "• Plano de rotina visual e reunião familiar semanal.";
        base.tarefa = "Aplicar 1 técnica/dia + registro de sucessos.";
        base.indicadores = "Menos birras, mais cumprimento de combinados.";
        base.cuidados = "Ajustar à idade; observar sinais de neurodivergência.";
        break;

      case "LUTO":
        base.objetivo = "Acompanhar processo de luto com validação, significado e integração.";
        base.quando = "Perdas recentes ou luto complicado.";
        base.sessao1 = "• Linha do tempo do vínculo; validar emoções.\n• Ritual de lembrança (carta, objeto).";
        base.sessao2 = "• Trabalhar ambivalências e culpas.\n• Planejar datas sensíveis.";
        base.sessao3 = "• Projetar continuidade do vínculo interno e reengajamento de vida.";
        base.tarefa = "Diário de reconexão com valores (10’/dia).";
        base.indicadores = "Menos entorpecimento/culpa, mais sentido.";
        base.cuidados = "Risco de complicação: encaminhar se ideação persistente.";
        break;

      case "SUBSTANCIAS":
        base.objetivo = "Reduzir consumo, aumentar análise funcional e habilidades de enfrentamento.";
        base.quando = "Uso problemático/abusivo, recaídas.";
        base.sessao1 = "• Análise funcional ABC; identificar disparadores.\n• Plano de barreiras e substituições compatíveis.";
        base.sessao2 = "• Habilidades DBT de tolerância à aflição.\n• Contrato de sobriedade com rede de apoio.";
        base.sessao3 = "• Prevenção de recaída; planos para alto risco.";
        base.tarefa = "Registro de gatilhos e estratégias usadas.";
        base.indicadores = "Janelas de sobriedade maiores, menos lapsos.";
        base.cuidados = "Avaliar comorbidades médicas; encaminhar quando necessário.";
        break;

      case "BURNOUT":
        base.objetivo = "Restaurar energia, limites e sentido; reduzir exaustão e cinismo.";
        base.quando = "Estresse crônico ocupacional, sobrecarga.";
        base.sessao1 = "• Mapa de estressores e valores.\n• Estratégias de micro‑recuperação diária.";
        base.sessao2 = "• DBT: efetividade interpessoal para limites.\n• Agenda de energia (tarefas x energia).";
        base.sessao3 = "• Recontratar rotina com pausas e rituais.";
        base.tarefa = "Checklist 5‑5‑5 diário (respiração, pausa, micro‑alegria).";
        base.indicadores = "Menos exaustão, mais engajamento com valores.";
        base.cuidados = "Monitorar sinais depressivos; ajustar carga gradualmente.";
        break;

      case "HUMAN_DESIGN":
        base.objetivo = "Oferecer reflexão identitária e tomada de decisão alinhada (abordagem complementar).";
        base.quando = "Paciente interessado em integração espiritual/identitária.";
        base.sessao1 = "• Psicoeducação breve sobre aplicação prática (sem determinismo).\n• Exercício de tomada de decisão alinhada.";
        base.sessao2 = "• Observação de padrões energéticos em situações reais.";
        base.sessao3 = "• Integração com metas e limites saudáveis.";
        base.tarefa = "Registro de decisões e sensações corporais.";
        base.indicadores = "Mais coerência interna e clareza de limites.";
        base.cuidados = "Evitar rótulos rígidos; manter base científica dos demais métodos.";
        break;

      case "MEMORIA":
        base.objetivo = "Reforçar memória funcional e atenção com treino estruturado.";
        base.quando = "Queixas leves/moderadas de memória e foco.";
        base.sessao1 = "• Treino de atenção sustentada (2 blocos de 5’/dia).\n• Técnicas mnemônicas simples (acrósticos, loci).";
        base.sessao2 = "• Rotina externa: listas, alarmes, checklists.";
        base.sessao3 = "• Integração com higiene do sono e atividade física.";
        base.tarefa = "Planilha simples de hábitos + 2 exercícios diários.";
        base.indicadores = "Menos esquecimentos, maior autonomia.";
        base.cuidados = "Encaminhar para avaliação médica se queixas persistirem.";
        break;

      case "IMPLICIT_DEFAULT":
        base.objetivo = "Acolher, organizar e priorizar intervenções iniciais.";
        base.quando = "Quando o quadro é inespecífico ou misto.";
        base.sessao1 = "• Escuta estruturada, clarificar metas 30–90 dias.";
        base.sessao2 = "• Intervenções breves de regulação e limites.";
        base.sessao3 = "• Plano de continuidade e reavaliação.";
        base.tarefa = "Roteiro simples de hábitos/limites.";
        base.indicadores = "Maior clareza e adesão.";
        base.cuidados = "Revisar sinais de risco a cada sessão.";
        break;

      // Mapeamentos abreviados para demais técnicas específicas (descrições curtas, ainda úteis)
      case "FAP":
        base.objetivo = "Modelar em sessão os comportamentos‑alvo (clinically relevant behaviors) e reforçar melhoras no aqui‑e‑agora.";
        base.quando = "Padrões relacionais, evitação de intimidade, uso de substâncias.";
        base.sessao1 = "• Identificar CRBs (problema e melhora) em sessão; nomear e reforçar.";
        base.sessao2 = "• Evocar comportamentos desejados com tarefas vivenciais.";
        base.sessao3 = "• Generalização para fora da sessão.";
        base.tarefa = "Diário de experimentos relacionais.";
        base.indicadores = "Mais abertura, menos esquiva relacional.";
        base.cuidados = "Manter aliança e limites claros.";
        break;

      case "TOXICOS":
        base.objetivo = "Quebrar ciclos de abuso/manipulação; restaurar limites.";
        base.quando = "Relacionamentos com gaslighting/controle.";
        base.sessao1 = "• Psicoeducação sobre padrões tóxicos.\n• Plano de segurança e rede.";
        base.sessao2 = "• Treino de limites e comunicação assertiva.";
        base.sessao3 = "• Estratégia de desligamento gradual quando aplicável.";
        base.tarefa = "Registro de violações e respostas assertivas.";
        base.indicadores = "Menos exposição, mais autonomia.";
        base.cuidados = "Encaminhar serviços de proteção quando necessário.";
        break;

      case "FAMILIAR_CASAL":
        base.objetivo = "Alinhar visão de sistema, papéis e acordos funcionais.";
        base.quando = "Conflitos persistentes em dinâmica familiar/casal.";
        base.sessao1 = "• Genograma breve + papéis.\n• Contratos de convivência.";
        base.sessao2 = "• Regras de comunicação e reuniões familiares.";
        base.sessao3 = "• Rotina de manutenção.";
        base.tarefa = "Reunião semanal 30’.";
        base.indicadores = "Mais cooperação e previsibilidade.";
        base.cuidados = "Priorizar segurança quando há violência.";
        break;

      case "POSSOBRESCREVER":
      default:
        return protocolFor("IMPLICIT_DEFAULT", ctx);
    }

    // Montar texto
    const texto = [
      `▶ ${TECHS[techKey].nome}`,
      `• Objetivo: ${base.objetivo}`,
      `• Quando usar: ${base.quando}`,
      `• Roteiro (Sessão 1): ${base.sessao1}`,
      `• Roteiro (Sessão 2): ${base.sessao2}`,
      `• Roteiro (Sessão 3): ${base.sessao3}`,
      `• Tarefa para casa: ${base.tarefa}`,
      `• Indicadores de progresso: ${base.indicadores}`,
      `• Cuidados/Contraindicações: ${base.cuidados}`
    ].join("\n");

    return texto;
  }

  function chooseTopTechs(score){
    // Convert to sorted array by score desc, then by meaningful preference (favor Gestalt)
    const entries = Object.entries(score).sort((a,b)=> b[1]-a[1]);
    const chosen = [];
    for(const [key,val] of entries){
      if (val<=0) break;
      if (key.startsWith("BONUS")) continue; // bônus não contam nas 3 técnicas
      chosen.push(key);
      if (chosen.length>=3) break;
    }
    if (chosen.length===0) chosen.push("GESTALT","CFT","DBT");
    return chosen.slice(0,3);
  }

  function buildParecer(){
    const nome = fields.nome.value.trim();
    const idade = fields.idade.value.trim();
    const queixa = fields.queixa.value.trim();
    const objetivo = fields.objetivo.value.trim();
    const riscos = fields.riscos.value.trim();
    const obs = fields.obs.value.trim();
    const {sintomas, padroes, prefs} = getSelections();
    const severidade = Number(fields.severidade.value);

    const score = scoreTechs({sintomas, padroes, prefs});
    const top3 = chooseTopTechs(score);

    // Bônus sempre listados como extras visíveis (não contam nas 3)
    const bonus = ["BONUS_NR1","BONUS_AUTO","BONUS_INICIO"];

    const header = `Paciente: ${nome||"—"}   |   Idade: ${idade||"—"}   |   Data: ${new Intl.DateTimeFormat("pt-BR").format(new Date())}
Severidade: ${severidade}/10
Queixa: ${queixa||"—"}
Objetivo: ${objetivo||"—"}
Sintomas/temas: ${sintomas.length? sintomas.join(", ") : "—"}
Padrões: ${padroes.length? padroes.join(", ") : "—"}
Preferências: ${prefs.length? prefs.join(", ") : "—"}
Riscos/atenção: ${riscos||"—"}
Obs terapeuta: ${obs||"—"}

Técnicas selecionadas (máx. 3): ${top3.map(k=>TECHS[k].nome).join(" • ")}
`;

    const ctx = {nome, foco: queixa || objetivo || "queixa atual"};
    const blocos = top3.map(k => protocolFor(k, ctx));

    const extra = `\nBÔNUS recomendados: ${bonus.map(k=>TECHS[k].nome).join(" • ")}\n`;

    const texto = header + "\n" + blocos.join("\n\n") + extra;

    // Render on screen with tags
    const tag = t => `<span class="tag">${t}</span>`;
    const tagify = arr => arr.length ? arr.map(tag).join(" ") : "—";

    fields.parecer.innerHTML = [
      `<h4>Dados do caso</h4>`,
      `<div><strong>Paciente:</strong> ${nome||"—"} • <strong>Idade:</strong> ${idade||"—"} • <strong>Sev.:</strong> ${severidade}/10</div>`,
      `<div><strong>Queixa:</strong> ${queixa||"—"}</div>`,
      `<div><strong>Objetivo:</strong> ${objetivo||"—"}</div>`,
      `<div><strong>Sintomas/temas:</strong> ${tagify(sintomas)}</div>`,
      `<div><strong>Padrões:</strong> ${tagify(padroes)}</div>`,
      `<div><strong>Preferências:</strong> ${tagify(prefs)}</div>`,
      `<div><strong>Riscos/atenção:</strong> ${riscos||"—"}</div>`,
      `<div><strong>Observações do terapeuta:</strong> ${obs||"—"}</div>`,
      `<hr>`,
      `<h4>Técnicas selecionadas (máx. 3)</h4>`,
      `<div>${top3.map(k=>tag(TECHS[k].nome)).join(" ")}</div>`,
      `<hr>`,
      `<h4>Roteiro detalhado (primeiros 3 encontros)</h4>`,
      `<div>${blocos.map(b=> `<pre>${b}</pre>`).join("<br/>")}</div>`,
      `<hr>`,
      `<div><strong>BÔNUS recomendados:</strong> ${bonus.map(k=>TECHS[k].nome).join(" • ")}</div>`
    ].join("\n");

    return {texto, top3};
  }

  function gerar(){
    buildParecer();
    window.scrollTo({top:0, behavior:"smooth"});
  }

  async function baixarPDF(){
    const { jsPDF } = window.jspdf || {};
    const nome = (fields.nome.value.trim() || "Paciente");
    const dataStr = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date());
    const {texto} = buildParecer();

    if (!jsPDF){
      alert("Não foi possível carregar o gerador de PDF. Como alternativa, use Ctrl+P (ou Compartilhar > Imprimir) e salve como PDF, desativando cabeçalho/rodapé no diálogo do navegador.");
      return;
    }

    const doc = new jsPDF({unit:"pt", format:"a4"});
    const margin = 40;
    const maxWidth = 515; // A4 width 595 - 2*40

    doc.setFont("Times","Bold"); doc.setFontSize(14);
    doc.text("THSE – Mentor Humanista (Gestalt + Comportamental)", margin, 50);
    doc.setFont("Times","Normal"); doc.setFontSize(11);
    doc.text(`Paciente: ${nome}    |    Data: ${dataStr}`, margin, 70);

    const paragraphs = texto.split("\n");
    let y = 95;
    doc.setFont("Times","Normal"); doc.setFontSize(11);

    paragraphs.forEach(p => {
      const lines = doc.splitTextToSize(p, maxWidth);
      lines.forEach(line => {
        if (y > 780){ doc.addPage(); y = 60; }
        doc.text(line, margin, y); y += 16;
      });
      y += 6;
    });

    doc.save(`Protocolo_${nome.replace(/\s+/g,'_')}_${dataStr.replace(/\//g,'-')}.pdf`);
  }

  function limpar(){
    ["nome","idade","queixa","objetivo","riscos","obs"].forEach(id=> fields[id].value="");
    ["sintomas","padroes","prefs"].forEach(key=> $$(".sym, .pat, .pref").forEach(c=> c.checked=false));
    fields.severidade.value=6; $("#sevVal").textContent="6";
    fields.parecer.innerHTML = `<p>Preencha a anamnese e clique em <strong>Gerar protocolo</strong>. O sistema selecionará até <strong>3 técnicas</strong> e entregará um roteiro detalhado (Sessão 1–3), tarefas, indicadores e cuidados.</p>`;
    window.scrollTo({top:0, behavior:"smooth"});
  }

  fields.gerar.addEventListener("click", gerar);
  fields.pdf.addEventListener("click", baixarPDF);
  fields.limpar.addEventListener("click", limpar);
})();