import { getGameState, initializeGameState } from './game-state.js';
import { renderDashboard } from './dashboard-renderer.js';

export function initializeUI() {
  console.log("game-ui.js: Inițializez interfața utilizatorului...");
  const gameState = initializeGameState();

  if (gameState.isGameStarted) {
    console.log("game-ui.js: Jocul a început, randez dashboard-ul.");
    renderDashboard();
  } else {
    console.log("game-ui.js: Jocul nu a început, afișez ecranul de setup.");
    // Presupunem că există o funcție renderSetup definită în setup.js
    import('./setup.js').then(module => {
      module.renderSetup();
    }).catch(error => {
      console.error("game-ui.js: Eroare la încărcarea setup.js:", error);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("game-ui.js: DOM încărcat, inițializez UI-ul.");
  initializeUI();
});
