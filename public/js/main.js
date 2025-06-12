import { gameState, persistentState, saveGame, loadGame } from './game-state.js';
import { generateEmblem, generateTeamName, generatePlayer, hashString } from './utils.js';
import { initializeMarket } from './transfers.js';
import { initializeSeason } from './matches.js';
import { updateStandings } from './standings.js';

document.addEventListener('DOMContentLoaded', () => {
  loadGame();
  if (!persistentState.coach.name) {
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
    persistentState.coach.name = coachName;
    persistentState.club.name = clubName;
    persistentState.club.emblemSeed = hashString(clubName + 6);
    persistentState.players = Array.from({ length: 18 }, () => generatePlayer(6));
    transientState.teams = generateAITeams();
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
  document.getElementById('club-logo').src = generateEmblem(persistentState.club.name, persistentState.club.division, persistentState.club.emblemSeed);
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
  document.getElementById('budget').textContent = `Buget: ${persistentState.club.budget.toLocaleString()} €`;
  document.getElementById('energy').textContent = `Energie: ${persistentState.club.energy}`;
  document.getElementById('date').textContent = `Data: ${persistentState.gameDate.toLocaleDateString('ro-RO')}`;
  document.getElementById('division').textContent = `Divizia: ${persistentState.club.division}`;
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
    const numTeams = div === 6 ? 31 : 15;
    for (let i = 0; i < numTeams; i++) {
      const name = generateTeamName();
      if (name !== persistentState.club.name) {
        teams.push({
          name,
          division: div,
          emblem: generateEmblem(name, div),
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
