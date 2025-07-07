// public/js/game-state.js

import { generateInitialPlayers } from './player-generator.js';

const defaultState = {
  isGameStarted: false,
  coach: { nickname: '', reputation: 0, experience: 0 },
  club: { name: '', emblemUrl: '', funds: 0, reputation: 0, facilitiesLevel: 0 },
  players: [],
  currentSeason: 1,
  currentDay: 1,
  currentFormation: '4-4-2',
  currentMentality: 'balanced',
  teamFormation: {},
  divisions: []
};

let state = { ...defaultState };

const saved = localStorage.getItem('gameState');
if (saved) {
  try { state = JSON.parse(saved); }
  catch (e) { console.error(e); resetGameState(); }
}

export function getGameState() { return state; }
export function updateGameState(patch) {
  state = { ...state, ...patch };
  saveGameState();
}
export function saveGameState() {
  localStorage.setItem('gameState', JSON.stringify(state));
}
export function resetGameState() {
  localStorage.removeItem('gameState');
  location.reload();
}

// --- Generare League + Schedule ---
export function generateLeagueSystem() {
  const NUM_DIV = 10, TEAMS = 16;
  const divisions = [];

  for (let d = 1; d <= NUM_DIV; d++) {
    const teams = [];
    for (let i = 1; i <= TEAMS; i++) {
      const code = String(i).padStart(2, '0');
      teams.push({
        id: `D${d}-T${code}`,
        name: `FC ${randomTeamName()}`,
        emblemUrl: `img/emblems/emblema${code}.png`,
        players: generateInitialPlayers(20),
        stats: { played: 0, won: 0, draw: 0, lost: 0, pts: 0 }
      });
    }
    // Generăm calendarul pe un singur tur (n-1 runde):
    const schedule = generateSchedule(teams);
    divisions.push({ level: d, teams, schedule });
  }

  return divisions;
}

// Round-robin generator (circle method)
function generateSchedule(teams) {
  const n = teams.length;
  const rounds = [];
  const arr = teams.slice();
  if (n % 2) arr.push(null); // bye if odd

  const half = arr.length / 2;
  for (let r = 0; r < arr.length - 1; r++) {
    const round = [];
    for (let i = 0; i < half; i++) {
      const t1 = arr[i], t2 = arr[arr.length - 1 - i];
      if (t1 && t2) round.push({ home: t1, away: t2 });
    }
    rounds.push(round);
    // rotate (fixăm arr[0]):
    arr.splice(1, 0, arr.pop());
  }

  return rounds; // array of days (rounds)
}

// --- Standings & Season End ---
export function calculateStandings(division) {
  return [...division.teams].sort((a, b) => {
    const dPts = b.stats.pts - a.stats.pts;
    if (dPts !== 0) return dPts;
    const gdA = a.stats.won - a.stats.lost;
    const gdB = b.stats.won - b.stats.lost;
    return gdB - gdA;
  });
}

export function finalizeSeason() {
  // ... (cod existent pentru promovări/retrogradări)
  // După finalizeSeason, generăm noul schedule:
  state.divisions.forEach(div => {
    div.schedule = generateSchedule(div.teams);
  });
  state.currentDay = 1;
  state.currentSeason++;
  saveGameState();
}

// --- Simulare Meciuri ---
export function simulateMatch(match) {
  // match: { home, away }
  const maxGoals = 5;
  const gh = Math.floor(Math.random() * (maxGoals + 1));
  const ga = Math.floor(Math.random() * (maxGoals + 1));

  // actualizăm statistici:
  match.home.stats.played++;
  match.away.stats.played++;
  if (gh > ga) {
    match.home.stats.won++;
    match.away.stats.lost++;
    match.home.stats.pts += 3;
  } else if (gh < ga) {
    match.away.stats.won++;
    match.home.stats.lost++;
    match.away.stats.pts += 3;
  } else {
    match.home.stats.draw++;
    match.away.stats.draw++;
    match.home.stats.pts += 1;
    match.away.stats.pts += 1;
  }

  return { homeGoals: gh, awayGoals: ga };
}

export function simulateDay() {
  const day = state.currentDay - 1;
  state.divisions.forEach(div => {
    const fixtures = div.schedule[day] || [];
    fixtures.forEach(match => simulateMatch(match));
  });
  state.currentDay++;
  saveGameState();
}

export function simulateSeason() {
  const totalDays = state.divisions[0].schedule.length;
  while (state.currentDay <= totalDays) {
    simulateDay();
  }
}
