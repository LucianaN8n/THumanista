/* v8 – detalhamento forte, espaçamento compacto e PDF always-on */
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
    pdfTop: $("#pdfTop"),
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

    if (prefs?.includes("diretivo")) { score.DBT+=1; score.EXPOSICAO+=1; score.IBCT+=1; }
    if (prefs?.includes("experiencial")) { score.GESTALT+=2; score.IMAGO+=1; }
    if (prefs?.includes("espiritual")) { score.CFT+=1; }
    if (prefs?.includes("ritmo_suave")) { score.CFT+=2; }

    return score;
  }

  function protocolFor(key){
    const title = `▶ ${TECHS[key].nome}`;
    let body = "";
    if(key==="GESTALT"){
      body = [
        "Objetivo: Expandir awareness no aqui‑e‑agora; contatar necessidades; restaurar responsabilidade.",
        "Sessão 1 (abertura & awareness):",
        "  • Setting e contrato. Explique o ciclo do contato (sensação→awareness→mobilização→ação→contato→retirada).",
        "  • Experimento: Cadeira vazia — Parte Crítica × Parte Vulnerável.",
        "  • Prompts: “Ao dizer isso, o que percebe no corpo agora?”, “O que você evita sentir neste instante?”.",
        "Sessão 2 (polaridades & corpo):",
        "  • Explorar polaridades (controlar×ceder; agradar×frustrar).",
        "  • Grounding: respiração 4‑4‑6 + varredura corporal 90s antes de cenas difíceis.",
        "  • Treino de eu‑mensagens (observação, sentimento, necessidade, pedido).",
        "Sessão 3 (ajustes criativos):",
        "  • Mapear gatilhos, micro‑escolhas e novos ajustes criativos no cotidiano.",
        "  • Plano 7 dias de ‘presença 3×/dia’: corpo → necessidade → micro‑ação.",
        "Tarefa: Diário de awareness (3×/dia).",
        "Indicadores: Menos fusão com pensamentos; mais linguagem de responsabilidade; redução de reatividade.",
        "Cuidados: Não forçar experimentos; respeitar janela de tolerância."
      ].join("\\n");
    } else if(key==="DBT"){
      body = [
        "Objetivo: Aumentar regulação emocional, tolerância à aflição e efetividade interpessoal.",
        "Sessão 1 (fundamentos):",
        "  • Psicoeducação sobre emoções e função. Mindfulness 3’.",
        "  • Tolerância à aflição: TIP/ACCEPTS (escolha 2 estratégias para treinar).",
        "Sessão 2 (regulação & relações):",
        "  • Vulnerabilidades (sono, alimentação, estresse) + ‘opostos à emoção’.",
        "  • Treino DEAR MAN para pedidos e limites; role‑play.",
        "Sessão 3 (plano de crise):",
        "  • Passos (1‑foco, 2‑habilidades, 3‑contatos). Ensaios de limites em cenários reais.",
        "Tarefa: Cartão de habilidades — 2 práticas/dia (mindfulness + DEAR MAN/ACCEPTS).",
        "Indicadores: Queda de picos, menos rupturas, mais assertividade.",
        "Cuidados: Monitorar risco; acionar rede de apoio quando necessário."
      ].join("\\n");
    } else if(key==="CFT"){
      body = [
        "Objetivo: Reduzir autocrítica/vergonha; ativar sistema de afiliação/segurança.",
        "Sessão 1 (3 sistemas & respiração):",
        "  • Ameaça × Impulso × Cuidado. Respiração calmante 4‑4‑6.",
        "  • Encontrar tom compassivo (voz, postura, gesto).",
        "Sessão 2 (self compassivo):",
        "  • Construir imagem: características, frases, gesto de cuidado.",
        "  • Reescrever diálogo crítico com o self compassivo.",
        "Sessão 3 (expansão):",
        "  • Compaixão ao outro e ao eu do passado; rituais 2×/dia.",
        "Tarefa: Diário de compaixão 5’/dia (“O que eu diria a um amigo?”).",
        "Indicadores: Menos autocrítica; maior engajamento em ações com valor.",
        "Cuidados: Condução gentil; acolher tristeza emergente."
      ].join("\\n");
    } else if(key==="EXPOSICAO"){
      body = [
        "Objetivo: Diminuir evitação e medo condicionado com exposição gradual, segura e monitorada.",
        "Sessão 1 (planejamento):",
        "  • Hierarquia 0–100 das situações temidas; psicoeducação de habituação/inibição do medo.",
        "  • Exposição interoceptiva leve (ex.: giro 30s) + recuperação 4‑4‑6; registrar SUDS.",
        "Sessão 2 (situações reais):",
        "  • Exposição situacional passo 1; reduzir reasseguramento e checagens.",
        "Sessão 3 (avanço):",
        "  • Subir 1–2 níveis; consolidar significados aprendidos pós‑exposição.",
        "Tarefa: 2 exposições curtas/dia + SUDS antes/depois.",
        "Indicadores: Queda progressiva de SUDS e de evitação; aproximação das metas.",
        "Cuidados: Respeitar janela de tolerância; não expor sem suporte quando risco alto."
      ].join("\\n");
    } else {
      body = "Roteiro em construção para esta técnica.";
    }
    return {title, body};
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

    const tag = t => `<span class="tag">${t}</span>`;
    const tagify = arr => arr.length ? arr.map(tag).join(" ") : "—";

    const blocks = top3.map(k => {
      const proto = protocolFor(k);
      return `<div class="block"><h5>${TECHS[k].nome}</h5><pre>${proto.body}</pre></div>`;
    }).join("");

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
      blocks
    ].join("");

    const header = (
      `Paciente: ${nome||"—"}   |   Idade: ${idade||"—"}   |   Data: ${new Intl.DateTimeFormat("pt-BR").format(new Date())}\n` +
      `Severidade: ${severidade||0}/10\n` +
      `Queixa: ${queixa||"—"}\n` +
      `Objetivo: ${objetivo||"—"}\n`
    );
    const texto = header + "\n" + top3.map(k => {
      const p = protocolFor(k);
      return `${p.title}\n${p.body}`;
    }).join("\n\n");

    return {texto};
  }

  function gerar(){
    buildParecer();
    const fab = document.getElementById("fab-pdf"); if(fab) fab.style.display = "flex";
    postHeight();
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function baixarPDF(){
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF){ alert("PDF off-line: coloque /vendor/jspdf.umd.min.js ou permita a CDN."); return; }
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
    texto.split("\n").forEach(p => {
      const lines = doc.splitTextToSize(p, maxWidth);
      lines.forEach(line => { if (y>780){doc.addPage(); y=60;} doc.text(line, margin, y); y+=16; });
      y+=4;
    });
    doc.save(`Protocolo_${nome.replace(/\s+/g,'_')}_${dataStr.replace(/\//g,'-')}.pdf`);
  }

  function limpar(){
    ["nome","idade","queixa","objetivo","riscos","obs"].forEach(id=> fields[id].value="");
    $$(".sym, .pat, .pref").forEach(c=> c.checked=false);
    fields.severidade.value=6; document.getElementById("sevVal").textContent="6";
    fields.parecer.innerHTML = `<p>Preencha a anamnese e clique em <strong>Gerar protocolo</strong>. O sistema selecionará até <strong>3 técnicas</strong> e entregará um <strong>roteiro passo a passo</strong>.</p>`;
    const fab = document.getElementById("fab-pdf"); if(fab) fab.style.display = "none";
    postHeight();
    window.scrollTo({top:0, behavior:"smooth"});
  }

  // Controles
  document.getElementById("pdf2").addEventListener("click", baixarPDF);
  document.getElementById("fab-pdf").addEventListener("click", baixarPDF);
  fields.pdfTop.addEventListener("click", baixarPDF);
  fields.gerar.addEventListener("click", gerar);
  fields.pdf.addEventListener("click", baixarPDF);
  fields.limpar.addEventListener("click", limpar);
})();