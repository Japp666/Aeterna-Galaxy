import { setPlayerRace, getPlayer, sendSpyDrone, launchAttack } from './user.js';
import { updateHUD } from './hud.js';

export function showMessage(message, type) {
    const messageContainer = document.querySelector('.message-container');
    if (!messageContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

export function showRaceSelectionScreen() {
    return new Promise((resolve) => {
        const raceSelectionScreen = document.getElementById('race-selection-screen');
        if (!raceSelectionScreen) {
            console.error("Elementul #race-selection-screen nu a fost găsit.");
            resolve();
            return;
        }

        const races = [
            {
                id: 'solari',
                name: 'Solari',
                description: 'O rasă avansată tehnologic, specializată în energie solară.',
                image: 'https://i.postimg.cc/d07m01yM/fundal-joc.png'
            },
            {
                id: 'coming-soon',
                name: 'Curând',
                description: 'Această rasă va fi disponibilă în curând.',
                image: 'https://i.postimg.cc/d07m01yM/fundal-joc.png',
                disabled: true
            }
        ];

        const raceCardsContainer = raceSelectionScreen.querySelector('.race-cards-container');
        raceCardsContainer.innerHTML = '';

        races.forEach(race => {
            const raceCard = document.createElement('div');
            raceCard.className = 'race-card';
            raceCard.innerHTML = `
                <img src="${race.image}" alt="${race.name}">
                <h3>${race.name}</h3>
                <p>${race.description}</p>
                ${race.disabled ? '<p>Indisponibil</p>' : '<button class="race-select-button" data-race-id="' + race.id + '">Selectează</button>'}
            `;
            raceCardsContainer.appendChild(raceCard);
        });

        raceSelectionScreen.style.display = 'flex';

        const selectButtons = raceCardsContainer.querySelectorAll('.race-select-button');
        selectButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const raceId = event.target.dataset.raceId;
                try {
                    await setPlayerRace(raceId);
                    raceSelectionScreen.style.display = 'none';
                    updateHUD();
                    resolve();
                } catch (error) {
                    showMessage('Eroare la selectarea rasei!', 'error');
                    resolve();
                }
            });
        });
    });
}

