// main.js (enxuto e focado em anamnese -> protocolo)
const $ = (s) => document.querySelector(s);
const app = $("#app");
const editorSec = $("#editor");
const planoEditor = $("#plano-editor");

const estado = {
  cliente: { nome: "", queixa: "", objetivo: "" },
  anamnese: {},
  plano: [] // [{semana:1,titulo:'',itens:[...]}]
};

// 1) Coleta de anamnese e regras
$("#btn-gerar")?.addEventListener("click", () => {
  const nome = $("#f-nome").value.trim();
  const queixa = $("#f-queixa").value.trim();
  const intensidade = +$("#f-intensidade").value || 0;
  const gatilho = $("#f-gatilho").value.trim();
  const funcao = $("#f-funcao").value;
  const objetivo = $("#f-objetivo").value.trim();
  const pref = $("#f-preferencias").value.trim();

  estado.cliente = { nome, queixa, objetivo };
  estado.anamnese = { intensidade, gatilho, funcao, pref };

  // Motor simples de pontuação — customize à vontade
  const score = {
    crise: 0,    // DBT: TIPP/STOP
    regulacao: 0,// DBT: opposite action, higiene do sono
    compaixao: 0,// CFT: linguagem/voz/postura
    experimento: 0, // Gestalt: cadeira/contato
    habilidades: 0, // DEAR MAN / assertividade
    exposicao: 0,   // ABC/Exposição
  };

  if (intensidade >= 7) score.crise += 2;
  if (/noite|madrugada|sono/i.test(gatilho)) score.regulacao += 1;
  if (funcao === "alivio") score.regulacao += 1;
  if (funcao === "evitacao") score.exposicao += 2;
  if (funcao === "aprovacao") score.habilidades += 2;
  if (funcao === "controle") score.compaixao += 1;
  if (/falar|relacion|pedido|limite|conversa/i.test(objetivo)) score.habilidades += 1;
  if (/respira|corpo|postura|compaix/i.test(pref)) score.compaixao += 1;

  // Montagem do plano por blocos (NÃO fixo: nasce da pontuação)
  const plano = [];

  // Semana 1 – base e sobrevivência a crise
  const s1 = { semana: 1, titulo: "Semana 1 — Base e sobrevivência", itens: [] };
  if (score.crise > 0) {
    s1.itens.push(
      "DBT—STOP diário (2 min): parar, postura neutra, respiração 4–6 (5 ciclos)",
      "DBT—TIPP SOS: água fria/nuca + respiração 4–6 quando ≥7/10"
    );
  }
  s1.itens.push(
    "Rotina mínima de sono: horário fixo + 30 min sem tela",
    `Psicoeducação: nomear queixa em 1 frase (“${queixa||"—"}”) e objetivo (“${objetivo||"—"}”)`
  );
  plano.push(s1);

  // Semana 2 – regulação/compaixão/experimento
  const s2 = { semana: 2, titulo: "Semana 2 — Regulação e contato", itens: [] };
  if (score.compaixao > 0) {
    s2.itens.push(
      "CFT—postura corajosa 2x/dia (peito 5% aberto, mandíbula solta)",
      "CFT—frase-âncora: “Eu vejo. Eu fico. Próximo passo possível: ___.”"
    );
  }
  if (score.experimento > 0 || score.habilidades === 0) {
    s2.itens.push("Gestalt—experimento de cadeira interna 1x/semana (parte crítica ↔ vulnerável)");
  }
  plano.push(s2);

  // Semana 3 – habilidade relacional ou exposição
  const s3 = { semana: 3, titulo: "Semana 3 — Habilidade/Exposição", itens: [] };
  if (score.habilidades > 0) {
    s3.itens.push(
      "DBT—DEAR MAN: escrever e praticar 1 pedido real (descrição, expressão, afirmação, reforço)",
      "GIVE/FAST para manter vínculo + autorrespeito"
    );
  }
  if (score.exposicao > 0) {
    s3.itens.push(
      "Exposição graduada: listar 5 passos do mais fácil ao mais difícil e executar o primeiro (5–10 min)"
    );
  }
  plano.push(s3);

  // Semana 4 – consolidação e revisão
  const s4 = { semana: 4, titulo: "Semana 4 — Consolidação", itens: [
    "Revisar o que funcionou e repetir 2x",
    "Auto-feedback: o que ficou mais fácil e por quê"
  ]};
  plano.push(s4);

  estado.plano = plano;

  // Render no editor para você ajustar livremente
  renderEditor();
});

