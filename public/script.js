document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gameContent = document.getElementById('game-content');
    const navLinks = document.querySelectorAll('.main-nav a');
    const startGameBtn = document.getElementById('start-game-btn');
    const createPlayerModal = document.getElementById('create-player-modal');
    const createPlayerBtn = document.getElementById('create-player-btn');
    const playerNameInput = document.getElementById('player-name');
    const playerNationalitySelect = document.getElementById('player-nationality');
    const positionBtns = document.querySelectorAll('.position-btn');
    const gameControls = document.getElementById('game-controls');
    const nextDayBtn = document.getElementById('next-day-btn');
    const infoMoney = document.getElementById('info-money');
    const infoXp = document.getElementById('info-xp');
    const infoClub = document.getElementById('info-club');
    const infoDay = document.getElementById('info-day');
    const infoWeek = document.getElementById('info-week');
    const infoLeague = document.getElementById('info-league');
    const gameInfoBar = document.getElementById('game-info-bar');

    // Game State
    let player = null;
    let selectedPosition = null;
    let daysPassed = 0;
    let currentWeek = 1;
    let eventsLog = [];
    let isMatchDay = false;
    let isMatchSimulating = false;
    let leagueStandings = [];
    let playerTeamIndex = 0;

    // Game Data & Constants
    const gameData = {
        positions: {
            goalkeeper: { name: "Portar", primaryAttributes: ['goalkeeping', 'strength'] },
            defender: { name: "Fundaș", primaryAttributes: ['defense', 'strength'] },
            midfielder: { name: "Mijlocaș", primaryAttributes: ['passing', 'dribbling', 'stamina'] },
            forward: { name: "Atacant", primaryAttributes: ['shooting', 'dribbling', 'pace'] }
        },
        attributeNames: {
            shooting: 'Șut', passing: 'Pasă', dribbling: 'Dribling', defense: 'Apărare',
            goalkeeping: 'Portar', pace: 'Viteză', strength: 'Forță', stamina: 'Rezistență'
        },
        clubTiers: {
            tier1: { name: 'Liga Amatori', salary: 100, overallMin: 0 },
            tier2: { name: 'Liga Secundă', salary: 500, overallMin: 65 },
            tier3: { name: 'Liga de Top', salary: 5000, overallMin: 80 }
        },
        nationalityData: {
            romanian: ['Rapid Brașov', 'FC Universitatea', 'Voința Cluj', 'Victoria București', 'Stejarul Arad', 'Dinamo Craiova', 'Tricolorul Ploiești', 'Astra Giurgiu', 'Petrolul Constanța', 'FC Oțelul Galați'],
            english: ['Wembley United', 'Royal Rovers', 'Stamford City', 'Highbury Albion', 'Anfield Athletic', 'London Knights', 'Riverside FC', 'Mersey City', 'Eton FC', 'White Hart Rangers'],
            spanish: ['Real Valencia', 'Athletic Club Balear', 'Deportivo Galicia', 'CD Castilla', 'Levante Unido', 'Granada FC', 'Real Hispalis', 'Espanyol Madrid', 'Racing de Córdoba', 'Real Gijón']
        },
        dailyActivities: [
            { name: "Antrenament la Sală", type: "attributes", effect: { strength: 2, stamina: 1 }, xp: 20, money: -50, message: "Te-ai antrenat la sală. Forța și rezistența au crescut." },
            { name: "Antrenament pe Teren", type: "attributes", effect: { shooting: 2, dribbling: 1, passing: 1 }, xp: 20, money: 0, message: "Ai lucrat la tehnica de joc pe teren. Atributele ofensive au crescut." },
            { name: "Curs de Limbi Străine", type: "xp", effect: 30, xp: 30, money: -100, message: "Ai urmat un curs. Nu-ți crește atributele, dar vei avea un avantaj la negocieri." },
            { name: "Zi Liberă", type: "rest", effect: 0, xp: 5, money: 0, message: "Te-ai odihnit. Ai recuperat energia și ești gata pentru următoarea zi." }
        ]
    };

    // --- Core Functions ---

    function createPlayer(name, position, nationality) {
        if (!gameData.positions[position] || !gameData.nationalityData[nationality]) {
            return null;
        }
        
        const baseAttributes = { shooting: 20, passing: 20, dribbling: 20, defense: 20, goalkeeping: 20, pace: 20, strength: 20, stamina: 20 };
        const primaryAttrs = gameData.positions[position].primaryAttributes;
        primaryAttrs.forEach(attr => baseAttributes[attr] += 15);

        const teams = generateTeams(nationality, 10);
        const playerTeam = teams[Math.floor(Math.random() * teams.length)];
        playerTeamIndex = teams.findIndex(t => t.name === playerTeam.name);

        leagueStandings = teams.map(team => ({
            name: team.name,
            points: 0, wins: 0, draws: 0, losses: 0, goalDifference: 0
        }));

        return {
            name: name, age: 16, position: position, nationality: nationality,
            club: playerTeam.name, league: gameData.clubTiers.tier1.name,
            salary: gameData.clubTiers.tier1.salary,
            attributes: baseAttributes, money: 0, trophies: [],
            goalsSeason: 0, assistsSeason: 0, overall: calculateOverall(baseAttributes),
            xpPoints: 0
        };
    }

    function generateTeams(nationality, count) {
        const teamNames = gameData.nationalityData[nationality].slice(0, count);
        return teamNames.map(name => ({
            name: name,
            overall: Math.floor(Math.random() * 20) + 40
        }));
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
            infoLeague.textContent = player.league;
            infoDay.textContent = daysPassed;
            infoWeek.textContent = currentWeek;
            gameInfoBar.classList.remove('hidden');
        } else {
            gameInfoBar.classList.add('hidden');
        }
    }

    function addLogEntry(message, type = 'info') {
        eventsLog.push({ message, type });
        if (eventsLog.length > 20) eventsLog.shift();
        if (document.getElementById('event-log')) {
            renderPage('dashboard');
        }
    }

    function advanceDay() {
        if (isMatchSimulating) return;

        daysPassed++;
        isMatchDay = (daysPassed % 7 === 0);

        if (isMatchDay) {
            addLogEntry(`Astăzi este ziua meciului!`, 'success');
            renderMatchPage();
            return;
        }

        renderDailyActivityPage();
        updateGameInfoBar();
    }
    
    function applyDailyActivity(activity) {
        if (activity.type === 'attributes') {
            for (const attr in activity.effect) {
                if (player.attributes.hasOwnProperty(attr)) {
                    player.attributes[attr] += activity.effect[attr];
                }
            }
        }
        player.xpPoints += activity.xp;
        player.money += activity.money;

        player.overall = calculateOverall(player.attributes);
        addLogEntry(`${activity.message} Ai primit ${activity.xp} XP.`, 'info');
        
        if (daysPassed % 7 === 1) { // Luni
            currentWeek++;
            player.money += player.salary;
            addLogEntry(`Săptămâna s-a încheiat. Ai primit salariul de ${player.salary}€.`);
        }
        
        checkTransfers();
        renderPage('dashboard');
        updateGameInfoBar();
    }
    
    function checkTransfers() {
        // Implementează logica de transferuri aici
    }

    function simulateMatch(callback) {
        isMatchSimulating = true;
        const opponentTeam = leagueStandings[Math.floor(Math.random() * leagueStandings.length)];
        while (opponentTeam.name === player.club) {
            opponentTeam = leagueStandings[Math.floor(Math.random() * leagueStandings.length)];
        }
        const opponentRating = opponentTeam.overall;
        
        let matchScore = { team: 0, opponent: 0 };
        let matchLog = [];
        let matchMinutes = 0;
        const totalSteps = 10;
        let currentStep = 0;

        const intervalId = setInterval(() => {
            if (currentStep >= totalSteps) {
                clearInterval(intervalId);
                isMatchSimulating = false;
                
                const playerTeam = leagueStandings[playerTeamIndex];
                const opponentTeamIndex = leagueStandings.findIndex(t => t.name === opponentTeam.name);
                const opponentTeamStanding = leagueStandings[opponentTeamIndex];

                if (matchScore.team > matchScore.opponent) {
                    playerTeam.points += 3;
                    playerTeam.wins++;
                    opponentTeamStanding.losses++;
                    addLogEntry(`Meciul s-a terminat: Victorie! ${matchScore.team} - ${matchScore.opponent}.`, 'success');
                } else if (matchScore.team < matchScore.opponent) {
                    opponentTeamStanding.points += 3;
                    playerTeam.losses++;
                    opponentTeamStanding.wins++;
                    addLogEntry(`Meciul s-a terminat: Înfrângere! ${matchScore.team} - ${matchScore.opponent}.`, 'error');
                } else {
                    playerTeam.points += 1;
                    opponentTeamStanding.points += 1;
                    playerTeam.draws++;
                    opponentTeamStanding.draws++;
                    addLogEntry(`Meciul s-a terminat: Egal! ${matchScore.team} - ${matchScore.opponent}.`, 'info');
                }
                playerTeam.goalDifference += matchScore.team - matchScore.opponent;
                opponentTeamStanding.goalDifference += matchScore.opponent - matchScore.team;

                leagueStandings.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);

                const playerNote = Math.min(10, Math.max(5, Math.floor(matchScore.team * 2 + (player.overall - opponentRating) / 10 + 5)));
                const xpGained = playerNote * 5; // Multiplică XP pentru a fi mai semnificativ
                player.xpPoints += xpGained;
                player.goalsSeason += matchScore.team;

                addLogEntry(`Nota ta de performanță este ${playerNote}/10. Ai primit ${xpGained} XP!`, 'success');
                callback();
                return;
            }

            matchMinutes += 10;
            const ballPosition = Math.random() * 100;
            document.querySelector('.ball-progress-bar').style.width = `${ballPosition}%`;
            
            if (Math.random() < 0.3) {
                if (ballPosition > 50 && Math.random() < (player.overall / 100)) {
                    matchScore.team++;
                    matchLog.push(`Minutul ${matchMinutes}: Gol! ${player.name} a marcat!`);
                } else if (ballPosition < 50 && Math.random() < 0.3) {
                    matchScore.opponent++;
                    matchLog.push(`Minutul ${matchMinutes}: Gol pentru adversar!`);
                }
            }
            
            document.getElementById('match-score').textContent = `${matchScore.team} - ${matchScore.opponent}`;
            const matchLogDiv = document.getElementById('match-log');
            matchLogDiv.innerHTML = '';
            matchLog.forEach(log => {
                const entry = document.createElement('div');
                entry.className = `live-feed-entry info-message`;
                entry.textContent = log;
                matchLogDiv.appendChild(entry);
            });
            matchLogDiv.scrollTop = matchLogDiv.scrollHeight;

            currentStep++;
        }, 1000);
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
            case 'standings': renderStandings(); break;
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

    function renderDailyActivityPage() {
        if (!player) return;
        let html = `
            <h2 class="page-title">Ce vrei să faci azi?</h2>
            <p>Alege o activitate pentru a-ți îmbunătăți abilitățile sau a câștiga bani.</p>
            <div class="training-options">
        `;
        gameData.dailyActivities.forEach(activity => {
            html += `
                <div class="activity-option" data-activity-name="${activity.name}">
                    <h4>${activity.name}</h4>
                    <p>${activity.message}</p>
                    <p><strong>XP:</strong> +${activity.xp}</p>
                    <p><strong>Bani:</strong> ${activity.money}€</p>
                </div>
            `;
        });
        html += `</div>`;
        gameContent.innerHTML = html;

        document.querySelectorAll('.activity-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const activityName = e.currentTarget.dataset.activityName;
                const activity = gameData.dailyActivities.find(a => a.name === activityName);
                applyDailyActivity(activity);
            });
        });
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
            html += `
                <div class="attribute-item ${isPrimary ? 'highlighted' : ''}">
                    <h4>${gameData.attributeNames[key]}</h4>
                    <div class="attribute-progress">
                        <div class="attribute-progress-bar" style="width: ${value}%;"></div>
                        <span class="attribute-progress-text">${value}/100</span>
                    </div>
                </div>
            `;
        }
        html += `</div>`;
        gameContent.innerHTML = html;
    }

    function renderTraining() {
        if (!player) return;
        let html = `
            <h2 class="page-title">Antrenament</h2>
            <p>Ai <strong>${player.xpPoints}</strong> puncte XP disponibile. Fiecare punct crește un atribut cu 1 punct.</p>
            <button id="auto-train-btn" class="main-btn" ${player.xpPoints === 0 ? 'disabled' : ''} style="margin-bottom: 20px;">Antrenează Automat</button>
            <div class="training-options player-attributes">
        `;

        for (const [key, value] of Object.entries(player.attributes)) {
            const isPrimary = gameData.positions[player.position].primaryAttributes.includes(key);
            html += `
                <div class="attribute-item ${isPrimary ? 'highlighted' : ''}">
                    <h4>${gameData.attributeNames[key]}</h4>
                    <div class="attribute-progress">
                        <div class="attribute-progress-bar" style="width: ${value}%;"></div>
                        <span class="attribute-progress-text">${value}/100</span>
                    </div>
                    <button class="train-btn" data-attribute="${key}" ${player.xpPoints === 0 ? 'disabled' : ''}>Folosește 1 XP</button>
                </div>
            `;
        }
        html += `</div>`;
        gameContent.innerHTML = html;

        document.querySelectorAll('.train-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const attributeToTrain = e.target.dataset.attribute;
                if (player.xpPoints > 0) {
                    player.attributes[attributeToTrain] = Math.min(100, player.attributes[attributeToTrain] + 1);
                    player.overall = calculateOverall(player.attributes);
                    player.xpPoints--;
                    addLogEntry(`${gameData.attributeNames[attributeToTrain]} a crescut la ${player.attributes[attributeToTrain]}!`, 'success');
                    renderTraining();
                    updateGameInfoBar();
                }
            });
        });

        document.getElementById('auto-train-btn').addEventListener('click', () => {
            if (player.xpPoints > 0) {
                const attributes = Object.keys(player.attributes);
                const randomAttr = attributes[Math.floor(Math.random() * attributes.length)];
                
                player.attributes[randomAttr] = Math.min(100, player.attributes[randomAttr] + 1);
                player.overall = calculateOverall(player.attributes);
                player.xpPoints--;
                addLogEntry(`Antrenament automat: ${gameData.attributeNames[randomAttr]} a crescut la ${player.attributes[randomAttr]}!`, 'success');
                renderTraining();
                updateGameInfoBar();
            }
        });
    }
    
    function renderStandings() {
        let html = `
            <h2 class="page-title">Clasament Liga ${player.league}</h2>
            <table class="standings-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Echipa</th>
                        <th>Puncte</th>
                        <th>Victorii</th>
                        <th>Egaluri</th>
                        <th>Înfrângeri</th>
                        <th>Golaveraj</th>
                    </tr>
                </thead>
                <tbody>
        `;
        leagueStandings.forEach((team, index) => {
            const isPlayerTeam = team.name === player.club;
            html += `
                <tr ${isPlayerTeam ? 'style="font-weight: bold; color: var(--accent-color);"' : ''}>
                    <td>${index + 1}</td>
                    <td>${team.name}</td>
                    <td>${team.points}</td>
                    <td>${team.wins}</td>
                    <td>${team.draws}</td>
                    <td>${team.losses}</td>
                    <td>${team.goalDifference}</td>
                </tr>
            `;
        });
        html += `</tbody></table>`;
        gameContent.innerHTML = html;
    }
    
    function renderMatchPage() {
        const homeTeam = player.club;
        const opponentTeam = leagueStandings[Math.floor(Math.random() * leagueStandings.length)];
        while (opponentTeam.name === player.club) {
            opponentTeam = leagueStandings[Math.floor(Math.random() * leagueStandings.length)];
        }
        
        let html = `
            <h2 class="page-title">Ziua Meciului</h2>
            <div class="match-simulation">
                <div class="match-header">
                    <span>${homeTeam}</span>
                    <span class="match-score" id="match-score">0 - 0</span>
                    <span>${opponentTeam.name}</span>
                </div>
                <div class="pitch-container">
                    <div class="ball-progress-bar"></div>
                </div>
                <h3>Live Feed</h3>
                <div class="match-live-feed" id="match-log"></div>
            </div>
        `;
        gameContent.innerHTML = html;
        
        simulateMatch(() => {
            const matchLogDiv = document.getElementById('match-log');
            const finalMessage = document.createElement('div');
            finalMessage.className = 'live-feed-entry success-message';
            finalMessage.textContent = 'Meci terminat. Apasă Next Day pentru a continua.';
            matchLogDiv.appendChild(finalMessage);
            nextDayBtn.disabled = false;
        });
        
        nextDayBtn.disabled = true;
    }
    
    // --- Event Listeners & Initialization ---
    function setupEventListeners() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.target.id.replace('nav-', '');
                if (player && !isMatchDay && !isMatchSimulating) {
                    renderPage(pageId);
                } else if (isMatchDay || isMatchSimulating) {
                    alert("E ziua meciului sau se simulează meciul! Așteaptă.");
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
                const playerNationality = playerNationalitySelect.value;
                if (playerName && selectedPosition && playerNationality) {
                    player = createPlayer(playerName, selectedPosition, playerNationality);
                    if (player) {
                        createPlayerModal.classList.add('hidden');
                        gameControls.classList.remove('hidden');
                        addLogEntry('Carieră începută! Apasă "Next Day" pentru a avansa în timp.');
                        renderPage('dashboard');
                        updateGameInfoBar();
                    }
                } else {
                    alert("Te rog să introduci un nume, naționalitate și să selectezi o poziție.");
                }
            });
        }
        
        if (nextDayBtn) {
            nextDayBtn.addEventListener('click', advanceDay);
        }
    }

    setupEventListeners();
});
