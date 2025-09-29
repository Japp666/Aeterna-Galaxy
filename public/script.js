document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. DATA: Cele 90 de Întrebări (15 per Dimensiune Big Five + 15 MH)
    // Format: [Dimensiune (E/N/O/C/A/MH), Tip Scorare (1 = Direct, -1 = Invers), Întrebarea]
    // ----------------------------------------------------------------------
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
        ['C', 1, "Mă pot lăuda că sunt o persoană foarte organizată și planific totul din timp."],
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
        ['A', -1, "Nu pierd timpul cu \"a face pe plac\" altora."],
        ['A', 1, "Sunt empatic și simt ceea ce simt ceilalți."],
        ['A', -1, "Mă folosesc de alții în interes propriu."],
        ['A', 1, "Îmi place să fac acte de caritate."],

        // Sănătate Mintală (Mental Health - MH) - 15 întrebări suplimentare, scorare directă
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
        ['MH', 1, "Am simțit că aș fi mai bine mort sau m-am gândit să mă rănesc."],
        ['MH', -1, "Am reușit să fac față problemelor în mod eficient."],
        ['MH', 1, "Am avut dificultăți în a mă bucura de timpul petrecut cu familia sau prietenii."],
        ['MH', 1, "Mă simt izolat, chiar și atunci când sunt înconjurat de oameni."],
        ['MH', -1, "Am avut un nivel stabil de energie în ultimele săptămâni."] 
    ];

    const questionsContainer = document.getElementById('questions-container');
    const form = document.getElementById('test-form');
    const resultDiv = document.getElementById('result');
    const resultPersonalityDiv = document.getElementById('result-personality');
    const resultMentalHealthDiv = document.getElementById('result-mental-health');

    // Funcția de generare a întrebărilor în HTML
    function generateQuestionsHTML() {
        let currentSection = '';
        questions.forEach((q, index) => {
            const [dimension, scoringType, text] = q;
            const qNum = index + 1;
            const inputName = `q${qNum}`;

            let sectionTitle = '';
            if (dimension === 'E' && currentSection !== 'BigFive') {
                sectionTitle = '<h2>Secțiunea I: Trăsături de Personalitate (Big Five)</h2>';
                currentSection = 'BigFive';
            } else if (dimension === 'MH' && currentSection !== 'MH') {
                sectionTitle = '<h2>Secțiunea II: Stare Emoțională și Sănătate Mintală</h2><p>Aceste întrebări vizează starea ta din ultimele două săptămâni. Te rugăm să răspunzi cât mai sincer.</p>';
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
            
            // Scală Likert de la 1 la 5
            for (let i = 1; i <= 5; i++) {
                html += `<label><input type="radio" name="${inputName}" value="${i}" required> ${i}</label>`;
            }
            
            qBlock.innerHTML = html;
            questionsContainer.appendChild(qBlock);
        });
    }

    // Funcția utilitară pentru a afișa numele complet al dimensiunii
    function getDimensionName(dim) {
        switch (dim) {
            case 'E': return 'Extroversie';
            case 'N': return 'Nevrozism (Stabilitate Emoțională)';
            case 'O': return 'Deschidere către Experiențe';
            case 'C': return 'Conștiinciozitate';
            case 'A': return 'Amabilitate';
            default: return dim;
        }
    }
    
    // Logica de Scorare și Afișare Rezultate
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        let scores = { E: 0, N: 0, O: 0, C: 0, A: 0, MH: 0 };
        
        // Algoritmul de Scorare
        questions.forEach((q, index) => {
            const [dimension, scoringType] = q;
            const inputName = `q${index + 1}`;
            
            const selected = form.elements[inputName].value;
            if (!selected) return; 
            
            let value = parseInt(selected);
            
            if (scoringType === 1) {
                // Scorare Directă (1=1, 5=5)
                scores[dimension] += value;
            } else {
                // Scorare Inversă (1=5, 5=1) -> se calculează ca 6 - valoarea selectată
                scores[dimension] += (6 - value);
            }
        });

        // ----------------------------------------------------------------------
        // RAPORT I: SĂNĂTATE MINTALĂ (MH)
        // ----------------------------------------------------------------------
        const mhScore = scores.MH;
        // Punctajele pentru cele 15 întrebări (min 15, max 75)
        let mhLevel = '';
        let mhText = '';
        let mhClass = '';

        if (mhScore <= 35) {
            mhLevel = 'Scăzut';
            mhClass = 'mh-low';
            mhText = 'Scorul tău indică, în general, o stare emoțională bună. Ai o reziliență solidă și nu prezinți un nivel ridicat de simptome de disconfort emoțional.';
        } else if (mhScore <= 55) {
            mhLevel = 'Moderat';
            mhClass = 'mh-moderate';
            mhText = 'Scorul tău indică un nivel moderat de stres, anxietate sau disconfort emoțional. Este important să acorzi mai multă atenție acestor sentimente și să implementezi strategii de gestionare a stresului.';
        } else {
            mhLevel = 'Ridicată';
            mhClass = 'mh-high';
            mhText = 'Scorul tău este ridicat, ceea ce sugerează prezența unui nivel semnificativ de simptome de disconfort emoțional (depresie, anxietate, etc.). **Acesta nu este un diagnostic medical.** Este O RECOMANDARE PUTERNICĂ de a căuta sprijin profesional (psiholog, terapeut sau medic).';
        }

        const mhReport = `
            <h3>Evaluarea Stării Emoționale (MH Score: ${mhScore} / 75)</h3>
            <div class="${mhClass}">
                <p><strong>Nivelul de Simptome Emoționale (Depresie/Anxietate): ${mhLevel}</strong></p>
                <p>${mhText}</p>
            </div>
        `;
        resultMentalHealthDiv.innerHTML = mhReport;


        // ----------------------------------------------------------------------
        // RAPORT II: BIG FIVE (PERSONALITATE)
        // ----------------------------------------------------------------------
        let finalReport = "";
        
        function interpretScore(dimension, score) {
            // Puncte de referință (pentru 15 întrebări): Low: 15-30, Medium: 31-59, High: 60-75
            
            let level;
            let description;

            if (score <= 30) {
                level = "SCĂZUT";
            } else if (score >= 60) {
                level = "RIDICAT";
            } else {
                level = "MEDIU";
            }
            
            switch (dimension) {
                case 'E': 
                    description = level === "RIDICAT" ? "Ești **Extrovertit**: energic, sociabil și asertiv. Ești motivat de interacțiunea cu ceilalți." :
                                  level === "SCĂZUT" ? "Ești **Introvertit**: rezervat, îți place timpul singur și reflectezi mult. Ești motivat de lumea interioară." :
                                  "Ești **Ambi-vertit**: echilibrat, te poți adapta atât la situații sociale, cât și la cele de solitudine.";
                    break;
                case 'N': 
                    description = level === "RIDICAT" ? "**Instabilitate Emoțională**: Predispus la anxietate, îngrijorare și schimbări de dispoziție. Poți fi sensibil la stres." :
                                  level === "SCĂZUT" ? "**Stabilitate Emoțională**: Ești calm, rezistent la stres și rar te simți copleșit." :
                                  "Stabilitate Medie: Ești, în general, stabil, dar resimți stres și îngrijorare în situații dificile.";
                    break;
                case 'O': 
                    description = level === "RIDICAT" ? "Ai **Deschidere Ridicată**: Ești creativ, curios, artistic și deschis la idei abstracte și neconvenționale." :
                                  level === "SCĂZUT" ? "Ai **Deschidere Scăzută**: Preferi rutina, ești mai puțin interesat de artă sau filozofie și te axezi pe lucruri concrete și tradiționale." :
                                  "Ai Deschidere Medie: Explorezi idei noi, dar apreciezi și familiaritatea.";
                    break;
                case 'C': 
                    description = level === "RIDICAT" ? "**Conștiincios**: Ești extrem de organizat, de încredere, disciplinat și orientat spre obiective. Ești foarte responsabil." :
                                  level === "SCĂZUT" ? "**Flexibil/Spontan**: Ești mai spontan, dar poți fi dezorganizat și ai tendința de a amâna sarcinile." :
                                  "Conștiinciozitate Medie: Ești, în general, organizat și îți îndeplinești sarcinile, dar îți permiți și o anumită flexibilitate.";
                    break;
                case 'A': 
                    description = level === "RIDICAT" ? "**Amabil/Cooperant**: Ești empatic, compasiv și înclinat să ai încredere în ceilalți. Ești o persoană plăcută." :
                                  level === "SCĂZUT" ? "**Sceptic/Competitiv**: Ești mai sceptic, competitiv și uneori certăreț. Ești mai puțin preocupat de problemele altora." :
                                  "Amabilitate Medie: Ești dispus să cooperezi, dar îți menții o perspectivă critică asupra celor din jur.";
                    break;
            }

            finalReport += `
                <div class="trait-result">
                    <strong>${getDimensionName(dimension)} (${dimension}): ${score} / 75 puncte (${level})</strong>
                    <p>${description}</p>
                </div>
            `;
        }
        
        // Aplică interpretarea pentru fiecare dimensiune Big Five
        interpretScore('E', scores.E);
        interpretScore('N', scores.N);
        interpretScore('O', scores.O);
        interpretScore('C', scores.C);
        interpretScore('A', scores.A);

        // Afișarea rezultatului
        resultPersonalityDiv.innerHTML = finalReport;
        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Inițiază generarea întrebărilor la încărcarea paginii
    generateQuestionsHTML();
});
