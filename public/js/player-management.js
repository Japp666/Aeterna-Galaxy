// public/js/player-management.js - Logică pentru managementul jucătorilor și antrenament

import { getGameState, updateGameState } from './game-state.js';

/**
 * Definește tipurile de antrenament și atributele pe care le influențează.
 */
export const TRAINING_TYPES = {
    OFFENSIVE: {
        name: "Antrenament Ofensiv",
        description: "Îmbunătățește atributele ofensive precum șutul, driblingul și viziunea.",
        attributes: ['shooting', 'dribbling', 'passing', 'vision'],
        cost: 5000 // Cost per zi per jucător
    },
    DEFENSIVE: {
        name: "Antrenament Defensiv",
        description: "Îmbunătățește atributele defensive precum tacklingul, marcajul și poziționarea.",
        attributes: ['tackling', 'marking', 'positioning', 'strength'],
        cost: 5000
    },
    PHYSICAL: {
        name: "Antrenament Fizic",
        description: "Îmbunătățește atributele fizice precum viteza, rezistența și forța.",
        attributes: ['speed', 'stamina', 'strength', 'acceleration'],
        cost: 5000
    },
    TACTICAL: {
        name: "Antrenament Tactic",
        description: "Îmbunătățește înțelegerea tactică, deciziile și munca în echipă.",
        attributes: ['decisionMaking', 'teamwork', 'positioning', 'vision'],
        cost: 5000
    },
    GOALKEEPING: {
        name: "Antrenament Portari",
        description: "Specific pentru portari: reflexe, prindere, degajare.",
        attributes: ['reflexes', 'handling', 'kicking', 'oneOnOnes'],
        cost: 5000
    },
    REST: {
        name: "Odihnă",
        description: "Recuperează rapid fitness-ul și moralul jucătorului.",
        attributes: [], // Nu îmbunătățește atribute
        cost: 0 // Fără cost
    }
};

/**
 * Randează lista de jucători în containerul specificat.
 * @param {HTMLElement} container - Elementul DOM unde se va randa lista.
 * @param {Array<object>} players - Lista de jucători.
 * @param {string|null} selectedPlayerId - ID-ul jucătorului selectat, dacă există.
 * @param {Function} onPlayerSelect - Callback funcție la selectarea unui jucător.
 */
export function renderPlayerList(container, players, selectedPlayerId, onPlayerSelect) {
    console.log("player-management.js: renderPlayerList() - Se randează lista de jucători.");
    container.innerHTML = '';

    if (players.length === 0) {
        container.innerHTML = '<p class="no-players-message">Nu există jucători în lot.</p>';
        return;
    }

    players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.classList.add('player-item');
        if (player.id === selectedPlayerId) {
            playerItem.classList.add('selected');
        }
        playerItem.dataset.playerId = player.id;

        const fitnessIcon = player.fitness > 80 ? '🟢' : player.fitness > 50 ? '🟡' : '🔴';
        const moraleIcon = player.morale > 80 ? '😊' : player.morale > 50 ? '😐' : '😠';
        const injuryStatus = player.isInjured ? ` <span class="injury-status">(Accidentat: ${player.daysInjured} zile)</span>` : '';

        playerItem.innerHTML = `
            <div class="player-info">
                <span class="player-name">${player.name}</span>
                <span class="player-position">${player.position}</span>
                <span class="player-overall">OVR: ${player.overall}</span>
            </div>
            <div class="player-status">
                <span class="player-fitness">${fitnessIcon} Fitness: ${player.fitness}%</span>
                <span class="player-morale">${moraleIcon} Moral: ${player.morale}%</span>
                ${injuryStatus}
            </div>
        `;
        playerItem.addEventListener('click', () => onPlayerSelect(player.id));
        container.appendChild(playerItem);
    });
    console.log("player-management.js: Lista de jucători a fost randată.");
}

/**
 * Randează detaliile jucătorului selectat și opțiunile de antrenament.
 * @param {HTMLElement} container - Elementul DOM unde se vor randa detaliile.
 * @param {object|null} player - Obiectul jucătorului selectat, sau null.
 */
