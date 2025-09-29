document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. DATA: Întrebări reduse la 75 (12 per Big Five + 15 MH standardizate)
    // ----------------------------------------------------------------------
    const questions = [
        // Extroversie (E) - 12 întrebări
        ['E', 1, "Mă simt confortabil să vorbesc cu străini."],
        ['E', -1, "Prefer să petrec timpul singur decât în grupuri mari."],
        // ... (10 more questions for E)
        // Nevrozism (N) - 12 întrebări
        ['N', 1, "Mă îngrijorez ușor pentru lucruri mărunte."],
        ['N', -1, "Sunt calm în majoritatea situațiilor."],
        // ... (10 more questions for N)
        // Deschidere (O) - 12 întrebări
        ['O', 1, "Îmi place să explorez idei noi și neobișnuite."],
        ['O', -1, "Prefer rutina și familiaritatea."],
        // ... (10 more questions for O)
        // Conștiinciozitate (C) - 12 întrebări
        ['C', 1, "Sunt o persoană organizată și planific totul din timp."],
        ['C', -1, "Am tendința de a amâna lucrurile importante."],
        // ... (10 more questions for C)
        // Amabilitate (A) - 12 întrebări
        ['A', 1, "Îmi pasă de sentimentelor altora și îi ajut când pot."],
        ['A', -1, "Mă concentrez mai mult pe nevoile mele decât ale altora."],
        // ... (10 more questions for A)
        // Sănătate Mintală (MH) - 15 întrebări bazate pe PHQ-9 și GAD-7
        ['MH', 1, "În ultimele 2 săptămâni, m-am simțit pesimist sau fără speranță."],
        ['MH', 1, "Am avut dificultăți în a mă bucura de activități care îmi plac."],
        // ... (13 more questions for MH)
    ];

    const questionsContainer = document.getElementById('questions-container');
    const form = document.getElementById('test-form');
    const resultDiv = document.getElementById('result');
    const resultPersonalityDiv = document.getElementById('result-personality');
    const resultMentalHealthDiv = document.getElementById('result-mental-health');
    const progressBar = document.getElementById('progress-bar');

    // Progress: actualizează bara la fiecare întrebare
    function updateProgress(current, total) {
        const progress = (current / total) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Generare întrebări
    function generateQuestionsHTML() {
        let currentSection = '';
        questions.forEach((q, index) => {
            const [dimension, scoringType, text] = q;
            const qNum = index + 1;
            const inputName = `q${qNum}`;

            // Secțiuni
            if (dimension === 'E' && currentSection !== 'BigFive') {
                sectionTitle = '<h2>Secțiunea I: Trăsături de Personalitate (Big Five)</h2>';
                currentSection = 'BigFive';
            } else if (dimension === 'MH' && currentSection !== 'MH') {
                sectionTitle = '<h2>Secțiunea II: Stare Emoțională și Sănătate Mintală</h2><p>Aceste întrebări vizează starea ta din ultimele două săptămâni.</p>';
                currentSection = 'MH';
            }
            
            if (sectionTitle) {
                 const titleBlock = document.createElement('div');
                 titleBlock.innerHTML = sectionTitle;
                 questionsContainer.appendChild(titleBlock);
            }

            const qBlock = document.createElement('div');
            qBlock.className = 'question-block';
            
            let html = `<p>${qNum}. ${text}</p>`;
            for (let i = 1; i <= 5; i++) {
                html += `<label><input type="radio" name="${inputName}" value="${i}" required> ${i}</label>`;
            }
            
            qBlock.innerHTML = html;
            questionsContainer.appendChild(qBlock);

            // Actualizează progress bar
            updateProgress(qNum, questions.length);
        });
    }

    // Scorare și norme (exemplu cu norme ipotetice)
    const norms = {
        E: { mean: 50, sd: 10 },
        N: { mean: 45, sd: 12 },
        O: { mean: 48, sd: 9 },
        C: { mean: 52, sd: 11 },
        A: { mean: 49, sd: 10 }
    };

    function calculatePercentile(score, mean, sd) {
        // Calcul simplist pentru exemplu; în practică, folosești tabele de norme
        const z = (score - mean) / sd;
        return Math.round((0.5 * (1 + erf(z / Math.sqrt(2)))) * 100);
    }

    // Funcție ERF pentru distribuție normală (simplificată)
    function erf(x) {
        const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
        const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
        const t = 1 / (1 + p * Math.abs(x));
        const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return x >= 0 ? y : -y;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let scores = { E: 0, N: 0, O: 0, C: 0, A: 0, MH: 0 };
        
        // Scorare
        questions.forEach((q, index) => {
            const [dimension, scoringType] = q;
            const inputName = `q${index + 1}`;
            const selected = form.elements[inputName].value;
            if (!selected) return;
            let value = parseInt(selected);
            scores[dimension] += scoringType === 1 ? value : (6 - value);
        });

        // Raport Sănătate Mintală
        const mhScore = scores.MH;
        let mhLevel = '';
        let mhText = '';
        let mhClass = '';
        if (mhScore <= 20) {
            mhLevel = 'Scăzut';
            mhClass = 'mh-low';
            mhText = 'Scorul tău indică o stare emoțională bună. Continuă să practici obiceuri sănătoase.';
        } else if (mhScore <= 35) {
            mhLevel = 'Moderat';
            mhClass = 'mh-moderate';
            mhText = 'Simți semne de stres sau anxietate. Încearcă tehnici de relaxare sau vorbește cu un prieten.';
        } else {
            mhLevel = 'Ridicat';
            mhClass = 'mh-high';
            mhText = 'Scorul tău indică un disconfort emoțional semnificativ. **Recomandare:** Consultează un specialist (psiholog, medic).';
        }
        resultMentalHealthDiv.innerHTML = `
            <h3>Evaluarea Stării Emoționale (Scor: ${mhScore} / 75)</h3>
            <div class="${mhClass}">
                <p><strong>Nivel: ${mhLevel}</strong></p>
                <p>${mhText}</p>
            </div>
        `;

        // Raport Big Five cu percentile
        let finalReport = "";
        function interpretScore(dimension, score) {
            const percentile = calculatePercentile(score, norms[dimension].mean, norms[dimension].sd);
            let level = score <= 30 ? "SCĂZUT" : score >= 60 ? "RIDICAT" : "MEDIU";
            let description = "";
            switch (dimension) {
                case 'E': 
                    description = level === "RIDICAT" ? "Ești extrovertit: sociabil, energic și îți place compania." : 
                                  level === "SCĂZUT" ? "Ești introvertit: preferi liniștea și reflecția." : 
                                  "Echi librat între socializare și timp singur.";
                    break;
                // ... (alte descrieri)
            }
            finalReport += `
                <div class="trait-result">
                    <strong>${getDimensionName(dimension)}: ${score} / 75 (percentila ${percentile}%)</strong>
                    <p>${description}</p>
                </div>
            `;
        }

        interpretScore('E', scores.E);
        interpretScore('N', scores.N);
        interpretScore('O', scores.O);
        interpretScore('C', scores.C);
        interpretScore('A', scores.A);

        resultPersonalityDiv.innerHTML = finalReport;
        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    });

    generateQuestionsHTML();
});
