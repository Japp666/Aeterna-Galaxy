import { user } from './main.js';
import { showMenu } from './menu.js';
import { showHUD } from './hud.js';
import { showBuildings } from './buildings.js';

const races = [
  {
    id: 'syari',
    name: 'Syari',
    description: 'Descendenții Pământului, adaptabili și curajoși.',
    image: 'https://i.postimg.cc/NjBc3NZB/Emblema-Solari.png',
    available: true
  },
  {
    id: 'aethel',
    name: 'Aethel',
    description: 'Androizi avansați - coming soon.',
    image: 'https://i.postimg.cc/VvCjm7zB/aethel-coming-soon.png',
    available: false
  }
];

export function showRaceSelection() {
  const container = document.getElementById('raceSelection');
  container.innerHTML = `
    <h2>Alege-ți rasa</h2>
    <div class="race-card-container">
      ${races.map(race => `
        <div class="race-card ${race.available ? '' : 'locked'}">
          <img src="${race.image}" alt="${race.name}">
          <h3>${race.name}</h3>
          <p>${race.description}</p>
          ${race.available ? `<button onclick="selectRace('${race.id}')">Selectează</button>` : `<span class="coming-soon">Coming Soon</span>`}
        </div>
      `).join('')}
    </div>
  `;
}

window.selectRace = function (raceId) {
  user.race = raceId;
  document.getElementById('raceSelection').classList.add('hidden');
  document.getElementById('gameInterface').classList.remove('hidden');

  showMenu();
  showHUD();
  showBuildings();
};