export function renderPlayerDetails(container, player) {
    console.log("player-management.js: renderPlayerDetails() - Se randează detaliile jucătorului.");
    container.innerHTML = '';

    if (!player) {
        container.innerHTML = '<p class="select-player-message">Selectează un jucător din listă pentru a vedea detaliile și opțiunile de antrenament.</p>';
        return;
    }

    const trainingOptionsHtml = Object.keys(TRAINING_TYPES).map(key => {
        const type = TRAINING_TYPES[key];
        const isSelected = player.trainingFocus === key;
        const disabled = player.isInjured && key !== 'REST'; // Accidentații pot doar să se odihnească
        return `
            <button class="btn btn-secondary training-option ${isSelected ? 'selected' : ''}" 
                    data-training-type="${key}" 
                    ${disabled ? 'disabled' : ''}>
                ${type.name} (${type.cost} Credite/zi)
                <span class="training-description">${type.description}</span>
            </button>
        `;
    }).join('');

    const injuryMessage = player.isInjured ? `<p class="text-red-500 font-bold">Jucătorul este accidentat! Se va recupera în ${player.daysInjured} zile. Poate doar să se odihnească.</p>` : '';

    container.innerHTML = `
        <div class="player-detail-header">
            <h3>${player.name} (${player.position})</h3>
            <span class="player-overall-large">OVR: ${player.overall}</span>
        </div>
        ${injuryMessage}
        <div class="player-attributes grid grid-cols-2 gap-2 mt-4">
            <div><strong>Vârstă:</strong> ${player.age}</div>
            <div><strong>Naționalitate:</strong> ${player.nationality}</div>
            <div><strong>Valoare:</strong> ${player.value.toLocaleString('en-US')} Credite</div>
            <div><strong>Salariu:</strong> ${player.salary.toLocaleString('en-US')} Credite/săptămână</div>
            <div><strong>Fitness:</strong> ${player.fitness}%</div>
            <div><strong>Moral:</strong> ${player.morale}%</div>
            <div><strong>Potențial:</strong> ${player.potential}%</div>
            <div><strong>Tip Antrenament:</strong> ${player.trainingFocus ? TRAINING_TYPES[player.trainingFocus].name : 'Niciunul'}</div>
        </div>

        <h4 class="mt-4">Atribute:</h4>
        <ul class="player-attributes-list grid grid-cols-2 gap-1">
            ${Object.entries(player.attributes).map(([attr, value]) => `
                <li><strong>${attr.charAt(0).toUpperCase() + attr.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> ${value}</li>
            `).join('')}
        </ul>

        <h4 class="mt-4">Setează Antrenament:</h4>
        <div class="training-options grid grid-cols-2 gap-2">
            ${trainingOptionsHtml}
        </div>
    `;

    // Adaugă event listeners pentru butoanele de antrenament
    container.querySelectorAll('.training-option').forEach(button => {
        button.addEventListener('click', (event) => {
            const trainingType = event.currentTarget.dataset.trainingType;
            setPlayerTrainingFocus(player.id, trainingType);
            // Re-randare pentru a actualiza starea butonului selectat
            const gameState = getGameState();
            const updatedPlayer = gameState.players.find(p => p.id === player.id);
            renderPlayerDetails(container, updatedPlayer);
        });
    });
    console.log("player-management.js: Detaliile jucătorului au fost randate.");
}

/**
 * Setează tipul de antrenament pentru un jucător specific.
 * @param {string} playerId - ID-ul jucătorului.
 * @param {string} trainingType - Tipul de antrenament (cheie din TRAINING_TYPES).
 */
export function setPlayerTrainingFocus(playerId, trainingType) {
    console.log(`player-management.js: setPlayerTrainingFocus() - Se setează antrenamentul pentru jucătorul ${playerId} la ${trainingType}.`);
    let gameState = getGameState();
    const player = gameState.players.find(p => p.id === playerId);

    if (player) {
        if (player.isInjured && trainingType !== 'REST') {
            console.warn(`player-management.js: Jucătorul ${player.name} este accidentat și poate fi setat doar pe Odihnă.`);
            return;
        }
        player.trainingFocus = trainingType;
        updateGameState(gameState);
        console.log(`player-management.js: Antrenamentul pentru ${player.name} a fost setat la ${TRAINING_TYPES[trainingType].name}.`);
    } else {
        console.error(`player-management.js: Jucătorul cu ID-ul ${playerId} nu a fost găsit.`);
    }
}

/**
 * Avansază o zi și aplică efectele antrenamentului, fitness-ului și moralului.
 */
export function advanceDayAndApplyPlayerEffects() {
    console.log("player-management.js: advanceDayAndApplyPlayerEffects() - Se avansează o zi și se aplică efectele jucătorilor.");
    let gameState = getGameState();
    let totalTrainingCost = 0;

    gameState.players.forEach(player => {
        // 1. Gestionare accidentări
        if (player.isInjured) {
            player.daysInjured--;
            if (player.daysInjured <= 0) {
                player.isInjured = false;
                player.daysInjured = 0;
                console.log(`player-management.js: Jucătorul ${player.name} s-a recuperat după accidentare.`);
            }
        }

        // 2. Aplică efectele antrenamentului/odihnei
        const trainingType = player.trainingFocus || 'REST'; // Default la odihnă
        const trainingDetails = TRAINING_TYPES[trainingType];

        if (trainingDetails) {
            totalTrainingCost += trainingDetails.cost;

            if (trainingType === 'REST') {
                // Odihnă: crește fitness și moral
                player.fitness = Math.min(100, player.fitness + Math.floor(Math.random() * 5 + 5)); // +5-9 fitness
                player.morale = Math.min(100, player.morale + Math.floor(Math.random() * 3 + 2));   // +2-4 moral
            } else if (!player.isInjured) { // Jucătorii accidentați nu se antrenează normal
                // Antrenament: crește atribute, scade fitness, moral poate varia
                trainingDetails.attributes.forEach(attr => {
                    // Creștere atribut bazată pe potențial și un factor aleatoriu
                    const growthFactor = (player.potential / 100) * (Math.random() * 0.5 + 0.5); // 0.5-1.0 din potențial
                    player.attributes[attr] = Math.min(100, player.attributes[attr] + growthFactor);
                    player.attributes[attr] = Math.round(player.attributes[attr]); // Rotunjim la întreg
                });

                // Scade fitness-ul din cauza antrenamentului
                player.fitness = Math.max(0, player.fitness - Math.floor(Math.random() * 3 + 2)); // -2-4 fitness
                // Moralul poate fluctua, ușor în sus sau în jos
                player.morale = Math.max(0, Math.min(100, player.morale + Math.floor(Math.random() * 3 - 1))); // +/- 1-2 moral
            }
        }

        // Recalculează overall-ul jucătorului după modificarea atributelor
        player.overall = calculatePlayerOverall(player.attributes, player.position);
    });

    // Scade costurile de antrenament din finanțele clubului
    gameState.club.finances.expenses += totalTrainingCost;
    console.log(`player-management.js: Costuri totale de antrenament pentru ziua curentă: ${totalTrainingCost} Credite.`);

    updateGameState(gameState);
    console.log("player-management.js: Efectele jucătorilor au fost aplicate și starea jocului a fost salvată.");
}

/**
 * Calculează Overall-ul jucătorului pe baza atributelor și poziției.
 * Aceasta este o funcție simplificată și ar trebui să fie mai complexă într-un joc real.
 * @param {object} attributes - Obiectul cu atributele jucătorului.
 * @param {string} position - Poziția jucătorului (ex: 'ST', 'CB', 'GK').
 * @returns {number} Overall-ul calculat.
 */
function calculatePlayerOverall(attributes, position) {
    let overall = 0;
    let relevantAttributes = [];

    // Atribute relevante pentru fiecare poziție (simplificat)
    switch (position) {
        case 'GK':
            relevantAttributes = ['reflexes', 'handling', 'kicking', 'oneOnOnes', 'positioning', 'agility'];
            break;
        case 'CB':
        case 'LB':
        case 'RB':
        case 'LCB':
        case 'RCB':
        case 'LWB':
        case 'RWB':
            relevantAttributes = ['tackling', 'marking', 'strength', 'positioning', 'heading', 'pace'];
            break;
        case 'CM':
        case 'CDM':
        case 'CAM':
        case 'LM':
        case 'RM':
        case 'LCM':
        case 'RCM':
        case 'LDM':
        case 'RDM':
        case 'LAM':
        case 'RAM':
            relevantAttributes = ['passing', 'vision', 'dribbling', 'teamwork', 'stamina', 'decisionMaking'];
            break;
        case 'ST':
        case 'LW':
        case 'RW':
        case 'LS':
        case 'RS':
            relevantAttributes = ['shooting', 'dribbling', 'pace', 'finishing', 'acceleration', 'agility'];
            break;
        default:
            relevantAttributes = Object.keys(attributes); // Toate atributele dacă poziția nu este recunoscută
    }

    if (relevantAttributes.length > 0) {
        const sumOfRelevantAttributes = relevantAttributes.reduce((sum, attr) => sum + (attributes[attr] || 0), 0);
        overall = sumOfRelevantAttributes / relevantAttributes.length;
    } else {
        // Dacă nu sunt atribute relevante specifice poziției, facem o medie generală
        const sumOfAllAttributes = Object.values(attributes).reduce((sum, val) => sum + val, 0);
        overall = sumOfAllAttributes / Object.keys(attributes).length;
    }

    return Math.round(overall);
}

