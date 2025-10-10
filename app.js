(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });
  const today = fmt.format(new Date());
  (document.getElementById("today")||{}).textContent = today;

  const TECHS = { CFT:"Terapia Focada na Compaixão (CFT)", DBT:"Terapia Comportamental Dialética (DBT)", GESTALT:"Terapia Gestalt", EXPOSICAO:"Terapia de exposição gradual" };

  // Plano B por técnica
  const PLANO_B = {
    GESTALT: [
      "Voltar ao corpo: pés no chão, respiração 4-4-6 por 1 min.",
      "Oferecer escolha: falar SOBRE, ENSAIAR, ou PAUSAR 3 min.",
      "Usar linguagem de escolha: trocar 'tenho que' por 'eu escolho'."
    ],
    DBT: [
      "Reduzir tarefa a micro-passos (1 minuto de habilidade).",
      "Escala 0–10 antes/depois, valide e redirecione para TIP/ACCEPTS.",
      "Se a discussão esquentar: pause, volte a mindfulness 2 min."
    ],
    CFT: [
      "Mudar para sensação neutra (mãos/temperatura).",
      "Frase nutritiva curta: 'é difícil e vou comigo passo a passo'.",
      "Diminuir tempo do exercício e reforçar segurança."
    ],
    EXPOSICAO: [
      "Voltar um nível da hierarquia e repetir até SUDS cair 30–40%.",
      "Dividir a cena em partes menores; impedir reasseguramento.",
      "TIP (frio/respiração) apenas para manter-se na janela, sem ritual."
    ]
  };

  // Passos detalhados por seção e técnica (com duração 50/30)
  const STEPS = {
    GESTALT: {
      Abertura: [
        {t:"Alinhar foco no aqui-e-agora", m50:3, m30:2, s:"Pergunte: 'Se tivesse que resumir o que te trouxe em 1 frase, qual seria?' Combine pausas e sinal de sobrecarga."},
        {t:"Ciclo de contato vivo", m50:8, m30:5, s:"Explique as fases; peça 1 sensação corporal + 1 necessidade agora."}
      ],
      Miolo: [
        {t:"Cadeira vazia (crítico × vulnerável)", m50:12, m30:8, s:"Guie o diálogo: 'Crítico, o que você tenta proteger?' Trocar de cadeira e responder."},
        {t:"Aterramento 4-4-6", m50:5, m30:3, s:"Inspira 4, segura 4, solta 6; 6 ciclos; scan corporal breve."}
      ],
      Fechamento: [
        {t:"Transformar 'dever' em escolha", m50:10, m30:7, s:"'Troque 'tenho que' por 'eu escolho...' e complete'."},
        {t:"Tarefa + indicadores", m50:3, m30:2, s:"Diário de awareness 3×/dia (corpo, necessidade, micro-ação). Indicadores: ↑ linguagem de escolha, ↓ tensão."}
      ]
    },
    DBT: {
      Abertura: [
        {t:"Vínculo + metas", m50:5, m30:4, s:"Defina 1–2 metas. Mindfulness 3’ (respiração 5 sentidos)."},
        {t:"Função das emoções", m50:7, m30:6, s:"Mapeie vulnerabilidades (sono, alimentação, estresse). Escolha 2 alvos."}
      ],
      Miolo: [
        {t:"Tolerância à aflição: TIP + ACCEPTS", m50:15, m30:10, s:"TIP: frio na face + respiração; ACCEPTS: escolha 2 (atividades, contribuir, etc.)."},
        {t:"Ensaio no gatilho real", m50:10, m30:7, s:"Roteirize quando/onde/como usará as habilidades."}
      ],
      Fechamento: [
        {t:"Plano diário de habilidades", m50:10, m30:5, s:"2 práticas/dia (1 TIP + 1 ACCEPTS). Registro rápido."},
        {t:"Síntese", m50:3, m30:2, s:"Checar confiança 0–10 e próximos passos."}
      ]
    },
    CFT: {
      Abertura: [
        {t:"3 sistemas + respiração 4-4-6", m50:10, m30:8, s:"Ameaça–impulso–cuidado; respiração 4-4-6."},
        {t:"Corpo base", m50:3, m30:2, s:"Postura, olhar, voz ancorados."}
      ],
      Miolo: [
        {t:"Tom compassivo", m50:15, m30:10, s:"Definir voz/postura/olhar/gesto; ensaiar frases compassivas."},
        {t:"Diálogo Crítico × Compassivo", m50:15, m30:10, s:"Use cartões/crenças; responda com compaixão orientada a valor."}
      ],
      Fechamento: [
        {t:"Reparentalização breve", m50:10, m30:7, s:"Mão no peito + frase nutritiva ao 'eu criança'."},
        {t:"Ritual 2×/dia", m50:3, m30:2, s:"Respiração + frase; planejar 2 contextos diários."}
      ]
    },
    EXPOSICAO: {
      Abertura: [
        {t:"Revisar SUDS + segurança", m50:5, m30:4, s:"Janela de tolerância; sem reasseguramento."},
        {t:"Escolher alvo do dia", m50:3, m30:2, s:"SUDS 30–40 para começar."}
      ],
      Miolo: [
        {t:"Exposição contínua", m50:25, m30:15, s:"Permanecer na cena; medir SUDS a cada 3–5 min; impedir rituais."},
        {t:"Processar evidências", m50:10, m30:7, s:"Previsão vs. realidade; o que aprendeu sobre si/risco."}
      ],
      Fechamento: [
        {t:"Plano de repetição", m50:7, m30:5, s:"Repetir diariamente; avançar 1 nível se SUDS cair ≥40% do pico."},
        {t:"Próximo nível", m50:3, m30:2, s:"Registrar tarefa e marcar agenda."}
      ]
    }
  };

  // Timers por passo
  const timers = new Map();
  function fmtMMSS(sec){ const m=String(Math.floor(sec/60)).padStart(2,'0'); const s=String(sec%60).padStart(2,'0'); return `${m}:${s}`; }
  function startTimer(id, seconds, el){
    stopTimer(id);
    const obj = {remain:seconds, el, int:setInterval(()=>{
      obj.remain--; 
      el.querySelector(".time").textContent = fmtMMSS(Math.max(obj.remain,0));
      el.classList.add("running");
      if(obj.remain<=0){ stopTimer(id); toast("⏱️ Tempo do passo concluído."); }
    },1000)};
    timers.set(id, obj);
  }
  function stopTimer(id){
    const t = timers.get(id);
    if(t){ clearInterval(t.int); t.el.classList.remove("running"); timers.delete(id); }
  }

  function toast(msg){
    let el = document.querySelector(".toast"); 
    if(!el){ el = document.createElement("div"); el.className="toast"; document.body.appendChild(el); }
    el.textContent = msg; el.style.display="block";
    setTimeout(()=>{ el.style.display="none"; }, 2600);
  }

  // UI helpers
  function durSelect(key, value){
    return `<select class="dur" data-tech="${key}"><option value="30"${value==="30"?" selected":""}>30 min</option><option value="50"${value==="50"?" selected":""}>50 min</option></select>`;
  }
  function planoBbtn(key){ return `<button class="btn ghost sm plano" data-tech="${key}" title="Se travar">Plano B</button>`; }
  function stepDetails(tech, sec, stepIndex, duration){
    const spec = STEPS[tech][sec][stepIndex];
    const mins = (duration==="30"? spec.m30 : spec.m50);
    const id = `t-${tech}-${sec}-${stepIndex}`;
    return `
    <details class="step" data-id="${id}">
      <summary>
        <div class="step-head">
          <span class="badge">${sec}</span>
          <span>${spec.t}</span>
          <span class="timer"><span class="time">${fmtMMSS(mins*60)}</span><span class="dot"></span></span>
        </div>
      </summary>
      <div class="step-actions">
        <button class="btn sm start" data-id="${id}" data-secs="${mins*60}">▶️ Iniciar</button>
        <button class="btn outline sm pause" data-id="${id}">⏸️ Pausar</button>
        <button class="btn ghost sm reset" data-id="${id}" data-secs="${mins*60}">↺ Reset</button>
      </div>
      <p>${spec.s}</p>
      <label><input type="checkbox" class="chk" data-tech="${tech}" data-sec="${sec}" value="${stepIndex}"> Marcar como concluído</label>
    </details>`;
  }

  // Scripts por técnica + accordions
  function scriptByDuration(key, dur){
    // usa o somatório de textos dos passos para exibir no <pre> (resumo corrido)
    const secs = ["Abertura","Miolo","Fechamento"];
    const lines = [];
    secs.forEach(sec=>{
      (STEPS[key][sec]||[]).forEach(sp=>{
        const m = dur==="30"? sp.m30 : sp.m50;
        lines.push(`- (${sec} ${m}′) ${sp.t}`);
      });
    });
    return lines.join("\\n");
  }

  // Checklists por técnica (derivados dos passos)
  function checksFor(key){
    const out = {Abertura:[], Miolo:[], Fechamento:[]};
    ["Abertura","Miolo","Fechamento"].forEach(sec=>{
      out[sec] = (STEPS[key][sec]||[]).map(sp=>sp.t);
    });
    return out;
  }

  // Render de um bloco com seletor + script + accordions por passo + checklist colapsável
  function renderBlock(key, duration){
    const name = TECHS[key];
    const checks = checksFor(key);
    const section = (sec)=> (STEPS[key][sec]||[]).map((_,i)=> stepDetails(key, sec, i, duration)).join("");
    return `
    <div class="block" id="blk-${key}">
      <div class="controls">
        <span class="sel">Duração: ${durSelect(key, duration)}</span>
        ${planoBbtn(key)}
      </div>
      <h5>${name}</h5>
      <pre>${scriptByDuration(key, duration)}</pre>
      <div class="checks">
        <fieldset><legend>Abertura</legend>${section("Abertura")}</fieldset>
        <fieldset><legend>Miolo</legend>${section("Miolo")}</fieldset>
        <fieldset><legend>Fechamento</legend>${section("Fechamento")}</fieldset>
      </div>
    </div>`;
  }

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

  function buildParecer(){
    const nome = ($("#nome").value||"").trim();
    const idade = ($("#idade").value||"").trim();
    const queixa = ($("#queixa").value||"").trim();
    const objetivo = ($("#objetivo").value||"").trim();
    const sev = Number($("#severidade").value||6);

    const sel = getSelections();
    let ranking = top3(scoreTechs(sel));
    const pref = ["GESTALT","DBT","CFT","EXPOSICAO"];
    ranking = ranking.sort((a,b)=> pref.indexOf(a)-pref.indexOf(b));
    const t3 = ranking.length? ranking : ["GESTALT","DBT","CFT"];

    const durations = Object.fromEntries(t3.map(k=>[k,"50"]));

    $("#parecer").innerHTML = [
      `<h4>Dados do caso</h4>`,
      `<div><strong>Paciente:</strong> ${nome||"—"} • <strong>Idade:</strong> ${idade||"—"} • <strong>Sev.:</strong> ${sev}/10</div>`,
      `<div><strong>Queixa:</strong> ${queixa||"—"} • <strong>Objetivo:</strong> ${objetivo||"—"}</div>`,
      `<div class="sep"></div>`,
      `<h4>Técnicas selecionadas (máx. 3)</h4>`,
      `<div>${t3.map(k=>`<span class="tag">${TECHS[k]}</span>`).join(" ")}</div>`,
      `<div class="sep"></div>`,
      `<h4>Roteiro detalhado (guiado)</h4>`,
      t3.map(k=>renderBlock(k, durations[k])).join("")
    ].join("");

    // Handlers: duração + timers + plano B
    $$(".dur").forEach(sel=>{
      sel.addEventListener("change", (e)=>{
        const key = e.target.dataset.tech;
        const dur = e.target.value;
        const pre = document.querySelector(`#blk-${key} pre`);
        pre.textContent = scriptByDuration(key, dur);
        // reset timers desse bloco
        $(`#blk-${key}`).querySelectorAll(".step").forEach(d=>{
          const id = d.dataset.id;
          const secs = findStepSecsFromId(id, dur);
          const tEl = d.querySelector(".timer");
          stopTimer(id);
          tEl.querySelector(".time").textContent = fmtMMSS(secs);
        });
      });
    });

    // Timer controls
    $$(".start").forEach(btn=> btn.addEventListener("click", e=>{
      const id = e.target.dataset.id;
      const secs = parseInt(e.target.dataset.secs,10)||0;
      const el = e.target.closest(".step").querySelector(".timer");
      startTimer(id, secs, el);
    }));
    $$(".pause").forEach(btn=> btn.addEventListener("click", e=> stopTimer(e.target.dataset.id)));
    $$(".reset").forEach(btn=> btn.addEventListener("click", e=>{
      const id = e.target.dataset.id;
      const secs = parseInt(e.target.dataset.secs,10)||0;
      const el = e.target.closest(".step").querySelector(".timer");
      stopTimer(id);
      el.querySelector(".time").textContent = fmtMMSS(secs);
    }));

    // Plano B
    $$(".plano").forEach(b=> b.addEventListener("click", e=>{
      const key = e.target.dataset.tech;
      toast("Plano B: " + (PLANO_B[key]||[]).join(" • "));
    }));

    // Para PDF: leitores
    function readChecklist(){
      const out = {};
      t3.forEach(k=>{ out[k] = {Abertura:[], Miolo:[], Fechamento:[]}; });
      $$(".chk").forEach(c=>{
        if(c.checked){
          const tech = c.dataset.tech, sec = c.dataset.sec;
          const label = c.parentElement.previousElementSibling ? 
            c.parentElement.previousElementSibling.textContent.trim() : "Passo concluído";
          out[tech][sec].push(label);
        }
      });
      return out;
    }
    function readDurations(){
      const out = {};
      $$(".dur").forEach(s=> out[s.dataset.tech] = s.value);
      return out;
    }

    return {t3, nome, idade, queixa, objetivo, sev, durationsReader:readDurations, checklistReader:readChecklist};
  }

  function findStepSecsFromId(id, dur){
    // id: t-TECH-SEC-INDEX
    try{
      const [,tech,sec,idx] = id.split("-");
      const spec = STEPS[tech][sec][parseInt(idx,10)];
      return (dur==="30"? spec.m30 : spec.m50)*60;
    }catch(e){ return 60; }
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
    ].join("\\n");
    const body = t3.map(k=>{
      const titulo = `${TECHS[k]} — ${durs[k]} min`;
      // resumo dos passos
      const resumo = scriptByDuration(k, durs[k]);
      const ck = checks[k]||{Abertura:[], Miolo:[], Fechamento:[]};
      const ckTxt = ["Abertura","Miolo","Fechamento"].map(sec=>{
        const arr = ck[sec]||[];
        if(!arr.length) return `${sec}: [ ]`;
        return `${sec}: ` + arr.map(t=>`[x] ${t}`).join("; ");
      }).join("\\n");
      return `${titulo}\\n${resumo}\\n\\nChecklist\\n${ckTxt}`;
    }).join("\\n\\n");
    return header + body;
  }

  function baixarPDF(){
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF){ alert("PDF off-line: coloque /vendor/jspdf.umd.min.js (ou permita a CDN)."); return; }
    const ctx = buildParecer(); // garante leitura de durations/checklist
    const texto = gerarTextoPDF(ctx);
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

  // Eventos
  document.getElementById("gerar").addEventListener("click", ()=>{
    buildParecer();
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