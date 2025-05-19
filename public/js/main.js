import { showMenu } from './menu.js';
import { showHUD } from './hud.js';
import { showBuildings } from './buildings.js';
import { showRaceSelection } from './race.js';

export let user = {
  name: '',
  race: '',
  resources: {
    metal: 1000,
    crystal: 800,
    energy: 500
  },
  score: 0,
  buildings: [],
  researches: [],
  fleet: {
    small: 0,
    medium: 0,
    large: 0
  }
};

window.startGame = function () {
  const nameInput = document.getElementById('commanderName');
  if (!nameInput || nameInput.value.trim() === '') {
    alert("Introdu numele comandantului.");
    return;
  }

  user.name = nameInput.value.trim();
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('raceSelection').classList.remove('hidden');

  showRaceSelection();
};
