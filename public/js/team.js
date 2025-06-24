// js/team.js - Logica pentru gestionarea și afișarea echipei, a tacticii și drag-and-drop

import { getGameState, updateGameState } from './game-state.js';

// Liste pentru generarea numelor sci-fi
const firstNames = [
    "Astra", "Blaze", "Cinder", "Dax", "Echo", "Flux", "Gale", "Helix", "Ion", "Jett",
    "Kael", "Lyra", "Miro", "Nix", "Orion", "Pixel", "Quasar", "Rune", "Stryker", "Terra",
    "Umbra", "Vortex", "Wisp", "Xylon", "Yara", "Zenith", "Cygnus", "Nebula", "Sol", "Luna"
];

const lastNames = [
    "Blade", "Crest", "Drift", "Forge", "Glyph", "Haven", "Kinetic", "Lux", "Matrix", "Nexo",
    "Pulse", "Quake", "Rift", "Shade", "Spark", "Thorn", "Vance", "Whisper", "Xenon", "Zephyr",
    "Starwalker", "Void", "Cosmos", "Quantum", "Galactic", "Interstellar", "Astro", "Nova"
];

// Pozițiile posibile ale jucătorilor
const positions = ["Portar", "Fundaș", "Mijlocaș", "Atacant"];

// Definirea pragurilor pentru raritate în baza OvR (culorile sunt definite în CSS)
const rarityTiers = {
    'normal': { minOvR: 50, maxOvR: 65 },
    'rare': { minOvR: 66, maxOvR: 75 },
    'very-rare': { minOvR: 76, maxOvR: 85 },
    'legendary': { minOvR: 86, maxOvR: 92 },
    'superstar': { minOvR: 93, maxOvR: 99 }
};

// Obiect pentru a stoca formațiile predefinite
const formations = {
    '4-4-2': {
        name: '4-4-2',
        slots: {
            GK1: { type: 'Portar', required: true },
            DF1: { type: 'Fundaș', required: true }, DF2: { type: 'Fundaș', required: true }, DF3: { type: 'Fundaș', required: true }, DF4: { type: 'Fundaș', required: true },
            MF1: { type: 'Mijlocaș', required: true }, MF2: { type: 'Mijlocaș', required: true }, MF3: { type: 'Mijlocaș', required: true }, MF4: { type: 'Mijlocaș', required: true },
            FW1: { type: 'Atacant', required: true }, FW2: { type: 'Atacant', required: true }
        }
    },
    '4-3-3': {
        name: '4-3-3',
        slots: {
            GK1: { type: 'Portar', required: true },
            DF1: { type: 'Fundaș', required: true }, DF2: { type: 'Fundaș', required: true }, DF3: { type: 'Fundaș', required: true }, DF4: { type: 'Fundaș', required: true },
            MF1: { type: 'Mijlocaș', required: true }, MF2: { type: 'Mijlocaș', required: true }, MF3: { type: 'Mijlocaș', required: true },
            FW1: { type: 'Atacant', required: true }, FW2: { type: 'Atacant', required: true }, FW3: { type: 'Atacant', required: true }
        }
    },
    '3-5-2': {
        name: '3-5-2',
        slots: {
            GK1: { type: 'Portar', required: true },
            DF1: { type: 'Fundaș', required: true }, DF2: { type: 'Fundaș', required: true }, DF3: { type: 'Fundaș', required: true },
            MF1: { type: 'Mijlocaș', required: true }, MF2: { type: 'Mijlocaș', required: true }, MF3: { type: 'Mijlocaș', required: true }, MF4: { type: 'Mijlocaș', required: true }, MF5: { type: 'Mijlocaș', required: true },
            FW1: { type: 'Atacant', required: true }, FW2: { type: 'Atacant', required: true }
        }
    }
};

let currentDraggedPlayerId = null;

/**
 * Generează un OvR aleatoriu în intervalul specificat.
 * @param {number} min - Overall minim.
 * @param {number} max - Overall maxim.
 * @returns {number} Overall generat.
 */
