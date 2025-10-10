(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  $("#today").textContent = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date());

  const fields = {
    nome: $("#nome"),
    idade: $("#idade"),
    queixa: $("#queixa"),
    objetivo: $("#objetivo"),
    severidade: $("#severidade"),
    riscos: $("#riscos"),
    obs: $("#obs"),
    parecer: $("#parecer"),
  };

  function postHeight(){
    const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    try{ parent.postMessage({type:'thse-resize', height:h}, '*'); }catch(e){}
  }
  const ro = new ResizeObserver(()=> postHeight());
  ro.observe(document.body);
  window.addEventListener('load', postHeight);
  window.addEventListener('resize', postHeight);

  const TECHS = {
    CFT:"Terapia Focada na Compaixão (CFT)",
    DBT:"Terapia Comportamental Dialética (DBT)",
    GESTALT:"Terapia Gestalt",
    EXPOSICAO:"Terapia de exposição gradual",
  };

  function getSelections(){
    const sintomas = $$(".sym:checked").map(c=>c.value);
    const padroes = $$(".pat:checked").map(c=>c.value);
    const prefs = $$(".pref:checked").map(c=>c.value);
    return {sintomas, padroes, prefs};
  }
  function scoreTechs({sintomas=[], padroes=[], prefs=[]}){
    const sc = {CFT:0, DBT:0, GESTALT:0, EXPOSICAO:0};
    const has = v => sintomas.includes(v);
    const pat = v => padroes.includes(v);
    if (has("ansiedade")) { sc.DBT+=3; sc.EXPOSICAO+=3; sc.GESTALT+=2; sc.CFT+=2; }
    if (has("depressao")) { sc.CFT+=3; sc.DBT+=2; sc.GESTALT+=1; }
    if (pat("autocritica")) sc.CFT+=3;
    if (pat("impulsividade")) sc.DBT+=3;
    if (pat("evitacao")) sc.EXPOSICAO+=3;
    if (prefs.includes("experiencial")) sc.GESTALT+=2;
    return sc;
  }
  const top3 = sc => Object.entries(sc).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k);

  function protocolFor(key){
    const map = {
      CFT: [
        "Objetivo: reduzir autocrítica e vergonha; ativar segurança interna.",
        "Sessão 1",
        "- Psicoeducação: sistemas ameaça, impulso e cuidado.",
        "- Respiração calmante 4-4-6. Descobrir tom compassivo (voz, postura).",
        "Sessão 2",
        "- Construir self compassivo (traços, frases, gesto).",
        "- Reescrever diálogo crítico com resposta compassiva.",
        "Sessão 3",
        "- Compaixão ao outro e ao eu do passado; ritual 2x/dia.",
        "Tarefa: diário de compaixão 5 min/dia.",
        "Indicadores: menos autocrítica; mais engajamento.",
        "Cuidados: condução gentil; acolher tristeza emergente."
      ],
      DBT: [
        "Objetivo: aumentar regulação emocional e efetividade interpessoal.",
        "Sessão 1",
        "- Mindfulness 3 min. Função das emoções.",
        "- Tolerância à aflição: TIP e ACCEPTS (escolha 2).",
        "Sessão 2",
        "- Opostos à emoção; mapa de vulnerabilidades.",
        "- DEAR MAN: role-play de pedido e limites.",
        "Sessão 3",
        "- Plano de crise: passos e contatos; ensaios.",
        "Tarefa: 2 práticas/dia (mindfulness + ACCEPTS/DEAR MAN).",
        "Indicadores: menos picos; menos rupturas.",
        "Cuidados: monitorar risco e rede de apoio."
      ],
      GESTALT: [
        "Objetivo: ampliar awareness no aqui e agora; contato e responsabilidade.",
        "Sessão 1",
        "- Ciclo do contato. Cadeira vazia: crítico x vulnerável.",
        "- Pergunta chave: 'o que sente no corpo agora?'.",
        "Sessão 2",
        "- Polaridades (controlar x ceder).",
        "- Grounding 4-4-6; eu-mensagens.",
        "Sessão 3",
        "- Ajustes criativos; plano de presença 3x/dia.",
        "Tarefa: diário de awareness (corpo, necessidade, micro-ação).",
        "Indicadores: menos reatividade; mais responsabilidade.",
        "Cuidados: respeitar janela de tolerância."
      ],
      EXPOSICAO: [
        "Objetivo: reduzir evitação e medo condicionado.",
        "Sessão 1",
        "- Hierarquia de 0 a 100; psicoeducação de habituação.",
        "- Interoceptiva leve + recuperação 4-4-6; SUDS.",
        "Sessão 2",
        "- Exposição situacional passo 1; menos reasseguramento.",
        "Sessão 3",
        "- Avançar 1-2 níveis; revisar significados.",
        "Tarefa: 2 exposições curtas/dia com SUDS antes/depois.",
        "Indicadores: queda de SUDS e de evitação.",
        "Cuidados: respeitar janela; evitar exposição sem suporte."
      ]
    };
    return map[key].join("\\n");
  }

  function buildParecer(){
    const nome = fields.nome.value.trim();
    const idade = fields.idade.value.trim();
    const queixa = fields.queixa.value.trim();
    const objetivo = fields.objetivo.value.trim();
    const sev = Number(fields.severidade.value);
    const riscos = fields.riscos.value.trim();
    const obs = fields.obs.value.trim();
    const sel = getSelections();

    const t3 = top3(scoreTechs(sel));
    const tag = t => `<span class="tag">${t}</span>`;
    const tagify = arr => arr.length ? arr.map(tag).join(" ") : "—";

    const blocks = t3.map(k => `<div class="block"><h5>${TECHS[k]}</h5><pre>${protocolFor(k)}</pre></div>`).join("");

    $("#parecer").innerHTML = [
      `<h4>Dados do caso</h4>`,
      `<div><strong>Paciente:</strong> ${nome||"—"} • <strong>Idade:</strong> ${idade||"—"} • <strong>Sev.:</strong> ${sev}/10</div>`,
      `<div><strong>Queixa:</strong> ${queixa||"—"}</div>`,
      `<div><strong>Objetivo:</strong> ${objetivo||"—"}</div>`,
      `<div><strong>Sintomas/temas:</strong> ${tagify($$(".sym:checked").map(c=>c.value))}</div>`,
      `<div><strong>Padrões:</strong> ${tagify($$(".pat:checked").map(c=>c.value))}</div>`,
      `<div><strong>Preferências:</strong> ${tagify($$(".pref:checked").map(c=>c.value))}</div>`,
      `<div><strong>Riscos/atenção:</strong> ${riscos||"—"}</div>`,
      `<div><strong>Observações do terapeuta:</strong> ${obs||"—"}</div>`,
      `<div class="sep"></div>`,
      `<h4>Técnicas selecionadas (máx. 3)</h4>`,
      `<div>${t3.map(k=>tag(TECHS[k])).join(" ")}</div>`,
      `<div class="sep"></div>`,
      `<h4>Roteiro detalhado (primeiros 3 encontros)</h4>`,
      blocks
    ].join("");

    const header = [
      `Paciente: ${nome||"—"}`,
      `Idade: ${idade||"—"}`,
      `Data: ${new Intl.DateTimeFormat("pt-BR").format(new Date())}`,
      `Severidade: ${sev}/10`,
      `Queixa: ${queixa||"—"}`,
      `Objetivo: ${objetivo||"—"}`
    ].join("\\n");

    const corpo = t3.map(k => `${TECHS[k]}\\n${protocolFor(k)}`).join("\\n\\n");
    return {texto: header + "\\n\\n" + corpo};
  }

  function baixarPDF(){
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF){ alert("PDF off-line: coloque /vendor/jspdf.umd.min.js ou permita a CDN."); return; }
    const {texto} = buildParecer();
    const doc = new jsPDF({unit:"pt", format:"a4"});
    const margin = 48, maxWidth = 515;
    doc.setFont("Helvetica","Bold"); doc.setFontSize(14);
    doc.text("THSE – Mentor Humanista (Gestalt + Comportamental)", margin, 54);
    doc.setFont("Helvetica","Normal"); doc.setFontSize(11.5);
    let y = 76;
    texto.split("\\n").forEach(p => {
      const lines = doc.splitTextToSize(p, maxWidth);
      for(const line of lines){
        if (y>800){ doc.addPage(); doc.setFont("Helvetica","Normal"); doc.setFontSize(11.5); y=60; }
        doc.text(line, margin, y);
        y += 15;
      }
      y += 4;
    });
    doc.save("Protocolo_THSE.pdf");
  }

  // Bind
  document.getElementById("pdf2").addEventListener("click", baixarPDF);
  document.getElementById("fab-pdf").addEventListener("click", baixarPDF);
  document.getElementById("pdfTop").addEventListener("click", baixarPDF);
  document.getElementById("gerar").addEventListener("click", ()=>{buildParecer(); document.getElementById("fab-pdf").style.display="flex"; postHeight();});
  document.getElementById("pdf").addEventListener("click", baixarPDF);
  document.getElementById("limpar").addEventListener("click", ()=>{
    ["nome","idade","queixa","objetivo","riscos","obs"].forEach(id=> document.getElementById(id).value="");
    $$("input[type=checkbox]").forEach(c=> c.checked=false);
    document.getElementById("severidade").value=6; document.getElementById("sevVal").textContent="6";
    document.getElementById("parecer").innerHTML='<p>Preencha a anamnese e clique em <strong>Gerar protocolo</strong>.</p>';
    document.getElementById("fab-pdf").style.display="none";
    postHeight();
    window.scrollTo({top:0, behavior:"smooth"});
  });
})();