function renderEditor(){
  planoEditor.innerHTML = "";
  editorSec.style.display = "block";

  estado.plano.forEach((sem) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3 class="section-title"> ${sem.titulo} </h3>
      <ul>${sem.itens.map((t, i)=>`<li contenteditable="true" data-s="${sem.semana}" data-i="${i}">${t}</li>`).join("")}</ul>
      <button class="btn" data-add="${sem.semana}">+ item</button>
    `;
    planoEditor.appendChild(card);
  });

  // add item
  planoEditor.querySelectorAll("[data-add]").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const s = +e.currentTarget.getAttribute("data-add");
      const sem = estado.plano.find(x=>x.semana===s);
      sem.itens.push("Novo item… (edite)");
      renderEditor();
    });
  });

  // salvar edições inline
  planoEditor.querySelectorAll("li[contenteditable]").forEach(li=>{
    li.addEventListener("input", (e)=>{
      const s = +li.getAttribute("data-s");
      const i = +li.getAttribute("data-i");
      const sem = estado.plano.find(x=>x.semana===s);
      sem.itens[i] = li.textContent.trim();
    });
  });
}

// Refazer
$("#btn-refazer")?.addEventListener("click", ()=>{
  editorSec.style.display = "none";
  estado.plano = [];
});

// 2) PDF com Unicode (sem erro de acentos)
$("#btn-pdf")?.addEventListener("click", gerarPDF);

async function gerarPDF(){
  // carrega jsPDF e fonte Noto Sans (unicode)
  const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
  const url = 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/hinted/ttf/NotoSans/NotoSans-Regular.ttf';
  const fontBuf = await fetch(url).then(r=>r.arrayBuffer());
  const fontB64 = btoa(String.fromCharCode(...new Uint8Array(fontBuf)));

  const doc = new jsPDF.jsPDF({unit:'pt', format:'a4'});
  doc.addFileToVFS("NotoSans-Regular.ttf", fontB64);
  doc.addFont("NotoSans-Regular.ttf", "Noto", "normal");
  doc.setFont("Noto");

  const margem = 40, larg = 595.28 - margem*2;
  const hoje = new Date().toLocaleDateString('pt-BR');
  const { nome, queixa, objetivo } = estado.cliente;

  doc.setFontSize(16);
  doc.text("Parecer + Plano de 30 dias — Mentor Humanista", margem, 60);
  doc.setFontSize(11);
  doc.text(`Nome: ${nome||'—'}   •   Data: ${hoje}`, margem, 80);
  doc.text(`Queixa: ${queixa||'—'}`, margem, 96);
  doc.text(`Objetivo: ${objetivo||'—'}`, margem, 112);

  // Plano
  let y = 140;
  estado.plano.forEach(sem=>{
    doc.setFontSize(13);
    doc.text(sem.titulo, margem, y); y += 12;
    doc.setFontSize(11);
    const linhas = sem.itens.map(i=>"• "+i).join("\\n");
    const split = doc.splitTextToSize(linhas, larg);
    split.forEach(line=>{
      if(y > 780){ doc.addPage(); y = 60; }
      doc.text(line, margem, y); y += 14;
    });
    y += 6;
  });

  doc.save(`Protocolo_${(nome||'Cliente').replace(/\\s+/g,'_')}_${hoje}.pdf`);
}
