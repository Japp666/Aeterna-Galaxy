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

  const form = document.getElementById('setupForm');
  const coachInput = document.getElementById('coachNickname');
  const clubInput = document.getElementById('clubName');
  const emblemsContainer = document.getElementById('emblemsContainer');
  const startBtn = document.getElementById('startButton');

  // Populate emblems
  for (let i = 1; i <= 20; i++) {
    const code = String(i).padStart(2, '0');
    const img = document.createElement('img');
    img.src = `img/emblems/emblema${code}.png`;
    img.alt = `Emblema ${code}`;
    img.dataset.emblemUrl = img.src;
    img.classList.add('emblem-option');
    img.onerror = () => img.src = 'img/emblems/emblema01.png';
    img.addEventListener('click', () => {
      emblemsContainer.querySelectorAll('.emblem-option')
        .forEach(e => e.classList.remove('selected'));
      img.classList.add('selected');
      validate();
    });
    emblemsContainer.appendChild(img);
  }

  function validate() {
    startBtn.disabled = !(
      coachInput.value.trim() &&
      clubInput.value.trim() &&
      emblemsContainer.querySelector('.selected')
    );
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const selected = emblemsContainer.querySelector('.selected');
    if (!selected) return;
    const emblemUrl = selected.dataset.emblemUrl;

    // update state
    updateGameState({
      isGameStarted: true,
      coach: {
        nickname: coachInput.value.trim(),
        reputation: 50,
        experience: 0
      },
      club: {
        name: clubInput.value.trim(),
        emblemUrl,
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

    // generate divisions
    const divs = generateLeagueSystem();
    updateGameState({ divisions: divs });
    saveGameState();

    onSetupComplete?.();
  });
}
