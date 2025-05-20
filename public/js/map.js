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
  map.innerHTML = '<h2>Harta Galactică</h2><div id="map-grid"></div><div id="map-tooltip"></div>'; // Clear previous content and ensure tooltip is present

  const mapGrid = document.getElementById('map-grid');
  const mapTooltip = document.getElementById('map-tooltip'); // Referința la elementul tooltip
  const width = 20; // Dublat de la 10
  const height = 20; // Dublat de la 10

  // Coordonatele jucătorului
  const playerX = 9;
  const playerY = 9;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = document.createElement('div');
      cell.className = 'map-cell';
      cell.dataset.x = x; // Folosim dataset pentru a stoca X
      cell.dataset.y = y; // Folosim dataset pentru a stoca Y

      // Adaugă iconițe pentru jucător și BOT
      if (x === playerX && y === playerY) {
        cell.classList.add('player-position');
        cell.innerHTML = '<span class="map-player">👨‍🚀</span>';
      } else if (x === botPlayer.coords.x && y === botPlayer.coords.y) {
        cell.classList.add('bot-position');
        cell.innerHTML = '<span class="map-player bot">🤖</span>';
      }

      // Adaugă evenimentele de hover
      cell.addEventListener('mouseover', (event) => {
        let tooltipContent = `Coordonate: [${x}:${y}]`;
        
        // Verifică dacă este poziția jucătorului
        if (x === playerX && y === playerY) {
          tooltipContent += `<br>Nume: ${user.name}<br>Puncte: ${user.score}`;
        }
        // Verifică dacă este poziția BOT-ului
        else if (x === botPlayer.coords.x && y === botPlayer.coords.y) {
          tooltipContent += `<br>Nume: ${botPlayer.name}<br>Puncte: ${botPlayer.score}`;
        }

        mapTooltip.innerHTML = tooltipContent;
        mapTooltip.style.display = 'block'; // Fă tooltip-ul vizibil

        // Poziționează tooltip-ul lângă cursor
        // Ajustează offset-ul dacă este necesar pentru a nu fi exact sub cursor
        mapTooltip.style.left = `${event.clientX + 10}px`;
        mapTooltip.style.top = `${event.clientY + 10}px`;
      });

      cell.addEventListener('mouseout', () => {
        mapTooltip.style.display = 'none'; // Ascunde tooltip-ul
      });

      mapGrid.appendChild(cell);
    }
  }
}
