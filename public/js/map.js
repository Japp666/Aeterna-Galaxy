// map.js

import { user } from './user.js';

export function generateMap() {
  const map = document.getElementById('map-grid');
  map.innerHTML = '';

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const div = document.createElement('div');
      div.className = 'map-cell';

      if (x === 4 && y === 4) {
        div.style.backgroundColor = '#0ff';
        div.setAttribute('data-info', `${user.name} • Puncte: ${user.score} • [${x},${y}]`);
      } else {
        div.setAttribute('data-info', `Coord: [${x},${y}]`);
      }

      map.appendChild(div);
    }
  }
}

