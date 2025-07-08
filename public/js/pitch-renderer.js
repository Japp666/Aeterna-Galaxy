// public/js/pitch-renderer.js

import { formations, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './formations-data.js';

/**
 * Desenează terenul și sloturile goale conform formației și mentalității.
 * @param {HTMLElement} container 
 * @param {string} formationName 
 * @param {string} mentalityName 
 */
export function renderPitch(container, formationName, mentalityName) {
  container.innerHTML = '';
  const layout = formations[formationName] || [];
  const adjust = MENTALITY_ADJUSTMENTS[mentalityName] || { xOffset: 0, yOffset: 0 };

  layout.forEach(slot => {
    const slotEl = document.createElement('div');
    slotEl.className = 'player-slot empty';
    slotEl.dataset.position = slot.pos;
    slotEl.style.left = `calc(${slot.x + adjust.xOffset}% - 4%)`;
    slotEl.style.top  = `calc(${slot.y + adjust.yOffset}% - 4%)`;
    slotEl.innerHTML = `<span>${POSITION_MAP[slot.pos] || slot.pos}</span>`;
    container.appendChild(slotEl);
  });
}

/**
 * Plasează jucătorii pe sloturile de pe teren după teamFormation
 * și actualizează lista de jucători disponibili.
 * @param {HTMLElement} container 
 * @param {Object} teamFormation 
 * @param {HTMLElement} availableEl 
 * @param {Array} allPlayers 
 */
export function placePlayersInPitchSlots(container, teamFormation, availableEl, allPlayers) {
  // resetează terenul
  container.querySelectorAll('.player-slot').forEach(slot => {
    slot.classList.add('empty');
    slot.innerHTML = `<span>${POSITION_MAP[slot.dataset.position] || slot.dataset.position}</span>`;
    delete slot.dataset.playerId;
  });

  // marchează jucătorii ca nefiind pe teren
  allPlayers.forEach(p => p.onPitch = false);

  // plasează conform teamFormation
  Object.entries(teamFormation).forEach(([pos, playerId]) => {
    if (!playerId) return;
    const slot = container.querySelector(`.player-slot[data-position="${pos}"]`);
    const player = allPlayers.find(p => p.id === playerId);
    if (slot && player) {
      slot.classList.remove('empty');
      slot.dataset.playerId = player.id;
      slot.innerHTML = `
        <div class="player-on-pitch" draggable="true" data-player-id="${player.id}">
          ${player.initials}
        </div>
      `;
      player.onPitch = true;
    }
  });

  // re-randează lista de jucători disponibili
  renderAvailablePlayers(availableEl, allPlayers);
}

/**
 * Randează jucătorii disponibili sub formă de carduri.
 * @param {HTMLElement} container 
 * @param {Array} allPlayers 
 */
export function renderAvailablePlayers(container, allPlayers) {
  container.innerHTML = '';
  allPlayers
    .filter(p => !p.onPitch)
    .forEach(p => {
      const card = document.createElement('div');
      card.className = 'player-card';
      card.draggable = true;
      card.dataset.playerId = p.id;
      card.innerHTML = `
        <strong>${p.initials}</strong><br>
        <small>${p.position}</small><br>
        <div class="player-stars">
          ${'★'.repeat(p.stars)}${'☆'.repeat(6 - p.stars)}
        </div>
      `;
      container.appendChild(card);
    });
}
