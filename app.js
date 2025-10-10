/* THSE – Mentor Humanista (Gestalt + Comportamental) – v2
   - Sem exibição de BÔNUS no rodapé/parecer/PDF
   - Layout compacto
   - Botão "Imprimir" (window.print) + CSS @media print
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
    print: $("#print"),
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
    "PSICANALISE_HUM": { nome:"Psicanálise humanista"}
  };

  function getSelections(){
    const sintomas = $$(".sym:checked").map(c=>c.value);
    const padroes = $$(".pat:checked").map(c=>c.value);
    const prefs = $$(".pref:checked").map(c=>c.value);
    return {sintomas, padroes, prefs};
  }

  function scoreTechs(state){
    const {sintomas, padroes, prefs} = state;
    const score = Object.fromEntries(Object.keys(TECHS).map(k=>[k,0]));

    const has = v => sintomas.includes(v);
    const pat = v => padroes.includes(v);
    const pref = v => prefs.includes(v);

    if (has("ansiedade")) { score.DBT+=3; score.EXPOSICAO+=3; score.GESTALT+=2; score.CFT+=2; score.SAUDE_MENTAL+=1; }
    if (has("depressao")) { score.CFT+=3; score.SAUDE_MENTAL+=2; score.DBT+=2; score.DEP_ANS_FIS+=2; score.GESTALT+=1; }
    if (has("trauma")) { score.EXPOSICAO+=3; score.DBT+=2; score.GESTALT+=2; score.CFT+=2; }
    if (has("luto")) { score.LUTO+=4; score.GESTALT+=2; score.CFT+=2; }
    if (has("casal")) { score.IMAGO+=4; score.IBCT+=4; score.GESTALT+=2; score.FAMILIAR_CASAL+=2; }
    if (has("parentalidade")) { score.PARENTAL+=4; score.FAMILIAR_ESTRATEGICA+=2; score.FAMILIAR_ESTRUTURAL+=2; }
    if (has("toxico")) { score.TOXICOS+=3; score.GESTALT+=2; score.CFT+=2; score.FAP+=2; }
    if (has("substancias")) { score.SUBSTANCIAS+=4; score.FAP+=3; score.DBT+=2; }
    if (has("burnout")) { score.BURNOUT+=4; score.DBT+=2; score.CFT+=2; score.AMADURECIMENTO+=1; }
    if (has("posparto")) { score.POSPARTO+=4; score.CFT+=2; score.SAUDE_MENTAL+=2; }
    if (has("memoria")) { score.MEMORIA+=4; score.SAUDE_MENTAL+=1; }
    if (has("desenvolvimento")) { score.ABA+=4; score.PARENTAL+=2; score.DESENV_GLOBAL+=2; }
    if (has("psicossomatico")) { score.DEP_ANS_FIS+=3; score.GESTALT+=2; score.CENTRADO_PESSOA+=2; }

    if (pat("evitacao")) { score.EXPOSICAO+=3; score.DBT+=1; }
    if (pat("autocritica")) { score.CFT+=4; }
    if (pat("impulsividade")) { score.DBT+=3; score.FAP+=2; }
    if (pat("ruminacao")) { score.CFT+=2; score.GESTALT+=2; }
    if (pat("conflito_relacional")) { score.IMAGO+=3; score.IBCT+=3; score.GESTALT+=1; }
    if (pat("hipervigilancia")) { score.EXPOSICAO+=2; score.DBT+=1; }
    if (pat("apatia")) { score.CFT+=2; score.SAUDE_MENTAL+=2; }
    if (pat("procrastinacao")) { score.CFT+=1; score.CENTRADO_PESSOA+=1; }

    if (prefs.includes("diretivo")) { score.DBT+=1; score.EXPOSICAO+=1; score.IBCT+=1; score.PARENTAL+=1; }
    if (prefs.includes("experiencial")) { score.GESTALT+=2; score.IMAGO+=1; }
    if (prefs.includes("espiritual")) { score.HUMAN_DESIGN+=2; }
    if (prefs.includes("ritmo_suave")) { score.CFT+=2; score.CENTRADO_PESSOA+=1; }

    if (sintomas.includes("casal")) { score.FAMILIAR_CASAL+=1; }
    if (sintomas.includes("parentalidade")) { score.FAMILIAR_ESTRATEGICA+=1; score.FAMILIAR_ESTRUTURAL+=1; }
    if (sintomas.includes("desenvolvimento")) { score.AC_ANALITICA+=1; }

    return score;
  }

  function protocolFor(techKey, ctx){
    const base = {
      objetivo: "", quando: "", sessao1: "", sessao2: "", sessao3: "",
      tarefa: "", indicadores: "", cuidados: ""
    };

    switch(techKey){
      case "GESTALT":
        base.objetivo = "Aumentar awareness (consciência fenomenológica) no aqui‑e‑agora, restaurar contato e responsabilidade pelas escolhas.";
        base.quando = "Indicado quando há confusão, ruminação ou padrões repetitivos sem clareza de necessidades; útil em conflitos relacionais e autorregulação.";
        base.sessao1 = "• Acordo de setting; escuta ativa.\n• Mapa do ciclo do contato atual (sensação → awareness → mobilização → ação → contato → retraimento).\n• Experimento breve: cadeira vazia (parte crítica × parte vulnerável).";
        base.sessao2 = "• Explorar polaridades (ex.: “controlar” × “ceder”).\n• Trabalho corporal suave (respiração/grounding) para ancorar awareness.\n• Ensaios de diálogo genuíno (eu‑mensagens).";
        base.sessao3 = "• Consolidar novos ajustes criativos.\n• Identificar gatilhos e micro‑escolhas no cotidiano.\n• Plano de prática de presença em 7 dias (3 momentos por dia).";
        base.tarefa = "Diário de awareness (3×/dia): O que sinto no corpo? O que preciso? Qual micro‑ação farei?";
        base.indicadores = "Menos fusão com pensamentos, mais linguagem de responsabilidade, redução de conflitos reativos.";
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
        base.cuidados = "Pode emergir tristeza; conduzir com ritmo suave.";
        break;
      case "EXPOSICAO":
        base.objetivo = "Reduzir evitação e medo condicionado via exposição gradual (interoceptiva/situacional) com segurança.";
        base.quando = "Ansiedade, pânico, TEPT leve/moderado, fobias; evitação significativa.";
        base.sessao1 = "• Hierarquia de exposições (0–100).\n• Exposição interoceptiva leve + recuperação 4‑4‑6.\n• Psicoeducação sobre habituação/inibição do medo.";
        base.sessao2 = "• Exposição situacional passo 1 + registro SUDS.\n• Reduzir reasseguramento/checagens.";
        base.sessao3 = "• Avançar 1–2 níveis.\n• Significados aprendidos pós-exposição.";
        base.tarefa = "2 exposições curtas/dia + SUDS.";
        base.indicadores = "Queda de SUDS e evitação; aproximação de metas.";
        base.cuidados = "Respeitar janela de tolerância; não expor sem suporte.";
        break;
      case "IMAGO":
        base.objetivo = "Melhorar empatia e conexão do casal via diálogo estruturado (espelho, validação, empatia).";
        base.quando = "Conflitos de casal, escaladas, sensação de não ser ouvido.";
        base.sessao1 = "• Ensinar Diálogo Imago; treino com tema leve.";
        base.sessao2 = "• Prática com tema real; pedidos claros/positivos.";
        base.sessao3 = "• Revisar gatilhos infantis; rituais de conexão.";
        base.tarefa = "Ritual 10’/dia: 5’ fala + 5’ escuta espelhada.";
        base.indicadores = "Menos escaladas, mais validação.";
        base.cuidados = "Suspender se houver violência.";
        break;
      case "IBCT":
        base.objetivo = "Aumentar aceitação e flexibilidade do casal; reduzir padrões coercitivos.";
        base.quando = "Casais em impasse com crítica/defesa/evitação.";
        base.sessao1 = "• Formulação do impasse e tentativas fracassadas.";
        base.sessao2 = "• Reatividade mínima e tolerância ao desconforto.";
        base.sessao3 = "• Plano de manutenção e acordos explícitos.";
        base.tarefa = "Experimentos semanais de aceitação + acordos escritos.";
        base.indicadores = "Redução de brigas; senso de time.";
        base.cuidados = "Encaminhar se houver abuso.";
        break;
      case "PARENTAL":
        base.objetivo = "Fortalecer repertório parental e consistência de limites/afeto.";
        base.quando = "Dificuldades educativas, comportamentos desafiadores.";
        base.sessao1 = "• Regras claras, reforço positivo, economia de fichas.";
        base.sessao2 = "• Instruções eficazes (curtas, específicas).";
        base.sessao3 = "• Rotina visual e reunião familiar semanal.";
        base.tarefa = "Aplicar 1 técnica/dia + registro.";
        base.indicadores = "Menos birras, mais combinados cumpridos.";
        base.cuidados = "Ajustar à idade; observar neurodivergência.";
        break;
      case "LUTO":
        base.objetivo = "Acompanhar processo de luto com validação, significado e integração.";
        base.quando = "Perdas recentes ou luto complicado.";
        base.sessao1 = "• Linha do tempo do vínculo; ritual de lembrança.";
        base.sessao2 = "• Ambivalências e culpas; datas sensíveis.";
        base.sessao3 = "• Continuidade do vínculo interno; reengajamento.";
        base.tarefa = "Diário de valores (10’/dia).";
        base.indicadores = "Menos culpa/entorpecimento; mais sentido.";
        base.cuidados = "Encaminhar se ideação persistente.";
        break;
      case "SUBSTANCIAS":
        base.objetivo = "Reduzir consumo; aumentar análise funcional e habilidades.";
        base.quando = "Uso problemático/abusivo, recaídas.";
        base.sessao1 = "• Análise ABC; disparadores; barreiras e substituições.";
        base.sessao2 = "• Habilidades DBT de tolerância à aflição; contrato de sobriedade.";
        base.sessao3 = "• Prevenção de recaída; planos alto risco.";
        base.tarefa = "Registro de gatilhos e respostas.";
        base.indicadores = "Mais sobriedade; menos lapsos.";
        base.cuidados = "Avaliar comorbidades; encaminhar quando necessário.";
        break;
      case "BURNOUT":
        base.objetivo = "Restaurar energia, limites e sentido; reduzir exaustão.";
        base.quando = "Estresse crônico ocupacional.";
        base.sessao1 = "• Estressores x valores; micro‑recuperações diárias.";
        base.sessao2 = "• DBT para limites; agenda de energia.";
        base.sessao3 = "• Rotina com pausas e rituais.";
        base.tarefa = "Checklist 5‑5‑5 diário.";
        base.indicadores = "Menos exaustão; mais engajamento com valores.";
        base.cuidados = "Monitorar sintomas depressivos.";
        break;
      case "HUMAN_DESIGN":
        base.objetivo = "Reflexão identitária e decisões alinhadas (complementar).";
        base.quando = "Interesse em integração espiritual/identitária.";
        base.sessao1 = "• Psicoeducação breve e exercício de decisão alinhada.";
        base.sessao2 = "• Observar padrões energéticos em situações reais.";
        base.sessao3 = "• Integrar com metas e limites saudáveis.";
        base.tarefa = "Registro de decisões e sensações.";
        base.indicadores = "Mais coerência interna; clareza de limites.";
        base.cuidados = "Evitar rótulos rígidos.";
        break;
      case "MEMORIA":
        base.objetivo = "Reforçar memória funcional e atenção.";
        base.quando = "Queixas leves/moderadas de memória/foco.";
        base.sessao1 = "• Atenção sustentada (2×5’/dia) e mnemônicos.";
        base.sessao2 = "• Rotina externa: listas, alarmes, checklists.";
        base.sessao3 = "• Sono/higiene/atividade física.";
        base.tarefa = "Planilha simples + 2 exercícios diários.";
        base.indicadores = "Menos esquecimentos; maior autonomia.";
        base.cuidados = "Encaminhar avaliação médica se persistir.";
        break;
      case "FAP":
        base.objetivo = "Modelar em sessão CRBs e reforçar melhoras no aqui‑e‑agora.";
        base.quando = "Padrões relacionais, evitação de intimidade.";
        base.sessao1 = "• Identificar CRBs problema/melhora; nomear/reforçar.";
        base.sessao2 = "• Evocar comportamentos desejados; tarefas vivenciais.";
        base.sessao3 = "• Generalização para fora da sessão.";
        base.tarefa = "Diário de experimentos relacionais.";
        base.indicadores = "Mais abertura; menos esquiva relacional.";
        base.cuidados = "Manter limites claros.";
        break;
      case "FAMILIAR_CASAL":
        base.objetivo = "Alinhar visão sistêmica, papéis e acordos.";
        base.quando = "Conflitos persistentes familiares/casal.";
        base.sessao1 = "• Genograma breve + papéis; contratos de convivência.";
        base.sessao2 = "• Regras de comunicação e reuniões familiares.";
        base.sessao3 = "• Rotina de manutenção.";
        base.tarefa = "Reunião semanal 30’.";
        base.indicadores = "Mais cooperação e previsibilidade.";
        base.cuidados = "Priorizar segurança.";
        break;
      default:
        base.objetivo = "Acolher e organizar prioridades de intervenção inicial.";
        base.quando = "Quadro inespecífico ou misto.";
        base.sessao1 = "• Escuta estruturada; metas 30–90 dias.";
        base.sessao2 = "• Regulação breve e treino de limites.";
        base.sessao3 = "• Plano de continuidade e reavaliação.";
        base.tarefa = "Roteiro simples de hábitos/limites.";
        base.indicadores = "Mais clareza e adesão.";
        base.cuidados = "Revisar sinais de risco a cada sessão.";
    }

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
    const entries = Object.entries(score).sort((a,b)=> b[1]-a[1]);
    const chosen = [];
    for(const [key,val] of entries){
      if (val<=0) break;
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
    const texto = header + "\n" + blocos.join("\n\n");

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
      `<div>${blocos.map(b=> `<pre>${b}</pre>`).join("<br/>")}</div>`
    ].join("\n");

    return {texto, top3};
  }

  function gerar(){ buildParecer(); window.scrollTo({top:0, behavior:"smooth"}); }

  async function baixarPDF(){
    const { jsPDF } = window.jspdf || {};
    const nome = (fields.nome.value.trim() || "Paciente");
    const dataStr = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date());
    const {texto} = buildParecer();
    if (!jsPDF){
      alert("Se o PDF não carregar, use o botão Imprimir e salve como PDF (desative cabeçalho/rodapé do navegador).");
      return;
    }
    const doc = new jsPDF({unit:"pt", format:"a4"});
    const margin = 40, maxWidth = 515;
    doc.setFont("Times","Bold"); doc.setFontSize(14);
    doc.text("THSE – Mentor Humanista (Gestalt + Comportamental)", margin, 50);
    doc.setFont("Times","Normal"); doc.setFontSize(11);
    doc.text(`Paciente: ${nome}    |    Data: ${dataStr}`, margin, 70);
    let y = 95;
    texto.split("\n").forEach(p => {
      const lines = doc.splitTextToSize(p, maxWidth);
      lines.forEach(line => { if (y>780){doc.addPage(); y=60;} doc.text(line, margin, y); y+=16; });
      y+=4;
    });
    doc.save(`Protocolo_${nome.replace(/\s+/g,'_')}_${dataStr.replace(/\//g,'-')}.pdf`);
  }

  function imprimir(){ window.print(); }
  function limpar(){
    ["nome","idade","queixa","objetivo","riscos","obs"].forEach(id=> fields[id].value="");
    $$(".sym, .pat, .pref").forEach(c=> c.checked=false);
    fields.severidade.value=6; document.getElementById("sevVal").textContent="6";
    fields.parecer.innerHTML = `<p>Preencha a anamnese e clique em <strong>Gerar protocolo</strong>. O sistema selecionará até <strong>3 técnicas</strong> e entregará um roteiro detalhado (Sessão 1–3), tarefas, indicadores e cuidados.</p>`;
    window.scrollTo({top:0, behavior:"smooth"});
  }

  fields.gerar.addEventListener("click", gerar);
  fields.pdf.addEventListener("click", baixarPDF);
  fields.print.addEventListener("click", imprimir);
  fields.limpar.addEventListener("click", limpar);
})();