import { showMenu } from './menu.js';
import { showHUD } from './hud.js';
import { showBuildings } from './buildings.js';
import { showRaceSelection } from './race.js';
import { user } from './user.js';

// Această linie window.user = user; ar trebui eliminată pe viitor,
// dar momentan o las pentru compatibilitate dacă există alte dependențe.
window.user = user;

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
  // showHUD(); // HUD-ul este inițializat automat la selectarea rasei acum.
  // showMenu(); // Meniul este inițializat automat la selectarea rasei acum.
}

// Această linie window.startGame = startGame; ar trebui eliminată pe viitor.
window.startGame = startGame;
