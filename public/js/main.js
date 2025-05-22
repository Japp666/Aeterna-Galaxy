import { setPlayerName, setPlayerRace } from './user.js';
import { updateHUD } from './hud.js';
import { initBotAI } from './bot.js';
import { loadTabContent } from './menu.js';
import { showMessage } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM content loaded. Starting game initialization...");

  // Încarcă HUD-ul și meniul
  await loadTabContent('hud', 'hud');
  await loadTabContent('main-menu', 'menu');

  // Preia datele din localStorage (nume și rasă)
  const storedName = localStorage.getItem('player_name');
  const storedRace = localStorage.getItem('player_race');

  if (storedName) setPlayerName(storedName);
  if (storedRace) setPlayerRace(storedRace);

  updateHUD();

  // Încarcă tab-ul principal
  await loadTabContent('main-content', 'home');

  // Pornește AI-ul inamic
  initBotAI();

  // Afișează mesaj de bun venit
  showMessage(`Bun venit, ${storedName} al rasei ${storedRace}!`, 'success');
});
