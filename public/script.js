document.addEventListener('DOMContentLoaded', () => {
  // Întrebări demo (poți extinde lista până la 90)
  const questions = [
    ['E', 1, "Îmi place să fiu în centrul atenției."],
    ['E', -1, "Prefer liniștea și singurătatea."],
    ['N', 1, "Mă îngrijorez des."],
    ['N', -1, "Sunt calm și relaxat."],
    ['MH', 1, "Mă simt lipsit de speranță."],
    ['MH', 1, "Am probleme cu somnul."]
  ];

  const PAGE_SIZE = 3; // câte întrebări pe pagină
  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  let currentPage = 0;

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

  // generează opțiunile Likert
  function renderLikert(name) {
    const opts = [
      [1, "Dezacord total"],
      [2, "Dezacord"],
      [3, "Neutru"],
      [4, "Acord"],
      [5, "Acord total"]
    ];
    return opts.map(([val, label]) => `
      <label class="likert-option">
        <input type="radio" name="${name}" value="${val}" required>
        <span>${val} – ${label}</span>
      </label>
    `).join('');
  }

  // randare pagină
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

  // actualizare progres
  function updateProgress(page) {
    const pct = Math.round(((page+1)/totalPages)*100);
    progressBar.style.width = pct + '%';
    progressText.textContent = `Pagina ${page+1} / ${totalPages}`;
  }

  // navigare
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

  // submit
  document.getElementById('test-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.target);
    let scores = {E:0,N:0,O:0,C:0,A:0,MH:0};
    questions.forEach((q, i) => {
      const val = parseInt(data.get('q'+(i+1)),10);
      if (!isNaN(val)) {
        scores[q[0]] += q[1]===1 ? val : (6-val);
      }
    });

    // afișare rezultate simple
    resultSummary.innerHTML = `<p><strong>Scoruri brute:</strong> ${JSON.stringify(scores)}</p>`;
    resultMH.innerHTML = `<p><strong>MH Score:</strong> ${scores.MH}</p>`;
    resultPersonality.innerHTML = `
      <div class="trait-result">Extroversie: ${scores.E}</div>
      <div class="trait-result">Nevrozism: ${scores.N}</div>
    `;

    resultBox.style.display = 'block';
    resultBox.scrollIntoView({behavior:'smooth'});
  });

  // inițializare
  renderPage(currentPage);
});
