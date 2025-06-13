import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';
import { renderMatches, initializeSeason } from './matches.js';

export function renderOffseason() {
  const content = document.getElementById('offseason-content');
  if (!content) return;

  const daysLeft = gameState.season.offseasonDays;
  const activitiesLeft = 3 - gameState.season.activitiesUsed;

  content.innerHTML = `
    <h2>Pauză competițională</h2>
    <p>Zile rămase: ${daysLeft}</p>
    <p>Activități disponibile: ${activitiesLeft}</p>
    ${activitiesLeft > 0 && daysLeft > 0 ? `
      <div class="offseason-actions">
        <button id="play-friendly" class="button">Meci amical</button>
        <button id="train-intensive" class="button">Antrenament intensiv</button>
        <button id="sign-sponsor" class="button">Semnează sponsor</button>
        <button id="fan-event" class="button">Eveniment fani</button>
      </div>
    ` : ''}
    ${daysLeft === 0 ? `
      <button id="start-season" class="button">Începe sezonul</button>
    ` : ''}
  `;

  if (activitiesLeft > 0 && daysLeft > 0) {
    document.getElementById('play-friendly')?.addEventListener('click', playFriendly);
    document.getElementById('train-intensive')?.addEventListener('click', trainIntensively);
    document.getElementById('sign-sponsor')?.addEventListener('click', signSponsor);
    document.getElementById('fan-event')?.addEventListener('click', fanEvent);
  }
  if (daysLeft === 0) {
    document.getElementById('start-season')?.addEventListener('click', startNewSeason);
  }
}

export function playFriendly() {
  if (gameState.season.activitiesUsed >= 3 || gameState.season.offseasonDays <= 0) return;

  gameState.season.activitiesUsed++;
  gameState.season.offseasonDays -= 10;
  gameState.club.budget += 50000;
  gameState.players.forEach(p => {
    p.morale = Math.min(100, p.morale + 5);
    p.stamina = Math.max(0, p.stamina - 5);
  });
  saveGame();
  renderOffseason();
  showMessage('Meci amical jucat! +50.000 € și moral crescut.', 'success');
}

export function trainIntensively() {
  if (gameState.season.activitiesUsed >= 3 || gameState.season.offseasonDays <= 0) return;

  gameState.season.activitiesUsed++;
  gameState.season.offseasonDays -= 10;
  gameState.players.forEach(p => {
    p.rating = Math.min(100, p.rating + 5);
    p.stamina = Math.max(0, p.stamina - 10);
  });
  saveGame();
  renderOffseason();
  showMessage('Antrenament intensiv! Rating crescut, stamina scăzută.', 'success');
}

export function signSponsor() {
  if (gameState.season.activitiesUsed >= 3 || gameState.season.offseasonDays <= 0) return;

  gameState.season.activitiesUsed++;
  gameState.season.offseasonDays -= 10;
  gameState.club.budget += 100000;
  saveGame();
  renderOffseason();
  showMessage('Sponsor semnat! +100.000 €', 'success');
}

export function fanEvent() {
  if (gameState.season.activitiesUsed >= 3 || gameState.season.offseasonDays <= 0) return;

  gameState.season.activitiesUsed++;
  gameState.season.offseasonDays -= 10;
  gameState.club.fans += 1000;
  gameState.players.forEach(p => {
    p.morale = Math.min(100, p.morale + 10);
  });
  saveGame();
  renderOffseason();
  showMessage('Eveniment cu fanii! +1.000 fani și moral crescut.', 'success');
}

function startNewSeason() {
  gameState.season.phase = 'regular';
  gameState.season.currentMatchDay = 1;
  gameState.season.activitiesUsed = 0;
  gameState.season.offseasonDays = 0;
  gameState.season.teams = [];
  gameState.season.matches = [];
  gameState.season.standings = [];
  initializeSeason();
  saveGame();
  renderMatches();
  showMessage('Sezon nou început!', 'success');
}
