// public/js/player-management.js - Logică pentru managementul jucătorilor și antrenament

import { getGameState, updateGameState } from './game-state.js';

/**
 * Definește tipurile de antrenament și atributele pe care le influențează.
 */
export const TRAINING_TYPES = {
    OFFENSIVE: {
        name: "Antrenament Ofensiv",
        description: "Îmbunătățește atributele ofensive precum șutul, driblingul și viziunea.",
        attributes: ['shooting', 'dribbling', 'passing', 'vision', 'finishing', 'creativity', 'centrari'],
        cost: 5000 // Cost per zi per jucător
    },
    DEFENSIVE: {
        name: "Antrenament Defensiv",
        description: "Îmbunătățește atributele defensive precum tacklingul, marcajul și poziționarea.",
        attributes: ['tackling', 'marking', 'positioning', 'curaj', 'lovitura_de_cap'],
        cost: 5000
    },
    PHYSICAL: {
        name: "Antrenament Fizic",
        description: "Îmbunătățește atributele fizice precum viteza, rezistența și forța.",
        attributes: ['speed', 'stamina', 'strength', 'acceleration', 'vigoare', 'forta', 'agresivitate', 'viteza'],
        cost: 5000
    },
    TACTICAL: {
        name: "Antrenament Tactic",
        description: "Îmbunătățește înțelegerea tactică, deciziile și munca în echipă.",
        attributes: ['decisionMaking', 'teamwork', 'positioning', 'vision', 'creativity'],
        cost: 5000
    },
    GOALKEEPING: {
        name: "Antrenament Portari",
        description: "Specific pentru portari: reflexe, prindere, degajare.",
        attributes: ['reflexes', 'handling', 'kicking', 'oneOnOnes', 'positioning', 'curaj'],
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

        // Folosim emoji-uri pentru fitness și moral
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
 * @param {object} trainingTypes - Obiectul TRAINING_TYPES pentru a afișa opțiunile.
 */
export function renderPlayerDetails(container, player, trainingTypes) {
    console.log("player-management.js: renderPlayerDetails() - Se randează detaliile jucătorului.");
    container.innerHTML = '';

    if (!player) {
        container.innerHTML = '<p class="select-player-message">Selectează un jucător din listă pentru a vedea detaliile și opțiunile de antrenament.</p>';
        return;
    }

    const trainingOptionsHtml = Object.keys(trainingTypes).map(key => {
        const type = trainingTypes[key];
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
        <div class="player-attributes-grid">
            <div><strong>Vârstă:</strong> ${player.age}</div>
            <div><strong>Naționalitate:</strong> ${player.nationality || 'Necunoscută'}</div>
            <div><strong>Valoare:</strong> ${player.value.toLocaleString('ro-RO')} Credite</div>
            <div><strong>Salariu:</strong> ${player.salary.toLocaleString('ro-RO')} Credite/săptămână</div>
            <div><strong>Fitness:</strong> ${player.fitness}%</div>
            <div><strong>Moral:</strong> ${player.morale}%</div>
            <div><strong>Potențial:</strong> ${player.potential}%</div>
            <div><strong>Tip Antrenament:</strong> ${player.trainingFocus ? trainingTypes[player.trainingFocus].name : 'Niciunul'}</div>
        </div>

        <h4>Atribute:</h4>
        <ul class="player-attributes-list">
            <li><strong>Deposedare:</strong> ${Math.round(player.attributes.defensiv.deposedare)}</li>
            <li><strong>Marcaj:</strong> ${Math.round(player.attributes.defensiv.marcaj)}</li>
            <li><strong>Poziționare (Def):</strong> ${Math.round(player.attributes.defensiv.pozitionare)}</li>
            <li><strong>Lov. Cap:</strong> ${Math.round(player.attributes.defensiv.lovitura_de_cap)}</li>
            <li><strong>Curaj:</strong> ${Math.round(player.attributes.defensiv.curaj)}</li>
            
            <li><strong>Pase:</strong> ${Math.round(player.attributes.ofensiv.pase)}</li>
            <li><strong>Dribling:</strong> ${Math.round(player.attributes.ofensiv.dribling)}</li>
            <li><strong>Centrări:</strong> ${Math.round(player.attributes.ofensiv.centrari)}</li>
            <li><strong>Șutare:</strong> ${Math.round(player.attributes.ofensiv.sutare)}</li>
            <li><strong>Finalizare:</strong> ${Math.round(player.attributes.ofensiv.finalizare)}</li>
            <li><strong>Creativitate:</strong> ${Math.round(player.attributes.ofensiv.creativitate)}</li>
            
            <li><strong>Vigoare:</strong> ${Math.round(player.attributes.fizic.vigoare)}</li>
            <li><strong>Forță:</strong> ${Math.round(player.attributes.fizic.forta)}</li>
            <li><strong>Agresivitate:</strong> ${Math.round(player.attributes.fizic.agresivitate)}</li>
            <li><strong>Viteză:</strong> ${Math.round(player.attributes.fizic.viteza)}</li>
        </ul>

        <h4>Setează Antrenament:</h4>
        <div class="training-options">
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
            renderPlayerDetails(container, updatedPlayer, trainingTypes); // Pasăm TRAINING_TYPES
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
            // Dacă poziția nu este recunoscută, folosim o medie a tuturor atributelor
            relevantAttributes = Object.keys(attributes.defensiv)
                                .concat(Object.keys(attributes.ofensiv))
                                .concat(Object.keys(attributes.fizic));
    }

    if (relevantAttributes.length > 0) {
        let sumOfRelevantAttributes = 0;
        relevantAttributes.forEach(attr => {
            if (attributes.defensiv && attributes.defensiv[attr]) sumOfRelevantAttributes += attributes.defensiv[attr];
            else if (attributes.ofensiv && attributes.ofensiv[attr]) sumOfRelevantAttributes += attributes.ofensiv[attr];
            else if (attributes.fizic && attributes.fizic[attr]) sumOfRelevantAttributes += attributes.fizic[attr];
        });
        overall = sumOfRelevantAttributes / relevantAttributes.length;
    } else {
        // Fallback: media tuturor atributelor dacă nu s-au găsit atribute relevante
        const allAttrs = Object.values(attributes.defensiv)
                            .concat(Object.values(attributes.ofensiv))
                            .concat(Object.values(attributes.fizic));
        const sumOfAllAttributes = allAttrs.reduce((sum, val) => sum + val, 0);
        overall = sumOfAllAttributes / allAttrs.length;
    }

    return Math.round(overall);
}

// Funcția advanceDayAndApplyPlayerEffects a fost eliminată din acest modul
// și va fi apelată printr-un alt mecanism de timp, nu automat.
