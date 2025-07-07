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
  divisions: [],
  currentDivision: 10    // jucătorul începe în divizia a 10-a
};

let state = { ...defaultState };

const saved = localStorage.getItem('gameState');
if (saved) {
  try {
    state = JSON.parse(saved);
  } catch (e) {
    console.error('game-state.js: saved state invalid, resetting', e);
    resetGameState();
  }
}

export function getGameState() {
  return state;
}

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

/** Generează diviziile (10×16 echipe) */
export function generateLeagueSystem() {
  const NUM_DIV = 10;
  const TEAMS_PER_DIV = 16;
  const divisions = [];

  for (let d = 1; d <= NUM_DIV; d++) {
    const teams = [];
    for (let i = 1; i <= TEAMS_PER_DIV; i++) {
      const code = String(i).padStart(2, '0');
      teams.push({
        id: `D${d}-T${code}`,
        name: `FC ${randomTeamName()}`,
        emblemUrl: `img/emblems/emblema${code}.png`,
        players: generateInitialPlayers(20),
        stats: { played: 0, won: 0, draw: 0, lost: 0, pts: 0 }
      });
    }
    divisions.push({ level: d, teams });
  }

  return divisions;
}

/** Sortează echipele după puncte și goal difference */
export function calculateStandings(division) {
  return [...division.teams].sort((a, b) => {
    const dPts = b.stats.pts - a.stats.pts;
    if (dPts !== 0) return dPts;
    const gdA = a.stats.won - a.stats.lost;
    const gdB = b.stats.won - b.stats.lost;
    return gdB - gdA;
  });
}

/** Promovează/retrogradează și resetează statistici */
export function finalizeSeason() {
  // …logica de promovare/retrogradare (păstrează 16 echipe/divizie)…
  // După aceea:
  state.currentSeason += 1;
  state.currentDay = 1;
  saveGameState();
}

/** Simulează un meci simplu */
export function simulateMatch(match) {
  const maxGoals = 5;
  const gh = Math.floor(Math.random() * (maxGoals + 1));
  const ga = Math.floor(Math.random() * (maxGoals + 1));

  match.home.stats.played++;
  match.away.stats.played++;

  if (gh > ga) {
    match.home.stats.won++;
    match.home.stats.pts += 3;
    match.away.stats.lost++;
  } else if (gh < ga) {
    match.away.stats.won++;
    match.away.stats.pts += 3;
    match.home.stats.lost++;
  } else {
    match.home.stats.draw++;
    match.away.stats.draw++;
    match.home.stats.pts += 1;
    match.away.stats.pts += 1;
  }

  return { homeGoals: gh, awayGoals: ga };
}

/** Simulează toate meciurile zilei curente */
export function simulateDay() {
  const dayIdx = state.currentDay - 1;
  state.divisions.forEach(div => {
    const fixtures = div.schedule
      ? div.schedule[dayIdx] || []
      : [];
    fixtures.forEach(m => simulateMatch(m));
  });
  state.currentDay++;
  saveGameState();
}

/** Simulează sezonul întreg */
export function simulateSeason() {
  const totalDays = state.divisions[0].schedule
    ? state.divisions[0].schedule.length
    : 0;
  while (state.currentDay <= totalDays) {
    simulateDay();
  }
}

// helper random nume
function randomTeamName() {
  const pool = [
    'Cosmos','Stars','Galactic','Nebula',
    'Comet','Meteor','Nova','Orbit',
    'Astral','Eclipse','Pulsar','Quasar',
    'Supernova','Celestial','Solar','Lunar'
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}
