// public/js/game-state.js

import { uuidv4 } from './uuid.js';

const STORAGE_KEY = 'gameState';

export function initialState() {
  return {
    isGameStarted: false,
    coach: {},
    club: {},
    players: [],
    divisions: [],
    currentDivision: 1,
    currentDay: 1,
    currentFormation: '4-4-2',
    currentMentality: 'balanced',
    teamFormation: {}
  };
}

export function getGameState() {
  const state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialState();
  ensureUserTeamInDivision(state);
  return state;
}

export function updateGameState(state) {
  saveGameState(state);
}

export function saveGameState(state = getGameState()) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetGameState() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

/**
 * Asigură că echipa userului există în divizia curentă
 */
function ensureUserTeamInDivision(state) {
  if (!state.isGameStarted) return;
  const userClub = state.club;
  const div = state.divisions[state.currentDivision - 1];
  if (!div) return;
  const alreadyIn = div.teams.some(t => t.id === userClub.id);
  if (!alreadyIn) {
    div.teams.unshift({
      id: userClub.id,
      name: userClub.name,
      emblemUrl: userClub.emblemUrl,
      stats: { played: 0, won: 0, draw: 0, lost: 0, pts: 0 }
    });
  }
}

/**
 * Generează o ligă cu echipe, jucători și program
 */
export function generateLeagueSystem(state) {
  const div = {
    level: 1,
    teams: [],
    schedule: []
  };

  // Generează echipe fictive
  for (let i = 1; i <= 9; i++) {
    div.teams.push({
      id: uuidv4(),
      name: `Echipa ${i}`,
      emblemUrl: `img/emblems/emblem${i}.png`,
      stats: { played: 0, won: 0, draw: 0, lost: 0, pts: 0 }
    });
  }

  // Clubul userului se adaugă automat prin ensureUserTeamInDivision

  // Calendar simplu: fiecare echipă joacă cu celelalte o dată
  const fixtures = [];
  for (let i = 0; i < div.teams.length; i++) {
    for (let j = i + 1; j < div.teams.length; j++) {
      fixtures.push({ homeId: div.teams[i].id, awayId: div.teams[j].id });
    }
  }

  // Shuffle și grupează pe zile (ex: 4 meciuri / zi)
  shuffleArray(fixtures);
  const days = [];
  while (fixtures.length > 0) {
    days.push(fixtures.splice(0, 4));
  }
  div.schedule = days;

  state.divisions = [div];
  state.currentDivision = 1;
  state.currentDay = 1;
}

/**
 * Generează jucători pentru clubul utilizatorului
 */
export function generateInitialPlayers(state) {
  const POSITIONS = ['GK', 'RB', 'CB', 'CB', 'LB', 'RM', 'CM', 'CM', 'LM', 'ST', 'ST'];
  state.players = POSITIONS.map((pos, i) => {
    const name = generateFakeName();
    const overall = 60 + Math.floor(Math.random() * 21); // 60–80
    const stars = Math.ceil(overall / 20); // 1–5
    return {
      id: uuidv4(),
      name,
      initials: name.split(' ').map(p => p[0]).join(''),
      position: pos,
      overall,
      potential: overall + Math.floor(Math.random() * 10),
      stars,
      age: 18 + Math.floor(Math.random() * 10),
      morale: 'normal',
      onPitch: false
    };
  });
}

/**
 * Returnează clasamentul sortat după puncte
 */
export function calculateStandings(division) {
  return [...division.teams].sort((a, b) => b.stats.pts - a.stats.pts);
}

/** Helper pentru amestecare array */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/** Nume fictive simple */
function generateFakeName() {
  const first = ['Andrei', 'Mihai', 'Ion', 'Alex', 'Cristian', 'Darius', 'Robert'];
  const last = ['Popescu', 'Ionescu', 'Georgescu', 'Petrescu', 'Dumitrescu', 'Stan'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}
