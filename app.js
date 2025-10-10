/* v6 – sem PRINT, jsPDF local + fallback, robust gerar() */
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

  function protocolFor(techKey){
    const base = { objetivo:"", quando:"", sessao1:"", sessao2:"", sessao3:"", tarefa:"", indicadores:"", cuidados:"" };
    switch(techKey){
      case "GESTALT":
        base.objetivo="Aumentar awareness no aqui‑e‑agora, restaurar contato e responsabilidade pelas escolhas.";
        base.quando="Confusão, ruminação, padrões repetitivos; conflitos relacionais e autorregulação.";
        base.sessao1="• Setting; escuta ativa. • Ciclo do contato; cadeira vazia (crítico × vulnerável).";
        base.sessao2="• Polaridades; grounding respiratório; ensaios de eu‑mensagens.";
        base.sessao3="• Ajustes criativos; gatilhos; prática de presença 7 dias (3×/dia).";
        base.tarefa="Diário de awareness (3×/dia): corpo, necessidade, micro‑ação.";
        base.indicadores="Menos fusão com pensamentos; mais responsabilidade; menos conflitos reativos.";
        base.cuidados="Não forçar experimentos; respeitar janela de tolerância.";
        break;
      case "DBT":
        base.objetivo="Aumentar tolerância ao desconforto e regulação emocional via habilidades DBT.";
        base.quando="Impulsividade, oscilações intensas, conflitos recorrentes.";
        base.sessao1="• Psicoed. emoções + mindfulness 3’; TIP/ACCEPTS.";
        base.sessao2="• Regulação: vulnerabilidades + opostos à emoção; DEAR MAN.";
        base.sessao3="• Plano de crise pessoal; ensaios de limites.";
        base.tarefa="Cartão de habilidades (2 práticas/dia).";
        base.indicadores="Redução de picos e rupturas; mais assertividade.";
        base.cuidados="Monitorar risco; rede de apoio.";
        break;
      case "CFT":
        base.objetivo="Reduzir autocrítica e vergonha; cultivar sistema de afiliação/segurança.";
        base.quando="Autocrítica, vergonha, depressão/ansiedade social.";
        base.sessao1="• 3 sistemas (ameaça, impulso, cuidado); respiração 4‑4‑6; tom compassivo.";
        base.sessao2="• Self compassivo; reescrever diálogo crítico.";
        base.sessao3="• Compaixão ao outro e ao eu do passado; rituais 2×/dia.";
        base.tarefa="Diário de compaixão 5’/dia.";
        base.indicadores="Menos autocrítica; mais engajamento.";
        base.cuidados="Ritmo suave para evitar retraimento.";
        break;
      case "EXPOSICAO":
        base.objetivo="Reduzir evitação/medo condicionado via exposição gradual segura.";
        base.quando="Ansiedade, pânico, fobias, TEPT leve.";
        base.sessao1="• Hierarquia (0–100); interoceptiva leve + recuperação 4‑4‑6; psicoed. habituação.";
        base.sessao2="• Situacional passo 1 + SUDS; reduzir reasseguramento.";
        base.sessao3="• Avançar 1–2 níveis; significados pós‑exposição.";
        base.tarefa="2 exposições curtas/dia + SUDS.";
        base.indicadores="Queda de SUDS e evitação; aproximação de metas.";
        base.cuidados="Respeitar janela; não expor sem suporte.";
        break;
      case "IMAGO":
        base.objetivo="Aumentar empatia e conexão via diálogo estruturado (espelho, validação, empatia).";
        base.quando="Conflitos de casal; escaladas.";
        base.sessao1="• Ensinar Diálogo Imago; treino com tema leve.";
        base.sessao2="• Prática com tema real; pedidos claros/positivos.";
        base.sessao3="• Gatilhos infantis; rituais de conexão.";
        base.tarefa="Ritual 10’/dia (5’ fala, 5’ escuta).";
        base.indicadores="Menos escaladas; mais validação.";
        base.cuidados="Suspender se houver violência.";
        break;
      case "IBCT":
        base.objetivo="Aumentar aceitação e flexibilidade do casal; reduzir padrões coercitivos.";
        base.quando="Impasse com crítica/defesa/evitação.";
        base.sessao1="• Formulação do impasse; tentativas fracassadas.";
        base.sessao2="• Reatividade mínima; tolerância ao desconforto.";
        base.sessao3="• Manutenção e acordos explícitos.";
        base.tarefa="Experimentos semanais de aceitação + acordos escritos.";
        base.indicadores="Menos brigas; senso de time.";
        base.cuidados="Encaminhar se houver abuso.";
        break;
      case "PARENTAL":
        base.objetivo="Fortalecer repertório parental e consistência de limites/afeto.";
        base.quando="Dificuldades educativas, comportamentos desafiadores.";
        base.sessao1="• Regras claras; reforço positivo; economia de fichas.";
        base.sessao2="• Instruções eficazes (curtas, específicas).";
        base.sessao3="• Rotina visual; reunião familiar semanal.";
        base.tarefa="Aplicar 1 técnica/dia + registro.";
        base.indicadores="Menos birras; mais combinados cumpridos.";
        base.cuidados="Ajustar à idade; observar neurodivergência.";
        break;
      case "LUTO":
        base.objetivo="Acompanhar luto com validação, significado e integração.";
        base.quando="Perdas recentes ou luto complicado.";
        base.sessao1="• Linha do tempo do vínculo; ritual de lembrança.";
        base.sessao2="• Ambivalências/culpas; datas sensíveis.";
        base.sessao3="• Continuidade do vínculo interno; reengajamento.";
        base.tarefa="Diário de valores (10’/dia).";
        base.indicadores="Menos culpa/entorpecimento; mais sentido.";
        base.cuidados="Encaminhar se ideação persistente.";
        break;
      case "SUBSTANCIAS":
        base.objetivo="Reduzir consumo; aumentar análise funcional e habilidades.";
        base.quando="Uso problemático/abusivo; recaídas.";
        base.sessao1="• ABC; disparadores; barreiras e substituições.";
        base.sessao2="• DBT tolerância à aflição; contrato de sobriedade.";
        base.sessao3="• Prevenção de recaída; planos alto risco.";
        base.tarefa="Registro de gatilhos/respostas.";
        base.indicadores="Mais sobriedade; menos lapsos.";
        base.cuidados="Avaliar comorbidades; encaminhar quando necessário.";
        break;
      case "BURNOUT":
        base.objetivo="Restaurar energia, limites e sentido; reduzir exaustão.";
        base.quando="Estresse crônico ocupacional.";
        base.sessao1="• Estressores × valores; micro‑recuperações.";
        base.sessao2="• DBT para limites; agenda de energia.";
        base.sessao3="• Rotina com pausas e rituais.";
        base.tarefa="Checklist 5‑5‑5 diário.";
        base.indicadores="Menos exaustão; mais engajamento.";
        base.cuidados="Monitorar sintomas depressivos.";
        break;
      case "HUMAN_DESIGN":
        base.objetivo="Reflexão identitária e decisões alinhadas (complementar).";
        base.quando="Interesse em integração espiritual/identitária.";
        base.sessao1="• Psicoed breve + decisão alinhada.";
        base.sessao2="• Observar padrões energéticos reais.";
        base.sessao3="• Integrar com metas e limites saudáveis.";
        base.tarefa="Registro de decisões/sensações.";
        base.indicadores="Mais coerência interna; clareza de limites.";
        base.cuidados="Evitar rótulos rígidos.";
        break;
      case "MEMORIA":
        base.objetivo="Reforçar memória funcional e atenção.";
        base.quando="Queixas leves/moderadas de memória/foco.";
        base.sessao1="• Atenção sustentada (2×5’/dia) e mnemônicos.";
        base.sessao2="• Rotina externa: listas, alarmes, checklists.";
        base.sessao3="• Sono/higiene/atividade física.";
        base.tarefa="Planilha + 2 exercícios diários.";
        base.indicadores="Menos esquecimentos; mais autonomia.";
        base.cuidados="Avaliação médica se persistir.";
        break;
      case "FAP":
        base.objetivo="Modelar CRBs e reforçar melhoras no aqui‑e‑agora.";
        base.quando="Padrões relacionais; esquiva de intimidade.";
        base.sessao1="• Identificar CRBs problema/melhora; nomear/reforçar.";
        base.sessao2="• Evocar comportamentos desejados; tarefas vivenciais.";
        base.sessao3="• Generalização para vida diária.";
        base.tarefa="Diário de experimentos relacionais.";
        base.indicadores="Mais abertura; menos esquiva relacional.";
        base.cuidados="Limites/aliança terapêutica claros.";
        break;
      case "FAMILIAR_CASAL":
        base.objetivo="Alinhar visão sistêmica, papéis e acordos.";
        base.quando="Conflitos persistentes familiares/casal.";
        base.sessao1="• Genograma breve + papéis; contratos de convivência.";
        base.sessao2="• Regras de comunicação e reuniões familiares.";
        base.sessao3="• Rotina de manutenção.";
        base.tarefa="Reunião semanal 30’.";
        base.indicadores="Mais cooperação e previsibilidade.";
        base.cuidados="Priorizar segurança.";
        break;
      default:
        base.objetivo="Organizar prioridades de intervenção inicial.";
        base.quando="Quadro inespecífico ou misto.";
        base.sessao1="• Escuta estruturada; metas 30–90 dias.";
        base.sessao2="• Regulação breve e treino de limites.";
        base.sessao3="• Plano de continuidade e reavaliação.";
        base.tarefa="Roteiro simples de hábitos/limites.";
        base.indicadores="Mais clareza e adesão.";
        base.cuidados="Revisar sinais de risco.";
    }
    return [
      `• Objetivo: ${base.objetivo}`,
      `• Quando usar: ${base.quando}`,
      `• Roteiro (Sessão 1): ${base.sessao1}`,
      `• Roteiro (Sessão 2): ${base.sessao2}`,
      `• Roteiro (Sessão 3): ${base.sessao3}`,
      `• Tarefa para casa: ${base.tarefa}`,
      `• Indicadores de progresso: ${base.indicadores}`,
      `• Cuidados/Contraindicações: ${base.cuidados}`
    ].join("\\n");
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
    const blocos = top3.map(k => `▶ ${TECHS[k].nome}\\n` + protocolFor(k));

    const tag = t => `<span class="tag">${t}</span>`;
    const tagify = arr => arr.length ? arr.map(tag).join(" ") : "—";

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
      `<hr>`,
      `<h4>Técnicas selecionadas (máx. 3)</h4>`,
      `<div>${top3.map(k=>tag(TECHS[k].nome)).join(" ")}</div>`,
      `<hr>`,
      `<h4>Roteiro detalhado (primeiros 3 encontros)</h4>`,
      `<div>${blocos.map(b=> `<pre>${b}</pre>`).join("<br/>")}</div>`
    ].join("\\n");

    // Texto puro para PDF
    const header = `Paciente: ${nome||"—"}   |   Idade: ${idade||"—"}   |   Data: ${new Intl.DateTimeFormat("pt-BR").format(new Date())}
Severidade: ${severidade||0}/10
Queixa: ${queixa||"—"}
Objetivo: ${objetivo||"—"}
`;
    const texto = header + "\\n" + blocos.join("\\n\\n");
    return {texto};
  }

  function gerar(){
    try{
      buildParecer();
      postHeight();
      // mostrar FAB PDF sempre depois de gerar
      const fab = document.getElementById("fab-pdf");
      if(fab) fab.style.display = "flex";
      window.scrollTo({top:0, behavior:"smooth"});
    }catch(e){
      console.error("Erro ao gerar protocolo:", e);
      alert("Ops! Algo impediu gerar o protocolo. Recarregue a página. Se persistir, me mande um print do Console.");
    }
  }

  async function baixarPDF(){
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF){ alert("PDF off-line: use o botão de impressão do navegador (Salvar como PDF)."); return; }
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