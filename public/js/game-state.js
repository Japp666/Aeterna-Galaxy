// public/js/game-state.js

import { v4 as uuidv4 } from './uuid.js';

const STORAGE_KEY = 'gameState';

export function initialState() {
  return {
    isGameStarted: false,
    coach: {},
    club: {},
    players: [],
    divisions: [],    // populate în generateLeagueSystem()
    currentDivision: 1,
    currentDay: 1,
    currentFormation: '4-4-2',
    currentMentality: 'balanced',
    teamFormation: {}
  };
}

export function getGameState() {
  let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialState();
  ensureUserTeamInDivision(state);
  return state;
}

export function saveGameState(state = getGameState()) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetGameState() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

/** 
 * După încărcare, dacă clubul tău nu e în divizia 1, îl adaugă automat 
 */
function ensureUserTeamInDivision(state) {
  if (!state.isGameStarted) return;
  const div = state.divisions[0];
  if (!div) return;
  if (!div.teams.some(t => t.id === state.club.id)) {
    div.teams.push({
      id:   state.club.id,
      name: state.club.name,
      emblemUrl: state.club.emblemUrl,
      stats: { played:0, won:0, draw:0, lost:0, pts:0 },
      // optional: adaugă players sau alte atribute
    });
  }
}

/**
 * Aici e locul tău să generezi calendar, echipe, jucători etc.
 * Trebuie să populezi state.divisions = [{ level:1, teams:[...], schedule: [...] }, ...]
 */
export function generateLeagueSystem(state) {
  // ex: div1 cu 10 echipe, fiecare cu id,name,stats
  // ... după ce ai prima divizie completă, adaugă userTeam (ensureUserTeamInDivision se ocupă)
  // definește state.currentDivision și state.currentDay
}

/** Alte funcții: simulateDay, simulateSeason, calculateStandings etc. **/
