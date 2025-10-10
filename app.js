(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });
  const today = fmt.format(new Date());
  (document.getElementById("today")||{}).textContent = today;

  const TECHS = { CFT:"Terapia Focada na Compaixão (CFT)", DBT:"Terapia Comportamental Dialética (DBT)", GESTALT:"Terapia Gestalt", EXPOSICAO:"Terapia de exposição gradual" };

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

  // Roteiros cronometrados por técnica e duração
  function scriptByDuration(key, dur){
    const short = dur==="30";
    const t = (full, shrunk) => short ? shrunk : full;
    if(key==="GESTALT"){
      return [
        "Objetivo: awareness no aqui e agora; contato e responsabilidade.",
        t("Sessão 1 - 50 min","Sessão 1 - 30 min"),
        t("- 05 min: contrato e foco.","- 03 min: contrato e foco."),
        t("- 08 min: psicoeducação do ciclo de contato.","- 05 min: psicoeducação breve do ciclo."),
        t("- 12 min: cadeira vazia (crítico x vulnerável); condução guiada.","- 08 min: cadeira vazia breve (1 ciclo)."),
        t("- 05 min: aterramento 4-4-6.","- 03 min: aterramento 4-4-6."),
        t("- 10 min: integrar aprendizagens; 'eu escolho...'","- 07 min: integrar e compromisso."),
        "- 02–03 min: tarefa e indicadores.",
        "Tarefa: diário de awareness 3x/dia (corpo - necessidade - micro-ação).",
        "",
        t("Sessão 2 - 50 min","Sessão 2 - 30 min"),
        t("- 10 min: polaridades (controlar x ceder).","- 06 min: polaridades rápida."),
        t("- 10 min: eu-mensagens.","- 06 min: eu-mensagens prática."),
        t("- 10 min: ensaio situacional + feedback somático.","- 08 min: ensaio situacional."),
        t("- 10 min: plano de prática real.","- 07 min: plano real."),
        "- 02–03 min: revisão.",
        "",
        t("Sessão 3 - 50 min","Sessão 3 - 30 min"),
        t("- 15 min: ajustes criativos.","- 08 min: ajustes criativos."),
        t("- 10 min: experimento 'como seria se... agora'.","- 07 min: experimento imediato."),
        t("- 10 min: contrato de continuidade.","- 07 min: continuidade + ritual 2x/dia.")
      ].join("\n");
    }
    if(key==="DBT"){
      return [
        "Objetivo: regular emoção, tolerância à aflição e efetividade interpessoal.",
        t("Sessão 1 - 50 min","Sessão 1 - 30 min"),
        t("- 10 min: função das emoções + vulnerabilidades.","- 06 min: função das emoções."),
        t("- 15 min: TIP + ACCEPTS (escolher 2).","- 10 min: TIP + 1 ACCEPTS."),
        t("- 10 min: roteirizar gatilhos reais.","- 07 min: ensaio em 1 gatilho."),
        t("- 10 min: plano diário de habilidades.","- 05 min: plano mínimo diário."),
        "- 02–03 min: síntese.",
        "",
        t("Sessão 2 - 50 min","Sessão 2 - 30 min"),
        t("- 15 min: opostos à emoção + atividades com valor.","- 08 min: opostos à emoção."),
        t("- 20 min: DEAR MAN com role-play difícil.","- 12 min: DEAR MAN em 1 cena."),
        t("- 10 min: generalização.","- 07 min: generalização mínima."),
        "",
        t("Sessão 3 - 50 min","Sessão 3 - 30 min"),
        t("- 15 min: Plano de Crise (foco, habilidades, contatos).","- 10 min: Plano de Crise enxuto."),
        t("- 15 min: kit de emergência.","- 10 min: kit essencial."),
        t("- 10 min: revisão e metas.","- 07 min: revisão e metas.")
      ].join("\n");
    }
    if(key==="CFT"){
      return [
        "Objetivo: reduzir autocrítica/vergonha; cultivar sistema de cuidado.",
        t("Sessão 1 - 50 min","Sessão 1 - 30 min"),
        t("- 10 min: 3 sistemas + respiração 4-4-6.","- 08 min: 3 sistemas + 4-4-6."),
        t("- 15 min: tom compassivo (voz, postura, gesto).","- 10 min: tom compassivo essencial."),
        t("- 10 min: mapear crítica protetiva.","- 07 min: mapear 1 crítica."),
        "- 02–03 min: tarefa 2x/dia (respiração + frase).",
        "",
        t("Sessão 2 - 50 min","Sessão 2 - 30 min"),
        t("- 15 min: construir self compassivo.","- 10 min: self compassivo rápido."),
        t("- 15 min: diálogo crítico x self compassivo.","- 10 min: diálogo 1 ciclo."),
        t("- 10 min: reparentalização breve.","- 07 min: reparentalização breve."),
        "",
        t("Sessão 3 - 50 min","Sessão 3 - 30 min"),
        t("- 15 min: compaixão ao eu do passado.","- 10 min: carta curta ao eu do passado."),
        t("- 15 min: compaixão ao outro difícil (com limites).","- 10 min: fala compassiva com limites."),
        t("- 10 min: manutenção 4 semanas.","- 07 min: manutenção 2–4 semanas.")
      ].join("\n");
    }
    if(key==="EXPOSICAO"){
      return [
        "Objetivo: reduzir evitação e medo condicionado com exposição gradual.",
        t("Sessão 1 - 50 min (planejamento)","Sessão 1 - 30 min (planejamento)"),
        t("- 08 min: psicoeducação (habituação x sensibilização).","- 05 min: psicoeducação rápida."),
        t("- 12 min: hierarquia 0–100 (10–12 itens).","- 08 min: hierarquia 0–100 (6–8 itens)."),
        t("- 12 min: treino interoceptivo + SUDS.","- 07 min: interoceptivo + SUDS."),
        t("- 08 min: escolher 2 alvos iniciais.","- 05 min: escolher 1–2 alvos."),
        "- 02–03 min: regras de segurança.",
        "",
        t("Sessão 2 - 50 min (1ª execução)","Sessão 2 - 30 min (1ª execução)"),
        t("- 30 min: conduzir exposição situacional (alvo 1).","- 18 min: conduzir exposição curta."),
        t("- 10 min: processar aprendizado.","- 07 min: processar aprendizado."),
        t("- 05 min: plano diário.","- 05 min: plano diário."),
        "",
        t("Sessão 3 - 50 min (progressão)","Sessão 3 - 30 min (progressão)"),
        t("- 30 min: avançar 1–2 níveis.","- 18 min: avançar 1 nível."),
        t("- 10 min: significado e autoeficácia.","- 07 min: significado."),
        t("- 05 min: manutenção 4 semanas.","- 05 min: manutenção 2–4 semanas.")
      ].join("\n");
    }
    return "";
  }

  // Checklists por técnica
  const CHECKS = {
    GESTALT: {
      abre: ["Alinhar foco no aqui-e-agora", "Mapa rápido do ciclo de contato", "Acordos de segurança/pausa"],
      miolo: ["Experimento (cadeira vazia/polaridades)", "Eu-mensagens / ensaio situacional", "Feedback somático (corpo)"],
      fecha: ["Síntese do que funcionou", "Tarefa definida e mensurável", "Indicadores para próxima sessão"]
    },
    DBT: {
      abre: ["Definir metas e validar emoção", "Mindfulness curto (3′)", "Revisar vulnerabilidades"],
      miolo: ["Ensinar TIP/ACCEPTS", "Treinar DEAR MAN", "Plano de crise rascunhado"],
      fecha: ["Compromisso com 2 habilidades/dia", "Registro rápido (cartela)", "Generalização (quando/onde)"]
    },
    CFT: {
      abre: ["Apresentar 3 sistemas", "Respiração calmante 4-4-6", "Tom compassivo definido"],
      miolo: ["Diálogo crítico × self compassivo", "Reparentalização breve", "Prática situacional compassiva"],
      fecha: ["Ritual 2×/dia definido", "Carta/Frase nutritiva combinada", "Indicadores: menos vergonha/mais ação"]
    },
    EXPOSICAO: {
      abre: ["Revisar SUDS e segurança", "Escolha do alvo do dia", "Combinar não reassegurar"],
      miolo: ["Exposição contínua dentro da janela", "Medir SUDS a cada 3–5 min", "Impedir rituais"],
      fecha: ["Processar evidências vs. previsão", "Plano de repetição diária", "Próximo nível da hierarquia"]
    }
  };

  // Render de um bloco com seletor + script + checklist
  function renderBlock(key, duration){
    const name = TECHS[key];
    const options = `<select class="dur" data-tech="${key}"><option value="30"${duration==="30"?" selected":""}>30 min</option><option value="50"${duration==="50"?" selected":""}>50 min</option></select>`;
    const checks = CHECKS[key];
    const mkChecks = (section, items)=>{
      return `<fieldset><legend>${section}</legend>${
        items.map((txt,i)=>`<label><input type="checkbox" class="chk" data-tech="${key}" data-sec="${section}" value="${i}"> ${txt}</label>`).join("")
      }</fieldset>`;
    };
    return `
    <div class="block" id="blk-${key}">
      <div class="controls">
        <span class="sel">Duração: ${options}</span>
      </div>
      <h5>${name}</h5>
      <pre>${scriptByDuration(key, duration)}</pre>
      <div class="checks">
        ${mkChecks("Abertura", checks.abre)}
        ${mkChecks("Miolo", checks.miolo)}
        ${mkChecks("Fechamento", checks.fecha)}
      </div>
    </div>`;
  }

  function buildParecer(){
    const nome = ($("#nome").value||"").trim();
    const idade = ($("#idade").value||"").trim();
    const queixa = ($("#queixa").value||"").trim();
    const objetivo = ($("#objetivo").value||"").trim();
    const sev = Number($("#severidade").value||6);
    const riscos = ($("#riscos").value||"").trim();
    const obs = ($("#obs").value||"").trim();

    const sel = getSelections();
    let ranking = top3(scoreTechs(sel));
    const pref = ["GESTALT","DBT","CFT","EXPOSICAO"];
    ranking = ranking.sort((a,b)=> pref.indexOf(a)-pref.indexOf(b));
    const t3 = ranking.length? ranking : ["GESTALT","DBT","CFT"];

    // estado de duração por técnica (default 50)
    const durations = Object.fromEntries(t3.map(k=>[k,"50"]));

    // Monta HTML do parecer
    const tag = t => `<span class="tag">${t}</span>`;
    const tagify = arr => arr.length ? arr.map(tag).join(" ") : "—";

    // header
    $("#parecer").innerHTML = [
      `<h4>Dados do caso</h4>`,
      `<div><strong>Paciente:</strong> ${nome||"—"} • <strong>Idade:</strong> ${idade||"—"} • <strong>Sev.:</strong> ${sev}/10</div>`,
      `<div><strong>Queixa:</strong> ${queixa||"—"}</div>`,
      `<div><strong>Objetivo:</strong> ${objetivo||"—"}</div>`,
      `<div><strong>Sintomas/temas:</strong> ${tagify($$(".sym:checked").map(c=>c.value))}</div>`,
      `<div><strong>Padrões:</strong> ${tagify($$(".pat:checked").map(c=>c.value))}</div>`,
      `<div class="sep"></div>`,
      `<h4>Técnicas selecionadas (máx. 3)</h4>`,
      `<div>${t3.map(k=>tag(TECHS[k])).join(" ")}</div>`,
      `<div class="sep"></div>`,
      `<h4>Roteiro detalhado (Sessões 1–3)</h4>`,
      t3.map(k=>renderBlock(k, durations[k])).join("")
    ].join("");

    // listeners das dropdowns para trocar duração on-the-fly
    $$(".dur").forEach(sel=>{
      sel.addEventListener("change", (e)=>{
        const key = e.target.dataset.tech;
        const dur = e.target.value;
        const pre = document.querySelector(`#blk-${key} pre`);
        pre.textContent = scriptByDuration(key, dur);
      });
    });

    // Retorno para o PDF
    function readChecklist(){
      const out = {};
      t3.forEach(k=>{
        out[k] = {Abertura:[], Miolo:[], Fechamento:[]};
      });
      $$(".chk").forEach(c=>{
        const k = c.dataset.tech, sec = c.dataset.sec;
        if (c.checked){
          const label = c.parentElement.textContent.trim();
          out[k][sec].push(label);
        }
      });
      return out;
    }
    function readDurations(){
      const out = {};
      $$(".dur").forEach(s=> out[s.dataset.tech] = s.value);
      return out;
    }

    return {
      t3, nome, idade, queixa, objetivo, sev,
      durationsReader: readDurations,
      checklistReader: readChecklist
    };
  }

  function gerarTextoPDF(ctx){
    const {t3, nome, idade, queixa, objetivo, sev} = ctx;
    const durs = ctx.durationsReader();
    const checks = ctx.checklistReader();
    const header = [
      `Paciente: ${nome||"—"}`,
      `Idade: ${idade||"—"}`,
      `Data: ${today}`,
      `Severidade: ${sev}/10`,
      `Queixa: ${queixa||"—"}`,
      `Objetivo: ${objetivo||"—"}`,
      ""
    ].join("\n");
    const body = t3.map(k=>{
      const titulo = `${TECHS[k]} — ${durs[k]} min`;
      const script = scriptByDuration(k, durs[k]);
      const ck = checks[k]||{Abertura:[], Miolo:[], Fechamento:[]};
      const ckTxt = ["Abertura","Miolo","Fechamento"].map(sec=>{
        const arr = ck[sec]||[];
        if(!arr.length) return `${sec}: [ ]`;
        return `${sec}: ` + arr.map(t=>`[x] ${t}`).join("; ");
      }).join("\n");
      return `${titulo}\n${script}\n\nChecklist\n${ckTxt}`;
    }).join("\n\n");
    return header + body;
  }

  function baixarPDF(){
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF){ alert("PDF off-line: coloque /vendor/jspdf.umd.min.js (ou permita a CDN)."); return; }
    const ctx = buildParecer(); // garante leitura atualizada de durations/checks
    const texto = gerarTextoPDF(ctx);
    const doc = new jsPDF({unit:"pt", format:"a4"});
    const margin = 48, maxWidth = 515;
    doc.setFont("Helvetica","Bold"); doc.setFontSize(14);
    doc.text("THSE – Mentor Humanista (Gestalt • DBT • CFT)", margin, 54);
    doc.setFont("Helvetica","Normal"); doc.setFontSize(11.5);
    let y = 76;
    texto.split("\n").forEach(p => {
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

  // Eventos
  document.getElementById("gerar").addEventListener("click", ()=>{
    const ctx = buildParecer();
    const fab = document.getElementById("fab-pdf");
    if (fab) fab.style.display = "flex";
    document.getElementById("card-parecer").scrollIntoView({behavior:"smooth", block:"start"});
  });
  ["pdf","pdfTop","pdf2"].forEach(id=>{
    const el=document.getElementById(id); if(el) el.addEventListener("click", baixarPDF);
  });
  document.getElementById("limpar").addEventListener("click", ()=>{
    ["nome","idade","queixa","objetivo","riscos","obs"].forEach(id=> {const el=document.getElementById(id); if(el) el.value="";});
    $$("input[type=checkbox]").forEach(c=> c.checked=false);
    const sev = document.getElementById("severidade"); if(sev){ sev.value=6; (document.getElementById("sevVal")||{}).textContent="6"; }
    const fab = document.getElementById("fab-pdf"); if (fab) fab.style.display="none";
    const p = document.getElementById("parecer");
    if(p) p.innerHTML = '<p>Preencha a anamnese e clique em <strong>Gerar protocolo</strong>.</p>';
    window.scrollTo({top:0, behavior:"smooth"});
  });
})();