function getRandomOverall(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Atribuie raritatea bazată pe OvR.
 * @param {number} ovr - Overall Rating-ul jucătorului.
 * @returns {string} Numele rarității (ex: 'normal', 'rare').
 */
export function getRarityByOverall(ovr) {
    for (const tier in rarityTiers) {
        if (ovr >= rarityTiers[tier].minOvR && ovr <= rarityTiers[tier].maxOvR) {
            return tier;
        }
    }
    return 'normal'; // Fallback
}

/**
 * Generează un singur jucător cu atribute aleatorii.
 * @returns {object} Obiectul jucătorului.
 */
function generatePlayer() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = getRandomOverall(18, 32); // Vârstă între 18 și 32

    let ovr;
    const randomChance = Math.random();
    if (randomChance < 0.6) {
        ovr = getRandomOverall(rarityTiers.normal.minOvR, rarityTiers.normal.maxOvR);
    } else if (randomChance < 0.85) {
        ovr = getRandomOverall(rarityTiers.rare.minOvR, rarityTiers.rare.maxOvR);
    } else if (randomChance < 0.95) {
        ovr = getRandomOverall(rarityTiers['very-rare'].minOvR, rarityTiers['very-rare'].maxOvR);
    } else if (randomChance < 0.99) {
        ovr = getRandomOverall(rarityTiers.legendary.minOvR, rarityTiers.legendary.maxOvR);
    } else {
        ovr = getRandomOverall(rarityTiers.superstar.minOvR, rarityTiers.superstar.maxOvR);
    }

    const position = positions[Math.floor(Math.random() * positions.length)];

    const rarity = getRarityByOverall(ovr);
    const salary = Math.round((ovr * 1000 + Math.random() * 5000) / 100) * 100;
    const energy = 100;

    return {
        id: Date.now() + Math.random(),
        name: `${firstName} ${lastName}`,
        age: age,
        position: position, // Poziția principală a jucătorului (ex: Fundaș)
        overall: ovr,
        rarity: rarity,
        salary: salary,
        energy: energy,
        currentSlot: null, // NOU: ID-ul slotului pe teren unde se află jucătorul (ex: 'GK1', 'MF2')
        isOnPitch: false // NOU: Flag pentru a ști dacă jucătorul este pe teren sau în bancă
    };
}

/**
 * Generează un număr specificat de jucători inițiali pentru echipă.
 * @param {number} count - Numărul de jucători de generat.
 * @returns {Array<object>} Un array de obiecte jucător.
 */
export function generateInitialPlayers(count) {
    const players = [];
    for (let i = 0; i < count; i++) {
        players.push(generatePlayer());
    }
    return players;
}

/**
 * Randarea unui card de jucător.
 * @param {object} player - Obiectul jucătorului.
 * @param {boolean} onPitch - True dacă jucătorul este pe teren, false dacă este în roster.
 * @returns {HTMLElement} Elementul HTML al cardului jucătorului.
 */
function createPlayerCard(player, onPitch = false) {
    const playerCard = document.createElement('div');
    playerCard.classList.add('player-card', `rarity-${player.rarity}`);
    if (onPitch) {
        playerCard.classList.add('on-pitch');
    }
    playerCard.setAttribute('draggable', 'true'); // Make cards draggable
    playerCard.dataset.playerId = player.id; // Store player ID for drag-and-drop

    playerCard.innerHTML = `
        <h3>${player.name.split(' ')[1].substring(0, 5)}</h3> <p>${player.overall} OvR</p>
        ${onPitch ? `<p>${player.position.substring(0, 3).toUpperCase()}</p>` : ''}
    `;

    // Adaugă event listener pentru drag-start
    playerCard.addEventListener('dragstart', (e) => {
        currentDraggedPlayerId = player.id;
        e.dataTransfer.setData('text/plain', player.id);
        playerCard.classList.add('dragging'); // Adaugă clasă pentru stilizare în timpul drag-ului
    });

    playerCard.addEventListener('dragend', () => {
        playerCard.classList.remove('dragging');
        currentDraggedPlayerId = null;
    });

    return playerCard;
}

/**
 * Randarea lotului de jucători (bancă de rezerve).
 */
function renderRoster() {
    const rosterContainer = document.getElementById('roster');
    rosterContainer.innerHTML = '';

    const gameState = getGameState();
    // Filtrează jucătorii care NU sunt pe teren
    const playersInRoster = gameState.players.filter(p => !p.isOnPitch);

    if (playersInRoster.length === 0) {
        rosterContainer.innerHTML = '<p>Banca de rezerve este goală. Toți jucătorii sunt pe teren!</p>';
        return;
    }

    playersInRoster.forEach(player => {
        rosterContainer.appendChild(createPlayerCard(player, false)); // false = nu e pe teren
    });
}

