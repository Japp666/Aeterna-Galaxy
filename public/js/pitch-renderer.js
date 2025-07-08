// public/js/pitch-renderer.js

import { formations, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './formations-data.js';

/** Desenează slot‐urile goale conform formației + mentalității */
export function renderPitch(container, formation, mentality) {
  container.innerHTML = '';
  const layout = formations[formation] || [];
  const off   = MENTALITY_ADJUSTMENTS[mentality] || { xOffset:0, yOffset:0 };

  layout.forEach(slot => {
    const el = document.createElement('div');
    el.className = 'player-slot empty';
    el.dataset.position = slot.pos;
    el.style.left = `calc(${slot.x + off.xOffset}% - 4%)`;
    el.style.top  = `calc(${slot.y + off.yOffset}% - 4%)`;
    el.innerHTML = `<span>${POSITION_MAP[slot.pos] || slot.pos}</span>`;
    container.appendChild(el);
  });
}

/** Plasează jucătorii conform teamFormation și actualizează lista de disponibili */
export function placePlayersInPitchSlots(container, teamFormation, listEl, allPlayers) {
  // curăță teren
  container.querySelectorAll('.player-slot').forEach(s => {
    s.classList.add('empty');
    s.innerHTML = `<span>${POSITION_MAP[s.dataset.position]||s.dataset.position}</span>`;
    delete s.dataset.playerId;
  });
  // marchează
  allPlayers.forEach(p=>p.onPitch=false);

  // plasează
  Object.entries(teamFormation).forEach(([pos,id])=>{
    const slot = container.querySelector(`.player-slot[data-position="${pos}"]`);
    const ply  = allPlayers.find(x=>x.id===id);
    if (slot && ply) {
      slot.classList.remove('empty');
      slot.dataset.playerId = id;
      slot.innerHTML = `<div class="player-on-pitch">${ply.initials}</div>`;
      ply.onPitch = true;
    }
  });

  // randează lista de disponibili
  renderAvailablePlayers(listEl, allPlayers);
}

/** Crează carduri mici cu nume, poziție și stelute */
export function renderAvailablePlayers(container, allPlayers) {
  container.innerHTML = '';
  allPlayers
    .filter(p => !p.onPitch)
    .forEach(p => {
      const c = document.createElement('div');
      c.className = 'player-card';
      c.draggable = true;
      c.dataset.playerId = p.id;
      c.innerHTML = `
        <strong>${p.initials}</strong><br>
        <small>${p.position}</small><br>
        <div class="player-stars">${'★'.repeat(p.stars)}${'☆'.repeat(6-p.stars)}</div>
      `;
      container.appendChild(c);
    });
}
