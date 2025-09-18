document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gameContent = document.getElementById('game-content');
    const navLinks = document.querySelectorAll('.main-nav a');
    const startGameBtn = document.getElementById('start-game-btn');
    const createPlayerModal = document.getElementById('create-player-modal');
    const createPlayerBtn = document.getElementById('create-player-btn');
    const playerNameInput = document.getElementById('player-name');
    const positionBtns = document.querySelectorAll('.position-btn');
    const gameControls = document.getElementById('game-controls');
    const nextDayBtn = document.getElementById('next-day-btn');
    const infoMoney = document.getElementById('info-money');
    const infoXp = document.getElementById('info-xp');
    const infoClub = document.getElementById('info-club');
    const infoDay = document.getElementById('info-day');
    const infoWeek = document.getElementById('info-week');
    const gameInfoBar = document.getElementById('game-info-bar');

    // Game State
    let player = null;
    let selectedPosition = null;
    let isTraining = false;
    let daysPassed = 0;
    let currentWeek = 1;
    let eventsLog = [];
    let isMatchDay = false;

    // Game Data & Constants
    const gameData = {
        positions: {
            goalkeeper: {
                name: "Portar",
                primaryAttributes: ['goalkeeping', 'strength']
            },
            defender: {
                name: "Fundaș",
                primaryAttributes: ['defense', 'strength']
            },
            midfielder: {
                name: "Mijlocaș",
                primaryAttributes: ['passing', 'dribbling', 'stamina']
            },
            forward: {
                name: "Atacant",
                primaryAttributes: ['shooting', 'dribbling', 'pace']
            }
        },
        attributeNames: {
            shooting: 'Șut',
            passing: 'Pasă',
            dribbling: 'Dribling',
            defense: 'Apărare',
            goalkeeping: 'Portar',
            pace: 'Viteză',
            strength: 'Forță',
            stamina: 'Rezistență'
        },
        clubTiers: {
            tier1: { name: 'Amatori FC', salary: 100, overallMin: 0, performanceMin: 0 },
            tier2: { name: 'Liga Secundă FC', salary: 500, overallMin: 65, performanceMin: 15 },
            tier3: { name: 'Top Club FC', salary: 5000, overallMin: 80, performanceMin: 20 }
        }
    };

    // --- Core Functions ---
    function createPlayer(name, position) {
        if (!gameData.positions[position]) {
            return null;
        }
        
        const baseAttributes = { shooting: 20, passing: 20, dribbling: 20, defense: 20, goalkeeping: 20, pace: 20, strength: 20, stamina: 20 };
        const primaryAttrs = gameData.positions[position].primaryAttributes;
        primaryAttrs.forEach(attr => baseAttributes[attr] += 15);

        return {
            name: name,
            age: 16,
            position: position,
            club: gameData.clubTiers.tier1.name,
            salary: gameData.clubTiers.tier1.salary,
            attributes: baseAttributes,
            money: 0,
            trophies: [],
            goalsSeason: 0,
            assistsSeason: 0,
            overall: calculateOverall(baseAttributes),
            xpPoints: 0
        };
    }

    function calculateOverall(attributes) {
        const relevantAttrs = Object.values(attributes).filter(val => val > 0);
        const sum = relevantAttrs.reduce((acc, val) => acc + val, 0);
        return Math.floor(sum / relevantAttrs.length);
    }

    function updateGameInfoBar() {
        if (player) {
            infoMoney.textContent = `${player.money}€`;
            infoXp.textContent = player.xpPoints;
            infoClub.textContent = player.club;
            infoDay.textContent = daysPassed;
            infoWeek.textContent = currentWeek;
            gameInfoBar.classList.remove('hidden');
        } else {
            gameInfoBar.classList.add('hidden');
        }
    }

    function addLogEntry(message, type = 'info') {
        eventsLog.push({ message, type });
        if (eventsLog.length > 10) eventsLog.shift();
        if (document.getElementById('event-log')) {
            renderPage('dashboard');
        }
    }

    function checkTransfers() {
        if (player.overall >= gameData.clubTiers.tier2.overallMin && player.goalsSeason >= gameData.clubTiers.tier2.performanceMin) {
            addLogEntry(`Ai primit o ofertă de transfer de la ${gameData.clubTiers.tier2.name} cu un salariu de ${gameData.clubTiers.tier2.salary}€!`, 'success');
        }
    }

    function advanceDay() {
        if (isTraining) {
            alert("Nu poți avansa ziua în timpul antrenamentului!");
            return;
        }
        daysPassed++;
        if (daysPassed % 7 === 0) {
            isMatchDay = true;
            addLogEntry(`Astăzi este ziua meciului!`, 'success');
            renderMatchPage();
        } else {
            addLogEntry(`Ziua ${daysPassed} a început.`);
            if (daysPassed % 7 === 1) { // Luni
                currentWeek++;
                player.money += player.salary;
                addLogEntry(`Săptămâna s-a încheiat. Ai primit salariul de ${player.salary}€.`);
            }
            renderPage('dashboard');
        }
        updateGameInfoBar();
        checkTransfers();
    }

    function simulateMatch() {
        const opponentRating = Math.floor(Math.random() * (player.overall + 10) + (player.overall - 20));
        let playerPerformance = 0;
        let goalsScored = 0;
        let assistsGiven = 0;
        let playerNote = 0;

        if (player.position === 'forward') {
            goalsScored = Math.floor(Math.random() * (player.attributes.shooting / 15));
            assistsGiven = Math.floor(Math.random() * (player.attributes.passing / 20));
        }
        
        playerNote = Math.min(10, Math.max(5, Math.floor(goalsScored * 2 + assistsGiven * 1.5 + (player.overall - opponentRating) / 10 + 5)));

        player.goalsSeason += goalsScored;
        player.assistsSeason += assistsGiven;
        const xpGained = playerNote;
        player.xpPoints += xpGained;

        addLogEntry(`Ai jucat un meci! Nota ta este ${playerNote}/10. Ai primit ${xpGained} XP.`, 'info');
        isMatchDay = false;
        renderPage('dashboard');
    }

    // --- Rendering Functions ---
    function renderPage(pageId) {
        gameContent.innerHTML = '';
        switch (pageId) {
            case 'dashboard': renderDashboard(); break;
            case 'profile': renderProfile(); break;
            case 'training': renderTraining(); break;
            case 'transfers': gameContent.innerHTML = `<h2>Pagina Transferuri</h2><p>Aici vei vedea ofertele de transfer și îți vei negocia contractele.</p>`; break;
            case 'life': gameContent.innerHTML = `<h2>Pagina Viața Jucătorului</h2><p>Fonduri disponibile: <strong>${player.money}€</strong></p><p>Cheltuiește-ți banii câștigați pe diverse bunuri și servicii.</p>`; break;
            case 'standings': gameContent.innerHTML = `<h2>Clasament</h2><p>Poziția echipei tale în ligă.</p>`; break;
            case 'competitions': gameContent.innerHTML = `<h2>Competiții</h2><p>Aici vei găsi detalii despre turneele la care participi.</p>`; break;
            case 'trophies': gameContent.innerHTML = `<h2>Trofee</h2><p>Colecția ta de trofee personale și de echipă.</p>`; break;
        }
    }
    
    function renderDashboard() {
        if (!player) return;
        let html = `
            <h2 class="page-title">Panoul de Comandă</h2>
            <p>Ești un tânăr de <strong>${player.age}</strong> ani, jucând la clubul <strong>${player.club}</strong>.</p>
            <p>Overall Rating: <strong>${player.overall}</strong></p>
            <h3>Jurnal de Activitate</h3>
            <div class="event-log" id="event-log"></div>
        `;
        gameContent.innerHTML = html;
        const eventLogDiv = document.getElementById('event-log');
        eventsLog.forEach(log => {
            const entry = document.createElement('div');
            entry.className = `log-entry ${log.type}-message`;
            entry.textContent = log.message;
            eventLogDiv.appendChild(entry);
        });
        eventLogDiv.scrollTop = eventLogDiv.scrollHeight;
    }

    function renderProfile() {
        if (!player) return;
        let html = `
            <h2 class="page-title">Profilul tău de Jucător</h2>
            <div class="player-info">
                <p><strong>Nume:</strong> ${player.name}</p>
                <p><strong>Vârstă:</strong> ${player.age}</p>
                <p><strong>Poziție:</strong> ${gameData.positions[player.position].name}</p>
                <p><strong>Club:</strong> ${player.club}</p>
                <p><strong>Overall Rating:</strong> ${player.overall} (OVR)</p>
                <p><strong>Salariu:</strong> ${player.salary}€/săptămână</p>
            </div>
            <h3>Statistici Sezon</h3>
            <p>Goluri: ${player.goalsSeason}</p>
            <p>Pase de gol: ${player.assistsSeason}</p>
            <h3>Atribute</h3>
            <div class="player-attributes">
        `;
        for (const [key, value] of Object.entries(player.attributes)) {
            const isPrimary = gameData.positions[player.position].primaryAttributes.includes(key);
            html += `<div class="attribute-item ${isPrimary ? 'highlighted' : ''}"><h4>${gameData.attributeNames[key]}</h4><p class="attribute-value">${value}</p></div>`;
        }
        html += `</div>`;
        gameContent.innerHTML = html;
    }

    function renderTraining() {
        if (!player) return;
        let html = `
            <h2 class="page-title">Antrenament</h2>
            <p>Ai <strong>${player.xpPoints}</strong> puncte XP disponibile. Fiecare punct crește un atribut cu 1 punct.</p>
            <div class="training-options player-attributes">
        `;
        for (const [key, value] of Object.entries(player.attributes)) {
            const isPrimary = gameData.positions[player.position].primaryAttributes.includes(key);
            html += `<div class="attribute-item ${isPrimary ? 'highlighted' : ''}"><h4>${gameData.attributeNames[key]}</h4><p class="attribute-value">${value}</p><button class="train-btn" data-attribute="${key}" ${player.xpPoints === 0 ? 'disabled' : ''}>Folosește 1 XP</button></div>`;
        }
        html += `</div>`;
        gameContent.innerHTML = html;
        document.querySelectorAll('.train-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const attributeToTrain = e.target.dataset.attribute;
                if (player.xpPoints > 0) {
                    player.attributes[attributeToTrain] += 1;
                    player.overall = calculateOverall(player.attributes);
                    player.xpPoints--;
                    addLogEntry(`${gameData.attributeNames[attributeToTrain]} a crescut la ${player.attributes[attributeToTrain]}!`, 'success');
                    renderTraining();
                    updateGameInfoBar();
                }
            });
        });
    }

    function renderMatchPage() {
        let matchScore = { team: 0, opponent: 0 };
        const matchLog = [];
        const ballProgressBar = document.createElement('div');
        ballProgressBar.className = 'ball-progress-bar';
        ballProgressBar.style.width = '50%';

        const homeTeam = player.club;
        const opponentTeam = `Adversarul`;

        let html = `
            <h2 class="page-title">Ziua Meciului</h2>
            <div class="match-simulation">
                <div class="match-header">
                    <span>${homeTeam}</span>
                    <span class="match-score" id="match-score">0 - 0</span>
                    <span>${opponentTeam}</span>
                </div>
                <div class="pitch-container">
                    ${ballProgressBar.outerHTML}
                </div>
                <h3>Evenimente Meci</h3>
                <div class="event-log" id="match-log"></div>
            </div>
            <button id="next-match-step-btn" class="main-btn" style="margin-top: 2rem;">Simulează Meciul</button>
        `;
        gameContent.innerHTML = html;
        const matchLogDiv = document.getElementById('match-log');
        const matchScoreSpan = document.getElementById('match-score');
        const nextStepBtn = document.getElementById('next-match-step-btn');
        let matchMinutes = 0;

        nextStepBtn.textContent = 'Simulează 10 Minute';

        nextStepBtn.addEventListener('click', () => {
            if (matchMinutes >= 90) {
                isMatchDay = false;
                simulateMatch(matchScore.team, matchScore.opponent, matchLog);
                return;
            }

            matchMinutes += 10;
            const ballPosition = Math.random() * 100;
            document.querySelector('.ball-progress-bar').style.width = `${ballPosition}%`;

            if (Math.random() < 0.2) {
                if (Math.random() < 0.5) {
                    matchScore.team++;
                    matchLog.push(`Minutul ${matchMinutes}: Gol! ${player.name} a marcat!`);
                } else {
                    matchScore.opponent++;
                    matchLog.push(`Minutul ${matchMinutes}: Gol pentru adversar!`);
                }
                matchScoreSpan.textContent = `${matchScore.team} - ${matchScore.opponent}`;
            }

            matchLogDiv.innerHTML = '';
            matchLog.forEach(log => {
                const entry = document.createElement('div');
                entry.className = `log-entry info-message`;
                entry.textContent = log;
                matchLogDiv.appendChild(entry);
            });
            matchLogDiv.scrollTop = matchLogDiv.scrollHeight;
        });

        function simulateMatch(myScore, opponentScore, log) {
            const playerNote = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
            const xpGained = playerNote;
            player.xpPoints += xpGained;
            const goalsScored = myScore;
            const assistsGiven = 0; // Pentru simplitate
            
            player.goalsSeason += goalsScored;
            player.assistsSeason += assistsGiven;

            addLogEntry(`Meciul s-a terminat: ${myScore} - ${opponentScore}. Nota ta de performanță este ${playerNote}/10. Ai primit ${xpGained} XP!`, 'success');
            renderPage('dashboard');
            updateGameInfoBar();
        }
    }

    // --- Event Listeners & Initialization ---
    function setupEventListeners() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.target.id.replace('nav-', '');
                if (player && !isMatchDay) {
                    renderPage(pageId);
                } else if (isMatchDay) {
                    alert("E ziua meciului! Trebuie să joci înainte de a naviga.");
                } else {
                    alert("Trebuie să începi o carieră nouă mai întâi!");
                }
            });
        });

        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                createPlayerModal.classList.remove('hidden');
            });
        }

        positionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                positionBtns.forEach(pBtn => pBtn.classList.remove('selected'));
                btn.classList.add('selected');
                selectedPosition = btn.dataset.position;
            });
        });

        if (createPlayerBtn) {
            createPlayerBtn.addEventListener('click', () => {
                const playerName = playerNameInput.value.trim();
                if (playerName && selectedPosition) {
                    player = createPlayer(playerName, selectedPosition);
                    if (player) {
                        createPlayerModal.classList.add('hidden');
                        gameControls.classList.remove('hidden');
                        addLogEntry('Carieră începută! Apasă "Next Day" pentru a avansa în timp.');
                        renderPage('dashboard');
                        updateGameInfoBar();
                    }
                } else {
                    alert("Te rog să introduci un nume și să selectezi o poziție.");
                }
            });
        }
        
        if (nextDayBtn) {
            nextDayBtn.addEventListener('click', advanceDay);
        }
    }

    setupEventListeners();
});
