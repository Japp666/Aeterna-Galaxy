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
 * Randarea unui card de jucător pentru teren (simplificat).
 * @param {object} player - Obiectul jucătorului.
 * @returns {HTMLElement} Elementul HTML al cardului jucătorului pentru teren.
 */
function createPitchPlayerCard(player) {
    const playerCard = document.createElement('div');
    playerCard.classList.add('player-card', 'on-pitch', `rarity-${player.rarity}`);
    playerCard.setAttribute('draggable', 'true');
    playerCard.dataset.playerId = player.id;

    playerCard.innerHTML = `
        <h3>${player.name.split(' ')[1].substring(0, 5)}</h3>
        <p>${player.overall} OvR</p>
        <p>${player.position.substring(0, 3).toUpperCase()}</p>
    `;

    playerCard.addEventListener('dragstart', (e) => {
        currentDraggedPlayerId = player.id;
        e.dataTransfer.setData('text/plain', player.id);
        playerCard.classList.add('dragging');
        // Creăm o imagine fantomă pentru drag
        const ghostElement = playerCard.cloneNode(true);
        ghostElement.classList.add('dragging-ghost'); // Adăugăm o clasă pentru a o identifica
        ghostElement.style.position = 'absolute';
        ghostElement.style.top = '-1000px'; // Mutăm în afara ecranului
        document.body.appendChild(ghostElement);
        e.dataTransfer.setDragImage(ghostElement, e.offsetX, e.offsetY);
    });

    playerCard.addEventListener('dragend', () => {
        playerCard.classList.remove('dragging');
        const ghostElement = document.querySelector('.player-card.dragging-ghost');
        if (ghostElement) {
            ghostElement.remove();
        }
    });

    return playerCard;
}


/**
 * Randarea lotului de jucători într-un tabel (bancă de rezerve).
 */
function renderRoster() {
    const rosterTbody = document.getElementById('roster-tbody');
    const emptyMessage = document.getElementById('empty-roster-message');
    const rosterContainer = document.querySelector('.roster-table-container');

    if (!rosterTbody || !emptyMessage || !rosterContainer) {
        console.error("Elementele tabelului lotului nu au fost găsite.");
        return;
    }
    rosterTbody.innerHTML = ''; // Curățăm tabelul

    const gameState = getGameState();
    const playersInRoster = gameState.players.filter(p => !p.isOnPitch);

    if (playersInRoster.length === 0) {
        emptyMessage.style.display = 'block'; // Afișăm mesajul
        rosterTbody.style.display = 'none'; // Ascundem tabelul
    } else {
        emptyMessage.style.display = 'none'; // Ascundem mesajul
        rosterTbody.style.display = 'table-row-group'; // Afișăm tbody-ul (default display pentru tbody)
        playersInRoster.forEach(player => {
            const row = document.createElement('tr');
            row.classList.add('roster-table-row', `rarity-${player.rarity}`);
            row.setAttribute('draggable', 'true');
            row.dataset.playerId = player.id;

            row.innerHTML = `
                <td class="player-name">${player.name}</td>
                <td>${player.position}</td>
                <td>${player.overall}</td>
                <td>${player.age}</td>
                <td>${player.salary.toLocaleString('ro-RO')} €</td>
                <td>${player.energy}%</td>
                <td>${player.rarity.charAt(0).toUpperCase() + player.rarity.slice(1).replace('-', ' ')}</td>
            `;

            row.addEventListener('dragstart', (e) => {
                currentDraggedPlayerId = player.id;
                e.dataTransfer.setData('text/plain', player.id);
                row.classList.add('dragging');
                 // Creăm o imagine fantomă pentru drag (o copie a rândului)
                const ghostElement = row.cloneNode(true);
                ghostElement.classList.add('dragging-ghost'); // Adăugăm o clasă pentru a o identifica
                ghostElement.style.width = row.offsetWidth + 'px';
                ghostElement.style.position = 'absolute';
                ghostElement.style.top = '-1000px'; // Mutăm în afara ecranului
                document.body.appendChild(ghostElement);
                e.dataTransfer.setDragImage(ghostElement, e.offsetX, e.offsetY);
            });

            row.addEventListener('dragend', () => {
                row.classList.remove('dragging');
                const ghostElement = document.querySelector('.roster-table-row.dragging-ghost');
                if (ghostElement) {
                    ghostElement.remove();
                }
            });

            rosterTbody.appendChild(row);
        });
    }

    // Adaugă funcționalitatea de drop pentru containerul roster-ului
    rosterContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        rosterContainer.classList.add('drag-over');
    });

    rosterContainer.addEventListener('dragleave', () => {
        rosterContainer.classList.remove('drag-over');
    });

    rosterContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        rosterContainer.classList.remove('drag-over');

        const playerIdToMove = e.dataTransfer.getData('text/plain');
        const gameStateAfterDrop = getGameState();
        const player = gameStateAfterDrop.players.find(p => p.id == playerIdToMove);

        if (player && player.isOnPitch) { // Doar dacă jucătorul este pe teren
            updateGameState({
                players: gameStateAfterDrop.players.map(p => {
                    if (p.id == playerIdToMove) {
                        return { ...p, currentSlot: null, isOnPitch: false }; // Trimite jucătorul în bancă
                    }
                    return p;
                })
            });
            initTeamTab(); // Re-randăm tot tab-ul după mutare
        }
    });
}

