import { user } from './user.js'; // Import user pentru a accesa numele și scorul jucătorului

// Definirea unui BOT de exemplu
const botPlayer = {
  name: 'Comandant Xylos (BOT)',
  coords: { x: 7, y: 3 }, // Coordonatele unde va apărea BOT-ul
  score: 1340,
  race: 'Aethel' // Poate fi adăugat și un câmp rasă
};

export function initMap() {
  const map = document.getElementById('mapTab');
  map.innerHTML = '<h2>Harta Galactică</h2><div id="map-grid"></div>'; // Clear previous content

  const mapGrid = document.getElementById('map-grid');
  const width = 10;
  const height = 10;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = document.createElement('div');
      cell.className = 'map-cell';
      cell.dataset.coords = `${x},${y}`; // Stocăm coordonatele ca data attribute

      let tooltipText = `Coordonate: [${x}:${y}]`; // Textul de bază al tooltip-ului

      // Verifică dacă celula este poziția jucătorului
      // Asumăm că jucătorul este mereu la 5,5 pentru moment
      if (x === 5 && y === 5) {
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
