// public/js/setup.js

import { getGameState, updateGameState, saveGameState, generateLeagueSystem } from './game-state.js';
import { generateInitialPlayers } from './player-generator.js';

let onSetupCompleteCallback = null;

export function initSetupScreen(callback) {
  onSetupCompleteCallback = callback;
  const setupForm = document.getElementById('setupForm');
  const coachInput = document.getElementById('coachNickname');
  const clubInput = document.getElementById('clubName');
  const emblemsContainer = document.getElementById('emblemsContainer');
  const startButton = document.getElementById('startButton');
  const gameState = getGameState();

  // afișează sezonul și ziua curentă
  document.getElementById('setup-current-season').textContent = gameState.currentSeason;
  document.getElementById('setup-current-day').textContent = gameState.currentDay;

  // generați selectorul de embleme
  let selectedEmblem = '';
  for (let i = 1; i <= 20; i++) {
    const img = document.createElement('img');
    img.src = `img/emblems/emblema${String(i).padStart(2, '0')}.png`;
    img.alt = `Emblema ${i}`;
    img.dataset.emblemUrl = img.src;
    img.classList.add('emblem-option');
    img.addEventListener('click', () => {
      emblemsContainer.querySelectorAll('.emblem-option')
        .forEach(el => el.classList.remove('selected'));
      img.classList.add('selected');
      selectedEmblem = img.dataset.emblemUrl;
      validate();
    });
    emblemsContainer.appendChild(img);
  }

  function validate() {
    const ok = coachInput.value.trim() &&
               clubInput.value.trim() &&
               selectedEmblem;
    startButton.disabled = !ok;
  }

  coachInput.addEventListener('input', validate);
  clubInput.addEventListener('input', validate);

  setupForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!coachInput.value.trim() || !clubInput.value.trim() || !selectedEmblem) return;

    // 1. Generare jucători inițiali
    const initialPlayers = generateInitialPlayers(25);

    // 2. Actualizare state de bază
    updateGameState({
      isGameStarted: true,
      coach: {
        nickname: coachInput.value.trim(),
        reputation: 50,
        experience: 0
      },
      club: {
        name: clubInput.value.trim(),
        emblemUrl: selectedEmblem,
        funds: 10000000,
        reputation: 50,
        facilitiesLevel: 1
      },
      players: initialPlayers,
      currentSeason: 1,
      currentDay: 1,
      currentFormation: '4-4-2',
      currentMentality: 'balanced',
      teamFormation: {}
    });

    // 3. Generare ligi & divizii
    const league = generateLeagueSystem();
    updateGameState({ divisions: league });

    // 4. Salvare finală și start joc
    saveGameState();
    if (onSetupCompleteCallback) onSetupCompleteCallback();
  });
}
