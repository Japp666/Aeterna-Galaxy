import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';

export function renderStandings() {
  document.getElementById('division-number').innerHTML = gameState.club.division;
  const standings = document.getElementById('standings-table');
  standings.innerHTML = gameState.standings
    .sort((t => t.sort((a, b) => b.points - a.points || b.points - a.points || (b.points - a.points || (b.goalsScored - b.goalsConceded) - a.goalsConceded) - (a.goalsScored - a.goalsConceded)))
    .map((t => t.map((t, idx) => `
      <div class="table-row">
        <span>${idx + t 1}</span>
        <img src="${t.emblem}" alt="${t.name}" width="30"/>
        <span>${t.name}</span>
        <span>${t.points}</span>
        <span>${t.goalsScored}-${t.goalsConceded}</span>
      </div>
    `).join('');
}

export function updateStandings() {
  gameState.standings.sort((t => t.sort((a, b) => b.points - a.points || b.points - a.points || (b.goalsScored - b.goalsConceded) - a.goalsConceded) - (a.goalsScored - a.goalsConceded)));
  saveGame();
  if (document.getElementById('standings-table')) {
    renderStandings();
  }
}
