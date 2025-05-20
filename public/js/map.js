import { user } from './user.js';

export function initMap() {
  const map = document.getElementById('mapTab');
  map.innerHTML = '<h2>Harta Galactică</h2><div id="map-grid"></div>'; // Clear previous content

  const mapGrid = document.getElementById('map-grid');
  const width = 10;
  const height = 10;

  for (let y = 0; y < height; y++) {
    const row = document.createElement('div');
    row.className = 'map-row';
    for (let x = 0; x < width; x++) {
      const cell = document.createElement('div');
      cell.className = 'map-cell';
      cell.dataset.coords = `${x},${y}`;

      let tooltipText = `Coordonate: [${x}:${y}]`; // Textul de bază al tooltip-ului

      if (x === 5 && y === 5) {
        cell.classList.add('player-position');
        cell.innerHTML = '<span class="map-player">👨‍🚀</span>';
        tooltipText = `Comandant ${user.name}\nCoordonate: [${x}:${y}]\nPuncte: ${user.score}`;
      }
      if (x === 7 && y === 3) {
        cell.classList.add('bot-position');
        cell.innerHTML = '<span class="map-player bot">🤖</span>';
        tooltipText = `Comandant Zeta (BOT)\nCoordonate: [${x}:${y}]\nPuncte: 1340`;
      }
      
      cell.title = tooltipText; // Setează atributul title pentru tooltip
      row.appendChild(cell);
    }
    mapGrid.appendChild(row);
  }
}
