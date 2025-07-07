// public/js/team.js – Logica tabului Echipă

import { initTacticsManager, autoArrangePlayers } from './tactics-manager.js';
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';
import { getGameState } from './game-state.js';
import { loadComponent } from './utils.js';
import { showError, showSuccess } from './notification.js'; // nou

// Încarcă HTML-ul tabului Echipă
export async function loadTeamTabContent() {
  console.log("team.js: Se încarcă componenta HTML pentru tab-ul Echipă.");
  return loadComponent('components/team.html');
}

// Așteaptă elemente din DOM înainte de inițializare
function waitForElements(root, selectors, maxTries = 100, interval = 50) {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      const found = selectors.map(sel => root.querySelector(sel));
      if (found.every(el => el)) {
        clearInterval(timer);
        resolve(found);
      } else if (tries >= maxTries) {
        clearInterval(timer);
        reject(new Error('Elementele necesare nu au fost găsite.'));
      }
    }, interval);
  });
}

// Inițializează logica tabului Echipă
export async function initTeamTab(rootElement) {
  console.log("team.js: Initializare tab Echipă.");

  if (!rootElement) {
    showError("Eroare: Elementul principal al tab-ului Echipă nu a fost găsit.");
    const gameContent = document.getElementById('game-content');
    if (gameContent) {
      gameContent.innerHTML = `<p class="error-message">Eroare: elementul principal nu a fost găsit.</p>`;
    }
    return;
  }

  try {
    const [
      formationButtons,
      mentalityButtons,
      pitchElement,
      availablePlayersList,
      autoButton
    ] = await waitForElements(rootElement, [
      '#formation-buttons',
      '#mentality-buttons',
      '#football-pitch',
      '#available-players-list',
      '#auto-arrange-players-btn'
    ]);

    // Inițializează tactici
    initTacticsManager(formationButtons, mentalityButtons, pitchElement, availablePlayersList);

    // Buton "Auto"
    autoButton.addEventListener('click', () => {
      autoArrangePlayers();
      showSuccess("Jucătorii au fost aranjați automat.");
    });

    // Randează terenul și jucătorii
    const gameState = getGameState();
    renderPitch(pitchElement, gameState.currentFormation, gameState.currentMentality);
    placePlayersInPitchSlots(
      pitchElement,
      gameState.teamFormation,
      gameState.players,
      availablePlayersList,
      (draggedPlayerId, targetPos) => {
        // Aici poate fi adăugată logica de update
      }
    );
    renderAvailablePlayers(availablePlayersList, gameState.players);

    showSuccess("Tab-ul Echipă a fost încărcat cu succes!");
  } catch (err) {
    console.error("team.js: Eroare la inițializare:", err);
    showError("Eroare la încărcarea tab-ului Echipă.");
    rootElement.innerHTML = `<p class="error-message">Eroare: ${err.message}</p>`;
  }
}
