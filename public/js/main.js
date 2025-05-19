import { showRaceSelection, setupRaceCards } from './race.js';
import { initBuildings } from './buildings.js';
import { initResearch } from './research.js';
import { updateHUD } from './hud.js';
import { initMap } from './map.js';
import { showTab } from './utils.js';

function startGame() {
  const input = document.getElementById('commanderName');
  const name = input ? input.value.trim() : '';
  if (!name) {
    alert("Introduceți un nume de comandant!");
    return;
  }

  window.user = {
    name,
    race: '',
    score: 0,
    resources: { metal: 1000, crystal: 1000, energy: 1000 },
    production: { metal: 0, crystal: 0, energy: 0 },
    buildings: {},
    research: {},
    bonuses: {}
  };

  document.getElementById('login-screen').classList.add('hidden');
  showRaceSelection();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('startButton').addEventListener('click', startGame);
  setupRaceCards();
  updateHUD();
  initBuildings();
  initResearch();
  initMap();
});
