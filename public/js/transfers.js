import { gameState, saveGame } from './game-state.js';
import { showMessage } from './main.js';
import { generatePlayer } from './utils.js';

export function initializeMarket() {
  gameState.transferMarket = Array.from({ length: 40 }, () => generatePlayer(gameState.club.division));
  saveGame();
}

export function renderTransfers() {
  const market = document.getElementById('transfer-market');
  if (!market) return;

  market.innerHTML = gameState.transferMarket.map(p => `
    <div class="player-card">
      <span>${p.name}</span>
      <span>${p.position}</span>
      <span>Rating: ${p.rating}</span>
      <span>Preț: ${p.price.toLocaleString()} €</span>
      <span>Salariu: ${p.salary.toLocaleString()} €</span>
      <button class="buy-player" data-id="${p.id}" ${gameState.club.budget < p.price || gameState.club.energy < 50 ? 'disabled' : ''}>Cumpără</button>
    </div>
  `).join('');

  // Adăugăm event listeners pentru butoane
  document.querySelectorAll('.buy-player').forEach(button => {
    button.addEventListener('click', () => {
      const playerId = button.dataset.id;
      buyPlayer(playerId);
    });
  });
}

export function buyPlayer(playerId) {
  const player = gameState.transferMarket.find(p => p.id == playerId);
  if (!player) {
    showMessage('Jucător nu mai este disponibil!', 'error');
    return;
  }
  if (gameState.club.budget >= player.price && gameState.club.energy >= 50) {
    gameState.club.budget -= player.price;
    gameState.club.energy -= 50;
    gameState.players.push(player);
    gameState.transferMarket = gameState.transferMarket.filter(p => p.id != playerId);
    saveGame();
    showMessage(`Jucător ${player.name} cumpărat!`, 'success');
    renderTransfers();
  } else {
    showMessage('Buget sau energie insuficiente!', 'error');
  }
}

export function refreshMarket() {
  gameState.transferMarket = gameState.transferMarket.filter(p => Math.random() > 0.5);
  const newPlayers = Array.from({ length: 40 - gameState.transferMarket.length }, () => generatePlayer(gameState.club.division));
  gameState.transferMarket.push(...newPlayers);
  saveGame();
  if (document.getElementById('transfer-market')) {
    renderTransfers();
  }
}

export function scoutPlayers() {
  if (gameState.season.phase !== 'offseason' || gameState.season.activitiesUsed >= 4) {
    showMessage('Nu poți scana acum sau limită atinsă!', 'error');
    return;
  }
  if (gameState.club.energy >= 300 && gameState.club.budget >= 250000) {
    gameState.club.energy -= 300;
    gameState.club.budget -= 250000;
    const numPlayers = Math.floor(Math.random() * 6) + 7;
    const newPlayers = Array.from({ length: numPlayers }, () => {
      const p = generatePlayer(gameState.club.division);
      p.rating = Math.min(p.rating + 10, 90);
      return p;
    });
    gameState.transferMarket.push(...newPlayers);
    gameState.season.activitiesUsed += 1;
    gameState.season.offseasonDays = Math.max(0, gameState.season.offseasonDays - 1);
    saveGame();
    showMessage(`Scouting complet! ${numPlayers} jucători noi disponibili.`, 'success');
    renderTransfers();
  } else {
    showMessage('Buget sau energie insuficiente!', 'error');
  }
}
