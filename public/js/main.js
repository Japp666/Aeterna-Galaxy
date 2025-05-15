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

window.addEventListener('beforeunload', () => {
  localStorage.setItem('lastActive', Date.now());
});

function startGame() {
  const nameInput = document.getElementById('commander-name');
  const name = nameInput?.value?.trim();
  if (!name) return;

  user.name = name;

  document.getElementById('login-container').classList.add('hidden');
  document.getElementById('race-container').classList.remove('hidden');

  document.getElementById('race-container').innerHTML = `
    <h2>Alege rasa</h2>
    <div class="race-cards">
      <div class="race-card" onclick="selectRace('Solari')">
        <img src="https://i.postimg.cc/NjBc3NZB/Emblema-Solari.png" alt="Solari" />
        <h3>Solari</h3>
        <p>Oameni evoluați. Înțelepți și organizați. (Disponibil)</p>
      </div>
      <div class="race-card locked">
        <h3>???</h3>
        <p>Coming soon...</p>
      </div>
    </div>
  `;
}

function selectRace(race) {
  user.race = race;
  document.getElementById('race-container').classList.add('hidden');
  document.getElementById('game-container').classList.remove('hidden');

  renderBuildings();
  renderResearch();
  updateResources();
  handleOfflineProduction(); // <== aici, după ce HUD e vizibil
}

function switchTab(tabName) {
  const sections = ['buildings', 'research', 'fleet', 'map'];
  sections.forEach(section => {
    document.getElementById(`${section}-section`)?.classList.add('hidden');
  });
  document.getElementById(`${tabName}-section`)?.classList.remove('hidden');

  if (tabName === 'map') renderMap();
}

window.selectRace = selectRace;
window.switchTab = switchTab;
