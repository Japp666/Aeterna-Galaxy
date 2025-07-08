import { formations, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './formations-data.js';

export function renderPitch(container, formation, mentality) {
  container.innerHTML = '';
  const layout = formations[formation];
  const adj    = MENTALITY_ADJUSTMENTS[mentality] || { xOffset:0, yOffset:0 };

  layout.forEach(slot => {
    const el = document.createElement('div');
    el.className = 'player-slot empty';
    el.dataset.position = slot.pos;
    el.style.left = `calc(${slot.x + adj.xOffset}% - 4%)`;
    el.style.top  = `calc(${slot.y + adj.yOffset}% - 4%)`;
    el.innerHTML = `<span>${POSITION_MAP[slot.pos]||slot.pos}</span>`;
    container.appendChild(el);
  });
}

export function placePlayersInPitchSlots(container, teamFormation, availEl, players) {
  container.querySelectorAll('.player-slot').forEach(s => {
    s.classList.add('empty');
    s.innerHTML = `<span>${POSITION_MAP[s.dataset.position]||s.dataset.position}</span>`;
    delete s.dataset.playerId;
  });
  players.forEach(p=>p.onPitch=false);

  Object.entries(teamFormation).forEach(([pos,id])=>{
    if (!id) return;
    const slot = container.querySelector(`.player-slot[data-position="${pos}"]`);
    const ply  = players.find(x=>x.id===id);
    if (slot && ply) {
      slot.classList.remove('empty');
      slot.dataset.playerId = id;
      slot.innerHTML = `<div class="player-on-pitch" draggable data-player-id="${id}">${ply.initials}</div>`;
      ply.onPitch=true;
    }
  });

  // render available
  availEl.innerHTML = '';
  players.filter(p=>!p.onPitch).forEach(p=>{
    const div = document.createElement('div');
    div.className = 'available-player-item';
    div.textContent = `${p.initials} ${p.name} (${p.overall})`;
    div.draggable = true;
    availEl.appendChild(div);
  });
}
