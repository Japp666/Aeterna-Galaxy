import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';

export function renderStandings() {
  const divisionNumber = document.getElementById('division-number');
  const standingsTable = document.getElementById('standings-table');
  
  if (!divisionNumber || !standingsTable) return;
  
  divisionNumber.textContent = gameState.club.division;
  standingsTable.innerHTML = gameState.standings
    .sort((a, b) => b.points - a.points || (b.goalsScored - b.goalsConceded) - (a.goalsScored - a.goalsConceded))
    .map((team, idx) => `
      <div class="table-row">
        <span>${idx + 1}</span>
        <img src="${team.emblem}" alt="${team.name}" width="30"/>
        <span>${team.name}</span>
        <span>${team.points}</span>
        <span>${team.goalsScored}-${team.goalsConceded}</span>
      </div>
    `).join('');
}

export function updateStandings() {
  gameState.standings.sort((a, b) => b.points - a.points || (b.goalsScored - b.goalsConceded) - (a.goalsScored - a.goalsConceded));
  saveGame();
  if (document.getElementById('standings-table')) {
    renderStandings();
  }
}
