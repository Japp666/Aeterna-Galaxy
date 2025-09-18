document.addEventListener('DOMContentLoaded', () => {
    const gameContent = document.getElementById('game-content');
    const navLinks = document.querySelectorAll('.main-nav a');
    const startGameBtn = document.getElementById('start-game-btn');

    let player = null;

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
        }
    };

    function createPlayer(name, position) {
        if (!gameData.positions[position]) {
            alert("Poziție invalidă. Te rog alege una din: goalkeeper, defender, midfielder, forward.");
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
            club: 'Amatori',
            attributes: baseAttributes,
            money: 0,
            trophies: [],
            goals: 0,
            assists: 0,
            overall: calculateOverall(baseAttributes)
        };
    }

    function calculateOverall(attributes) {
        const relevantAttrs = Object.values(attributes).filter(val => val > 0);
        const sum = relevantAttrs.reduce((acc, val) => acc + val, 0);
        return Math.floor(sum / relevantAttrs.length);
    }

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
                gameContent.innerHTML = '<h2>Pagina Transferuri</h2><p>Aici vei vedea ofertele de transfer.</p>';
                break;
            case 'life':
                gameContent.innerHTML = '<h2>Pagina Viața Jucătorului</h2><p>Cheltuiește-ți banii câștigați.</p>';
                break;
            case 'standings':
                gameContent.innerHTML = '<h2>Clasament</h2><p>Vezi poziția echipei tale.</p>';
                break;
            case 'competitions':
                gameContent.innerHTML = '<h2>Competiții</h2><p>Aici vei găsi detalii despre turnee.</p>';
                break;
            case 'trophies':
                gameContent.innerHTML = '<h2>Trofee</h2><p>Colecția ta de trofee.</p>';
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
        `;
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
                <p><strong>Overall Rating:</strong> ${player.overall}</p>
            </div>
            <h3>Atribute</h3>
            <div class="player-attributes">
        `;

        for (const [key, value] of Object.entries(player.attributes)) {
            const isPrimary = gameData.positions[player.position].primaryAttributes.includes(key);
            html += `
                <div class="attribute-item ${isPrimary ? 'highlighted' : ''}">
                    <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                    <p class="attribute-value">${value}</p>
                </div>
            `;
        }
        html += `</div>`;
        gameContent.innerHTML = html;
    }

    function renderTraining() {
        gameContent.innerHTML = `<h2>Antrenament</h2><p>Alege un atribut pe care vrei să-l îmbunătățești:</p>`;
        // Aici vom adăuga logica pentru antrenament
    }

    function setupEventListeners() {
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

        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                const playerName = prompt("Introduceți numele jucătorului:");
                const playerPosition = prompt("Introduceți poziția (goalkeeper, defender, midfielder, forward):");
                if (playerName && playerPosition) {
                    player = createPlayer(playerName, playerPosition.toLowerCase());
                    if (player) {
                        renderPage('dashboard');
                    }
                } else {
                    alert("Vă rugăm să introduceți un nume și o poziție validă.");
                }
            });
        }
    }

    setupEventListeners();
});
