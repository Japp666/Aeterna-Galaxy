(() => {
    // DOM Elements (Cached)
    const elements = {
        gameContent: document.getElementById('game-content'),
        navLinks: document.querySelectorAll('.main-nav a'),
        startGameBtn: document.getElementById('start-game-btn'),
        createPlayerModal: document.getElementById('create-player-modal'),
        createPlayerBtn: document.getElementById('create-player-btn'),
        playerNameInput: document.getElementById('player-name'),
        playerNationalitySelect: document.getElementById('player-nationality'),
        positionBtns: document.querySelectorAll('.position-btn'),
        gameControls: document.getElementById('game-controls'),
        nextDayBtn: document.getElementById('next-day-btn'),
        infoMoney: document.getElementById('info-money'),
        infoXp: document.getElementById('info-xp'),
        infoClub: document.getElementById('info-club'),
        infoDay: document.getElementById('info-day'),
        infoWeek: document.getElementById('info-week'),
        infoLeague: document.getElementById('info-league'),
        gameInfoBar: document.getElementById('game-info-bar'),
    };

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

    // Utility Functions
    const calculateOverall = (attributes) => {
        const values = Object.values(attributes);
        const sum = values.reduce((acc, val) => acc + val, 0);
        return Math.floor(sum / values.length);
    };

    const generateTeams = (nationality, count) => {
        const names = gameData.nationalityData[nationality].slice(0, count);
        return names.map(name => ({
            name,
            overall: Math.floor(Math.random() * 20) + 40
        }));
    };

    const updateGameInfoBar = () => {
        if (player) {
            elements.infoMoney.textContent = `${player.money}€`;
            elements.infoXp.textContent = player.xpPoints;
            elements.infoClub.textContent = player.club;
            elements.infoLeague.textContent = player.league;
            elements.infoDay.textContent = daysPassed;
            elements.infoWeek.textContent = currentWeek;
            elements.gameInfoBar.classList.remove('hidden');
        } else {
            elements.gameInfoBar.classList.add('hidden');
        }
    };

    const addLogEntry = (message, type = 'info') => {
        eventsLog.push({ message, type });
        if (eventsLog.length > 20) eventsLog.shift();
    };

    // Core Game Functions
    const createPlayer = (name, position, nationality) => {
        if (!gameData.positions[position] || !gameData.nationalityData[nationality]) return null;

        const baseAttributes = { shooting: 20, passing: 20, dribbling: 20, defense: 20, goalkeeping: 20, pace: 20, strength: 20, stamina: 20 };
        gameData.positions[position].primaryAttributes.forEach(attr => baseAttributes[attr] += 15);

        const teams = generateTeams(nationality, 10);
        const playerTeam = teams[Math.floor(Math.random() * teams.length)];
        playerTeamIndex = teams.findIndex(t => t.name === playerTeam.name);

        leagueStandings = teams.map(team => ({
            name: team.name,
            points: 0, wins: 0, draws: 0, losses: 0, goalDifference: 0
        }));

        return {
            name, age: 16, position, nationality,
            club: playerTeam.name, league: gameData.clubTiers.tier1.name,
            salary: gameData.clubTiers.tier1.salary,
            attributes: baseAttributes, money: 0, trophies: [],
            goalsSeason: 0, assistsSeason: 0, overall: calculateOverall(baseAttributes),
            xpPoints: 0
        };
    };

    const advanceDay = () => {
        if (isMatchSimulating) return;

        daysPassed++;
        isMatchDay = (daysPassed % 7 === 0);

        if (isMatchDay) {
            addLogEntry(`Astăzi este ziua meciului!`, 'success');
            renderMatchPage();
        } else {
            renderDailyActivityPage();
        }

        updateGameInfoBar();
    };

    const applyDailyActivity = (activity) => {
        if (activity.type === 'attributes') {
            for (const [attr, value] of Object.entries(activity.effect)) {
                if (player.attributes[attr]) {
                    player.attributes[attr] = Math.min(100, player.attributes[attr] + value);
                }
            }
        } else if (activity.type === 'xp') {
            player.xpPoints += activity.effect;
        }

        player.xpPoints += activity.xp;
        player.money += activity.money;
        player.overall = calculateOverall(player.attributes);
        addLogEntry(`${activity.message} Ai primit ${activity.xp} XP.`, 'info');

        if (daysPassed % 7 === 1) {
            currentWeek++;
            player.money += player.salary;
            addLogEntry(`Săptămâna s-a încheiat. Ai primit salariul de ${player.salary}€.`, 'info');
        }

        checkTransfers();
        renderPage('dashboard');
        updateGameInfoBar();
        saveGameState(); // Adăugat persistență
    };

    const checkTransfers = () => {
        // Logică simplificată; poate fi extinsă
        if (player.overall > gameData.clubTiers.tier2.overallMin && player.league === gameData.clubTiers.tier1.name) {
            player.league = gameData.clubTiers.tier2.name;
            player.salary = gameData.clubTiers.tier2.salary;
            addLogEntry('Ai fost promovat în Liga Secundă!', 'success');
        }
    };

    const simulateMatch = (callback) => {
        isMatchSimulating = true;
        let opponentIndex = Math.floor(Math.random() * leagueStandings.length);
        while (opponentIndex === playerTeamIndex) opponentIndex = Math.floor(Math.random() * leagueStandings.length);
        const opponent = leagueStandings[opponentIndex];

        let matchScore = { team: 0, opponent: 0 };
        let matchLog = [];
        let matchMinutes = 0;
        const totalSteps = 9; // 90 minute / 10
        let currentStep = 0;

        const events = [
            'Gol! {scorer} a marcat un gol superb.',
            'Cartonaș galben pentru fault.',
            'Schimbare: Jucător nou intră pe teren.',
            'Lovitură liberă ratată.',
            'Gol anulat pentru offside.'
        ];

        const intervalId = setInterval(() => {
            if (currentStep >= totalSteps) {
                clearInterval(intervalId);
                isMatchSimulating = false;

                const playerTeam = leagueStandings[playerTeamIndex];
                if (matchScore.team > matchScore.opponent) {
                    playerTeam.points += 3;
                    playerTeam.wins++;
                    opponent.losses++;
                    addLogEntry(`Victorie! ${matchScore.team} - ${matchScore.opponent}.`, 'success');
                } else if (matchScore.team < matchScore.opponent) {
                    opponent.points += 3;
                    playerTeam.losses++;
                    opponent.wins++;
                    addLogEntry(`Înfrângere! ${matchScore.team} - ${matchScore.opponent}.`, 'error');
                } else {
                    playerTeam.points += 1;
                    opponent.points += 1;
                    playerTeam.draws++;
                    opponent.draws++;
                    addLogEntry(`Egal! ${matchScore.team} - ${matchScore.opponent}.`, 'info');
                }

                playerTeam.goalDifference += matchScore.team - matchScore.opponent;
                opponent.goalDifference += matchScore.opponent - matchScore.team;

                leagueStandings.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);

                const playerNote = Math.min(10, Math.max(5, Math.floor((matchScore.team * 2) + (player.overall - opponent.overall) / 10 + 5)));
                const xpGained = playerNote * 5;
                player.xpPoints += xpGained;
                player.goalsSeason += matchScore.team > 0 ? Math.floor(Math.random() * matchScore.team) : 0; // Mai realist

                addLogEntry(`Nota ta: ${playerNote}/10. Ai primit ${xpGained} XP!`, 'success');
                callback();
                saveGameState();
                return;
            }

            matchMinutes += 10;
            const ballPosition = Math.random() * 100;
            document.querySelector('.ball-progress-bar')?.style.width = `${ballPosition}%`;

            // Evenimente random mai detaliate
            if (Math.random() < 0.4) {
                const randomEvent = events[Math.floor(Math.random() * events.length)];
                matchLog.push(`Minutul ${matchMinutes}: ${randomEvent.replace('{scorer}', player.name)}`);
            }

            if (Math.random() < 0.3) {
                if (ballPosition > 50 && Math.random() < (player.overall / 100)) {
                    matchScore.team++;
                    matchLog.push(`Minutul ${matchMinutes}: Gol! ${player.name} a marcat!`);
                } else if (ballPosition < 50 && Math.random() < 0.3) {
                    matchScore.opponent++;
                    matchLog.push(`Minutul ${matchMinutes}: Gol pentru adversar!`);
                }
            }

            document.getElementById('match-score')?.textContent = `${matchScore.team} - ${matchScore.opponent}`;
            const matchLogDiv = document.getElementById('match-log');
            if (matchLogDiv) {
                matchLogDiv.innerHTML = matchLog.map(log => `<div class="live-feed-entry info-message">${log}</div>`).join('');
                matchLogDiv.scrollTop = matchLogDiv.scrollHeight;
            }

            currentStep++;
        }, 1000);
    };

    // Rendering Functions
    const renderPage = (pageId) => {
        elements.gameContent.innerHTML = '';
        const renderFunctions = {
            dashboard: renderDashboard,
            profile: renderProfile,
            training: renderTraining,
            transfers: () => elements.gameContent.innerHTML = '<h2>Pagina Transferuri</h2><p>Aici vei vedea ofertele de transfer și îți vei negocia contractele.</p>',
            life: () => elements.gameContent.innerHTML = `<h2>Pagina Viața Jucătorului</h2><p>Fonduri disponibile: <strong>${player.money}€</strong></p><p>Cheltuiește-ți banii câștigați pe diverse bunuri și servicii.</p>`,
            standings: renderStandings,
            competitions: () => elements.gameContent.innerHTML = '<h2>Competiții</h2><p>Aici vei găsi detalii despre turneele la care participi.</p>',
            trophies: () => elements.gameContent.innerHTML = '<h2>Trofee</h2><p>Colecția ta de trofee personale și de echipă.</p>',
        };
        renderFunctions[pageId]?.();
    };

    const renderDashboard = () => {
        if (!player) return;
        elements.gameContent.innerHTML = `
            <h2 class="page-title">Panoul de Comandă</h2>
            <p>Ești un tânăr de <strong>${player.age}</strong> ani, jucând la clubul <strong>${player.club}</strong>.</p>
            <p>Overall Rating: <strong>${player.overall}</strong></p>
            <h3>Jurnal de Activitate</h3>
            <div class="event-log" id="event-log">${eventsLog.map(log => `<div class="log-entry ${log.type}-message">${log.message}</div>`).join('')}</div>
        `;
        document.getElementById('event-log').scrollTop = document.getElementById('event-log').scrollHeight;
    };

    const renderDailyActivityPage = () => {
        if (!player) return;
        elements.gameContent.innerHTML = `
            <h2 class="page-title">Ce vrei să faci azi?</h2>
            <p>Alege o activitate pentru a-ți îmbunătăți abilitățile sau a câștiga bani.</p>
            <div class="activity-options">
                ${gameData.dailyActivities.map(activity => `
                    <div class="activity-option" data-activity-name="${activity.name}">
                        <h4>${activity.name}</h4>
                        <p>${activity.message}</p>
                        <p><strong>XP:</strong> +${activity.xp}</p>
                        <p><strong>Bani:</strong> ${activity.money}€</p>
                    </div>
                `).join('')}
            </div>
        `;

        document.querySelectorAll('.activity-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const activityName = e.currentTarget.dataset.activityName;
                const activity = gameData.dailyActivities.find(a => a.name === activityName);
                if (activity) applyDailyActivity(activity);
            });
        });
    };

    const renderProfile = () => {
        if (!player) return;
        elements.gameContent.innerHTML = `
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
                ${Object.entries(player.attributes).map(([key, value]) => {
                    const isPrimary = gameData.positions[player.position].primaryAttributes.includes(key);
                    return `
                        <div class="attribute-item ${isPrimary ? 'highlighted' : ''}">
                            <h4>${gameData.attributeNames[key]}</h4>
                            <div class="attribute-progress">
                                <div class="attribute-progress-bar" style="width: ${value}%;"></div>
                                <span class="attribute-progress-text">${value}/100</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    };

    const renderTraining = () => {
        if (!player) return;
        elements.gameContent.innerHTML = `
            <h2 class="page-title">Antrenament</h2>
            <p>Ai <strong>${player.xpPoints}</strong> puncte XP disponibile. Fiecare punct crește un atribut cu 1 punct.</p>
            <button id="auto-train-btn" class="main-btn" ${player.xpPoints === 0 ? 'disabled' : ''}>Antrenează Automat</button>
            <div class="player-attributes">
                ${Object.entries(player.attributes).map(([key, value]) => {
                    const isPrimary = gameData.positions[player.position].primaryAttributes.includes(key);
                    return `
                        <div class="attribute-item ${isPrimary ? 'highlighted' : ''}">
                            <h4>${gameData.attributeNames[key]}</h4>
                            <div class="attribute-progress">
                                <div class="attribute-progress-bar" style="width: ${value}%;"></div>
                                <span class="attribute-progress-text">${value}/100</span>
                            </div>
                            <button class="train-btn main-btn" data-attribute="${key}" ${player.xpPoints === 0 || value >= 100 ? 'disabled' : ''}>Folosește 1 XP</button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        document.querySelectorAll('.train-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const attr = e.target.dataset.attribute;
                if (player.xpPoints > 0 && player.attributes[attr] < 100) {
                    player.attributes[attr]++;
                    player.xpPoints--;
                    player.overall = calculateOverall(player.attributes);
                    addLogEntry(`${gameData.attributeNames[attr]} a crescut la ${player.attributes[attr]}!`, 'success');
                    renderTraining();
                    updateGameInfoBar();
                    saveGameState();
                }
            });
        });

        document.getElementById('auto-train-btn')?.addEventListener('click', () => {
            while (player.xpPoints > 0) {
                const attrs = Object.keys(player.attributes).filter(attr => player.attributes[attr] < 100);
                if (!attrs.length) break;
                const randomAttr = attrs[Math.floor(Math.random() * attrs.length)];
                player.attributes[randomAttr]++;
                player.xpPoints--;
                player.overall = calculateOverall(player.attributes);
                addLogEntry(`Antrenament automat: ${gameData.attributeNames[randomAttr]} a crescut la ${player.attributes[randomAttr]}!`, 'success');
            }
            renderTraining();
            updateGameInfoBar();
            saveGameState();
        });
    };

    const renderStandings = () => {
        elements.gameContent.innerHTML = `
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
                    ${leagueStandings.map((team, index) => {
                        const isPlayerTeam = team.name === player.club;
                        return `
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
                    }).join('')}
                </tbody>
            </table>
        `;
    };

    const renderMatchPage = () => {
        let opponentIndex = Math.floor(Math.random() * leagueStandings.length);
        while (opponentIndex === playerTeamIndex) opponentIndex = Math.floor(Math.random() * leagueStandings.length);
        const opponent = leagueStandings[opponentIndex];

        elements.gameContent.innerHTML = `
            <h2 class="page-title">Ziua Meciului</h2>
            <div class="match-simulation">
                <div class="match-header">
                    <span>${player.club}</span>
                    <span id="match-score">0 - 0</span>
                    <span>${opponent.name}</span>
                </div>
                <div class="pitch-container">
                    <div class="ball-progress-bar" style="width: 50%;"></div>
                </div>
                <h3>Live Feed</h3>
                <div class="match-live-feed" id="match-log"></div>
            </div>
        `;

        simulateMatch(() => {
            const matchLogDiv = document.getElementById('match-log');
            const finalMessage = document.createElement('div');
            finalMessage.className = 'live-feed-entry success-message';
            finalMessage.textContent = 'Meci terminat. Apasă Next Day pentru a continua.';
            matchLogDiv?.appendChild(finalMessage);
            elements.nextDayBtn.disabled = false;
        });

        elements.nextDayBtn.disabled = true;
    };

    // Persistență (LocalStorage)
    const saveGameState = () => {
        localStorage.setItem('careerModeState', JSON.stringify({
            player,
            daysPassed,
            currentWeek,
            eventsLog,
            leagueStandings,
            playerTeamIndex
        }));
    };

    const loadGameState = () => {
        const savedState = localStorage.getItem('careerModeState');
        if (savedState) {
            const state = JSON.parse(savedState);
            player = state.player;
            daysPassed = state.daysPassed;
            currentWeek = state.currentWeek;
            eventsLog = state.eventsLog;
            leagueStandings = state.leagueStandings;
            playerTeamIndex = state.playerTeamIndex;
            elements.gameControls.classList.remove('hidden');
            renderPage('dashboard');
            updateGameInfoBar();
            addLogEntry('Joc încărcat din salvarea anterioară.', 'info');
        }
    };

    // Event Listeners
    const setupEventListeners = () => {
        elements.navLinks.forEach(link => {
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

        elements.startGameBtn.addEventListener('click', () => {
            elements.createPlayerModal.classList.remove('hidden');
        });

        elements.positionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.positionBtns.forEach(pBtn => pBtn.classList.remove('selected'));
                btn.classList.add('selected');
                selectedPosition = btn.dataset.position;
            });
        });

        elements.createPlayerBtn.addEventListener('click', () => {
            const name = elements.playerNameInput.value.trim();
            const nationality = elements.playerNationalitySelect.value;
            if (name && selectedPosition && nationality) {
                player = createPlayer(name, selectedPosition, nationality);
                if (player) {
                    elements.createPlayerModal.classList.add('hidden');
                    elements.gameControls.classList.remove('hidden');
                    addLogEntry('Carieră începută! Apasă "Next Day" pentru a avansa în timp.', 'success');
                    renderPage('dashboard');
                    updateGameInfoBar();
                    saveGameState();
                }
            } else {
                alert("Te rog să introduci un nume, naționalitate și să selectezi o poziție.");
            }
        });

        elements.nextDayBtn.addEventListener('click', advanceDay);
    };

    // Init
    document.addEventListener('DOMContentLoaded', () => {
        loadGameState(); // Încarcă salvarea dacă există
        setupEventListeners();
    });
})();
