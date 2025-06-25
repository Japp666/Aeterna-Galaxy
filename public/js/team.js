// public/js/team.js - Logica specifică pentru tab-ul "Echipă" (care include terenul de fotbal)

import { getGameState, updateGameState } from './game-state.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers, addDragDropListeners, formations } from './pitch-renderer.js';
import { initTacticsManager } from './tactics-manager.js';

/**
 * Încarcă conținutul HTML pentru tab-ul "Echipă".
 * @returns {Promise<string>} HTML-ul tab-ului.
 */
export async function loadTeamTabContent() {
    console.log("team.js: loadTeamTabContent() - Se încarcă conținutul HTML pentru tab-ul Echipă...");
    try {
        const response = await fetch('components/team.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        console.log("team.js: Conținutul HTML pentru tab-ul Echipă a fost încărcat.");
        return html;
    } catch (error) {
        console.error("team.js: Eroare la încărcarea conținutului team.html:", error);
        return `<p class="error-message">Eroare la încărcarea Echipei: ${error.message}</p>`;
    }
}

/**
 * Inițializează logica specifică pentru tab-ul "Echipă" după ce conținutul HTML este încărcat.
 */
export function initTeamTab() {
    console.log("team.js: initTeamTab() - Inițializare tab 'Echipă'...");

    // Preluăm referințele la elementele DOM specifice tab-ului Team
    const formationSelect = document.getElementById('formation-select');
    const mentalitySelect = document.getElementById('mentality-select');
    const footballPitch = document.getElementById('football-pitch');
    const availablePlayersList = document.getElementById('available-players-list');

    if (!formationSelect || !mentalitySelect || !footballPitch || !availablePlayersList) {
        console.error("team.js: Nu s-au găsit toate elementele necesare pentru tab-ul Team. Asigură-te că team.html este corect.");
        return;
    }

    // Inițializează managerul de tactici, pasându-i elementele DOM necesare
    initTacticsManager(formationSelect, mentalitySelect, footballPitch, availablePlayersList);

    const gameState = getGameState();

    // Randează terenul de fotbal și jucătorii disponibili (inițial, fără jucători pe teren)
    renderPitch(footballPitch, gameState.currentFormation);
    renderAvailablePlayers(availablePlayersList); // Randează lista de jucători disponibili

    // Adaugă listeneri de drag and drop pentru elementele specifice
    addDragDropListeners(footballPitch, availablePlayersList);


    // Logica de alocare inițială a jucătorilor pe teren (dacă formația e goală)
    if (gameState.teamFormation.length === 0 && gameState.players.length > 0) {
        console.log("team.js: Formația este goală și există jucători. Se încearcă alocarea inițială.");
        const currentFormationName = gameState.currentFormation;
        const formationConfig = formations[currentFormationName];

        const newTeamFormation = [];
        const availablePlayersCopy = [...gameState.players]; // Copie pentru a manipula
        const usedPlayerIds = new Set();

        if (!formationConfig) {
            console.error(`team.js: Configurația pentru formația ${currentFormationName} nu a fost găsită.`);
            return;
        }

        // Alocă Portarul
        let gk = availablePlayersCopy.find(p => p.position === 'GK' && !usedPlayerIds.has(p.id));
        if (gk) {
            newTeamFormation.push({ playerId: gk.id, slotId: 'GK1', player: gk });
            usedPlayerIds.add(gk.id);
        } else {
            console.warn("team.js: Nu s-a găsit portar disponibil pentru alocarea inițială.");
        }

        // Alocă Fundași, Mijlocași, Atacanți
        const positionsToAllocate = ['DF', 'MF', 'AT'];
        positionsToAllocate.forEach(posType => {
            if (formationConfig[posType]) { // Verifică dacă formația are acea poziție
                for (let i = 0; i < formationConfig[posType]; i++) {
                    let playerFound = availablePlayersCopy.find(p => p.position === posType && !usedPlayerIds.has(p.id));
                    // Fallback: încearcă să găsești un jucător care nu e portar
                    if (!playerFound) {
                        playerFound = availablePlayersCopy.find(p => p.position !== 'GK' && !usedPlayerIds.has(p.id));
                    }

                    if (playerFound) {
                        newTeamFormation.push({ playerId: playerFound.id, slotId: `${posType}${i + 1}`, player: playerFound });
                        usedPlayerIds.add(playerFound.id);
                    } else {
                        console.warn(`team.js: Nu s-a găsit jucător adecvat pentru slotul ${posType}${i + 1}.`);
                    }
                }
            }
        });

        updateGameState({ teamFormation: newTeamFormation });
        console.log("team.js: Jucători alocați inițial:", newTeamFormation);
        
        // După alocare, randează din nou terenul cu jucătorii plasați
        renderPitch(footballPitch, gameState.currentFormation);
        placePlayersInPitchSlots(footballPitch, getGameState().teamFormation);
        renderAvailablePlayers(availablePlayersList);
    } else {
        // Dacă există deja o formație salvată, plasează-i pe teren la încărcare
        placePlayersInPitchSlots(footballPitch, gameState.teamFormation);
    }

    console.log("team.js: Tab-ul 'Echipă' inițializat.");
}
