// public/js/pitch-renderer.js

import { formations, MENTALITY_ADJUSTMENTS, POSITION_MAP } from './formations-data.js';

export function renderPitch(container, formationName, mentality) {
  container.innerHTML = '';
  const layout = formations[formationName];
  const adj    = MENTALITY_ADJUSTMENTS[mentality] || { xOffset:0,yOffset:0 };

  layout.forEach(slot => {
    const div = document.createElement('div');
    div.className = 'player-slot empty';
    div.dataset.pos = slot.pos;
    div.style.left = `calc(${slot.x + adj.xOffset}% - 4%)`;
    div.style.top  = `calc(${slot.y + adj.yOffset}% - 4%)`;
    div.innerHTML = `<span>${POSITION_MAP[slot.pos]||slot.pos}</span>`;
    container.appendChild(div);
  });
}