export function initSpyReports() {
    const player = getPlayer();
    const reportsContainer = document.createElement('div');
    reportsContainer.className = 'spy-reports';
    reportsContainer.innerHTML = `
        <h3>Rapoarte de Spionaj</h3>
        <input type="text" id="spy-filter" placeholder="Filtrează după jucător...">
        <table>
            <thead>
                <tr>
                    <th>Jucător</th>
                    <th>Unități</th>
                    <th>Resurse</th>
                    <th>Defensive</th>
                    <th>Dată</th>
                    <th>Acțiuni</th>
                </tr>
            </thead>
            <tbody id="spy-reports-body"></tbody>
        </table>
    `;
    document.querySelector('#game-container').appendChild(reportsContainer);

    function renderReports(filter = '') {
        const tbody = document.getElementById('spy-reports-body');
        tbody.innerHTML = '';
        (player.spyReports || []).filter(report => report.player.toLowerCase().includes(filter.toLowerCase())).forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${report.player}</td>
                <td>${Object.entries(report.units).map(([type, count]) => `${type}: ${count}`).join(', ')}</td>
                <td>Metal: ${report.resources.metal}, Cristal: ${report.resources.crystal}, Heliu: ${report.resources.helium}</td>
                <td>${report.defenses ? Object.entries(report.defenses).map(([type, level]) => `${type}: nivel ${level}`).join(', ') : 'Niciuna'}</td>
                <td>${new Date(report.date).toLocaleString()}</td>
                <td><button class="attack-button" data-player="${report.player}">Atac Rapid</button></td>
            `;
            tbody.appendChild(row);
        });
    }

    renderReports();
    document.getElementById('spy-filter').addEventListener('input', (e) => renderReports(e.target.value));

    document.querySelectorAll('.attack-button').forEach(button => {
        button.addEventListener('click', () => {
            const targetPlayer = button.dataset.player;
            showAttackModal(targetPlayer);
        });
    });
}

function showAttackModal(targetPlayer) {
    const player = getPlayer();
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="attack-modal">
            <h3>Atac către ${targetPlayer}</h3>
            <p>Distanță: ${Math.round(Math.random() * 100)} unități</p>
            <p>Putere inamic (estimată): ${calculateEnemyPower(targetPlayer)}</p>
            <div>
                <label>Soldați: <input type="number" id="attack-soldiers" min="0" max="${player.units.soldiers || 0}" value="0"></label>
                <label>Drone: <input type="number" id="attack-drones" min="0" max="${player.units.drones || 0}" value="0"></label>
                <label>Tancuri: <input type="number" id="attack-tanks" min="0" max="${player.units.tanks || 0}" value="0"></label>
                <label>Aeronave: <input type="number" id="attack-aircraft" min="0" max="${player.units.aircraft || 0}" value="0"></label>
                <label>Transportoare: <input type="number" id="attack-transports" min="0" max="${player.units.transports || 0}" value="0"></label>
            </div>
            <p>Putere flotă: <span id="fleet-power">0</span></p>
            <p>Consum heliu (dus-întors): <span id="helium-cost">0</span></p>
            <button class="attack-button">Lansează Atac</button>
            <button class="close-button">Anulează</button>
        </div>
    `;
    document.body.appendChild(modal);

    function updateFleetPower() {
        const soldiers = parseInt(document.getElementById('attack-soldiers').value) || 0;
        const drones = parseInt(document.getElementById('attack-drones').value) || 0;
        const tanks = parseInt(document.getElementById('attack-tanks').value) || 0;
        const aircraft = parseInt(document.getElementById('attack-aircraft').value) || 0;
        const transports = parseInt(document.getElementById('attack-transports').value) || 0;

        const power = soldiers * (17 + player.researches.railgun * 2 + player.researches.exoskeleton * 1 + player.researches.training * 0.5) +
                      drones * (23 + player.researches.laser * 2 + player.researches.shield * 1 + player.researches.propulsion * 0.5) +
                      tanks * (48 + player.researches.plasma * 3 + player.researches.armor * 2 + player.researches.traction * 0.3) +
                      aircraft * (57 + player.researches.photon * 3 + player.researches.nano * 1.5 + player.researches.hyper * 0.5) +
                      transports * 11;
        const helium = (soldiers * 1 + drones * 2 + tanks * 5 + aircraft * 10 + transports * 3) * 2;

        document.getElementById('fleet-power').textContent = Math.round(power);
        document.getElementById('helium-cost').textContent = Math.round(helium);
    }

    document.querySelectorAll('.attack-modal input').forEach(input => {
        input.addEventListener('input', updateFleetPower);
    });

    document.querySelector('.attack-button').addEventListener('click', async () => {
        const fleet = {
            soldiers: parseInt(document.getElementById('attack-soldiers').value) || 0,
            drones: parseInt(document.getElementById('attack-drones').value) || 0,
            tanks: parseInt(document.getElementById('attack-tanks').value) || 0,
            aircraft: parseInt(document.getElementById('attack-aircraft').value) || 0,
            transports: parseInt(document.getElementById('attack-transports').value) || 0
        };
        try {
            await launchAttack(targetPlayer, fleet);
            showMessage(`Atac lansat către ${targetPlayer}!`, 'success');
            modal.remove();
        } catch (error) {
            showMessage('Eroare la lansarea atacului!', 'error');
        }
    });

    document.querySelector('.close-button').addEventListener('click', () => modal.remove());
}

function calculateEnemyPower(targetPlayer) {
    const report = getPlayer().spyReports?.find(r => r.player === targetPlayer);
    if (!report) return 0;
    return (report.units.soldiers || 0) * 17 + (report.units.drones || 0) * 23 + (report.units.tanks || 0) * 48 + (report.units.aircraft || 0) * 57;
}
