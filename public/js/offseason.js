import { gameState, saveGame } from './game-state.js';
import { showMessage, loadComponent } from './main.js';
import { playFriendly, scoutPlayers } from './matches.js';
import { upgradeFacility, renegotiateContracts } from './team.js';
import { initializeSeason } from './matches.js';

export function renderOffseason() {
  const days = document.getElementById('offseason-days');
  if (days) {
    days.textContent = gameState.season.offseasonDays;
  }
  const activities = document.getElementById('offseason-activities');
  if (activities) {
    activities.querySelectorAll('button').forEach(btn => {
      btn.disabled = gameState.season.activitiesUsed >= 4 || gameState.season.offseasonDays <= 0;
    });
  }
}

export function trainIntensively() {
  if (gameState.season.phase !== 'offseason' || gameState.season.activitiesUsed >= 4 || gameState.season.offseasonDays <= 0) {
    showMessage('Nu poți antrena acum sau limită atinsă!', 'error');
    return;
  }
  if (gameState.club.energy >= 250 && gameState.club.budget >= 150000) {
    gameState.club.energy -= 250;
    gameState.club.budget -= 150000;
    gameState.players.forEach(p => {
      p.rating = Math.min(p.rating + Math.floor(Math.random() * 5) + gameState.club.facilities.training.effect, 90);
      p.stamina = Math.max(p.stamina - 10, 50);
    });
    gameState.season.activitiesUsed += 1;
    gameState.season.offseasonDays = Math.max(0, gameState.season.offseasonDays - 1);
    saveGame();
    showMessage('Antrenament intensiv! Rating jucători crescut!', 'success');
    renderOffseason();
    checkOffseasonEnd();
  } else {
    showMessage('Buget sau energie insuficiente!', 'error');
  }
}

export function signSponsor() {
  if (gameState.season.phase !== 'offseason' || gameState.season.activitiesUsed >= 4 || gameState.season.offseasonDays <= 0) {
    showMessage('Nu poți semna sponsori acum sau limită atinsă!', 'error');
    return;
  }
  if (gameState.club.energy >= 100) {
    gameState.club.energy -= 100;
    const value = Math.floor(Math.random() * (gameState.club.division === 1 ? 5000000 : 1000000)) + 1000000;
    gameState.club.budget += value;
    gameState.season.activitiesUsed += 1;
    gameState.season.offseasonDays = Math.max(0, gameState.season.offseasonDays - 1);
    saveGame();
    showMessage(`Ai semnat un sponsor de ${value.toLocaleString()} €!`, 'success');
    renderOffseason();
    checkOffseasonEnd();
  } else {
    showMessage('Energie insuficientă!', 'error');
  }
}

export function fanEvent() {
  if (gameState.season.phase !== 'offseason' || gameState.season.activitiesUsed >= 4 || gameState.season.offseasonDays <= 0) {
    showMessage('Nu poți organiza evenimente acum sau limită atinsă!', 'error');
    return;
  }
  if (gameState.club.energy >= 100 && gameState.club.budget >= 150000) {
    gameState.club.energy -= 100;
    gameState.club.budget -= 150000;
    gameState.club.fans += 750;
    gameState.season.activitiesUsed += 1;
    gameState.season.offseasonDays = Math.max(0, gameState.season.offseasonDays - 1);
    saveGame();
    showMessage('Eveniment fani organizat! +750 fani!', 'success');
    renderOffseason();
    checkOffseasonEnd();
  } else {
    showMessage('Buget sau energie insuficiente!', 'error');
  }
}

export function planSeason() {
  if (gameState.season.phase !== 'offseason' || gameState.season.activitiesUsed >= 4 || gameState.season.offseasonDays <= 0) {
    showMessage('Nu poți planifica acum sau limită atinsă!', 'error');
    return;
  }
  if (gameState.club.energy >= 50) {
    gameState.club.energy -= 50;
    const objectives = [
      `Loc 1-${gameState.club.division === 6 ? 5 : 4} în Divizia ${gameState.club.division}`,
      'Câștigă Cupa Galactică',
      'Crește rating-ul mediu al lotului la 70'
    ];
    const objective = objectives[Math.floor(Math.random() * objectives.length)];
    gameState.season.activitiesUsed += 1;
    gameState.season.offseasonDays = Math.max(0, gameState.season.offseasonDays - 1);
    saveGame();
    showMessage(`Obiectiv sezon nou: ${objective}! Bonus 1M € dacă reușești.`, 'success');
    renderOffseason();
    checkOffseasonEnd();
  } else {
    showMessage('Energie insuficientă!', 'error');
  }
}

function checkOffseasonEnd() {
  if (gameState.season.offseasonDays <= 0) {
    gameState.season.phase = 'regular';
    gameState.season.currentDay = 1;
    gameState.season.activitiesUsed = 0;
    initializeSeason();
    saveGame();
    showMessage('Pauza s-a încheiat! Sezonul nou a început!', 'success');
    loadComponent('matches', 'components/matches.html');
  }
}

window.trainIntensively = trainIntensively;
window.signSponsor = signSponsor;
window.fanEvent = fanEvent;
window.planSeason = planSeason;
window.playFriendly = playFriendly;
window.scoutPlayers = scoutPlayers;
window.upgradeFacility = upgradeFacility;
window.renegotiateContracts = renegotiateContracts;
