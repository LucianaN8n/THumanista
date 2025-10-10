/* v7 – mais detalhamento, correção de \n, espaçamentos melhores */
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

  // Auto-resize para Hotmart/Wix
  function postHeight(){
    var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    try{ parent.postMessage({type:'thse-resize', height:h}, '*'); }catch(e){}
  }
  const ro = new ResizeObserver(()=> postHeight());
  ro.observe(document.body);
  window.addEventListener('load', postHeight);
  window.addEventListener('resize', postHeight);

  const TECHS = {
    "CFT": { nome:"Terapia Focada na Compaixão (CFT)"},
    "FAP": { nome:"Psicoterapia Analítica Funcional (FAP)"},
    "DBT": { nome:"Terapia Comportamental Dialética (DBT)"},
    "GESTALT": { nome:"Terapia Gestalt"},
    "HUMAN_DESIGN": { nome:"Desenho Humano"},
    "EXPOSICAO": { nome:"Terapia de exposição gradual"},
    "IMAGO": { nome:"Terapia do Imago (casal)"},
    "IBCT": { nome:"Terapia Comportamental Integrativa de Casais (IBCT)"},
    "PARENTAL": { nome:"Educação parental"},
    "LUTO": { nome:"Terapia em Lutos e perdas"},
    "SUBSTANCIAS": { nome:"Transtorno por uso de substâncias"},
    "BURNOUT": { nome:"Transtorno de Burnout"},
    "MEMORIA": { nome:"Reabilitação de memória"},
    "CENTRADO_PESSOA": { nome:"Método clínico centrado na pessoa"},
    "ABA": { nome:"Análise do Comportamento Aplicada (ABA)"},
    "FAMILIAR_CASAL": { nome:"Terapia familiar e de casal"}
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

    if (has("ansiedade")) { score.DBT+=3; score.EXPOSICAO+=3; score.GESTALT+=2; score.CFT+=2; }
    if (has("depressao")) { score.CFT+=3; score.DBT+=2; score.GESTALT+=1; }
    if (has("trauma")) { score.EXPOSICAO+=3; score.DBT+=2; score.GESTALT+=2; score.CFT+=2; }
    if (has("luto")) { score.LUTO+=4; score.GESTALT+=2; score.CFT+=2; }
    if (has("casal")) { score.IMAGO+=4; score.IBCT+=4; score.GESTALT+=2; score.FAMILIAR_CASAL+=2; }
    if (has("parentalidade")) { score.PARENTAL+=4; }
    if (has("toxico")) { score.FAP+=2; score.GESTALT+=2; score.CFT+=2; }
    if (has("substancias")) { score.SUBSTANCIAS+=4; score.FAP+=3; score.DBT+=2; }
    if (has("burnout")) { score.BURNOUT+=4; score.DBT+=2; score.CFT+=2; }
    if (has("posparto")) { score.CFT+=2; }
    if (has("memoria")) { score.MEMORIA+=4; }
    if (has("desenvolvimento")) { score.ABA+=4; score.PARENTAL+=2; }
    if (has("psicossomatico")) { score.GESTALT+=2; score.CENTRADO_PESSOA+=2; }

    if (pat("evitacao")) { score.EXPOSICAO+=3; score.DBT+=1; }
    if (pat("autocritica")) { score.CFT+=4; }
    if (pat("impulsividade")) { score.DBT+=3; score.FAP+=2; }
    if (pat("ruminacao")) { score.CFT+=2; score.GESTALT+=2; }
    if (pat("conflito_relacional")) { score.IMAGO+=3; score.IBCT+=3; }
    if (pat("hipervigilancia")) { score.EXPOSICAO+=2; }
    if (pat("apatia")) { score.CFT+=2; }
    if (pat("procrastinacao")) { score.CFT+=1; }

    if (state.prefs?.includes("diretivo")) { score.DBT+=1; score.EXPOSICAO+=1; score.IBCT+=1; }
    if (state.prefs?.includes("experiencial")) { score.GESTALT+=2; score.IMAGO+=1; }
    if (state.prefs?.includes("espiritual")) { score.HUMAN_DESIGN+=2; }
    if (state.prefs?.includes("ritmo_suave")) { score.CFT+=2; }

    return score;
  }

  // Protocolo mais detalhado (scripts, medidas, tarefas)
  function protocolFor(techKey){
    const H = (t)=>`▶ ${TECHS[techKey].nome}`;
    const S = (label, txt)=>`• ${label}: ${txt}`;
    switch(techKey){
      case "GESTALT":
        return [
          H("GESTALT"),
          S("Objetivo","Expandir awareness no aqui‑e‑agora, contatar necessidades e restaurar responsabilidade."),
          "Sessão 1 — Abertura & awareness",
          "  - Contrato de setting; mapa do ciclo do contato (sensação→awareness→mobilização→ação→contato→retirada).",
          "  - Experimento: Cadeira vazia (Parte Crítica × Parte Vulnerável).",
          "  - Prompt do terapeuta: “Ao dizer isso, o que sente no corpo exatamente agora?”",
          "Sessão 2 — Polaridades & corpo",
          "  - Explorar polaridades (controlar×ceder; agradar×frustrar).",
          "  - Grounding: respiração 4‑4‑6 + varredura corporal de 90s.",
          "  - Treino de ‘eu‑mensagens’ para comunicação autêntica.",
          "Sessão 3 — Ajustes criativos",
          "  - Identificar micro‑escolhas no dia (antes de evitar/atacar).",
          "  - Plano 7 dias de prática de presença (3 checkpoints/dia).",
          S("Tarefa", "Diário de awareness: corpo/necessidade/micro‑ação (3×/dia)."),
          S("Indicadores", "Menos fusão com pensamentos; mais linguagem de responsabilidade; conflitos menos reativos."),
          S("Cuidados", "Não forçar experimentos; respeitar a janela de tolerância.")
        ].join("\\n");
      case "DBT":
        return [
          H("DBT"),
          S("Objetivo","Aumentar regulação emocional, tolerância à aflição e efetividade interpessoal."),
          "Sessão 1 — Fundamentos",
          "  - Psicoeducação breve de emoções.",
          "  - Mindfulness 3’ (foco na respiração).",
          "  - Tolerância à aflição: TIP/ACCEPTS (escolher 2 estratégias).",
          "Sessão 2 — Regulação & relações",
          "  - Vulnerabilidades (sono, alimentação, estresse) + ‘opostos à emoção’.",
          "  - Treino DEAR MAN para pedidos e limites.",
          "Sessão 3 — Plano de crise",
          "  - Passos e contatos; ensaios comportamentais.",
          S("Tarefa","Cartão de habilidades: 2 práticas/dia (mindfulness + ACCEPTS/DEAR MAN)."),
          S("Indicadores","Menos picos, menos rupturas, mais assertividade."),
          S("Cuidados","Monitorar risco; reforçar rede de suporte.")
        ].join("\\n");
      case "CFT":
        return [
          H("CFT"),
          S("Objetivo","Reduzir autocrítica/vergonha; ativar sistema de afiliação e segurança."),
          "Sessão 1 — 3 sistemas e respiração",
          "  - Ameaça × Impulso × Cuidado; respiração calmante 4‑4‑6.",
          "  - Descobrir tom compassivo (voz/postura).",
          "Sessão 2 — Self compassivo",
          "  - Construir imagem (traços, gestos, frases); reescrever diálogo crítico.",
          "Sessão 3 — Expansão da compaixão",
          "  - Ao outro e ao eu do passado; rituais 2×/dia.",
          S("Tarefa","Diário de compaixão 5’/dia (o que eu diria a um amigo?)."),
          S("Indicadores","Queda de autocrítica; mais engajamento em atividades significativas."),
          S("Cuidados","Ritmo suave; acolher tristeza emergente.")
        ].join("\\n");
      case "EXPOSICAO":
        return [
          H("EXPOSICAO"),
          S("Objetivo","Diminuir evitação e medo condicionado com exposição gradual segura."),
          "Sessão 1 — Planejamento",
          "  - Hierarquia (0–100) + psicoed de habituação/inibição do medo.",
          "  - Interoceptiva leve (ex.: giro 30s) + recuperação 4‑4‑6.",
          "Sessão 2 — Situações reais",
          "  - Exposição situacional passo 1 + SUDS; reduzir reasseguramento.",
          "Sessão 3 — Avanço",
          "  - Subir 1–2 níveis; consolidar significados aprendidos.",
          S("Tarefa","2 exposições curtas/dia + registro SUDS antes/depois."),
          S("Indicadores","Queda progressiva de SUDS e evitação; aproximação de metas."),
          S("Cuidados","Respeitar janela; evitar exposição sem suporte quando risco alto.")
        ].join("\\n");
      case "IMAGO":
        return [
          H("IMAGO"),
          S("Objetivo","Aumentar empatia e conexão via diálogo estruturado."),
          "Sessão 1 — Técnica",
          "  - Ensinar espelho, validação e empatia; tema leve para treino.",
          "Sessão 2 — Tema real",
          "  - Pedidos claros e positivos; ajustar críticas/defesas.",
          "Sessão 3 — Integração",
          "  - Gatilhos infantis e rituais de conexão.",
          S("Tarefa","Ritual 10’/dia: 5’ fala + 5’ escuta espelhada."),
          S("Indicadores","Menos escaladas; mais validação espontânea."),
          S("Cuidados","Suspender se houver violência; priorizar segurança.")
        ].join("\\n");
      case "IBCT":
        return [
          H("IBCT"),
          S("Objetivo","Promover aceitação, flexibilidade e redução de padrões coercitivos."),
          "Sessão 1 — Formulação do impasse",
          "  - Padrão crítica/defesa/evitação; tentativas que falharam.",
          "Sessão 2 — Tolerância ao desconforto",
          "  - Reatividade mínima; pequenas concessões recíprocas.",
          "Sessão 3 — Manutenção",
          "  - Acordos explícitos; plano de revisão.",
          S("Tarefa","Experimentos semanais de aceitação + acordos escritos."),
          S("Indicadores","Redução de brigas; senso de time."),
          S("Cuidados","Encaminhar se houver abuso.")
        ].join("\\n");
      case "PARENTAL":
        return [
          H("PARENTAL"),
          S("Objetivo","Ampliar repertório parental com limites consistentes e afeto."),
          "Sessão 1 — Regras e reforço",
          "  - Regras claras; reforço positivo; economia de fichas.",
          "Sessão 2 — Instruções eficazes",
          "  - Comandos curtos, específicos e consistentes.",
          "Sessão 3 — Rotina e reunião",
          "  - Rotina visual; reunião familiar semanal.",
          S("Tarefa","Aplicar 1 técnica/dia + registro de sucessos."),
          S("Indicadores","Menos birras; mais combinados cumpridos."),
          S("Cuidados","Ajustar à idade; observar sinais de neurodivergência.")
        ].join("\\n");
      case "LUTO":
        return [
          H("LUTO"),
          S("Objetivo","Acompanhar luto com validação, significado e integração."),
          "Sessão 1 — Vínculo",
          "  - Linha do tempo e ritual de lembrança (carta/objeto).",
          "Sessão 2 — Ambivalências",
          "  - Culpa/raiva; preparar datas sensíveis.",
          "Sessão 3 — Continuidade",
          "  - Vínculo interno e reengajamento com valores.",
          S("Tarefa","Diário de valores 10’/dia."),
          S("Indicadores","Menos culpa/entorpecimento; retomada gradual de atividades."),
          S("Cuidados","Atenção a ideação persistente → encaminhar.")
        ].join("\\n");
      case "SUBSTANCIAS":
        return [
          H("SUBSTANCIAS"),
          S("Objetivo","Reduzir consumo e risco; aumentar habilidades de enfrentamento."),
          "Sessão 1 — Análise funcional",
          "  - ABC de episódios; barreiras e substituições compatíveis.",
          "Sessão 2 — Habilidades",
          "  - DBT tolerância à aflição; contrato de sobriedade + rede.",
          "Sessão 3 — Prevenção de recaída",
          "  - Estratégias para situações de alto risco.",
          S("Tarefa","Registro de gatilhos e estratégias usadas."),
          S("Indicadores","Janelas de sobriedade maiores; menos lapsos."),
          S("Cuidados","Avaliar comorbidades; possível co‑encaminhamento.")
        ].join("\\n");
      case "BURNOUT":
        return [
          H("BURNOUT"),
          S("Objetivo","Reduzir exaustão e cinismo; restaurar energia e sentido."),
          "Sessão 1 — Mapa de estressores/valores",
          "  - Micro‑recuperações diárias (respiração, pausa, micro‑alegria).",
          "Sessão 2 — Limites",
          "  - DBT de efetividade interpessoal; agenda de energia.",
          "Sessão 3 — Recontratação da rotina",
          "  - Pausas programadas e rituais de encerramento do dia.",
          S("Tarefa","Checklist 5‑5‑5 diário."),
          S("Indicadores","Menos exaustão; mais engajamento com valores."),
          S("Cuidados","Rastreamento de depressão/ansiedade.")
        ].join("\\n");
      case "MEMORIA":
        return [
          H("MEMORIA"),
          S("Objetivo","Reforçar memória funcional e atenção com treino estruturado."),
          "Sessão 1 — Atenção e mnemônicos",
          "  - 2×5’/dia de atenção sustentada; loci/acrósticos.",
          "Sessão 2 — Suportes externos",
          "  - Listas, alarmes, checklists; rotinas fixas.",
          "Sessão 3 — Hábitos de base",
          "  - Sono, atividade física, alimentação.",
          S("Tarefa","Planilha simples + 2 exercícios/dia."),
          S("Indicadores","Menos esquecimentos; maior autonomia."),
          S("Cuidados","Encaminhar se queixa persistente/progressiva.")
        ].join("\\n");
      case "FAP":
        return [
          H("FAP"),
          S("Objetivo","Evocar e reforçar em sessão os comportamentos relevantes clinicamente (CRBs)."),
          "Sessão 1 — Identificação",
          "  - CRB1 (problema em sessão) e CRB2 (melhora desejada).",
          "Sessão 2 — Evocar e reforçar",
          "  - Feedbacks imediatos; tarefas vivenciais.",
          "Sessão 3 — Generalização",
          "  - Transferir para contextos externos; reforço diferencial.",
          S("Tarefa","Diário de experimentos relacionais."),
          S("Indicadores","Mais abertura, contato e assertividade; menos esquiva."),
          S("Cuidados","Manter limites e contrato explícitos.")
        ].join("\\n");
      case "ABA":
        return [
          H("ABA"),
          S("Objetivo","Intervenções baseadas em análise funcional para desenvolvimento de habilidades."),
          "Sessões iniciais — Avaliação",
          "  - Linha de base; definição de metas objetivas; reforço diferencial.",
          "Implementação",
          "  - Encadeamento de tarefas, prompts e fading.",
          S("Tarefa","Registro de tentativas com reforço claro."),
          S("Indicadores","Aquisição de habilidades-alvo; redução de comportamentos problema."),
          S("Cuidados","Individualização por perfil e idade.")
        ].join("\\n");
      case "FAMILIAR_CASAL":
        return [
          H("FAMILIAR_CASAL"),
          S("Objetivo","Alinhar visão sistêmica; papéis e acordos funcionais."),
          "Sessão 1 — Genograma e papéis",
          "  - Contratos de convivência: combinados claros e observáveis.",
          "Sessão 2 — Comunicação",
          "  - Regras para reunião familiar; turnos e validação.",
          "Sessão 3 — Manutenção",
          "  - Rotina de checagem semanal.",
          S("Tarefa","Reunião semanal 30’. Registre 3 pontos bons e 1 ajuste."),
          S("Indicadores","Mais cooperação e previsibilidade."),
          S("Cuidados","Segurança sempre em primeiro lugar.")
        ].join("\\n");
      default:
        return "—";
    }
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
    const blocos = top3.map(k => `<div class="block"><strong>${TECHS[k].nome}</strong><pre>${protocolFor(k)}</pre></div>`);

    const tag = t => `<span class="tag">${t}</span>`;
    const tagify = arr => arr.length ? arr.map(tag).join(" ") : "—";

    // NOTE: real newlines for readability only; HTML ignores them (not \n literals)
    fields.parecer.innerHTML = [
      `<h4>Dados do caso</h4>`,
      `<div><strong>Paciente:</strong> ${nome||"—"} • <strong>Idade:</strong> ${idade||"—"} • <strong>Sev.:</strong> ${severidade||0}/10</div>`,
      `<div><strong>Queixa:</strong> ${queixa||"—"}</div>`,
      `<div><strong>Objetivo:</strong> ${objetivo||"—"}</div>`,
      `<div><strong>Sintomas/temas:</strong> ${tagify($$(".sym:checked").map(c=>c.value))}</div>`,
      `<div><strong>Padrões:</strong> ${tagify($$(".pat:checked").map(c=>c.value))}</div>`,
      `<div><strong>Preferências:</strong> ${tagify($$(".pref:checked").map(c=>c.value))}</div>`,
      `<div><strong>Riscos/atenção:</strong> ${riscos||"—"}</div>`,
      `<div><strong>Observações do terapeuta:</strong> ${obs||"—"}</div>`,
      `<div class="sep"></div>`,
      `<h4>Técnicas selecionadas (máx. 3)</h4>`,
      `<div>${top3.map(k=>tag(TECHS[k].nome)).join(" ")}</div>`,
      `<div class="sep"></div>`,
      `<h4>Roteiro detalhado (primeiros 3 encontros)</h4>`,
      blocos.join("")
    ].join("");

    // Texto puro para PDF
    const header = `Paciente: ${nome||"—"}   |   Idade: ${idade||"—"}   |   Data: ${new Intl.DateTimeFormat("pt-BR").format(new Date())}
Severidade: ${severidade||0}/10
Queixa: ${queixa||"—"}
Objetivo: ${objetivo||"—"}
`;
    const texto = header + "\\n" + top3.map(k => `▶ ${TECHS[k].nome}\\n${protocolFor(k)}`).join("\\n\\n");
    return {texto};
  }

  function gerar(){
    buildParecer();
    const fab = document.getElementById("fab-pdf"); if(fab) fab.style.display = "flex";
    postHeight();
    window.scrollTo({top:0, behavior:"smooth"});
  }

  async function baixarPDF(){
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF){ alert("PDF off-line: coloque o arquivo local em /vendor/jspdf.umd.min.js ou habilite a CDN."); return; }
    const nome = (fields.nome.value.trim() || "Paciente");
    const dataStr = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date());
    const {texto} = buildParecer();
    const doc = new jsPDF({unit:"pt", format:"a4"});
    const margin = 40, maxWidth = 515;
    doc.setFont("Times","Bold"); doc.setFontSize(14);
    doc.text("THSE – Mentor Humanista (Gestalt + Comportamental)", margin, 50);
    doc.setFont("Times","Normal"); doc.setFontSize(11);
    doc.text(`Paciente: ${nome}    |    Data: ${dataStr}`, margin, 70);
    let y = 95;
    texto.split("\\n").forEach(p => {
      const lines = doc.splitTextToSize(p, maxWidth);
      lines.forEach(line => { if (y>780){doc.addPage(); y=60;} doc.text(line, margin, y); y+=16; });
      y+=4;
    });
    doc.save(`Protocolo_${nome.replace(/\\s+/g,'_')}_${dataStr.replace(/\\//g,'-')}.pdf`);
  }

  function limpar(){
    ["nome","idade","queixa","objetivo","riscos","obs"].forEach(id=> fields[id].value="");
    $$(".sym, .pat, .pref").forEach(c=> c.checked=false);
    fields.severidade.value=6; document.getElementById("sevVal").textContent="6";
    fields.parecer.innerHTML = `<p>Preencha a anamnese e clique em <strong>Gerar protocolo</strong>. O sistema selecionará até <strong>3 técnicas</strong> e entregará um roteiro detalhado (Sessão 1–3), tarefas, indicadores e cuidados.</p>`;
    const fab = document.getElementById("fab-pdf"); if(fab) fab.style.display = "none";
    postHeight();
    window.scrollTo({top:0, behavior:"smooth"});
  }

  // Controles
  document.getElementById("pdf2").addEventListener("click", baixarPDF);
  document.getElementById("fab-pdf").addEventListener("click", baixarPDF);
  fields.gerar.addEventListener("click", gerar);
  fields.pdf.addEventListener("click", baixarPDF);
  fields.limpar.addEventListener("click", limpar);
})();