/**
 * Randarea terenului de fotbal și a jucătorilor pe el.
 * @param {string} formationName - Numele formației curente (ex: '4-4-2').
 */
function renderPitch(formationName) {
    const pitch = document.getElementById('football-pitch');
    const allSlots = pitch.querySelectorAll('.player-slot');

    // Resetăm toate sloturile la starea inițială (goale)
    allSlots.forEach(slot => {
        slot.innerHTML = ''; // Curăță orice jucător existent
        slot.classList.remove('occupied'); // Scoate clasa 'occupied'
        slot.dataset.playerId = ''; // Golește ID-ul jucătorului asociat
    });

    const gameState = getGameState();
    const currentFormation = formations[formationName];

    if (!currentFormation) {
        console.error(`Formația "${formationName}" nu a fost găsită.`);
        return;
    }

    // Identificăm sloturile necesare pentru formația curentă
    // și le umplem cu jucători existent pe teren din gameState
    for (const slotId in currentFormation.slots) {
        const slotElement = pitch.querySelector(`[data-slot-id="${slotId}"]`);
        if (slotElement) {
            const playerInSlot = gameState.players.find(p => p.currentSlot === slotId);

            if (playerInSlot) {
                slotElement.appendChild(createPlayerCard(playerInSlot, true)); // true = e pe teren
                slotElement.classList.add('occupied');
                slotElement.dataset.playerId = playerInSlot.id;
            }
        }
    }

    // Adăugăm event listeners pentru drag-and-drop pe sloturi
    allSlots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault(); // Permite drop-ul
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');

            const playerIdToMove = e.dataTransfer.getData('text/plain');
            const player = gameState.players.find(p => p.id == playerIdToMove); // Folosim == pentru a compara string cu number

            if (!player) {
                console.error("Jucătorul tras nu a fost găsit.");
                return;
            }

            const targetSlotId = slot.dataset.slotId;
            const targetPositionType = slot.dataset.positionType;

            // Validare poziție: jucătorul poate fi plasat doar în sloturi de poziția sa sau GK dacă e portar
            if (player.position !== targetPositionType && !(player.position === 'Portar' && targetPositionType === 'Portar')) {
                console.warn(`Jucătorul ${player.name} (${player.position}) nu poate fi plasat în slotul ${targetSlotId} (${targetPositionType}).`);
                alert(`Jucătorul ${player.name} este ${player.position} și nu poate juca ${targetPositionType}.`);
                return;
            }

            // Găsim slotul de unde a venit jucătorul (dacă a venit de pe teren)
            const previousSlot = document.querySelector(`[data-slot-id="${player.currentSlot}"]`);

            // Actualizăm starea jucătorilor
            updateGameState({
                players: gameState.players.map(p => {
                    if (p.id == playerIdToMove) {
                        // Dacă slotul țintă este deja ocupat, schimbăm jucătorii
                        const playerCurrentlyInSlot = gameState.players.find(pp => pp.currentSlot === targetSlotId);
                        if (playerCurrentlyInSlot) {
                            p.currentSlot = targetSlotId;
                            p.isOnPitch = true;
                            // Trimitem jucătorul existent în bancă
                            return { ...p, currentSlot: targetSlotId, isOnPitch: true };
                        } else {
                            return { ...p, currentSlot: targetSlotId, isOnPitch: true };
                        }
                    } else if (p.currentSlot === targetSlotId) {
                        // Jucătorul care era în slotul țintă este mutat în bancă
                        return { ...p, currentSlot: null, isOnPitch: false };
                    }
                    return p;
                })
            });

            // Re-randăm terenul și rosterul pentru a reflecta schimbările
            initTeamTab(); // Re-inițializăm tot tab-ul
        });
    });

    // Adaugă funcționalitatea de drop și pentru roster container (pentru a trimite jucători de pe teren în bancă)
    rosterContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        rosterContainer.classList.add('drag-over'); // Poți adăuga un stil 'drag-over' pentru roster
    });

    rosterContainer.addEventListener('dragleave', () => {
        rosterContainer.classList.remove('drag-over');
    });

    rosterContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        rosterContainer.classList.remove('drag-over');

        const playerIdToMove = e.dataTransfer.getData('text/plain');
        const player = gameState.players.find(p => p.id == playerIdToMove);

        if (player && player.isOnPitch) { // Doar dacă vine de pe teren
            updateGameState({
                players: gameState.players.map(p => {
                    if (p.id == playerIdToMove) {
                        return { ...p, currentSlot: null, isOnPitch: false };
                    }
                    return p;
                })
            });
            initTeamTab(); // Re-randăm
        }
    });

}