/**
 * Randarea terenului de fotbal și a jucătorilor pe el.
 * @param {string} formationName - Numele formației curente (ex: '4-4-2').
 */
function renderPitch(formationName) {
    const pitch = document.getElementById('football-pitch');
    if (!pitch) {
        console.error("Terenul de fotbal ('#football-pitch') nu a fost găsit la renderPitch.");
        return;
    }
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

    // Umplem sloturile cu jucători existent pe teren din gameState
    for (const slotId in currentFormation.slots) {
        const slotElement = pitch.querySelector(`[data-slot-id="${slotId}"]`);
        if (slotElement) {
            const playerInSlot = gameState.players.find(p => p.currentSlot === slotId);

            if (playerInSlot) {
                slotElement.appendChild(createPitchPlayerCard(playerInSlot)); // Folosim noul createPitchPlayerCard
                slotElement.classList.add('occupied');
                slotElement.dataset.playerId = playerInSlot.id;
            } else {
                 // Dacă slotul e gol, afișăm tipul poziției
                 slotElement.innerHTML = `<span class="slot-placeholder">${currentFormation.slots[slotId].type.substring(0,3).toUpperCase()}</span>`;
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
            const gameStateAfterDrop = getGameState(); // Reîncărcăm starea actuală
            let playerToMove = gameStateAfterDrop.players.find(p => p.id == playerIdToMove);

            if (!playerToMove) {
                console.error("Jucătorul tras nu a fost găsit.");
                return;
            }

            const targetSlotId = slot.dataset.slotId;
            const targetPositionType = slot.dataset.positionType;

            // Validare poziție: jucătorul poate fi plasat doar în sloturi de poziția sa sau GK dacă e portar
            if (playerToMove.position !== targetPositionType && !(playerToMove.position === 'Portar' && targetPositionType === 'Portar')) {
                console.warn(`Jucătorul ${playerToMove.name} (${playerToMove.position}) nu poate fi plasat în slotul ${targetSlotId} (${targetPositionType}).`);
                alert(`Jucătorul ${playerToMove.name} este ${playerToMove.position} și nu poate juca ${targetPositionType}.`);
                return;
            }

            // Găsim jucătorul care era în slotul țintă (dacă există)
            const playerCurrentlyInTargetSlot = gameStateAfterDrop.players.find(p => p.currentSlot === targetSlotId);

            const updatedPlayers = gameStateAfterDrop.players.map(p => {
                if (p.id == playerIdToMove) {
                    // Jucătorul care e mutat în slotul țintă
                    return { ...p, currentSlot: targetSlotId, isOnPitch: true };
                } else if (playerCurrentlyInTargetSlot && p.id === playerCurrentlyInTargetSlot.id) {
                    // Jucătorul care era în slotul țintă e mutat în bancă
                    return { ...p, currentSlot: null, isOnPitch: false };
                }
                return p;
            });

            updateGameState({ players: updatedPlayers });

            // Re-randăm terenul și rosterul pentru a reflecta schimbările
            initTeamTab(); // Re-inițializăm tot tab-ul
        });
    });
}

