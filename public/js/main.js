import { setPlayerName, setPlayerRace } from './user.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM content loaded. Starting game initialization...");

  await loadTabContent('hud', 'hud');

  // Nume și rasă din localStorage
  const storedName = localStorage.getItem('player_name');
  const storedRace = localStorage.getItem('player_race');

  if (storedName) setPlayerName(storedName);
  if (storedRace) setPlayerRace(storedRace);

  updateHUD();
  loadTabContent('home');
  initBotAI();
  showMessage(`Bun venit, ${storedName} al rasei ${storedRace}!`, 'success');
});
