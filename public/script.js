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

    // Game State
    let player = null;
    let selectedPosition = null;
    let isTraining = false;
    let daysPassed = 0;
    let currentWeek = 1;
    let eventsLog = [];

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
            tier1: { name: 'Amatori', salary: 100, overallMin: 0, performanceMin: 0 },
            tier2: { name: 'Liga Secundă', salary: 500, overallMin: 65, performanceMin: 15 },
            tier3: { name: 'Club de Top', salary: 5000, overallMin: 80, performanceMin: 20 }
        }
    };

    // --- Core Functions ---

    function createPlayer(name, position) {
        if (!gameData.positions[position]) {
            alert("Poziție invalidă. Te rog alege una din: Portar, Fundaș, Mijlocaș, Atacant.");
            return null;
        }
        
        const baseAttributes = {
            shooting: 20,
            passing: 20,
            dribbling: 20,
            defense: 20,
            goalkeeping: 20,
            pace: 20,
            strength: 20,
            stamina: 20
        };

        const primaryAttrs = gameData.positions[position].primaryAttributes;
        primaryAttrs.forEach(attr => {
            if (baseAttributes.hasOwnProperty(attr)) {
                baseAttributes[attr] += 15;
            }
        });

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

    function addLogEntry(message, type = 'info') {
        eventsLog.push({ message, type });
        if (eventsLog.length > 10) {
            eventsLog.shift();
        }
        renderPage('dashboard');
    }

    function checkTransfers() {
        if (player.overall >= gameData.clubTiers.tier2.overallMin && player.goalsSeason >= gameData.clubTiers.tier2.performanceMin) {
            // Placeholder pentru a simula o ofertă
            const newClub = gameData.clubTiers.tier2.name;
            const newSalary = gameData.clubTiers.tier2.salary;
            addLogEntry(`Ai primit o ofertă de transfer de la ${newClub} cu un salariu de ${newSalary}€!`, 'success');
        }
    }

    function advanceDay() {
        daysPassed++;
        if (daysPassed % 7 === 0) {
            currentWeek++;
            player.money += player.salary;
            addLogEntry(`Săptămâna s-a încheiat. Ai primit salariul de ${player.salary}€.`);

            // La fiecare 4 săptămâni, se simulează un meci
            if (currentWeek % 4 === 0) {
                simulateMatch();
            }
        }

        checkTransfers();
        renderPage('dashboard');
    }

    function simulateMatch() {
        // Simulare simplă bazată pe OVR-ul jucătorului
        const playerRating = player.overall;
        const opponentRating = Math.floor(Math.random() * (playerRating + 10) + (playerRating - 20)); // Adversarul are un OVR similar

        let playerPerformance = 0; // Nota de la 1 la 10
        let goalsScored = 0;
        let assistsGiven = 0;

        if (player.position === 'forward') {
            goalsScored = Math.floor(Math.random() * (player.attributes.shooting / 15));
            assistsGiven = Math.floor(Math.random() * (player.attributes.passing / 20));
        }
        
        // Calculul notei de performanță
        playerPerformance = Math.min(10, Math.max(5, Math.floor(goalsScored * 2 + assistsGiven * 1.5 + (playerRating - opponentRating) / 10 + 5)));

        player.goalsSeason += goalsScored;
        player.assistsSeason += assistsGiven;

        const xpGained = playerPerformance;
        player.xpPoints += xpGained;

        const matchMessage = `Ai jucat un meci! Nota ta de performanță este ${playerPerformance}/10. Ai marcat ${goalsScored} goluri și ai oferit ${assistsGiven} pase de gol. Ai câștigat ${xpGained} puncte de XP!`;
        addLogEntry(matchMessage, 'info');
    }

    // --- Rendering Functions ---

    function renderPage(pageId) {
        gameContent.innerHTML = '';
        switch (pageId) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'profile':
                renderProfile();
                break;
            case 'training':
                renderTraining();
                break;
            case 'transfers':
                gameContent.innerHTML = `
                    <h2>Pagina Transferuri</h2>
                    <p>Aici vei vedea ofertele de transfer și îți vei negocia contractele.</p>
                `;
                break;
            case 'life':
                gameContent.innerHTML = `
                    <h2>Pagina Viața Jucătorului</h2>
                    <p>Fonduri disponibile: <strong>${player.money}€</strong></p>
                    <p>Cheltuiește-ți banii câștigați pe diverse bunuri și servicii.</p>
                `;
                break;
            case 'standings':
                gameContent.innerHTML = `
                    <h2>Clasament</h2>
                    <p>Poziția echipei tale în ligă.</p>
                `;
                break;
            case 'competitions':
                gameContent.innerHTML = `
                    <h2>Competiții</h2>
                    <p>Aici vei găsi detalii despre turneele la care participi.</p>
                `;
                break;
            case 'trophies':
                gameContent.innerHTML = `
                    <h2>Trofee</h2>
                    <p>Colecția ta de trofee personale și de echipă.</p>
                `;
                break;
            default:
                break;
        }
    }

    function renderDashboard() {
        if (!player) return;
        let html = `
            <h2>Bine ai venit, ${player.name}!</h2>
            <p>Ești un tânăr de <strong>${player.age}</strong> ani, jucând la clubul <strong>${player.club}</strong>.</p>
            <p>Overall Rating: <strong>${player.overall}</strong></p>
            <p>Puncte XP disponibile: <strong>${player.xpPoints}</strong></p>
            <p>Zile trecute: <strong>${daysPassed}</strong></p>
            <p>Săptămâna curentă: <strong>${currentWeek}</strong></p>
            <h3>Jurnal de Activitate</h3>
            <div class="event-log">
        `;
        
        eventsLog.forEach(log => {
            html += `<div class="log-entry ${log.type}-message">${log.message}</div>`;
        });
        html += `</div>`;
        
        gameContent.innerHTML = html;
    }

    function renderProfile() {
        if (!player) return;
        let html = `
            <h2>Profilul tău de Jucător</h2>
            <div class="player-info">
                <p><strong>Nume:</strong> ${player.name}</p>
                <p><strong>Vârstă:</strong> ${player.age}</p>
                <p><strong>Poziție:</strong> ${gameData.positions[player.position].name}</p>
                <p><strong>Club:</strong> ${player.club}</p>
                <p><strong>Overall Rating:</strong> ${player.overall} (OVR)</p>
                <p><strong>Salariu:</strong> ${player.salary}€/săptămână</p>
                <p><strong>Bani:</strong> ${player.money}€</p>
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
                    <p class="attribute-value">${value}</p>
                </div>
            `;
        }
        html += `</div>`;
        gameContent.innerHTML = html;
    }

    function renderTraining() {
        if (!player) return;
        let html = `
            <h2>Antrenament</h2>
            <p>Alege un atribut pe care vrei să-l îmbunătățești. Ai <strong>${player.xpPoints}</strong> puncte XP disponibile.</p>
            <p class="game-message info-message">Fiecare punct de XP crește un atribut cu 1 punct.</p>
            <div class="training-options player-attributes">
        `;
        
        for (const [key, value] of Object.entries(player.attributes)) {
            const isPrimary = gameData.positions[player.position].primaryAttributes.includes(key);
            html += `
                <div class="attribute-item ${isPrimary ? 'highlighted' : ''}">
                    <h4>${gameData.attributeNames[key]}</h4>
                    <p class="attribute-value">${value}</p>
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
                    player.attributes[attributeToTrain] += 1;
                    player.overall = calculateOverall(player.attributes);
                    player.xpPoints--;
                    addLogEntry(`${gameData.attributeNames[attributeToTrain]} a crescut la ${player.attributes[attributeToTrain]}!`, 'success');
                    renderTraining();
                }
            });
        });
    }

    // --- Event Listeners & Initialization ---

    function setupEventListeners() {
        // Navigație
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.target.id.replace('nav-', '');
                if (player) {
                    renderPage(pageId);
                } else {
                    alert("Trebuie să începi o carieră nouă mai întâi!");
                }
            });
        });

        // Butonul "Începe Cariera Nouă"
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                createPlayerModal.classList.remove('hidden');
            });
        }

        // Selectarea poziției
        positionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                positionBtns.forEach(pBtn => pBtn.classList.remove('selected'));
                btn.classList.add('selected');
                selectedPosition = btn.dataset.position;
            });
        });

        // Butonul "Creează Jucătorul"
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
                    }
                } else {
                    alert("Te rog să introduci un nume și să selectezi o poziție.");
                }
            });
        }
        
        // Butonul "Next Day"
        if (nextDayBtn) {
            nextDayBtn.addEventListener('click', advanceDay);
        }
    }

    setupEventListeners();
});
