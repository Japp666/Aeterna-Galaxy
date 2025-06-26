// public/js/tactics-manager.js - Logică pentru gestionarea tacticilor (formații și mentalitate)

import { getGameState, updateGameState } from './game-state.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers, addDragDropListeners } from './pitch-renderer.js'; 
import { formations } from './formations-data.js'; // Importă formațiile din noul fișier


// Referințele la elemente DOM sunt preluate în initTacticsManager
let formationButtonsContainer = null;
let mentalityButtonsContainer = null;
let footballPitchElement = null;
let availablePlayersListElement = null;

/**
 * Inițializează managerul de tactici.
 * Populează butoanele și adaugă event listeneri.
 * @param {HTMLElement} formationBtns - Containerul pentru butoanele de formație.
 * @param {HTMLElement} mentalityBtns - Containerul pentru butoanele de mentalitate.
 * @param {HTMLElement} pitch - Elementul terenului de fotbal.
 * @param {HTMLElement} availablePlayers - Containerul jucătorilor disponibili.
 */
export function initTacticsManager(formationBtns, mentalityBtns, pitch, availablePlayers) {
    console.log("tactics-manager.js: initTacticsManager() - Inițializarea managerului de tactici.");
    
    // Asignăm elementele la variabilele globale locale
    formationButtonsContainer = formationBtns;
    mentalityButtonsContainer = mentalityBtns;
    footballPitchElement = pitch;
    availablePlayersListElement = availablePlayers;

    if (!formationButtonsContainer || !mentalityButtonsContainer || !footballPitchElement || !availablePlayersListElement) {
        console.error("tactics-manager.js: Nu s-au primit toate elementele necesare pentru inițializare.");
        return;
    }

    const gameState = getGameState();

    // Rendăm terenul inițial cu formația și mentalitatea curente
    renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality); 
    placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation);
    renderAvailablePlayers(availablePlayersListElement); 

    populateFormationButtons(gameState.currentFormation);
    populateMentalityButtons(gameState.currentMentality);
    addEventListeners();
    addDragDropListeners(footballPitchElement, availablePlayersListElement); 
    console.log("tactics-manager.js: Manager de tactici inițializat.");
}

/**
 * Populează containerul pentru butoanele de formație.
 * @param {string} currentFormation - Formația curentă.
 */
function populateFormationButtons(currentFormation) {
    console.log("tactics-manager.js: populateFormationButtons() - Populez butoanele de formații.");
    if (!formationButtonsContainer) {
        console.error("tactics-manager.js: Elementul formationButtonsContainer nu a fost găsit.");
        return;
    }
    formationButtonsContainer.innerHTML = ''; 

    for (const formationKey in formations) {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-tactics'); 
        button.dataset.formation = formationKey;
        button.textContent = formationKey;
        if (formationKey === currentFormation) {
            button.classList.add('active'); 
        }
        formationButtonsContainer.appendChild(button);
    }
    console.log("tactics-manager.js: Butoane de formații populate.");
}

/**
 * Populează containerul pentru butoanele de mentalitate.
 * @param {string} currentMentality - Mentalitatea curentă.
 */
function populateMentalityButtons(currentMentality) {
    console.log("tactics-manager.js: populateMentalityButtons() - Populez butoanele de mentalități.");
    if (!mentalityButtonsContainer) {
        console.error("tactics-manager.js: Elementul mentalityButtonsContainer nu a fost găsit.");
        return;
    }
    const mentalities = ['Defensivă', 'Normală', 'Ofensivă'];
    mentalityButtonsContainer.innerHTML = '';
    mentalities.forEach(mentality => { 
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-tactics');
        button.dataset.mentality = mentality.toLowerCase();
        button.textContent = mentality;
        if (mentality.toLowerCase() === currentMentality) {
            button.classList.add('active');
        }
        mentalityButtonsContainer.appendChild(button);
    });
    console.log("tactics-manager.js: Butoane de mentalități populate.");
}

/**
 * Adaugă event listeneri pentru click-urile pe butoane.
 */
function addEventListeners() {
    if (formationButtonsContainer) {
        formationButtonsContainer.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.btn-tactics');
            if (clickedButton && clickedButton.dataset.formation) {
                const newFormation = clickedButton.dataset.formation;
                console.log("tactics-manager.js: Schimbare formație în:", newFormation);
                updateGameState({ currentFormation: newFormation });

                formationButtonsContainer.querySelectorAll('.btn-tactics').forEach(btn => {
                    btn.classList.remove('active');
                });
                clickedButton.classList.add('active');
                
                const gameState = getGameState();
                if (footballPitchElement) {
                    renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality); // Trece mentalitatea
                    updateGameState({ teamFormation: [] }); 
                    placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation);
                    renderAvailablePlayers(availablePlayersListElement); 
                }
            }
        });
    }

    if (mentalityButtonsContainer) {
        mentalityButtonsContainer.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.btn-tactics');
            if (clickedButton && clickedButton.dataset.mentality) {
                const newMentality = clickedButton.dataset.mentality;
                console.log("tactics-manager.js: Schimbare mentalitate în:", newMentality);
                updateGameState({ currentMentality: newMentality });

                mentalityButtonsContainer.querySelectorAll('.btn-tactics').forEach(btn => {
                    btn.classList.remove('active');
                });
                clickedButton.classList.add('active');

                const gameState = getGameState();
                renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality); // Trece mentalitatea
                placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation); 
            }
        });
    }
    console.log("tactics-manager.js: Event listeneri adăugați pentru butoane.");
}