/**
 * Inițializează selecția de formații și mentalități.
 */
function initTacticsControls() {
    const formationSelect = document.getElementById('formation-select');
    const mentalitySelect = document.getElementById('mentality-select');

    // Populatează dropdown-ul de formații (dacă este cazul)
    // Momentan, este populat direct în HTML, dar se poate și din JS
    // for (const key in formations) {
    //     const option = document.createElement('option');
    //     option.value = key;
    //     option.textContent = formations[key].name;
    //     formationSelect.appendChild(option);
    // }

    // Setează formația și mentalitatea inițială din gameState, dacă există
    const gameState = getGameState();
    if (!gameState.currentFormation) {
        updateGameState({
            currentFormation: '4-4-2', // Formație default
            currentMentality: 'normal' // Mentalitate default
        });
    }
    formationSelect.value = gameState.currentFormation || '4-4-2';
    mentalitySelect.value = gameState.currentMentality || 'normal';


    formationSelect.addEventListener('change', (e) => {
        const newFormation = e.target.value;
        // La schimbarea formației, va trebui să rearanjăm jucătorii
        // TODO: Adaugă logică pentru a goli/rearanja sloturile jucătorilor când se schimbă formația
        updateGameState({ currentFormation: newFormation });
        renderPitch(newFormation); // Re-randăm terenul cu noua formație
        // Aici ar trebui să verificăm dacă jucătorii din formația veche mai sunt compatibili
        // Momentan, lasă-i pe teren, se vor ajusta la drag-and-drop.
    });

    mentalitySelect.addEventListener('change', (e) => {
        updateGameState({ currentMentality: e.target.value });
        console.log(`Mentalitatea a fost schimbată la: ${getGameState().currentMentality}`);
        // Aici poți adăuga efecte vizuale sau logice bazate pe mentalitate
    });
}


/**
 * Inițializează tab-ul Echipă (Team).
 */
export function initTeamTab() {
    initTacticsControls(); // Inițializăm controalele de tactică
    const gameState = getGameState();

    // Dacă nu avem jucători alocați la sloturi, îi alocăm inițial aleatoriu
    // Această logică se va executa o singură dată la prima afișare a tab-ului
    // sau la începutul unui joc nou, pentru a avea o formație inițială.
    if (!gameState.players.some(p => p.isOnPitch)) {
        console.log("Alocare inițială a jucătorilor pe teren...");
        const playersCopy = [...gameState.players];
        const formationSlots = Object.keys(formations[gameState.currentFormation || '4-4-2'].slots);
        let playersUpdated = 0;

        for (const slotId of formationSlots) {
            const slotConfig = formations[gameState.currentFormation || '4-4-2'].slots[slotId];
            // Caută cel mai bun jucător disponibil pentru acea poziție
            const suitablePlayerIndex = playersCopy.findIndex(p =>
                !p.isOnPitch && p.position === slotConfig.type // Verifică poziția principală a jucătorului
            );

            if (suitablePlayerIndex !== -1) {
                playersCopy[suitablePlayerIndex].isOnPitch = true;
                playersCopy[suitablePlayerIndex].currentSlot = slotId;
                playersUpdated++;
            } else {
                // Dacă nu găsim un jucător de poziția exactă, ia primul disponibil care nu e pe teren
                const anyAvailablePlayerIndex = playersCopy.findIndex(p => !p.isOnPitch);
                if (anyAvailablePlayerIndex !== -1) {
                    playersCopy[anyAvailablePlayerIndex].isOnPitch = true;
                    playersCopy[anyAvailablePlayerIndex].currentSlot = slotId;
                    playersUpdated++;
                }
            }
        }
        if (playersUpdated > 0) {
            updateGameState({ players: playersCopy });
        }
    }

    renderPitch(gameState.currentFormation || '4-4-2'); // Randăm terenul cu formația curentă
    renderRoster(); // Randăm roster-ul (jucătorii de pe bancă)
}
