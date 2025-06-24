// js/team.js - Orchestratorul pentru tab-ul Echipă

import { getGameState, updateGameState } from './game-state.js';
import { generateInitialPlayers } from './player-generator.js'; // NOU: Import din modulul generator
import { renderPitch, formations } from './pitch-renderer.js'; // NOU: Import din modulul pitch
import { renderRoster } from './roster-renderer.js'; // NOU: Import din modulul roster
import { initTacticsControls, allocateInitialPlayersToPitch } from './tactics-manager.js'; // NOU: Import din modulul tactics
import { setupDragDropListeners } from './drag-drop-manager.js'; // NOU: Import din modulul drag-drop

/**
 * Inițializează tab-ul Echipă (Team).
 */
export function initTeamTab() {
    console.log("Inițializare tab 'Echipă'...");
    const gameState = getGameState();

    // 1. Inițializează controalele de tactică
    initTacticsControls(handleFormationChange, handleMentalityChange);

    // 2. Alocare inițială a jucătorilor pe teren dacă este un joc nou sau nu sunt jucători alocați
    if (gameState.isGameStarted && !gameState.players.some(p => p.isOnPitch)) {
        console.log("Alocare inițială a jucătorilor pe teren...");
        const updatedPlayers = allocateInitialPlayersToPitch(
            gameState.currentFormation || '4-4-2',
            gameState.players
        );
        updateGameState({ players: updatedPlayers });
    }

    // 3. Randarea UI-ului
    renderPitch(gameState.currentFormation || '4-4-2', gameState.players);
    renderRoster(gameState.players);

    // 4. Setarea ascultătorilor de evenimente pentru Drag & Drop
    setupDragDropListeners(handlePlayerDrop);
}

/**
 * Gestionează schimbarea formației și actualizează starea jocului.
 * @param {string} newFormation - Noua formație selectată.
 */
function handleFormationChange(newFormation) {
    const gameState = getGameState();
    // Trimitem toți jucătorii pe bancă înainte de a re-aloca
    const playersToBench = gameState.players.map(p => ({ ...p, currentSlot: null, isOnPitch: false }));

    const updatedPlayers = allocateInitialPlayersToPitch(newFormation, playersToBench);

    updateGameState({
        currentFormation: newFormation,
        players: updatedPlayers
    });
    initTeamTab(); // Re-randăm tot tab-ul
}

/**
 * Gestionează schimbarea mentalității și actualizează starea jocului.
 * @param {string} newMentality - Noua mentalitate selectată.
 */
function handleMentalityChange(newMentality) {
    updateGameState({ currentMentality: newMentality });
    console.log(`Mentalitatea a fost schimbată la: ${getGameState().currentMentality}`);
    // Nu e necesară re-randarea completă a UI-ului pentru o schimbare de mentalitate
}

/**
 * Gestionează evenimentul de "drop" al unui jucător (drag-and-drop).
 * @param {string} playerIdToMove - ID-ul jucătorului care este mutat.
 * @param {string|null} targetSlotId - ID-ul slotului țintă de pe teren, sau `null` dacă e mutat înapoi în bancă.
 * @param {string|null} targetPositionType - Tipul de poziție al slotului țintă (ex: 'Portar', 'Fundaș').
 */
function handlePlayerDrop(playerIdToMove, targetSlotId, targetPositionType) {
    const gameState = getGameState();
    let playerToMove = gameState.players.find(p => p.id == playerIdToMove);

    if (!playerToMove) {
        console.error("Jucătorul tras nu a fost găsit în handlePlayerDrop.");
        return;
    }

    // Dacă jucătorul este mutat într-un slot de pe teren
    if (targetSlotId) {
        // Validare poziție
        if (playerToMove.position !== targetPositionType && !(playerToMove.position === 'Portar' && targetPositionType === 'Portar')) {
            alert(`Jucătorul ${playerToMove.name} este ${playerToMove.position} și nu poate juca ${targetPositionType}.`);
            return;
        }

        const playerCurrentlyInTargetSlot = gameState.players.find(p => p.currentSlot === targetSlotId);

        const updatedPlayers = gameState.players.map(p => {
            if (p.id == playerIdToMove) {
                return { ...p, currentSlot: targetSlotId, isOnPitch: true };
            } else if (playerCurrentlyInTargetSlot && p.id === playerCurrentlyInTargetSlot.id) {
                return { ...p, currentSlot: null, isOnPitch: false }; // Jucătorul din slotul țintă e trimis în bancă
            }
            return p;
        });
        updateGameState({ players: updatedPlayers });

    } else { // Jucătorul este mutat înapoi în bancă
        if (playerToMove.isOnPitch) { // Doar dacă era pe teren
            updateGameState({
                players: gameState.players.map(p => {
                    if (p.id == playerIdToMove) {
                        return { ...p, currentSlot: null, isOnPitch: false };
                    }
                    return p;
                })
            });
        }
    }
    initTeamTab(); // Re-randăm complet UI-ul după orice drop
}

// Exportăm generateInitialPlayers pentru main.js
export { generateInitialPlayers };
