// public/js/game-state.js

import { generateInitialPlayers } from './player-generator.js';

// Structură minimă de stocare a starelor
const defaultState = {
  isGameStarted: false,
  coach: { nickname: '', reputation: 0, experience: 0 },
  club: { name: '', emblemUrl: '', funds: 0, reputation: 0 },
  players: [],          // doar jucătorii echipei tale
  currentSeason: 1,
  currentDay: 1,
  currentDivision: 10,  // porneşti în divizia 10
  divisions: []         // va conţine doar teams + schedule referenţial
};

let state = { ...defaultState };

// Încarcă din localStorage (încearcă)
try {
  const saved = localStorage.getItem('gameState');
  if (saved) state = JSON.parse(saved);
} catch {
  localStorage.removeItem('gameState');
}

// Exportează accesoriile
export function getGameState() { return state; }
export function saveGameState() {
  try {
    localStorage.setItem('gameState', JSON.stringify(state));
  } catch (e) {
    console.error('Nu am putut salva în localStorage (quota)?', e);
  }
}
export function updateGameState(patch) {
  state = { ...state, ...patch };
  saveGameState();
}
export function resetGameState() {
  localStorage.removeItem('gameState');
  location.reload();
}


// --- League System & Schedule ---

// Generator ID-uri de echipe
function makeTeam(d, i) {
  const code = String(i).padStart(2, '0');
  return {
    id: `D${d}-T${code}`,
    name: `FC ${['Cosmos','Stars','Nova','Orbit','Quasar'][i%5]}`,
    emblemUrl: `img/emblems/emblema${code}.png`,
    stats: { played:0, won:0, draw:0, lost:0, pts:0 }
  };
}

// Generăm calendar referențial (doar ID-uri)
function generateSchedule(teams) {
  const arr = [...teams];
  if (arr.length % 2) arr.push(null);
  const rounds = [];
  const n = arr.length;
  for (let r = 0; r < n - 1; r++) {
    const fixtures = [];
    for (let i = 0; i < n/2; i++) {
      const a = arr[i], b = arr[n - 1 - i];
      if (a && b) {
        fixtures.push({ homeId: a.id, awayId: b.id });
      }
    }
    rounds.push(fixtures);
    // rotire
    arr.splice(1, 0, arr.pop());
  }
  return rounds; // array of rounds, each round = [ {homeId,awayId}, ... ]
}

// Construieşte diviziile, echipe şi calendar
export function generateLeagueSystem() {
  const NUM_DIV = 10, TEAMS = 16;
  const divs = [];
  for (let d = 1; d <= NUM_DIV; d++) {
    const teams = [];
    for (let i = 1; i <= TEAMS; i++) {
      teams.push(makeTeam(d, i));
    }
    const schedule = generateSchedule(teams);
    divs.push({ level: d, teams, schedule });
  }
  return divs;
}


// --- Standings & Season End ---

export function calculateStandings(division) {
  return [...division.teams].sort((A, B) => {
    const dPts = B.stats.pts - A.stats.pts;
    if (dPts) return dPts;
    const gdA = A.stats.won - A.stats.lost;
    const gdB = B.stats.won - B.stats.lost;
    return gdB - gdA;
  });
}

export function finalizeSeason() {
  // eventual logică promovări etc.
  state.currentSeason++;
  state.currentDay = 1;
  saveGameState();
}


// --- Match Simulation ---

export function simulateMatch(homeTeam, awayTeam) {
  const maxG = 5;
  const gh = Math.floor(Math.random() * (maxG + 1));
  const ga = Math.floor(Math.random() * (maxG + 1));

  // update stats
  homeTeam.stats.played++;
  awayTeam.stats.played++;
  if (gh > ga) {
    homeTeam.stats.won++; homeTeam.stats.pts += 3;
    awayTeam.stats.lost++;
  } else if (gh < ga) {
    awayTeam.stats.won++; awayTeam.stats.pts += 3;
    homeTeam.stats.lost++;
  } else {
    homeTeam.stats.draw++; awayTeam.stats.draw++;
    homeTeam.stats.pts++; awayTeam.stats.pts++;
  }
  return { gh, ga };
}

export function simulateDay() {
  const dayIndex = state.currentDay - 1;
  state.divisions.forEach(div => {
    const fixtures = div.schedule[dayIndex] || [];
    fixtures.forEach(({ homeId, awayId }) => {
      const home = div.teams.find(t => t.id === homeId);
      const away = div.teams.find(t => t.id === awayId);
      simulateMatch(home, away);
    });
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
