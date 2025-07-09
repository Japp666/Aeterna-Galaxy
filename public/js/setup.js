// public/js/setup.js

import {
  getGameState,
  updateGameState,
  saveGameState,
  generateLeagueSystem,
  generateInitialPlayers
} from './game-state.js';

export function initSetupScreen(onComplete) {
  const coachNameIn  = document.getElementById('coach-name');
  const clubNameIn   = document.getElementById('club-name');
  const coachNickIn  = document.getElementById('coach-nickname');
  const emblemsCont  = document.getElementById('emblemsContainer');
  const startBtn     = document.getElementById('startButton');
  let selectedEmblem = null;

  // Încarcă emblemele
  for (let i = 1; i <= 10; i++) {
    const img = document.createElement('img');
    img.src = `img/emblems/emblem${i}.png`;
    img.alt = `Emblemă ${i}`;
    img.className = 'emblem';
    img.addEventListener('click', () => {
      emblemsCont.querySelectorAll('img').forEach(x => x.classList.remove('selected'));
      img.classList.add('selected');
      selectedEmblem = img.src;
      validateForm();
    });
    emblemsCont.appendChild(img);
  }

  function validateForm() {
    const ok = coachNameIn.value.trim()
            && clubNameIn.value.trim()
            && coachNickIn.value.trim()
            && selectedEmblem;
    startBtn.disabled = !ok;
  }

  coachNameIn.addEventListener('input', validateForm);
  clubNameIn.addEventListener('input', validateForm);
  coachNickIn.addEventListener('input', validateForm);

  startBtn.addEventListener('click', e => {
    e.preventDefault();
    const state = getGameState();
    state.isGameStarted = true;
    state.coach = {
      name: coachNameIn.value.trim(),
      nickname: coachNickIn.value.trim()
    };
    state.club = {
      id: coachNickIn.value.trim(),
      name: clubNameIn.value.trim(),
      emblemUrl: selectedEmblem,
      funds: 1000000
    };

    // Generează liga și jucătorii de start
    generateLeagueSystem(state);
    generateInitialPlayers(state);

    updateGameState(state);
    saveGameState(state);

    onComplete();
  });
}
