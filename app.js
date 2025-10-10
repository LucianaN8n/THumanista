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

  // Aprofundamento: scripts cronometrados (30 ou 50 min) com prompts + tarefas + indicadores
  function deepScript(key){
    if(key==="GESTALT"){
      return [
        "Objetivo: awareness no aqui e agora; contato e responsabilidade.",
        "Sessão 1 - 50 min",
        "- 05 min: contrato breve e setting. Pergunte: 'o que te trouxe hoje em uma frase?'.",
        "- 08 min: psicoeducação do ciclo de contato. Exemplo cotidiano do paciente.",
        "- 12 min: experimento cadeira vazia (crítico x vulnerável). Condução: 'diga ao crítico: o que você precisa de mim?'.",
        "- 05 min: aterramento 4-4-6 e varredura corporal.",
        "- 10 min: integrar aprendizagens, transformar fala de dever em escolha ('eu escolho...').",
        "- 05 min: combinar tarefa e indicadores.",
        "Tarefa: diário de awareness 3x/dia (corpo - necessidade - micro-ação).",
        "Indicadores: mais linguagem de responsabilidade; menor reatividade corporal.",
        "Cuidados: se emocionar demais, pause e volte ao corpo; não forçar confronto.",
        "",
        "Sessão 2 - 50 min",
        "- 05 min: checagem de tarefa e avaliação de risco.",
        "- 10 min: polaridades (controlar x ceder) com duas cadeiras.",
        "- 10 min: treino de eu-mensagens (observação, sentimento, necessidade, pedido).",
        "- 10 min: ensaio situacional com fala direta; feedback somático.",
        "- 10 min: plano de prática no ambiente real.",
        "- 05 min: revisão.",
        "Tarefa: presença em 3 situações-alvo e 1 pedido claro por dia.",
        "Indicadores: aumento de pedidos claros e contato com sensação.",
        "",
        "Sessão 3 - 50 min",
        "- 05 min: checagem e obstáculos.",
        "- 15 min: ajustes criativos - mapear onde funcionaram e onde viraram rigidez.",
        "- 10 min: experimento 'como seria se... agora' com micro-ação.",
        "- 10 min: contrato de continuidade (ritual de presença 3x/dia).",
        "- 10 min: planejar cena desafiadora com suporte corporal."
      ].join("\\n");
    }
    if(key==="DBT"){
      return [
        "Objetivo: regular emoção, aumentar tolerância à aflição e efetividade interpessoal.",
        "Sessão 1 - 50 min",
        "- 05 min: alinhamento e metas. Mini mindfulness 3 min (respiração e 5 sentidos).",
        "- 10 min: função das emoções e vulnerabilidades (sono, alimentação, estresse).",
        "- 15 min: Tolerância à aflição - ensinar TIP (temperatura, exercício leve, respiração) e ACCEPTS (atividades, contribuir, comparações, emoções opostas, afastar, pensamentos, sensações). Escolher 2.",
        "- 10 min: ensaio de uso em gatilhos reais (roteirizar).",
        "- 10 min: plano diário de habilidades.",
        "Tarefa: cartela de habilidades - praticar 2 por dia (uma TIP e uma ACCEPTS).",
        "Indicadores: queda de picos; menor urgência comportamental.",
        "",
        "Sessão 2 - 50 min",
        "- 05 min: revisão da prática e barreiras.",
        "- 15 min: regulação emocional - opostos à emoção + construção de atividades com valor.",
        "- 20 min: DEAR MAN (descrever, expressar, afirmar, reforçar, mindful, aparecer confiante, negociar) - role-play de um pedido difícil.",
        "- 10 min: plano de generalização (quando, onde, com quem).",
        "Tarefa: 1 DEAR MAN real na semana + registro breve.",
        "Indicadores: aumento de assertividade; menos discussões em espiral.",
        "",
        "Sessão 3 - 50 min",
        "- 05 min: checagem de risco e rede de apoio.",
        "- 15 min: construir Plano de Crise (passos 1- foco, 2- habilidades, 3- contatos).",
        "- 15 min: tolerância à aflição avançada - kit de emergência (gel, música, respiração, frases de validação).",
        "- 10 min: revisar vitórias e ajustar metas.",
        "- 05 min: encerramento com mindfulness de gratidão 2 min."
      ].join("\\n");
    }
    if(key==="CFT"){
      return [
        "Objetivo: reduzir autocrítica e vergonha; cultivar sistema de cuidado/afiliação.",
        "Sessão 1 - 50 min",
        "- 05 min: vínculo e motivação. Explicar 3 sistemas (ameaça, impulso, cuidado).",
        "- 10 min: respiração calmante 4-4-6; corpo base.",
        "- 15 min: descobrir tom compassivo (voz, postura, olhar, gesto). Ensaiar frases: 'estou aqui com você; é difícil e vamos passo a passo'.",
        "- 10 min: mapear crítica predominante e seu objetivo protetivo.",
        "- 10 min: tarefa e ritual de 2x/dia (respiração + frase).",
        "Tarefa: diário de compaixão 5 min/dia (o que eu diria a um amigo?).",
        "Indicadores: queda de vergonha; mais autoapoio.",
        "",
        "Sessão 2 - 50 min",
        "- 05 min: checagem do ritual e barreiras.",
        "- 15 min: construir self compassivo (traços, postura, temperatura, linguagem).",
        "- 15 min: diálogo crítico x self compassivo (roteiro guiado).",
        "- 10 min: prática de reparentalização breve (mão no peito + frase nutritiva).",
        "- 05 min: plano de prática situacional.",
        "Tarefa: 3 momentos de autoapoio/dia + resposta compassiva escrita para 1 autocrítica.",
        "Indicadores: maior tolerância a erros; aumento de ações com valor.",
        "",
        "Sessão 3 - 50 min",
        "- 05 min: revisão de ganhos.",
        "- 15 min: compaixão ao eu do passado (carta curta).",
        "- 15 min: compaixão ao outro difícil mantendo limites.",
        "- 10 min: ensaio de fala compassiva em situação real.",
        "- 05 min: consolidar ritual de manutenção 4 semanas."
      ].join("\\n");
    }
    return "";
  }

  function buildParecer(){
    const nome = fields.nome.value.trim();
    const idade = fields.idade.value.trim();
    const queixa = fields.queixa.value.trim();
    const objetivo = fields.objetivo.value.trim();
    const sev = Number(fields.severidade.value);
    const riscos = fields.riscos.value.trim();
    const obs = fields.obs.value.trim();
    const {sintomas, padroes, prefs} = getSelections();

    // ranking simples priorizando GESTALT/DBT/CFT quando empatado
    const sc = (function(){
      const base = {CFT:0, DBT:0, GESTALT:0, EXPOSICAO:0};
      const s = scoreTechs({sintomas, padroes, prefs});
      return Object.assign(base, s);
    })();
    let t3 = top3(sc);
    if(t3.length<3) t3 = ["GESTALT","DBT","CFT"].slice(0,3);

    const tag = t => `<span class="tag">${t}</span>`;
    const tagify = arr => arr.length ? arr.map(tag).join(" ") : "—";

    const blocks = t3.map(k => `<div class="block"><h5>${TECHS[k]}</h5><pre>${deepScript(k)}</pre></div>`).join("");

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
      `<h4>Roteiro detalhado (primeiros 3 encontros, 50 min)</h4>`,
      blocks
    ].join("");

    // texto PDF
    const header = [
      f"Paciente: {nome or '—'}",
      f"Idade: {idade or '—'}",
      new Intl.DateTimeFormat("pt-BR").format(new Date()),
      f"Severidade: {sev}/10",
      f"Queixa: {queixa or '—'}",
      f"Objetivo: {objetivo or '—'}"
    ].join("\\n");

    const corpo = t3.map(k => `${TECHS[k]}\\n${deepScript(k)}`).join("\\n\\n");
    return {texto: header + "\\n\\n" + corpo};
  }

  function baixarPDF(){
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF){ alert("PDF off-line: coloque /vendor/jspdf.umd.min.js ou permita a CDN."); return; }
    const {texto} = buildParecer();
    const doc = new jsPDF({unit:"pt", format:"a4"});
    const margin = 48, maxWidth = 515;
    doc.setFont("Helvetica","Bold"); doc.setFontSize(14);
    doc.text("THSE – Mentor Humanista (Gestalt • DBT • CFT)", margin, 54);
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