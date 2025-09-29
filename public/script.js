document.addEventListener('DOMContentLoaded', () => {
  // 1) Întrebări: 90 (Big Five 75 + MH 15)
  // Format: [Dimensiune (E/N/O/C/A/MH), Tip Scorare (1 = direct, -1 = invers), Text]
  const questions = [
    // Extroversie (E)
    ['E', 1, "Mă simt confortabil să fiu în centrul atenției la o petrecere."],
    ['E', -1, "Mă retrag din situațiile sociale și prefer să fiu singur."],
    ['E', 1, "Sunt o persoană plină de energie și entuziasm."],
    ['E', -1, "Îmi place să lucrez singur, în liniște, fără întreruperi."],
    ['E', 1, "Mă bucur să inițiez conversații cu străini."],
    ['E', -1, "Sunt rezervat și nu vorbesc mult în preajma necunoscuților."],
    ['E', 1, "Sunt adesea descris ca fiind sufletul petrecerii."],
    ['E', -1, "Evit să particip la adunări sau evenimente sociale mari."],
    ['E', 1, "Sunt asertiv și îmi spun părerea fără teamă."],
    ['E', -1, "Mă gândesc mult înainte de a vorbi."],
    ['E', 1, "Îmi place să acționez și să iau decizii rapid."],
    ['E', -1, "Sunt adesea obosit după interacțiuni sociale lungi."],
    ['E', 1, "Sunt ușor de distrat și sociabil."],
    ['E', -1, "Nu-mi place să fiu deranjat de alții."],
    ['E', 1, "Caut emoția și aventura în viață."],

    // Nevrozism (N)
    ['N', -1, "În general, sunt o persoană calmă și rareori mă îngrijorez."],
    ['N', 1, "Mă enervez ușor și sunt sensibil la stres."],
    ['N', 1, "Îmi fac griji pentru lucruri mărunte."],
    ['N', -1, "Sunt stabil emoțional și îmi revin ușor după eșecuri."],
    ['N', 1, "Mă simt adesea copleșit de situații."],
    ['N', -1, "Sunt relaxat și mă descurc bine sub presiune."],
    ['N', 1, "Mă simt trist sau deprimat adesea."],
    ['N', 1, "Mă simt inconfortabil în legătură cu viitorul."],
    ['N', -1, "Nu mă simt niciodată stresat sau anxios."],
    ['N', 1, "Am schimbări de dispoziție frecvente."],
    ['N', 1, "Mă îngrijorez că lucrurile ar putea merge prost."],
    ['N', -1, "Pot rămâne calm într-o situație tensionată."],
    ['N', 1, "Mă îndoiesc de capacitățile mele."],
    ['N', 1, "Sunt ușor de speriat."],
    ['N', -1, "Sunt fericit și mulțumit de mine."],

    // Deschidere (O)
    ['O', 1, "Îmi place să petrec timp gândindu-mă la idei abstracte și concepte."],
    ['O', -1, "Nu îmi place să-mi pierd timpul visând cu ochii deschiși."],
    ['O', 1, "Sunt fascinat de artă și frumusețe."],
    ['O', -1, "Prefer rutina și să fac lucrurile în mod tradițional."],
    ['O', 1, "Am o imaginație activă și bogată."],
    ['O', 1, "Sunt deschis la nou și îmi place să încerc lucruri noi."],
    ['O', -1, "Mă plictisesc repede de discuțiile filozofice."],
    ['O', 1, "Îmi place să explorez idei neconvenționale."],
    ['O', 1, "Apreciez experiențele culturale și diverse."],
    ['O', -1, "Mă concentrez doar pe fapte și realități concrete."],
    ['O', 1, "Sunt o persoană creativă."],
    ['O', -1, "Nu sunt interesat de teorii complexe."],
    ['O', 1, "Îmi place să am o gamă largă de interese."],
    ['O', -1, "Mă simt bine în mediul meu familiar și sigur."],
    ['O', 1, "Sunt mereu în căutarea cunoștințelor."],

    // Conștiinciozitate (C)
    ['C', 1, "Sunt o persoană organizată și planific din timp."],
    ['C', -1, "Am tendința de a amâna lucrurile și de a le lăsa neterminate."],
    ['C', 1, "Sunt de încredere și îmi respect promisiunile."],
    ['C', -1, "Sunt destul de neglijent și dezordonat."],
    ['C', 1, "Muncesc din greu pentru a-mi atinge obiectivele."],
    ['C', -1, "Nu mă deranjează să nu-mi termin treaba uneori."],
    ['C', 1, "Sunt disciplinat și controlat."],
    ['C', -1, "Sunt impulsiv și acționez fără să mă gândesc."],
    ['C', 1, "Sunt atent la detalii și îmi verific munca de două ori."],
    ['C', -1, "Îmi place să fiu spontan și nu mă țin de un program strict."],
    ['C', 1, "Sunt productiv și eficient."],
    ['C', -1, "Nu sunt întotdeauna gata când trebuie să fiu."],
    ['C', 1, "Mă concentrez pe sarcini până la finalizare."],
    ['C', -1, "Am dificultăți în a urma regulile."],
    ['C', 1, "Îmi păstrez mediul curat și ordonat."],

    // Amabilitate (A)
    ['A', 1, "Am o natură blândă și sunt înclinat să-i iert pe ceilalți."],
    ['A', -1, "Critica pe care o primesc mă irită și nu sunt mereu de acord cu ceilalți."],
    ['A', 1, "Mă gândesc la sentimentele altora."],
    ['A', -1, "Nu mă interesează problemele altora."],
    ['A', 1, "Sunt politicos cu toată lumea pe care o întâlnesc."],
    ['A', -1, "Îmi place să-mi bat joc de alții uneori."],
    ['A', 1, "Am încredere în oameni."],
    ['A', -1, "Sunt suspicios în legătură cu intențiile altora."],
    ['A', 1, "Sunt dornic să ajut."],
    ['A', -1, "Am o fire certăreață."],
    ['A', 1, "Sunt cooperant și îmi place să lucrez în echipă."],
    ['A', -1, "Nu pierd timpul cu „a face pe plac” altora."],
    ['A', 1, "Sunt empatic și simt ceea ce simt ceilalți."],
    ['A', -1, "Mă folosesc de alții în interes propriu."],
    ['A', 1, "Îmi place să fac acte de caritate."],

    // Sănătate mintală (MH)
    ['MH', 1, "Mă simt lipsit de speranță în legătură cu viitorul meu."],
    ['MH', 1, "Mi-am pierdut interesul sau plăcerea de a face lucruri."],
    ['MH', 1, "Mă simt obosit sau am puțină energie în cea mai mare parte a timpului."],
    ['MH', 1, "Am probleme cu somnul (adormire, menținerea somnului, sau dorm prea mult)."],
    ['MH', 1, "Am dificultăți în a mă concentra la locul de muncă sau la școală."],
    ['MH', 1, "Mă simt iritabil sau nerăbdător în majoritatea zilelor."],
    ['MH', 1, "Mă simt neliniștit sau nu pot sta liniștit."],
    ['MH', 1, "Mă critic sever sau mă simt vinovat pentru lucruri."],
    ['MH', -1, "Mă simt, în general, mulțumit și fericit cu viața mea."],
    ['MH', 1, "Mă tem adesea de lucruri care, în mod normal, nu ar trebui să mă sperie."],
    // Item sensibil — îl vom trata special (nu obligatoriu, mesaj dedicat)
    ['MH', 1, "Am simțit că aș fi mai bine mort sau m-am gândit să mă rănesc."],
    ['MH', -1, "Am reușit să fac față problemelor în mod eficient."],
    ['MH', 1, "Am avut dificultăți în a mă bucura de timpul petrecut cu familia sau prietenii."],
    ['MH', 1, "Mă simt izolat, chiar și atunci când sunt înconjurat de oameni."],
    ['MH', -1, "Am avut un nivel stabil de energie în ultimele săptămâni."]
  ];

  const PAGE_SIZE = 15;
  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  let currentPage = 0;

  const questionsContainer = document.getElementById('questions-container');
  const form = document.getElementById('test-form');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  const resultDiv = document.getElementById('result');
  const resultSummaryDiv = document.getElementById('result-summary');
  const resultPersonalityDiv = document.getElementById('result-personality');
  const resultMentalHealthDiv = document.getElementById('result-mental-health');

  // Save/load answers local (fără item sensibil)
  function saveAnswer(name, val) {
    try {
      const idx = parseInt(name.replace('q',''), 10) - 1;
      const text = questions[idx][2] || '';
      const isSensitive = text.includes('mai bine mort') || text.includes('m-am gândit să mă rănesc');
      if (isSensitive) return; // nu salvăm local itemul sensibil
      const data = JSON.parse(localStorage.getItem('answers') || '{}');
      data[name] = val;
      localStorage.setItem('answers', JSON.stringify(data));
    } catch {}
  }
  function loadAnswers() {
    try {
      return JSON.parse(localStorage.getItem('answers') || '{}');
    } catch { return {}; }
  }
  const storedAnswers = loadAnswers();

  function renderLikert(name, required = true) {
    const options = [
      { val: 1, label: 'Dezacord total' },
      { val: 2, label: 'Dezacord' },
      { val: 3, label: 'Neutru' },
      { val: 4, label: 'Acord' },
      { val: 5, label: 'Acord total' },
    ];
    return options.map(o => {
      const checked = storedAnswers[name] && parseInt(storedAnswers[name], 10) === o.val ? 'checked' : '';
      return `
        <label class="likert-option">
          <input type="radio" name="${name}" value="${o.val}" ${required ? 'required' : ''} ${checked} />
          <span class="option-text">${o.val} – ${o.label}</span>
        </label>
      `;
    }).join('');
  }

  function getSectionTitle(dimension) {
    if (dimension === 'E') {
      return '<h2 class="section-title">Secțiunea I: Trăsături de Personalitate (Big Five)</h2>';
    }
    if (dimension === 'MH') {
      return '<h2 class="section-title">Secțiunea II: Stare Emoțională (ultimele 2 săptămâni)</h2><p>Răspunde sincer. Unele întrebări pot fi sensibile.</p>';
    }
    return '';
  }

  function renderPage(pageIndex) {
    questionsContainer.innerHTML = '';
    const start = pageIndex * PAGE_SIZE;
    const pageItems = questions.slice(start, start + PAGE_SIZE);

    // Section titles when first time entering a section
    const firstDim = pageItems[0][0];
    const sectionTitle = getSectionTitle(firstDim);
    if (sectionTitle) {
      const titleBlock = document.createElement('div');
      titleBlock.innerHTML = sectionTitle;
      questionsContainer.appendChild(titleBlock);
    }

    pageItems.forEach((q, localIdx) => {
      const globalIdx = start + localIdx;
      const [dimension, scoringType, text] = q;
      const inputName = `q${globalIdx + 1}`;

      const fieldset = document.createElement('fieldset');
      fieldset.className = 'question-block';
      const isSensitive = text.includes('mai bine mort') || text.includes('m-am gândit să mă rănesc');

      // Item sensibil: îl facem opțional (fără required), plus microcopy
      const required = !isSensitive;

      fieldset.innerHTML = `
        <legend><span class="q-number">${globalIdx + 1}.</span> ${text}</legend>
        ${isSensitive ? '<p style="margin-top:4px;color:#6c757d;font-size:0.93em;">Poți sări peste această întrebare dacă nu dorești să răspunzi.</p>' : ''}
        <div class="likert">${renderLikert(inputName, required)}</div>
      `;
      questionsContainer.appendChild(fieldset);
    });

    updateNav(pageIndex);
    updateProgress(pageIndex);
    toggleSubmit(pageIndex);
    attachAnswerListeners();
  }

  function attachAnswerListeners() {
    const inputs = questionsContainer.querySelectorAll('input[type="radio"]');
    inputs.forEach(inp => {
      inp.addEventListener('change', (e) => {
        saveAnswer(e.target.name, e.target.value);
      });
    });
  }

  function updateNav(pageIndex) {
    prevBtn.disabled = pageIndex === 0;
    nextBtn.textContent = pageIndex === (totalPages - 1) ? 'Vezi rezultatul' : 'Înainte';
  }

  function updateProgress(pageIndex) {
    const pct = Math.round(((pageIndex + 1) / totalPages) * 100);
    progressBar.style.width = `${pct}%`;
    progressText.textContent = `Pagina ${pageIndex + 1} / ${totalPages}`;
  }

  function toggleSubmit(pageIndex) {
    submitBtn.style.display = pageIndex === (totalPages - 1) ? 'block' : 'none';
  }

  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      renderPage(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      renderPage(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      form.requestSubmit();
    }
  });

  function getDimensionName(dim) {
    switch (dim) {
      case 'E': return 'Extroversie';
      case 'N': return 'Nevrozism (Stabilitate emoțională)';
      case 'O': return 'Deschidere către experiențe';
      case 'C': return 'Conștiinciozitate';
      case 'A': return 'Amabilitate';
      default: return dim;
    }
  }

  // Scorare + interpretare
  function toPercentile(score, min = 15, max = 75) {
    const norm = Math.min(1, Math.max(0, (score - min) / (max - min)));
    return Math.round(norm * 100);
  }

  function interpretBigFive(dimension, score) {
    let level;
    if (score <= 30) level = 'Scăzut';
    else if (score >= 60) level = 'Ridicat';
    else level = 'Mediu';

    let desc = '';
    switch (dimension) {
      case 'E':
        desc = level === 'Ridicat' ? "Ești energic, sociabil și asertiv." :
               level === 'Scăzut' ? "Preferi liniștea, reflecția și interacțiunile mai restrânse." :
               "Ești flexibil: te adaptezi atât la social, cât și la momente de solitudine.";
        break;
      case 'N':
        desc = level === 'Ridicat' ? "Poți resimți intens stresul, îngrijorarea și fluctuațiile emoționale." :
               level === 'Scăzut' ? "Ești calm, rezistent la stres și te refaci rapid după dificultăți." :
               "Ești, în general, echilibrat, cu stres ocazional în situații dificile.";
        break;
      case 'O':
        desc = level === 'Ridicat' ? "Ești curios, creativ și deschis la idei noi și experiențe variate." :
               level === 'Scăzut' ? "Preferi rutina și concretența, apreciezi familiarul." :
               "Ești deschis moderat: explorezi noul, menținând însă ancore familiare.";
        break;
      case 'C':
        desc = level === 'Ridicat' ? "Ești organizat, disciplinat și orientat spre obiective." :
               level === 'Scăzut' ? "Ești spontan, dar poți întârzia sarcini sau neglija ordinea." :
               "Ești, în general, responsabil, cu spațiu pentru flexibilitate.";
        break;
      case 'A':
        desc = level === 'Ridicat' ? "Ești empatic, cooperant și înclinat să ai încredere." :
               level === 'Scăzut' ? "Ești mai sceptic și competitiv, îți susții ferm punctul de vedere." :
               "Ești cooperant, păstrând o abordare echilibrată și critică.";
        break;
    }
    return { level, desc };
  }

  function safetyBlockIfNeeded(answers) {
    // Căutăm itemul sensibil (text conține 'mai bine mort' sau 'm-am gândit să mă rănesc')
    const idx = questions.findIndex(q => q[2].includes('mai bine mort') || q[2].includes('m-am gândit să mă rănesc'));
    if (idx >= 0) {
      const key = `q${idx + 1}`;
      const valStr = answers[key];
      if (!valStr) return '';
      const val = parseInt(valStr, 10);
      if (val >= 4) {
        return `
          <div class="mh-high" role="alert" style="margin-top:12px;">
            <p><strong>Ai indicat gânduri foarte dificile.</strong> Nu ești singur. Poate fi util să vorbești cu un specialist sau o persoană de încredere.</p>
            <p>Dacă simți că ești în pericol, caută ajutor imediat la serviciile de urgență din zona ta.</p>
          </div>
        `;
      }
    }
    return '';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Colectăm răspunsurile
    const answers = {};
    for (let i = 0; i < questions.length; i++) {
      const name = `q${i + 1}`;
      const field = form.elements[name];
      if (!field) continue;
      const val = field.value;
      if (val) answers[name] = val;
    }

    // Validare minimală: toate în afară de itemul sensibil trebuie completate
    const missing = [];
    for (let i = 0; i < questions.length; i++) {
      const [_, __, text] = questions[i];
      const name = `q${i + 1}`;
      const isSensitive = text.includes('mai bine mort') || text.includes('m-am gândit să mă rănesc');
      if (!answers[name] && !isSensitive) missing.push(i + 1);
    }
    if (missing.length > 0) {
      alert(`Mai ai întrebări fără răspuns: ${missing.slice(0,5).join(', ')}${missing.length>5?' ...':''}`);
      return;
    }

    // Scorare
    let scores = { E: 0, N: 0, O: 0, C: 0, A: 0, MH: 0 };
    questions.forEach((q, index) => {
      const [dimension, scoringType] = q;
      const name = `q${index + 1}`;
      const valStr = answers[name];
      if (!valStr) return;
      let value = parseInt(valStr, 10);
      if (scoringType === 1) {
        scores[dimension] += value;
      } else {
        scores[dimension] += (6 - value);
      }
    });

    // MH parsing
    const mhScore = scores.MH;
    let mhLevel = '';
    let mhText = '';
    let mhClass = '';

    if (mhScore <= 35) {
      mhLevel = 'Scăzut';
      mhClass = 'mh-low';
      mhText = 'Scorul tău sugerează o stare emoțională bună. Ai reziliență și nu prezinți multe semne de disconfort.';
    } else if (mhScore <= 55) {
      mhLevel = 'Moderat';
      mhClass = 'mh-moderate';
      mhText = 'Scorul indică un nivel moderat de stres, anxietate sau disconfort. Ia în considerare strategii de gestionare a stresului.';
    } else {
      mhLevel = 'Ridicat';
      mhClass = 'mh-high';
      mhText = 'Scorul este ridicat, sugerând simptome semnificative de disconfort emoțional. Acesta nu este un diagnostic. Este recomandat sprijin profesional (psiholog/medic).';
    }

    const safetyMsg = safetyBlockIfNeeded(answers);
    const mhReport = `
      <div class="${mhClass}">
        <p><strong>MH Score: ${mhScore} / 75 — Nivel: ${mhLevel}</strong></p>
        <p>${mhText}</p>
        ${safetyMsg}
      </div>
    `;
    resultMentalHealthDiv.innerHTML = mhReport;

    // Big Five report
    resultPersonalityDiv.innerHTML = '';
    ['E','N','O','C','A'].forEach(dim => {
      const score = scores[dim];
      const pct = toPercentile(score);
      const { level, desc } = interpretBigFive(dim, score);
      const block = document.createElement('div');
      block.className = 'trait-result';
      block.innerHTML = `
        <div class="trait-header">
          <div class="trait-name">${getDimensionName(dim)}</div>
          <div class="trait-score">${score} / 75 (${level})</div>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;"></div></div>
        <div class="percentile">Percentilă aproximativă: ~${pct}%</div>
        <p style="margin-top:8px;">${desc}</p>
      `;
      resultPersonalityDiv.appendChild(block);
    });

    // Summary
    const topTrait = Object.entries(scores)
      .filter(([k]) => k !== 'MH')
      .sort((a, b) => b[1] - a[1])[0];
    const lowTrait = Object.entries(scores)
      .filter(([k]) => k !== 'MH')
      .sort((a, b) => a[1] - b[1])[0];

    resultSummaryDiv.innerHTML = `
      <p><strong>Pe scurt:</strong> Cea mai pronunțată trăsătură este ${getDimensionName(topTrait[0]).toLowerCase()} (${topTrait[1]}), iar cea mai redusă este ${getDimensionName(lowTrait[0]).toLowerCase()} (${lowTrait[1]}). </p>
      <p>Starea emoțională generală: nivel <strong>${mhLevel.toLowerCase()}</strong> (MH ${mhScore}/75).</p>
    `;

    resultDiv.style.display = 'block';
    resultDiv.focus();
    resultDiv.scrollIntoView({ behavior: 'smooth' });
  });

  // Init
  renderPage(currentPage);
});
