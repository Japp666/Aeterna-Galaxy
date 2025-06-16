import { gameState, saveGame, initializeGame } from './game-state.js';
import { renderTeam } from './team.js';
import { renderOffseason } from './offseason.js';
import { renderMatches, initializeSeason } from './matches.js';
import { renderTransfers, initializeMarket } from './transfers.js';
import { renderStandings } from './standings.js';
import { generateEmblemFromParams, generateEmblemParams } from './utils.js';

export function initializeApp() {
  const setup = document.getElementById('setup');
  const app = document.getElementById('app');
  if (!setup || !app) {
    console.error('Elementele #setup sau #app lipsesc din DOM');
    return;
  }

  // Verificăm dacă jocul este inițializat
  if (gameState.coach && gameState.club && gameState.gameDate instanceof Date) {
    setup.style.display = 'none';
    app.style.display = 'block';
    renderGame();
  } else {
    setup.style.display = 'block';
    app.style.display = 'none';
  }
}

export function renderGame() {
  const app = document.getElementById('app');
  if (!app) return;

  // Formatăm data manual dacă gameDate este invalid
  const formattedDate = gameState.gameDate instanceof Date && !isNaN(gameState.gameDate)
    ? gameState.gameDate.toLocaleDateString('ro-RO')
    : 'N/A';

  app.innerHTML = `
    <header>
      <img id="club-logo" src="${gameState.club?.emblem || 'default-logo.png'}" alt="Club Logo" width="50" height="50"/>
      <div class="hud">
        <span>Buget: ${gameState.club?.budget?.toLocaleString() || '0'} €</span>
        <span>Energie: ${gameState.club?.energy || '0'}</span>
        <span>Fani: ${gameState.club?.fans?.toLocaleString() || '0'}</span>
        <span>Data: ${formattedDate}</span>
        <span>Antrenor: ${gameState.coach?.name || 'N/A'}</span>
      </div>
    </header>
    <nav id="nav-tabs">
      <button id="tab-matches">Meciuri</button>
      <button id="tab-team">Echipă</button>
      <button id="tab-transfers">Transferuri</button>
      <button id="tab-standings">Clasament</button>
      ${gameState.season?.phase === 'offseason' ? '<button id="tab-offseason">Pauză</button>' : ''}
    </nav>
    <main id="content"></main>
  `;

  document.getElementById('tab-matches')?.addEventListener('click', () => loadComponent('matches', 'components/matches.html'));
  document.getElementById('tab-team')?.addEventListener('click', () => loadComponent('team', 'components/team.html'));
  document.getElementById('tab-transfers')?.addEventListener('click', () => loadComponent('transfers', 'components/transfers.html'));
  document.getElementById('tab-standings')?.addEventListener('click', () => loadComponent('standings', 'components/standings.html'));
  document.getElementById('tab-offseason')?.addEventListener('click', () => loadComponent('offseason', 'components/offseason.html'));

  loadComponent('matches', 'components/matches.html');
}

export async function loadComponent(component, file) {
  const content = document.getElementById('content');
  if (!content) return;

  try {
    const response = await fetch(file);
    content.innerHTML = await response.text();
    switch (component) {
      case 'matches':
        renderMatches();
        break;
      case 'team':
        renderTeam();
        break;
      case 'transfers':
        renderTransfers();
        break;
      case 'standings':
        renderStandings();
        break;
      case 'offseason':
        renderOffseason();
        break;
    }
  } catch (error) {
    console.error(`Eroare la încărcarea componentei ${component}:`, error);
    content.innerHTML = '<p>Eroare la încărcarea conținutului.</p>';
  }
}

export function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 3000);
}

export function submitCoach() {
  const coachName = document.getElementById('coach-name')?.value;
  const clubName = document.getElementById('club-name')?.value;
  const emblemParams = generateEmblemParams(clubName, 6);

  if (coachName && clubName) {
    gameState.coach = { name: coachName };
    gameState.club = {
      name: clubName,
      division: 6,
      budget: 100000,
      energy: 1000,
      fans: 1000,
      emblem: generateEmblemFromParams(emblemParams),
      facilities: {
        stadium: { level: 1, capacity: 10000, cost: 500000 },
        training: { level: 1, effect: 1, cost: 250000 },
        academy: { level: 1, youthRating: 50, cost: 300000 },
        recovery: { level: 1, recovery: 5, cost: 200000 },
      },
    };
    gameState.season = {
      phase: 'regular',
      currentDay: 1,
      offseasonDays: 0,
      activitiesUsed: 0,
      teams: [],
      matches: [],
      standings: [],
      currentMatchDay: 1,
    };
    gameState.gameDate = new Date(2025, 0, 1); // Asigurăm că gameDate este Date
    initializeGame();
    initializeMarket();
    initializeSeason();
    saveGame();
    document.getElementById('setup').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    renderGame();
  } else {
    showMessage('Completează toate câmpurile!', 'error');
  }
}

// Inițializăm aplicația la încărcare
initializeApp();
window.submitCoach = submitCoach;
