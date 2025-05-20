import { user } from './user.js';

// Definirea unui BOT de exemplu
const botPlayer = {
  name: 'Comandant Xylos (BOT)',
  coords: { x: 15, y: 7 }, // Coordonatele unde va apărea BOT-ul (ajustat pentru grila nouă)
  score: 1340,
  race: 'Aethel'
};

export function initMap() {
  const map = document.getElementById('mapTab');
  map.innerHTML = '<h2>Harta Galactică</h2><div id="map-grid"></div>'; // Clear previous content

  const mapGrid = document.getElementById('map-grid');
  const width = 20; // Dublat de la 10
  const height = 20; // Dublat de la 10

  // Coordonatele jucătorului
  // Vom plasa jucătorul undeva în centrul grilei noi
  const playerX = 9;
  const playerY = 9;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = document.createElement('div');
      cell.className = 'map-cell';
      cell.dataset.coords = `${x},${y}`; // Stocăm coordonatele ca data attribute

      let tooltipText = `Coordonate: [${x}:${y}]`; // Textul de bază al tooltip-ului

      // Verifică dacă celula este poziția jucătorului
      if (x === playerX && y === playerY) {
        cell.classList.add('player-position');
        cell.innerHTML = '<span class="map-player">👨‍🚀</span>';
        tooltipText = `Comandant ${user.name}\nCoordonate: [${x}:${y}]\nPuncte: ${user.score}`;
      }
      // Verifică dacă celula este poziția BOT-ului
      else if (x === botPlayer.coords.x && y === botPlayer.coords.y) {
        cell.classList.add('bot-position');
        cell.innerHTML = '<span class="map-player bot">🤖</span>';
        tooltipText = `${botPlayer.name}\nCoordonate: [${x}:${y}]\nPuncte: ${botPlayer.score}`;
      }
      
      cell.title = tooltipText; // Setează atributul title pentru tooltip
      mapGrid.appendChild(cell);
    }
  }
}
