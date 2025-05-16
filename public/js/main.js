import { user } from './user.js';
import { initializeHUD } from './hud.js';
import { renderBuildings } from './buildings.js';
import { renderResearch } from './research.js';
import { handleOfflineProduction } from './utils.js';

window.startGame = function () {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) return alert('Introdu un nume de comandant!');
  user.name = name;
  document.getElementById('commander-name').classList.add('hidden');
  document.getElementById('race-container').innerHTML = `
    <h2>Alege rasa</h2>
    <div class="race-cards">
      <div class="race-card" onclick="selectRace('Solari')">
        <img src="https://i.postimg.cc/NjBc3NZB/Emblema-Solari.png" />
        <h3>Solari</h3>
        <p>Rasă de start</p>
      </div>
    </div>`;
  document.getElementById('race-container').classList.remove('hidden');
};

window.selectRace = function (race) {
  user.race = race;
  user.resources = { metal: 1000, crystal: 1000, energy: 1000 };
  document.getElementById('race-container').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  initializeHUD();
  renderBuildings();
  renderResearch();
  handleOfflineProduction();
};

window.showTab = function (tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(tabName + 'Tab').classList.remove('hidden');
};
