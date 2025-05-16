import { user } from './user.js';
import { renderBuildings } from './buildings.js';
import { renderResearch } from './research.js';
import { updateResources, handleOfflineProduction } from './utils.js';
import { renderMap } from './map.js';

window.user = user;

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', startGame);
  }
});

function startGame() {
  const name = document.getElementById('commander-name').value.trim();
  if (!name) return;

  user.name = name;
  document.getElementById('login-container').classList.add('hidden');
  document.getElementById('race-container').classList.remove('hidden');
  document.getElementById('race-container').innerHTML = `
    <h2>Alege rasa</h2>
    <div class="race-cards">
      <div class="race-card" onclick="selectRace('Solari')">
        <img src="https://i.postimg.cc/NjBc3NZB/Emblema-Solari.png" />
        <h3>Solari</h3>
        <p>Oameni organizați și adaptați. Rasa de start.</p>
      </div>
    </div>
  `;
}

window.selectRace = function (race) {
  user.race = race;
  document.getElementById('race-container').classList.add('hidden');
  document.getElementById('game-container').classList.remove('hidden');
  renderBuildings();
  renderResearch();
  updateResources();
  handleOfflineProduction();
};

window.switchTab = function (tab) {
  ['buildings', 'research', 'fleet', 'map'].forEach(id => {
    document.getElementById(`${id}-section`).classList.add('hidden');
  });
  document.getElementById(`${tab}-section`).classList.remove('hidden');

  if (tab === 'map') renderMap();
};
