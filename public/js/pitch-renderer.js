// js/pitch-renderer.js
import { gameState } from './game-state.js';
import { getFormationPositions } from './tactics-data.js';
import { openPlayerDetailsModal } from './roster-renderer.js'; // Reutilizăm funcția de deschidere modal

let currentSelectedPlayerElement = null; // Elementul jucătorului selectat pentru drag

/**
 * Randează terenul de joc și pozițiile jucătorilor.
 * @param {HTMLElement} pitchArea - Elementul DOM al terenului de joc (div#pitch-area).
 * @param {string} formationKey - Cheia formației (ex: '4-4-2').
 * @param {Array<Object>} teamPlayers - Lista de jucători a echipei.
 */
export function renderPitch(pitchArea, formationKey, teamPlayers) {
    console.log(`pitch-renderer.js: Se randează terenul cu formația: ${formationKey}`);
    
    // Curăță sloturile existente
    pitchArea.querySelectorAll('.player-slot').forEach(slot => slot.remove());

    const positions = getFormationPositions(formationKey);
    const userTeam = gameState.getUserTeam();
    
    if (!userTeam) {
        console.error("pitch-renderer.js: Echipa utilizatorului nu a fost găsită în gameState.");
        return;
    }

    // Aici ar trebui să ai o structură care să țină minte ce jucător e pe ce poziție
    // Pentru simplitate, vom folosi o logică de placeholder pentru acum.
    // Ideal ar fi ca userTeam.tactics.startingXI să conțină ID-urile jucătorilor pe poziții.

    // Inițializăm un obiect pentru a mapa sloturile la jucători, dacă nu există
    if (!userTeam.tactics) {
        userTeam.tactics = {
            formation: formationKey,
            mentality: 'balanced',
            startingXI: {} // Key: positionId, Value: playerId
        };
    } else if (!userTeam.tactics.startingXI) {
        userTeam.tactics.startingXI = {};
    }

    // Asigură-te că fiecare poziție din formație are un slot
    positions.forEach(pos => {
        const playerSlot = document.createElement('div');
        playerSlot.className = 'player-slot';
        playerSlot.dataset.positionId = pos.id; // ID unic pentru slot

        // Calculează poziția CSS
        playerSlot.style.left = `${pos.x}%`;
        playerSlot.style.top = `${pos.y}%`;
        playerSlot.style.transform = `translate(-50%, -50%)`; // Centrează elementul pe coordonate

        // Inițial, slotul poate fi gol sau populat cu un jucător existent
        const playerIdInSlot = userTeam.tactics.startingXI[pos.id];
        let player = null;
        if (playerIdInSlot) {
            player = teamPlayers.find(p => p.id === playerIdInSlot);
        } else {
            // Dacă slotul e gol, căutăm un jucător fără poziție asignată
            player = teamPlayers.find(p => !Object.values(userTeam.tactics.startingXI).includes(p.id) && p.position === pos.type);
            if (player) {
                userTeam.tactics.startingXI[pos.id] = player.id;
            }
        }
        
        if (player) {
            playerSlot.dataset.playerId = player.id;
            playerSlot.innerHTML = `<span>${player.lastName}<br>${player.overallRating}</span>`;
            playerSlot.classList.add('filled');
        } else {
            playerSlot.innerHTML = `<span>${pos.type}</span>`;
            playerSlot.classList.add('empty');
        }

        // Adaugă event listeners pentru Drag & Drop
        playerSlot.draggable = true;
        playerSlot.addEventListener('dragstart', (e) => {
            currentSelectedPlayerElement = playerSlot;
            e.dataTransfer.setData('text/plain', playerSlot.dataset.playerId || 'empty'); // Transferă ID-ul jucătorului sau 'empty'
            e.dataTransfer.setData('text/plain-from-slot-id', playerSlot.dataset.positionId); // Transferă ID-ul slotului de origine
            playerSlot.classList.add('dragging');
        });

        playerSlot.addEventListener('dragend', () => {
            currentSelectedPlayerElement.classList.remove('dragging');
            currentSelectedPlayerElement = null;
        });

        playerSlot.addEventListener('dragover', (e) => {
            e.preventDefault(); // Permite drop
            playerSlot.classList.add('over');
        });

        playerSlot.addEventListener('dragleave', () => {
            playerSlot.classList.remove('over');
        });

        playerSlot.addEventListener('drop', (e) => {
            e.preventDefault();
            playerSlot.classList.remove('over');

            const draggedPlayerId = e.dataTransfer.getData('text/plain');
            const sourceSlotId = e.dataTransfer.getData('text/plain-from-slot-id');
            const targetSlotId = playerSlot.dataset.positionId;

            const draggedPlayer = teamPlayers.find(p => p.id === draggedPlayerId);
            
            if (draggedPlayer) {
                // Logică de swap între jucători sau plasare într-un slot gol
                const playerInTargetSlotId = userTeam.tactics.startingXI[targetSlotId];
                
                // Actualizează startingXI
                userTeam.tactics.startingXI[targetSlotId] = draggedPlayerId;

                if (sourceSlotId) { // Dacă a venit dintr-un alt slot (swap)
                    if (playerInTargetSlotId && playerInTargetSlotId !== 'empty') {
                         userTeam.tactics.startingXI[sourceSlotId] = playerInTargetSlotId;
                    } else { // Dacă slotul sursă a devenit gol
                        delete userTeam.tactics.startingXI[sourceSlotId];
                    }
                }
                
                // Re-rendează terenul pentru a reflecta modificările
                renderPitch(pitchArea, formationKey, teamPlayers);
            } else if (draggedPlayerId === 'empty' && sourceSlotId) {
                // Dacă a fost tras un slot gol, pur și simplu eliberează slotul țintă
                delete userTeam.tactics.startingXI[targetSlotId];
                renderPitch(pitchArea, formationKey, teamPlayers);
            }
        });

        // Adaugă event listener pentru click pentru a deschide modalul de detalii jucător
        playerSlot.addEventListener('click', () => {
            const playerId = playerSlot.dataset.playerId;
            if (playerId) {
                const player = teamPlayers.find(p => p.id === playerId);
                if (player) {
                    openPlayerDetailsModal(player);
                }
            }
        });

        pitchArea.appendChild(playerSlot);
    });
    console.log("pitch-renderer.js: Jucători plasați pe teren.");
}
