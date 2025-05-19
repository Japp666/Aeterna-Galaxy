import { user } from './utils.js';
import { showHUD, updateHUD } from './hud.js';
import { showBuildings } from './buildings.js';
import { showResearch } from './research.js';
import { initMap } from './map.js';
import { startBotSimulation } from './bot.js';

const races = [
  {
    id: 'syari',
    name: 'Syari',
    description: 'Adaptabili, inovatori, moștenitori ai Pământului.',
    image: 'https://i.postimg.cc/NjBc3NZB/Emblema-Solari.png',
    available: true
  },
  {
    id: 'aethel',
    name: 'Aethel',
    description: 'Androizi avansați în căutarea sensului.',
    image: 'https://i.postimg.cc/VvCjm7zB/aethel-coming-soon.png',
    available: false
  }
];

export function showRaceSelection() {
  const container = document.getElementById('raceSelection');
  container.innerHTML = `
    <h2>Alege-ți rasa</h2>
    <div class="race-card-container">
      ${races
        .map(race => {
          return `
            <div class="race-card ${race.available ? '' : 'locked'}">
              <img src="${race.image}" alt="${race.name}">
              <h3>${race.name}</h3>
              <p>${race.description}</p>
              ${
                race.available
                  ? `<button onclick="selectRace('${race.id}')">Selectează</button>`
                  : `<span class="coming-soon">Coming soon</span>`
              }
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

window.selectRace = function (raceId) {
  user.race = raceId;
  document.getElementById('raceSelection').classList.remove('active');
  document.getElementById('mainInterface').classList.remove('hidden');
  showHUD();
  showBuildings();
  showResearch();
  initMap();
  startBotSimulation();
};
