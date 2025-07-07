// public/js/setup.js

import {
  getGameState,
  updateGameState,
  saveGameState,
  generateLeagueSystem
} from './game-state.js';
import { generateInitialPlayers } from './player-generator.js';

let onSetupComplete = null;

export function initSetupScreen(callback) {
  onSetupComplete = callback;

  const form             = document.getElementById('setupForm');
  const coachInput       = document.getElementById('coachNickname');
  const clubInput        = document.getElementById('clubName');
  const emblemsContainer = document.getElementById('emblemsContainer');
  const startBtn         = document.getElementById('startButton');

  // Populăm 20 de embleme, cu padStart(2,'0') și cale relativă
  for (let i = 1; i <= 20; i++) {
    const code = String(i).padStart(2, '0');
    const img  = document.createElement('img');
    img.src    = `img/emblems/emblema${code}.png`;
    img.alt    = `Emblema ${code}`;
    img.dataset.emblemUrl = img.src;
    img.classList.add('emblem-option');
    // fallback o singură dată
    img.onerror = function () {
      this.onerror = null;
      this.src = 'img/emblems/emblema01.png';
    };
    img.addEventListener('click', () => {
      emblemsContainer
        .querySelectorAll('.emblem-option')
        .forEach(e => e.classList.remove('selected'));
      img.classList.add('selected');
      validate();
    });
    emblemsContainer.appendChild(img);
  }

  // Activează butonul Start doar când toate câmpurile sunt completate
  function validate() {
    startBtn.disabled = !(
      coachInput.value.trim() &&
      clubInput.value.trim() &&
      emblemsContainer.querySelector('.selected')
    );
  }

  coachInput.addEventListener('input', validate);
  clubInput.addEventListener('input', validate);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const selected = emblemsContainer.querySelector('.selected');
    if (!selected) return;

    // Actualizează gameState
    updateGameState({
      isGameStarted: true,
      coach: {
        nickname: coachInput.value.trim(),
        reputation: 50,
        experience: 0
      },
      club: {
        name: clubInput.value.trim(),
        emblemUrl: selected.dataset.emblemUrl,
        funds: 10000000,
        reputation: 50,
        facilitiesLevel: 1
      },
      players: generateInitialPlayers(25),
      currentSeason: 1,
      currentDay: 1,
      currentFormation: '4-4-2',
      currentMentality: 'balanced',
      teamFormation: {}
    });

    // Generează divizii și salvează
    const divisions = generateLeagueSystem();
    updateGameState({ divisions });
    saveGameState();

    onSetupComplete?.();
  });
}
