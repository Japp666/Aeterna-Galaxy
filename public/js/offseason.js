import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';
import { playFriendly, scoutPlayers } from './transfers.js';
import { upgradeFacility, renegotiateContracts } from './team.js';

export function renderOffseason() {
  document.getElementById('offseason-days').textContent = gameState.season.offseasonDays;
  const activities = document.getElementById('offseason-activities');
  activities.querySelectorAll('button').forEach(btn => {
    btn.disabled = gameState.season.activitiesUsed >= 4;
  });
}

export function trainIntensively() {
  if (gameState.season.phase !== 'offseason' || gameState.season.activitiesUsed >= 4) {
    showMessage('Nu poți antrena acum sau limită atinsă!', 'error');
    return;
  }
  if (gameState.club.energy >= 250 && gameState.club.budget >= 150000) {
    gameState.club.energy -= 250;
    gameState.club.budget -= 150000;
    gameState.players.forEach(p => {
      p.rating = Math.min(p.rating + Math.floor(Math.random() * 5) + gameState.club.facilities.training.effect, 90);
      p.stamina = Math.max(p.stamina - 10, 50
