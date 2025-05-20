import { showMenu } from './menu.js';
import { showHUD } from './hud.js'; // Asigură-te că importul există
import { showBuildings } from './buildings.js';
import { showRaceSelection } from './race.js';
import { user } from './user.js';

window.user = user; //ATTENTION (Am lăsat-o deocamdată, dar ar trebui eliminată pe viitor)

document.addEventListener('DOMContentLoaded', () => {
  const startGameButton = document.getElementById('start-game-button');
  if (startGameButton) {
    startGameButton.addEventListener('click', startGame);
  }
});

function startGame() {
  const nameInput = document.getElementById('commanderName');
  if (!nameInput || nameInput.value.trim() === '') {
    alert("Introdu numele comandantului.");
    return;
  }
  user.name = nameInput.value.trim();
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('raceSelection').classList.remove('hidden');
  showRaceSelection();
}

window.startGame = startGame;