/**
 * Inițializează selecția de formații și mentalități.
 */
function initTacticsControls() {
    const formationSelect = document.getElementById('formation-select');
    const mentalitySelect = document.getElementById('mentality-select');

    if (!formationSelect || !mentalitySelect) {
        console.error("Eroare: Elementele de selecție a tacticii (formație/mentalitate) nu au fost găsite în DOM.");
        return; // Ieșim din funcție dacă elementele nu sunt găsite
    }

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
        const gameStatePlayers = getGameState().players;
        const playersToBench = gameStatePlayers.map(p => ({ ...p, currentSlot: null, isOnPitch: false }));

        updateGameState({
            currentFormation: newFormation,
            players: playersToBench
        });

        allocateInitialPlayersToPitch(newFormation);
        initTeamTab();
    });

    mentalitySelect.addEventListener('change', (e) => {
        updateGameState({ currentMentality: e.target.value });
        console.log(`Mentalitatea a fost schimbată la: ${getGameState().currentMentality}`);
    });
}

/**
 * Alocă jucătorii la sloturile de pe teren la începutul jocului sau la schimbarea formației.
 * Încearcă să pună jucători pe pozițiile lor primare.
 * @param {string} formationName - Numele formației curente.
 */
function allocateInitialPlayersToPitch(formationName) {
    const gameState = getGameState();
    const playersCopy = [...gameState.players];
    const currentFormation = formations[formationName];

    if (!currentFormation) {
        console.error(`Formația "${formationName}" nu a fost găsită pentru alocare.`);
        return;
    }

    // Trimitem toți jucătorii care erau pe teren înapoi în bancă, pentru a re-aloca curat
    playersCopy.forEach(p => {
        p.currentSlot = null;
        p.isOnPitch = false;
    });

    const availablePlayers = [...playersCopy];
    let playersOnPitchCount = 0;

    for (const slotId in currentFormation.slots) {
        const slotConfig = currentFormation.slots[slotId];
        let foundPlayerIndex = -1;

        // 1. Căutăm jucători care se potrivesc exact poziției
        foundPlayerIndex = availablePlayers.findIndex(p =>
            !p.isOnPitch && p.position === slotConfig.type
        );

        // 2. Dacă nu găsim un meci perfect, căutăm un jucător de câmp pentru pozițiile de câmp,
        // sau lăsăm gol dacă e portar și nu găsim portar.
        if (foundPlayerIndex === -1 && slotConfig.type !== 'Portar') {
             // Încercăm să găsim orice jucător care nu e portar și nu e deja pe teren
             foundPlayerIndex = availablePlayers.findIndex(p =>
                !p.isOnPitch && p.position !== 'Portar'
            );
        }

        if (foundPlayerIndex !== -1) {
            availablePlayers[foundPlayerIndex].isOnPitch = true;
            availablePlayers[foundPlayerIndex].currentSlot = slotId;
            playersOnPitchCount++;
        }
    }

    if (playersOnPitchCount > 0) {
        updateGameState({ players: availablePlayers });
    }
}


/**
 * Inițializează tab-ul Echipă (Team).
 */
export function initTeamTab() {
    // Apelăm funcțiile de inițializare
    initTacticsControls();

    const gameState = getGameState();

    // Alocare inițială a jucătorilor pe teren dacă jocul a început și nu sunt deja jucători alocați
    if (gameState.isGameStarted && !gameState.players.some(p => p.isOnPitch)) {
        console.log("Alocare inițială a jucătorilor pe teren...");
        allocateInitialPlayersToPitch(gameState.currentFormation || '4-4-2');
    }

    renderPitch(gameState.currentFormation || '4-4-2');
    renderRoster();
}
