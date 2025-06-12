import { gameState, saveGame } from './game-state.js';
import { showMessage, loadComponent } from './main.js';
import { scoutPlayers } from './transfers.js';
import { renegotiateContracts } from './team.js';
import { initializeSeason } from './matches.js';

export function renderOffseason() {
  const days = document.getElementById('offseason-days');
  const activities = document.getElementById('offseason-activities');
  if (days) {
    days.textContent = gameState.season.offseasonDays;
  }
  if (activities) {
    activities.innerHTML = `
      <button id="play-friendly">Meci amical</button>
      <button id="train-intensive">Antrenament intensiv</button>
      <button id="scout-players">Scouting</button>
      <button id="upgrade-facility">Upgrade facilități</button>
      <button id="renegotiate-contracts">Renegociază contracte</button>
      <button id="sign-sponsor">Semnează sponsor</button>
      <button id="fan-event">Eveniment fani</button>
      <button id="plan-season">Planificare sezon</button>
    `;
    // Adăugăm event listeners
    document.getElementById('play-friendly')?.addEventListener('click', playFriendly);
    document.getElementById('train-intensive')?.addEventListener('click', trainIntensively);
    document.getElementById('scout-players')?.addEventListener('click', scoutPlayers);
    document.getElementById('upgrade-facility')?.addEventListener('click', () => loadComponent('team', 'components/team.html'));
    document.getElementById('renegotiate-contracts')?.addEventListener('click', renegotiateContracts);
    document.getElementById('sign-sponsor')?.addEventListener('click', signSponsor);
    document.getElementById('fan-event')?.addEventListener('click', fanEvent);
    document.getElementById('plan-season')?.addEventListener('click', planSeason);
    
    activities.querySelectorAll('button').forEach(btn => {
      btn.disabled = gameState.season.activitiesUsed >= 4 || gameState.season.offseasonDays <= 0;
    });
  }
}

export function playFriendly() {
  if (gameState.season.phase !== 'offseason' || gameState.season.activitiesUsed >= 4 || gameState.season.offseasonDays <= 0) {
    showMessage('Nu poți juca amicale acum sau limită atinsă!', 'error');
    return;
  }
  if (gameState.club.energy >= 50) {
    gameState.club.energy -= 50;
    gameState.players.forEach(p => {
      p.morale = Math.min(p.morale + 10, 100);
      if (p.rating < 70 && Math.random() < 0.3) {
        p.rating += Math.floor(Math.random() * 5) + 1;
      }
    });
    gameState.club.budget += 100000;
    gameState.season.activitiesUsed += 1;
    gameState.season.offseasonDays = Math.max(0, gameState.season.offseasonDays - 1);
    saveGame();
    showMessage('Meci amical jucat! Moral +10, venit +100K €!', 'success');
    renderOffseason();
    checkOffseasonEnd();
  } else {
    showMessage('Energie insuficientă!', 'error');
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
      p.rating = Math.min(p.rating + Math.floor(Math.random() * 5) + 1 + gameState.club.facilities.training.effect, 90);
      p.stamina = Math.max(p.stamina - 10, 50);
    });
    gameState.season.activitiesUsed += 1;
    gameState.season.offseasonDays = Math.max(0, gameState.season.offseasonDays - 1);
    saveGame();
    showMessage('Antrenament intensiv! Rating jucători îmbunătățit!', 'success');
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
    const labels = [
      `Loc 1-${gameState.club.division === 6 ? 5 : 4} în Divizia ${gameState.club.division}`,
      'Câştigă Cupa Galactică',
      'Creşte rating-ul mediu al lotului la 70'
    ];
    const label = labels[Math.floor(Math.random() * labels.length)];
    gameState.labels = label;
    gameState.season.activitiesUsed += 1;
    gameState.season.offseasonDays = Math.max(0, gameState.season.offseasonDays - 1);
    saveGame();
    showMessage(`Obiectiv sezon nou: ${label}! Bonus 1M € dacă reuşeşti`, 'success');
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

window.playFriendly = playFriendly;
window.trainIntensively = trainIntensively;
window.signSponsor = signSponsor;
window.fanEvent = fanEvent;
window.planSeason = planSeason;
