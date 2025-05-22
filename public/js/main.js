import { setPlayerName, setPlayerRace, getPlayerName, getPlayerRace } from './user.js';
import { updateHUD } from './hud.js';
import { loadTabContent } from './menu.js';
import { showMessage } from './utils.js';
import { initBotAI } from './bot.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM content loaded. Starting game initialization...");

  // Încarcă HUD-ul
  await loadTabContent('hud', 'hud');

  // 🧠 Preluare nume din localStorage
  const storedName = localStorage.getItem('player_name');
  if (storedName) {
    setPlayerName(storedName);
    console.log(`Nume jucător preluat: ${storedName}`);
  } else {
    console.warn("Numele jucătorului nu este setat!");
    // Aici poți decide ce faci: redirect, fallback, etc.
  }

  updateHUD();

  // Alegerea rasei tot aici (sau din login dacă preferi)
  console.log("Showing race selection screen...");
  await showRaceSelectionScreen();
  const race = getPlayerRace();
  updateHUD();

  console.log(`Game initialized for ${storedName} (${race})`);
  loadTabContent('home');
  initBotAI();
  showMessage(`Bun venit, ${storedName} al rasei ${race}!`, 'success');
});
