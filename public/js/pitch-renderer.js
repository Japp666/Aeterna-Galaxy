// js/pitch-renderer.js - Modul pentru randarea terenului și a jucătorilor pe el

import { getRarityByOverall } from './player-generator.js'; // Import din noul modul

// Obiect pentru a stoca formațiile predefinite
export const formations = {
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

/**
 * Randarea unui card de jucător pentru teren (simplificat).
 * @param {object} player - Obiectul jucătorului.
 * @returns {HTMLElement} Elementul HTML al cardului jucătorului pentru teren.
 */
export function createPitchPlayerCard(player) {
    const playerCard = document.createElement('div');
    playerCard.classList.add('player-card', 'on-pitch', `rarity-${getRarityByOverall(player.overall)}`); // Folosim getRarityByOverall din player-generator
    playerCard.setAttribute('draggable', 'true');
    playerCard.dataset.playerId = player.id;

    playerCard.innerHTML = `
        <h3>${player.name.split(' ')[1].substring(0, 5)}</h3>
        <p>${player.overall} OvR</p>
        <p>${player.position.substring(0, 3).toUpperCase()}</p>
    `;

    return playerCard;
}

/**
 * Randarea terenului de fotbal și a jucătorilor pe el.
 * @param {string} formationName - Numele formației curente.
 * @param {Array<object>} players - Lista de jucători din gameState.
 */
export function renderPitch(formationName, players) {
    const pitch = document.getElementById('football-pitch');
    if (!pitch) {
        console.error("Terenul de fotbal ('#football-pitch') nu a fost găsit la renderPitch.");
        return;
    }
    const allSlots = pitch.querySelectorAll('.player-slot');

    allSlots.forEach(slot => {
        slot.innerHTML = '';
        slot.classList.remove('occupied');
        slot.dataset.playerId = '';
    });

    const currentFormation = formations[formationName];
    if (!currentFormation) {
        console.error(`Formația "${formationName}" nu a fost găsită.`);
        return;
    }

    for (const slotId in currentFormation.slots) {
        const slotElement = pitch.querySelector(`[data-slot-id="${slotId}"]`);
        if (slotElement) {
            const playerInSlot = players.find(p => p.currentSlot === slotId);

            if (playerInSlot) {
                slotElement.appendChild(createPitchPlayerCard(playerInSlot));
                slotElement.classList.add('occupied');
                slotElement.dataset.playerId = playerInSlot.id;
            } else {
                slotElement.innerHTML = `<span class="slot-placeholder">${currentFormation.slots[slotId].type.substring(0,3).toUpperCase()}</span>`;
            }
        }
    }
}