/**
 * Aranjează automat cei mai buni jucători în formația curentă.
 * @param {HTMLElement} pitchElement - Elementul DOM al terenului.
 * @param {HTMLElement} availablePlayersListElement - Elementul DOM al listei de jucători disponibili.
 * @param {string} currentFormationName - Numele formației curente.
 * @param {string} currentMentality - Mentalitatea curentă.
 */
export function autoArrangePlayers(pitchElement, availablePlayersListElement, currentFormationName, currentMentality) {
    console.log("tactics-manager.js: autoArrangePlayers() - Se aranjează automat jucătorii.");
    const gameState = getGameState();
    const allPlayers = [...gameState.players]; 
    let newTeamFormation = [];
    const formationConfig = formations[currentFormationName];

    if (!formationConfig) {
        console.error("tactics-manager.js: Formația selectată nu a fost găsită.");
        return;
    }

    // Grupăm jucătorii pe poziții detaliate pentru o selecție mai precisă
    const groupedPlayers = {};
    allPlayers.forEach(player => {
        if (!groupedPlayers[player.detailedPosition]) {
            groupedPlayers[player.detailedPosition] = [];
        }
        groupedPlayers[player.detailedPosition].push(player);
    });

    // Sortăm jucătorii din fiecare grupă după OVR descrescător
    for (const detailedPos in groupedPlayers) {
        groupedPlayers[detailedPos].sort((a, b) => b.ovr - a.ovr);
    }

    // Iterăm prin sloturile necesare pentru formația curentă și încercăm să le umplem
    const allSlotConfigs = [];
    for (const posGroup in formationConfig.layout) {
        formationConfig.layout[posGroup].forEach(slot => allSlotConfigs.push(slot));
    }

    // Sortăm sloturile într-o ordine logică (ex: GK, DF, MF, AT)
    allSlotConfigs.sort((a, b) => {
        const order = { 'GK': 0, 'DF': 1, 'MF': 2, 'AT': 3 };
        const aGroup = a.type === 'GK' ? 'GK' : (['DL', 'DC', 'DR', 'SW'].includes(a.type) ? 'DF' : (['ML', 'MC', 'MR', 'DM', 'AM', 'LWB', 'RWB'].includes(a.type) ? 'MF' : 'AT'));
        const bGroup = b.type === 'GK' ? 'GK' : (['DL', 'DC', 'DR', 'SW'].includes(b.type) ? 'DF' : (['ML', 'MC', 'MR', 'DM', 'AM', 'LWB', 'RWB'].includes(b.type) ? 'MF' : 'AT'));
        return order[aGroup] - order[bGroup];
    });


    allSlotConfigs.forEach(slotConfig => {
        const slotDetailedType = slotConfig.type;
        let bestPlayerForSlot = null;
        
        // 1. Caută potrivire exactă pe poziția detaliată
        if (groupedPlayers[slotDetailedType] && groupedPlayers[slotDetailedType].length > 0) {
            bestPlayerForSlot = groupedPlayers[slotDetailedType].shift(); 
        } 
        // 2. Fallback: caută potriviri pe poziții generale compatibile dacă nu găsim una exactă
        else {
            const generalPosForSlot = Object.keys(formations[currentFormationName].layout).find(
                key => formations[currentFormationName].layout[key].some(s => s.type === slotDetailedType)
            );

            if (generalPosForSlot) {
                let potentialPlayers = [];
                // Colectează jucători din toate pozițiile detaliate care aparțin grupului general
                for (const playerDetailedPos in groupedPlayers) {
                    const playerGeneralPos = (playerDetailedPos === 'GK') ? 'GK' : 
                                             (['DL', 'DC', 'DR', 'SW'].includes(playerDetailedPos) ? 'DF' : 
                                             (['ML', 'MC', 'MR', 'DM', 'AM', 'LWB', 'RWB'].includes(playerDetailedPos) ? 'MF' : 'AT'));
                    
                    if (playerGeneralPos === generalPosForSlot && groupedPlayers[playerDetailedPos].length > 0) {
                        potentialPlayers = potentialPlayers.concat(groupedPlayers[playerDetailedPos]);
                    }
                }
                // Sortează toți jucătorii compatibili după OVR și ia cel mai bun
                potentialPlayers.sort((a, b) => b.ovr - a.ovr);
                if (potentialPlayers.length > 0) {
                    bestPlayerForSlot = potentialPlayers[0];
                    // Scoatem jucătorul din lista detaliată de unde a fost luat
                    const sourceDetailedPos = bestPlayerForSlot.detailedPosition;
                    groupedPlayers[sourceDetailedPos] = groupedPlayers[sourceDetailedPos].filter(p => p.id !== bestPlayerForSlot.id);
                }
            }
        }

        if (bestPlayerForSlot) {
            newTeamFormation.push({
                playerId: bestPlayerForSlot.id,
                slotId: slotConfig.type + (allSlotConfigs.indexOf(slotConfig) + 1), // ID unic pentru slot
                player: bestPlayerForSlot
            });
        }
    });

    updateGameState({ teamFormation: newTeamFormation });
    console.log("tactics-manager.js: Jucători aranjați automat. Noua formație:", newTeamFormation);

    renderPitch(pitchElement, currentFormationName, currentMentality);
    placePlayersInPitchSlots(pitchElement, getGameState().teamFormation);
    renderAvailablePlayers(availablePlayersListElement);
}
