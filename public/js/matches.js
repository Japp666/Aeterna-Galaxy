import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';
import { calculateMatchOutcome, generateRandomName } from './utils.js';

export function initializeSeason() {
  if (!gameState.season.teams || gameState.season.teams.length === 0) {
    gameState.season.teams = generateTeams();
    gameState.season.matches = generateSeasonSchedule();
    gameState.season.currentMatchDay = 1;
    gameState.season.standings = gameState.season.teams.map(team => ({
      name: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      points: 0,
    }));
  }
  saveGame();
}

export function renderMatches() {
  const content = document.getElementById('matches-content');
  if (!content) return;

  const currentMatchDay = gameState.season.currentMatchDay;
  const matches = gameState.season.matches.filter(m => m.matchDay === currentMatchDay);

  content.innerHTML = `
    <h2>Zona ${currentMatchDay}</h2>
    <div class="matches-list">
      ${matches.map(match => `
        <div class="match-card">
          <p>${match.home} vs ${match.away}</p>
          <p>Stadion: ${match.home}</p>
          ${match.result ? `<p>Rezultat: ${match.result.homeGoals} - ${match.result.awayGoals}</p>` : ''}
          ${!match.result && match.home === gameState.club.name ? `
            <button id="simulate-match-${match.id}" class="button">Simulează meci</button>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;

  matches.forEach(match => {
    if (!match.result && match.home === gameState.club.name) {
      const button = document.getElementById(`simulate-match-${match.id}`);
      button?.addEventListener('click', () => simulateMatch(match.id));
    }
  });
}

export function simulateMatch(matchId) {
  const match = gameState.season.matches.find(m => m.id === matchId);
  if (!match || match.result) return;

  const homeTeam = gameState.season.teams.find(t => t.name === match.home);
  const awayTeam = gameState.season.teams.find(t => t.name === match.away);
  const outcome = calculateMatchOutcome(homeTeam.rating, awayTeam.rating);

  let homeGoals = Math.floor(Math.random() * 4);
  let awayGoals = Math.floor(Math.random() * 4);
  if (outcome === 'win') {
    homeGoals = Math.max(homeGoals, awayGoals + 1);
  } else if (outcome === 'loss') {
    awayGoals = Math.max(awayGoals, homeGoals + 1);
  } else {
    homeGoals = awayGoals;
  }

  match.result = { homeGoals, awayGoals };
  updateStandings(match);
  updateClubStats(match);
  gameState.gameDate = new Date(gameState.gameDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Avansăm o săptămână
  checkEndOfMatchDay();

  saveGame();
  renderMatches();
  showMessage(`Meci simulat: ${match.home} ${homeGoals} - ${awayGoals} ${match.away}`, 'success');
}

function updateStandings(match) {
  const homeStanding = gameState.season.standings.find(s => s.name === match.home);
  const awayStanding = gameState.season.standings.find(s => s.name === match.away);
  const { homeGoals, awayGoals } = match.result;

  homeStanding.played++;
  awayStanding.played++;

  if (homeGoals > awayGoals) {
    homeStanding.won++;
    homeStanding.points += 3;
    awayStanding.lost++;
  } else if (awayGoals > homeGoals) {
    awayStanding.won++;
    awayStanding.points += 3;
    homeStanding.lost++;
  } else {
    homeStanding.drawn++;
    awayStanding.drawn++;
    homeStanding.points++;
    awayStanding.points++;
  }
}

function updateClubStats(match) {
  if (match.home === gameState.club.name || match.away === gameState.club.name) {
    const isHome = match.home === gameState.club.name;
    const goalsFor = isHome ? match.result.homeGoals : match.result.awayGoals;
    const goalsAgainst = isHome ? match.result.awayGoals : match.result.homeGoals;
    const outcome = goalsFor > goalsAgainst ? 'win' : goalsFor < goalsAgainst ? 'loss' : 'draw';

    gameState.club.fans += outcome === 'win' ? 500 : outcome === 'draw' ? 100 : -200;
    gameState.club.fans = Math.max(0, gameState.club.fans);
    gameState.club.budget += gameState.club.facilities.stadium.capacity * 10;
    gameState.players.forEach(p => {
      p.stamina = Math.max(0, p.stamina - 10);
      p.morale += outcome === 'win' ? 10 : outcome === 'draw' ? 0 : -10;
      p.morale = Math.min(100, Math.max(0, p.morale));
    });
  }
}

function checkEndOfMatchDay() {
  const currentMatchDay = gameState.season.currentMatchDay;
  const matches = gameState.season.matches.filter(m => m.matchDay === currentMatchDay);
  if (matches.every(m => m.result)) {
    gameState.season.currentMatchDay++;
    if (gameState.season.currentMatchDay > 30) {
      gameState.season.phase = 'offseason';
      gameState.season.offseasonDays = 60;
    }
  }
}

function generateTeams() {
  const teamCount = 16;
  const teams = [{ name: gameState.club.name, rating: calculateTeamRating() }];
  while (teams.length < teamCount) {
    const name = generateRandomName();
    if (!teams.find(t => t.name === name)) {
      teams.push({ name, rating: Math.floor(Math.random() * 20) + 50 });
    }
  }
  return teams;
}

function generateSeasonSchedule() {
  const teams = gameState.season.teams;
  const matches = [];
  let id = 1;

  for (let matchDay = 1; matchDay <= 30; matchDay++) {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length; i += 2) {
      matches.push({
        id: id++,
        matchDay,
        home: shuffled[i].name,
        away: shuffled[i + 1].name,
        result: null,
      });
    }
  }
  return matches;
}

function calculateTeamRating() {
  return Math.floor(gameState.players.reduce((sum, p) => sum + p.rating, 0) / gameState.players.length) || 50;
}
