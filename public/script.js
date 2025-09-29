document.addEventListener('DOMContentLoaded', () => {
  // === LISTA ÎNTREBĂRI ===
  // Format: [Dimensiune, Tip scorare (1 direct, -1 invers), Text]
  const questions = [
    // Extroversie (E) – 10 itemi
    ['E', 1, "Îmi place să fiu în centrul atenției."],
    ['E', -1, "Prefer liniștea și singurătatea."],
    ['E', 1, "Îmi place să inițiez conversații."],
    ['E', -1, "Mă simt obosit după interacțiuni sociale lungi."],
    ['E', 1, "Sunt plin de energie și entuziasm."],
    ['E', -1, "Sunt rezervat și vorbesc puțin."],
    ['E', 1, "Îmi place să fiu sufletul petrecerii."],
    ['E', -1, "Evit evenimentele sociale mari."],
    ['E', 1, "Sunt asertiv și îmi exprim opiniile."],
    ['E', -1, "Mă gândesc mult înainte să vorbesc."],

    // Nevrozism (N) – 10 itemi
    ['N', 1, "Mă îngrijorez des pentru lucruri mărunte."],
    ['N', -1, "Sunt calm și relaxat în majoritatea timpului."],
    ['N', 1, "Am schimbări de dispoziție frecvente."],
    ['N', 1, "Mă simt adesea stresat sau tensionat."],
    ['N', -1, "Îmi revin repede după dificultăți."],
    ['N', 1, "Mă simt nesigur pe mine."],
    ['N', -1, "Rareori mă simt anxios."],
    ['N', 1, "Mă simt adesea trist sau deprimat."],
    ['N', 1, "Mă enervez ușor."],
    ['N', -1, "Sunt stabil emoțional."],

    // Deschidere (O) – 10 itemi
    ['O', 1, "Îmi place să explorez idei noi și abstracte."],
    ['O', -1, "Prefer rutina și tradiția."],
    ['O', 1, "Sunt curios și creativ."],
    ['O', 1, "Îmi place arta și frumusețea."],
    ['O', -1, "Nu sunt interesat de teorii complexe."],
    ['O', 1, "Îmi place să încerc lucruri noi."],
    ['O', -1, "Mă simt confortabil doar în medii familiare."],
    ['O', 1, "Am o imaginație bogată."],
    ['O', 1, "Îmi place diversitatea culturală."],
    ['O', -1, "Prefer faptele concrete, nu ideile abstracte."],

    // Conștiinciozitate (C) – 10 itemi
    ['C', 1, "Sunt organizat și planific din timp."],
    ['C', -1, "Am tendința să amân sarcinile."],
    ['C', 1, "Îmi respect promisiunile."],
    ['C', -1, "Sunt dezordonat."],
    ['C', 1, "Muncesc din greu pentru obiectivele mele."],
    ['C', -1, "Nu mă deranjează să las lucruri neterminate."],
    ['C', 1, "Sunt disciplinat."],
    ['C', -1, "Sunt impulsiv și acționez fără să gândesc."],
    ['C', 1, "Sunt atent la detalii."],
    ['C', -1, "Nu respect mereu regulile."],

    // Amabilitate (A) – 10 itemi
    ['A', 1, "Sunt empatic și mă gândesc la ceilalți."],
    ['A', -1, "Nu mă interesează problemele altora."],
    ['A', 1, "Sunt politicos cu toată lumea."],
    ['A', -1, "Îmi place să contrazic oamenii."],
    ['A', 1, "Am încredere în oameni."],
    ['A', -1, "Sunt suspicios față de intențiile altora."],
    ['A', 1, "Îmi place să ajut."],
    ['A', -1, "Mă folosesc de alții în interes propriu."],
    ['A', 1, "Sunt cooperant și lucrez bine în echipă."],
    ['A', -1, "Sunt certăreț."],

    // PHQ-9 (Depresie)
    ['PHQ', 1, "Puțin interes sau plăcere în a face lucruri."],
    ['PHQ', 1, "Mă simt trist, deprimat sau fără speranță."],
    ['PHQ', 1, "Probleme cu somnul (adormire, menținere sau prea mult somn)."],
    ['PHQ', 1, "Mă simt obosit sau lipsit de energie."],
    ['PHQ', 1, "Apetit scăzut sau mănânc prea mult."],
    ['PHQ', 1, "Mă simt rău în legătură cu mine sau că am eșuat."],
    ['PHQ', 1, "Dificultăți de concentrare."],
    ['PHQ', 1, "Mă mișc sau vorbesc încet / neliniștit."],
    ['PHQ', 1, "Gânduri că ar fi mai bine să nu mai fiu."],

    // GAD-7 (Anxietate)
    ['GAD', 1, "Mă simt nervos, anxios sau neliniștit."],
    ['GAD', 1, "Nu mă pot opri din a mă îngrijora."],
    ['GAD', 1, "Mă îngrijorez prea mult pentru diverse lucruri."],
    ['GAD', 1, "Am dificultăți să mă relaxez."],
    ['GAD', 1, "Sunt atât de neliniștit încât îmi e greu să stau locului."],
    ['GAD', 1, "Mă enervez ușor sau devin iritabil."],
    ['GAD', 1, "Mă tem că se poate întâmpla ceva rău."]
  ];
  // === CONFIGURARE PAGINARE ===
  const PAGE_SIZE = 6; // câte întrebări pe pagină
  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  let currentPage = 0;

  // Elemente din DOM
  const container = document.getElementById('questions-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  const resultBox = document.getElementById('result');
  const resultSummary = document.getElementById('result-summary');
  const resultMH = document.getElementById('result-mental-health');
  const resultPersonality = document.getElementById('result-personality');

  // === FUNCȚII DE RANDARE ===
  function renderLikert(name) {
    const opts = [
      [1, "Deloc"],
      [2, "Rareori"],
      [3, "Uneori"],
      [4, "Deseori"],
      [5, "Foarte des"]
    ];
    return opts.map(([val, label]) => `
      <label class="likert-option">
        <input type="radio" name="${name}" value="${val}" required>
        <span>${val} – ${label}</span>
      </label>
    `).join('');
  }

  function renderPage(page) {
    container.innerHTML = '';
    const start = page * PAGE_SIZE;
    const items = questions.slice(start, start + PAGE_SIZE);
    items.forEach((q, i) => {
      const idx = start + i + 1;
      const fieldset = document.createElement('fieldset');
      fieldset.innerHTML = `
        <legend>${idx}. ${q[2]}</legend>
        <div class="likert">${renderLikert('q'+idx)}</div>
      `;
      container.appendChild(fieldset);
    });
    prevBtn.disabled = page === 0;
    nextBtn.textContent = page === totalPages - 1 ? 'Final' : 'Înainte';
    submitBtn.style.display = page === totalPages - 1 ? 'block' : 'none';
    updateProgress(page);
  }

  function updateProgress(page) {
    const pct = Math.round(((page+1)/totalPages)*100);
    progressBar.style.width = pct + '%';
    progressText.textContent = `Pagina ${page+1} / ${totalPages}`;
  }

  // === NAVIGARE ===
  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      renderPage(currentPage);
    }
  });
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages-1) {
      currentPage++;
      renderPage(currentPage);
    }
  });
    // === SUBMIT & CALCUL SCORURI ===
  document.getElementById('test-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.target);

    // Inițializare scoruri
    let scores = {E:0,N:0,O:0,C:0,A:0,PHQ:0,GAD:0};

    // Calcul scoruri
    questions.forEach((q, i) => {
      const val = parseInt(data.get('q'+(i+1)),10);
      if (!isNaN(val)) {
        scores[q[0]] += q[1]===1 ? val : (6-val);
      }
    });

    // === INTERPRETĂRI ===
    function interpretBigFive(dim, score) {
      let level, desc, advice;
      if (score <= 20) level = "Scăzut";
      else if (score >= 40) level = "Ridicat";
      else level = "Mediu";

      switch(dim) {
        case 'E':
          desc = level==="Ridicat" ? "Ești sociabil, energic și îți place compania altora." :
                 level==="Scăzut" ? "Preferi liniștea, reflecția și grupurile mici." :
                 "Ești flexibil: te simți bine și singur, și în grup.";
          advice = level==="Ridicat" ? "Folosește-ți energia pentru a iniția proiecte de grup, dar acordă-ți și timp de odihnă." :
                   level==="Scăzut" ? "Profită de momentele de liniște pentru a-ți reîncărca bateriile, dar caută și interacțiuni plăcute." :
                   "Ai un echilibru bun între socializare și introspecție.";
          break;
        case 'N':
          desc = level==="Ridicat" ? "Resimți intens stresul și emoțiile negative." :
                 level==="Scăzut" ? "Ești calm și rezistent la stres." :
                 "Ai un echilibru emoțional moderat.";
          advice = level==="Ridicat" ? "Încearcă exerciții de respirație, mindfulness sau jurnal de recunoștință." :
                   level==="Scăzut" ? "Folosește-ți calmul pentru a-i sprijini pe ceilalți." :
                   "Ai resurse bune, dar fii atent la perioadele de stres.";
          break;
        case 'O':
          desc = level==="Ridicat" ? "Ești curios, creativ și deschis la idei noi." :
                 level==="Scăzut" ? "Preferi rutina și familiarul." :
                 "Ai un nivel moderat de deschidere.";
          advice = level==="Ridicat" ? "Explorează hobby-uri artistice sau culturale." :
                   level==="Scăzut" ? "Rutina îți oferă stabilitate, dar încearcă mici schimbări pentru varietate." :
                   "Profită de echilibrul dintre tradiție și inovație.";
          break;
        case 'C':
          desc = level==="Ridicat" ? "Ești organizat, disciplinat și orientat spre obiective." :
                 level==="Scăzut" ? "Ești spontan, dar uneori neglijezi ordinea." :
                 "Ai un echilibru între disciplină și flexibilitate.";
          advice = level==="Ridicat" ? "Folosește-ți disciplina pentru a atinge obiective mari, dar evită perfecționismul excesiv." :
                   level==="Scăzut" ? "Încearcă să-ți faci liste scurte de sarcini zilnice." :
                   "Ai un echilibru bun între planificare și spontaneitate.";
          break;
        case 'A':
          desc = level==="Ridicat" ? "Ești empatic, cooperant și ai încredere în ceilalți." :
                 level==="Scăzut" ? "Ești mai competitiv și sceptic." :
                 "Ai o abordare echilibrată între cooperare și fermitate.";
          advice = level==="Ridicat" ? "Continuă să fii sprijin pentru ceilalți, dar ai grijă să nu fii exploatat." :
                   level==="Scăzut" ? "Folosește-ți spiritul critic pentru a lua decizii bune, dar caută și colaborarea." :
                   "Ai un echilibru sănătos între empatie și fermitate.";
          break;
      }
      return {level, desc, advice};
    }

    function interpretPHQ(score) {
      if (score <= 4) return "Simptome depresive minime sau absente.";
      if (score <= 9) return "Simptome ușoare de depresie.";
      if (score <= 14) return "Simptome moderate de depresie.";
      if (score <= 19) return "Simptome moderat-severe de depresie.";
      return "Simptome severe de depresie.";
    }

    function interpretGAD(score) {
      if (score <= 4) return "Anxietate minimă.";
      if (score <= 9) return "Anxietate ușoară.";
      if (score <= 14) return "Anxietate moderată.";
      return "Anxietate severă.";
    }

    // === DICȚIONAR NUME + DEFINIȚII ===
    const traitNames = {
      E: { name: "Extroversie", def: "Tendința de a fi sociabil, energic și orientat spre exterior. Polul opus este introversia – preferința pentru liniște și activități solitare." },
      N: { name: "Nevrozism", def: "Sensibilitatea la stres și emoții negative. Persoanele cu scor scăzut sunt stabile emoțional." },
      O: { name: "Deschidere către experiențe", def: "Curiozitatea intelectuală, imaginația și aprecierea pentru noutate și artă. Polul opus este preferința pentru rutină și familiar." },
      C: { name: "Conștiinciozitate", def: "Gradul de organizare, disciplină și orientare spre obiective. Polul opus este spontaneitatea și lipsa de planificare." },
      A: { name: "Amabilitate", def: "Tendința de a fi empatic, cooperant și înțelegător. Polul opus este competitivitatea și scepticismul față de ceilalți." }
    };

    // === AFIȘARE RAPORT ===
    resultSummary.innerHTML = `
      <h2>Rezumat general</h2>
      <p>Ai completat testul cu succes. Rezultatele de mai jos îți oferă o imagine de ansamblu asupra personalității și stării tale emoționale.</p>
    `;

    // Big Five
    resultPersonality.innerHTML = '<h3>Personalitate (Big Five)</h3>';
    ['E','N','O','C','A'].forEach(dim => {
      const {level, desc, advice} = interpretBigFive(dim, scores[dim]);
      const pct = Math.min(100, Math.round((scores[dim]/50)*100));
      const block = document.createElement('div');
      block.className = 'trait-result';
      block.innerHTML = `
        <h4>${traitNames[dim].name} – Scor: ${scores[dim]} (${level})</h4>
        <p><em>${traitNames[dim].def}</em></p>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <p>${desc}</p>
        <p><strong>Sugestii:</strong> ${advice}</p>
      `;
      resultPersonality.appendChild(block);
    });

    // PHQ-9 & GAD-7
    resultMH.innerHTML = `
      <h3>Sănătate emoțională</h3>
      <div class="trait-result">
        <h4>Depresie (PHQ-9): scor ${scores.PHQ}</h4>
        <p>${interpretPHQ(scores.PHQ)}</p>
      </div>
      <div class="trait-result">
        <h4>Anxietate (GAD-7): scor ${scores.GAD}</h4>
        <p>${interpretGAD(scores.GAD)}</p>
      </div>
    `;

    resultBox.style.display = 'block';
    resultBox.scrollIntoView({behavior:'smooth'});
  });

  // === PORNIRE ===
  renderPage(currentPage);
});
