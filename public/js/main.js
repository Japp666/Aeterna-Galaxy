import { gameState, saveGame, loadGame } from './game-state.js';
import { generateEmblemParams, generateEmblemFromParams, generateTeamName, generatePlayer } from './utils.js';
import { initializeMarket } from './transfers.js';
import { initializeSeason } from './matches.js';
import { updateStandings } from './standings.js';

document.addEventListener('DOMContentLoaded', () => {
  loadGame();
  if (!gameState.coach.name) {
    loadComponent('coach-modal', 'components/coach-modal.html');
  } else {
    showMainInterface();
    loadComponent('team', 'components/team.html');
    updateHUD();
  }
});

export function submitCoach() {
  const coachName = document.getElementById('coach-name').value.trim();
  const clubName = document.getElementById('club-name').value.trim();
  if (coachName.length >= 1 && clubName.length >= 1) {
    gameState.coach.name = coachName;
    gameState.club.name = clubName;
    gameState.club.emblemParams = generateEmblemParams(clubName, 6);
    gameState.club.emblem = generateEmblemFromParams(gameState.club.emblemParams);
    gameState.players = Array.from({ length: 18 }, () => generatePlayer(6));
    gameState.teams = generateAITeams();
    initializeMarket();
    initializeSeason();
    updateStandings();
    saveGame();
    document.getElementById('content').innerHTML = '';
    showMainInterface();
    loadComponent('team', 'components/team.html');
    updateHUD();
  } else {
    showMessage('Numele trebuie să aibă cel puțin 1 caracter!', 'error');
  }
}

function showMainInterface() {
  const nav = document.getElementById('nav-tabs');
  nav.innerHTML = `
    <button onclick="loadComponent('team', 'components/team.html')">Echipă</button>
    <button onclick="loadComponent('transfers', 'components/transfers.html')">Transferuri</button>
    <button onclick="loadComponent('matches', 'components/matches.html')">Meciuri</button>
    <button onclick="loadComponent('standings', 'components/standings.html')">Clasament</button>
    ${gameState.season.phase === 'offseason' ? `<button onclick="loadComponent('offseason', 'components/offseason.html')">Pauză</button>` : ''}
  `;
  document.getElementById('club-logo').src = gameState.club.emblem;
}

export async function loadComponent(component, path) {
  const response = await fetch(path);
  const html = await response.text();
  document.getElementById('content').innerHTML = html;
  if (component === 'team') renderTeam();
  if (component === 'transfers') renderTransfers();
  if (component === 'matches') renderMatches();
  if (component === 'standings') renderStandings();
  if (component === 'offseason') renderOffseason();
}

function updateHUD() {
  document.getElementById('budget').textContent = `Buget: ${gameState.club.budget.toLocaleString()} €`;
  document.getElementById('energy').textContent = `Energie: ${gameState.club.energy}`;
  document.getElementById('date').textContent = `Data: ${gameState.gameDate.toLocaleDateString('ro-RO')}`;
  document.getElementById('division').textContent = `Divizia: ${gameState.club.division}`;
}

export function showMessage(text, type) {
  const message = document.getElementById('message');
  message.textContent = text;
  message.className = `message ${type}`;
  message.classList.remove('hidden');
  setTimeout(() => message.classList.add('hidden'), 3000);
}

function generateAITeams() {
  const teams = [];
  for (let div = 1; div <= 6; div++) {
    const numTeams = div === 6 ? 32 : 16;
    for (let i = 0; i < numTeams; i++) {
      const name = generateTeamName();
      if (name !== gameState.club.name) {
        const emblemParams = generateEmblemParams(name, div);
        teams.push({
          name,
          division: div,
          emblem: generateEmblemFromParams(emblemParams),
          players: Array.from({ length: 18 }, () => generatePlayer(div)),
          budget: getBudgetForDivision(div),
          points: 0,
          goalsScored: 0,
          goalsConceded: 0
        });
      }
    }
  }
  return teams;
}

function getBudgetForDivision(div) {
  return [50000000, 20000000, 10000000, 5000000, 1000000, 100000][div - 1] || 100000;
}

window.submitCoach = submitCoach;
window.loadComponent = loadComponent;
