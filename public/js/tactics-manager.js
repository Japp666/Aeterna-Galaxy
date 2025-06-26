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
    renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality); // Trece mentalitatea
    placePlayersInPitchSlots(footballPitchElement, gameState.teamFormation);
    renderAvailablePlayers(availablePlayersListElement); // Rendăm jucătorii disponibili

    populateFormationButtons(gameState.currentFormation);
    populateMentalityButtons(gameState.currentMentality);
    addEventListeners();
    addDragDropListeners(footballPitchElement, availablePlayersListElement); // Adaugă listeneri de D&D
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
    formationButtonsContainer.innerHTML = ''; // Curăță butoanele existente

    for (const formationKey in formations) {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-tactics'); // Clase generice pentru butoane
        button.dataset.formation = formationKey;
        button.textContent = formationKey;
        if (formationKey === currentFormation) {
            button.classList.add('active'); // Marcam butonul activ
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

                // Actualizăm clasa 'active' pentru butoanele de formație
                formationButtonsContainer.querySelectorAll('.btn-tactics').forEach(btn => {
                    btn.classList.remove('active');
                });
                clickedButton.classList.add('active');
                
                // Re-randăm terenul cu noua formație și mentalitate (care rămâne la fel dacă nu e schimbată)
                const gameState = getGameState();
                if (footballPitchElement) {
                    renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality);
                    // Resetăm formația de jucători pe teren la schimbarea formației pentru a nu avea poziții greșite
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

                // Actualizăm clasa 'active' pentru butoanele de mentalitate
                mentalityButtonsContainer.querySelectorAll('.btn-tactics').forEach(btn => {
                    btn.classList.remove('active');
                });
                clickedButton.classList.add('active');

                // Re-randăm terenul pentru a aplica noile offset-uri de mentalitate
                const gameState = getGameState();
                renderPitch(footballPitchElement, gameState.currentFormation, gameState.currentMentality);
                placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation); // Păstrăm jucătorii existenți
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
    const allPlayers = [...gameState.players]; // Copie a lotului
    let newTeamFormation = [];
    const formationConfig = formations[currentFormationName];

    if (!formationConfig) {
        console.error("tactics-manager.js: Formația selectată nu a fost găsită.");
        return;
    }

    // Grupează jucătorii disponibili pe poziții generale și detaliate
    const groupedPlayers = {};
    allPlayers.forEach(player => {
        if (!groupedPlayers[player.position]) {
            groupedPlayers[player.position] = {};
        }
        if (!groupedPlayers[player.position][player.detailedPosition]) {
            groupedPlayers[player.position][player.detailedPosition] = [];
        }
        groupedPlayers[player.position][player.detailedPosition].push(player);
    });

    // Sortează jucătorii din fiecare grupă după OVR descrescător
    for (const generalPos in groupedPlayers) {
        for (const detailedPos in groupedPlayers[generalPos]) {
            groupedPlayers[generalPos][detailedPos].sort((a, b) => b.ovr - a.ovr);
        }
    }

    // Iterăm prin sloturile necesare pentru formația curentă
    // Prioritizăm umplerea sloturilor pe baza poziției detaliate
    const positionGroupOrder = ['GK', 'DF', 'MF', 'AT']; // Ordine de la apărare la atac

    positionGroupOrder.forEach(posGroup => {
        if (formationConfig.layout[posGroup]) {
            formationConfig.layout[posGroup].forEach(slotConfig => {
                const slotDetailedType = slotConfig.type;
                let bestPlayerForSlot = null;
                let playerIndexToRemove = -1;

                // Caută cel mai bun jucător care se potrivește EXACT poziției detaliate a slotului
                if (groupedPlayers[posGroup] && groupedPlayers[posGroup][slotDetailedType] && groupedPlayers[posGroup][slotDetailedType].length > 0) {
                    bestPlayerForSlot = groupedPlayers[posGroup][slotDetailedType].shift(); // Ia primul (cel mai bun)
                } else {
                    // Dacă nu găsește potrivire exactă, caută în pozițiile generale compatibile (e.g., DF generic pentru DC)
                    // Aceasta este logica de fallback
                    let potentialPlayers = [];
                    if (posGroup === 'DF') {
                        potentialPlayers = allPlayers.filter(p => 
                            p.position === 'DF' && !newTeamFormation.some(tfp => tfp.playerId === p.id) // Nu e deja în formație
                        ).sort((a,b) => b.ovr - a.ovr);
                    } else if (posGroup === 'MF') {
                        potentialPlayers = allPlayers.filter(p => 
                            p.position === 'MF' && !newTeamFormation.some(tfp => tfp.playerId === p.id)
                        ).sort((a,b) => b.ovr - a.ovr);
                    } else if (posGroup === 'AT') {
                        potentialPlayers = allPlayers.filter(p => 
                            p.position === 'AT' && !newTeamFormation.some(tfp => tfp.playerId === p.id)
                        ).sort((a,b) => b.ovr - a.ovr);
                    } else if (posGroup === 'GK') {
                         potentialPlayers = allPlayers.filter(p => 
                            p.position === 'GK' && !newTeamFormation.some(tfp => tfp.playerId === p.id)
                        ).sort((a,b) => b.ovr - a.ovr);
                    }

                    if (potentialPlayers.length > 0) {
                        bestPlayerForSlot = potentialPlayers[0];
                        // Elimină jucătorul din lista originală, astfel încât să nu fie selectat din nou
                        const originalIndex = allPlayers.findIndex(p => p.id === bestPlayerForSlot.id);
                        if(originalIndex > -1) {
                            allPlayers.splice(originalIndex, 1);
                        }
                    }
                }

                if (bestPlayerForSlot) {
                    newTeamFormation.push({
                        playerId: bestPlayerForSlot.id,
                        slotId: slotConfig.type + (index + 1), // Folosim type+index pentru ID-ul slotului
                        player: bestPlayerForSlot
                    });
                } else {
                    console.warn(`tactics-manager.js: Nu am găsit jucător pentru slotul ${slotConfig.type} în formația ${currentFormationName}.`);
                }
            });
        }
    });

    updateGameState({ teamFormation: newTeamFormation });
    console.log("tactics-manager.js: Jucători aranjați automat. Noua formație:", newTeamFormation);

    // Re-randăm terenul și lista de jucători disponibili
    renderPitch(footballPitchElement, currentFormationName, currentMentality);
    placePlayersInPitchSlots(footballPitchElement, getGameState().teamFormation);
    renderAvailablePlayers(availablePlayersListElement);
}
